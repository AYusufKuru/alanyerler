import React from 'react';
import { FileText, Camera, Tag, Handshake } from 'lucide-react';

export default function HowItWorks({ onOpenDetails }) {
  return (
    <section className="how-it-works-wrap" id="nasil-calisir">
      <div className="how-header-cluster">
        <div>
          <span className="section-tag-blue">— ŞEFFAF & HIZLI</span>
          <h2 className="section-main-heading">NASIL ÇALIŞIR?</h2>
        </div>
        <a className="nav-anchor" onClick={onOpenDetails} style={{ color: '#1D63FF' }}>
          Detayları Gör ➔
        </a>
      </div>

      <div className="how-interactive-track">
        {/* Adım 1 */}
        <div className="process-step-box" onClick={onOpenDetails}>
          <span className="step-meta-badge">ADIM 01</span>
          <div className="step-icon-orb orb-cyan">
            <FileText size={26} />
          </div>
          <h3 className="step-title-bold">1. Cihazını Ekle</h3>
          <p className="step-body-desc">Marka, model ve teknik detayları 1 dakikada eksiksiz gir.</p>
        </div>

        {/* Adım 2 */}
        <div className="process-step-box" onClick={onOpenDetails}>
          <span className="step-meta-badge">ADIM 02</span>
          <div className="step-icon-orb orb-purple">
            <Camera size={26} />
          </div>
          <h3 className="step-title-bold">2. Fotoğrafları Yükle</h3>
          <p className="step-body-desc">Cihazının fotoğraflarını ekle, şeffaf teklifler topla.</p>
        </div>

        {/* Adım 3 */}
        <div className="process-step-box" onClick={onOpenDetails}>
          <span className="step-meta-badge">ADIM 03</span>
          <div className="step-icon-orb orb-green">
            <Tag size={26} />
          </div>
          <h3 className="step-title-bold">3. Teklifleri Al</h3>
          <p className="step-body-desc">Doğrulanmış işletmelerden gelen anlık teklifleri gör.</p>
        </div>

        {/* Adım 4 */}
        <div className="process-step-box" onClick={onOpenDetails}>
          <span className="step-meta-badge">ADIM 04</span>
          <div className="step-icon-orb orb-orange">
            <Handshake size={26} />
          </div>
          <h3 className="step-title-bold">4. En İyisini Seç</h3>
          <p className="step-body-desc">Beğendiğin teklifle iletişime geç, güvenle teslim et.</p>
        </div>
      </div>
    </section>
  );
}
