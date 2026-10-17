import React, { useState } from 'react';
import { clearSession, loadSession } from './api';
import MarketTicker from './components/MarketTicker';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoriesGrid from './components/CategoriesGrid';
import HowItWorks from './components/HowItWorks';
import TrustBanner from './components/TrustBanner';
import StoresDirectory from './components/StoresDirectory';
import StoreDetail from './components/StoreDetail';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import Modal from './components/Modal';

// Modüller
import SellWizard from './components/wizard/SellWizard';
import OffersHub from './components/offers/OffersHub';
import MessagesView from './components/MessagesView';
import OnboardingShowcase from './components/onboarding/OnboardingShowcase';
import ProfileView from './components/ProfileView';
import AuthScreen from './components/AuthScreen';

const privateTabs = {
  wizard: 'sell',
  offers: 'offers',
  messages: 'messages',
  profile: 'profile',
};

export default function App() {
  const [session, setSession] = useState(() => loadSession());
  const [pendingView, setPendingView] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'wizard', 'offers', 'messages', 'stores', 'profile', 'auth'
  const [activeTab, setActiveTab] = useState('home');
  const [wizardInitialCategory, setWizardInitialCategory] = useState(null);
  const [wizardInitialSpecs, setWizardInitialSpecs] = useState(null);
  const [wizardInitialCondition, setWizardInitialCondition] = useState(null);
  const [submittedDevice, setSubmittedDevice] = useState(null);
  const [offersInitialMode, setOffersInitialMode] = useState('radar');
  const [offersFocusId, setOffersFocusId] = useState('');
  const [selectedChatStore, setSelectedChatStore] = useState(null);
  const [openedStore, setOpenedStore] = useState(null);
  const [storeBackView, setStoreBackView] = useState('stores');
  const [modalState, setModalState] = useState({ isOpen: false, data: null });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const openStoreDetail = (store, from) => {
    setOpenedStore(store);
    setStoreBackView(from);
    setCurrentView('store');
    setActiveTab('stores');
  };

  const closeStoreDetail = () => {
    const back = storeBackView || 'stores';
    setOpenedStore(null);
    setCurrentView(back);
    if (back === 'home' || back === 'stores') setActiveTab(back);
    else if (privateTabs[back]) setActiveTab(privateTabs[back]);
  };

  const openView = (view, options = {}) => {
    if (view !== 'store') setOpenedStore(null);
    if (view === 'messages' && !options.keepChat) setSelectedChatStore(null);
    if (view === 'offers' && !options.keepOffer) {
      setOffersInitialMode('board');
      setOffersFocusId('');
      setSubmittedDevice(null);
    }
    if (privateTabs[view] && !session) {
      setPendingView(view);
      setCurrentView('auth');
      setActiveTab(privateTabs[view]);
      return;
    }
    setCurrentView(view);
    if (privateTabs[view]) setActiveTab(privateTabs[view]);
    else if (view === 'home' || view === 'stores') setActiveTab(view);
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setPendingView(null);
    setCurrentView('home');
    setActiveTab('home');
  };

  const scrollToCategories = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('categoriesSection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('categoriesSection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Kategori seçildiğinde Satış Sihirbazını başlat
  const handleSelectCategory = (cat) => {
    setWizardInitialCategory(cat.id);
    setWizardInitialSpecs(null);
    setWizardInitialCondition(null);
    openView('wizard');
    if (session) showToast(`"${cat.name}" için Satış Sihirbazı başlatıldı.`);
  };

  // Değerleme seçildiğinde sihirbazı başlat
  const handleSelectValuation = (valData) => {
    setWizardInitialCategory(valData.category || 'laptop');
    if (valData.specs) {
      setWizardInitialSpecs(valData.specs);
    }
    if (valData.condition) {
      setWizardInitialCondition(valData.condition);
    }
    openView('wizard');
    if (session) showToast(`"${valData.modelName || 'Seçilen Cihaz'}" için teklif sihirbazı hazırlandı.`);
  };

  // Sihirbaz tamamlandığında Teklif Radarı ekranına aktar
  const handleWizardComplete = (deviceData) => {
    setSubmittedDevice(deviceData);
    setOffersInitialMode('list');
    setCurrentView('offers');
    setActiveTab('offers');
  };

  const handleOpenChat = (target) => {
    if (target?.listingId && target?.storeId) {
      setSelectedChatStore({
        listingId: target.listingId,
        storeId: target.storeId,
        nonce: Date.now(),
      });
      openView('messages', { keepChat: true });
      return;
    }
    showToast('Konuşma, size teklif veren mağazayla açılır.');
    openView('messages');
  };

  const handleOpenOffer = (thread) => {
    if (!thread?.listingId || !thread?.offerId) return;
    setSubmittedDevice({ id: thread.listingId });
    setOffersFocusId(thread.offerId);
    setOffersInitialMode('detail');
    openView('offers', { keepOffer: true });
  };

  const handleOpenHowItWorks = () => {
    setModalState({
      isOpen: true,
      data: { type: 'howItWorks' }
    });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, data: null });
  };

  return (
    <div className="app-root">
      {/* Yumuşak Ambiyans Işığı */}
      <div className="ambient-glow" />

      {/* 1. Canlı Piyasa Ticker */}
      <MarketTicker />

      {/* 2. Sticky Navbar */}
      <Navbar 
        onOpenHowItWorks={handleOpenHowItWorks}
        onScrollToCategories={scrollToCategories}
        onShowToast={showToast}
        session={session}
        active={activeTab}
        onViewChange={openView}
        onOpenProfile={() => openView('profile')}
        onLogout={handleLogout}
      />

      {/* GÖRÜNÜM YÖNETİMİ (ROUTING / SPA STATE) */}
      <main>
        {/* ANA SAYFA PORTALI */}
        {currentView === 'home' && (
          <>
            <Hero onStartSelling={() => openView('wizard')} />

            <CategoriesGrid 
              onSelectCategory={handleSelectCategory}
            />

            <HowItWorks 
              onOpenDetails={handleOpenHowItWorks}
            />

            <OnboardingShowcase 
              onStartSelling={() => openView('wizard')}
            />

            <TrustBanner 
              onOpenDetails={handleOpenHowItWorks}
            />

            <StoresDirectory 
              onStartChat={handleOpenChat}
              onOpenStore={(store) => openStoreDetail(store, 'home')}
            />
          </>
        )}

        {/* SATIŞ SİHİRBAZI */}
        {currentView === 'wizard' && session && (
          <SellWizard
            token={session.accessToken}
            initialCategory={wizardInitialCategory}
            initialSpecs={wizardInitialSpecs}
            initialCondition={wizardInitialCondition}
            onCancel={() => {
              setCurrentView('home');
              setActiveTab('home');
            }}
            onComplete={handleWizardComplete}
          />
        )}

        {/* CANLI TEKLİF RADARI, LİSTESİ & DETAYI */}
        {currentView === 'offers' && session && (
          <OffersHub
            token={session.accessToken}
            device={submittedDevice}
            initialMode={offersInitialMode}
            focusOfferId={offersFocusId}
            onBackToHome={() => {
              setCurrentView('home');
              setActiveTab('home');
            }}
            onOpenChat={handleOpenChat}
            onShowStoreProfile={(store) => {
              setCurrentView('stores');
              showToast(`${store.storeName || store.name} profili görüntüleniyor.`);
            }}
            onShowToast={showToast}
            onAddDevice={() => {
              setWizardInitialCategory(null);
              openView('wizard');
            }}
            onHowItWorks={handleOpenHowItWorks}
          />
        )}

        {/* CANLI MESAJLAŞMA & SÖZLEŞME EKRANI */}
        {currentView === 'messages' && session && (
          <MessagesView
            key={selectedChatStore?.nonce || 'inbox'}
            token={session.accessToken}
            chatTarget={selectedChatStore}
            device={submittedDevice}
            onBackToHome={() => {
              setCurrentView('home');
              setActiveTab('home');
            }}
            onShowToast={showToast}
            onOpenOffer={handleOpenOffer}
            onGoOffers={() => openView('offers')}
            onAddDevice={() => {
              setWizardInitialCategory(null);
              openView('wizard');
            }}
            onHowItWorks={handleOpenHowItWorks}
          />
        )}

        {/* ONAYLI MAĞAZALAR DİZİNİ */}
        {currentView === 'stores' && (
          <StoresDirectory 
            onStartChat={handleOpenChat}
            onOpenStore={(store) => openStoreDetail(store, 'stores')}
          />
        )}

        {currentView === 'store' && openedStore && (
          <StoreDetail
            store={openedStore}
            onBack={closeStoreDetail}
            onStartChat={handleOpenChat}
          />
        )}

        {/* KULLANICI PROFİLİ & İLANLARIM */}
        {currentView === 'auth' && (
          <AuthScreen
            onCancel={() => {
              setPendingView(null);
              setCurrentView('home');
              setActiveTab('home');
            }}
            onSuccess={(nextSession) => {
              const next = pendingView || 'profile';
              setSession(nextSession);
              setPendingView(null);
              setCurrentView(next);
              setActiveTab(privateTabs[next] || 'home');
            }}
          />
        )}

        {currentView === 'profile' && session && (
          <ProfileView
            user={session.user}
            token={session.accessToken}
            onSession={setSession}
            onLogout={handleLogout}
            onStartWizard={() => openView('wizard')}
            onGoToOffers={(dev) => {
              if (dev) setSubmittedDevice(dev);
              setOffersInitialMode('list');
              setCurrentView('offers');
              setActiveTab('offers');
            }}
            onGoToMessages={() => openView('messages')}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer (Masaüstü) */}
      <Footer 
        onOpenHowItWorks={handleOpenHowItWorks}
        onShowToast={showToast}
      />

      {/* Mobil Alt Tab Bar */}
      <MobileBottomNav 
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'home') openView('home');
          if (tab === 'offers') openView('offers');
          if (tab === 'messages') openView('messages');
          if (tab === 'sell') {
            setWizardInitialCategory(null);
            openView('wizard');
          }
          if (tab === 'profile') openView('profile');
        }}
        onSellClick={() => {
          setWizardInitialCategory(null);
          openView('wizard');
        }}
      />

      {/* Modallar */}
      <Modal 
        isOpen={modalState.isOpen}
        modalData={modalState.data}
        onClose={handleCloseModal}
        onProceedToWizard={() => openView('wizard')}
      />

      {/* Toast Bildirimi */}
      {toastMessage && (
        <div className="bespoke-toast">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
