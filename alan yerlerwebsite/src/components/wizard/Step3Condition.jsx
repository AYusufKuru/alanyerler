import React from 'react';
import { ArrowLeft, ArrowRight, BatteryCharging, HardDrive, PackageCheck, Shield, Sparkles, Plug, CheckCircle2, FileEdit, Wind } from 'lucide-react';
import { CONDITION_OPTIONS } from '../../data/wizardData';

export default function Step3Condition({ category, condition, onChangeCondition, onBack, onNext }) {
  const currentBox = condition.boxAndInvoice !== undefined ? condition.boxAndInvoice : true;
  const currentCosmetic = condition.cosmetic || "flawless";
  const currentAdapter = condition.adapter || "Orijinal";
  const currentWorking = condition.workingState || "perfect";
  const currentNotes = condition.notes || "";

  // Sadece bataryası olan cihazlarda pil sağlığı sorulur
  const hasBattery = ['laptop', 'macbook', 'phone', 'iphone', 'tablet', 'ipad', 'watch', 'headphones'].includes(category);

  const handleNotesChange = (e) => {
    if (e.target.value.length <= 200) {
      onChangeCondition({ ...condition, notes: e.target.value });
    }
  };

  return (
    <div className="wizard-substep-block">
      <div className="wizard-substep-head">
        <h3 className="wizard-substep-title">Cihazınızın Mevcut Durumu & Ekspertiz</h3>
        <p className="wizard-substep-desc">
          Tekliflerin netleşmesi için donanım sağlığını, kozmetik kondisyonunu ve aksesuar durumunu belirtin.
        </p>
      </div>

      <div className="wizard-form-input-grid">
        {/* Pil Sağlığı (Yalnızca Bataryalı Cihazlarda) */}
        {hasBattery ? (
          <div className="wizard-form-cell">
            <label className="wizard-cell-label flex-label">
              <BatteryCharging size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>Pil Sağlığı *</span>
            </label>
            <select 
              className="wizard-select-control"
              value={condition.batteryHealth || "%100 (Orijinal)"}
              onChange={(e) => onChangeCondition({ ...condition, batteryHealth: e.target.value })}
            >
              {CONDITION_OPTIONS.batteryHealth.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="wizard-form-cell">
            <label className="wizard-cell-label flex-label">
              <Wind size={16} style={{ color: '#0EA5E9' }} />
              <span>Termal Durum & Fan Sağlığı *</span>
            </label>
            <select 
              className="wizard-select-control"
              value={condition.thermalHealth || "Sessiz & Serin Çalışıyor"}
              onChange={(e) => onChangeCondition({ ...condition, thermalHealth: e.target.value })}
            >
              <option value="Sessiz & Serin Çalışıyor">Sessiz & Serin Çalışıyor</option>
              <option value="Normal / Hafif Fan Sesi">Normal / Hafif Fan Sesi</option>
              <option value="Bakım / Macun Yenileme Gerekebilir">Bakım / Macun Gerekebilir</option>
            </select>
          </div>
        )}

        {/* Depolama (SSD) Sağlığı */}
        <div className="wizard-form-cell">
          <label className="wizard-cell-label flex-label">
            <HardDrive size={16} style={{ color: 'var(--brand-blue)' }} />
            <span>Depolama (SSD) Sağlığı *</span>
          </label>
          <select 
            className="wizard-select-control"
            value={condition.ssdHealth || "%100 Sağlık"}
            onChange={(e) => onChangeCondition({ ...condition, ssdHealth: e.target.value })}
          >
            {CONDITION_OPTIONS.ssdHealth.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Kutu / Fatura (Pill Switch) */}
        <div className="wizard-form-cell">
          <label className="wizard-cell-label flex-label">
            <PackageCheck size={16} style={{ color: '#F59E0B' }} />
            <span>Orijinal Kutu ve Fatura</span>
          </label>
          <div className="wizard-pill-switch-group">
            <button 
              type="button"
              className={`wizard-pill-switch-btn ${currentBox === true ? 'active' : ''}`}
              onClick={() => onChangeCondition({ ...condition, boxAndInvoice: true })}
            >
              ✓ Var (Orijinal)
            </button>
            <button 
              type="button"
              className={`wizard-pill-switch-btn ${currentBox === false ? 'active' : ''}`}
              onClick={() => onChangeCondition({ ...condition, boxAndInvoice: false })}
            >
              Yok
            </button>
          </div>
        </div>

        {/* Kalan Garanti Süresi */}
        <div className="wizard-form-cell">
          <label className="wizard-cell-label flex-label">
            <Shield size={16} style={{ color: '#6366F1' }} />
            <span>Kalan Garanti Süresi</span>
          </label>
          <select 
            className="wizard-select-control"
            value={condition.warranty || "6 - 12 Ay"}
            onChange={(e) => onChangeCondition({ ...condition, warranty: e.target.value })}
          >
            {CONDITION_OPTIONS.warrantyPeriods.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Kozmetik Durumu (4'lü Segment Seçici) */}
        <div className="wizard-form-cell full-width">
          <label className="wizard-cell-label flex-label">
            <Sparkles size={16} style={{ color: '#F59E0B' }} />
            <span>Kozmetik Durumu *</span>
          </label>
          <div className="wizard-quad-segments">
            {CONDITION_OPTIONS.cosmetics.map(cos => (
              <button
                key={cos.id}
                type="button"
                className={`wizard-segment-card ${currentCosmetic === cos.id ? 'active' : ''}`}
                onClick={() => onChangeCondition({ ...condition, cosmetic: cos.id, cosmeticLabel: cos.label })}
              >
                <strong className="segment-card-title">{cos.label}</strong>
                <span className="segment-card-desc">{cos.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Şarj Adaptörü */}
        <div className="wizard-form-cell">
          <label className="wizard-cell-label flex-label">
            <Plug size={16} style={{ color: '#64748B' }} />
            <span>Şarj Aleti / Kablolar</span>
          </label>
          <div className="wizard-pill-switch-group three-options">
            {CONDITION_OPTIONS.adapters.map(ad => (
              <button 
                key={ad}
                type="button"
                className={`wizard-pill-switch-btn ${currentAdapter === ad ? 'active' : ''}`}
                onClick={() => onChangeCondition({ ...condition, adapter: ad })}
              >
                {ad}
              </button>
            ))}
          </div>
        </div>

        {/* Cihazın Çalışma Durumu */}
        <div className="wizard-form-cell">
          <label className="wizard-cell-label flex-label">
            <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
            <span>Çalışma Durumu</span>
          </label>
          <div className="wizard-pill-switch-group">
            <button 
              type="button"
              className={`wizard-pill-switch-btn ${currentWorking === 'perfect' ? 'active' : ''}`}
              onClick={() => onChangeCondition({ ...condition, workingState: 'perfect' })}
            >
              Sorunsuz Çalışıyor
            </button>
            <button 
              type="button"
              className={`wizard-pill-switch-btn ${currentWorking === 'issues' ? 'active' : ''}`}
              onClick={() => onChangeCondition({ ...condition, workingState: 'issues' })}
            >
              Kusurları Var
            </button>
          </div>
        </div>

        {/* Ekstra Notlar (Opsiyonel) */}
        <div className="wizard-form-cell full-width">
          <label className="wizard-cell-label flex-label">
            <FileEdit size={16} style={{ color: 'var(--brand-blue)' }} />
            <span>Mağazalara Ekstra Notunuz (Opsiyonel)</span>
          </label>
          <textarea 
            className="wizard-textarea-control"
            placeholder="Örn: Cihaz hep kılıf ve ekran koruyucuyla kullanıldı, çizik dahi yok. Kadıköy içi elden teslim edebilirim."
            value={currentNotes}
            onChange={handleNotesChange}
            rows={3}
          />
          <div className="wizard-char-counter">
            <span>{currentNotes.length} / 200 karakter</span>
          </div>
        </div>
      </div>

      {/* Alt Aksiyon Butonları */}
      <div className="wizard-footer-action-bar dual">
        <button className="wizard-secondary-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Geri</span>
        </button>

        <button className="wizard-primary-submit-btn" onClick={onNext}>
          <span>Devam Et: Fotoğraflar</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
