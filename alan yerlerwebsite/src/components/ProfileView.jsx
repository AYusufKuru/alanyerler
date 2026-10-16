import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Tag, MessageSquare, Plus, ArrowRight, Trash2, Heart, ExternalLink, HelpCircle, PhoneCall, CheckCircle } from 'lucide-react';

export default function ProfileView({ onStartWizard, onGoToOffers, onGoToMessages, onShowToast }) {
  const [activeSubTab, setActiveSubTab] = useState('listings'); // 'listings', 'favorites', 'security'
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('alan_yerler_devices') || '[]');
    if (saved.length > 0) {
      setDevices(saved);
    } else {
      // Varsayılan ilk cihaz
      setDevices([
        {
          id: "dev-default",
          category: "laptop",
          specs: {
            brand: "Apple",
            model: "MacBook Pro 14\" (2023)",
            cpu: "M2 Pro",
            ram: "16 GB",
            storage: "512 GB SSD"
          },
          condition: {
            cosmeticLabel: "Sıfır Gibi",
            batteryHealth: "%100"
          },
          bidsCount: 5,
          highestOffer: 42500,
          status: "offers_ready",
          date: "Bugün 14:30"
        }
      ]);
    }
  }, []);

  const handleDeleteDevice = (id) => {
    const updated = devices.filter(d => d.id !== id);
    setDevices(updated);
    localStorage.setItem('alan_yerler_devices', JSON.stringify(updated));
    onShowToast('İlan başarıyla kaldırıldı.');
  };

  const categoryImages = {
    laptop: '/assets/categories/laptop.jpg',
    phone: '/assets/categories/phone.jpg',
    console: '/assets/categories/console.jpg',
    gpu: '/assets/categories/gpu.jpg',
    tablet: '/assets/categories/tablet.jpg',
    watch: '/assets/categories/watch.jpg',
    headphones: '/assets/categories/headphones.jpg'
  };

  return (
    <div className="profile-view-wrapper">
      {/* Profil Başlık Kartı */}
      <div className="user-profile-header-card">
        <div className="user-profile-avatar-large">
          <User size={36} />
          <span className="user-verified-badge"><ShieldCheck size={14} /></span>
        </div>

        <div className="user-profile-meta">
          <div className="user-name-row">
            <h2>Kullanıcı Hesabı</h2>
            <span className="user-level-tag">Doğrulanmış Satıcı</span>
          </div>
          <p className="user-subtext">İstanbul • Kayıt Tarihi: Ekim 2026</p>
        </div>

        <button className="btn-add-device-shortcut" onClick={onStartWizard}>
          <Plus size={16} />
          <span>Cihaz Sat</span>
        </button>
      </div>

      {/* İstatistik Sayaçları */}
      <div className="user-stats-counters-row">
        <div className="user-stat-card">
          <span className="stat-number">{devices.length}</span>
          <span className="stat-label">Aktif İlan</span>
        </div>
        <div className="user-stat-card highlight">
          <span className="stat-number">5</span>
          <span className="stat-label">Gelen Teklif</span>
        </div>
        <div className="user-stat-card">
          <span className="stat-number">42.500 ₺</span>
          <span className="stat-label">En Yüksek Teklif</span>
        </div>
        <div className="user-stat-card">
          <span className="stat-number">100%</span>
          <span className="stat-label">Güven Skoru</span>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="profile-tabs-filter">
        <button 
          className={`profile-tab-pill ${activeSubTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('listings')}
        >
          <Tag size={16} />
          <span>İlanlarım ({devices.length})</span>
        </button>

        <button 
          className={`profile-tab-pill ${activeSubTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('favorites')}
        >
          <Heart size={16} />
          <span>Takip Edilen Mağazalar (2)</span>
        </button>

        <button 
          className={`profile-tab-pill ${activeSubTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('security')}
        >
          <ShieldCheck size={16} />
          <span>Güvenli Satış & Destek</span>
        </button>
      </div>

      {/* İlanlarım Sekmesi */}
      {activeSubTab === 'listings' && (
        <div className="profile-listings-stack">
          {devices.length === 0 ? (
            <div className="profile-empty-card">
              <Tag size={36} className="text-muted" />
              <h3>Henüz kayıtlı ilanınız yok</h3>
              <p>Hemen cihazınızı ekleyerek onaylı mağazalardan anında teklif toplayın.</p>
              <button className="btn-profile-create" onClick={onStartWizard}>
                + İlk Cihazını Ekle
              </button>
            </div>
          ) : (
            devices.map(dev => (
              <div key={dev.id} className="profile-device-item-card">
                <div className="device-item-thumb-box">
                  <img 
                    src={dev.photos?.[0] || categoryImages[dev.category] || categoryImages.laptop} 
                    alt="Cihaz" 
                    className="device-item-img"
                  />
                </div>

                <div className="device-item-meta">
                  <div className="device-item-status-pill">
                    <span className="status-live-pulse" />
                    <span>Teklifler Hazır (5 Mağaza)</span>
                  </div>

                  <h3 className="device-item-title">
                    {dev.specs?.model || "MacBook Pro 14\" (2023)"}
                  </h3>

                  <p className="device-item-specs-sub">
                    {dev.specs?.cpu || "M2 Pro"} • {dev.specs?.ram || "16 GB"} • {dev.specs?.storage || "512 GB SSD"} • {dev.condition?.cosmeticLabel || "Sıfır Gibi"}
                  </p>

                  <div className="device-highest-offer-tag">
                    En Yüksek Teklif: <strong>{(dev.highestOffer || 42500).toLocaleString('tr-TR')} TL</strong> (TechStore)
                  </div>
                </div>

                <div className="device-item-actions">
                  <button 
                    className="btn-view-offers-action"
                    onClick={() => onGoToOffers(dev)}
                  >
                    <span>Teklifleri Gör</span>
                    <ArrowRight size={15} />
                  </button>

                  <button 
                    className="btn-delete-listing"
                    onClick={() => handleDeleteDevice(dev.id)}
                    title="İlanı Kaldır"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Favoriler Sekmesi */}
      {activeSubTab === 'favorites' && (
        <div className="profile-favorites-grid">
          <div className="favorite-store-box">
            <div className="fav-avatar">TECH</div>
            <div className="fav-info">
              <h4>TechStore Kadıköy</h4>
              <p>⭐ 4.9 • Bağdat Caddesi No:123</p>
            </div>
            <button className="btn-chat-shortcut" onClick={onGoToMessages}>
              <MessageSquare size={16} />
              <span>Sohbet</span>
            </button>
          </div>

          <div className="favorite-store-box">
            <div className="fav-avatar giga">GIGA</div>
            <div className="fav-info">
              <h4>Giga Bilişim Şişli</h4>
              <p>⭐ 4.8 • Büyükdere Cad. No:45</p>
            </div>
            <button className="btn-chat-shortcut" onClick={onGoToMessages}>
              <MessageSquare size={16} />
              <span>Sohbet</span>
            </button>
          </div>
        </div>
      )}

      {/* Güvenlik & Destek Sekmesi */}
      {activeSubTab === 'security' && (
        <div className="profile-security-card">
          <div className="security-guide-row">
            <CheckCircle size={20} className="text-emerald" />
            <div>
              <strong>Uygulama İndirmeden Güvenli Satış</strong>
              <p>Tarayıcınız üzerinden oluşturduğunuz teklif sözleşmesi her iki taraf için de bağlayıcıdır.</p>
            </div>
          </div>

          <div className="security-guide-row">
            <CheckCircle size={20} className="text-emerald" />
            <div>
              <strong>Elden Teslim veya Korumalı Kargo</strong>
              <p>Cihazınızı mağazada elden nakit karşılığı veya ücretsiz sigortalı kargo ile satabilirsiniz.</p>
            </div>
          </div>

          <div className="security-guide-row">
            <PhoneCall size={20} className="text-blue" />
            <div>
              <strong>7/24 Alan Yerler Destek Hattı</strong>
              <p>Tüm süreç boyunca sorularınız için müşteri hizmetleri ekibimiz yanınızda: <strong>0850 300 00 00</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
