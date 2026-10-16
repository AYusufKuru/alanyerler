import React, { useState } from 'react';
import { Search, CheckCheck, ChevronRight, Laptop, Smartphone, Gamepad2, ArrowLeft, Filter } from 'lucide-react';

export default function MessagesInbox({ onSelectConversation, onBackToHome, onShowToast }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'offers', 'favorites'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const rawConversations = [
    {
      id: "conv-techstore",
      storeName: "TechStore",
      logo: "TECH",
      verified: true,
      lastMessage: "Merhaba, cihazınız için 42.500 TL teklifimizi iletebilirim. İsterseniz detayları konuşalım.",
      time: "14:32",
      unreadCount: 2,
      deviceThumb: "/assets/categories/laptop.jpg",
      deviceTitle: "MacBook Pro 14\" (2023)",
      priceOffer: 42500,
      isOffer: true,
      isFavorite: true,
      rating: 4.9,
      reviews: 320,
      district: "Kadıköy / İstanbul"
    },
    {
      id: "conv-giga",
      storeName: "Giga Bilişim",
      logo: "GIGA",
      verified: true,
      lastMessage: "Cihazın durumu çok iyi görünüyor. 41.000 TL teklifimiz geçerlidir.",
      time: "13:15",
      unreadCount: 1,
      deviceThumb: "/assets/categories/laptop.jpg",
      deviceTitle: "MacBook Pro 14\" (2023)",
      priceOffer: 41000,
      isOffer: true,
      isFavorite: false,
      rating: 4.8,
      reviews: 180,
      district: "Şişli / İstanbul"
    },
    {
      id: "conv-nova",
      storeName: "Nova Teknoloji",
      logo: "N",
      verified: false,
      lastMessage: "Merhaba, 39.750 TL teklif sunabiliyoruz. Detayları konuşabiliriz.",
      time: "12:48",
      unreadCount: 0,
      deviceThumb: "/assets/categories/laptop.jpg",
      deviceTitle: "MacBook Pro 14\" (2023)",
      priceOffer: 39750,
      isOffer: true,
      isFavorite: true,
      rating: 4.7,
      reviews: 210,
      district: "Çankaya / Ankara"
    },
    {
      id: "conv-plus",
      storeName: "Plus Elektronik",
      logo: "PLUS",
      verified: false,
      lastMessage: "Teklifimiz 38.500 TL'dir. İletişim bilgilerinizi paylaşabilir misiniz?",
      time: "11:03",
      unreadCount: 0,
      deviceThumb: "/assets/categories/laptop.jpg",
      deviceTitle: "MacBook Pro 14\" (2023)",
      priceOffer: 38500,
      isOffer: true,
      isFavorite: false,
      rating: 4.6,
      reviews: 95,
      district: "Konak / İzmir"
    },
    {
      id: "conv-metro",
      storeName: "Metro Bilişim",
      logo: "M",
      verified: false,
      lastMessage: "Cihazınızla ilgileniyoruz. 37.000 TL teklifimiz geçerlidir.",
      time: "10:21",
      unreadCount: 0,
      deviceThumb: "/assets/categories/laptop.jpg",
      deviceTitle: "MacBook Pro 14\" (2023)",
      priceOffer: 37000,
      isOffer: true,
      isFavorite: false,
      rating: 4.5,
      reviews: 140,
      district: "Kadıköy / İstanbul"
    },
    {
      id: "conv-databilgisayar",
      storeName: "DataBilgisayar",
      logo: "DATA",
      verified: false,
      lastMessage: "Merhaba, cihazın faturası var mı? Varsa 39.000 TL teklif sunabiliriz.",
      time: "Dün",
      unreadCount: 0,
      deviceThumb: "/assets/categories/laptop.jpg",
      deviceTitle: "MacBook Pro 14\" (2023)",
      priceOffer: 39000,
      isOffer: true,
      isFavorite: false,
      rating: 4.4,
      reviews: 82,
      district: "Üsküdar / İstanbul"
    },
    {
      id: "conv-smarttech",
      storeName: "SmartTech",
      logo: "ST",
      verified: true,
      lastMessage: "Cihazla ilgili birkaç sorumuz var.",
      time: "Dün",
      unreadCount: 0,
      deviceThumb: "/assets/categories/laptop.jpg",
      deviceTitle: "MacBook Pro 14\" (2023)",
      priceOffer: null,
      isOffer: false,
      isFavorite: false,
      rating: 4.6,
      reviews: 110,
      district: "Bakırköy / İstanbul"
    }
  ];

  // Filtreleme
  const filteredConversations = rawConversations.filter(item => {
    // Sekme filtresi
    if (activeTab === 'offers' && !item.isOffer) return false;
    if (activeTab === 'favorites' && !item.isFavorite) return false;

    // Arama filtresi
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.storeName.toLowerCase().includes(q);
      const matchMsg = item.lastMessage.toLowerCase().includes(q);
      const matchDevice = item.deviceTitle.toLowerCase().includes(q);
      return matchName || matchMsg || matchDevice;
    }

    return true;
  });

  const totalUnread = rawConversations.reduce((acc, curr) => acc + curr.unreadCount, 0);

  return (
    <div className="inbox-hub-container">
      {/* Üst Bar */}
      <div className="inbox-top-nav-bar">
        <div className="inbox-nav-left">
          <button className="wizard-nav-icon-btn" onClick={onBackToHome} aria-label="Geri">
            <ArrowLeft size={20} />
          </button>
          <h2 className="inbox-nav-title">Mesajlar</h2>
          {totalUnread > 0 && (
            <span className="inbox-global-badge">{totalUnread} Yeni</span>
          )}
        </div>

        <div className="inbox-nav-right">
          <button 
            className={`wizard-nav-icon-btn ${showSearchInput ? 'active' : ''}`}
            onClick={() => setShowSearchInput(!showSearchInput)}
            aria-label="Ara"
          >
            <Search size={19} />
          </button>
        </div>
      </div>

      {/* Arama Girişi (Açılır-Kapanır) */}
      {showSearchInput && (
        <div className="inbox-search-bar-reveal">
          <Search size={16} className="search-input-icon" />
          <input 
            type="text" 
            placeholder="Mağaza veya cihaz adı ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
      )}

      {/* Filtre Sekmeleri (Fotoğraf 1 Sol Birebir) */}
      <div className="inbox-filter-tabs">
        <button 
          className={`filter-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>Tümü</span>
          <span className="tab-counter">({rawConversations.length})</span>
        </button>

        <button 
          className={`filter-tab-pill ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
        >
          <span>Tekliflerim</span>
          <span className="tab-counter">({rawConversations.filter(i => i.isOffer).length})</span>
        </button>

        <button 
          className={`filter-tab-pill ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <span>Favoriler</span>
          <span className="tab-counter">({rawConversations.filter(i => i.isFavorite).length})</span>
        </button>
      </div>

      {/* Mesaj Öğeleri Listesi */}
      <div className="inbox-conversations-list">
        {filteredConversations.length === 0 ? (
          <div className="inbox-empty-notice">
            <Filter size={32} />
            <p>Seçilen filtreye uygun mesaj bulunamadı.</p>
          </div>
        ) : (
          filteredConversations.map(conv => (
            <div 
              key={conv.id} 
              className={`conversation-item-row ${conv.unreadCount > 0 ? 'unread' : ''}`}
              onClick={() => onSelectConversation(conv)}
            >
              {/* Sol: Avatar */}
              <div className="conv-avatar-box">
                <span className="conv-avatar-text">{conv.logo}</span>
                {conv.unreadCount > 0 && <span className="conv-unread-dot" />}
              </div>

              {/* Orta: İçerik */}
              <div className="conv-center-block">
                <div className="conv-header-line">
                  <div className="conv-name-group">
                    <h4 className="conv-store-name">{conv.storeName}</h4>
                    {conv.verified && <span className="verified-badge-check">✓</span>}
                  </div>
                  <span className="conv-timestamp">{conv.time}</span>
                </div>

                <p className="conv-snippet-text">{conv.lastMessage}</p>

                {conv.priceOffer && (
                  <div className="conv-offer-pill-badge">
                    <span>Teklif:</span>
                    <strong>{conv.priceOffer.toLocaleString('tr-TR')} TL</strong>
                  </div>
                )}
              </div>

              {/* Sağ: İlan Görseli & Okunmamış Rozeti */}
              <div className="conv-right-block">
                {conv.unreadCount > 0 ? (
                  <span className="unread-counter-bubble">{conv.unreadCount}</span>
                ) : (
                  <img src={conv.deviceThumb} alt="Cihaz" className="conv-device-mini-thumb" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
