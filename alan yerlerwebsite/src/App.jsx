import React, { useState } from 'react';
import MarketTicker from './components/MarketTicker';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoriesGrid from './components/CategoriesGrid';
import HowItWorks from './components/HowItWorks';
import TrustBanner from './components/TrustBanner';
import StoresDirectory from './components/StoresDirectory';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import Modal from './components/Modal';

// Modüller
import SellWizard from './components/wizard/SellWizard';
import OffersHub from './components/offers/OffersHub';
import MessagesView from './components/MessagesView';
import OnboardingShowcase from './components/onboarding/OnboardingShowcase';
import ProfileView from './components/ProfileView';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'wizard', 'offers', 'messages', 'stores', 'profile'
  const [activeTab, setActiveTab] = useState('home');
  const [wizardInitialCategory, setWizardInitialCategory] = useState(null);
  const [wizardInitialSpecs, setWizardInitialSpecs] = useState(null);
  const [wizardInitialCondition, setWizardInitialCondition] = useState(null);
  const [submittedDevice, setSubmittedDevice] = useState(null);
  const [offersInitialMode, setOffersInitialMode] = useState('radar');
  const [selectedChatStore, setSelectedChatStore] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, data: null });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
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
    setCurrentView('wizard');
    setActiveTab('sell');
    showToast(`"${cat.name}" için Satış Sihirbazı başlatıldı.`);
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
    setCurrentView('wizard');
    setActiveTab('sell');
    showToast(`"${valData.modelName || 'Seçilen Cihaz'}" için teklif sihirbazı hazırlandı.`);
  };

  // Sihirbaz tamamlandığında Teklif Radarı ekranına aktar
  const handleWizardComplete = (deviceData) => {
    setSubmittedDevice(deviceData);
    setOffersInitialMode('radar');
    setCurrentView('offers');
    setActiveTab('offers');
    showToast('🚀 Cihazınız işletmelere başarıyla iletildi! Dağıtım radarı aktif.');
  };

  const handleOpenChat = (storeOrBid) => {
    setSelectedChatStore(storeOrBid);
    setCurrentView('messages');
    setActiveTab('messages');
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
        onViewChange={(view) => {
          setCurrentView(view);
          setActiveTab(view);
        }}
        onOpenProfile={() => {
          setCurrentView('profile');
          setActiveTab('profile');
        }}
      />

      {/* GÖRÜNÜM YÖNETİMİ (ROUTING / SPA STATE) */}
      <main>
        {/* ANA SAYFA PORTALI */}
        {currentView === 'home' && (
          <>
            <Hero 
              onSelectValuation={handleSelectValuation}
              onOpenHowItWorks={handleOpenHowItWorks}
            />

            <CategoriesGrid 
              onSelectCategory={handleSelectCategory}
            />

            <HowItWorks 
              onOpenDetails={handleOpenHowItWorks}
            />

            <OnboardingShowcase 
              onStartSelling={() => {
                setCurrentView('wizard');
                setActiveTab('sell');
              }}
            />

            <TrustBanner 
              onOpenDetails={handleOpenHowItWorks}
            />

            <StoresDirectory 
              onStartChat={handleOpenChat}
              onShowToast={showToast}
            />
          </>
        )}

        {/* SATIŞ SİHİRBAZI */}
        {currentView === 'wizard' && (
          <SellWizard 
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
        {currentView === 'offers' && (
          <OffersHub 
            device={submittedDevice}
            initialMode={offersInitialMode}
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
          />
        )}

        {/* CANLI MESAJLAŞMA & SÖZLEŞME EKRANI */}
        {currentView === 'messages' && (
          <MessagesView 
            activeStore={selectedChatStore}
            device={submittedDevice}
            onBackToHome={() => {
              setCurrentView('home');
              setActiveTab('home');
            }}
            onShowToast={showToast}
          />
        )}

        {/* ONAYLI MAĞAZALAR DİZİNİ */}
        {currentView === 'stores' && (
          <StoresDirectory 
            onStartChat={handleOpenChat}
            onShowToast={showToast}
          />
        )}

        {/* KULLANICI PROFİLİ & İLANLARIM */}
        {currentView === 'profile' && (
          <ProfileView 
            onStartWizard={() => {
              setCurrentView('wizard');
              setActiveTab('sell');
            }}
            onGoToOffers={(dev) => {
              if (dev) setSubmittedDevice(dev);
              setOffersInitialMode('list');
              setCurrentView('offers');
              setActiveTab('offers');
            }}
            onGoToMessages={() => {
              setCurrentView('messages');
              setActiveTab('messages');
            }}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer (Masaüstü) */}
      <Footer 
        onSelectCategory={handleSelectCategory}
        onOpenHowItWorks={handleOpenHowItWorks}
        onShowToast={showToast}
      />

      {/* Mobil Alt Tab Bar */}
      <MobileBottomNav 
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'home') setCurrentView('home');
          if (tab === 'offers') {
            setOffersInitialMode('list');
            setCurrentView('offers');
          }
          if (tab === 'messages') setCurrentView('messages');
          if (tab === 'sell') {
            setCurrentView('wizard');
            setWizardInitialCategory(null);
          }
          if (tab === 'profile') {
            setCurrentView('profile');
          }
        }}
        onSellClick={() => {
          setCurrentView('wizard');
          setActiveTab('sell');
        }}
      />

      {/* Modallar */}
      <Modal 
        isOpen={modalState.isOpen}
        modalData={modalState.data}
        onClose={handleCloseModal}
        onProceedToWizard={() => {
          setCurrentView('wizard');
          setActiveTab('sell');
        }}
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
