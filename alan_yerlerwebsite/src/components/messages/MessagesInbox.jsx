import React, { useEffect, useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { loadConversations } from '../../api';
import { presentConversation } from '../../conversation';

const tabs = [
  ['all', 'Tümü'],
  ['offers', 'Teklifler'],
  ['favorites', 'Favoriler'],
];

export default function MessagesInbox({
  token,
  notice,
  loadingOpen,
  selectedId,
  onSelectConversation,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  return (
    <aside className="msg-list">
      <div className="msg-list-head">
        <strong>Konuşmalar</strong>
        <span>{rows.length}</span>
      </div>
      <label className="msg-search">
        <Search size={16} />
        <input
          type="search"
          placeholder="Mağaza veya cihaz ara"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </label>
      <div className="msg-filters">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="msg-list-body">
        {(loading || loadingOpen) && <p className="msg-list-note">{loadingOpen ? 'Konuşma açılıyor' : 'Mesajlar yükleniyor'}</p>}
        {!loading && (error || notice) && <p className="auth-error">{error || notice}</p>}
        {!loading && !loadingOpen && !error && filtered.length === 0 && (
          <div className="msg-list-empty">
            <MessageCircle size={22} />
            <p>{rows.length === 0 ? 'Henüz konuşma yok' : 'Bu filtrede konuşma yok.'}</p>
          </div>
        )}
        {!loading && !loadingOpen && filtered.map((conv) => (
          <button
            key={conv.id}
            type="button"
            className={`msg-row ${selectedId === conv.id ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}
            onClick={() => onSelectConversation(conv)}
          >
            <span className="msg-row-avatar">
              {conv.logoUrl ? <img src={conv.logoUrl} alt="" /> : conv.logo}
            </span>
            <span className="msg-row-copy">
              <strong>{conv.storeName}</strong>
              <em>{conv.lastMessage || conv.deviceTitle || 'Mesaj yok'}</em>
            </span>
            {conv.unreadCount > 0 && <span className="msg-row-count">{conv.unreadCount}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
