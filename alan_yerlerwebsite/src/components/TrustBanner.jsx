import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function TrustBanner({ onOpenDetails }) {
  return (
    <section className="trust-block-wrap" id="guvenlik">
      <div className="trust-dark-card">
        <div className="trust-left-cluster">
          <div className="trust-icon-badge">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="trust-heading">Güvenli ve Güvenilir</h3>
            <p className="trust-subtext">
              Doğrulanmış kurumsal işletmelerden teklif al, güvenle satış yap. 0 TL satıcı komisyonu ve %100 ödeme güvencesi.
            </p>
          </div>
        </div>

        <div className="trust-stat-nodes">
          <div className="stat-single-node">
            <span className="stat-num">120+</span>
            <span className="stat-lbl">Onaylı Mağaza</span>
          </div>
          <div className="stat-single-node">
            <span className="stat-num">0 TL</span>
            <span className="stat-lbl">Satıcı Komisyonu</span>
          </div>
          <button className="trust-arrow-button" onClick={onOpenDetails} title="Detayları İncele">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
