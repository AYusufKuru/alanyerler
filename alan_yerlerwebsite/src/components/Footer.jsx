import React from 'react';

export default function Footer({ onOpenHowItWorks, onShowToast }) {
  return (
    <footer className="footer-desktop">
      <div className="footer-compact-row">
        <span className="footer-compact-brand">AlanYerler</span>
        <span>Cihazına değer veren teklifler.</span>
        <nav>
          <button type="button" onClick={onOpenHowItWorks}>Nasıl Çalışır?</button>
          <button type="button" onClick={() => onShowToast('Destek: destek@alanyerler.com')}>Destek</button>
          <button type="button" onClick={() => onShowToast('Gizlilik politikası hesap bölümünde.')}>Gizlilik</button>
        </nav>
      </div>
    </footer>
  );
}
