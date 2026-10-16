const categorySlugs = {
  phone: 'telefon',
  iphone: 'telefon',
  laptop: 'bilgisayar',
  macbook: 'bilgisayar',
  desktop: 'bilgisayar',
  'mac-desktop': 'bilgisayar',
  console: 'oyun-konsolu',
  gpu: 'ekran-karti',
  tablet: 'tablet',
  ipad: 'tablet',
  watch: 'akilli-saat',
  headphones: 'kulaklik',
};

export function buildListing(categories, siteCategory, specs, condition) {
  const slug = categorySlugs[siteCategory] || categorySlugs.laptop;
  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    throw new Error('Cihaz kategorisi sunucuda bulunamadı.');
  }
  const typeSlug = deviceSlug(siteCategory, specs);
  const deviceType = category.deviceTypes.find((item) => item.slug === typeSlug)
    || category.deviceTypes[0];
  if (!deviceType) {
    throw new Error('Cihaz türü sunucuda bulunamadı.');
  }

  return {
    categoryId: category.id,
    deviceTypeId: deviceType.id,
    specs: fillFields(deviceType.specFields, (key) => specValue(key, deviceType.slug, specs)),
    condition: fillFields(deviceType.conditionFields, (key) => conditionValue(key, specs, condition)),
  };
}

function deviceSlug(siteCategory, specs) {
  const text = `${specs.brand || ''} ${specs.series || ''} ${specs.model || ''} ${specs.gpu || ''}`.toLowerCase();
  const apple = text.includes('apple') || text.includes('iphone') || text.includes('macbook') || text.includes('ipad');
  if (siteCategory === 'iphone' || (siteCategory === 'phone' && apple)) return 'iphone';
  if (siteCategory === 'phone') return 'android-telefon';
  if (siteCategory === 'macbook' || (siteCategory === 'laptop' && apple)) return 'macbook';
  if (siteCategory === 'laptop') return 'laptop';
  if (siteCategory === 'mac-desktop' || (siteCategory === 'desktop' && apple)) return 'mac-masaustu';
  if (siteCategory === 'desktop') return 'masaustu';
  if (siteCategory === 'console') {
    if (text.includes('xbox')) return 'xbox';
    if (text.includes('switch') || text.includes('nintendo')) return 'nintendo';
    return 'playstation';
  }
  if (siteCategory === 'gpu') {
    if (text.includes('radeon') || text.includes('amd') || text.includes('rx ')) return 'amd-ekran-karti';
    return 'nvidia';
  }
  if (siteCategory === 'ipad' || (siteCategory === 'tablet' && apple)) return 'ipad';
  if (siteCategory === 'tablet') return 'android-tablet';
  if (siteCategory === 'watch') return apple ? 'apple-watch' : 'diger-saat';
  return 'kulaklik';
}

function fillFields(fields, valueFor) {
  const result = {};
  fields.forEach((field) => {
    const raw = `${valueFor(field.key) || ''}`.trim();
    if (!raw) {
      if (field.required && field.options?.includes('Diğer')) {
        result[field.key] = 'Diğer';
        result[`${field.key}Diger`] = 'Belirtilmedi';
      }
      return;
    }
    if (!field.options) {
      result[field.key] = raw.slice(0, field.maxLength || 200);
      return;
    }
    const exact = field.options.find((option) => option.toLowerCase() === raw.toLowerCase());
    if (exact) {
      result[field.key] = exact;
      return;
    }
    const contained = field.options.find((option) => option !== 'Diğer' && raw.toLowerCase().includes(option.toLowerCase()));
    if (contained) {
      result[field.key] = contained;
      return;
    }
    if (field.options.includes('Diğer')) {
      result[field.key] = 'Diğer';
      result[`${field.key}Diger`] = raw.slice(0, 80);
      return;
    }
    result[field.key] = field.options[0];
  });
  return result;
}

function specValue(key, typeSlug, specs) {
  if (key === 'marka') {
    if (typeSlug === 'playstation') return 'Sony';
    if (typeSlug === 'xbox') return 'Microsoft';
    if (typeSlug === 'nintendo') return 'Nintendo';
    if (['iphone', 'macbook', 'mac-masaustu', 'ipad', 'apple-watch'].includes(typeSlug)) return 'Apple';
    return specs.brand || '';
  }
  if (key === 'seri') return specs.series || '';
  if (key === 'model') return specs.model || '';
  if (key === 'islemci') return specs.cpu || '';
  if (key === 'ekranKarti') return specs.gpu || '';
  if (key === 'ram') return memoryLabel(specs.ram);
  if (key === 'depolama') return memoryLabel(specs.storage);
  if (key === 'bellek') return memoryLabel(specs.gpu || specs.model || '');
  if (key === 'ekranBoyutu') return screenLabel(specs.screenSize);
  if (key === 'renk') return specs.color || '';
  if (key === 'kolAdedi') return padCount(specs.gamepads);
  if (key === 'baglanti') return connectionLabel(typeSlug, specs);
  if (key === 'kasaOlcusu') return specs.caseSize || '';
  return '';
}

function conditionValue(key, specs, condition) {
  if (key === 'pilSagligi') return healthBucket(condition.batteryHealth);
  if (key === 'depolamaSagligi') return healthBucket(condition.ssdHealth);
  if (key === 'kutuFatura') return condition.boxAndInvoice === false ? 'Yok' : 'Var';
  if (key === 'kalanGaranti') return warrantyLabel(condition.warranty);
  if (key === 'kozmetik') return cosmeticLabel(condition.cosmeticLabel);
  if (key === 'adaptor') return adapterLabel(condition.adapter);
  if (key === 'calisma') return condition.workingState === 'issues' ? 'Bazı sorunlar var' : 'Sorunsuz çalışıyor';
  if (key === 'ekBilgi') return extraNote(specs, condition);
  return '';
}

function memoryLabel(raw) {
  const match = `${raw || ''}`.toUpperCase().match(/(\d+)\s*(TB|GB)/);
  return match ? `${match[1]} ${match[2]}` : `${raw || ''}`;
}

function screenLabel(raw) {
  const match = `${raw || ''}`.match(/(\d+)/);
  return match ? `${match[1]} inç` : '';
}

function padCount(raw) {
  const text = `${raw || ''}`;
  if (text.includes('Kolsuz')) return '0';
  if (text.includes('3')) return '3';
  const digit = text.match(/[1-4]/);
  return digit ? digit[0] : '1';
}

function connectionLabel(typeSlug, specs) {
  const text = `${specs.model || ''} ${specs.series || ''}`.toLowerCase();
  if (typeSlug === 'kulaklik') return text.includes('kablolu') ? 'Kablolu' : 'Kablosuz';
  if (text.includes('hücresel') || text.includes('hucresel') || text.includes('cellular') || text.includes('lte')) {
    return 'Hücresel';
  }
  return 'Wi-Fi';
}

function healthBucket(raw) {
  const text = `${raw || ''}`.toLocaleLowerCase('tr');
  if (text.includes('altı') || text.includes('alti')) return '%80 altı';
  if (text.includes('100')) return '%100';
  if (text.includes('90') || text.includes('95') || text.includes('99')) return '%90–99';
  if (text.includes('80') || text.includes('85') || text.includes('89')) return '%80–89';
  return '%100';
}

function warrantyLabel(raw) {
  const text = `${raw || ''}`.toLocaleLowerCase('tr');
  if (text.includes('yok') || text.includes('bitti')) return 'Yok';
  if (text.includes('12 - 24') || text.includes('12–24')) return '12 aydan fazla';
  if (text.includes('6 - 12') || text.includes('6–12')) return '6–12 ay';
  if (text.includes('1 - 6') || text.includes('1–6')) return '0–6 ay';
  return 'Yok';
}

function cosmeticLabel(raw) {
  const text = `${raw || ''}`.toLocaleLowerCase('tr');
  if (text.includes('kötü') || text.includes('kotu')) return 'Kötü';
  if (text.includes('orta')) return 'Orta';
  if (text.includes('iyi') && !text.includes('sıfır') && !text.includes('sifir')) return 'İyi';
  return 'Sıfır gibi';
}

function adapterLabel(raw) {
  const text = `${raw || ''}`;
  if (text.includes('Yok')) return 'Yok';
  if (text.includes('Muadil')) return 'Muadil';
  return 'Orijinal';
}

function extraNote(specs, condition) {
  return [condition.notes, condition.thermalHealth, specs.registrationStatus, specs.gpuSecurity]
    .map((part) => `${part || ''}`.trim())
    .filter(Boolean)
    .join(' · ')
    .slice(0, 200);
}
