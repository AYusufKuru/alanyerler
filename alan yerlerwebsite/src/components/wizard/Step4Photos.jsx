import React, { useState } from 'react';
import { ArrowLeft, Upload, Trash2, Sparkles, ShieldCheck } from 'lucide-react';

export default function Step4Photos({ category, specs, condition, photos, onPhotosChange, onBack, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kategoriye özel akıllı fotoğraf yükleme rehberi
  const getCategoryPhotoGuide = (cat) => {
    switch (cat) {
      case 'phone':
        return [
          { id: "p1", title: "Ön Ekran (Açık ve Çiziksiz)", url: "/assets/categories/phone.jpg" },
          { id: "p2", title: "Arka Kapak & Kamera Lensleri", url: "/assets/categories/phone.jpg" },
          { id: "p3", title: "Yan Çerçeve & Köşeler", url: "/assets/categories/phone.jpg" },
          { id: "p4", title: "Kutu, Fatura & Şarj Kablosu", url: "/assets/categories/phone.jpg" }
        ];
      case 'console':
        return [
          { id: "p1", title: "Konsol Ana Gövde (Ön/Üst)", url: "/assets/categories/console.jpg" },
          { id: "p2", title: "Oyun Kolu / Gamepad", url: "/assets/categories/console.jpg" },
          { id: "p3", title: "HDMI & Güç Kabloları", url: "/assets/categories/console.jpg" },
          { id: "p4", title: "Kutu & Fatura", url: "/assets/categories/console.jpg" }
        ];
      case 'gpu':
        return [
          { id: "p1", title: "Ön Fanlar & Soğutma Bloğu", url: "/assets/categories/gpu.jpg" },
          { id: "p2", title: "Arka Metal Plaka (Backplate)", url: "/assets/categories/gpu.jpg" },
          { id: "p3", title: "PCIe & Görüntü Portları", url: "/assets/categories/gpu.jpg" },
          { id: "p4", title: "Orijinal Kutu & Garanti Belgesi", url: "/assets/categories/gpu.jpg" }
        ];
      case 'tablet':
        return [
          { id: "p1", title: "Ekran & Çerçeve Durumu", url: "/assets/categories/tablet.jpg" },
          { id: "p2", title: "Arka Kapak & Kamera", url: "/assets/categories/tablet.jpg" },
          { id: "p3", title: "Kalem / Klavye (Varsa)", url: "/assets/categories/tablet.jpg" },
          { id: "p4", title: "Kutu & Adaptör", url: "/assets/categories/tablet.jpg" }
        ];
      case 'watch':
        return [
          { id: "p1", title: "Ön Cam & Titanyum/Çelik Kasa", url: "/assets/categories/watch.jpg" },
          { id: "p2", title: "Arka Sensör Alanı", url: "/assets/categories/watch.jpg" },
          { id: "p3", title: "Orijinal Kordon / Kayış", url: "/assets/categories/watch.jpg" },
          { id: "p4", title: "Manyetik Hızlı Şarj Kablosu", url: "/assets/categories/watch.jpg" }
        ];
      case 'headphones':
        return [
          { id: "p1", title: "Kulak Yastıkları (Earpads)", url: "/assets/categories/headphones.jpg" },
          { id: "p2", title: "Kafa Bandı & Menteşeler", url: "/assets/categories/headphones.jpg" },
          { id: "p3", title: "Taşıma Çantası / Kılıf", url: "/assets/categories/headphones.jpg" },
          { id: "p4", title: "Kutu & Orijinal Kablolar", url: "/assets/categories/headphones.jpg" }
        ];
      default: // laptop & desktop
        return [
          { id: "p1", title: "Ön Yüz / Ekran", url: "/assets/categories/laptop.jpg" },
          { id: "p2", title: "Klavye & Üst Gövde", url: "/assets/hero-devices.jpg" },
          { id: "p3", title: "Kapak & Arka Yüzey", url: "/assets/categories/laptop.jpg" },
          { id: "p4", title: "Kutu, Fatura & Adaptör", url: "/assets/categories/laptop.jpg" }
        ];
    }
  };

  const samplePhotoList = getCategoryPhotoGuide(category);

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

  const handleFillSamples = () => {
    onPhotosChange(samplePhotoList.map(s => s.url));
  };

  const handleRemovePhoto = (index) => {
    const updated = [...photos];
    updated.splice(index, 1);
    onPhotosChange(updated);
  };

  const handleSubmitClick = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
    }, 1200);
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
          Doğru ve net fotoğraflar eklemek tekliflerin hızını ve tutarını %40 artırır.
        </p>
      </div>

      {/* Fotoğraf Yükleme Slotları */}
      <div className="wizard-photo-slots-grid">
        {samplePhotoList.map((slot, index) => {
          const uploadedUrl = photos[index];
          return (
            <div key={slot.id} className={`wizard-photo-slot ${uploadedUrl ? 'filled' : ''}`}>
              {uploadedUrl ? (
                <div className="wizard-photo-preview-wrap">
                  <img src={uploadedUrl} alt={slot.title} className="wizard-uploaded-img" />
                  <span className="wizard-photo-badge">{slot.title}</span>
                  <button 
                    type="button" 
                    className="wizard-photo-remove-action"
                    onClick={() => handleRemovePhoto(index)}
                    title="Fotoğrafı Kaldır"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div className="wizard-photo-placeholder" onClick={handleFillSamples}>
                  <div className="placeholder-icon-circle">
                    <Upload size={20} />
                  </div>
                  <span className="placeholder-title">{slot.title}</span>
                  <span className="placeholder-hint">Görsel Seç</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

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
          <span className="recap-chip-item">💾 SSD: {condition.ssdHealth || "%100"}</span>
          <span className="recap-chip-item">📦 Kutu/Fatura: {condition.boxAndInvoice ? "Var" : "Yok"}</span>
          <span className="recap-chip-item">🛡️ Garanti: {condition.warranty || "6 - 12 Ay"}</span>
          <span className="recap-chip-item">✨ Durum: {condition.cosmeticLabel || "Sıfır Gibi"}</span>
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
