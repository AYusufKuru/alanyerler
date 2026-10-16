import React, { useState } from 'react';
import { ArrowLeft, Check, Star } from 'lucide-react';
import SaleStatus from './SaleStatus';

const fallbackTerms = [
  'Elden teslim',
  'Cihaz mağazada kontrol edilir',
  'Ödeme aynı gün',
  'Teklif toplama süresi 1 saattir',
];

export default function OfferDetail({ offer, device, onBackToList, onProceedToChat, onAccept }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!offer) return null;

  const terms = offer.terms?.length ? offer.terms : fallbackTerms;
  const accepted = offer.accepted || device?.acceptedOfferId === offer.id;
  const otherAccepted = Boolean(device?.acceptedOfferId && device.acceptedOfferId !== offer.id);
  const rating = offer.rating == null
    ? ''
    : offer.reviews == null
      ? String(offer.rating)
      : `${offer.rating} · ${offer.reviews} değerlendirme`;

  async function accept() {
    setBusy(true);
    setError('');
    try {
      await onAccept(offer);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Teklif kabul edilemedi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="offer-detail-view-container">
      <div className="detail-top-nav-bar">
        <button className="wizard-nav-icon-btn" onClick={onBackToList} aria-label="Geri">
          <ArrowLeft size={20} />
        </button>
        <h2 className="detail-page-title">Teklif Detayı</h2>
        <div style={{ width: 38 }} />
      </div>

      <div className="special-offer-price-card">
        <div className="offer-giant-price">
          {offer.price.toLocaleString('tr-TR')} TL
        </div>
        <p className={`offer-kind-line ${offer.kind === 'kesin' ? 'kesin' : 'on'}`}>
          {offer.label || 'Ön Teklif'}
        </p>
        {offer.disclaimer ? <p className="offer-disclaimer">{offer.disclaimer}</p> : null}
        {offer.revision ? <p className="offer-revision">{offer.revision}</p> : null}

        <h3 className="store-name-bold offer-detail-store">{offer.storeName}</h3>
        {rating && (
          <p className="offer-detail-rating">
            <Star size={16} className="star-fill" />
            <span>{rating}</span>
          </p>
        )}
        {offer.verified && (
          <p className="offer-detail-verified">
            <Check size={16} />
            <span>Doğrulanmış İşletme</span>
          </p>
        )}

        {accepted && <SaleStatus sale={device?.sale} />}

        <h4 className="offer-terms-title">Teklif şartları</h4>
        <ul className="offer-terms-list">
          {terms.map((term) => <li key={term}>{term}</li>)}
        </ul>

        {error ? <p className="offer-accept-error">{error}</p> : null}
        <button
          type="button"
          className="btn-offer-accept"
          disabled={busy || accepted || otherAccepted}
          onClick={accept}
        >
          {accepted ? 'Teklif kabul edildi' : otherAccepted ? 'Başka teklif kabul edildi' : 'Teklifi Kabul Et'}
        </button>
        <button
          type="button"
          className="btn-offer-message"
          onClick={() => onProceedToChat(offer)}
        >
          Mağazaya Mesaj Gönder
        </button>
      </div>

      <div className="offer-specs-table-card">
        <h4 className="specs-table-title">Cihaz</h4>
        <div className="specs-table-rows">
          <div className="spec-table-row">
            <span className="spec-field-name">Cihaz</span>
            <strong className="spec-field-val">{device?.specs?.model || device?.title || 'İlan'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
