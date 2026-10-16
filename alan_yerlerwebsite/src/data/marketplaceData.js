/**
 * ALAN YERLER — React Pazar Yeri Veri Havuzu
 * Kategoriler, Mağazalar, Değerleme Modelleri ve Bildirimler
 */

export const CATEGORIES = [
  {
    id: "phone",
    name: "Telefon",
    subTitle: "iPhone, Samsung, Xiaomi vb.",
    image: "/assets/categories/phone.jpg",
    activeBuyers: 45,
    avgPriceRange: "18.000 - 64.000 TL",
    bgTint: "#F4F7FB",
    tag: "Popüler",
    slug: "telefon"
  },
  {
    id: "laptop",
    name: "Bilgisayar/Laptop",
    subTitle: "MacBook, Gaming Laptop, Ultrabook",
    image: "/assets/categories/laptop.jpg",
    activeBuyers: 38,
    avgPriceRange: "22.000 - 85.000 TL",
    bgTint: "#EFF6FF",
    tag: "Yüksek Teklif",
    slug: "bilgisayar-laptop"
  },
  {
    id: "console",
    name: "Oyun Konsolu",
    subTitle: "PlayStation 5, Xbox Series X, Switch",
    image: "/assets/categories/console.jpg",
    activeBuyers: 29,
    avgPriceRange: "12.000 - 24.000 TL",
    bgTint: "#F5F3FF",
    tag: "Hızlı Satış",
    slug: "oyun-konsolu"
  },
  {
    id: "gpu",
    name: "Ekran Kartı",
    subTitle: "RTX 40/30 serisi, AMD Radeon",
    image: "/assets/categories/gpu.jpg",
    activeBuyers: 18,
    avgPriceRange: "14.000 - 55.000 TL",
    bgTint: "#ECFDF5",
    tag: "Yoğun Talep",
    slug: "ekran-karti"
  },
  {
    id: "tablet",
    name: "Tablet",
    subTitle: "iPad Pro, iPad Air, Galaxy Tab",
    image: "/assets/categories/tablet.jpg",
    activeBuyers: 24,
    avgPriceRange: "10.000 - 38.000 TL",
    bgTint: "#EFF8FF",
    tag: "Garantili Alım",
    slug: "tablet"
  },
  {
    id: "watch",
    name: "Akıllı Saat",
    subTitle: "Apple Watch Ultra, Galaxy Watch",
    image: "/assets/categories/watch.jpg",
    activeBuyers: 16,
    avgPriceRange: "6.000 - 28.000 TL",
    bgTint: "#FFF7ED",
    tag: "Aynı Gün",
    slug: "akilli-saat"
  },
  {
    id: "headphones",
    name: "Kulaklık",
    subTitle: "AirPods Max, Sony WH-1000XM5",
    image: "/assets/categories/headphones.jpg",
    activeBuyers: 12,
    avgPriceRange: "5.000 - 21.000 TL",
    bgTint: "#F8FAFC",
    tag: "Hızlı Nakit",
    slug: "kulaklik"
  }
];

export const VALUATION_MODELS = {
  laptop: [
    { id: "macbook-pro-14-m2", name: "Apple MacBook Pro 14\" (M2 Pro, 16GB, 512GB)", minPrice: 40000, maxPrice: 43500 },
    { id: "macbook-air-m2", name: "Apple MacBook Air 13.6\" (M2, 8GB, 256GB)", minPrice: 24000, maxPrice: 27500 },
    { id: "macbook-pro-16-m3", name: "Apple MacBook Pro 16\" (M3 Max, 36GB, 1TB)", minPrice: 78000, maxPrice: 85000 },
    { id: "asus-rog-strix-4070", name: "Asus ROG Strix G16 (i7-13650HX, RTX 4070)", minPrice: 38000, maxPrice: 42000 },
    { id: "lenovo-legion-pro-5", name: "Lenovo Legion Pro 5 (Ryzen 7, RTX 4060)", minPrice: 32000, maxPrice: 35500 }
  ],
  phone: [
    { id: "iphone-15-pro-max", name: "Apple iPhone 15 Pro Max (256 GB)", minPrice: 52000, maxPrice: 56500 },
    { id: "iphone-15-pro", name: "Apple iPhone 15 Pro (128 GB)", minPrice: 43000, maxPrice: 46500 },
    { id: "iphone-14-pro", name: "Apple iPhone 14 Pro (128 GB)", minPrice: 34000, maxPrice: 37500 },
    { id: "samsung-s24-ultra", name: "Samsung Galaxy S24 Ultra (256 GB)", minPrice: 42000, maxPrice: 46000 },
    { id: "samsung-s23-ultra", name: "Samsung Galaxy S23 Ultra (256 GB)", minPrice: 30000, maxPrice: 33500 }
  ],
  console: [
    { id: "ps5-slim-cd", name: "Sony PlayStation 5 Slim (Diskli Sürüm)", minPrice: 17500, maxPrice: 19500 },
    { id: "ps5-fat-cd", name: "Sony PlayStation 5 (Standart Diskli)", minPrice: 15500, maxPrice: 17200 },
    { id: "xbox-series-x", name: "Microsoft Xbox Series X (1 TB)", minPrice: 16000, maxPrice: 18000 },
    { id: "nintendo-switch-oled", name: "Nintendo Switch OLED Model", minPrice: 9500, maxPrice: 11500 }
  ],
  gpu: [
    { id: "rtx-4090", name: "Nvidia GeForce RTX 4090 24GB", minPrice: 56000, maxPrice: 62000 },
    { id: "rtx-4080-super", name: "Nvidia GeForce RTX 4080 Super 16GB", minPrice: 36000, maxPrice: 40000 },
    { id: "rtx-4070-ti", name: "Nvidia GeForce RTX 4070 Ti 12GB", minPrice: 25000, maxPrice: 28500 },
    { id: "rx-7900-xtx", name: "AMD Radeon RX 7900 XTX 24GB", minPrice: 31000, maxPrice: 34500 }
  ],
  desktop: [
    { id: "custom-i9-4090", name: "Toplama PC (i9-14900K, RTX 4090, 64GB)", minPrice: 95000, maxPrice: 110000 },
    { id: "custom-7800x3d-4080s", name: "Toplama PC (Ryzen 7 7800X3D, RTX 4080 Super)", minPrice: 62000, maxPrice: 69000 },
    { id: "alienware-aurora-r16", name: "Dell Alienware Aurora R16 (i7, RTX 4070)", minPrice: 48000, maxPrice: 54000 },
    { id: "custom-i5-4060", name: "Toplama PC (i5-13400F, RTX 4060, 16GB)", minPrice: 22000, maxPrice: 25500 }
  ],
  tablet: [
    { id: "ipad-pro-13-m4", name: "Apple iPad Pro 13\" (M4, 256GB)", minPrice: 38000, maxPrice: 43500 },
    { id: "ipad-air-11-m2", name: "Apple iPad Air 11\" (M2, 128GB)", minPrice: 21000, maxPrice: 24500 },
    { id: "ipad-pro-11-m2", name: "Apple iPad Pro 11\" (M2, 128GB)", minPrice: 22000, maxPrice: 25000 },
    { id: "samsung-tab-s9-ultra", name: "Samsung Galaxy Tab S9 Ultra (14.6\")", minPrice: 26000, maxPrice: 30500 },
    { id: "xiaomi-pad-6", name: "Xiaomi Pad 6 (8GB, 256GB)", minPrice: 9500, maxPrice: 11800 }
  ],
  watch: [
    { id: "apple-watch-ultra-2", name: "Apple Watch Ultra 2 (49mm Titanyum)", minPrice: 24000, maxPrice: 27500 },
    { id: "apple-watch-series-9-45", name: "Apple Watch Series 9 (45mm GPS)", minPrice: 12000, maxPrice: 14500 },
    { id: "apple-watch-series-8-41", name: "Apple Watch Series 8 (41mm)", minPrice: 8500, maxPrice: 10200 },
    { id: "galaxy-watch-6-classic", name: "Samsung Galaxy Watch 6 Classic 47mm", minPrice: 6500, maxPrice: 8000 },
    { id: "garmin-fenix-7x-pro", name: "Garmin Fenix 7X Pro Solar", minPrice: 25000, maxPrice: 29000 }
  ],
  headphones: [
    { id: "airpods-max", name: "Apple AirPods Max (Bluetooth ANC)", minPrice: 16500, maxPrice: 19000 },
    { id: "sony-wh-1000xm5", name: "Sony WH-1000XM5 (Kablosuz ANC)", minPrice: 9500, maxPrice: 11500 },
    { id: "bose-qc-ultra", name: "Bose QuietComfort Ultra ANC", minPrice: 11000, maxPrice: 13000 },
    { id: "airpods-pro-2", name: "Apple AirPods Pro 2. Nesil (USB-C)", minPrice: 6000, maxPrice: 7200 },
    { id: "sennheiser-momentum-4", name: "Sennheiser Momentum 4 Wireless", minPrice: 8500, maxPrice: 10500 }
  ]
};

export const VERIFIED_STORES = [
  {
    id: "techstore",
    name: "TechStore",
    logoText: "TECH",
    verified: true,
    rating: 4.9,
    reviewCount: 320,
    distance: "2.3 km",
    city: "İstanbul",
    district: "Kadıköy",
    address: "Bağdat Cad. No:123, Kadıköy / İstanbul",
    workingHours: { weekday: "09:00 - 20:00", sunday: "10:00 - 18:00" },
    badges: ["Güvenilir İşletme", "Hızlı Dönüş", "Yerinde Satış", "Kurumsal"],
    about: "10+ yıllık deneyimimizle laptop, bilgisayar, telefon ve oyun konsolu alım-satımı yapıyoruz. Tüm cihazlar için hızlı ve güvenilir teklif sunuyoruz."
  },
  {
    id: "gigabilisim",
    name: "Giga Bilişim",
    logoText: "GIGA",
    verified: true,
    rating: 4.8,
    reviewCount: 180,
    distance: "4.1 km",
    city: "İstanbul",
    district: "Mecidiyeköy",
    address: "Büyükdere Cad. No:45, Şişli / İstanbul",
    badges: ["Güvenilir İşletme", "Hızlı Dönüş", "Yerinde Satış"],
    about: "Yüksek donanımlı dizüstü bilgisayar ve Apple ürünlerinde uzmanlaşmış kurumsal teknoloji mağazası."
  },
  {
    id: "novateknoloji",
    name: "Nova Teknoloji",
    logoText: "N",
    verified: true,
    rating: 4.7,
    reviewCount: 210,
    distance: "8.6 km",
    city: "Ankara",
    district: "Çankaya",
    address: "Tunalı Hilmi Cad. No:88, Çankaya / Ankara",
    badges: ["Kurumsal", "Hızlı Dönüş"],
    about: "Konsol, ekran kartı ve masaüstü sistem alımlarında Türkiye geneli güvenli kargo ve elden teslimat seçeneği."
  },
  {
    id: "pluselektronik",
    name: "Plus Elektronik",
    logoText: "PLUS",
    verified: true,
    rating: 4.6,
    reviewCount: 95,
    distance: "12.2 km",
    city: "İzmir",
    district: "Alsancak",
    address: "Plevne Blv. No:14, Konak / İzmir",
    badges: ["Güvenilir İşletme", "Yerinde Satış"],
    about: "İzmir merkezli profesyonel ikinci el test ve anında nakit alım merkezi."
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    store: "TechStore",
    avatar: "TECH",
    text: "MacBook Pro 14\" ilanınıza yeni ve en yüksek teklif geldi: 42.500 TL",
    time: "14:32",
    unread: true
  },
  {
    id: "notif-2",
    store: "Giga Bilişim",
    avatar: "GIGA",
    text: "Cihazınız incelendi, 41.000 TL nakit teklif verildi.",
    time: "13:15",
    unread: true
  },
  {
    id: "notif-3",
    store: "Alan Yerler Güvenlik",
    avatar: "AY",
    text: "İlanınız doğrulanmış 18 kurumsal işletmeye başarıyla iletildi.",
    time: "12:00",
    unread: false
  }
];

export const LIVE_TICKER_FEED = [
  { text: "Kadıköy / MacBook Pro M2 Pro ➔ 42.500 TL teklif kabul edildi", time: "1 dk önce", highlight: true },
  { text: "Beşiktaş / iPhone 15 Pro 256GB ➔ 41.250 TL teklif verildi", time: "3 dk önce", highlight: false },
  { text: "Bakırköy / PlayStation 5 Slim ➔ 17.800 TL satıldı", time: "5 dk önce", highlight: true },
  { text: "Çankaya / Asus ROG RTX 4080 ➔ 32.500 TL teklif verildi", time: "8 dk önce", highlight: false },
  { text: "Alsancak / iPad Pro 11\" M2 ➔ 23.400 TL teklif kabul edildi", time: "11 dk önce", highlight: true }
];
