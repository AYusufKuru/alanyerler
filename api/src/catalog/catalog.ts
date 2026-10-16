export type CatalogField = {
  key: string;
  label: string;
  required: boolean;
  options?: string[];
  maxLength?: number;
};

export type DeviceTypeCatalog = {
  slug: string;
  name: string;
  specFields: CatalogField[];
  conditionFields: CatalogField[];
};

export type CategoryCatalog = {
  slug: string;
  name: string;
  deviceTypes: DeviceTypeCatalog[];
};

const OTHER = 'Diğer';

function withOther(options: string[]): string[] {
  return [...options, OTHER];
}

function select(
  key: string,
  label: string,
  required: boolean,
  options: string[],
): CatalogField {
  return { key, label, required, options };
}

function note(key: string, label: string, maxLength: number): CatalogField {
  return { key, label, required: false, maxLength };
}

const storage = withOther(['64 GB', '128 GB', '256 GB', '512 GB', '1 TB', '2 TB']);
const ram = withOther(['4 GB', '8 GB', '16 GB', '18 GB', '24 GB', '32 GB', '36 GB', '64 GB']);
const cpu = withOther([
  'M1',
  'M2',
  'M3',
  'M4',
  'Intel Core i5',
  'Intel Core i7',
  'Intel Core i9',
  'AMD Ryzen 5',
  'AMD Ryzen 7',
  'AMD Ryzen 9',
]);
const gpu = withOther([
  'Dahili',
  'RTX 3050',
  'RTX 4060',
  'RTX 4070',
  'RTX 4080',
  'RTX 4090',
  'RX 7600',
  'RX 7800',
]);
const screen = withOther(['13 inç', '14 inç', '15 inç', '16 inç', '17 inç']);
const colors = withOther([
  'Siyah',
  'Beyaz',
  'Mavi',
  'Mor',
  'Yeşil',
  'Gümüş',
  'Altın',
  'Doğal Titanyum',
]);

const pil = select('pilSagligi', 'Pil Sağlığı', true, [
  '%100',
  '%90–99',
  '%80–89',
  '%80 altı',
]);
const depolamaSagligi = select('depolamaSagligi', 'Depolama Sağlığı', true, [
  '%100',
  '%90–99',
  '%80–89',
  '%80 altı',
]);
const kutu = select('kutu', 'Kutu', true, ['Var', 'Yok']);
const fatura = select('fatura', 'Fatura', true, ['Var', 'Yok']);
const kalanGaranti = select('kalanGaranti', 'Kalan Garanti Süresi', true, [
  'Yok',
  '0–6 ay',
  '6–12 ay',
  '12 aydan fazla',
]);
const kozmetik = select('kozmetik', 'Kozmetik Durumu', true, [
  'Kusursuz',
  'Çok İyi',
  'İyi',
  'Orta',
  'Hasarlı',
]);
const adaptor = select('adaptor', 'Adaptör', true, ['Orijinal', 'Muadil', 'Yok']);
const calisma = select('calisma', 'Cihazın Çalışma Durumu', true, [
  'Sorunsuz çalışıyor',
  'Bazı sorunlar var',
]);
const ekBilgi = note('ekBilgi', 'Ek Bilgi', 200);

function conditionOf(extras: CatalogField[] = []): CatalogField[] {
  return [...extras, kutu, fatura, kalanGaranti, kozmetik, calisma, ekBilgi];
}

function computerSpecs(input: {
  brands: string[];
  series?: string[];
  models: string[];
  gpuRequired: boolean;
  screen: boolean;
}): CatalogField[] {
  const fields: CatalogField[] = [
    select('marka', 'Marka', true, input.brands),
  ];
  if (input.series) {
    fields.push(select('seri', 'Seri', true, input.series));
  }
  fields.push(
    select('model', 'Model', true, input.models),
    select('islemci', 'İşlemci', true, cpu),
    select('ekranKarti', 'Ekran Kartı', input.gpuRequired, gpu),
    select('ram', 'RAM', true, ram),
    select('depolama', 'Depolama', true, storage),
  );
  if (input.screen) {
    fields.push(select('ekranBoyutu', 'Ekran Boyutu', false, screen));
  }
  return fields;
}

const laptopBrands = withOther([
  'Apple',
  'Lenovo',
  'Asus',
  'HP',
  'Dell',
  'MSI',
  'Monster',
  'Huawei',
]);
const laptopSeries = withOther([
  'MacBook Pro',
  'MacBook Air',
  'ThinkPad',
  'IdeaPad',
  'Zenbook',
  'Vivobook',
  'Pavilion',
  'XPS',
  'Prestige',
  'Katana',
  'Abra',
]);
const laptopModels = withOther([
  'MacBook Pro 14 inç (2023)',
  'MacBook Pro 16 inç',
  'MacBook Air 13 inç',
  'MacBook Air 15 inç',
  'ThinkPad E14',
  'Zenbook 14',
  'TUF Gaming A15',
  'Victus 16',
  'XPS 13',
]);

export const catalog: CategoryCatalog[] = [
  {
    slug: 'telefon',
    name: 'Telefon',
    deviceTypes: [
      {
        slug: 'iphone',
        name: 'iPhone',
        specFields: [
          select('marka', 'Marka', true, ['Apple']),
          select('model', 'Model', true, withOther([
            'iPhone 13',
            'iPhone 14',
            'iPhone 15',
            'iPhone 15 Pro',
            'iPhone 16',
            'iPhone 16 Pro',
            'iPhone 16 Pro Max',
          ])),
          select('depolama', 'Depolama', true, storage),
          select('renk', 'Renk', true, colors),
        ],
        conditionFields: conditionOf([pil, adaptor]),
      },
      {
        slug: 'android-telefon',
        name: 'Android telefon',
        specFields: [
          select('marka', 'Marka', true, withOther([
            'Samsung',
            'Xiaomi',
            'Huawei',
            'Oppo',
            'Realme',
            'Google',
          ])),
          select('model', 'Model', true, withOther([
            'Galaxy S23',
            'Galaxy S24',
            'Galaxy A54',
            'Redmi Note 13',
            'Xiaomi 14',
            'Pixel 8',
          ])),
          select('depolama', 'Depolama', true, storage),
          select('renk', 'Renk', true, colors),
        ],
        conditionFields: conditionOf([pil, adaptor]),
      },
    ],
  },
  {
    slug: 'bilgisayar',
    name: 'Bilgisayar / Laptop',
    deviceTypes: [
      {
        slug: 'laptop',
        name: 'Laptop',
        specFields: computerSpecs({
          brands: laptopBrands,
          series: laptopSeries,
          models: laptopModels,
          gpuRequired: false,
          screen: true,
        }),
        conditionFields: conditionOf([pil, depolamaSagligi, adaptor]),
      },
      {
        slug: 'masaustu',
        name: 'Masaüstü',
        specFields: computerSpecs({
          brands: withOther(['Asus', 'HP', 'Dell', 'Lenovo', 'MSI', 'Monster']),
          models: withOther(['ROG Strix', 'Pavilion', 'OptiPlex', 'ThinkCentre', 'Infinite']),
          gpuRequired: true,
          screen: false,
        }),
        conditionFields: conditionOf([depolamaSagligi, adaptor]),
      },
      {
        slug: 'macbook',
        name: 'MacBook',
        specFields: computerSpecs({
          brands: ['Apple'],
          series: withOther(['MacBook Pro', 'MacBook Air']),
          models: withOther([
            'MacBook Pro 14 inç (2023)',
            'MacBook Pro 16 inç',
            'MacBook Air 13 inç',
            'MacBook Air 15 inç',
          ]),
          gpuRequired: false,
          screen: true,
        }),
        conditionFields: conditionOf([pil, depolamaSagligi, adaptor]),
      },
      {
        slug: 'mac-masaustu',
        name: 'Mac Masaüstü',
        specFields: computerSpecs({
          brands: ['Apple'],
          models: withOther(['iMac', 'Mac mini', 'Mac Studio', 'Mac Pro']),
          gpuRequired: true,
          screen: false,
        }),
        conditionFields: conditionOf([depolamaSagligi, adaptor]),
      },
    ],
  },
  {
    slug: 'oyun-konsolu',
    name: 'Oyun Konsolu',
    deviceTypes: [
      {
        slug: 'playstation',
        name: 'PlayStation',
        specFields: [
          select('marka', 'Marka', true, ['Sony']),
          select('model', 'Model', true, withOther(['PlayStation 4', 'PlayStation 4 Pro', 'PlayStation 5', 'PlayStation 5 Slim'])),
          select('depolama', 'Depolama', true, storage),
          select('kolAdedi', 'Kol Adedi', true, ['0', '1', '2', '3', '4']),
        ],
        conditionFields: conditionOf([adaptor]),
      },
      {
        slug: 'xbox',
        name: 'Xbox',
        specFields: [
          select('marka', 'Marka', true, ['Microsoft']),
          select('model', 'Model', true, withOther(['Xbox One', 'Xbox Series S', 'Xbox Series X'])),
          select('depolama', 'Depolama', true, storage),
          select('kolAdedi', 'Kol Adedi', true, ['0', '1', '2', '3', '4']),
        ],
        conditionFields: conditionOf([adaptor]),
      },
      {
        slug: 'nintendo',
        name: 'Nintendo',
        specFields: [
          select('marka', 'Marka', true, ['Nintendo']),
          select('model', 'Model', true, withOther(['Switch', 'Switch OLED', 'Switch 2'])),
          select('depolama', 'Depolama', true, storage),
          select('kolAdedi', 'Kol Adedi', true, ['0', '1', '2', '3', '4']),
        ],
        conditionFields: conditionOf([adaptor]),
      },
    ],
  },
  {
    slug: 'ekran-karti',
    name: 'Ekran Kartı',
    deviceTypes: [
      {
        slug: 'nvidia',
        name: 'NVIDIA',
        specFields: [
          select('marka', 'Marka', true, withOther(['NVIDIA', 'Asus', 'MSI', 'Gigabyte'])),
          select('model', 'Model', true, withOther(['RTX 3060', 'RTX 3070', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 4090'])),
          select('bellek', 'Bellek', true, withOther(['8 GB', '12 GB', '16 GB', '24 GB'])),
        ],
        conditionFields: conditionOf(),
      },
      {
        slug: 'amd-ekran-karti',
        name: 'AMD',
        specFields: [
          select('marka', 'Marka', true, withOther(['AMD', 'Sapphire', 'Asus', 'MSI'])),
          select('model', 'Model', true, withOther(['RX 6600', 'RX 6700 XT', 'RX 7600', 'RX 7800 XT', 'RX 7900 XTX'])),
          select('bellek', 'Bellek', true, withOther(['8 GB', '12 GB', '16 GB', '24 GB'])),
        ],
        conditionFields: conditionOf(),
      },
    ],
  },
  {
    slug: 'tablet',
    name: 'Tablet',
    deviceTypes: [
      {
        slug: 'ipad',
        name: 'iPad',
        specFields: [
          select('marka', 'Marka', true, ['Apple']),
          select('model', 'Model', true, withOther(['iPad', 'iPad Air', 'iPad Pro', 'iPad mini'])),
          select('depolama', 'Depolama', true, storage),
          select('baglanti', 'Bağlantı', true, ['Wi-Fi', 'Hücresel']),
        ],
        conditionFields: conditionOf([pil, adaptor]),
      },
      {
        slug: 'android-tablet',
        name: 'Android tablet',
        specFields: [
          select('marka', 'Marka', true, withOther(['Samsung', 'Xiaomi', 'Lenovo', 'Huawei'])),
          select('model', 'Model', true, withOther(['Galaxy Tab S9', 'Galaxy Tab A9', 'Pad 6', 'Tab P12'])),
          select('depolama', 'Depolama', true, storage),
          select('baglanti', 'Bağlantı', true, ['Wi-Fi', 'Hücresel']),
        ],
        conditionFields: conditionOf([pil, adaptor]),
      },
    ],
  },
  {
    slug: 'akilli-saat',
    name: 'Akıllı Saat',
    deviceTypes: [
      {
        slug: 'apple-watch',
        name: 'Apple Watch',
        specFields: [
          select('marka', 'Marka', true, ['Apple']),
          select('model', 'Model', true, withOther(['SE', 'Series 9', 'Series 10', 'Ultra 2'])),
          select('kasaOlcusu', 'Kasa Ölçüsü', true, withOther(['40 mm', '41 mm', '42 mm', '44 mm', '45 mm', '46 mm', '49 mm'])),
        ],
        conditionFields: conditionOf([pil, adaptor]),
      },
      {
        slug: 'diger-saat',
        name: 'Diğer akıllı saat',
        specFields: [
          select('marka', 'Marka', true, withOther(['Samsung', 'Huawei', 'Xiaomi', 'Garmin'])),
          select('model', 'Model', true, withOther(['Galaxy Watch 6', 'Galaxy Watch 7', 'Watch GT 4', 'Band 8'])),
          select('kasaOlcusu', 'Kasa Ölçüsü', true, withOther(['40 mm', '42 mm', '44 mm', '46 mm'])),
        ],
        conditionFields: conditionOf([pil, adaptor]),
      },
    ],
  },
  {
    slug: 'kulaklik',
    name: 'Kulaklık',
    deviceTypes: [
      {
        slug: 'kulaklik',
        name: 'Kulaklık',
        specFields: [
          select('marka', 'Marka', true, withOther(['Apple', 'Samsung', 'Sony', 'JBL', 'Huawei'])),
          select('model', 'Model', true, withOther(['AirPods Pro', 'AirPods 4', 'Galaxy Buds', 'WH-1000XM5', 'Tune 510'])),
          select('baglanti', 'Bağlantı', true, ['Kablolu', 'Kablosuz']),
        ],
        conditionFields: conditionOf([pil]),
      },
    ],
  },
];

export function catalogDeviceType(slug: string): DeviceTypeCatalog | undefined {
  for (const category of catalog) {
    const found = category.deviceTypes.find((type) => type.slug === slug);
    if (found) {
      return found;
    }
  }
  return undefined;
}
