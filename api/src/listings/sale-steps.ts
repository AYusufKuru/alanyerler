import { SaleStep } from '@prisma/client';

const order: SaleStep[] = [SaleStep.teslimat, SaleStep.inceleme, SaleStep.odeme, SaleStep.tamam];

const labels: Record<SaleStep, string> = {
  teslimat: 'Teslimat Bekleniyor',
  inceleme: 'Cihaz İnceleniyor',
  odeme: 'Ödeme Bekleniyor',
  tamam: 'Satış Tamamlandı',
};

export function saleView(step: SaleStep) {
  const index = order.indexOf(step);
  return {
    step,
    steps: [
      { key: 'kabul', label: 'Teklif Kabul Edildi', state: 'done' as const },
      ...order.map((key, position) => ({
        key,
        label: labels[key],
        state: position < index || key === SaleStep.tamam && position === index
          ? 'done' as const
          : position === index
            ? 'current' as const
            : 'upcoming' as const,
      })),
    ],
  };
}

export function nextSaleStep(step: SaleStep) {
  const index = order.indexOf(step);
  return order[index + 1] ?? null;
}
