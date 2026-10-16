import React, { useState, useEffect } from 'react';
import OffersRadar from './OffersRadar';
import OffersList from './OffersList';
import OfferDetail from './OfferDetail';
import DeviceDetailModal from './DeviceDetailModal';

export default function OffersHub({ 
  device, 
  initialMode = 'radar', 
  onBackToHome, 
  onOpenChat, 
  onShowStoreProfile, 
  onShowToast 
}) {
  const [mode, setMode] = useState(initialMode); // 'radar', 'list', 'detail'
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    setMode('detail');
  };

  const handleShowDeviceDetails = () => {
    setShowDeviceModal(true);
  };

  return (
    <div className="offers-hub-wrapper">
      {mode === 'radar' && (
        <OffersRadar 
          device={device}
          onProceedToList={() => setMode('list')}
          onBackToHome={onBackToHome}
        />
      )}

      {mode === 'list' && (
        <OffersList 
          device={device}
          onBackToRadar={() => setMode('radar')}
          onSelectOffer={handleSelectOffer}
          onShowDeviceDetails={handleShowDeviceDetails}
          onShowToast={onShowToast}
        />
      )}

      {mode === 'detail' && (
        <OfferDetail 
          offer={selectedOffer}
          device={device}
          onBackToList={() => setMode('list')}
          onProceedToChat={(offer) => onOpenChat(offer)}
          onShowStoreProfile={(offer) => onShowStoreProfile(offer)}
          onShowToast={onShowToast}
        />
      )}

      {/* Cihaz Donanım & Ekspertiz Detay Modalı */}
      {showDeviceModal && (
        <DeviceDetailModal 
          device={device}
          onClose={() => setShowDeviceModal(false)}
        />
      )}
    </div>
  );
}
