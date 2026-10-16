import React from 'react';
import { Home, Tag, Plus, MessageCircle, User } from 'lucide-react';

export default function MobileBottomNav({ activeTab, onTabChange, onSellClick }) {
  return (
    <nav className="mobile-app-tabbar">
      <div className="mobile-tabs-flex">
        <div 
          className={`app-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => {
            onTabChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="app-tab-icon"><Home size={22} /></span>
          <span>Anasayfa</span>
        </div>

        <div 
          className={`app-tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => onTabChange('offers')}
        >
          <span className="app-tab-icon"><Tag size={22} /></span>
          <span>Teklifler</span>
        </div>

        {/* Ortadaki Mavi Dairesel [+] Cihaz Sat Butonu */}
        <div 
          className="app-tab-btn app-tab-sell-hub"
          onClick={onSellClick}
        >
          <div className="app-tab-sell-circle">
            <Plus size={26} strokeWidth={3} />
          </div>
          <span style={{ fontWeight: 700, color: '#1D63FF' }}>Cihaz Sat</span>
        </div>

        <div 
          className={`app-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => onTabChange('messages')}
        >
          <span className="app-tab-icon"><MessageCircle size={22} /></span>
          <span className="tab-unread-dot">2</span>
          <span>Mesajlar</span>
        </div>

        <div 
          className={`app-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <span className="app-tab-icon"><User size={22} /></span>
          <span>Profil</span>
        </div>
      </div>
    </nav>
  );
}
