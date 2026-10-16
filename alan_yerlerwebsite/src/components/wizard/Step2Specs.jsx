import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Cpu, Monitor, Layers, HardDrive, Smartphone, Check, Globe, Gamepad2, Shield, Edit3 } from 'lucide-react';
import { DEVICE_SPECS_DATA, CONDITION_OPTIONS, choiceList, listed } from '../../data/wizardData';

export default function Step2Specs({ category, specs, onChangeSpecs, onBack, onNext, onResetCategory }) {
  const normalizedCategory = category || "laptop";
  const data = DEVICE_SPECS_DATA[normalizedCategory] || DEVICE_SPECS_DATA.laptop;

  const currentBrand = data.brands.includes(specs.brand) ? specs.brand : data.brands[0];
  const availableSeries = data.series[currentBrand] || ["Standart"];
  const currentSeries = listed(specs.series, availableSeries);
  const availableModels = data.models[currentSeries] || [currentSeries];
  const currentModel = listed(specs.model, availableModels);
  const availableCpus = choiceList(data, 'cpus', currentSeries, currentBrand);
  const availableGpus = choiceList(data, 'gpus', currentSeries, currentBrand);
  const availableRams = choiceList(data, 'rams', currentSeries, currentBrand);
  const availableStorages = choiceList(data, 'storages', currentSeries, currentBrand);
  const availableScreens = choiceList(data, 'screenSizes', currentSeries, currentBrand);
  const cpuValue = listed(specs.cpu, availableCpus);
  const gpuValue = listed(specs.gpu, availableGpus);
  const ramValue = listed(specs.ram, availableRams);
  const storageValue = listed(specs.storage, availableStorages);
  const screenValue = listed(specs.screenSize, availableScreens);

  const [isManualInput, setIsManualInput] = useState(false);

  const isPhone = normalizedCategory === 'phone';
  const isConsole = normalizedCategory === 'console';
  const isGpu = normalizedCategory === 'gpu';
  const showCpu = availableCpus.length > 0 && !isConsole && !isGpu && !['watch', 'headphones'].includes(normalizedCategory);
  const showGpu = availableGpus.length > 0 && ['laptop', 'macbook', 'desktop', 'mac-desktop', 'gpu'].includes(normalizedCategory);

  useEffect(() => {
    const next = {
      brand: currentBrand,
      series: currentSeries,
      model: currentModel,
      cpu: cpuValue,
      gpu: gpuValue,
      ram: ramValue,
      storage: storageValue,
      screenSize: screenValue,
    };
    const same = Object.keys(next).every((key) => (specs[key] || '') === (next[key] || ''));
    if (!same) onChangeSpecs({ ...specs, ...next });
  }, [normalizedCategory, currentBrand, currentSeries]);

  const categoryImages = {
    laptop: '/assets/categories/laptop.jpg',
    macbook: '/assets/categories/laptop.jpg',
    desktop: '/assets/categories/laptop.jpg',
    'mac-desktop': '/assets/categories/laptop.jpg',
    phone: '/assets/categories/phone.jpg',
    iphone: '/assets/categories/phone.jpg',
    tablet: '/assets/categories/tablet.jpg',
    ipad: '/assets/categories/tablet.jpg',
    console: '/assets/categories/console.jpg',
    gpu: '/assets/categories/gpu.jpg',
    watch: '/assets/categories/watch.jpg',
    headphones: '/assets/categories/headphones.jpg'
  };

  const specsFor = (brand, series, model) => ({
    ...specs,
    brand,
    series,
    model,
    cpu: listed(specs.cpu, choiceList(data, 'cpus', series, brand)),
    gpu: listed(specs.gpu, choiceList(data, 'gpus', series, brand)),
    ram: listed(specs.ram, choiceList(data, 'rams', series, brand)),
    storage: listed(specs.storage, choiceList(data, 'storages', series, brand)),
    screenSize: listed(specs.screenSize, choiceList(data, 'screenSizes', series, brand)),
  });

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    const series = (data.series[brand] || ["Standart"])[0];
    const model = (data.models[series] || [series])[0];
    onChangeSpecs(specsFor(brand, series, model));
  };

  const handleSeriesChange = (e) => {
    const series = e.target.value;
    const model = (data.models[series] || [series])[0];
    onChangeSpecs(specsFor(currentBrand, series, model));
  };

  return (
    <div className="wizard-substep-block">
      {/* Seçim Özeti Bandı */}
      <div className="wizard-selection-chip">
        <div className="chip-left-meta">
          <img 
            src={categoryImages[normalizedCategory] || '/assets/categories/laptop.jpg'} 
            alt={data.title} 
            className="chip-device-thumb" 
          />
          <div className="chip-text-group">
            <span className="chip-label-kicker">Seçilen Cihaz Türü</span>
            <strong className="chip-value-title">{data.title}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            type="button"
            className="chip-change-action-btn"
            onClick={() => setIsManualInput(!isManualInput)}
            style={{ background: isManualInput ? '#EFF6FF' : '#FFFFFF', color: isManualInput ? '#1D63FF' : '#334155' }}
          >
            <Edit3 size={12} />
            <span>{isManualInput ? 'Listeye Dön' : 'Manuel Yaz'}</span>
          </button>
          <button className="chip-change-action-btn" onClick={onResetCategory}>
            <RefreshCw size={12} />
            <span>Değiştir</span>
          </button>
        </div>
      </div>

      <div className="wizard-substep-head">
        <h3 className="wizard-substep-title">Teknik Donanım & Model Bilgileri</h3>
        <p className="wizard-substep-desc">
          Doğru mağaza teklifleri alabilmek için işlemci, RAM, depolama ve ekran kartı özelliklerini belirleyin.
        </p>
      </div>

      {isManualInput ? (
        /* MANUEL SERBEST METİN GİRİŞİ */
        <div className="wizard-form-input-grid manual-mode">
          <div className="wizard-form-cell full-width">
            <label className="wizard-cell-label">Marka ve Model Adı *</label>
            <input 
              type="text" 
              className="wizard-select-control highlight-focus"
              placeholder="Örn: Asus ROG Strix G16 G614JV"
              value={specs.model || ''}
              onChange={(e) => onChangeSpecs({ ...specs, model: e.target.value })}
            />
          </div>

          <div className="wizard-form-cell">
            <label className="wizard-cell-label">İşlemci (CPU)</label>
            <input 
              type="text" 
              className="wizard-select-control"
              placeholder="Örn: Intel Core i7-13650HX"
              value={specs.cpu || ''}
              onChange={(e) => onChangeSpecs({ ...specs, cpu: e.target.value })}
            />
          </div>

          <div className="wizard-form-cell">
            <label className="wizard-cell-label">Ekran Kartı (GPU)</label>
            <input 
              type="text" 
              className="wizard-select-control"
              placeholder="Örn: RTX 4060 8GB / Dahili"
              value={specs.gpu || ''}
              onChange={(e) => onChangeSpecs({ ...specs, gpu: e.target.value })}
            />
          </div>

          <div className="wizard-form-cell">
            <label className="wizard-cell-label">Bellek (RAM)</label>
            <input 
              type="text" 
              className="wizard-select-control"
              placeholder="Örn: 16 GB DDR5"
              value={specs.ram || ''}
              onChange={(e) => onChangeSpecs({ ...specs, ram: e.target.value })}
            />
          </div>

          <div className="wizard-form-cell">
            <label className="wizard-cell-label">Dahili Depolama</label>
            <input 
              type="text" 
              className="wizard-select-control"
              placeholder="Örn: 1 TB NVMe SSD"
              value={specs.storage || ''}
              onChange={(e) => onChangeSpecs({ ...specs, storage: e.target.value })}
            />
          </div>
        </div>
      ) : (
        /* KATALOG FORM ALANLARI */
        <div className="wizard-form-input-grid">
          {/* Marka */}
          <div className="wizard-form-cell">
            <label className="wizard-cell-label">Marka *</label>
            <select 
              className="wizard-select-control"
              value={currentBrand}
              onChange={handleBrandChange}
            >
              {data.brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Seri */}
          <div className="wizard-form-cell">
            <label className="wizard-cell-label">Seri / Model Ailesi *</label>
            <select 
              className="wizard-select-control"
              value={currentSeries}
              onChange={handleSeriesChange}
            >
              {availableSeries.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Model (Tam Genişlik) */}
          <div className="wizard-form-cell full-width">
            <label className="wizard-cell-label">Tam Model Adı *</label>
            <select 
              className="wizard-select-control highlight-focus"
              value={currentModel}
              onChange={(e) => onChangeSpecs({ ...specs, model: e.target.value })}
            >
              {availableModels.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* İşlemci (CPU) */}
          {showCpu && (
            <div className="wizard-form-cell full-width">
              <label className="wizard-cell-label flex-label">
                <Cpu size={15} style={{ color: 'var(--brand-blue)' }} />
                <span>İşlemci / Yonga Seti (CPU) *</span>
              </label>
              <select 
                className="wizard-select-control"
                value={cpuValue}
                onChange={(e) => onChangeSpecs({ ...specs, cpu: e.target.value })}
              >
                {availableCpus.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Ekran Kartı (GPU) - Varsa */}
          {showGpu && (
            <div className="wizard-form-cell full-width">
              <label className="wizard-cell-label flex-label">
                <Monitor size={15} style={{ color: '#8B5CF6' }} />
                <span>Ekran Kartı / Grafik Çipi (GPU)</span>
              </label>
              <select 
                className="wizard-select-control"
                value={gpuValue}
                onChange={(e) => onChangeSpecs({ ...specs, gpu: e.target.value })}
              >
                {availableGpus.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          )}

          {/* Bellek (RAM) - Şık İnteraktif Hap Butonlar */}
          {availableRams.length > 0 && !isConsole && !isGpu && (
            <div className="wizard-form-cell full-width">
              <label className="wizard-cell-label flex-label">
                <Layers size={15} style={{ color: '#6366F1' }} />
                <span>Bellek Kapasitesi (RAM) *</span>
              </label>
              <div className="wizard-interactive-pills-row">
                {availableRams.map(r => {
                  const isSelected = ramValue === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      className={`wizard-spec-pill-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => onChangeSpecs({ ...specs, ram: r })}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                      <span>{r}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dahili Depolama (SSD / ROM) - Şık İnteraktif Hap Butonlar */}
          {availableStorages.length > 0 && !isGpu && (
            <div className="wizard-form-cell full-width">
              <label className="wizard-cell-label flex-label">
                <HardDrive size={15} style={{ color: 'var(--accent-emerald)' }} />
                <span>Dahili Depolama / Kapasite (SSD) *</span>
              </label>
              <div className="wizard-interactive-pills-row">
                {availableStorages.map(st => {
                  const isSelected = storageValue === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      className={`wizard-spec-pill-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => onChangeSpecs({ ...specs, storage: st })}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                      <span>{st}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Telefon: BTK Kayıt Durumu */}
          {isPhone && (
            <div className="wizard-form-cell full-width">
              <label className="wizard-cell-label flex-label">
                <Globe size={15} style={{ color: 'var(--brand-blue)' }} />
                <span>BTK Kayıt & Menşei Durumu *</span>
              </label>
              <div className="wizard-interactive-pills-row">
                {CONDITION_OPTIONS.registrationStatuses.map(reg => {
                  const isSelected = (specs.registrationStatus || CONDITION_OPTIONS.registrationStatuses[0]) === reg;
                  return (
                    <button
                      key={reg}
                      type="button"
                      className={`wizard-spec-pill-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => onChangeSpecs({ ...specs, registrationStatus: reg })}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                      <span>{reg}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Konsol: Gamepad / Kol Sayısı */}
          {isConsole && (
            <div className="wizard-form-cell full-width">
              <label className="wizard-cell-label flex-label">
                <Gamepad2 size={15} style={{ color: '#6366F1' }} />
                <span>Kol (Gamepad) Durumu *</span>
              </label>
              <div className="wizard-interactive-pills-row">
                {CONDITION_OPTIONS.consoleGamepads.map(gp => {
                  const isSelected = (specs.gamepads || CONDITION_OPTIONS.consoleGamepads[0]) === gp;
                  return (
                    <button
                      key={gp}
                      type="button"
                      className={`wizard-spec-pill-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => onChangeSpecs({ ...specs, gamepads: gp })}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                      <span>{gp}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ekran Kartı: Güvenlik Bandı / Açılma Durumu */}
          {isGpu && (
            <div className="wizard-form-cell full-width">
              <label className="wizard-cell-label flex-label">
                <Shield size={15} style={{ color: 'var(--accent-emerald)' }} />
                <span>Güvenlik Bandı & Açılma Durumu *</span>
              </label>
              <div className="wizard-interactive-pills-row">
                {CONDITION_OPTIONS.gpuSecurityTags.map(tag => {
                  const isSelected = (specs.gpuSecurity || CONDITION_OPTIONS.gpuSecurityTags[0]) === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`wizard-spec-pill-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => onChangeSpecs({ ...specs, gpuSecurity: tag })}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ekran Boyutu (Varsa) */}
          {availableScreens.length > 0 && !isGpu && (
            <div className="wizard-form-cell full-width">
              <label className="wizard-cell-label flex-label">
                <Smartphone size={15} style={{ color: '#0EA5E9' }} />
                <span>Ekran Boyutu / Çıkış Parametresi</span>
              </label>
              <select 
                className="wizard-select-control"
                value={screenValue}
                onChange={(e) => onChangeSpecs({ ...specs, screenSize: e.target.value })}
              >
                {availableScreens.map(sc => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Canlı Seçim Önizleme Şeridi */}
      <div className="wizard-live-specs-summary-bar">
        <span className="summary-bar-label">Seçilen Donanım Yapılandırması:</span>
        <div className="summary-chips-wrap">
          <span className="summary-micro-chip"><strong>{currentBrand || 'Cihaz'}</strong></span>
          <span className="summary-micro-chip">{currentModel || currentSeries}</span>
          {showCpu && cpuValue && <span className="summary-micro-chip blue">{cpuValue}</span>}
          {ramValue && !isConsole && !isGpu && <span className="summary-micro-chip indigo">{ramValue}</span>}
          {storageValue && !isGpu && <span className="summary-micro-chip green">{storageValue}</span>}
          {showGpu && gpuValue && !/dahili/i.test(gpuValue) && <span className="summary-micro-chip purple">{gpuValue}</span>}
          {specs.registrationStatus && <span className="summary-micro-chip">{specs.registrationStatus.split('(')[0]}</span>}
          {specs.gamepads && <span className="summary-micro-chip indigo">{specs.gamepads}</span>}
        </div>
      </div>

      {/* Alt Aksiyon Butonları */}
      <div className="wizard-footer-action-bar dual">
        <button className="wizard-secondary-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Geri</span>
        </button>

        <button className="wizard-primary-submit-btn" onClick={onNext}>
          <span>Devam Et: Durum & Ekspertiz</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
