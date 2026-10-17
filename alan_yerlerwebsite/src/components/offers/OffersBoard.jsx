import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, Clock, Pencil, Plus, Shield, Smartphone, Tag, Trash2 } from 'lucide-react';
import { mediaUrl } from '../../api';

const filters = [
  ['aktif', 'Aktif'],
  ['tamamlanan', 'Tamamlanan'],
  ['dolan', 'Süresi Dolan'],
  ['taslak', 'Taslak'],
];

const steps = [
  ['Teklifleri bekle', 'Mağazalar cihazını değerlendirir.'],
  ['Teklifleri karşılaştır', 'Fiyatı ve mağaza puanını incele.'],
  ['Uygun teklifi seç', 'Mağazayla iletişime geç.'],
];

export default function OffersBoard({ listings, loading, error, onOpen, onEdit, onCancel, onAdd, onHow }) {
  const [filter, setFilter] = useState('aktif');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const counts = Object.fromEntries(filters.map(([id]) => [id, listings.filter((listing) => bucket(listing, now) === id).length]));
  const offerTotal = listings.reduce((sum, listing) => sum + (Number(listing.offerCount) || 0), 0);
  const visible = listings.filter((listing) => bucket(listing, now) === filter);

  return (
    <div className="offers-page">
      <header className="offers-page-head">
        <div>
          <h1>Teklifler</h1>
          <p>Cihazlarını ve mağazalardan gelen teklifleri tek yerden takip et.</p>
        </div>
        <button type="button" className="offers-add-btn" onClick={onAdd}>
          <Plus size={16} /> Yeni Cihaz Ekle
        </button>
      </header>

      <div className="offers-stats">
        <Stat icon={<Smartphone size={20} />} value={counts.aktif} label="Aktif cihaz" />
        <Stat icon={<Tag size={20} />} value={offerTotal} label="Gelen teklif" />
        <Stat icon={<Check size={20} />} value={counts.tamamlanan} label="Tamamlanan satış" />
      </div>

      <div className="offers-page-grid">
        <div className="offers-main">
          <div className="offers-filter-row">
            {filters.map(([id, label]) => (
              <button key={id} type="button" className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>
                {label} ({counts[id]})
              </button>
            ))}
          </div>
          {loading && <p>İlanlar yükleniyor.</p>}
          {error && <p className="offer-accept-error">{error}</p>}
          {!loading && !error && visible.length === 0 && <p className="offers-empty-note">{emptyLabel(filter)}</p>}
          <div className="offers-board-list">
            {visible.map((listing) => (
              <DeviceCard
                key={listing.id}
                listing={listing}
                now={now}
                onOpen={() => onOpen(listing)}
                onEdit={() => onEdit(listing)}
                onCancel={() => onCancel(listing)}
              />
            ))}
          </div>
        </div>

        <aside className="offers-side">
          <section className="offers-steps">
            <p className="offers-side-kicker">SATIŞ ADIMLARI</p>
            <h2>Sırada ne var?</h2>
            <ol>
              {steps.map(([title, body], index) => (
                <li key={title}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="offers-advice">
            <div className="offers-advice-icon"><Shield size={18} /></div>
            <div>
              <strong>Karar verirken</strong>
              <p>Fiyatla birlikte mağaza puanını ve teslimat koşullarını da incele.</p>
              <button type="button" onClick={onHow}>Nasıl çalışır? <ArrowRight size={14} /></button>
            </div>
          </section>
        </aside>
      </div>

      <div className="offers-more-card">
        <div className="offers-more-copy">
          <span className="offers-more-plus"><Plus size={16} /></span>
          <div>
            <strong>Başka bir cihazın mı var?</strong>
            <p>Yeni cihaz ekle, mağazalardan teklif al.</p>
          </div>
        </div>
        <button type="button" className="offers-add-btn" onClick={onAdd}>
          <Plus size={16} /> Cihaz Ekle
        </button>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="offers-stat">
      <span className="offers-stat-icon">{icon}</span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function DeviceCard({ listing, now, onOpen, onEdit, onCancel }) {
  const specs = specLine(listing);
  const photo = photoOf(listing);
  const offers = Number(listing.offerCount) || 0;
  const locked = listing.status === 'kabul' || listing.status === 'kapatildi';
  const remaining = timeLabel(listing, now);
  return (
    <article className="offers-device-card">
      <div className="offers-device-photo">
        {photo ? <img src={photo} alt="" /> : <Smartphone size={36} />}
      </div>
      <div>
        <div className="offers-device-top">
          <div>
            <h3>{listing.title || 'İlan'}</h3>
            {specs && <p>{specs}</p>}
            <span className={offers ? 'offers-count-pill' : 'offers-wait-pill'}>
              {offers ? `${offers} teklif geldi` : 'Teklif bekleniyor'}
            </span>
          </div>
          {remaining && (
            <span className="offers-time"><Clock size={15} /> {remaining}</span>
          )}
        </div>
        {offers === 0 ? (
          <div className="offers-empty-box">
            <Tag size={16} />
            <div>
              <strong>Henüz teklif gelmedi</strong>
              <p>Yeni teklifler geldiğinde burada görebilirsin.</p>
            </div>
          </div>
        ) : (
          <div className="offers-arrived-box">
            <span>En yüksek teklif</span>
            {listing.highestOffer != null && (
              <strong>{Number(listing.highestOffer).toLocaleString('tr-TR')} TL</strong>
            )}
            <p>{offers} mağazanın teklifini karşılaştır.</p>
          </div>
        )}
        <div className="offers-card-actions">
          <button type="button" className="primary" onClick={onOpen}>İlanı Görüntüle <ArrowRight size={16} /></button>
          {!locked && <button type="button" className="ghost" onClick={onEdit}><Pencil size={15} /> Düzenle</button>}
          {!locked && <button type="button" className="text" onClick={onCancel}><Trash2 size={15} /> İptal et</button>}
        </div>
      </div>
    </article>
  );
}

function photoOf(listing) {
  const photo = listing.photos?.[0];
  if (!photo) return '';
  return mediaUrl(typeof photo === 'string' ? photo : photo.path);
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

function bucket(listing, now = Date.now()) {
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
