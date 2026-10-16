import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Tag, Plus, ArrowRight, Trash2, Heart, PhoneCall, CheckCircle } from 'lucide-react';
import { changePassword, deleteListing, loadListings, loadOffers, mediaUrl, saveSession } from '../api';

export default function ProfileView({ user, token, onSession, onLogout, onStartWizard, onGoToOffers, onGoToMessages, onShowToast }) {
  const [activeSubTab, setActiveSubTab] = useState('listings');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadListings(token)
      .then(async (rows) => {
        const withOffers = await Promise.all(rows.map(async (row) => {
          if (!row.offerCount) return { ...row, highestOffer: null, highestStore: '' };
          try {
            const offers = await loadOffers(token, row.id);
            const top = offers[0];
            return {
              ...row,
              highestOffer: typeof top?.price === 'number' ? top.price : null,
              highestStore: top?.store?.name || '',
            };
          } catch {
            return { ...row, highestOffer: null, highestStore: '' };
          }
        }));
        if (active) setDevices(withOffers);
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : 'İlanlar alınamadı.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  const handleDeleteDevice = async (id) => {
    try {
      await deleteListing(token, id);
      setDevices((current) => current.filter((item) => item.id !== id));
      onShowToast('İlan kaldırıldı.');
    } catch (reason) {
      onShowToast(reason instanceof Error ? reason.message : 'İlan kaldırılamadı.');
    }
  };

  const activeCount = devices.filter((item) => item.status !== 'kapatildi').length;
  const offerTotal = devices.reduce((sum, item) => sum + (item.offerCount || 0), 0);
  const highest = devices.reduce((best, item) => (
    typeof item.highestOffer === 'number' && (best == null || item.highestOffer > best)
      ? item.highestOffer
      : best
  ), null);

  const categoryImages = {
    telefon: '/assets/categories/phone.jpg',
    bilgisayar: '/assets/categories/laptop.jpg',
    'oyun-konsolu': '/assets/categories/console.jpg',
    'ekran-karti': '/assets/categories/gpu.jpg',
    tablet: '/assets/categories/tablet.jpg',
    'akilli-saat': '/assets/categories/watch.jpg',
    kulaklik: '/assets/categories/headphones.jpg',
  };

  return (
    <div className="profile-view-wrapper">
      {/* Profil Başlık Kartı */}
      <div className="user-profile-header-card">
        <div className="user-profile-avatar-large">
          <User size={36} />
          <span className="user-verified-badge"><ShieldCheck size={14} /></span>
        </div>

        <div className="user-profile-meta">
          <div className="user-name-row">
            <h2>{user.name}</h2>
            <span className="user-level-tag">Üye</span>
          </div>
          <p className="user-subtext">{user.email}</p>
        </div>

        <button className="btn-add-device-shortcut" onClick={onStartWizard}>
          <Plus size={16} />
          <span>Cihaz Sat</span>
        </button>
      </div>

      {/* İstatistik Sayaçları */}
      <div className="user-stats-counters-row">
        <div className="user-stat-card">
          <span className="stat-number">{activeCount}</span>
          <span className="stat-label">Aktif İlan</span>
        </div>
        <div className="user-stat-card highlight">
          <span className="stat-number">{offerTotal}</span>
          <span className="stat-label">Gelen Teklif</span>
        </div>
        <div className="user-stat-card">
          <span className="stat-number">{highest == null ? '—' : `${highest.toLocaleString('tr-TR')} ₺`}</span>
          <span className="stat-label">En Yüksek Teklif</span>
        </div>
        <div className="user-stat-card">
          <span className="stat-number">—</span>
          <span className="stat-label">Güven Skoru</span>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="profile-tabs-filter">
        <button 
          className={`profile-tab-pill ${activeSubTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('listings')}
        >
          <Tag size={16} />
          <span>İlanlarım ({devices.length})</span>
        </button>

        <button 
          className={`profile-tab-pill ${activeSubTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('favorites')}
        >
          <Heart size={16} />
          <span>Takip Edilen Mağazalar</span>
        </button>

        <button 
          className={`profile-tab-pill ${activeSubTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('security')}
        >
          <ShieldCheck size={16} />
          <span>Güvenli Satış & Destek</span>
        </button>
      </div>

      {/* İlanlarım Sekmesi */}
      {activeSubTab === 'listings' && (
        <div className="profile-listings-stack">
          {loading ? (
            <div className="profile-empty-card">
              <h3>İlanlar yükleniyor</h3>
            </div>
          ) : error ? (
            <div className="profile-empty-card">
              <h3>İlanlar alınamadı</h3>
              <p>{error}</p>
            </div>
          ) : devices.length === 0 ? (
            <div className="profile-empty-card">
              <Tag size={36} className="text-muted" />
              <h3>Henüz kayıtlı ilanınız yok</h3>
              <p>Hemen cihazınızı ekleyerek onaylı mağazalardan anında teklif toplayın.</p>
              <button className="btn-profile-create" onClick={onStartWizard}>
                + İlk Cihazını Ekle
              </button>
            </div>
          ) : (
            devices.map((dev) => {
              const specsLine = [
                fieldText(dev.specs, 'islemci'),
                fieldText(dev.specs, 'ram'),
                fieldText(dev.specs, 'depolama'),
                fieldText(dev.condition, 'kozmetik'),
              ].filter(Boolean).join(' • ');
              const photo = mediaUrl(dev.photos?.[0]?.path) || categoryImages[dev.category?.slug] || categoryImages.bilgisayar;
              const canDelete = dev.status === 'bekliyor' && !dev.offerCount;
              return (
              <div key={dev.id} className="profile-device-item-card">
                <div className="device-item-thumb-box">
                  <img 
                    src={photo}
                    alt="Cihaz" 
                    className="device-item-img"
                  />
                </div>

                <div className="device-item-meta">
                  <div className="device-item-status-pill">
                    <span className="status-live-pulse" />
                    <span>{statusLabel(dev)}</span>
                  </div>

                  <h3 className="device-item-title">
                    {dev.title || dev.deviceType?.name || 'İlan'}
                  </h3>

                  {specsLine && (
                    <p className="device-item-specs-sub">{specsLine}</p>
                  )}

                  {typeof dev.highestOffer === 'number' && (
                    <div className="device-highest-offer-tag">
                      En Yüksek Teklif: <strong>{dev.highestOffer.toLocaleString('tr-TR')} TL</strong>
                      {dev.highestStore ? ` (${dev.highestStore})` : ''}
                    </div>
                  )}
                </div>

                <div className="device-item-actions">
                  <button 
                    className="btn-view-offers-action"
                    onClick={() => onGoToOffers(dev)}
                  >
                    <span>Teklifleri Gör</span>
                    <ArrowRight size={15} />
                  </button>

                  {canDelete && (
                    <button 
                      className="btn-delete-listing"
                      onClick={() => handleDeleteDevice(dev.id)}
                      title="İlanı Kaldır"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              );
            })
          )}
        </div>
      )}

      {/* Favoriler Sekmesi */}
      {activeSubTab === 'favorites' && (
        <div className="profile-empty-card">
          <Heart size={36} className="text-muted" />
          <h3>Takip edilen mağaza yok</h3>
          <p>Mağaza takibi henüz hesaba yazılmıyor.</p>
        </div>
      )}

      {/* Güvenlik & Destek Sekmesi */}
      {activeSubTab === 'security' && (
        <div className="profile-security-card">
          <div className="security-guide-row">
            <CheckCircle size={20} className="text-emerald" />
            <div>
              <strong>Uygulama İndirmeden Güvenli Satış</strong>
              <p>Tarayıcınız üzerinden oluşturduğunuz teklif sözleşmesi her iki taraf için de bağlayıcıdır.</p>
            </div>
          </div>

          <div className="security-guide-row">
            <CheckCircle size={20} className="text-emerald" />
            <div>
              <strong>Elden Teslim veya Korumalı Kargo</strong>
              <p>Cihazınızı mağazada elden nakit karşılığı veya ücretsiz sigortalı kargo ile satabilirsiniz.</p>
            </div>
          </div>

          <div className="security-guide-row">
            <PhoneCall size={20} className="text-blue" />
            <div>
              <strong>7/24 Alan Yerler Destek Hattı</strong>
              <p>Tüm süreç boyunca sorularınız için müşteri hizmetleri ekibimiz yanınızda.</p>
            </div>
          </div>

          <PasswordForm
            token={token}
            onSession={onSession}
            onShowToast={onShowToast}
          />

          <button className="auth-switch" type="button" onClick={onLogout}>
            Çıkış yap
          </button>
        </div>
      )}
    </div>
  );
}

function fieldText(values, key) {
  if (!values || typeof values !== 'object') return '';
  if (values[key] === 'Diğer') return values[`${key}Diger`] || '';
  return values[key] || '';
}

function statusLabel(listing) {
  if (listing.status === 'kapatildi') return 'Kapatıldı';
  if (listing.offerCount > 0 || listing.status === 'teklif_var') return 'Teklif var';
  return 'Teklif bekleniyor';
}

function PasswordForm({ token, onSession, onShowToast }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (currentPassword.length < 8 || newPassword.length < 8) {
      setError('Şifre en az 8 karakter olmalı.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const session = await changePassword(token, currentPassword, newPassword);
      saveSession(session);
      onSession(session);
      setCurrentPassword('');
      setNewPassword('');
      onShowToast('Şifre güncellendi. Mobil uygulamada da bu şifre geçerli.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Şifre güncellenemedi.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="password-form" onSubmit={handleSubmit}>
      <strong>Şifre değiştir</strong>
      <label className="wizard-form-cell">
        <span className="wizard-cell-label">Mevcut şifre</span>
        <input
          className="wizard-select-control"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          autoComplete="current-password"
        />
      </label>
      <label className="wizard-form-cell">
        <span className="wizard-cell-label">Yeni şifre</span>
        <input
          className="wizard-select-control"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          autoComplete="new-password"
        />
      </label>
      {error && <div className="auth-error">{error}</div>}
      <button className="wizard-primary-submit-btn" type="submit" disabled={busy}>
        {busy ? 'Bekleyin…' : 'Şifreyi kaydet'}
      </button>
    </form>
  );
}
