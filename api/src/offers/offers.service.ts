import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListingStatus, OfferKind, Prisma, SaleStep } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { AuthUser } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto, UpdateOfferDto } from './dto/offer.dto';
import { saleView } from '../listings/sale-steps';
import { collectionOpen, offerConditions, offerTerms, shownRating } from './offer-terms';

const offerInclude = {
  store: {
    select: {
      id: true,
      name: true,
      city: true,
      active: true,
      rating: true,
      arbitraryDropCount: true,
    },
  },
} satisfies Prisma.OfferInclude;

type OfferRecord = Prisma.OfferGetPayload<{ include: typeof offerInclude }>;

function money(value: Prisma.Decimal) {
  return Number(value);
}

function toResponse(offer: OfferRecord) {
  const price = money(offer.price);
  const openedPrice = money(offer.openedPrice);
  const kind = offer.kind === OfferKind.kesin ? 'kesin' : 'on';
  return {
    id: offer.id,
    listingId: offer.listingId,
    price,
    openedPrice,
    kind,
    dropReason: offer.dropReason,
    ...offerTerms({ kind, price, openedPrice, dropReason: offer.dropReason }),
    currency: offer.currency,
    note: offer.note,
    createdAt: offer.createdAt,
    updatedAt: offer.updatedAt,
    store: {
      ...offer.store,
      rating: shownRating(offer.store.rating, offer.store.arbitraryDropCount),
      baseRating: offer.store.rating === null ? null : Number(offer.store.rating),
      arbitraryDropCount: offer.store.arbitraryDropCount,
    },
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
      select: { id: true, acceptedOfferId: true },
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
            active: true,
            rating: true,
            reviewCount: true,
            badges: true,
            arbitraryDropCount: true,
          },
        },
      },
      orderBy: [{ price: 'desc' }, { createdAt: 'asc' }],
    });
    return rows.map((offer) => {
      const price = money(offer.price);
      const openedPrice = money(offer.openedPrice);
      const kind = offer.kind === OfferKind.kesin ? 'kesin' : 'on';
      return {
        id: offer.id,
        price,
        openedPrice,
        kind,
        ...offerTerms({ kind, price, openedPrice, dropReason: offer.dropReason }),
        terms: offerConditions,
        accepted: offer.id === listing.acceptedOfferId,
        currency: offer.currency,
        createdAt: offer.createdAt,
        updatedAt: offer.updatedAt,
        store: {
          id: offer.store.id,
          name: offer.store.name,
          logo: offer.store.logo,
          cover: offer.store.cover,
          city: offer.store.city,
          verified: offer.store.active,
          rating: shownRating(offer.store.rating, offer.store.arbitraryDropCount),
          reviewCount: offer.store.reviewCount,
          badges: jsonLines(offer.store.badges),
        },
      };
    });
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
      rating: shownRating(store.rating, store.arbitraryDropCount),
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
    if (listing.status === ListingStatus.kapatildi || listing.status === ListingStatus.kabul) {
      throw new BadRequestException('Bu ilana yeni teklif eklenmez.');
    }
    if (!collectionOpen(listing.createdAt)) {
      throw new BadRequestException('Teklif toplama süresi doldu.');
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
    const note = cleanNote(dto.note);
    const change = existing
      ? this.priceChange(existing, dto)
      : {
          price: new Prisma.Decimal(dto.price),
          kind: dto.kind === 'kesin' ? OfferKind.kesin : OfferKind.on,
          dropReason: null as string | null,
          penalize: false,
        };
    const offer = await this.prisma.$transaction(async (tx) => {
      if (change.penalize) {
        await tx.store.update({
          where: { id: store.id },
          data: { arbitraryDropCount: { increment: 1 } },
        });
      }
      const saved = existing
        ? await tx.offer.update({
            where: { id: existing.id },
            data: {
              price: change.price,
              kind: change.kind,
              dropReason: change.dropReason,
              note,
            },
            include: offerInclude,
          })
        : await tx.offer.create({
            data: {
              listingId: dto.listingId,
              storeId: dto.storeId,
              price: change.price,
              openedPrice: change.price,
              kind: change.kind,
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
      const amount = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(dto.price);
      const kindLabel = change.kind === OfferKind.kesin ? 'kesin teklif' : 'ön teklif';
      if (!existing) {
        await this.notifyOwner(tx, listing.userId, 'Yeni teklif', `${store.name} ${amount} TL ${kindLabel} verdi.`);
      } else if (!change.price.equals(existing.price)) {
        await this.notifyOwner(tx, listing.userId, 'Teklif güncellendi', `${store.name} teklifini ${amount} TL olarak güncelledi.`);
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
    if (current.listing.status === ListingStatus.kapatildi || current.listing.status === ListingStatus.kabul) {
      throw new BadRequestException('Bu ilanın teklifi değiştirilmez.');
    }
    if (!collectionOpen(current.listing.createdAt)) {
      throw new BadRequestException('Teklif toplama süresi doldu.');
    }
    const change = this.priceChange(current, dto);
    const offer = await this.prisma.$transaction(async (tx) => {
      if (change.penalize) {
        await tx.store.update({
          where: { id: current.storeId },
          data: { arbitraryDropCount: { increment: 1 } },
        });
      }
      const saved = await tx.offer.update({
        where: { id: current.id },
        data: {
          price: change.price,
          kind: change.kind,
          dropReason: change.dropReason,
          note: cleanNote(dto.note),
        },
        include: offerInclude,
      });
      if (!change.price.equals(current.price)) {
        const amount = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(dto.price);
        const listing = await tx.listing.findUnique({ where: { id: current.listingId } });
        const store = await tx.store.findUnique({ where: { id: current.storeId } });
        if (listing && store) {
          await this.notifyOwner(tx, listing.userId, 'Teklif güncellendi', `${store.name} teklifini ${amount} TL olarak güncelledi.`);
        }
      }
      return saved;
    });
    await this.audit.log(actor.id, 'offer.update', 'offer', offer.id, {
      listingId: offer.listingId,
      storeId: offer.storeId,
      price: dto.price,
    });
    return toResponse(offer);
  }

  async accept(user: AuthUser, listingId: string, offerId: string) {
    this.assertUuid(listingId, 'İlan seçin.');
    this.assertUuid(offerId, 'Teklif seçin.');
    const listing = await this.prisma.listing.findFirst({
      where: { id: listingId, userId: user.id },
    });
    if (!listing) throw new NotFoundException('İlan bulunamadı.');
    if (listing.status === ListingStatus.kapatildi) {
      throw new BadRequestException('Kapalı ilanın teklifi kabul edilmez.');
    }
    if (listing.acceptedOfferId && listing.acceptedOfferId !== offerId) {
      throw new BadRequestException('Bu ilan için başka bir teklif kabul edildi.');
    }
    const offer = await this.prisma.offer.findFirst({
      where: { id: offerId, listingId },
      include: { store: { select: { name: true } } },
    });
    if (!offer) throw new NotFoundException('Teklif bulunamadı.');
    if (!listing.acceptedOfferId) {
      await this.prisma.listing.update({
        where: { id: listing.id },
        data: { acceptedOfferId: offer.id, status: ListingStatus.kabul, saleStep: SaleStep.teslimat },
      });
    }
    return { id: offer.id, accepted: true, storeName: offer.store.name, sale: saleView(SaleStep.teslimat) };
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

  private priceChange(
    current: { price: Prisma.Decimal; kind: OfferKind; dropReason: string | null },
    dto: { price: number; kind?: 'on' | 'kesin'; dropReason?: 'uyusmazlik' | 'keyfi' },
  ) {
    const price = new Prisma.Decimal(dto.price);
    const lowered = price.lessThan(current.price);
    const kesinDrop = lowered && current.kind === OfferKind.kesin;
    if (lowered && dto.dropReason !== 'uyusmazlik' && dto.dropReason !== 'keyfi') {
      throw new BadRequestException('Fiyat düşüşünün nedenini seçin.');
    }
    const dropReason = lowered ? (kesinDrop ? 'keyfi' : dto.dropReason ?? null) : current.dropReason;
    return {
      price,
      kind: dto.kind === 'kesin' ? OfferKind.kesin : dto.kind === 'on' ? OfferKind.on : current.kind,
      dropReason,
      penalize: lowered && (kesinDrop || dto.dropReason === 'keyfi'),
    };
  }

  private async notifyOwner(
    tx: Prisma.TransactionClient,
    userId: string,
    title: string,
    body: string,
  ) {
    const owner = await tx.user.findUnique({ where: { id: userId }, select: { notifyOffers: true } });
    if (!owner?.notifyOffers) return;
    await tx.notification.create({ data: { userId, title, body } });
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
      include: { listing: { select: { status: true, createdAt: true } } },
    });
    if (!offer) throw new NotFoundException('Teklif bulunamadı.');
    return offer;
  }
}
