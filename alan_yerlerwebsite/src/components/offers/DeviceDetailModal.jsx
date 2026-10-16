import React from 'react';
import { X, Cpu, HardDrive, Layers, Monitor, BatteryCharging, PackageCheck, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DeviceDetailModal({ device, onClose }) {
  if (!device) return null;

  const { category, specs = {}, condition = {}, photos = [] } = device;

  const categoryImages = {
    laptop: '/assets/categories/laptop.jpg',
    phone: '/assets/categories/phone.jpg',
    console: '/assets/categories/console.jpg',
    gpu: '/assets/categories/gpu.jpg',
    tablet: '/assets/categories/tablet.jpg',
    watch: '/assets/categories/watch.jpg',
    headphones: '/assets/categories/headphones.jpg',
    desktop: '/assets/categories/laptop.jpg'
  };

  const categoryName = typeof category === 'string' ? category : category?.name || '';
  const firstPhoto = typeof photos[0] === 'string' ? photos[0] : photos[0]?.path;
  const photoSrc = firstPhoto || categoryImages[categoryName] || categoryImages[category] || categoryImages.laptop;

  return (
    <div className="device-detail-modal-overlay" onClick={onClose}>
      <div className="device-detail-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Başlık */}
        <div className="device-modal-header">
          <div>
            <span className="modal-category-kicker">{categoryName ? categoryName.toUpperCase() : 'DONANIM'}</span>
            <h3 className="modal-device-title">{device.title || specs.model || specs.brand || 'Kayıtlı Cihaz'}</h3>
          </div>
          <button className="btn-modal-close" onClick={onClose} aria-label="Kapat">
            <X size={20} />
          </button>
        </div>

        {/* Görsel ve Temel Özet */}
        <div className="device-modal-hero-strip">
          <img src={photoSrc} alt={specs.model} className="modal-device-photo" />
          <div className="modal-hero-text">
            <h4>{specs.brand} {specs.series || ''}</h4>
            <div className="modal-quick-badges">
              {specs.cpu && <span className="spec-badge blue"><Cpu size={12} /> {specs.cpu}</span>}
              {specs.gpu && <span className="spec-badge purple"><Monitor size={12} /> {specs.gpu}</span>}
              {specs.ram && <span className="spec-badge indigo"><Layers size={12} /> {specs.ram}</span>}
              {specs.storage && <span className="spec-badge emerald"><HardDrive size={12} /> {specs.storage}</span>}
            </div>
          </div>
        </div>

        {/* Teknik Özellikler Tablosu */}
        <div className="device-modal-section">
          <h5 className="modal-section-title">Teknik Donanım Parametreleri</h5>
          <div className="modal-specs-grid">
            <div className="spec-grid-item">
              <span className="spec-item-key">İşlemci (CPU)</span>
              <strong className="spec-item-val">{specs.cpu || '—'}</strong>
            </div>
            <div className="spec-grid-item">
              <span className="spec-item-key">Ekran Kartı (GPU)</span>
              <strong className="spec-item-val">{specs.gpu || '—'}</strong>
            </div>
            <div className="spec-grid-item">
              <span className="spec-item-key">Bellek (RAM)</span>
              <strong className="spec-item-val">{specs.ram || '—'}</strong>
            </div>
            <div className="spec-grid-item">
              <span className="spec-item-key">Dahili Depolama</span>
              <strong className="spec-item-val">{specs.storage || '—'}</strong>
            </div>
            {specs.screenSize && (
              <div className="spec-grid-item">
                <span className="spec-item-key">Ekran / Boyut</span>
                <strong className="spec-item-val">{specs.screenSize}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Ekspertiz ve Kondisyon Durumu */}
        <div className="device-modal-section">
          <h5 className="modal-section-title">Ekspertiz ve Kondisyon Raporu</h5>
          <div className="modal-condition-cards">
            {condition.batteryHealth && condition.batteryHealth !== 'Yok' && (
              <div className="cond-item-pill">
                <BatteryCharging size={16} className="text-green" />
                <div>
                  <small>Pil Sağlığı</small>
                  <strong>{condition.batteryHealth}</strong>
                </div>
              </div>
            )}

            {condition.thermalHealth && (
              <div className="cond-item-pill">
                <span style={{ fontSize: '1.2rem' }}>❄️</span>
                <div>
                  <small>Termal & Fan</small>
                  <strong>{condition.thermalHealth}</strong>
                </div>
              </div>
            )}

            {specs.registrationStatus && (
              <div className="cond-item-pill">
                <span style={{ fontSize: '1.2rem' }}>🇹🇷</span>
                <div>
                  <small>BTK Kaydı</small>
                  <strong>{specs.registrationStatus}</strong>
                </div>
              </div>
            )}

            {specs.gamepads && (
              <div className="cond-item-pill">
                <span style={{ fontSize: '1.2rem' }}>🎮</span>
                <div>
                  <small>Kol (Gamepad)</small>
                  <strong>{specs.gamepads}</strong>
                </div>
              </div>
            )}

            {specs.gpuSecurity && (
              <div className="cond-item-pill">
                <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                <div>
                  <small>Güvenlik Bandı</small>
                  <strong>{specs.gpuSecurity}</strong>
                </div>
              </div>
            )}

            <div className="cond-item-pill">
              <Sparkles size={16} className="text-amber" />
              <div>
                <small>Kozmetik Kondisyon</small>
                <strong>{condition.cosmeticLabel || 'Sıfır Gibi'}</strong>
              </div>
            </div>

            <div className="cond-item-pill">
              <PackageCheck size={16} className="text-blue" />
              <div>
                <small>Kutu & Fatura</small>
                <strong>{condition.boxAndInvoice ? 'Mevcut (Orijinal)' : 'Yok'}</strong>
              </div>
            </div>

            <div className="cond-item-pill">
              <Shield size={16} className="text-indigo" />
              <div>
                <small>Garanti Süresi</small>
                <strong>{condition.warranty || 'Garantisiz'}</strong>
              </div>
            </div>

            <div className="cond-item-pill">
              <CheckCircle2 size={16} className="text-green" />
              <div>
                <small>Çalışma Durumu</small>
                <strong>{condition.workingState === 'perfect' ? 'Sorunsuz / Test Edildi' : 'Kusurlu'}</strong>
              </div>
            </div>
          </div>

          {condition.notes && (
            <div className="modal-user-notes">
              <strong>Satıcı Notu:</strong>
              <p>"{condition.notes}"</p>
            </div>
          )}
        </div>

        {/* Kapat Butonu */}
        <div className="device-modal-footer">
          <button className="btn-modal-action-close" onClick={onClose}>
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
