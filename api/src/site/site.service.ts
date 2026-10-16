import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { shownRating } from '../offers/offer-terms';

const cards = [
  { id: 'phone', slug: 'telefon', name: 'Telefon', subTitle: 'iPhone, Samsung, Xiaomi vb.', image: '/assets/categories/phone.jpg', bgTint: '#F4F7FB', tag: 'Popüler' },
  { id: 'laptop', slug: 'bilgisayar', name: 'Bilgisayar/Laptop', subTitle: 'MacBook, Gaming Laptop, Ultrabook', image: '/assets/categories/laptop.jpg', bgTint: '#EFF6FF', tag: 'Yüksek Teklif' },
  { id: 'console', slug: 'oyun-konsolu', name: 'Oyun Konsolu', subTitle: 'PlayStation 5, Xbox Series X, Switch', image: '/assets/categories/console.jpg', bgTint: '#F5F3FF', tag: 'Hızlı Satış' },
  { id: 'gpu', slug: 'ekran-karti', name: 'Ekran Kartı', subTitle: 'RTX 40/30 serisi, AMD Radeon', image: '/assets/categories/gpu.jpg', bgTint: '#ECFDF5', tag: 'Yoğun Talep' },
  { id: 'tablet', slug: 'tablet', name: 'Tablet', subTitle: 'iPad Pro, iPad Air, Galaxy Tab', image: '/assets/categories/tablet.jpg', bgTint: '#EFF8FF', tag: 'Garantili Alım' },
  { id: 'watch', slug: 'akilli-saat', name: 'Akıllı Saat', subTitle: 'Apple Watch Ultra, Galaxy Watch', image: '/assets/categories/watch.jpg', bgTint: '#FFF7ED', tag: 'Aynı Gün' },
  { id: 'headphones', slug: 'kulaklik', name: 'Kulaklık', subTitle: 'AirPods Max, Sony WH-1000XM5', image: '/assets/categories/headphones.jpg', bgTint: '#F8FAFC', tag: 'Hızlı Nakit' },
];

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  async home() {
    const [listings, stores, offers] = await Promise.all([
      this.prisma.listing.findMany({
        select: {
          category: { select: { slug: true } },
          offers: { select: { price: true, storeId: true } },
        },
      }),
      this.prisma.store.findMany({
        where: { active: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.offer.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 8,
        include: {
          store: { select: { name: true, city: true } },
          listing: { select: { title: true } },
        },
      }),
    ]);

    return {
      categories: cards.map((card) => this.categoryCard(card, listings)),
      stores: stores.map((store) => this.storeCard(store)),
      ticker: offers.map((offer, index) => ({
        text: `${offer.store.city || 'Türkiye'} / ${offer.listing.title} ➔ ${this.money(offer.price)} TL teklif verildi`,
        time: this.ago(offer.updatedAt),
        highlight: index === 0,
      })),
      notifications: offers.map((offer) => ({
        id: offer.id,
        store: offer.store.name,
        avatar: this.initials(offer.store.name),
        text: `${offer.listing.title} için ${this.money(offer.price)} TL teklif verildi.`,
        time: this.clock(offer.updatedAt),
        unread: true,
      })),
    };
  }

  private categoryCard(
    card: (typeof cards)[number],
    listings: Array<{ category: { slug: string }; offers: Array<{ price: Prisma.Decimal; storeId: string }> }>,
  ) {
    const mine = listings.filter((listing) => listing.category.slug === card.slug);
    const offers = mine.flatMap((listing) => listing.offers);
    const buyers = new Set(offers.map((offer) => offer.storeId));
    const prices = offers.map((offer) => Number(offer.price)).filter((price) => price > 0);
    const range = prices.length
      ? `${this.money(Math.min(...prices))} - ${this.money(Math.max(...prices))} TL`
      : 'Teklif bekleniyor';
    return {
      ...card,
      activeBuyers: buyers.size,
      avgPriceRange: range,
    };
  }

  private storeCard(store: {
    id: string;
    name: string;
    city: string;
    address: string;
    about: string;
    hours: Prisma.JsonValue;
    badges: Prisma.JsonValue;
    rating: Prisma.Decimal | null;
    arbitraryDropCount: number;
    reviewCount: number | null;
    active: boolean;
  }) {
    return {
      id: store.id,
      name: store.name,
      logoText: this.initials(store.name),
      verified: store.active,
      rating: shownRating(store.rating, store.arbitraryDropCount),
      reviewCount: store.reviewCount,
      distance: '',
      city: store.city,
      district: '',
      address: store.address,
      workingHours: this.hours(store.hours),
      badges: this.lines(store.badges),
      about: store.about,
    };
  }

  private hours(value: Prisma.JsonValue) {
    const lines = this.lines(value);
    let weekday = '';
    let sunday = '';
    for (const line of lines) {
      const [days, span] = line.split('|');
      const clock = (span ?? '').trim().replace('-', ' - ');
      if (/pazar/i.test(days) && !/pazartesi/i.test(days)) sunday = clock || days;
      else weekday = clock || line;
    }
    if (!weekday && !sunday) return undefined;
    return { weekday: weekday || sunday, sunday };
  }

  private lines(value: Prisma.JsonValue) {
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }

  private initials(name: string) {
    const letters = name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0] ?? '')
      .join('');
    return (letters || name.slice(0, 2)).toUpperCase();
  }

  private money(value: Prisma.Decimal | number) {
    return Math.round(Number(value)).toLocaleString('tr-TR');
  }

  private clock(value: Date) {
    return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
  }

  private ago(value: Date) {
    const minutes = Math.max(1, Math.round((Date.now() - value.getTime()) / 60000));
    if (minutes < 60) return `${minutes} dk önce`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} sa önce`;
    return `${Math.round(hours / 24)} gün önce`;
  }
}
