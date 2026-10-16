import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, ShieldCheck, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export default function OffersView({ submittedDevice, onBackToHome, onOpenChat, onShowToast }) {
  const [sortBy, setSortBy] = useState('highest');

  const offers = [
    {
      id: "off-1",
      storeName: "TechStore",
      logo: "TECH",
      isHighest: true,
      price: 42500,
      time: "Bugün 14:32",
      rating: 4.9,
      reviews: 320,
      city: "İstanbul",
      distance: "2.3 km",
      badges: ["Güvenilir İşletme", "Hızlı Dönüş", "Yerinde Satış", "Kurumsal"]
    },
    {
      id: "off-2",
      storeName: "Giga Bilişim",
      logo: "GIGA",
      isHighest: false,
      price: 41000,
      time: "Bugün 13:15",
      rating: 4.8,
      reviews: 180,
      city: "İstanbul",
      distance: "4.1 km",
      badges: ["Güvenilir İşletme", "Hızlı Dönüş"]
    },
    {
      id: "off-3",
      storeName: "Nova Teknoloji",
      logo: "N",
      isHighest: false,
      price: 39750,
      time: "Bugün 12:48",
      rating: 4.7,
      reviews: 210,
      city: "Ankara",
      distance: "8.6 km",
      badges: ["Kurumsal"]
    },
    {
      id: "off-4",
      storeName: "Plus Elektronik",
      logo: "PLUS",
      isHighest: false,
      price: 38500,
      time: "Bugün 11:03",
      rating: 4.6,
      reviews: 95,
      city: "İzmir",
      distance: "12.2 km",
      badges: ["Yerinde Satış"]
    },
    {
      id: "off-5",
      storeName: "Metro Bilişim",
      logo: "M",
      isHighest: false,
      price: 37000,
      time: "Bugün 10:21",
      rating: 4.5,
      reviews: 140,
      city: "İstanbul",
      distance: "5.7 km",
      badges: ["Hızlı Dönüş"]
    }
  ];

  const sorted = [...offers].sort((a, b) => {
    if (sortBy === 'highest') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.price - b.price;
  });

  const device = submittedDevice || {
    specs: {
      model: "MacBook Pro 14\" (2023)",
      cpu: "M2 Pro",
      ram: "16 GB",
      storage: "512 GB SSD"
    }
  };

  return (
    <div className="offers-view-container">
      {/* Üst Başlık */}
      <div className="offers-top-bar">
        <button className="wizard-nav-icon-btn" onClick={onBackToHome}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="offers-title">Gelen Teklifler</h2>
        <span className="live-status-pill">Canlı Teklifler Aktif</span>
      </div>

      {/* Cihaz Özet Kartı (Fotoğraf 2'deki gibi) */}
      <div className="offers-device-summary-card">
        <div className="device-sum-left">
          <img src="/assets/categories/laptop.jpg" alt="Cihaz" className="device-sum-thumb" />
          <div>
            <h3 className="device-sum-title">{device.specs.model}</h3>
            <p className="device-sum-specs">
              {device.specs.cpu} • {device.specs.ram} • {device.specs.storage}
            </p>
          </div>
        </div>
        <button className="device-sum-btn" onClick={() => onShowToast('Cihaz detayları açılıyor.')}>
          Detayları Gör ➔
        </button>
      </div>

      {/* Liste Başlığı & Sıralama */}
      <div className="offers-list-head-row">
        <span className="offers-count-text">
          <strong>{sorted.length} işletmeden</strong> canlı teklif geldi
        </span>

        <div className="offers-sort-box">
          <span>Sırala:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-dropdown">
            <option value="highest">En Yüksek Fiyat</option>
            <option value="rating">En Yüksek Puan</option>
          </select>
        </div>
      </div>

      {/* Teklif Kartları */}
      <div className="offers-cards-stack">
        {sorted.map(item => (
          <div key={item.id} className={`offer-bid-item-card ${item.isHighest ? 'highest-badge-card' : ''}`}>
            {item.isHighest && (
              <span className="highest-ribbon">🟢 En Yüksek Teklif</span>
            )}

            <div className="bid-left-meta">
              <div className="bid-store-avatar">{item.logo}</div>
              <div>
                <div className="bid-store-name-row">
                  <h4>{item.storeName}</h4>
                  <span className="verified-dot">✓</span>
                </div>
                <div className="bid-store-rating">
                  <Star size={13} className="star-fill" />
                  <span>{item.rating} ({item.reviews})</span>
                  <span className="loc-dot">•</span>
                  <span>{item.city} • {item.distance}</span>
                </div>
              </div>
            </div>

            <div className="bid-right-action">
              <div className="bid-price-block">
                <span className="bid-time">{item.time}</span>
                <span className="bid-amount">{item.price.toLocaleString('tr-TR')} TL</span>
              </div>
              <button 
                className="btn-accept-or-chat"
                onClick={() => {
                  onShowToast(`${item.storeName} ile teklif görüşmesi başlatılıyor.`);
                  onOpenChat(item);
                }}
              >
                <span>Detayları Gör</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
