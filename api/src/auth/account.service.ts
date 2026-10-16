import { unlink } from 'fs/promises';
import { basename, join } from 'path';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuditService } from '../audit/audit.service';
import { AuthUser } from './auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { SaleStep } from '@prisma/client';
import { saleView } from '../listings/sale-steps';
import { uploadDir } from '../uploads/upload-path';
import { AccountPageKey, accountPages } from './account-pages';
import { DeleteAccountDto, UpdateAccountDto } from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async profile(user: AuthUser) {
    const row = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!row || !row.active) throw new NotFoundException('Hesap bulunamadı.');
    return this.toProfile(row);
  }

  async update(user: AuthUser, dto: UpdateAccountDto) {
    const current = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!current || !current.active) throw new NotFoundException('Hesap bulunamadı.');
    const phone = dto.phone === undefined ? undefined : this.phone(dto.phone);
    const phoneChanged = phone !== undefined && phone !== current.phone;
    const updated = await this.prisma.user.update({
      where: { id: current.id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(phoneChanged ? { phoneVerifiedAt: null } : {}),
        ...(dto.notifyOffers !== undefined ? { notifyOffers: dto.notifyOffers } : {}),
        ...(dto.notifyMessages !== undefined ? { notifyMessages: dto.notifyMessages } : {}),
      },
    });
    return this.toProfile(updated);
  }

  sales(user: AuthUser) {
    return this.prisma.listing.findMany({
      where: { userId: user.id, status: 'kabul' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        saleStep: true,
        acceptedOffer: { select: { price: true, store: { select: { name: true } } } },
      },
    }).then((rows) => rows.map((row) => {
      const sale = saleView(row.saleStep ?? SaleStep.teslimat);
      const current = sale.steps.find((step) => step.state === 'current') ?? sale.steps[sale.steps.length - 1];
      return {
        id: row.id,
        title: row.title,
        createdAt: row.createdAt,
        price: row.acceptedOffer ? Number(row.acceptedOffer.price) : null,
        storeName: row.acceptedOffer?.store.name ?? '',
        saleLabel: current.label,
      };
    }));
  }

  page(key: string) {
    if (!(key in accountPages)) throw new NotFoundException('Sayfa bulunamadı.');
    return accountPages[key as AccountPageKey];
  }

  async remove(user: AuthUser, dto: DeleteAccountDto) {
    const current = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!current || !current.active) throw new NotFoundException('Hesap bulunamadı.');
    if (current.role !== Role.customer) {
      throw new BadRequestException('Yönetici hesabı buradan silinmez.');
    }
    const passwordMatches = await bcrypt.compare(dto.password, current.passwordHash);
    if (!passwordMatches) throw new BadRequestException('Şifre hatalı.');
    const createdOffers = await this.prisma.offer.count({ where: { createdBy: current.id } });
    if (createdOffers > 0) {
      throw new BadRequestException('Teklif kaydı bulunan hesap buradan silinmez.');
    }

    const listings = await this.prisma.listing.findMany({
      where: { userId: current.id },
      select: { id: true, photos: { select: { path: true } } },
    });
    const listingIds = listings.map((listing) => listing.id);
    const photoPaths = listings.flatMap((listing) => listing.photos.map((photo) => photo.path));

    await this.prisma.$transaction(async (tx) => {
      if (listingIds.length) {
        await tx.listing.updateMany({
          where: { id: { in: listingIds } },
          data: { acceptedOfferId: null },
        });
        await tx.offer.deleteMany({ where: { listingId: { in: listingIds } } });
      }
      await tx.conversation.deleteMany({ where: { customerId: current.id } });
      await tx.message.deleteMany({ where: { senderId: current.id } });
      if (listingIds.length) {
        await tx.listing.deleteMany({ where: { id: { in: listingIds } } });
      }
      await tx.auditLog.updateMany({
        where: { actorId: current.id },
        data: { actorId: null },
      });
      await tx.user.delete({ where: { id: current.id } });
    });

    await Promise.all(photoPaths.map((path) => unlink(join(uploadDir(), basename(path))).catch(() => undefined)));
    return { deleted: true };
  }

  private phone(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const compact = trimmed.replace(/[\s()-]/g, '');
    if (!/^\+?\d{10,15}$/.test(compact)) {
      throw new BadRequestException('Telefon numarası 10 ile 15 hane olmalı.');
    }
    return compact;
  }

  private toProfile(user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    phoneVerifiedAt: Date | null;
    notifyOffers: boolean;
    notifyMessages: boolean;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      phoneVerified: false,
      phoneVerification: 'SMS doğrulama henüz açık değil.',
      notifyOffers: user.notifyOffers,
      notifyMessages: user.notifyMessages,
      messageNotices: 'Mesaj için ayrıca anlık bildirim gönderilmiyor. Tercih kayda yazılır.',
    };
  }
}
