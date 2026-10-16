import React from 'react';
import ValuationCalculator from './ValuationCalculator';

export default function Hero({ onSelectValuation, onOpenHowItWorks }) {
  return (
    <section className="hero-wrapper" id="anasayfa">
      <div className="hero-main-card">
        {/* Sol Alan */}
        <div className="hero-left-column">
          <div className="hero-live-pill">
            <span className="live-pulse-dot" />
            <span>📈 3 İşletmeden Yeni Canlı Teklif Geldi!</span>
          </div>

          <h1 className="hero-heading">
            Cihazını Sat,<br />
            <span className="gradient-word">En İyi Teklifi Al.</span>
          </h1>

          <p className="hero-lead-text">
            Telefon, bilgisayar, oyun konsolu ve donanım parçalarını 120+ onaylı kurumsal esnafa anında sun. Komisyonsuz, elden veya korumalı kargoyla aynı gün nakit al.
          </p>

          {/* Anında Değerleme Widget */}
          <ValuationCalculator onSelectValuation={onSelectValuation} />
        </div>

        {/* Sağ Vitrin & Yüzen Canlı Teklifler */}
        <div className="hero-right-showcase">
          {/* Teklif 1 */}
          <div className="floating-quote-bubble quote-top-right">
            <div className="quote-store-mark">TECH</div>
            <div className="quote-text-group">
              <span className="quote-store-name">
                TechStore ✓ <span style={{ color: '#059669', fontWeight: 800 }}>En Yüksek</span>
              </span>
              <span className="quote-store-price">42.500 TL</span>
            </div>
          </div>

          {/* Teklif 2 */}
          <div className="floating-quote-bubble quote-bottom-left">
            <div className="quote-store-mark giga">GIGA</div>
            <div className="quote-text-group">
              <span className="quote-store-name">Giga Bilişim ✓</span>
              <span className="quote-store-price" style={{ color: '#1D63FF' }}>41.000 TL</span>
            </div>
          </div>

          {/* Ana Vitrin Fotoğrafı */}
          <img 
            src="/assets/hero-devices.jpg" 
            alt="Cihazını değerinde sat: Laptop, Telefon, Konsol, Ekran Kartı" 
            className="hero-main-photo"
          />
        </div>
      </div>
    </section>
  );
}
