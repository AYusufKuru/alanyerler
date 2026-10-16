import React, { useEffect, useState } from 'react';

const filters = [
  ['aktif', 'Aktif'],
  ['tamamlanan', 'Tamamlanan'],
  ['dolan', 'Süresi Dolan'],
  ['taslak', 'Taslak'],
];

export default function OffersBoard({ listings, loading, error, onOpen, onEdit, onCancel }) {
  const [filter, setFilter] = useState('aktif');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const visible = listings.filter((listing) => bucket(listing, now) === filter);

  return (
    <div className="offers-board">
      <h2>Teklifler</h2>
      <div className="offers-board-filters">
        {filters.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={filter === id ? 'active' : ''}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {loading && <p>İlanlar yükleniyor.</p>}
      {error && <p className="offer-accept-error">{error}</p>}
      {!loading && !error && visible.length === 0 && <p>{emptyLabel(filter)}</p>}
      <div className="offers-board-list">
        {visible.map((listing) => {
          const specs = specLine(listing);
          return (
            <div key={listing.id} className="offers-board-card" onClick={() => onOpen(listing)} role="button" tabIndex={0}>
              <strong>{listing.title || 'İlan'}</strong>
              {specs && <span>{specs}</span>}
              <span>{listing.offerCount ? `${listing.offerCount} işletmeden teklif geldi` : 'Henüz teklif yok'}</span>
              {listing.highestOffer != null && (
                <span>En yüksek: {Number(listing.highestOffer).toLocaleString('tr-TR')} TL</span>
              )}
              <em>{timeLabel(listing, now)}</em>
              {listing.status !== 'kabul' && listing.status !== 'kapatildi' && (
                <span className="listing-card-actions" onClick={(event) => event.stopPropagation()}>
                  <button type="button" onClick={() => onEdit(listing)}>Düzenle</button>
                  <button type="button" onClick={() => onCancel(listing)}>İptal et</button>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function specLine(listing) {
  return [field(listing.specs, 'depolama', 'storage'), field(listing.specs, 'renk', 'color')]
    .filter(Boolean)
    .join(' · ');
}

function field(values, key, fallback) {
  if (!values || typeof values !== 'object') return '';
  const value = values[key] || values[fallback] || '';
  if (value === 'Diğer') return values[`${key}Diger`] || values[`${fallback}Diger`] || '';
  return value;
}

export function bucket(listing, now = Date.now()) {
  if (listing.status === 'kabul') return 'tamamlanan';
  if (listing.status === 'kapatildi') return 'dolan';
  const ends = listing.offerWindowEndsAt ? new Date(listing.offerWindowEndsAt).getTime() : 0;
  if (ends && ends <= now) return 'dolan';
  return 'aktif';
}

function timeLabel(listing, now) {
  if (listing.status === 'kabul') return 'Teklif kabul edildi';
  if (listing.status === 'kapatildi') return 'Kapatıldı';
  const ends = listing.offerWindowEndsAt ? new Date(listing.offerWindowEndsAt).getTime() : 0;
  if (!ends || ends <= now) return 'Süre doldu';
  const left = ends - now;
  const hours = Math.floor(left / 3600000);
  if (hours >= 1) return `${hours} saat kaldı`;
  const minutes = Math.max(1, Math.floor(left / 60000));
  return `${minutes} dakika kaldı`;
}

function emptyLabel(filter) {
  if (filter === 'taslak') return 'Taslak yok. İlan gönderilmeden kaydedilmiyor.';
  if (filter === 'tamamlanan') return 'Kabul edilmiş teklif yok.';
  if (filter === 'dolan') return 'Süresi dolan ilan yok.';
  return 'Aktif ilan yok.';
}
