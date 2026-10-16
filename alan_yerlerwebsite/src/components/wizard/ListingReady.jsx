import React from 'react';

export default function ListingReady({ deviceLine, onOffers }) {
  return (
    <div className="listing-ready">
      <div className="listing-ready-mark" aria-hidden="true">🎉</div>
      <h2>Cihazınız teklif almaya hazır</h2>
      <p className="listing-ready-device">{deviceLine}</p>
      <p className="listing-ready-copy">
        Cihazınız Konya'daki ve Türkiye genelindeki uygun işletmelere gönderildi.
      </p>
      <p className="listing-ready-window">Teklif toplama süresi: 1 saat</p>
      <button type="button" className="listing-ready-action" onClick={onOffers}>
        Tekliflerimi Gör
      </button>
    </div>
  );
}

export function deviceLine(title, specs) {
  const storage = specs?.storage || specs?.depolama || '';
  const name = title || [specs?.brand, specs?.model].filter(Boolean).join(' ');
  const label = name || 'Cihazınız';
  if (!storage || label.includes(storage)) return label;
  return `${label} – ${storage}`;
}
