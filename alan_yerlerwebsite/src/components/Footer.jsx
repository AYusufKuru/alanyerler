import React from 'react';

export default function Footer({ onSelectCategory, onOpenHowItWorks, onShowToast }) {
  return (
    <footer className="footer-desktop">
      <div className="footer-grid-layout">
        <div className="footer-brand-box">
          <div className="brand-identity">
            <div className="brand-badge-icon">AY</div>
            <div className="brand-titles">
              <div className="brand-title-main">Alan<span>Yerler</span></div>
              <div className="brand-title-sub">Web Platformu</div>
            </div>
          </div>
          <p>
            Uygulama indirmeye gerek olmadan, kullanmadığınız teknolojik cihazlarınızı Türkiye'nin doğrulanmış kurumsal esnaflarına en yüksek fiyatla güvenle satabileceğiniz pazar yeri.
          </p>
        </div>

        <div>
          <h4 className="footer-column-title">Hızlı Satış</h4>
          <ul className="footer-anchors-list">
            <li><a onClick={() => onSelectCategory({ id: 'laptop', name: 'Bilgisayar/Laptop', avgPriceRange: '22.000 - 85.000 TL' })}>Laptop Sat</a></li>
            <li><a onClick={() => onSelectCategory({ id: 'phone', name: 'Telefon', avgPriceRange: '18.000 - 64.000 TL' })}>Telefon Sat</a></li>
            <li><a onClick={() => onSelectCategory({ id: 'console', name: 'Oyun Konsolu', avgPriceRange: '12.000 - 24.000 TL' })}>Oyun Konsolu Sat</a></li>
            <li><a onClick={() => onSelectCategory({ id: 'gpu', name: 'Ekran Kartı', avgPriceRange: '14.000 - 55.000 TL' })}>Ekran Kartı Sat</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-column-title">Kurumsal & Güvenlik</h4>
          <ul className="footer-anchors-list">
            <li><a onClick={onOpenHowItWorks}>Nasıl Çalışır?</a></li>
            <li><a onClick={() => onShowToast('Vergi levhalı kurumsal işletmeler onaylıdır.')}>Onaylı Esnaf Ağı</a></li>
            <li><a onClick={() => onShowToast('Sıfır komisyon ve anında nakit/havale garantisi.')}>Ödeme ve Teslimat</a></li>
            <li><a onClick={() => onShowToast('Sıkça Sorulan Sorular yakında.')}>S.S.S.</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-column-title">Destek & İletişim</h4>
          <p style={{ fontSize: '0.86rem', color: '#64748B', marginBottom: '12px' }}>
            Sorularınız ve kurumsal mağaza kayıtları için destek ekibimiz her zaman yanınızda.
          </p>
          <span style={{ fontWeight: 800, color: '#1D63FF', fontSize: '0.96rem' }}>
            destek@alanyerler.com
          </span>
        </div>
      </div>

      <div className="footer-copyright-bar">
        <span>© 2026 Alan Yerler Teknoloji Platformu. Tüm hakları saklıdır.</span>
        <span>Uygulama İndirmeye Gerek Kalmadan Doğrudan Web'den Satış Deneyimi</span>
      </div>
    </footer>
  );
}
