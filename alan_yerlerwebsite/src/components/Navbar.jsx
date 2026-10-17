import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, User, Plus } from 'lucide-react';
import { loadNotifications, markNotificationsRead } from '../api';
import { formatWhen, initials } from '../conversation';

export default function Navbar({ onOpenHowItWorks, onScrollToCategories, onShowToast, onViewChange, onOpenProfile, session, onLogout, active = 'home' }) {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notice, setNotice] = useState('');
  const notifRef = useRef(null);
  const token = session?.accessToken;

  const unreadCount = notifications.filter(n => n.unread).length;

  const refresh = useCallback(() => {
    if (!token) {
      setNotifications([]);
      return;
    }
    loadNotifications(token)
      .then((rows) => {
        setNotice('');
        setNotifications((Array.isArray(rows) ? rows : []).map(presentNotification));
      })
      .catch((reason) => {
        setNotifications([]);
        setNotice(reason instanceof Error ? reason.message : 'Bildirimler alınamadı.');
      });
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const markAllRead = async () => {
    try {
      await markNotificationsRead(token);
      setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    } catch (reason) {
      onShowToast(reason instanceof Error ? reason.message : 'Bildirimler işaretlenemedi.');
    }
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
          <a className={active === 'home' ? 'nav-anchor highlight-tab' : 'nav-anchor'} onClick={() => { if (onViewChange) onViewChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Keşfet</a>
          <a className="nav-anchor" onClick={onScrollToCategories}>Kategoriler</a>
          <a className="nav-anchor" onClick={onOpenHowItWorks}>Nasıl Çalışır?</a>
          <a className={active === 'offers' ? 'nav-anchor highlight-tab' : 'nav-anchor'} onClick={() => { if (onViewChange) onViewChange('offers'); }}>Teklifler</a>
          <a className={active === 'messages' ? 'nav-anchor highlight-tab' : 'nav-anchor'} onClick={() => { if (onViewChange) onViewChange('messages'); }}>Mesajlar</a>
          <a className={active === 'stores' ? 'nav-anchor highlight-tab' : 'nav-anchor'} onClick={() => { if (onViewChange) onViewChange('stores'); }}>Onaylı Mağazalar</a>
        </nav>

        {/* Actions */}
        <div className="nav-actions-group">
          {/* Notifications */}
          <div className="notif-wrapper" ref={notifRef}>
            <button 
              className="btn-circle-icon" 
              onClick={() => {
                if (!session) {
                  onOpenProfile();
                  return;
                }
                const next = !showNotif;
                setShowNotif(next);
                if (next) refresh();
              }}
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
                  {notice && <p className="auth-error">{notice}</p>}
                  {!notice && notifications.length === 0 && (
                    <p className="notif-body">Henüz bildirimin yok.</p>
                  )}
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className="notif-row"
                      onClick={() => {
                        setShowNotif(false);
                        if (n.unread) {
                          markNotificationsRead(token, n.id).catch(() => {});
                          setNotifications((prev) => prev.map((item) => (
                            item.id === n.id ? { ...item, unread: false } : item
                          )));
                        }
                        if (onViewChange) onViewChange('offers');
                      }}
                    >
                      <div className="notif-store-avatar">{n.avatar}</div>
                      <div className="notif-body">
                        <p><strong>{n.title}</strong> {n.body}</p>
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
          {session && (
            <button className="nav-session-chip" type="button" onClick={onLogout}>
              <span className="nav-user-name">{session.user.name}</span>
              <span className="nav-logout">Çıkış</span>
            </button>
          )}

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

function presentNotification(row) {
  const title = row.title || 'Bildirim';
  return {
    id: row.id,
    title,
    body: row.body || '',
    time: formatWhen(row.createdAt),
    unread: !row.readAt,
    avatar: initials(title),
  };
}
