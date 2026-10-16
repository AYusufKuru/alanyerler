import React from 'react';
import { ArrowLeft, Star, MapPin, MessageCircle } from 'lucide-react';

export default function StoreProfileView({ store, onBackToChat }) {
  if (!store) return null;
  const mapsUrl = store.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`
    : '';

  return (
    <div className="store-profile-view-container">
      <div className="profile-top-nav-bar">
        <button className="wizard-nav-icon-btn" onClick={onBackToChat} aria-label="Geri">
          <ArrowLeft size={20} />
        </button>
        <h2 className="profile-nav-title">İşletme Profili</h2>
      </div>

      <div className="profile-scroll-content">
        <div className="profile-cover-section">
          {store.coverUrl && (
            <img src={store.coverUrl} alt="" className="profile-cover-image" />
          )}
          <div className="profile-avatar-overlay">
            <span className="profile-logo-mark">
              {store.logoUrl ? <img src={store.logoUrl} alt="" /> : store.logo}
            </span>
          </div>
        </div>

        <div className="profile-identity-card">
          <div className="profile-name-row">
            <h3 className="profile-store-title">{store.storeName}</h3>
          </div>

          <div className="profile-meta-pills-row">
            {store.rating != null && (
              <div className="profile-rating-pill">
                <Star size={14} className="star-fill" />
                <strong>{store.rating}</strong>
                {store.reviews != null && (
                  <span className="text-muted">({store.reviews} değerlendirme)</span>
                )}
              </div>
            )}
            {store.city && (
              <div className="profile-location-pill">
                <MapPin size={13} />
                <span>{store.city}</span>
              </div>
            )}
          </div>

          {store.badges?.length > 0 && (
            <div className="profile-badges-cluster">
              {store.badges.map((badge) => (
                <span className="trust-pill-tag" key={badge}>{badge}</span>
              ))}
            </div>
          )}
        </div>

        {store.about && (
          <div className="profile-section-card">
            <div className="section-card-header">
              <h4>Hakkında</h4>
            </div>
            <p className="profile-about-paragraph">{store.about}</p>
          </div>
        )}

        {store.address && (
          <div className="profile-section-card">
            <div className="section-card-header">
              <h4>Konum</h4>
            </div>
            <div className="profile-address-bar">
              <div className="address-text-group">
                <MapPin size={16} className="text-blue" />
                <p>{store.address}</p>
              </div>
              <a className="btn-get-directions" href={mapsUrl} target="_blank" rel="noreferrer">
                <span>Haritada aç</span>
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="profile-fixed-footer-cta">
        <button className="btn-profile-primary-chat" onClick={onBackToChat}>
          <MessageCircle size={18} />
          <span>Sohbete dön</span>
        </button>
      </div>
    </div>
  );
}
