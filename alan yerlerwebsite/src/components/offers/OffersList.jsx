import React, { useState } from 'react';
import { ArrowLeft, Trash2, Star, ArrowRight, ArrowUpDown, ShieldCheck } from 'lucide-react';

export default function OffersList({ device, onBackToRadar, onSelectOffer, onShowDeviceDetails, onShowToast }) {
  const [sortOption, setSortOption] = useState('highest');

  const categoryImages = {
    laptop: '/assets/categories/laptop.jpg',
    phone: '/assets/categories/phone.jpg',
    console: '/assets/categories/console.jpg',
    gpu: '/assets/categories/gpu.jpg',
    tablet: '/assets/categories/tablet.jpg',
    watch: '/assets/categories/watch.jpg',
    headphones: '/assets/categories/headphones.jpg'
  };

  const deviceImgSrc = device?.photos?.[0] || categoryImages[device?.category] || categoryImages.laptop;

  // Kategoriye göre gerçekçi piyasa fiyat katsayıları
  const getCategoryMultiplier = (cat) => {
    switch (cat) {
      case 'phone': return 1.05; // iPhone 15 Pro ~44.500 TL
      case 'console': return 0.50; // PS5 ~21.250 TL
      case 'gpu': return 0.75; // RTX 4080 ~31.850 TL
      case 'tablet': return 0.65; // iPad Pro ~27.600 TL
      case 'watch': return 0.35; // Apple Watch Ultra ~14.800 TL
      case 'headphones': return 0.20; // AirPods Max ~8.500 TL
      default: return 1.0; // MacBook Pro ~42.500 TL
    }
  };

  const multiplier = getCategoryMultiplier(device?.category);

  const offers = [
    {
      id: "off-techstore",
      storeName: "TechStore",
      logo: "TECH",
      isHighest: true,
      price: Math.round((42500 * multiplier) / 50) * 50,
      time: "Bugün 14:32",
      rating: 4.9,
      reviews: 320,
      city: "İstanbul",
      district: "Kadıköy",
      distance: "2.3 km",
      badges: ["Güvenilir İşletme", "Hızlı Dönüş", "Yerinde Satış", "Kurumsal"],
      address: "Bağdat Cad. No:123, Kadıköy / İstanbul",
      validDays: 3
    },
    {
      id: "off-giga",
      storeName: "Giga Bilişim",
      logo: "GIGA",
      isHighest: false,
      price: Math.round((41000 * multiplier) / 50) * 50,
      time: "Bugün 13:15",
      rating: 4.8,
      reviews: 180,
      city: "İstanbul",
      district: "Şişli",
      distance: "4.1 km",
      badges: ["Güvenilir İşletme", "Hızlı Dönüş"],
      address: "Büyükdere Cad. No:45, Şişli / İstanbul",
      validDays: 3
    },
    {
      id: "off-nova",
      storeName: "Nova Teknoloji",
      logo: "N",
      isHighest: false,
      price: Math.round((39750 * multiplier) / 50) * 50,
      time: "Bugün 12:48",
      rating: 4.7,
      reviews: 210,
      city: "Ankara",
      district: "Çankaya",
      distance: "8.6 km",
      badges: ["Kurumsal"],
      address: "Tunalı Hilmi Cad. No:88, Çankaya / Ankara",
      validDays: 5
    },
    {
      id: "off-plus",
      storeName: "Plus Elektronik",
      logo: "PLUS",
      isHighest: false,
      price: Math.round((38500 * multiplier) / 50) * 50,
      time: "Bugün 11:03",
      rating: 4.6,
      reviews: 95,
      city: "İzmir",
      district: "Alsancak",
      distance: "12.2 km",
      badges: ["Yerinde Satış"],
      address: "Plevne Blv. No:14, Konak / İzmir",
      validDays: 3
    },
    {
      id: "off-metro",
      storeName: "Metro Bilişim",
      logo: "M",
      isHighest: false,
      price: Math.round((37000 * multiplier) / 50) * 50,
      time: "Bugün 10:21",
      rating: 4.5,
      reviews: 140,
      city: "İstanbul",
      district: "Kadıköy",
      distance: "5.7 km",
      badges: ["Hızlı Dönüş"],
      address: "Mühürdar Cad. No:22, Kadıköy / İstanbul",
      validDays: 2
    }
  ];

  const sortedOffers = [...offers].sort((a, b) => {
    if (sortOption === 'highest') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    if (sortOption === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
    return 0;
  });

  const formatDeviceSpecsLine = () => {
    if (!device?.specs) return "M2 Pro • 16 GB • 512 GB SSD";
    const { cpu, gpu, ram, storage, registrationStatus, gamepads, gpuSecurity } = device.specs;
    const parts = [];
    if (cpu && !['console', 'gpu'].includes(device.category)) parts.push(cpu);
    if (gpu && gpu !== 'Dahili Grafik Çipi' && gpu !== 'Dahili Mobil Grafik İşlemci') parts.push(gpu);
    if (ram && !['console', 'gpu'].includes(device.category)) parts.push(ram);
    if (storage) parts.push(storage);
    if (registrationStatus) parts.push(registrationStatus.split('(')[0].trim());
    if (gamepads) parts.push(gamepads);
    if (gpuSecurity) parts.push(gpuSecurity);
    if (device.condition?.batteryHealth && ['laptop', 'macbook', 'phone', 'tablet', 'watch'].includes(device.category)) {
      parts.push(`Pil: ${device.condition.batteryHealth}`);
    }
    return parts.join(' • ') || `${cpu || ''} • ${ram || ''} • ${storage || ''}`;
  };

  const deviceModel = device?.specs?.model || "MacBook Pro 14\" (2023)";
  const deviceSpecs = formatDeviceSpecsLine();

  return (
    <div className="offers-list-view-container">
      {/* Üst Bar */}
      <div className="offers-board-top-nav">
        <button className="wizard-nav-icon-btn" onClick={onBackToRadar} aria-label="Geri">
          <ArrowLeft size={20} />
        </button>
        <h2 className="board-main-title">Gelen Teklifler</h2>
        <button 
          className="wizard-nav-icon-btn" 
          onClick={() => onShowToast('İlanınız arşive kaydedildi.')}
          aria-label="Sil"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* CİHAZ ÖZET KARTI (FOTOĞRAF 2 ORTA EKRAN BİREBİR) */}
      <div className="offers-recap-banner-card">
        <div className="recap-banner-left">
          <div className="recap-img-wrapper">
            <img src={deviceImgSrc} alt={deviceModel} className="recap-device-thumb" />
          </div>
          <div className="recap-text-block">
            <h3 className="recap-title">{deviceModel}</h3>
            <p className="recap-subtitle">{deviceSpecs}</p>
          </div>
        </div>

        <button className="btn-recap-details" onClick={onShowDeviceDetails}>
          <span>Detayları Gör</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Sayaç ve Sıralama Çubuğu */}
      <div className="offers-control-bar">
        <div className="offers-count-badge-text">
          <strong>{sortedOffers.length} işletmeden</strong> teklif geldi
        </div>

        <div className="offers-sort-select-wrap">
          <ArrowUpDown size={14} className="sort-icon" />
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="offers-sort-dropdown"
          >
            <option value="highest">En Yüksek Fiyat</option>
            <option value="rating">En Yüksek Puan</option>
            <option value="distance">En Yakın Mesafe</option>
          </select>
        </div>
      </div>

      {/* TEKLİF KARTLARI LİSTESİ (FOTOĞRAF 2'DEKİ 5 İŞLETME BİREBİR) */}
      <div className="offers-grid-stack">
        {sortedOffers.map(bid => (
          <div 
            key={bid.id} 
            className={`bid-card-row ${bid.isHighest ? 'highest-bid-card' : ''}`}
            onClick={() => onSelectOffer(bid)}
          >
            {/* En Yüksek Teklif Rozeti */}
            {bid.isHighest && (
              <span className="highest-ribbon-tag">
                🟢 En Yüksek Teklif
              </span>
            )}

            <div className="bid-card-content">
              {/* Sol: Mağaza Logo & Bilgileri */}
              <div className="bid-card-left">
                <div className="bid-store-logo-box">
                  {bid.logo}
                </div>
                <div className="bid-store-meta">
                  <div className="bid-name-row">
                    <h4 className="bid-store-name">{bid.storeName}</h4>
                    <span className="verified-check-mini">✓</span>
                  </div>
                  <div className="bid-sub-rating">
                    <Star size={13} className="star-fill" />
                    <span className="rating-val">{bid.rating}</span>
                    <span className="reviews-val">({bid.reviews})</span>
                    <span className="sep-dot">•</span>
                    <span className="dist-val">{bid.city} • {bid.distance}</span>
                  </div>
                </div>
              </div>

              {/* Sağ: Fiyat & Detay Butonu */}
              <div className="bid-card-right">
                <div className="bid-price-group">
                  <span className="bid-timestamp">{bid.time}</span>
                  <span className="bid-price-number">{bid.price.toLocaleString('tr-TR')} TL</span>
                </div>

                <button 
                  className="btn-bid-action-view"
                  onClick={(e) => {
                    e.stopPropagation();
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
