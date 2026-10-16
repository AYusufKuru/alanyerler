import React, { useState } from 'react';
import { ArrowLeft, Star, ArrowRight, ArrowUpDown } from 'lucide-react';
import SaleStatus from './SaleStatus';

export default function OffersList({ device, offers = [], loading, error, onBackToRadar, onSelectOffer, onShowDeviceDetails, onEdit, onCancel }) {
  const [sortOption, setSortOption] = useState('highest');

  const categoryImages = {
    laptop: '/assets/categories/laptop.jpg',
    bilgisayar: '/assets/categories/laptop.jpg',
    phone: '/assets/categories/phone.jpg',
    telefon: '/assets/categories/phone.jpg',
    console: '/assets/categories/console.jpg',
    'oyun-konsolu': '/assets/categories/console.jpg',
    gpu: '/assets/categories/gpu.jpg',
    'ekran-karti': '/assets/categories/gpu.jpg',
    tablet: '/assets/categories/tablet.jpg',
    watch: '/assets/categories/watch.jpg',
    'akilli-saat': '/assets/categories/watch.jpg',
    headphones: '/assets/categories/headphones.jpg',
    kulaklik: '/assets/categories/headphones.jpg',
  };

  const deviceImgSrc = device?.photos?.[0] || categoryImages[device?.category] || categoryImages.bilgisayar;
  const deviceModel = device?.specs?.model || device?.title || 'İlan';
  const deviceSpecs = [device?.specs?.cpu, device?.specs?.ram, device?.specs?.storage, device?.condition?.cosmeticLabel]
    .filter(Boolean)
    .join(' • ');

  const sortedOffers = [...offers].sort((a, b) => {
    if (sortOption === 'rating') return (b.rating ?? -1) - (a.rating ?? -1);
    return b.price - a.price;
  });

  return (
    <div className="offers-list-view-container">
      {device?.sale ? <SaleStatus sale={device.sale} /> : null}
      <div className="offers-board-top-nav">
        <button className="wizard-nav-icon-btn" onClick={onBackToRadar} aria-label="Geri">
          <ArrowLeft size={20} />
        </button>
        <h2 className="board-main-title">Gelen Teklifler</h2>
        {device?.status !== 'kabul' && device?.status !== 'kapatildi' && (
          <span className="listing-card-actions">
            <button type="button" onClick={onEdit}>Düzenle</button>
            <button type="button" onClick={onCancel}>İptal et</button>
          </span>
        )}
        <div style={{ width: 38 }} />
      </div>

      <div className="offers-recap-banner-card">
        <div className="recap-banner-left">
          <div className="recap-img-wrapper">
            <img src={deviceImgSrc} alt={deviceModel} className="recap-device-thumb" />
          </div>
          <div className="recap-text-block">
            <h3 className="recap-title">{deviceModel}</h3>
            {deviceSpecs && <p className="recap-subtitle">{deviceSpecs}</p>}
          </div>
        </div>

        <button className="btn-recap-details" onClick={onShowDeviceDetails}>
          <span>Detayları Gör</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="offers-control-bar">
        <div className="offers-count-badge-text">
          <strong>{loading ? '…' : sortedOffers.length} işletmeden</strong> teklif geldi
        </div>

        <div className="offers-sort-select-wrap">
          <ArrowUpDown size={14} className="sort-icon" />
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="offers-sort-dropdown"
          >
            <option value="highest">En Yüksek Fiyat</option>
            <option value="rating">En Yüksek Puan</option>
          </select>
        </div>
      </div>

      <div className="offers-grid-stack">
        {loading && <div className="profile-empty-card"><h3>Teklifler yükleniyor</h3></div>}
        {!loading && error && <div className="profile-empty-card"><h3>{error}</h3></div>}
        {!loading && !error && sortedOffers.length === 0 && (
          <div className="profile-empty-card">
            <h3>Henüz teklif yok</h3>
            <p>İşletmeler teklif verince burada görünür.</p>
          </div>
        )}
        {sortedOffers.map((bid) => (
          <div
            key={bid.id}
            className={`bid-card-row ${bid.isHighest ? 'highest-bid-card' : ''}`}
            onClick={() => onSelectOffer(bid)}
          >
            {bid.isHighest && (
              <span className="highest-ribbon-tag">En Yüksek Teklif</span>
            )}

            <div className="bid-card-content">
              <div className="bid-card-left">
                <div className="bid-store-logo-box">
                  {bid.logoUrl ? <img src={bid.logoUrl} alt="" /> : bid.logo}
                </div>
                <div className="bid-store-meta">
                  <div className="bid-name-row">
                    <h4 className="bid-store-name">{bid.storeName}</h4>
                  </div>
                  <div className="bid-sub-rating">
                    {bid.rating != null && (
                      <>
                        <Star size={13} className="star-fill" />
                        <span className="rating-val">{bid.rating}</span>
                        {bid.reviews != null && <span className="reviews-val">({bid.reviews})</span>}
                        <span className="sep-dot">•</span>
                      </>
                    )}
                    <span className="dist-val">{bid.city}</span>
                  </div>
                </div>
              </div>

              <div className="bid-card-right">
                <div className="bid-price-group">
                  <span className="bid-timestamp">{bid.time}</span>
                  <span className="bid-price-number">{bid.price.toLocaleString('tr-TR')} TL</span>
                  <span className={`bid-offer-kind ${bid.kind === 'kesin' ? 'kesin' : 'on'}`}>{bid.label || 'Ön Teklif'}</span>
                </div>
                <button
                  className="btn-bid-action-view"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectOffer(bid);
                  }}
                >
                  <span>Detayları Gör</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
