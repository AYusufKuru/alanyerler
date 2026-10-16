import React from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Modal({ isOpen, onClose, modalData, onProceedToWizard }) {
  if (!isOpen || !modalData) return null;

  return (
    <div className="bespoke-modal-layer" onClick={onClose}>
      <div className="modal-dialog-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-dismiss-btn" onClick={onClose} aria-label="Kapat">
          <X size={20} />
        </button>

        {modalData.type === 'howItWorks' && (
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1D63FF', textTransform: 'uppercase' }}>
              Şeffaf Süreç
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B132B', margin: '4px 0 16px' }}>
              Alan Yerler Nasıl Çalışır?
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '24px' }}>
              Uygulama indirmeden, tarayıcınız üzerinden cihazınızı kurumsal esnaflara değerinde satın.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#E0F2FE', color: '#0284C7', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</div>
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0B132B', marginBottom: '2px' }}>1. Cihazını Ekle</h4>
                  <p style={{ fontSize: '0.84rem', color: '#64748B' }}>Marka, model, işlemci, RAM, pil ve kozmetik durumunu adım adım 1 dakikada seç.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F3E8FF', color: '#7E22CE', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</div>
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0B132B', marginBottom: '2px' }}>2. Fotoğrafları Yükle</h4>
                  <p style={{ fontSize: '0.84rem', color: '#64748B' }}>Net fotoğraflar ekleyerek onaylı mağazalardan %35'e kadar daha yüksek teklif al.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#DCFCE7', color: '#15803D', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</div>
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0B132B', marginBottom: '2px' }}>3. Teklifleri Al</h4>
                  <p style={{ fontSize: '0.84rem', color: '#64748B' }}>Bölgendeki ve Türkiye'deki doğrulanmış kurumsal işletmelerden anında nakit teklifleri topla.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '14px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FFEDD5', color: '#C2410C', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>4</div>
                <div>
                  <h4 style={{ fontWeight: 700, color: '#0B132B', marginBottom: '2px' }}>4. En İyisini Seç & Sat</h4>
                  <p style={{ fontSize: '0.84rem', color: '#64748B' }}>En yüksek teklifi veren mağazayla el sıkış, ister mağazada elden nakit ister korumalı kargo ile sat.</p>
                </div>
              </div>
            </div>

            <button 
              className="btn-sell-primary" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '24px', padding: '14px' }}
              onClick={() => {
                onClose();
                onProceedToWizard();
              }}
            >
              Cihazını Seç & Teklif Al ➔
            </button>
          </div>
        )}

        {modalData.type === 'categorySelected' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#EFF5FF', color: '#1D63FF', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              ⚡
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0B132B', marginBottom: '6px' }}>
              {modalData.title}
            </h3>
            <div style={{ display: 'inline-block', background: '#ECFDF5', color: '#065F46', fontSize: '1.15rem', fontWeight: 800, padding: '6px 16px', borderRadius: '9999px', marginBottom: '16px' }}>
              Ortalama Teklif: {modalData.priceRange}
            </div>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Cihaz seçiminiz hafızaya alındı! Sıradaki aşamada <strong>Cihaz Satış Sihirbazı</strong> ile donanım özellikleri, pil sağlığı ve kozmetik detayları belirleyeceksiniz.
            </p>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px', marginBottom: '20px', textAlign: 'left', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: '#0B132B', marginBottom: '4px' }}>
                🚀 Sonraki Adımlar:
              </div>
              <ul style={{ paddingLeft: '20px', color: '#64748B', lineHeight: 1.6 }}>
                <li>İşlemci, RAM, SSD ve ekran boyutu seçimi</li>
                <li>Pil sağlığı ve kozmetik kondisyon değerlendirmesi</li>
                <li>Kutu, fatura ve şarj adaptörü durumu</li>
              </ul>
            </div>

            <button 
              className="btn-sell-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              onClick={onClose}
            >
              Anlaşıldı, Ana Ekrana Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
