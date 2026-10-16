import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Zap, MessageCircle, CheckCircle2, Sparkles, Smartphone, Laptop, Gamepad2, Cpu } from 'lucide-react';

export default function OnboardingShowcase({ onStartSelling }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: "Adım 1 / 4 • Fırsat",
      title: "Cihazını Sat, En İyi Teklifi Bul.",
      desc: "Telefon, bilgisayar, oyun konsolu ve donanım parçaları için bilgilerini gir. Doğrulanmış kurumsal işletmelerden gelen canlı teklifleri karşılaştır, sana en uygun olanı seç.",
      btnText: "Cihazımı Satmak İstiyorum",
      visualType: "offersFloating"
    },
    {
      id: 2,
      badge: "Adım 2 / 4 • Kolaylık",
      title: "Adım Adım Kolayca Ekle.",
      desc: "Cihazının marka, model, donanım özellikleri ve kozmetik durumunu 1 dakikada seç. Karmaşık formlar olmadan hızlıca ilan oluştur.",
      btnText: "Sonraki Adım",
      visualType: "stepMockup"
    },
    {
      id: 3,
      badge: "Adım 3 / 4 • Hız",
      title: "Teklifler Cebine Gelsin.",
      desc: "İlanını onaylat, bölgedeki ve tüm Türkiye'deki lisanslı teknoloji mağazalarından anlık nakit teklifleri topla. En yüksek verenle hemen anlaş.",
      btnText: "Sonraki Adım",
      visualType: "bidsListMockup"
    },
    {
      id: 4,
      badge: "Adım 4 / 4 • Güven",
      title: "Güvenli ve Kolay Satış.",
      desc: "Beğendiğin teklifi kabul et, web üzerinden mağazayla anlık yazış. Mağazada elden nakit veya korumalı kargo ile cihazını güvenle nakde dönüştür.",
      btnText: "Hemen Başla & Sat",
      visualType: "trustPillars"
    }
  ];

  const current = slides[activeSlide];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      onStartSelling();
    }
  };

  const handlePrev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  return (
    <section className="onboarding-showcase-section">
      <div className="section-head-center">
        <span className="section-kicker">NEDEN ALAN YERLER?</span>
        <h2 className="section-title-large">Uygulama İndirmeden 4 Adımda Sat</h2>
        <p className="section-desc-center">
          Fotoğraf 5'teki mobil deneyim, hiçbir kurulum gerektirmeden tarayıcınızda birebir çalışıyor.
        </p>
      </div>

      <div className="onboarding-card-slider">
        {/* Sol / Üst Görsel Vitrini */}
        <div className="onboarding-visual-stage">
          {current.visualType === 'offersFloating' && (
            <div className="stage-visual-container">
              <div className="floating-device-center">
                <img src="/assets/hero-devices.jpg" alt="Cihazlar" className="floating-hero-image" />
              </div>
              <div className="floating-pill-node pill-tl">
                <span>TechStore</span>
                <strong>41.250 TL ›</strong>
              </div>
              <div className="floating-pill-node pill-tr">
                <span>Giga Bilişim</span>
                <strong>40.000 TL ›</strong>
              </div>
              <div className="floating-pill-node pill-bl">
                <span>Nova Teknoloji</span>
                <strong>38.500 TL ›</strong>
              </div>
              <div className="floating-pill-node pill-br">
                <span>Plus Elektronik</span>
                <strong>39.750 TL ›</strong>
              </div>
            </div>
          )}

          {current.visualType === 'stepMockup' && (
            <div className="stage-categories-preview">
              <div className="mini-cat-card">
                <Smartphone size={22} className="text-blue" />
                <span>Telefon</span>
              </div>
              <div className="mini-cat-card active">
                <Laptop size={22} className="text-blue" />
                <span>Bilgisayar</span>
                <span className="active-dot-cat" />
              </div>
              <div className="mini-cat-card">
                <Gamepad2 size={22} className="text-blue" />
                <span>Konsol</span>
              </div>
              <div className="mini-cat-card">
                <Cpu size={22} className="text-blue" />
                <span>Ekran Kartı</span>
              </div>
            </div>
          )}

          {current.visualType === 'bidsListMockup' && (
            <div className="stage-bids-mock-list">
              <div className="mock-bid-row gold">
                <div className="mock-store-ident">
                  <span className="mock-store-tag">TECH</span>
                  <div>
                    <strong>TechStore</strong>
                    <small>⭐ 4.9 • Kadıköy</small>
                  </div>
                </div>
                <strong className="mock-bid-amount">42.500 TL</strong>
              </div>

              <div className="mock-bid-row">
                <div className="mock-store-ident">
                  <span className="mock-store-tag">GIGA</span>
                  <div>
                    <strong>Giga Bilişim</strong>
                    <small>⭐ 4.8 • Şişli</small>
                  </div>
                </div>
                <strong className="mock-bid-amount">41.000 TL</strong>
              </div>

              <div className="mock-bid-row">
                <div className="mock-store-ident">
                  <span className="mock-store-tag">NOVA</span>
                  <div>
                    <strong>Nova Teknoloji</strong>
                    <small>⭐ 4.7 • Çankaya</small>
                  </div>
                </div>
                <strong className="mock-bid-amount">39.750 TL</strong>
              </div>
            </div>
          )}

          {current.visualType === 'trustPillars' && (
            <div className="stage-trust-grid">
              <div className="trust-pillar-card">
                <ShieldCheck size={28} className="text-blue" />
                <h4>Onaylı İşletmeler</h4>
                <p>Vergi levhalı kurumsal esnaflar</p>
              </div>
              <div className="trust-pillar-card">
                <Zap size={28} className="text-amber" />
                <h4>Anında Teklif</h4>
                <p>Ortalama 5 dakikada geri dönüş</p>
              </div>
              <div className="trust-pillar-card">
                <MessageCircle size={28} className="text-emerald" />
                <h4>Web'den Canlı Chat</h4>
                <p>Komisyonsuz doğrudan pazarlık</p>
              </div>
              <div className="trust-pillar-card">
                <CheckCircle2 size={28} className="text-indigo" />
                <h4>Garantili Ödeme</h4>
                <p>Elden nakit veya anında EFT/Havale</p>
              </div>
            </div>
          )}
        </div>

        {/* Sağ / Alt Bilgi & Navigasyon */}
        <div className="onboarding-text-panel">
          <div className="onboarding-badge-chip">
            <Sparkles size={14} />
            <span>{current.badge}</span>
          </div>

          <h3 className="onboarding-slide-title">{current.title}</h3>
          <p className="onboarding-slide-description">{current.desc}</p>

          {/* Pagination Dots */}
          <div className="onboarding-pagination-line">
            {slides.map((s, idx) => (
              <button 
                key={s.id} 
                className={`onboarding-dot ${idx === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Buton Kontrolleri */}
          <div className="onboarding-nav-buttons">
            {activeSlide > 0 && (
              <button className="btn-onboarding-back" onClick={handlePrev}>
                <ChevronLeft size={18} />
                <span>Geri</span>
              </button>
            )}

            <button className="btn-onboarding-cta" onClick={handleNext}>
              <span>{current.btnText}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
