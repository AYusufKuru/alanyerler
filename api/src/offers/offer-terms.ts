import { Prisma } from '@prisma/client';

const penaltyPerDrop = 0.2;

export const offerWindowHours = 1;

export function collectionEndsAt(createdAt: Date) {
  return new Date(createdAt.getTime() + offerWindowHours * 60 * 60 * 1000);
}

export function collectionOpen(createdAt: Date, now = Date.now()) {
  return now < collectionEndsAt(createdAt).getTime();
}

export const offerConditions = [
  'Elden teslim',
  'Cihaz mağazada kontrol edilir',
  'Ödeme aynı gün',
  'Teklif toplama süresi 1 saattir',
];

export function shownRating(rating: Prisma.Decimal | number | null, drops: number) {
  if (rating === null) return null;
  const next = Math.max(1, Number(rating) - drops * penaltyPerDrop);
  return Math.round(next * 10) / 10;
}

export function offerTerms(input: {
  kind: 'on' | 'kesin';
  price: number;
  openedPrice: number;
  dropReason: string | null;
}) {
  const kesin = input.kind === 'kesin';
  const label = kesin ? 'Kesin Teklif' : 'Ön Teklif';
  const disclaimer = kesin
    ? 'Mağaza bu fiyatı kesinleştirdi.'
    : 'Cihaz bilgileriniz doğruysa fiyat geçerlidir.';
  if (input.price >= input.openedPrice) {
    return { label, disclaimer, revision: null as string | null };
  }
  const opened = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(input.openedPrice);
  const revision = input.dropReason === 'uyusmazlik'
    ? `İlk fiyat ${opened} TL idi. Mağaza, cihaz ilandaki bilgilerle uyuşmadığı için fiyatı güncelledi.`
    : `İlk fiyat ${opened} TL idi. Mağaza fiyatı düşürdü.`;
  return { label, disclaimer, revision };
}
