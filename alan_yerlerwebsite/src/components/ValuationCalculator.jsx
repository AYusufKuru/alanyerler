import React, { useState, useEffect } from 'react';
import { 
  Zap, ArrowRight, Cpu, HardDrive, Layers, Sparkles, BatteryCharging, 
  Monitor, PackageCheck, Shield, Gamepad2, Globe, Check, Edit3, X 
} from 'lucide-react';
import { DEVICE_SPECS_DATA, choiceList, listed, seriesFor } from '../data/wizardData';

export default function ValuationCalculator({ onSelectValuation }) {
  const [category, setCategory] = useState('laptop');
  const [brand, setBrand] = useState('Asus');
  const [model, setModel] = useState('ROG Strix G16 (i7-13650HX / RTX 4070)');
  const [cpu, setCpu] = useState('Intel Core i7-13650HX');
  const [gpu, setGpu] = useState('NVIDIA GeForce RTX 4070 8GB');
  const [ram, setRam] = useState('16 GB');
  const [storage, setStorage] = useState('1 TB NVMe SSD');
  const [batteryHealth, setBatteryHealth] = useState('%100 (Orijinal)');
  const [registrationStatus, setRegistrationStatus] = useState('🇹🇷 Türkiye Cihazı (BTK Kayıtlı)');
  const [gamepads, setGamepads] = useState('🎮 1 Adet Orijinal Kol');
  const [gpuSecurity, setGpuSecurity] = useState('🛡️ Orijinal Güvenlik Bandı Üzerinde (Açılmamış)');
  const [boxAndInvoice, setBoxAndInvoice] = useState(true);
  const [hasWarranty, setHasWarranty] = useState(true);
  const [condition, setCondition] = useState(1.05); // 1.05 = Sıfır gibi, 0.95 = Çok iyi, 0.85 = İyi
  const [conditionLabel, setConditionLabel] = useState('Sıfır Gibi');

  // Manuel Özel Donanım Giriş Modu
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customModel, setCustomModel] = useState('');
  const [customCpu, setCustomCpu] = useState('');
  const [customGpu, setCustomGpu] = useState('');
  const [customRam, setCustomRam] = useState('');
  const [customStorage, setCustomStorage] = useState('');

  const catData = DEVICE_SPECS_DATA[category] || DEVICE_SPECS_DATA.laptop;

  const hasBattery = ['laptop', 'macbook', 'phone', 'tablet', 'watch', 'headphones'].includes(category);
  const isComputer = ['laptop', 'macbook', 'desktop', 'mac-desktop'].includes(category);
  const isPhone = category === 'phone';
  const isConsole = category === 'console';
  const isGpu = category === 'gpu';

  // Kategori değiştiğinde akıllı varsayılanlar
  useEffect(() => {
    const defaultBrand = catData.brands[0] || 'Asus';
    const seriesList = catData.series[defaultBrand] || Object.values(catData.series)[0] || ['Standart'];
    const defaultSeries = seriesList[0];
    const modelsList = catData.models[defaultSeries] || [defaultSeries];
    const defaultModel = modelsList[0];
    const defaultCpu = choiceList(catData, 'cpus', defaultSeries, defaultBrand)[0] || '';
    const defaultGpu = choiceList(catData, 'gpus', defaultSeries, defaultBrand)[0] || '';
    const defaultRam = choiceList(catData, 'rams', defaultSeries, defaultBrand)[0] || '';
    const defaultStorage = choiceList(catData, 'storages', defaultSeries, defaultBrand)[0] || '';

    setBrand(defaultBrand);
    setModel(defaultModel);
    setCpu(defaultCpu);
    setGpu(defaultGpu);
    setRam(defaultRam);
    setStorage(defaultStorage);
    setIsCustomMode(false);
  }, [category]);

  const handleBrandChange = (newBrand) => {
    setBrand(newBrand);
    const seriesList = catData.series[newBrand] || Object.values(catData.series)[0] || ['Standart'];
    const defaultSeries = seriesList[0];
    const modelsList = catData.models[defaultSeries] || [defaultSeries];
    const nextModel = modelsList[0];
    setModel(nextModel);
    setCpu(choiceList(catData, 'cpus', defaultSeries, newBrand)[0] || '');
    setGpu(choiceList(catData, 'gpus', defaultSeries, newBrand)[0] || '');
    setRam(choiceList(catData, 'rams', defaultSeries, newBrand)[0] || '');
    setStorage(choiceList(catData, 'storages', defaultSeries, newBrand)[0] || '');
  };

  const applyModel = (nextModel) => {
    const nextSeries = seriesFor(catData, brand, nextModel);
    setModel(nextModel);
    setCpu((current) => listed(current, choiceList(catData, 'cpus', nextSeries, brand)));
    setGpu((current) => listed(current, choiceList(catData, 'gpus', nextSeries, brand)));
    setRam((current) => listed(current, choiceList(catData, 'rams', nextSeries, brand)));
    setStorage((current) => listed(current, choiceList(catData, 'storages', nextSeries, brand)));
  };

  // Dinamik Fiyatlama Hesaplama Motoru
  const calculatePriceRange = () => {
    let basePrice = 35000;

    // 1. Kategori ve Model Bazlı Fiyatlandırma
    if (category === 'macbook') {
      if (model.includes('16"')) basePrice = 58000;
      else if (model.includes('14" (M3 Max)')) basePrice = 72000;
      else if (model.includes('14"')) basePrice = 44000;
      else if (model.includes('Air 15')) basePrice = 32000;
      else basePrice = 24000;
    } else if (category === 'laptop') {
      if (model.includes('SCAR 18') || model.includes('RTX 4090')) basePrice = 65000;
      else if (model.includes('RTX 4080')) basePrice = 52000;
      else if (model.includes('ROG Strix G16') || model.includes('RTX 4070')) basePrice = 38000;
      else if (model.includes('Legion Pro 5') || model.includes('Victus')) basePrice = 31000;
      else basePrice = 25000;
    } else if (category === 'phone') {
      if (model.includes('15 Pro Max')) basePrice = 51000;
      else if (model.includes('15 Pro')) basePrice = 42000;
      else if (model.includes('14 Pro Max')) basePrice = 36000;
      else if (model.includes('S24 Ultra')) basePrice = 41000;
      else if (model.includes('S23 Ultra')) basePrice = 29000;
      else if (model.includes('Fold')) basePrice = 35000;
      else basePrice = 22000;

      // Türkiye Cihazı vs Yurt Dışı Çarpanı
      if (registrationStatus.includes('Yurt Dışı (Pasaport)')) basePrice *= 0.65;
      else if (registrationStatus.includes('Kayıtsız')) basePrice *= 0.50;
    } else if (category === 'desktop') {
      if (model.includes('Ultra High-End') || model.includes('4090')) basePrice = 75000;
      else if (model.includes('Mid-Range') || model.includes('4070')) basePrice = 42000;
      else basePrice = 28000;
    } else if (category === 'mac-desktop') {
      if (model.includes('Studio (M2 Ultra)')) basePrice = 85000;
      else if (model.includes('Studio')) basePrice = 48000;
      else if (model.includes('iMac')) basePrice = 34000;
      else basePrice = 21000; // Mac Mini
    } else if (category === 'console') {
      if (model.includes('PS5 Slim')) basePrice = 18500;
      else if (model.includes('Xbox Series X')) basePrice = 17000;
      else if (model.includes('Steam Deck OLED')) basePrice = 21000;
      else if (model.includes('Switch OLED')) basePrice = 11000;
      else if (model.includes('PS4 Pro')) basePrice = 9000;
      else basePrice = 15000;

      // Çift Kol Bonusu
      if (gamepads.includes('2 Adet')) basePrice += 2200;
      else if (gamepads.includes('3+')) basePrice += 3800;
      else if (gamepads.includes('Kolsuz')) basePrice -= 1500;
    } else if (category === 'gpu') {
      if (model.includes('4090')) basePrice = 62000;
      else if (model.includes('4080 Super')) basePrice = 39000;
      else if (model.includes('4070 Ti') || model.includes('4070 Super')) basePrice = 27000;
      else if (model.includes('7900 XTX')) basePrice = 33000;
      else if (model.includes('4060')) basePrice = 12500;
      else basePrice = 22000;

      // Güvenlik Bandı Etkisi
      if (gpuSecurity.includes('Açılmamış')) basePrice *= 1.05;
      else if (gpuSecurity.includes('Tamir')) basePrice *= 0.80;
    } else if (category === 'tablet') {
      if (model.includes('13" (M4)')) basePrice = 42000;
      else if (model.includes('11" (M4)')) basePrice = 34000;
      else if (model.includes('Tab S9 Ultra')) basePrice = 29000;
      else basePrice = 19000;
    } else if (category === 'watch') {
      if (model.includes('Ultra 2')) basePrice = 27000;
      else if (model.includes('Ultra')) basePrice = 22000;
      else if (model.includes('Series 9')) basePrice = 13500;
      else basePrice = 8500;
    } else if (category === 'headphones') {
      if (model.includes('AirPods Max')) basePrice = 17500;
      else if (model.includes('XM5')) basePrice = 11000;
      else basePrice = 8000;
    }

    // 2. RAM Fiyat Ekstrası
    let ramExtra = 0;
    const activeRam = isCustomMode ? customRam : ram;
    if (activeRam.includes('16 GB') || activeRam.includes('18 GB')) ramExtra = 3000;
    else if (activeRam.includes('24 GB') || activeRam.includes('32 GB') || activeRam.includes('36 GB')) ramExtra = 7500;
    else if (activeRam.includes('64 GB')) ramExtra = 15000;
    else if (activeRam.includes('96 GB') || activeRam.includes('128 GB')) ramExtra = 24000;

    // 3. Depolama Fiyat Ekstrası
    let storageExtra = 0;
    const activeStorage = isCustomMode ? customStorage : storage;
    if (activeStorage.includes('512 GB')) storageExtra = 2500;
    else if (activeStorage.includes('1 TB')) storageExtra = 5500;
    else if (activeStorage.includes('2 TB')) storageExtra = 11000;
    else if (activeStorage.includes('4 TB') || activeStorage.includes('8 TB')) storageExtra = 22000;

    // 4. İşlemci ve GPU Ekstrası
    let cpuExtra = 0;
    const activeCpu = isCustomMode ? customCpu : cpu;
    if (activeCpu.includes('M3 Max') || activeCpu.includes('14900') || activeCpu.includes('7800X3D')) cpuExtra = 6000;
    else if (activeCpu.includes('M3 Pro') || activeCpu.includes('13700') || activeCpu.includes('A17 Pro')) cpuExtra = 3000;

    let gpuExtra = 0;
    const activeGpu = isCustomMode ? customGpu : gpu;
    if (activeGpu.includes('4090')) gpuExtra = 18000;
    else if (activeGpu.includes('4080')) gpuExtra = 11000;
    else if (activeGpu.includes('4070')) gpuExtra = 6000;
    else if (activeGpu.includes('4060')) gpuExtra = 2500;

    // 5. Pil Sağlığı Çarpanı
    let batteryMultiplier = 1.0;
    if (hasBattery) {
      if (batteryHealth.includes('100')) batteryMultiplier = 1.02;
      else if (batteryHealth.includes('90')) batteryMultiplier = 0.98;
      else if (batteryHealth.includes('85')) batteryMultiplier = 0.93;
      else if (batteryHealth.includes('80')) batteryMultiplier = 0.86;
      else batteryMultiplier = 0.78;
    }

    // 6. Kutu / Garanti Ekstrası
    let trustBonus = 1.0;
    if (boxAndInvoice) trustBonus += 0.04;
    if (hasWarranty) trustBonus += 0.05;

    const calculatedTotal = (basePrice + ramExtra + storageExtra + cpuExtra + gpuExtra) * condition * batteryMultiplier * trustBonus;
    const minVal = Math.round((calculatedTotal * 0.95) / 250) * 250;
    const maxVal = Math.round((calculatedTotal * 1.05) / 250) * 250;

    return {
      minVal,
      maxVal,
      formattedText: `${formatMoney(minVal)} — ${formatMoney(maxVal)} TL`
    };
  };

  const priceResult = calculatePriceRange();

  const handleStart = () => {
    const finalModel = isCustomMode ? (customModel || `${brand} Özel Model`) : `${brand} ${model}`;
    const finalCpu = isCustomMode ? (customCpu || 'Özel İşlemci') : cpu;
    const finalGpu = isCustomMode ? (customGpu || 'Özel GPU') : gpu;
    const finalRam = isCustomMode ? (customRam || '16 GB') : ram;
    const finalStorage = isCustomMode ? (customStorage || '512 GB SSD') : storage;

    onSelectValuation({
      category,
      modelName: finalModel,
      estimatedPrice: priceResult.formattedText,
      conditionLabel,
      specs: {
        brand,
        series: model.split(' ')[0] || 'Standart',
        model: finalModel,
        cpu: finalCpu,
        gpu: finalGpu,
        ram: finalRam,
        storage: finalStorage,
        screenSize: choiceList(catData, 'screenSizes', seriesFor(catData, brand, model), brand)[0] || '',
        registrationStatus: isPhone ? registrationStatus : undefined,
        gamepads: isConsole ? gamepads : undefined,
        gpuSecurity: isGpu ? gpuSecurity : undefined
      },
      condition: {
        batteryHealth: hasBattery ? batteryHealth : '%100 (Adaptörlü / Fansız)',
        ssdHealth: '%100 Sağlık',
        boxAndInvoice,
        warranty: hasWarranty ? '6 - 12 Ay' : 'Garantisi Yok / Bitti',
        cosmeticLabel,
        adapter: 'Orijinal',
        workingState: 'perfect'
      }
    });
  };

  const activeSeries = seriesFor(catData, brand, model);
  const availableCpus = choiceList(catData, 'cpus', activeSeries, brand);
  const availableGpus = choiceList(catData, 'gpus', activeSeries, brand);
  const availableRams = choiceList(catData, 'rams', activeSeries, brand);
  const availableStorages = choiceList(catData, 'storages', activeSeries, brand);

  // Kategori Listesi
  const categoryTabs = [
    { id: 'laptop', label: 'Laptop', icon: '💻' },
    { id: 'macbook', label: 'MacBook', icon: '🍎' },
    { id: 'phone', label: 'Telefon', icon: '📱' },
    { id: 'desktop', label: 'Masaüstü PC', icon: '🖥️' },
    { id: 'console', label: 'Konsol', icon: '🎮' },
    { id: 'gpu', label: 'Ekran Kartı', icon: '⚡' },
    { id: 'tablet', label: 'Tablet & iPad', icon: '📟' },
    { id: 'watch', label: 'Saat', icon: '⌚' },
    { id: 'headphones', label: 'Kulaklık', icon: '🎧' }
  ];

  return (
    <div className="valuation-studio-box" id="degerleme">
      {/* Üst Başlık & Hızlı Rozetler */}
      <div className="studio-top-head">
        <div className="studio-heading-pill">
          <Zap size={14} className="studio-zap-icon" />
          <span>Canlı Piyasa Fiyat Robotu</span>
        </div>
        <div className="studio-head-actions">
          <button 
            type="button" 
            className={`btn-custom-mode-toggle ${isCustomMode ? 'active' : ''}`}
            onClick={() => setIsCustomMode(!isCustomMode)}
            title="Kendi donanımınızı serbestçe yazın"
          >
            <Edit3 size={13} />
            <span>{isCustomMode ? 'Katalog Moduna Dön' : 'Kendi Donanımını Yaz'}</span>
          </button>
          <span className="studio-live-badge">🟢 120+ Mağaza Verisi</span>
        </div>
      </div>

      {/* 1. Kategori Seçici Barı (Tüm Donanım Kategorileri) */}
      <div className="studio-category-tabs">
        {categoryTabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`studio-cat-tab-btn ${category === tab.id ? 'active' : ''}`}
            onClick={() => setCategory(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 2. Özel Donanım Giriş Modu (Listede Olmayanlar İçin) */}
      {isCustomMode ? (
        <div className="studio-custom-input-card">
          <div className="custom-input-header">
            <span className="custom-input-title">✏️ Özel Model ve Donanım Parametrelerini Girin:</span>
            <button className="btn-close-custom" onClick={() => setIsCustomMode(false)}>
              <X size={14} />
            </button>
          </div>
          <div className="studio-row-grid">
            <div className="studio-cell">
              <label className="studio-label">Cihaz / Model Adı</label>
              <input 
                type="text" 
                className="studio-text-input"
                placeholder="Örn: Asus ROG Zephyrus G14"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
              />
            </div>
            <div className="studio-cell">
              <label className="studio-label">İşlemci (CPU)</label>
              <input 
                type="text" 
                className="studio-text-input"
                placeholder="Örn: Ryzen 9 7940HS / i7 14700K"
                value={customCpu}
                onChange={(e) => setCustomCpu(e.target.value)}
              />
            </div>
          </div>
          <div className="studio-row-grid" style={{ marginTop: '8px' }}>
            <div className="studio-cell">
              <label className="studio-label">Ekran Kartı (GPU)</label>
              <input 
                type="text" 
                className="studio-text-input"
                placeholder="Örn: RTX 4070 8GB / Dahili"
                value={customGpu}
                onChange={(e) => setCustomGpu(e.target.value)}
              />
            </div>
            <div className="studio-cell">
              <label className="studio-label">RAM & Depolama</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="text" 
                  className="studio-text-input"
                  placeholder="32 GB"
                  value={customRam}
                  onChange={(e) => setCustomRam(e.target.value)}
                />
                <input 
                  type="text" 
                  className="studio-text-input"
                  placeholder="1 TB NVMe"
                  value={customStorage}
                  onChange={(e) => setCustomStorage(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standart Katalog Seçicisi */
        <>
          {/* Marka ve Model Seçici */}
          <div className="studio-row-grid">
            <div className="studio-cell">
              <label className="studio-label">Marka</label>
              <select 
                className="studio-select-input"
                value={brand}
                onChange={(e) => handleBrandChange(e.target.value)}
              >
                {catData.brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="studio-cell">
              <label className="studio-label">Model</label>
              <select 
                className="studio-select-input"
                value={model}
                onChange={(e) => applyModel(e.target.value)}
              >
                {catData.series[brand] ? (
                  catData.series[brand].flatMap(s => catData.models[s] || [s]).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))
                ) : (
                  <option value={model}>{model}</option>
                )}
              </select>
            </div>
          </div>

          {/* İşlemci (CPU) - Bilgisayar ve Tablet Kategorilerinde */}
          {(isComputer || category === 'tablet' || isPhone) && availableCpus.length > 0 && (
            <div className="studio-cell full-width">
              <div className="studio-label-with-icon">
                <Cpu size={14} style={{ color: 'var(--brand-blue)' }} />
                <span className="studio-label">İşlemci / Yonga Seti (CPU)</span>
              </div>
              <select 
                className="studio-select-input"
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
              >
                {availableCpus.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Ekran Kartı (GPU) - Laptop, Masaüstü ve GPU kategorisinde */}
          {availableGpus.length > 0 && ['laptop', 'macbook', 'desktop', 'mac-desktop', 'gpu'].includes(category) && (
            <div className="studio-cell full-width">
              <div className="studio-label-with-icon">
                <Monitor size={14} style={{ color: '#8B5CF6' }} />
                <span className="studio-label">Ekran Kartı (GPU)</span>
              </div>
              <select 
                className="studio-select-input"
                value={gpu}
                onChange={(e) => setGpu(e.target.value)}
              >
                {availableGpus.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          )}

          {/* Bellek (RAM) Hap Butonları */}
          {availableRams.length > 0 && !isConsole && !isGpu && (
            <div className="studio-pills-row">
              <div className="studio-label-with-icon">
                <Layers size={14} style={{ color: '#6366F1' }} />
                <span className="studio-label">Bellek (RAM)</span>
              </div>
              <div className="studio-pills-cluster">
                {availableRams.slice(0, 6).map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`studio-pill-tag ${ram === r ? 'active' : ''}`}
                    onClick={() => setRam(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dahili Depolama (SSD / ROM / Kapasite) */}
          {availableStorages.length > 0 && !isGpu && (
            <div className="studio-pills-row">
              <div className="studio-label-with-icon">
                <HardDrive size={14} style={{ color: 'var(--accent-emerald)' }} />
                <span className="studio-label">Dahili Depolama (Kapasite)</span>
              </div>
              <div className="studio-pills-cluster">
                {availableStorages.slice(0, 5).map(st => (
                  <button
                    key={st}
                    type="button"
                    className={`studio-pill-tag ${storage === st ? 'active' : ''}`}
                    onClick={() => setStorage(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Telefon: BTK Kayıt Durumu */}
          {isPhone && (
            <div className="studio-pills-row phone-reg-row">
              <div className="studio-label-with-icon">
                <Globe size={14} style={{ color: 'var(--brand-blue)' }} />
                <span className="studio-label">BTK Kayıt Durumu</span>
              </div>
              <div className="studio-pills-cluster">
                {['🇹🇷 Türkiye Cihazı (BTK Kayıtlı)', '✈️ Yurt Dışı (Pasaport)', '⚠️ Kayıtsız'].map(reg => (
                  <button
                    key={reg}
                    type="button"
                    className={`studio-pill-tag ${registrationStatus === reg ? 'active' : ''}`}
                    onClick={() => setRegistrationStatus(reg)}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Konsol: Kol Sayısı */}
          {isConsole && (
            <div className="studio-pills-row console-row">
              <div className="studio-label-with-icon">
                <Gamepad2 size={14} style={{ color: '#6366F1' }} />
                <span className="studio-label">Gamepad / Kol Durumu</span>
              </div>
              <div className="studio-pills-cluster">
                {['🎮 1 Adet Orijinal Kol', '🎮 2 Adet Orijinal Kol (Çift)', '🕹️ Kolsuz'].map(g => (
                  <button
                    key={g}
                    type="button"
                    className={`studio-pill-tag ${gamepads === g ? 'active' : ''}`}
                    onClick={() => setGamepads(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ekran Kartı: Güvenlik Bandı */}
          {isGpu && (
            <div className="studio-pills-row gpu-row">
              <div className="studio-label-with-icon">
                <Shield size={14} style={{ color: 'var(--accent-emerald)' }} />
                <span className="studio-label">Güvenlik Bandı / Açılma Durumu</span>
              </div>
              <div className="studio-pills-cluster">
                {['🛡️ Orijinal Güvenlik Bandı Üzerinde', '🔧 Macun Yenilenmiş', '⚠️ Tamir Görmüş'].map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`studio-pill-tag ${gpuSecurity === s ? 'active' : ''}`}
                    onClick={() => setGpuSecurity(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 3. Pil Sağlığı (Yalnızca Bataryalı Cihazlarda) */}
      {hasBattery && (
        <div className="studio-pills-row battery-row">
          <div className="studio-label-with-icon">
            <BatteryCharging size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span className="studio-label">Pil Sağlığı</span>
          </div>
          <div className="studio-pills-cluster">
            {['%100 (Orijinal)', '%90 - %99', '%85 - %89', '%80 - %84', '<%80 Servis'].map(b => (
              <button
                key={b}
                type="button"
                className={`studio-pill-tag ${batteryHealth === b ? 'active' : ''}`}
                onClick={() => setBatteryHealth(b)}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Kutu, Fatura ve Garanti Çipleri */}
      <div className="studio-accessories-row">
        <button
          type="button"
          className={`studio-toggle-chip ${boxAndInvoice ? 'active' : ''}`}
          onClick={() => setBoxAndInvoice(!boxAndInvoice)}
        >
          <PackageCheck size={14} />
          <span>{boxAndInvoice ? '✓ Kutu & Fatura Var (+%4)' : 'Kutu / Fatura Yok'}</span>
        </button>

        <button
          type="button"
          className={`studio-toggle-chip ${hasWarranty ? 'active' : ''}`}
          onClick={() => setHasWarranty(!hasWarranty)}
        >
          <Shield size={14} />
          <span>{hasWarranty ? '✓ Garantisi Var (+%5)' : 'Garantisiz'}</span>
        </button>
      </div>

      {/* 5. Kozmetik Kondisyon */}
      <div className="studio-pills-row condition-row">
        <div className="studio-label-with-icon">
          <Sparkles size={14} style={{ color: '#F59E0B' }} />
          <span className="studio-label">Kondisyon</span>
        </div>
        <div className="studio-pills-cluster">
          <button
            type="button"
            className={`studio-pill-tag cond-pill ${condition === 1.05 ? 'active' : ''}`}
            onClick={() => { setCondition(1.05); setConditionLabel('Sıfır Gibi'); }}
          >
            ✨ Sıfır Gibi
          </button>
          <button
            type="button"
            className={`studio-pill-tag cond-pill ${condition === 0.95 ? 'active' : ''}`}
            onClick={() => { setCondition(0.95); setConditionLabel('Çok İyi'); }}
          >
            👍 Çok İyi
          </button>
          <button
            type="button"
            className={`studio-pill-tag cond-pill ${condition === 0.85 ? 'active' : ''}`}
            onClick={() => { setCondition(0.85); setConditionLabel('İyi'); }}
          >
            👌 İyi
          </button>
        </div>
      </div>

      {/* 6. Canlı Fiyat & Handoff Çubuğu */}
      <div className="studio-price-action-bar">
        <div className="studio-price-left">
          <span className="studio-price-subtitle">Tahmini Canlı Mağaza Teklifi</span>
          <span className="studio-price-amount">{priceResult.formattedText}</span>
          <div className="studio-specs-summary-badge" title={`${brand} ${model}`}>
            <span>{isCustomMode ? (customModel || 'Özel Cihaz') : model.split('(')[0]}</span>
            {ram && <span> • {ram}</span>}
            {storage && <span> • {storage.split(' ')[0]}</span>}
            <span> • <strong style={{ color: 'var(--accent-emerald)' }}>{conditionLabel}</strong></span>
          </div>
        </div>

        <button className="btn-studio-cta" onClick={handleStart}>
          <span>Hemen Teklif Al</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function formatMoney(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
