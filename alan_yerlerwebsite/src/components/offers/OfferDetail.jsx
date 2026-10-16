import React from 'react';
import { ArrowLeft, Star, MapPin, ShieldCheck, MessageCircle, Info, ArrowRight } from 'lucide-react';

export default function OfferDetail({ offer, device, onBackToList, onProceedToChat, onShowStoreProfile }) {
  if (!offer) return null;
  const currentOffer = offer;

  const deviceModel = device?.specs?.model || device?.title || 'İlan';
  const deviceCpu = device?.specs?.cpu || '';
  const deviceRam = device?.specs?.ram || '';
  const deviceStorage = device?.specs?.storage || '';
  const deviceCondition = device?.condition?.cosmeticLabel || '';

  return (
    <div className="offer-detail-view-container">
      {/* Üst Bar */}
      <div className="detail-top-nav-bar">
        <button className="wizard-nav-icon-btn" onClick={onBackToList} aria-label="Geri">
          <ArrowLeft size={20} />
        </button>
        <h2 className="detail-page-title">Teklif Detayı</h2>
        <div style={{ width: 38 }} />
      </div>

      {/* MAĞAZA VİTRİN VE BAŞLIK BLOĞU (FOTOĞRAF 2 SAĞ EKRAN BİREBİR) */}
      <div className="detail-store-hero-card">
        {/* Mağaza İç Mekan Vitrin Fotoğrafı */}
        <div className="store-cover-image-box">
          {currentOffer.coverUrl && (
            <img
              src={currentOffer.coverUrl}
              alt=""
              className="store-cover-photo"
            />
          )}
        </div>

        {/* Mağaza Kimlik Bilgileri */}
        <div className="store-profile-header-group">
          <div className="store-avatar-circle">
            {currentOffer.logoUrl ? <img src={currentOffer.logoUrl} alt="" /> : currentOffer.logo}
          </div>

          <div className="store-titles-block">
            <div className="store-name-row">
              <h3 className="store-name-bold">{currentOffer.storeName}</h3>
              <span className="verified-blue-badge">✓</span>
            </div>

            {currentOffer.rating != null && (
              <div className="store-rating-subline">
                <Star size={14} className="star-fill" />
                <span className="rating-score-bold">{currentOffer.rating}</span>
                {currentOffer.reviews != null && (
                  <span className="reviews-sub-count">({currentOffer.reviews} değerlendirme)</span>
                )}
              </div>
            )}

            {currentOffer.city && (
              <div className="store-location-subline">
                <MapPin size={13} />
                <span>{currentOffer.city}</span>
              </div>
            )}
          </div>

          <button 
            className="btn-view-profile-chip" 
            onClick={() => onShowStoreProfile(currentOffer)}
          >
            <span>Profili Gör</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* 4 Güven ve Doğrulama Rozetleri */}
        {currentOffer.badges?.length > 0 && (
          <div className="store-trust-badges-bar">
            {currentOffer.badges.map((badge) => (
              <span className="trust-pill-tag" key={badge}>
                <ShieldCheck size={13} className="text-blue" />
                <span>{badge}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* BÜYÜK FİYAT TEKLİF KARTI (FOTOĞRAF 2 BİREBİR) */}
      <div className="special-offer-price-card">
        <div className="offer-price-header">
          <span className="offer-exclusive-tag">✨ Sana Özel Teklif</span>
          <span className="offer-timestamp-text">{currentOffer.time}</span>
        </div>

        <div className="offer-giant-price">
          {currentOffer.price.toLocaleString('tr-TR')} TL
        </div>

        <button 
          className="btn-offer-contact-cta"
          onClick={() => onProceedToChat(currentOffer)}
        >
          <MessageCircle size={18} />
          <span>İletişime Geç</span>
        </button>
      </div>

      {/* TEKLİF VE CİHAZ ÖZELLİKLERİ TABLOSU */}
      <div className="offer-specs-table-card">
        <h4 className="specs-table-title">Teklif Detayları</h4>

        <div className="specs-table-rows">
          <div className="spec-table-row">
            <span className="spec-field-name">Cihaz</span>
            <strong className="spec-field-val">{deviceModel}</strong>
          </div>
          {deviceCpu && (
            <div className="spec-table-row">
              <span className="spec-field-name">İşlemci</span>
              <strong className="spec-field-val">{deviceCpu}</strong>
            </div>
          )}
          {deviceRam && (
            <div className="spec-table-row">
              <span className="spec-field-name">RAM</span>
              <strong className="spec-field-val">{deviceRam}</strong>
            </div>
          )}
          {deviceStorage && (
            <div className="spec-table-row">
              <span className="spec-field-name">Depolama</span>
              <strong className="spec-field-val">{deviceStorage}</strong>
            </div>
          )}
          {deviceCondition && (
            <div className="spec-table-row">
              <span className="spec-field-name">Durum</span>
              <strong className="spec-field-val">{deviceCondition}</strong>
            </div>
          )}
        </div>
      </div>

      {/* "NASIL DEVAM EDERİM?" BİLGİLENDİRME KUTUSU (FOTOĞRAF 2 BİREBİR) */}
      <div className="how-to-proceed-guide-card">
        <div className="guide-icon-wrap">
          <Info size={20} />
        </div>
        <div className="guide-text-wrap">
          <h5 className="guide-heading">Nasıl devam ederim?</h5>
          <p className="guide-body-text">
            İletişime geçerek cihazınızı bu fiyattan satmak için detayları görüşebilirsiniz. İşletme size konum, randevu ve teslimat süreci hakkında bilgi verecektir.
          </p>
        </div>
      </div>
    </div>
  );
}
