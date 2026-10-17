import React, { useState, useEffect } from 'react';
import OffersRadar from './OffersRadar';
import OffersList from './OffersList';
import OfferDetail from './OfferDetail';
import OffersBoard from './OffersBoard';
import DeviceDetailModal from './DeviceDetailModal';
import { acceptOffer, cancelListing, loadListings, loadOffers, mediaUrl } from '../../api';
import ListingEdit from './ListingEdit';

export default function OffersHub({
  device,
  token,
  initialMode = 'radar',
  focusOfferId = '',
  onBackToHome,
  onOpenChat,
  onShowStoreProfile,
  onShowToast,
  onAddDevice,
  onHowItWorks,
}) {
  const [mode, setMode] = useState(initialMode);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [listing, setListing] = useState(null);
  const [board, setBoard] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    async function run() {
      try {
        if (initialMode === 'board' && !focusOfferId) {
          const rows = await loadListings(token);
          if (!active) return;
          setBoard(Array.isArray(rows) ? rows : []);
          return;
        }
        const current = device?.id ? device : (await loadListings(token))[0] || null;
        if (!active) return;
        setListing(presentListing(current));
        if (!current?.id) {
          setOffers([]);
          return;
        }
        const rows = await loadOffers(token, current.id);
        if (!active) return;
        const presented = rows.map((row, index) => presentOffer(row, index, rows, current.id));
        setOffers(presented);
        const focused = presented.find((row) => row.id === focusOfferId);
        if (focused) setSelectedOffer(focused);
        else if (focusOfferId) setMode('list');
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
  }, [token, device, focusOfferId, initialMode]);

  async function handleAccept(offer) {
    if (!listing?.id) throw new Error('İlan bulunamadı.');
    const result = await acceptOffer(token, listing.id, offer.id);
    setListing((current) => current ? { ...current, acceptedOfferId: offer.id, status: 'kabul', sale: result?.sale } : current);
    setOffers((rows) => rows.map((row) => ({ ...row, accepted: row.id === offer.id })));
    setSelectedOffer((current) => current ? { ...current, accepted: current.id === offer.id } : current);
  }

  async function cancelOwnedListing(row) {
    if (!window.confirm('İlan iptal edilsin mi? Yeni teklif gelmez.')) return;
    try {
      await cancelListing(token, row.id);
      setBoard((rows) => rows.map((item) => item.id === row.id ? { ...item, status: 'kapatildi' } : item));
      setListing((current) => current?.id === row.id ? { ...current, status: 'kapatildi' } : current);
      setMode('board');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'İlan iptal edilemedi.');
    }
  }

  async function openBoardListing(row) {
    const presented = presentListing(row);
    setListing(presented);
    setMode('list');
    setLoading(true);
    setError('');
    try {
      const rows = await loadOffers(token, row.id);
      setOffers(rows.map((item, index) => presentOffer(item, index, rows, row.id)));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Teklifler alınamadı.');
    } finally {
      setLoading(false);
    }
  }

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    setMode('detail');
  };

  const handleShowDeviceDetails = () => {
    setShowDeviceModal(true);
  };

  return (
    <div className={mode === 'board' ? 'offers-hub-wrapper offers-hub-board' : 'offers-hub-wrapper'}>
      {editing && (
        <ListingEdit
          token={token}
          listing={editing}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setBoard((rows) => rows.map((item) => item.id === saved.id ? { ...item, ...saved } : item));
            setListing((current) => current?.id === saved.id ? presentListing({ ...current, ...saved }) : current);
            setEditing(null);
          }}
        />
      )}

      {mode === 'board' && !editing && (
        <OffersBoard
          listings={board}
          loading={loading}
          error={error}
          onOpen={openBoardListing}
          onEdit={setEditing}
          onCancel={cancelOwnedListing}
          onAdd={onAddDevice}
          onHow={onHowItWorks}
        />
      )}

      {mode === 'radar' && (
        <OffersRadar
          device={listing}
          offers={offers}
          loading={loading}
          onProceedToList={() => setMode('list')}
          onBackToHome={onBackToHome}
        />
      )}

      {mode === 'list' && !editing && (
        <OffersList
          device={listing}
          offers={offers}
          loading={loading}
          error={error}
          onBackToRadar={() => setMode(initialMode === 'board' ? 'board' : 'radar')}
          onSelectOffer={handleSelectOffer}
          onShowDeviceDetails={handleShowDeviceDetails}
          onEdit={() => listing && setEditing(listing)}
          onCancel={() => listing && cancelOwnedListing(listing)}
        />
      )}

      {mode === 'detail' && selectedOffer && (
        <OfferDetail
          offer={selectedOffer}
          device={listing}
          onBackToList={() => setMode('list')}
          onProceedToChat={(offer) => onOpenChat(offer)}
          onShowStoreProfile={(offer) => onShowStoreProfile(offer)}
          onAccept={handleAccept}
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
    openedPrice: offer.openedPrice,
    kind: offer.kind,
    label: offer.label,
    disclaimer: offer.disclaimer,
    revision: offer.revision,
    terms: Array.isArray(offer.terms) ? offer.terms : [],
    accepted: offer.accepted === true,
    verified: offer.store?.verified === true,
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
