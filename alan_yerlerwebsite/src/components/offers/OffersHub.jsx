import React, { useState, useEffect } from 'react';
import OffersRadar from './OffersRadar';
import OffersList from './OffersList';
import OfferDetail from './OfferDetail';
import DeviceDetailModal from './DeviceDetailModal';
import { loadListings, loadOffers, mediaUrl } from '../../api';

export default function OffersHub({
  device,
  token,
  initialMode = 'radar',
  onBackToHome,
  onOpenChat,
  onShowStoreProfile,
  onShowToast
}) {
  const [mode, setMode] = useState(initialMode);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [listing, setListing] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    async function run() {
      try {
        const current = device?.id ? device : (await loadListings(token))[0] || null;
        if (!active) return;
        setListing(presentListing(current));
        if (!current?.id) {
          setOffers([]);
          return;
        }
        const rows = await loadOffers(token, current.id);
        if (!active) return;
        setOffers(rows.map((row, index) => presentOffer(row, index, rows, current.id)));
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : 'Teklifler alınamadı.');
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [token, device]);

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
          device={listing}
          offers={offers}
          loading={loading}
          onProceedToList={() => setMode('list')}
          onBackToHome={onBackToHome}
        />
      )}

      {mode === 'list' && (
        <OffersList
          device={listing}
          offers={offers}
          loading={loading}
          error={error}
          onBackToRadar={() => setMode('radar')}
          onSelectOffer={handleSelectOffer}
          onShowDeviceDetails={handleShowDeviceDetails}
        />
      )}

      {mode === 'detail' && (
        <OfferDetail
          offer={selectedOffer}
          device={listing}
          onBackToList={() => setMode('list')}
          onProceedToChat={(offer) => onOpenChat(offer)}
          onShowStoreProfile={(offer) => onShowStoreProfile(offer)}
        />
      )}

      {/* Cihaz Donanım & Ekspertiz Detay Modalı */}
      {showDeviceModal && (
        <DeviceDetailModal
          device={listing}
          onClose={() => setShowDeviceModal(false)}
        />
      )}
    </div>
  );
}

function readField(values, key) {
  if (!values || typeof values !== 'object') return '';
  if (values[key] === 'Diğer') return values[`${key}Diger`] || '';
  return values[key] || '';
}

function presentListing(listing) {
  if (!listing) return null;
  const specs = listing.specs || {};
  const condition = listing.condition || {};
  const photos = (listing.photos || []).map((photo) => (
    typeof photo === 'string' ? mediaUrl(photo) : mediaUrl(photo?.path)
  )).filter(Boolean);
  return {
    ...listing,
    title: listing.title || readField(specs, 'model'),
    category: listing.category?.slug || listing.category || '',
    photos,
    specs: {
      ...specs,
      brand: readField(specs, 'marka') || specs.brand || '',
      series: readField(specs, 'seri') || specs.series || '',
      model: listing.title || readField(specs, 'model') || specs.model || '',
      cpu: readField(specs, 'islemci') || specs.cpu || '',
      gpu: readField(specs, 'ekranKarti') || specs.gpu || '',
      ram: readField(specs, 'ram') || '',
      storage: readField(specs, 'depolama') || specs.storage || '',
      screenSize: readField(specs, 'ekranBoyutu') || specs.screenSize || '',
    },
    condition: {
      ...condition,
      cosmeticLabel: readField(condition, 'kozmetik') || condition.cosmeticLabel || '',
      batteryHealth: readField(condition, 'pilSagligi') || condition.batteryHealth || '',
    },
  };
}

function presentOffer(offer, index, rows, listingId) {
  const top = rows[0]?.price;
  const created = offer.createdAt ? new Date(offer.createdAt) : null;
  const time = created && !Number.isNaN(created.getTime())
    ? created.toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '';
  return {
    id: offer.id,
    listingId,
    storeId: offer.store.id,
    storeName: offer.store.name,
    logo: initials(offer.store.name),
    logoUrl: mediaUrl(offer.store.logo),
    coverUrl: mediaUrl(offer.store.cover),
    isHighest: index === 0 && offer.price === top,
    price: offer.price,
    time,
    rating: offer.store.rating,
    reviews: offer.store.reviewCount,
    city: offer.store.city || '',
    badges: offer.store.badges || [],
  };
}

function initials(name) {
  return `${name || '?'}`
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || '')
    .join('')
    .toUpperCase();
}
