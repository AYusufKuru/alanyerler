import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Bell, Loader2, Store, Sparkles, ArrowRight } from 'lucide-react';

export default function OffersRadar({ device, onProceedToList, onBackToHome }) {
  const [stepProgress, setStepProgress] = useState(2); // 1: Bilgiler gönderildi, 2: Paylaşıldı, 3: Toplanıyor, 4: Listelendi
  const [incomingBidsCount, setIncomingBidsCount] = useState(0);

  useEffect(() => {
    // Gerçek zamanlı ilerleme simülasyonu
    const timer1 = setTimeout(() => {
      setStepProgress(3);
      setIncomingBidsCount(2);
    }, 1200);

    const timer2 = setTimeout(() => {
      setStepProgress(4);
      setIncomingBidsCount(5);
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const categoryImages = {
    laptop: '/assets/categories/laptop.jpg',
    phone: '/assets/categories/phone.jpg',
    console: '/assets/categories/console.jpg',
    gpu: '/assets/categories/gpu.jpg',
    tablet: '/assets/categories/tablet.jpg',
    watch: '/assets/categories/watch.jpg',
    headphones: '/assets/categories/headphones.jpg'
  };

  const deviceImgSrc = device?.photos?.[0] || categoryImages[device?.category] || categoryImages.laptop;
  const deviceTitle = device?.specs?.model || "MacBook Pro 14\" (2023)";
  const deviceSpecs = `${device?.specs?.cpu || "M2 Pro"} • ${device?.specs?.ram || "16 GB"} • ${device?.specs?.storage || "512 GB SSD"}`;

  return (
    <div className="radar-view-container">
      {/* Üst Bar */}
      <div className="radar-top-nav">
        <button className="wizard-nav-icon-btn" onClick={onBackToHome} aria-label="Geri">
          <ArrowLeft size={20} />
        </button>
        <h2 className="radar-nav-title">Teklifler</h2>
        <div style={{ width: 38 }} />
      </div>

      {/* Stepper (1: Cihaz ✓, 2: Özellikler ✓, 3: Durum ✓, 4: Teklifler ●) */}
      <div className="radar-stepper-header">
        <div className="radar-step-node completed">
          <div className="node-circle"><Check size={13} strokeWidth={3} /></div>
          <span>Cihaz</span>
        </div>
        <div className="radar-step-line active" />
        <div className="radar-step-node completed">
          <div className="node-circle"><Check size={13} strokeWidth={3} /></div>
          <span>Özellikler</span>
        </div>
        <div className="radar-step-line active" />
        <div className="radar-step-node completed">
          <div className="node-circle"><Check size={13} strokeWidth={3} /></div>
          <span>Durum</span>
        </div>
        <div className="radar-step-line active" />
        <div className="radar-step-node current">
          <div className="node-circle">4</div>
          <span>Teklifler</span>
        </div>
      </div>

      {/* MERKEZİ RADAR ANİMASYONU (FOTOĞRAF 2 BİREBİR) */}
      <div className="radar-stage-box">
        {/* Dalga Dalga Yayılan Nabız Halkaları */}
        <div className="radar-pulse-ring ring-1" />
        <div className="radar-pulse-ring ring-2" />
        <div className="radar-pulse-ring ring-3" />

        {/* Merkez Cihaz */}
        <div className="radar-central-device">
          <img src={deviceImgSrc} alt={deviceTitle} className="central-device-img" />
        </div>

        {/* Çevrede Parlayan Mağaza Düğümleri */}
        <div className="satellite-store-node store-top-left">
          <div className="store-pill-badge">
            <Store size={14} />
            <span>TechStore</span>
          </div>
        </div>

        <div className="satellite-store-node store-top-right">
          <div className="store-pill-badge">
            <Store size={14} />
            <span>Giga Bilişim</span>
          </div>
        </div>

        <div className="satellite-store-node store-bottom-left">
          <div className="store-pill-badge">
            <Store size={14} />
            <span>Nova Teknoloji</span>
          </div>
        </div>

        <div className="satellite-store-node store-bottom-right">
          <div className="store-pill-badge">
            <Store size={14} />
            <span>Plus Elektronik</span>
          </div>
        </div>
      </div>

      {/* Başlık ve Açıklama */}
      <div className="radar-info-text-group">
        <h3 className="radar-main-heading">Cihazınız işletmelere gönderildi.</h3>
        <p className="radar-sub-desc">
          Bilgilerinizi paylaştık, işletmeler size en iyi tekliflerini iletiyor. Bu genellikle birkaç dakika sürer.
        </p>
      </div>

      {/* CANLI DURUM KONTROL LİSTESİ (FOTOĞRAF 2 BİREBİR) */}
      <div className="radar-live-checklist-card">
        {/* Madde 1 */}
        <div className="checklist-row completed">
          <div className="check-icon-circle blue">
            <Check size={14} strokeWidth={3} />
          </div>
          <div className="check-text-content">
            <h4>Cihaz bilgileri gönderildi</h4>
            <span className="check-subtext">Doğrulandı ve şifrelendi</span>
          </div>
        </div>

        {/* Madde 2 */}
        <div className="checklist-row completed">
          <div className="check-icon-circle blue">
            <Check size={14} strokeWidth={3} />
          </div>
          <div className="check-text-content">
            <h4>Uygun işletmelerle paylaşıldı</h4>
            <span className="check-subtext">Bölgenizdeki 18 kurumsal esnafa iletildi</span>
          </div>
        </div>

        {/* Madde 3 */}
        <div className={`checklist-row ${stepProgress >= 3 ? 'in-progress' : 'pending'}`}>
          <div className="check-icon-circle spinner">
            {stepProgress >= 4 ? (
              <Check size={14} strokeWidth={3} />
            ) : (
              <Loader2 size={15} className="spin-animation" />
            )}
          </div>
          <div className="check-text-content">
            <h4>Teklifler toplanıyor</h4>
            <span className="check-subtext">Bu işlem birkaç dakika sürebilir.</span>
          </div>
        </div>

        {/* Madde 4 */}
        <div className={`checklist-row ${stepProgress >= 4 ? 'completed' : 'pending'}`}>
          <div className="check-icon-circle">
            {stepProgress >= 4 ? <Check size={14} strokeWidth={3} /> : <span className="empty-dot" />}
          </div>
          <div className="check-text-content">
            <h4>Teklifler listeleniyor</h4>
            <span className="check-subtext">
              {stepProgress >= 4 ? "5 mağazadan canlı teklif hazır!" : "Teklifler sıralanacak"}
            </span>
          </div>
        </div>
      </div>

      {/* Alt Bildirim Kartı */}
      <div className="radar-notification-callout">
        <div className="notif-callout-icon">
          <Bell size={20} />
        </div>
        <p className="notif-callout-text">
          Teklifler geldiğinde anında bildirim alacaksınız. Tarayıcıyı kapatsanız bile profilinizden görebilirsiniz.
        </p>
      </div>

      {/* Aksiyon Butonu */}
      <div className="radar-action-footer">
        <button className="btn-proceed-to-offers" onClick={onProceedToList}>
          <Sparkles size={18} />
          <span>Gelen Teklifleri Gör ({incomingBidsCount > 0 ? `${incomingBidsCount} Teklif` : 'Canlı'})</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
