import React, { useEffect, useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { loadConversations } from '../../api';
import { presentConversation } from '../../conversation';

export default function MessagesInbox({
  token,
  notice,
  loadingOpen,
  onSelectConversation,
  onBackToHome,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadConversations(token)
      .then((list) => {
        if (!active) return;
        setRows((Array.isArray(list) ? list : []).map(presentConversation));
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Mesajlar alınamadı.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const query = searchQuery.trim().toLowerCase();
  const filtered = rows.filter((item) => {
    if (activeTab === 'offers' && !item.isOffer) return false;
    if (activeTab === 'favorites' && !item.isFavorite) return false;
    if (!query) return true;
    return [item.storeName, item.lastMessage, item.deviceTitle]
      .some((value) => value.toLowerCase().includes(query));
  });
  const totalUnread = rows.reduce((sum, item) => sum + item.unreadCount, 0);

  return (
    <div className="inbox-hub-container">
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

      {showSearchInput && (
        <div className="inbox-search-bar-reveal">
          <Search size={16} className="search-input-icon" />
          <input
            type="text"
            placeholder="Mağaza veya cihaz adı ile ara..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>
      )}

      <div className="inbox-filter-tabs">
        <button
          className={`filter-tab-pill ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>Tümü</span>
          <span className="tab-counter">({rows.length})</span>
        </button>
        <button
          className={`filter-tab-pill ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
        >
          <span>Tekliflerim</span>
          <span className="tab-counter">({rows.filter((item) => item.isOffer).length})</span>
        </button>
        <button
          className={`filter-tab-pill ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <span>Favoriler</span>
          <span className="tab-counter">({rows.filter((item) => item.isFavorite).length})</span>
        </button>
      </div>

      <div className="inbox-conversations-list">
        {(loading || loadingOpen) && (
          <div className="inbox-empty-notice">
            <p>{loadingOpen ? 'Konuşma açılıyor' : 'Mesajlar yükleniyor'}</p>
          </div>
        )}
        {!loading && (error || notice) && (
          <div className="inbox-empty-notice">
            <p className="auth-error">{error || notice}</p>
          </div>
        )}
        {!loading && !loadingOpen && !error && filtered.length === 0 && (
          <div className="inbox-empty-notice">
            <p>{rows.length === 0 ? 'Henüz mesaj yok' : 'Seçilen filtreye uygun mesaj bulunamadı.'}</p>
          </div>
        )}
        {!loading && !loadingOpen && filtered.map((conv) => (
          <div
            key={conv.id}
            className={`conversation-item-row ${conv.unreadCount > 0 ? 'unread' : ''}`}
            onClick={() => onSelectConversation(conv)}
          >
            <div className="conv-avatar-box">
              {conv.logoUrl ? <img src={conv.logoUrl} alt="" /> : <span className="conv-avatar-text">{conv.logo}</span>}
              {conv.unreadCount > 0 && <span className="conv-unread-dot" />}
            </div>

            <div className="conv-center-block">
              <div className="conv-header-line">
                <div className="conv-name-group">
                  <h4 className="conv-store-name">{conv.storeName}</h4>
                </div>
                <span className="conv-timestamp">{conv.time}</span>
              </div>

              <p className="conv-snippet-text">{conv.lastMessage || conv.deviceTitle || 'Mesaj yok'}</p>

              {conv.priceOffer != null && (
                <div className="conv-offer-pill-badge">
                  <span>Teklif:</span>
                  <strong>{conv.priceOffer.toLocaleString('tr-TR')} TL</strong>
                </div>
              )}
            </div>

            <div className="conv-right-block">
              {conv.unreadCount > 0 && (
                <span className="unread-counter-bubble">{conv.unreadCount}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
