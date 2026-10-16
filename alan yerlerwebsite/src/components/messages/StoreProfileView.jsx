import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Heart, ShieldCheck, Zap, Store, Building2, Clock, Navigation, MessageCircle, ChevronRight, Phone, Check } from 'lucide-react';

export default function StoreProfileView({ store, onBackToChat, onStartChat, onShowToast }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const currentStore = store || {
    storeName: "TechStore",
    logo: "TECH",
    verified: true,
    rating: 4.9,
    reviews: 320,
    city: "İstanbul",
    district: "Kadıköy",
    distance: "2.3 km",
    address: "Bağdat Cad. No:123, Kadıköy / İstanbul",
    about: "10+ yıllık deneyimimizle laptop, bilgisayar, telefon ve oyun konsolu alım-satımı yapıyoruz. Tüm cihazlar için hızlı ve güvenilir teklif sunuyoruz.",
    phone: "+90 (216) 450 00 00"
  };

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    onShowToast(!isFollowing ? `❤️ ${currentStore.storeName} takip edilenlere eklendi!` : `${currentStore.storeName} takipten çıkarıldı.`);
  };

  return (
    <div className="store-profile-view-container">
      {/* Üst Bar */}
      <div className="profile-top-nav-bar">
        <button className="wizard-nav-icon-btn" onClick={onBackToChat} aria-label="Geri">
          <ArrowLeft size={20} />
        </button>
        <h2 className="profile-nav-title">İşletme Profili</h2>
        <button 
          className={`wizard-nav-icon-btn ${isFollowing ? 'favorited' : ''}`}
          onClick={handleToggleFollow}
          aria-label="Favori"
        >
          <Heart size={19} className={isFollowing ? 'fill-red-500 text-red-500' : ''} />
        </button>
      </div>

      <div className="profile-scroll-content">
        {/* Vitrin Görseli & Logo */}
        <div className="profile-cover-section">
          <img 
            src="/assets/techstore-cover.jpg" 
            alt="Mağaza Vitrini" 
            className="profile-cover-image" 
          />
          <div className="profile-avatar-overlay">
            <span className="profile-logo-mark">{currentStore.logo || "TECH"}</span>
            <span className="profile-verified-tick">✓</span>
          </div>
        </div>

        {/* Mağaza Başlık & İstatistikler */}
        <div className="profile-identity-card">
          <div className="profile-name-row">
            <h3 className="profile-store-title">{currentStore.storeName}</h3>
            <button 
              className={`btn-follow-toggle ${isFollowing ? 'active' : ''}`}
              onClick={handleToggleFollow}
            >
              {isFollowing ? (
                <>
                  <Check size={14} />
                  <span>Takip Ediliyor</span>
                </>
              ) : (
                <>
                  <Heart size={14} />
                  <span>Takip Et</span>
                </>
              )}
            </button>
          </div>

          <div className="profile-meta-pills-row">
            <div className="profile-rating-pill">
              <Star size={14} className="star-fill" />
              <strong>{currentStore.rating || 4.9}</strong>
              <span className="text-muted">({currentStore.reviews || 320} değerlendirme)</span>
            </div>

            <div className="profile-location-pill">
              <MapPin size={13} />
              <span>{currentStore.city || 'İstanbul'} • {currentStore.distance || '2.3 km'}</span>
            </div>
          </div>

          {/* 4 Güven ve Doğrulama Rozetleri */}
          <div className="profile-badges-cluster">
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

        {/* Hakkında Bölümü */}
        <div className="profile-section-card">
          <div className="section-card-header">
            <h4>Hakkında</h4>
            <ChevronRight size={16} className="text-muted" />
          </div>
          <p className="profile-about-paragraph">
            {currentStore.about || "10+ yıllık deneyimimizle laptop, bilgisayar, telefon ve oyun konsolu alım-satımı yapıyoruz. Tüm cihazlar için hızlı ve güvenilir teklif sunuyoruz."}
          </p>
        </div>

        {/* Konum & Harita Bölümü */}
        <div className="profile-section-card">
          <div className="section-card-header">
            <h4>Konum</h4>
            <button 
              className="link-map-action" 
              onClick={() => onShowToast('Harita tam ekran açılıyor...')}
            >
              <span>Haritada Gör</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Mini Harita Önizleme Kutusu */}
          <div className="profile-mini-map-box">
            <div className="mini-map-grid-pattern" />
            <div className="mini-map-pin-pulse">
              <div className="map-pin-core">
                <Store size={15} />
              </div>
              <div className="map-pulse-ring" />
            </div>
            <div className="mini-map-label-tag">
              {currentStore.storeName} - Kadıköy Şube
            </div>
          </div>

          <div className="profile-address-bar">
            <div className="address-text-group">
              <MapPin size={16} className="text-blue" />
              <p>{currentStore.address || "Bağdat Cad. No:123, Kadıköy / İstanbul"}</p>
            </div>
            <button 
              className="btn-get-directions"
              onClick={() => onShowToast('Yol tarifi başlatıldı (Google Maps / Apple Maps)')}
            >
              <Navigation size={14} />
              <span>Yol Tarifi Al</span>
            </button>
          </div>
        </div>

        {/* Çalışma Saatleri */}
        <div className="profile-section-card">
          <div className="section-card-header">
            <div className="card-header-icon-title">
              <Clock size={16} className="text-blue" />
              <h4>Çalışma Saatleri</h4>
            </div>
          </div>

          <div className="profile-hours-list">
            <div className="hour-row">
              <span className="day-name">Pazartesi - Cumartesi</span>
              <strong className="hours-val">09:00 - 20:00</strong>
            </div>
            <div className="hour-row">
              <span className="day-name">Pazar</span>
              <strong className="hours-val">10:00 - 18:00</strong>
            </div>
          </div>
        </div>

        {/* İletişim Bilgisi */}
        <div className="profile-contact-quick-bar">
          <div className="quick-phone-block">
            <Phone size={16} className="text-emerald" />
            <span>Müşteri Hizmetleri: <strong>{currentStore.phone || "+90 (216) 450 00 00"}</strong></span>
          </div>
        </div>
      </div>

      {/* Sabit Alt Mesaj Gönder Butonu */}
      <div className="profile-fixed-footer-cta">
        <button 
          className="btn-profile-primary-chat"
          onClick={() => onStartChat(currentStore)}
        >
          <MessageCircle size={18} />
          <span>Mesaj Gönder</span>
        </button>
      </div>
    </div>
  );
}
