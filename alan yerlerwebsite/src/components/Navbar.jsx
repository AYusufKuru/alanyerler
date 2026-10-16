import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Plus } from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from '../data/marketplaceData';
import { loadSite } from '../api';

export default function Navbar({ onOpenHowItWorks, onScrollToCategories, onShowToast, onViewChange, onOpenProfile }) {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    loadSite()
      .then((site) => {
        if (Array.isArray(site.notifications) && site.notifications.length > 0) setNotifications(site.notifications);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    onShowToast('Tüm teklif bildirimleri okundu olarak işaretlendi.');
  };

  return (
    <header className="navbar-sticky">
      <div className="navbar-container">
        {/* Brand */}
        <a href="/" className="brand-identity" onClick={(e) => { e.preventDefault(); if (onViewChange) onViewChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="brand-badge-icon">AY</div>
          <div className="brand-titles">
            <div className="brand-title-main">Alan<span>Yerler</span></div>
            <div className="brand-title-sub">Doğrulanmış Pazar Yeri</div>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="nav-links-cluster">
          <a className="nav-anchor" onClick={() => { if (onViewChange) onViewChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Keşfet</a>
          <a className="nav-anchor" onClick={onScrollToCategories}>Kategoriler</a>
          <a className="nav-anchor" onClick={onOpenHowItWorks}>Nasıl Çalışır?</a>
          <a className="nav-anchor highlight-tab" onClick={() => { if (onViewChange) onViewChange('offers'); }}>Teklifler</a>
          <a className="nav-anchor" onClick={() => { if (onViewChange) onViewChange('messages'); }}>Mesajlar</a>
          <a className="nav-anchor" onClick={() => { if (onViewChange) onViewChange('stores'); }}>Onaylı Mağazalar</a>
        </nav>

        {/* Actions */}
        <div className="nav-actions-group">
          {/* Notifications */}
          <div className="notif-wrapper" ref={notifRef}>
            <button 
              className="btn-circle-icon" 
              onClick={() => setShowNotif(!showNotif)}
              aria-label="Bildirimler"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="notif-indicator-bubble">{unreadCount}</span>
              )}
            </button>

            {showNotif && (
              <div className="notif-popover">
                <div className="notif-popover-head">
                  <h4>Gelen Bildirimler</h4>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}>Okundu Say</button>
                  )}
                </div>
                <div className="notif-rows">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      className="notif-row"
                      onClick={() => {
                        setShowNotif(false);
                        if (onViewChange) onViewChange('offers');
                        onShowToast(`${n.store} teklif detayları açıldı.`);
                      }}
                    >
                      <div className="notif-store-avatar">{n.avatar}</div>
                      <div className="notif-body">
                        <p>{n.text}</p>
                        <span>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <button 
            className="btn-circle-icon" 
            onClick={() => {
              if (onOpenProfile) onOpenProfile();
              else if (onViewChange) onViewChange('profile');
            }}
            aria-label="Profil"
          >
            <User size={18} />
          </button>

          {/* Sell Button */}
          <button 
            className="btn-sell-primary" 
            onClick={() => {
              if (onViewChange) onViewChange('wizard');
            }}
          >
            <Plus size={16} strokeWidth={3} />
            <span>Cihazını Sat</span>
          </button>
        </div>
      </div>
    </header>
  );
}
