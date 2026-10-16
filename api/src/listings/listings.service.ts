import { unlink } from 'fs/promises';
import { basename, join } from 'path';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListingStatus, Prisma, Role, SaleStep } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { AuthUser } from '../auth/auth.types';
import { catalogDeviceType } from '../catalog/catalog';
import { displayValue, validateFields } from '../catalog/validate-fields';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto, UpdateListingDto } from './dto/create-listing.dto';
import { normalizeUploadedPhoto, photoMimeExtensions } from './photo-upload';
import { offerWindowHours } from '../offers/offer-terms';
import { nextSaleStep, saleView } from './sale-steps';
import { uploadDir } from '../uploads/upload-path';

type UploadedPhoto = {
  filename: string;
  mimetype: string;
  path: string;
};

const adminInclude = {
  category: true,
  deviceType: true,
  photos: { orderBy: { sortOrder: 'asc' as const } },
  offers: { orderBy: { price: 'desc' as const }, take: 1, select: { price: true } },
  user: { select: { id: true, name: true, email: true } },
  _count: { select: { offers: true } },
} satisfies Prisma.ListingInclude;

const listingInclude = {
  category: true,
  deviceType: true,
  photos: { orderBy: { sortOrder: 'asc' as const } },
  offers: { orderBy: { price: 'desc' as const }, take: 1, select: { price: true } },
  _count: { select: { offers: true } },
} satisfies Prisma.ListingInclude;

type ListingRecord = Prisma.ListingGetPayload<{ include: typeof listingInclude }>;

@Injectable()
export class ListingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  mine(user: AuthUser) {
    return this.prisma.listing
      .findMany({
        where: { userId: user.id },
        include: listingInclude,
        orderBy: { createdAt: 'desc' },
      })
      .then((rows) => rows.map((row) => this.toResponse(row)));
  }

  async one(user: AuthUser, id: string) {
    const listing = await this.findOwned(user, id);
    return this.toResponse(listing);
  }

  async create(user: AuthUser, dto: CreateListingDto) {
    const data = await this.prepare(user, dto);
    const listing = await this.prisma.listing.create({
      data,
      include: listingInclude,
    });
    return this.toResponse(listing);
  }

  async submit(
    user: AuthUser,
    raw: { categoryId?: string; deviceTypeId?: string; specs?: string; condition?: string },
    files: UploadedPhoto[],
  ) {
    try {
      if (files.length < 2 || files.length > 5) {
        throw new BadRequestException('En az 2, en fazla 5 fotoğraf yükleyin.');
      }
      for (const file of files) {
        await normalizeUploadedPhoto(file);
      }
      if (files.some((file) => !photoMimeExtensions.has(file.mimetype))) {
        throw new BadRequestException('Fotoğraflar JPG, PNG veya WEBP olmalı.');
      }
      const data = await this.prepare(user, {
        categoryId: raw.categoryId ?? '',
        deviceTypeId: raw.deviceTypeId ?? '',
        specs: parseObject(raw.specs, 'Özellikler'),
        condition: parseObject(raw.condition, 'Durum'),
      });
      const listing = await this.prisma.listing.create({
        data: {
          ...data,
          photos: {
            create: files.map((file, index) => ({
              path: `/uploads/${file.filename}`,
              sortOrder: index,
            })),
          },
        },
        include: listingInclude,
      });
      return this.toResponse(listing);
    } catch (error) {
      await Promise.all(files.map((file) => unlink(file.path).catch(() => undefined)));
      throw error;
    }
  }

  async allForAdmin() {
    const rows = await this.prisma.listing.findMany({
      include: adminInclude,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.toAdminResponse(row));
  }

  async oneForAdmin(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: adminInclude,
    });
    if (!listing) {
      throw new NotFoundException('İlan bulunamadı.');
    }
    return this.toAdminResponse(listing);
  }

  async close(actor: AuthUser, id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('İlan bulunamadı.');
    if (listing.status === ListingStatus.kabul) {
      throw new BadRequestException('Kabul edilmiş satış kapatılmaz. Satış adımı panelden ilerler.');
    }
    if (listing.status === ListingStatus.kapatildi) {
      throw new BadRequestException('İlan zaten kapalı.');
    }
    const updated = await this.prisma.listing.update({
      where: { id: listing.id },
      data: { status: ListingStatus.kapatildi },
      include: adminInclude,
    });
    await this.audit.log(actor.id, 'listing.close', 'listing', listing.id, {
      title: listing.title,
    });
    return this.toAdminResponse(updated);
  }

  async update(user: AuthUser, id: string, dto: UpdateListingDto) {
    const listing = await this.findOwned(user, id);
    this.assertOpen(listing.status);
    const definition = catalogDeviceType(listing.deviceType.slug);
    if (!definition) throw new BadRequestException('Bu cihaz türü için form tanımlı değil.');
    const specs = validateFields(definition.specFields, dto.specs, 'Özellikler');
    const condition = validateFields(definition.conditionFields, dto.condition, 'Durum');
    const title = [displayValue(specs, 'marka'), displayValue(specs, 'model')]
      .filter((part): part is string => Boolean(part))
      .join(' ');
    const updated = await this.prisma.listing.update({
      where: { id: listing.id },
      data: { specs, condition, title: title || listing.deviceType.name },
      include: listingInclude,
    });
    await this.audit.log(user.id, 'listing.update', 'listing', listing.id, { title: updated.title });
    return this.toResponse(updated);
  }

  async advanceSale(actor: AuthUser, id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('İlan bulunamadı.');
    if (listing.status !== ListingStatus.kabul) {
      throw new BadRequestException('Satış durumu, kabul edilmiş ilanda ilerler.');
    }
    const current = listing.saleStep ?? SaleStep.teslimat;
    const next = nextSaleStep(current);
    if (!next) throw new BadRequestException('Satış zaten tamamlandı.');
    const updated = await this.prisma.listing.update({
      where: { id: listing.id },
      data: { saleStep: next },
      include: adminInclude,
    });
    const view = saleView(next);
    const currentLabel = view.steps.find((step) => step.key === next)?.label ?? 'Satış durumu';
    await this.prisma.notification.create({
      data: {
        userId: listing.userId,
        title: 'Satış durumu',
        body: currentLabel,
      },
    });
    await this.audit.log(actor.id, 'listing.sale', 'listing', listing.id, { step: next });
    return this.toAdminResponse(updated);
  }

  async cancel(user: AuthUser, id: string) {
    const listing = await this.findOwned(user, id);
    if (listing.status === ListingStatus.kabul) {
      throw new BadRequestException('Kabul edilmiş ilan iptal edilmez.');
    }
    if (listing.status === ListingStatus.kapatildi) {
      throw new BadRequestException('İlan zaten iptal edildi.');
    }
    const updated = await this.prisma.listing.update({
      where: { id: listing.id },
      data: { status: ListingStatus.kapatildi },
      include: listingInclude,
    });
    await this.audit.log(user.id, 'listing.cancel', 'listing', listing.id, { title: listing.title });
    return this.toResponse(updated);
  }

  async remove(user: AuthUser, id: string) {
    const listing = await this.findOwned(user, id);
    if (listing.status !== ListingStatus.bekliyor || listing._count.offers > 0) {
      throw new BadRequestException(
        'Teklif gelmiş ilanı yalnızca yönetici kapatabilir.',
      );
    }
    await this.prisma.listing.delete({ where: { id: listing.id } });
    await Promise.all(
      listing.photos.map((photo) =>
        unlink(join(uploadDir(), basename(photo.path))).catch(() => undefined),
      ),
    );
  }

  private assertOpen(status: ListingStatus) {
    if (status === ListingStatus.kabul) {
      throw new BadRequestException('Kabul edilmiş ilan düzenlenmez.');
    }
    if (status === ListingStatus.kapatildi) {
      throw new BadRequestException('İptal edilmiş ilan düzenlenmez.');
    }
  }

  private async prepare(user: AuthUser, dto: CreateListingDto) {
    if (user.role !== Role.customer) {
      throw new ForbiddenException('İlanı yalnızca müşteri hesabı açabilir.');
    }

    const deviceType = await this.prisma.deviceType.findUnique({
      where: { id: dto.deviceTypeId },
      include: { category: true },
    });
    if (!deviceType || deviceType.categoryId !== dto.categoryId) {
      throw new BadRequestException('Cihaz türü seçilen kategoriye ait değil.');
    }

    const definition = catalogDeviceType(deviceType.slug);
    if (!definition) {
      throw new BadRequestException('Bu cihaz türü için form tanımlı değil.');
    }

    const specs = validateFields(definition.specFields, dto.specs, 'Özellikler');
    const condition = validateFields(
      definition.conditionFields,
      dto.condition,
      'Durum',
    );
    const title = [displayValue(specs, 'marka'), displayValue(specs, 'model')]
      .filter((part): part is string => Boolean(part))
      .join(' ');

    return {
      userId: user.id,
      categoryId: deviceType.categoryId,
      deviceTypeId: deviceType.id,
      title: title || deviceType.name,
      specs,
      condition,
      status: ListingStatus.bekliyor,
    };
  }

  private async findOwned(user: AuthUser, id: string) {
    const listing = await this.prisma.listing.findFirst({
      where: { id, userId: user.id },
      include: listingInclude,
    });
    if (!listing) {
      throw new NotFoundException('İlan bulunamadı.');
    }
    return listing;
  }

  private toResponse(listing: ListingRecord) {
    return {
      id: listing.id,
      title: listing.title,
      status: listing.status,
      specs: listing.specs,
      condition: listing.condition,
      createdAt: listing.createdAt,
      category: {
        id: listing.category.id,
        name: listing.category.name,
        slug: listing.category.slug,
      },
      deviceType: {
        id: listing.deviceType.id,
        name: listing.deviceType.name,
        slug: listing.deviceType.slug,
      },
      photos: listing.photos.map((photo) => ({
        id: photo.id,
        path: photo.path,
        sortOrder: photo.sortOrder,
      })),
      offerCount: listing._count.offers,
      highestOffer: listing.offers[0] ? Number(listing.offers[0].price) : null,
      offerWindowEndsAt: new Date(listing.createdAt.getTime() + offerWindowHours * 60 * 60 * 1000),
      acceptedOfferId: listing.acceptedOfferId,
      sale: listing.status === ListingStatus.kabul ? saleView(listing.saleStep ?? SaleStep.teslimat) : null,
    };
  }

  private toAdminResponse(
    listing: Prisma.ListingGetPayload<{ include: typeof adminInclude }>,
  ) {
    return {
      ...this.toResponse(listing),
      customer: listing.user,
    };
  }
}

function parseObject(raw: string | undefined, label: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(raw ?? '');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('invalid');
    }
    return parsed as Record<string, unknown>;
  } catch {
    throw new BadRequestException(`${label} okunamadı.`);
  }
}
