import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, MapPin, MessageSquare, Star } from 'lucide-react';
import { mediaUrl } from '../api';

export default function StoreDetail({ store, onBack, onStartChat }) {
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLogoFailed(false);
  }, [store?.id]);

  if (!store) return null;

  const logo = mediaUrl(store.logo);
  const cover = mediaUrl(store.cover);
  const address = [store.address, store.city].filter(Boolean).join(', ');
  const mapsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : '';
  const hours = [];
  if (store.workingHours?.weekday) hours.push(['Pzt-Cmt', store.workingHours.weekday]);
  if (store.workingHours?.sunday) hours.push(['Pazar', store.workingHours.sunday]);

  return (
    <div className="store-profile-view-container">
      <div className="profile-top-nav-bar">
        <button className="wizard-nav-icon-btn" onClick={onBack} aria-label="Geri">
          <ArrowLeft size={20} />
        </button>
        <h2 className="profile-nav-title">İşletme Profili</h2>
        <span className="inbox-nav-right" />
      </div>

      <div className="profile-scroll-content">
        <div className="profile-cover-section">
          {cover && <img src={cover} alt="" className="profile-cover-image" />}
          <div className="profile-avatar-overlay">
            {logo && !logoFailed ? (
              <img src={logo} alt="" onError={() => setLogoFailed(true)} />
            ) : (
              <span className="profile-logo-mark">{store.logoText || 'AY'}</span>
            )}
            {store.verified && <span className="profile-verified-tick">✓</span>}
          </div>
        </div>

        <div className="profile-identity-card">
          <div className="profile-name-row">
            <h3 className="profile-store-title">{store.name}</h3>
          </div>
          <div className="profile-meta-pills-row">
            {store.rating != null && (
              <div className="profile-rating-pill">
                <Star size={14} className="star-fill" />
                <strong>{store.rating}</strong>
                <span className="text-muted">({store.reviewCount ?? 0} değerlendirme)</span>
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

        {address && (
          <div className="profile-section-card">
            <div className="section-card-header">
              <h4>Konum</h4>
            </div>
            <div className="profile-address-bar">
              <div className="address-text-group">
                <MapPin size={16} className="text-blue" />
                <p>{address}</p>
              </div>
              <a className="btn-get-directions" href={mapsUrl} target="_blank" rel="noreferrer">
                Haritada aç
              </a>
            </div>
          </div>
        )}

        {hours.length > 0 && (
          <div className="profile-section-card">
            <div className="section-card-header">
              <h4>Çalışma saatleri</h4>
            </div>
            <div className="profile-hours-list">
              {hours.map(([day, value]) => (
                <div className="hour-row" key={day}>
                  <span className="day-name"><Clock size={14} /> {day}</span>
                  <span className="hours-val">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="profile-fixed-footer-cta">
        <button className="btn-profile-primary-chat" onClick={() => onStartChat(store)}>
          <MessageSquare size={18} />
          <span>Mesaj Gönder</span>
        </button>
      </div>
    </div>
  );
}
