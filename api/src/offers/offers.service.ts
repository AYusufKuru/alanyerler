import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListingStatus, Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { AuthUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto, UpdateOfferDto } from './dto/offer.dto';

const offerInclude = {
  store: { select: { id: true, name: true, city: true, active: true } },
} satisfies Prisma.OfferInclude;

type OfferRecord = Prisma.OfferGetPayload<{ include: typeof offerInclude }>;

function money(value: Prisma.Decimal) {
  return Number(value);
}

function toResponse(offer: OfferRecord) {
  return {
    id: offer.id,
    listingId: offer.listingId,
    price: money(offer.price),
    currency: offer.currency,
    note: offer.note,
    createdAt: offer.createdAt,
    updatedAt: offer.updatedAt,
    store: offer.store,
  };
}

function jsonLines(value: Prisma.JsonValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function cleanNote(note: string | undefined) {
  const text = note?.trim() ?? '';
  return text.length > 0 ? text : null;
}

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async forOwner(user: AuthUser, listingId: string) {
    this.assertUuid(listingId, 'İlan seçin.');
    const listing = await this.prisma.listing.findFirst({
      where: { id: listingId, userId: user.id },
    });
    if (!listing) throw new NotFoundException('İlan bulunamadı.');
    const rows = await this.prisma.offer.findMany({
      where: { listingId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            logo: true,
            cover: true,
            city: true,
            rating: true,
            reviewCount: true,
            badges: true,
          },
        },
      },
      orderBy: [{ price: 'desc' }, { createdAt: 'asc' }],
    });
    return rows.map((offer) => ({
      id: offer.id,
      price: money(offer.price),
      currency: offer.currency,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
      store: {
        id: offer.store.id,
        name: offer.store.name,
        logo: offer.store.logo,
        cover: offer.store.cover,
        city: offer.store.city,
        rating: offer.store.rating === null ? null : Number(offer.store.rating),
        reviewCount: offer.store.reviewCount,
        badges: jsonLines(offer.store.badges),
      },
    }));
  }

  async storeForOwner(user: AuthUser, storeId: string) {
    this.assertUuid(storeId, 'Mağaza seçin.');
    const offer = await this.prisma.offer.findFirst({
      where: { storeId, listing: { userId: user.id } },
      include: { store: true },
    });
    if (!offer) throw new NotFoundException('Mağaza bulunamadı.');
    const store = offer.store;
    return {
      id: store.id,
      name: store.name,
      logo: store.logo,
      cover: store.cover,
      city: store.city,
      address: store.address,
      about: store.about,
      hours: jsonLines(store.hours),
      badges: jsonLines(store.badges),
      rating: store.rating === null ? null : Number(store.rating),
      reviewCount: store.reviewCount,
    };
  }

  async forListing(listingId: string) {
    this.assertUuid(listingId, 'İlan seçin.');
    await this.findListing(listingId);
    const rows = await this.prisma.offer.findMany({
      where: { listingId },
      include: offerInclude,
      orderBy: [{ price: 'desc' }, { createdAt: 'asc' }],
    });
    return rows.map(toResponse);
  }

  async create(actor: AuthUser, dto: CreateOfferDto) {
    const listing = await this.findListing(dto.listingId);
    if (listing.status === ListingStatus.kapatildi) {
      throw new BadRequestException('Kapalı ilana teklif eklenmez.');
    }
    const store = await this.prisma.store.findUnique({ where: { id: dto.storeId } });
    if (!store) throw new NotFoundException('Mağaza bulunamadı.');
    const existing = await this.prisma.offer.findUnique({
      where: { listingId_storeId: { listingId: dto.listingId, storeId: dto.storeId } },
    });
    if (!store.active && !existing) {
      throw new BadRequestException('Pasif mağaza yeni teklife seçilemez.');
    }
    if (!store.active && existing) {
      throw new BadRequestException('Pasif mağazanın teklifini satırdan güncelleyin.');
    }
    const price = new Prisma.Decimal(dto.price);
    const note = cleanNote(dto.note);
    const offer = await this.prisma.$transaction(async (tx) => {
      const saved = existing
        ? await tx.offer.update({
            where: { id: existing.id },
            data: { price, note },
            include: offerInclude,
          })
        : await tx.offer.create({
            data: {
              listingId: dto.listingId,
              storeId: dto.storeId,
              price,
              note,
              createdBy: actor.id,
            },
            include: offerInclude,
          });
      if (listing.status === ListingStatus.bekliyor) {
        await tx.listing.update({
          where: { id: listing.id },
          data: { status: ListingStatus.teklif_var },
        });
      }
      if (!existing) {
        const amount = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(dto.price);
        await tx.notification.create({
          data: {
            userId: listing.userId,
            title: 'Yeni teklif',
            body: `${store.name} ${amount} TL teklif verdi.`,
          },
        });
      }
      return saved;
    });
    await this.audit.log(
      actor.id,
      existing ? 'offer.update' : 'offer.create',
      'offer',
      offer.id,
      { listingId: dto.listingId, storeId: dto.storeId, price: dto.price },
    );
    return toResponse(offer);
  }

  async update(actor: AuthUser, id: string, dto: UpdateOfferDto) {
    const current = await this.find(id);
    if (current.listing.status === ListingStatus.kapatildi) {
      throw new BadRequestException('Kapalı ilanın teklifi değiştirilmez.');
    }
    const offer = await this.prisma.offer.update({
      where: { id: current.id },
      data: { price: new Prisma.Decimal(dto.price), note: cleanNote(dto.note) },
      include: offerInclude,
    });
    await this.audit.log(actor.id, 'offer.update', 'offer', offer.id, {
      listingId: offer.listingId,
      storeId: offer.storeId,
      price: dto.price,
    });
    return toResponse(offer);
  }

  async remove(actor: AuthUser, id: string) {
    const current = await this.find(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.offer.delete({ where: { id: current.id } });
      const remaining = await tx.offer.count({ where: { listingId: current.listingId } });
      if (remaining === 0 && current.listing.status === ListingStatus.teklif_var) {
        await tx.listing.update({
          where: { id: current.listingId },
          data: { status: ListingStatus.bekliyor },
        });
      }
    });
    await this.audit.log(actor.id, 'offer.delete', 'offer', current.id, {
      listingId: current.listingId,
      storeId: current.storeId,
      price: Number(current.price),
    });
  }

  private assertUuid(value: string, message: string) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value ?? '')) {
      throw new BadRequestException(message);
    }
  }

  private async findListing(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('İlan bulunamadı.');
    return listing;
  }

  private async find(id: string) {
    this.assertUuid(id, 'Teklif seçin.');
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: { listing: { select: { status: true } } },
    });
    if (!offer) throw new NotFoundException('Teklif bulunamadı.');
    return offer;
  }
}
