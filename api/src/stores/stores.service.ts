import { unlink } from 'fs/promises';
import { basename, join } from 'path';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Store } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { AuthUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { photoMimeExtensions } from '../listings/photo-upload';
import { uploadDir } from '../uploads/upload-path';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';

type ImageFile = {
  filename: string;
  mimetype: string;
  path: string;
};

function lines(value: string[] | undefined) {
  return (value ?? []).map((item) => item.trim()).filter(Boolean);
}

function asLines(value: Prisma.JsonValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function toResponse(store: Store) {
  return {
    id: store.id,
    name: store.name,
    logo: store.logo,
    cover: store.cover,
    city: store.city,
    address: store.address,
    about: store.about,
    hours: asLines(store.hours),
    badges: asLines(store.badges),
    rating: store.rating === null ? null : Number(store.rating),
    reviewCount: store.reviewCount,
    active: store.active,
    createdAt: store.createdAt,
  };
}

@Injectable()
export class StoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async all() {
    const rows = await this.prisma.store.findMany({ orderBy: { name: 'asc' } });
    return rows.map(toResponse);
  }

  async create(actor: AuthUser, dto: CreateStoreDto) {
    const store = await this.prisma.store.create({
      data: {
        name: dto.name.trim(),
        city: dto.city.trim(),
        address: dto.address.trim(),
        about: dto.about?.trim() ?? '',
        hours: lines(dto.hours),
        badges: lines(dto.badges),
        rating: dto.rating == null ? null : new Prisma.Decimal(dto.rating),
        reviewCount: dto.reviewCount ?? null,
      },
    });
    await this.audit.log(actor.id, 'store.create', 'store', store.id, {
      name: store.name,
    });
    return toResponse(store);
  }

  async update(actor: AuthUser, id: string, dto: UpdateStoreDto) {
    const current = await this.find(id);
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Güncellenecek bir alan yok.');
    }
    const store = await this.prisma.store.update({
      where: { id: current.id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.city !== undefined ? { city: dto.city.trim() } : {}),
        ...(dto.address !== undefined ? { address: dto.address.trim() } : {}),
        ...(dto.about !== undefined ? { about: dto.about.trim() } : {}),
        ...(dto.hours !== undefined ? { hours: lines(dto.hours) } : {}),
        ...(dto.badges !== undefined ? { badges: lines(dto.badges) } : {}),
        ...(dto.rating !== undefined
          ? { rating: dto.rating == null ? null : new Prisma.Decimal(dto.rating) }
          : {}),
        ...(dto.reviewCount !== undefined ? { reviewCount: dto.reviewCount } : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
      },
    });
    const action = dto.active === false && current.active ? 'store.deactivate' : 'store.update';
    await this.audit.log(actor.id, action, 'store', store.id, { name: store.name });
    return toResponse(store);
  }

  async setImages(
    actor: AuthUser,
    id: string,
    files: { logo?: ImageFile[]; cover?: ImageFile[] },
  ) {
    const logo = files.logo?.[0];
    const cover = files.cover?.[0];
    const incoming = [logo, cover].filter((file): file is ImageFile => Boolean(file));
    if (incoming.length === 0) {
      throw new BadRequestException('Logo veya kapak seçin.');
    }
    if (incoming.some((file) => !photoMimeExtensions.has(file.mimetype))) {
      await Promise.all(incoming.map((file) => unlink(file.path).catch(() => undefined)));
      throw new BadRequestException('Logo ve kapak JPG, PNG veya WEBP olmalı.');
    }
    const current = await this.find(id).catch(async (error: unknown) => {
      await Promise.all(incoming.map((file) => unlink(file.path).catch(() => undefined)));
      throw error;
    });
    const store = await this.prisma.store.update({
      where: { id: current.id },
      data: {
        ...(logo ? { logo: `/uploads/${logo.filename}` } : {}),
        ...(cover ? { cover: `/uploads/${cover.filename}` } : {}),
      },
    });
    if (logo) await this.removeFile(current.logo);
    if (cover) await this.removeFile(current.cover);
    await this.audit.log(actor.id, 'store.update', 'store', store.id, {
      name: store.name,
      logo: Boolean(logo),
      cover: Boolean(cover),
    });
    return toResponse(store);
  }

  private async find(id: string) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id ?? '')) {
      throw new BadRequestException('Mağaza seçin.');
    }
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundException('Mağaza bulunamadı.');
    return store;
  }

  private async removeFile(path: string | null) {
    if (!path?.startsWith('/uploads/')) return;
    await unlink(join(uploadDir(), basename(path))).catch(() => undefined);
  }
}
