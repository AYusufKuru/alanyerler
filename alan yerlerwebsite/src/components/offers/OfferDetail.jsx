import React from 'react';
import { ArrowLeft, Star, MapPin, ShieldCheck, Zap, Store, Building2, MessageCircle, Info, ArrowRight } from 'lucide-react';

export default function OfferDetail({ offer, device, onBackToList, onProceedToChat, onShowStoreProfile, onShowToast }) {
  const currentOffer = offer || {
    storeName: "TechStore",
    logo: "TECH",
    price: 42500,
    time: "Bugün 14:32",
    rating: 4.9,
    reviews: 320,
    city: "İstanbul",
    district: "Kadıköy",
    distance: "2.3 km",
    validDays: 3,
    badges: ["Güvenilir İşletme", "Hızlı Dönüş", "Yerinde Satış", "Kurumsal"]
  };

  const deviceModel = device?.specs?.model || "MacBook Pro 14\" (2023)";
  const deviceCpu = device?.specs?.cpu || "M2 Pro";
  const deviceRam = device?.specs?.ram || "16 GB";
  const deviceStorage = device?.specs?.storage || "512 GB SSD";
  const deviceCondition = device?.condition?.cosmeticLabel || "İyi / Sıfır Gibi";

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
          <img 
            src="/assets/techstore-cover.jpg" 
            alt="TechStore Vitrin" 
            className="store-cover-photo" 
          />
        </div>

        {/* Mağaza Kimlik Bilgileri */}
        <div className="store-profile-header-group">
          <div className="store-avatar-circle">
            {currentOffer.logo}
          </div>

          <div className="store-titles-block">
            <div className="store-name-row">
              <h3 className="store-name-bold">{currentOffer.storeName}</h3>
              <span className="verified-blue-badge">✓</span>
            </div>

            <div className="store-rating-subline">
              <Star size={14} className="star-fill" />
              <span className="rating-score-bold">{currentOffer.rating}</span>
              <span className="reviews-sub-count">({currentOffer.reviews} değerlendirme)</span>
            </div>

            <div className="store-location-subline">
              <MapPin size={13} />
              <span>{currentOffer.city} • {currentOffer.distance}</span>
            </div>
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
        <div className="store-trust-badges-bar">
          <span className="trust-pill-tag">
            <ShieldCheck size={13} className="text-blue" />
            <span>Güvenilir İşletme</span>
          </span>
          <span className="trust-pill-tag">
            <Zap size={13} className="text-amber" />
            <span>Hızlı Dönüş</span>
          </span>
          <span className="trust-pill-tag">
            <Store size={13} className="text-green" />
            <span>Yerinde Satış</span>
          </span>
          <span className="trust-pill-tag">
            <Building2 size={13} className="text-indigo" />
            <span>Kurumsal</span>
          </span>
        </div>
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
          <div className="spec-table-row">
            <span className="spec-field-name">İşlemci</span>
            <strong className="spec-field-val">{deviceCpu}</strong>
          </div>
          <div className="spec-table-row">
            <span className="spec-field-name">RAM</span>
            <strong className="spec-field-val">{deviceRam}</strong>
          </div>
          <div className="spec-table-row">
            <span className="spec-field-name">Depolama</span>
            <strong className="spec-field-val">{deviceStorage}</strong>
          </div>
          <div className="spec-table-row">
            <span className="spec-field-name">Durum</span>
            <strong className="spec-field-val">{deviceCondition}</strong>
          </div>
          <div className="spec-table-row">
            <span className="spec-field-name">Teklif Geçerlilik Süresi</span>
            <strong className="spec-field-val text-emerald">{currentOffer.validDays} gün</strong>
          </div>
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
