import React, { useState, useEffect } from 'react';
import MessagesInbox from './MessagesInbox';
import ChatRoom from './ChatRoom';
import StoreProfileView from './StoreProfileView';

export default function MessagesHub({ 
  activeStore = null, 
  device = null, 
  onBackToHome, 
  onShowToast 
}) {
  const DEFAULT_TECHSTORE = {
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
    rating: 4.9,
    reviews: 320,
    city: "İstanbul",
    district: "Kadıköy",
    distance: "2.3 km",
    address: "Bağdat Cad. No:123, Kadıköy / İstanbul",
    phone: "+90 (216) 450 00 00",
    about: "10+ yıllık deneyimimizle laptop, bilgisayar, telefon ve oyun konsolu alım-satımı yapıyoruz. Tüm cihazlar için hızlı ve güvenilir teklif sunuyoruz."
  };

  const [subView, setSubView] = useState(activeStore ? 'chat' : 'inbox'); // 'inbox', 'chat', 'profile'
  const [selectedConversation, setSelectedConversation] = useState(activeStore || DEFAULT_TECHSTORE);

  useEffect(() => {
    if (activeStore) {
      setSelectedConversation(activeStore);
      setSubView('chat');
    }
  }, [activeStore]);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setSubView('chat');
  };

  const handleOpenStoreProfile = (store) => {
    setSelectedConversation(store || DEFAULT_TECHSTORE);
    setSubView('profile');
  };

  const handleBackToInbox = () => {
    setSubView('inbox');
  };

  const handleBackToChat = () => {
    setSubView('chat');
  };

  return (
    <div className="messages-hub-wrapper">
      {subView === 'inbox' && (
        <MessagesInbox 
          onSelectConversation={handleSelectConversation}
          onBackToHome={onBackToHome}
          onShowToast={onShowToast}
        />
      )}

      {subView === 'chat' && (
        <ChatRoom 
          conversation={selectedConversation}
          device={device}
          onBackToInbox={handleBackToInbox}
          onOpenStoreProfile={handleOpenStoreProfile}
          onShowToast={onShowToast}
        />
      )}

      {subView === 'profile' && (
        <StoreProfileView 
          store={selectedConversation}
          onBackToChat={handleBackToChat}
          onStartChat={(store) => {
            setSelectedConversation(store);
            setSubView('chat');
          }}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
}
