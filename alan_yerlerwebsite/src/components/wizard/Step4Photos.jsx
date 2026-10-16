import React, { useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, Camera, Maximize2, Trash2, Upload, Sparkles, ShieldCheck } from 'lucide-react';

export default function Step4Photos({ category, specs, condition, photos, onPhotosChange, onBack, onSubmit, error }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);
  const slotRef = useRef(0);
  const shots = photoShots(category);
  const slots = Array.from({ length: shots.length }, (_, index) => photos[index] || null);
  const filledCount = slots.filter(Boolean).length;

  const getEstimatedRange = () => {
    switch (category) {
      case 'phone': return "42.000 — 46.500 TL";
      case 'console': return "17.500 — 19.500 TL";
      case 'gpu': return "28.000 — 32.500 TL";
      case 'tablet': return "24.000 — 28.000 TL";
      case 'desktop': return "55.000 — 65.000 TL";
      case 'watch': return "13.000 — 16.500 TL";
      case 'headphones': return "9.000 — 11.500 TL";
      default: return "40.000 — 43.500 TL";
    }
  };

  const sampleUrl = {
    phone: '/assets/categories/phone.jpg',
    iphone: '/assets/categories/phone.jpg',
    console: '/assets/categories/console.jpg',
    gpu: '/assets/categories/gpu.jpg',
    tablet: '/assets/categories/tablet.jpg',
    ipad: '/assets/categories/tablet.jpg',
    watch: '/assets/categories/watch.jpg',
    headphones: '/assets/categories/headphones.jpg',
  }[category] || '/assets/categories/laptop.jpg';

  const handleFillSamples = async () => {
    const response = await fetch(sampleUrl);
    const blob = await response.blob();
    const files = shots.map((_, index) => {
      const file = new File([blob], `ornek-${index + 1}.jpg`, { type: blob.type || 'image/jpeg' });
      return { file, url: sampleUrl };
    });
    onPhotosChange(files);
  };

  const writeSlots = (next) => onPhotosChange(next);

  const handleRemovePhoto = (index) => {
    const next = [...slots];
    next[index] = null;
    writeSlots(next);
  };

  const movePhoto = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= slots.length) return;
    const next = [...slots];
    const current = next[index];
    next[index] = next[target];
    next[target] = current;
    writeSlots(next);
  };

  const openSlot = (index) => {
    slotRef.current = index;
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const next = [...photos];
    next[slotRef.current] = { file, url: URL.createObjectURL(file) };
    onPhotosChange(next);
  };

  const handleSubmitClick = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const specParts = [
    specs.cpu,
    specs.gpu && specs.gpu !== "Dahili Mobil Grafik İşlemci" ? specs.gpu : null,
    specs.ram ? `${specs.ram} RAM` : null,
    specs.storage,
    specs.screenSize
  ].filter(Boolean);

  const formattedSpecsLine = specParts.join(" • ") || "Standart Donanım Özellikleri";

  return (
    <div className="wizard-substep-block">
      <div className="wizard-substep-head">
        <h3 className="wizard-substep-title">Cihazınızın Fotoğraflarını Ekleyin</h3>
        <p className="wizard-substep-desc">
          {filledCount}/5 · en az 2 fotoğraf. Her karede yazan yeri çekin.
        </p>
      </div>

      {isSubmitting && (
        <div className="wizard-upload-progress">
          <div className="wizard-upload-bar" />
          <span>Fotoğraflar yükleniyor</span>
        </div>
      )}

      <div className="wizard-photo-guide-list">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handleFile}
        />
        {shots.map((shot, index) => {
          const uploaded = slots[index];
          return (
            <div key={shot.title} className={`wizard-photo-guide-row ${uploaded ? 'filled' : ''}`}>
              <div className="wizard-photo-guide-copy">
                <strong>{index + 1}. {shot.title}</strong>
                <span>{shot.prompt}</span>
              </div>
              {uploaded ? (
                <div className="wizard-photo-guide-actions">
                  <button type="button" className="wizard-photo-thumb" onClick={() => setPreview(uploaded.url)} aria-label="Büyüt">
                    <img src={uploaded.url} alt={shot.title} />
                    <Maximize2 size={14} />
                  </button>
                  <button type="button" onClick={() => openSlot(index)} aria-label="Yeniden çek"><Camera size={16} /></button>
                  <button type="button" onClick={() => handleRemovePhoto(index)} aria-label="Sil"><Trash2 size={16} /></button>
                  <button type="button" onClick={() => movePhoto(index, -1)} disabled={index === 0} aria-label="Yukarı"><ArrowUp size={16} /></button>
                  <button type="button" onClick={() => movePhoto(index, 1)} disabled={index === shots.length - 1} aria-label="Aşağı"><ArrowDown size={16} /></button>
                </div>
              ) : (
                <button type="button" className="wizard-photo-guide-pick" onClick={() => openSlot(index)}>
                  <Upload size={16} />
                  <span>Fotoğraf seç</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {preview && (
        <button type="button" className="wizard-photo-lightbox" onClick={() => setPreview(null)} aria-label="Kapat">
          <img src={preview} alt="" />
        </button>
      )}

      {/* Hızlı Test İçin Örnek Yükleme Butonu */}
      <div className="wizard-sample-action-bar">
        <button type="button" className="btn-wizard-auto-fill" onClick={handleFillSamples}>
          <Sparkles size={15} />
          <span>Örnek Fotoğraflarla Otomatik Doldur (Hızlı Test)</span>
        </button>
      </div>

      {/* İLAN ÖZET REKAP KARTI */}
      <div className="wizard-device-recap-box">
        <div className="recap-top-group">
          <div className="recap-info-side">
            <span className="recap-pill-tag">İlan Özeti</span>
            <h4 className="recap-model-heading">
              {specs.brand || ""} {specs.model || "Cihaz"}
            </h4>
            <p className="recap-specs-text">
              {formattedSpecsLine}
            </p>
          </div>
          <div className="recap-price-side">
            <span className="recap-price-label">Tahmini Teklif Aralığı</span>
            <span className="recap-price-amount">{getEstimatedRange()}</span>
          </div>
        </div>

        <div className="recap-status-chips-wrap">
          {['laptop', 'macbook', 'phone', 'tablet', 'watch', 'headphones'].includes(category) && (
            <span className="recap-chip-item">🔋 Pil: {condition.batteryHealth || "%100"}</span>
          )}
          {!['laptop', 'macbook', 'phone', 'tablet', 'watch', 'headphones'].includes(category) && (
            <span className="recap-chip-item">❄️ Termal: {condition.thermalHealth || "Sessiz & Serin"}</span>
          )}
          {specs.registrationStatus && (
            <span className="recap-chip-item">{specs.registrationStatus.split('(')[0]}</span>
          )}
          {specs.gamepads && (
            <span className="recap-chip-item">{specs.gamepads}</span>
          )}
          {specs.gpuSecurity && (
            <span className="recap-chip-item">{specs.gpuSecurity}</span>
          )}
          <span className="recap-chip-item">📦 Kutu: {condition.box === false ? 'Yok' : 'Var'}</span>
          <span className="recap-chip-item">🧾 Fatura: {condition.invoice === false ? 'Yok' : 'Var'}</span>
          <span className="recap-chip-item">🛡️ Garanti: {condition.warranty || "6 - 12 Ay"}</span>
          <span className="recap-chip-item">✨ Durum: {condition.cosmeticLabel || "Kusursuz"}</span>
        </div>

        <div className="recap-security-assurance">
          <ShieldCheck size={18} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
          <span>İlanınız sadece doğrulanmış kurumsal esnaflara iletilir. Kişisel iletişim bilgileriniz gizli tutulur.</span>
        </div>
      </div>

      {/* Alt Aksiyon Çubuğu */}
      <div className="wizard-footer-action-bar dual">
        <button className="wizard-secondary-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Geri</span>
        </button>

        {error && <div className="auth-error">{error}</div>}
        <button 
          className="wizard-primary-submit-btn submit-final-call" 
          onClick={handleSubmitClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>İlan Gönderiliyor... ⏳</span>
          ) : (
            <span>🚀 Cihazı Gönder & Canlı Teklifleri Topla</span>
          )}
        </button>
      </div>
    </div>
  );
}

function photoShots(category) {
  const defect = { title: 'Kusurlu bölge', prompt: 'Varsa kusurlu bölgeyi yakın çekin. Yoksa bu kare boş kalabilir.' };
  if (category === 'phone' || category === 'iphone') {
    return [
      { title: 'Ön yüz', prompt: 'Cihazın ön yüzünü çekin.' },
      { title: 'Arka yüz', prompt: 'Cihazın arka yüzünü çekin.' },
      { title: 'Kenarlar', prompt: 'Sağ ve sol kenarları çekin.' },
      { title: 'Ekran açık', prompt: 'Ekranı açıkken çekin.' },
      defect,
    ];
  }
  if (category === 'laptop' || category === 'macbook') {
    return [
      { title: 'Ekran açık', prompt: 'Ekranı açıkken önden çekin.' },
      { title: 'Klavye', prompt: 'Klavyeyi ve üst gövdeyi çekin.' },
      { title: 'Kapak', prompt: 'Kapağın dışını çekin.' },
      { title: 'Kenarlar', prompt: 'Portların olduğu kenarı çekin.' },
      defect,
    ];
  }
  if (category === 'desktop' || category === 'mac-desktop') {
    return [
      { title: 'Ön yüz', prompt: 'Kasanın önünü çekin.' },
      { title: 'Yan panel', prompt: 'Yan kapağı çekin.' },
      { title: 'Arka portlar', prompt: 'Arkadaki bağlantıları çekin.' },
      { title: 'İç donanım', prompt: 'Kapak açıksa içini çekin.' },
      defect,
    ];
  }
  if (category === 'tablet' || category === 'ipad') {
    return [
      { title: 'Ön yüz', prompt: 'Ekranı kapalıyken önden çekin.' },
      { title: 'Arka yüz', prompt: 'Arka kapağı çekin.' },
      { title: 'Kenarlar', prompt: 'Kenarları çekin.' },
      { title: 'Ekran açık', prompt: 'Ekranı açıkken çekin.' },
      defect,
    ];
  }
  if (category === 'console') {
    return [
      { title: 'Ön yüz', prompt: 'Konsolun önünü çekin.' },
      { title: 'Arka yüz', prompt: 'Portların olduğu arkayı çekin.' },
      { title: 'Kollar', prompt: 'Kolları çekin.' },
      { title: 'Kablolar', prompt: 'Güç ve görüntü kablosunu çekin.' },
      defect,
    ];
  }
  if (category === 'gpu') {
    return [
      { title: 'Fanlar', prompt: 'Fanların olduğu yüzü çekin.' },
      { title: 'Arka plaka', prompt: 'Metal arka plakayı çekin.' },
      { title: 'Portlar', prompt: 'Görüntü çıkışlarını çekin.' },
      { title: 'Bağlantı', prompt: 'Altın bağlantı şeridini çekin.' },
      defect,
    ];
  }
  if (category === 'watch') {
    return [
      { title: 'Ön cam', prompt: 'Ön camı çekin.' },
      { title: 'Arka sensör', prompt: 'Arka sensörü çekin.' },
      { title: 'Kordon', prompt: 'Kordonu çekin.' },
      { title: 'Şarj', prompt: 'Şarj kablosunu çekin.' },
      defect,
    ];
  }
  if (category === 'headphones') {
    return [
      { title: 'Kulaklıklar', prompt: 'Kulak yastıklarını çekin.' },
      { title: 'Bant', prompt: 'Kafa bandını ve menteşeleri çekin.' },
      { title: 'Kılıf', prompt: 'Kılıfı veya kutuyu çekin.' },
      { title: 'Uçlar', prompt: 'Yedek uç veya kabloyu çekin.' },
      defect,
    ];
  }
  return [
    { title: 'Ön yüz', prompt: 'Cihazın ön yüzünü çekin.' },
    { title: 'Arka yüz', prompt: 'Cihazın arka yüzünü çekin.' },
    { title: 'Kenarlar', prompt: 'Kenarları çekin.' },
    { title: 'Detay', prompt: 'Ekran veya bağlantıları çekin.' },
    defect,
  ];
}
