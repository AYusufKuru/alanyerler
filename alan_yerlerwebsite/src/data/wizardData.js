/**
 * ALAN YERLER — Kapsamlı Donanım, Cihaz Kataloğu ve Teknik Özellik Veritabanı
 * Telefon, Laptop, MacBook, Masaüstü, Konsol, Ekran Kartı, Tablet ve Giyilebilir Cihazlar
 */

export const WIZARD_CATEGORIES = [
  { id: "laptop", name: "Laptop", icon: "💻", image: "/assets/categories/laptop.jpg", desc: "Windows & Oyuncu Bilgisayarları (Asus, Lenovo, Monster vb.)" },
  { id: "macbook", name: "MacBook", icon: "🍎", image: "/assets/categories/laptop.jpg", desc: "Apple MacBook Pro & MacBook Air Serisi (M1, M2, M3)" },
  { id: "phone", name: "Telefon", icon: "📱", image: "/assets/categories/phone.jpg", desc: "iPhone, Samsung Galaxy, Xiaomi Amiral Gemileri" },
  { id: "desktop", name: "Masaüstü PC", icon: "🖥️", image: "/assets/categories/laptop.jpg", desc: "Özel Toplama Kasalar ve İş İstasyonları" },
  { id: "mac-desktop", name: "Mac Masaüstü", icon: "🍏", image: "/assets/categories/laptop.jpg", desc: "iMac, Mac Mini, Mac Studio, Mac Pro" },
  { id: "tablet", name: "Tablet & iPad", icon: "📟", image: "/assets/categories/tablet.jpg", desc: "iPad Pro (M4/M2), iPad Air, Galaxy Tab S9" },
  { id: "console", name: "Oyun Konsolu", icon: "🎮", image: "/assets/categories/console.jpg", desc: "PlayStation 5 Slim, PS4 Pro, Xbox Series X, Switch OLED" },
  { id: "gpu", name: "Ekran Kartı", icon: "⚡", image: "/assets/categories/gpu.jpg", desc: "NVIDIA GeForce RTX 40-Serisi ve AMD Radeon RX" },
  { id: "watch", name: "Akıllı Saat", icon: "⌚", image: "/assets/categories/watch.jpg", desc: "Apple Watch Ultra 2, Series 9, Galaxy Watch 6" },
  { id: "headphones", name: "Kulaklık", icon: "🎧", image: "/assets/categories/headphones.jpg", desc: "AirPods Max, Sony WH-1000XM5, Bose QuietComfort" }
];

export const DEVICE_SPECS_DATA = {
  // 1. Windows Laptop / Oyuncu Bilgisayarları
  laptop: {
    title: "Laptop / Taşınabilir Bilgisayar",
    brands: ["Asus", "Lenovo", "Dell", "HP", "Monster", "MSI", "Acer", "Huawei"],
    series: {
      "Asus": ["ROG Strix", "TUF Gaming", "Zenbook", "Vivobook Pro"],
      "Lenovo": ["Legion Pro", "IdeaPad Gaming", "ThinkPad", "LOQ"],
      "Dell": ["Alienware", "G15 / G16", "XPS 15 / 17", "Inspiron"],
      "HP": ["Omen Gaming", "Victus 16", "Pavilion Gaming", "Envy"],
      "Monster": ["Tulpar Serisi", "Abra Serisi", "Semruk Serisi", "Huma"],
      "MSI": ["Raider GE", "Stealth GS", "Katana / Pulse", "Titan"],
      "Acer": ["Predator Helios", "Nitro 5 / 16", "Swift X"],
      "Huawei": ["MateBook X Pro", "MateBook 16s", "MateBook D16"]
    },
    models: {
      "ROG Strix": ["ROG Strix G16 (i7-13650HX / RTX 4070)", "ROG Strix SCAR 18 (i9-14900HX / RTX 4090)", "ROG Strix G15 (Ryzen 7)"],
      "TUF Gaming": ["TUF Gaming A15 (RTX 4060)", "TUF Gaming F15 (RTX 4050)"],
      "Legion Pro": ["Legion Pro 5 (Ryzen 7 / RTX 4070)", "Legion Pro 7i (i9 / RTX 4080)", "Legion Slim 5"],
      "Tulpar Serisi": ["Monster Tulpar T7 V20.5 (RTX 3060)", "Monster Tulpar T5 V23.1 (RTX 4060)", "Monster Tulpar T7 V25 (RTX 4070)"],
      "Abra Serisi": ["Monster Abra A5 V19 (RTX 3050)", "Monster Abra A7 V14 (RTX 4050)"],
      "Victus 16": ["HP Victus 16 (i7-13700H / RTX 4060)", "HP Victus 16 (Ryzen 7 / RTX 4070)"],
      "Alienware": ["Alienware m16 R2 (RTX 4080)", "Alienware x16 (RTX 4090)"]
    },
    cpus: {
      "Asus": ["Intel Core i9-14900HX", "Intel Core i7-13700H", "Intel Core i7-13650HX", "AMD Ryzen 9 7945HX", "AMD Ryzen 7 7840HS"],
      "Lenovo": ["Intel Core i9-14900HX", "Intel Core i7-13700HX", "AMD Ryzen 7 7745HX", "Intel Core i5-13500H"],
      "Monster": ["Intel Core i7-13700H", "Intel Core i7-12700H", "Intel Core i9-13900HX", "Intel Core i5-12500H"],
      "Dell": ["Intel Core i9-13980HX", "Intel Core i7-13700H", "AMD Ryzen 7 7840HS"],
      "HP": ["Intel Core i7-13700H", "AMD Ryzen 7 7840HS", "Intel Core i5-13500H"],
      "Other": ["Intel Core i9 14. Nesil", "Intel Core i7 13. Nesil", "AMD Ryzen 7 7000 Serisi", "Intel Core i5"]
    },
    gpus: [
      "NVIDIA GeForce RTX 4090 16GB",
      "NVIDIA GeForce RTX 4080 12GB",
      "NVIDIA GeForce RTX 4070 8GB",
      "NVIDIA GeForce RTX 4060 8GB",
      "NVIDIA GeForce RTX 4050 6GB",
      "NVIDIA GeForce RTX 3060 6GB",
      "AMD Radeon RX 7600M XT",
      "Dahili Grafik (Intel Iris / Radeon)"
    ],
    rams: ["8 GB", "16 GB", "24 GB", "32 GB", "64 GB", "96 GB"],
    storages: ["256 GB SSD", "512 GB SSD", "1 TB NVMe SSD", "2 TB NVMe SSD", "4 TB NVMe SSD"],
    screenSizes: ["14 inç (144Hz)", "15.6 inç (144Hz)", "16 inç QHD+ (240Hz)", "17.3 inç (165Hz)", "18 inç (240Hz)"]
  },

  // 2. Apple MacBook (Pro & Air)
  macbook: {
    title: "Apple MacBook",
    brands: ["Apple"],
    series: {
      "Apple": ["MacBook Pro 16\"", "MacBook Pro 14\"", "MacBook Pro 13\"", "MacBook Air 15\"", "MacBook Air 13.6\"", "MacBook Air 13.3\""]
    },
    models: {
      "MacBook Pro 16\"": ["MacBook Pro 16\" (M3 Max, 2023)", "MacBook Pro 16\" (M3 Pro, 2023)", "MacBook Pro 16\" (M2 Max, 2023)", "MacBook Pro 16\" (M2 Pro, 2023)", "MacBook Pro 16\" (M1 Max / Pro)"],
      "MacBook Pro 14\"": ["MacBook Pro 14\" (M3 Max, 2023)", "MacBook Pro 14\" (M3 Pro, 2023)", "MacBook Pro 14\" (M3 Standart)", "MacBook Pro 14\" (M2 Pro, 2023)", "MacBook Pro 14\" (M1 Pro)"],
      "MacBook Pro 13\"": ["MacBook Pro 13\" (M2, Touch Bar)", "MacBook Pro 13\" (M1, Touch Bar)"],
      "MacBook Air 15\"": ["MacBook Air 15\" (M3 Çip, 2024)", "MacBook Air 15\" (M2 Çip, 2023)"],
      "MacBook Air 13.6\"": ["MacBook Air 13.6\" (M3 Çip, 2024)", "MacBook Air 13.6\" (M2 Çip, 2022)"],
      "MacBook Air 13.3\"": ["MacBook Air 13.3\" (M1 Çip, 2020)"]
    },
    cpus: {
      "Apple": [
        "Apple M3 Max (14-Core / 16-Core)",
        "Apple M3 Pro (11-Core / 12-Core)",
        "Apple M3 (8-Core CPU / 10-Core GPU)",
        "Apple M2 Max (12-Core)",
        "Apple M2 Pro (10-Core / 12-Core)",
        "Apple M2 (8-Core)",
        "Apple M1 Max / Pro",
        "Apple M1 (8-Core)"
      ]
    },
    gpus: ["Dahili Apple Silicon GPU (10 ile 40 Çekirdek)"],
    rams: ["8 GB", "16 GB", "18 GB", "24 GB", "32 GB", "36 GB", "64 GB", "96 GB", "128 GB"],
    storages: ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD", "4 TB SSD", "8 TB SSD"],
    screenSizes: ["Liquid Retina XDR (16.2 inç)", "Liquid Retina XDR (14.2 inç)", "Liquid Retina (15.3 inç)", "Liquid Retina (13.6 inç)", "Retina (13.3 inç)"]
  },

  // 3. Akıllı Telefon
  phone: {
    title: "Akıllı Telefon",
    brands: ["Apple", "Samsung", "Xiaomi", "Google Pixel", "OnePlus"],
    series: {
      "Apple": ["iPhone 15 Serisi", "iPhone 14 Serisi", "iPhone 13 Serisi", "iPhone 12 Serisi", "iPhone 11 Serisi"],
      "Samsung": ["Galaxy S24 Serisi", "Galaxy S23 Serisi", "Galaxy Z Fold / Flip", "Galaxy S22 Serisi", "Galaxy A Serisi"],
      "Xiaomi": ["Xiaomi 14 / 13 Ultra", "Xiaomi 13T / 12T", "Redmi Note 13 / 12 Pro+", "POCO F / X Serisi"],
      "Google Pixel": ["Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro"],
      "OnePlus": ["OnePlus 12", "OnePlus 11", "OnePlus Open"]
    },
    models: {
      "iPhone 15 Serisi": ["iPhone 15 Pro Max (Titanyum)", "iPhone 15 Pro (Titanyum)", "iPhone 15 Plus", "iPhone 15"],
      "iPhone 14 Serisi": ["iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14"],
      "iPhone 13 Serisi": ["iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini"],
      "Galaxy S24 Serisi": ["Galaxy S24 Ultra (Titanyum / S-Pen)", "Galaxy S24+", "Galaxy S24"],
      "Galaxy S23 Serisi": ["Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23"],
      "Galaxy Z Fold / Flip": ["Galaxy Z Fold 5", "Galaxy Z Flip 5", "Galaxy Z Fold 4"],
      "Xiaomi 14 / 13 Ultra": ["Xiaomi 14 Ultra (Leica)", "Xiaomi 14 Pro", "Xiaomi 13 Ultra"]
    },
    cpus: {
      "Apple": ["Apple A17 Pro (3nm)", "Apple A16 Bionic", "Apple A15 Bionic", "Apple A14 Bionic"],
      "Samsung": ["Snapdragon 8 Gen 3 for Galaxy", "Exynos 2400 (Deca-core)", "Snapdragon 8 Gen 2 for Galaxy"],
      "Xiaomi": ["Snapdragon 8 Gen 3", "MediaTek Dimensity 9200+", "Snapdragon 8 Gen 2"],
      "Other": ["8 Çekirdekli Amiral Gemisi İşlemci"]
    },
    gpus: ["Dahili Mobil Grafik İşlemci"],
    rams: ["6 GB", "8 GB", "12 GB", "16 GB"],
    storages: ["128 GB", "256 GB", "512 GB", "1 TB"],
    screenSizes: ["6.1 inç OLED (120Hz)", "6.7 inç ProMotion (120Hz)", "6.8 inç Dinamik AMOLED", "7.6 inç Katlanabilir Ekran"]
  },

  // 4. Masaüstü Bilgisayar & Oyuncu Kasası
  desktop: {
    title: "Masaüstü Bilgisayar & Oyuncu Kasası",
    brands: ["Özel Toplama (Custom PC)", "Asus ROG", "MSI Gaming", "Alienware", "Corsair", "HP Omen"],
    series: {
      "Özel Toplama (Custom PC)": ["Ultra High-End Gaming", "Mid-Range Gaming", "Workstation / Render Kasası", "F/P Oyuncu Kasası"],
      "Asus ROG": ["ROG Hyperion GR701", "ROG Strix GT15", "ROG Strix G35"],
      "MSI Gaming": ["MEG Trident X2", "MPG Infinite X2", "MAG Codex 6"],
      "Alienware": ["Aurora R16", "Aurora R15"]
    },
    models: {
      "Ultra High-End Gaming": ["i9-14900K / RTX 4090 / 64GB DDR5", "Ryzen 7 7800X3D / RTX 4080 Super / 32GB", "Ryzen 9 7950X3D / RTX 4090 / 64GB"],
      "Mid-Range Gaming": ["i7-14700K / RTX 4070 Ti Super", "Ryzen 7 7700X / RTX 4070 Super", "i5-14400F / RTX 4060 Ti / 32GB"],
      "F/P Oyuncu Kasası": ["Ryzen 5 7600 / RTX 4060 / 16GB", "i5-13400F / RTX 4060 / 16GB", "Ryzen 5 5600 / RTX 3060 12GB"],
      "Aurora R16": ["Alienware Aurora R16 (i9-14900KF / RTX 4080 Super)", "Alienware Aurora R16 (i7 / RTX 4070)"]
    },
    cpus: {
      "Intel": ["Intel Core i9-14900K / KF", "Intel Core i7-14700K / KF", "Intel Core i7-13700K", "Intel Core i5-14600K", "Intel Core i5-13400F"],
      "AMD": ["AMD Ryzen 7 7800X3D (Oyun Lideri)", "AMD Ryzen 9 7950X3D", "AMD Ryzen 7 7700X", "AMD Ryzen 5 7600X", "AMD Ryzen 5 5600"],
      "Other": ["Intel Core i7 / AMD Ryzen 7"]
    },
    gpus: [
      "NVIDIA GeForce RTX 4090 24GB",
      "NVIDIA GeForce RTX 4080 Super 16GB",
      "NVIDIA GeForce RTX 4070 Ti Super 16GB",
      "NVIDIA GeForce RTX 4070 Super 12GB",
      "NVIDIA GeForce RTX 4060 Ti 16GB / 8GB",
      "NVIDIA GeForce RTX 4060 8GB",
      "AMD Radeon RX 7900 XTX 24GB",
      "AMD Radeon RX 7800 XT 16GB"
    ],
    rams: ["16 GB DDR5", "32 GB DDR5 (6000MHz+)", "64 GB DDR5", "128 GB DDR5", "16 GB DDR4", "32 GB DDR4"],
    storages: ["1 TB Gen4 NVMe SSD", "2 TB Gen4 NVMe SSD", "4 TB Gen4 NVMe SSD", "500 GB NVMe + 2 TB HDD"],
    screenSizes: ["Sadece Kasa / Monitörsüz", "Monitör Dahil (27\" 2K 180Hz)", "Monitör Dahil (24\" FHD 165Hz)"]
  },

  // 5. Mac Masaüstü (Mac Studio, Mac Mini, iMac)
  "mac-desktop": {
    title: "Mac Masaüstü",
    brands: ["Apple"],
    series: {
      "Apple": ["Mac Studio", "Mac Mini", "iMac 24\"", "Mac Pro"]
    },
    models: {
      "Mac Studio": ["Mac Studio (M2 Ultra 24-Core / 60-Core GPU)", "Mac Studio (M2 Max 12-Core)", "Mac Studio (M1 Ultra / M1 Max)"],
      "Mac Mini": ["Mac Mini (M2 Pro 12-Core / 19-Core GPU)", "Mac Mini (M2 8-Core / 10-Core GPU)", "Mac Mini (M1 Çip)"],
      "iMac 24\"": ["iMac 24\" (M3 Çip, 4 Port)", "iMac 24\" (M3 Çip, 2 Port)", "iMac 24\" (M1 Çip, 2021)"],
      "Mac Pro": ["Mac Pro (M2 Ultra Kasa / Rack)"]
    },
    cpus: {
      "Apple": ["Apple M2 Ultra (24-Core)", "Apple M2 Max (12-Core)", "Apple M2 Pro", "Apple M3 Çip", "Apple M2 Çip", "Apple M1 Çip"]
    },
    gpus: ["Dahili Apple Silicon GPU"],
    rams: ["8 GB", "16 GB", "24 GB", "32 GB", "64 GB", "96 GB", "128 GB", "192 GB"],
    storages: ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD", "4 TB SSD", "8 TB SSD"],
    screenSizes: ["Kasa (Harici Ekran)", "24 inç 4.5K Retina Ekran (iMac)"]
  },

  // 6. Tablet & iPad
  tablet: {
    title: "Tablet & iPad",
    brands: ["Apple", "Samsung", "Xiaomi", "Huawei"],
    series: {
      "Apple": ["iPad Pro 13\" (M4)", "iPad Pro 11\" (M4)", "iPad Pro 12.9\" (M2)", "iPad Air 13\" (M2)", "iPad Air 11\" (M2)", "iPad Mini 6", "iPad 10. Nesil"],
      "Samsung": ["Galaxy Tab S9 Ultra", "Galaxy Tab S9+", "Galaxy Tab S9", "Galaxy Tab S9 FE"],
      "Xiaomi": ["Xiaomi Pad 6S Pro 12.4\"", "Xiaomi Pad 6", "Redmi Pad Pro"]
    },
    models: {
      "iPad Pro 13\" (M4)": ["iPad Pro 13\" M4 (Wi-Fi + Cellular)", "iPad Pro 13\" M4 (Wi-Fi)"],
      "iPad Pro 11\" (M4)": ["iPad Pro 11\" M4 (Wi-Fi + Cellular)", "iPad Pro 11\" M4 (Wi-Fi)"],
      "iPad Air 13\" (M2)": ["iPad Air 13\" M2 (Wi-Fi)", "iPad Air 13\" M2 (Cellular)"],
      "iPad Air 11\" (M2)": ["iPad Air 11\" M2 (Wi-Fi)"],
      "Galaxy Tab S9 Ultra": ["Galaxy Tab S9 Ultra 14.6\" 5G / Wi-Fi (S-Pen)"]
    },
    cpus: {
      "Apple": ["Apple M4 Çip (Yeni)", "Apple M2 Çip", "Apple M1 Çip", "Apple A15 Bionic", "Apple A14 Bionic"],
      "Samsung": ["Snapdragon 8 Gen 2 for Galaxy", "Exynos 1380"],
      "Other": ["Snapdragon 8 Gen 2", "Snapdragon 870"]
    },
    gpus: ["Dahili Tablet GPU"],
    rams: ["6 GB", "8 GB", "12 GB", "16 GB"],
    storages: ["128 GB", "256 GB", "512 GB", "1 TB", "2 TB"],
    screenSizes: ["8.3 inç", "10.9 inç", "11 inç Tandem OLED", "12.4 inç", "13 inç Tandem OLED", "14.6 inç Dynamic AMOLED"]
  },

  // 7. Oyun Konsolu
  console: {
    title: "Oyun Konsolu",
    brands: ["Sony PlayStation", "Microsoft Xbox", "Nintendo", "Valve"],
    series: {
      "Sony PlayStation": ["PlayStation 5 Slim", "PlayStation 5 Standart / Fat", "PlayStation 4 Pro", "PlayStation 4 Slim"],
      "Microsoft Xbox": ["Xbox Series X", "Xbox Series S", "Xbox One X"],
      "Nintendo": ["Nintendo Switch OLED", "Nintendo Switch V2", "Nintendo Switch Lite"],
      "Valve": ["Steam Deck OLED", "Steam Deck LCD"]
    },
    models: {
      "PlayStation 5 Slim": ["PlayStation 5 Slim (Diskli / 1TB)", "PlayStation 5 Slim (Dijital / 1TB)"],
      "PlayStation 5 Standart / Fat": ["PlayStation 5 Standart (Diskli, CFI-1200)", "PlayStation 5 Dijital (CFI-1200)"],
      "PlayStation 4 Pro": ["PlayStation 4 Pro 1TB (4K Destekli)"],
      "Xbox Series X": ["Xbox Series X 1TB (Siyah)", "Xbox Series X 2TB"],
      "Xbox Series S": ["Xbox Series S 1TB (Siyah)", "Xbox Series S 512GB (Beyaz)"],
      "Nintendo Switch OLED": ["Nintendo Switch OLED (Beyaz / Neon Joy-Con)", "Nintendo Switch OLED Zelda / Pokemon Edition"],
      "Steam Deck OLED": ["Steam Deck OLED 1TB", "Steam Deck OLED 512GB", "Steam Deck LCD 256GB"]
    },
    cpus: {
      "Sony PlayStation": ["Özel AMD Zen 2 (8 Çekirdek 3.5 GHz)"],
      "Microsoft Xbox": ["Özel AMD Zen 2 (8 Çekirdek 3.8 GHz)"],
      "Nintendo": ["NVIDIA Özel Tegra X1"],
      "Valve": ["AMD Custom APU 6nm"],
      "Other": ["Özel Konsol İşlemcisi"]
    },
    gpus: ["Özel AMD RDNA 2 (10.28 TFLOP)", "Özel AMD RDNA 2 (12 TFLOP)", "AMD RDNA 2 (4 TFLOP)", "NVIDIA Maxwell", "AMD RDNA 2 APU"],
    rams: ["16 GB GDDR6", "10 GB GDDR6", "16 GB LPDDR5", "4 GB LPDDR4"],
    storages: ["512 GB SSD", "825 GB SSD", "1 TB SSD", "2 TB SSD", "64 GB eMMC"],
    screenSizes: ["Harici Ekran / TV Çıkışı", "7.4 inç 90Hz HDR OLED (Steam Deck)", "7.0 inç Canlı OLED (Switch)", "5.5 inç"]
  },

  // 8. Ekran Kartı (Masaüstü GPU)
  gpu: {
    title: "Ekran Kartı (GPU)",
    brands: ["Asus", "MSI", "Gigabyte", "Sapphire", "Galax", "Palit", "Zotac", "NVIDIA (Founders)"],
    series: {
      "Asus": ["ROG Strix", "TUF Gaming", "Dual OC", "ProArt"],
      "MSI": ["Suprim X", "Gaming X Trio / Slim", "Ventus 3X / 2X"],
      "Gigabyte": ["AORUS Master", "Gaming OC", "Eagle OC", "Windforce"],
      "Sapphire": ["Nitro+ Radeon", "Pulse Radeon", "Pure Radeon"],
      "Galax": ["SG 1-Click OC (4 Fanlı)", "EX Gamer"],
      "Other": ["Standart 3 Fanlı", "Standart 2 Fanlı"]
    },
    models: {
      "ROG Strix": ["GeForce RTX 4090 24GB OC", "GeForce RTX 4080 Super 16GB", "GeForce RTX 4070 Ti Super 16GB", "GeForce RTX 4070 Super 12GB"],
      "Gaming X Trio / Slim": ["GeForce RTX 4080 Super 16GB", "GeForce RTX 4070 Ti 12GB", "GeForce RTX 4060 Ti 16GB / 8GB"],
      "Gaming OC": ["GeForce RTX 4070 Ti Super", "GeForce RTX 4070 Super 12GB", "GeForce RTX 3080 10GB"],
      "Nitro+ Radeon": ["Radeon RX 7900 XTX 24GB Vapor-X", "Radeon RX 7900 XT 20GB", "Radeon RX 7800 XT 16GB"],
      "Standart 3 Fanlı": ["GeForce RTX 4070 Super 12GB", "GeForce RTX 4060 8GB", "GeForce RTX 3070 8GB"]
    },
    cpus: {
      "All": ["Dahili Ada Lovelace / RDNA 3 Grafik Yonga Seti"]
    },
    gpus: ["NVIDIA Ada Lovelace AD102", "NVIDIA AD103", "NVIDIA AD104", "AMD Navi 31 (RDNA 3)", "NVIDIA Ampere GA102"],
    rams: ["8 GB GDDR6", "12 GB GDDR6X", "16 GB GDDR6X", "20 GB GDDR6", "24 GB GDDR6X"],
    storages: ["PCIe 4.0 x16 Veri Yolu"],
    screenSizes: ["3x DisplayPort 1.4a + 1x HDMI 2.1a"]
  },

  // 9. Akıllı Saat
  watch: {
    title: "Akıllı Saat",
    brands: ["Apple", "Samsung", "Huawei", "Garmin"],
    series: {
      "Apple": ["Apple Watch Ultra 2", "Apple Watch Ultra", "Apple Watch Series 9", "Apple Watch Series 8", "Apple Watch SE 2"],
      "Samsung": ["Galaxy Watch 6 Classic", "Galaxy Watch 6", "Galaxy Watch 5 Pro"],
      "Huawei": ["Watch Ultimate (Safir)", "Watch GT 4", "Watch 4 Pro"],
      "Garmin": ["Fenix 7X Pro Solar", "Epix Pro Gen 2", "Forerunner 965"]
    },
    models: {
      "Apple Watch Ultra 2": ["Apple Watch Ultra 2 (49mm Titanyum Kasa)", "Apple Watch Ultra (49mm)"],
      "Apple Watch Series 9": ["Series 9 45mm (GPS + Cellular)", "Series 9 45mm (Alüminyum)", "Series 9 41mm"],
      "Galaxy Watch 6 Classic": ["Galaxy Watch 6 Classic 47mm (Döner Bezel)", "Galaxy Watch 6 Classic 43mm"],
      "Fenix 7X Pro Solar": ["Garmin Fenix 7X Pro Solar Sapphire (51mm)"]
    },
    cpus: {
      "All": ["Apple S9 SiP (Çift Çekirdek)", "Exynos W930", "Garmin Düşük Güçlü Çip"]
    },
    rams: ["1 GB", "2 GB", "Dahili Sistem RAM"],
    storages: ["32 GB", "64 GB", "16 GB"],
    screenSizes: ["49mm Safir Kristal Ekran", "47mm Çelik", "45mm OLED", "41mm", "1.4 inç AMOLED"]
  },

  // 10. Kulaklık
  headphones: {
    title: "Premium Kulaklık",
    brands: ["Apple", "Sony", "Bose", "Sennheiser", "Bang & Olufsen"],
    series: {
      "Apple": ["AirPods Max", "AirPods Pro 2 (USB-C)", "AirPods Pro (Lightning)", "AirPods 3"],
      "Sony": ["WH-1000XM5 (ANC)", "WH-1000XM4", "WF-1000XM5 (TWS)"],
      "Bose": ["QuietComfort Ultra", "QuietComfort 45", "Headphones 700"],
      "Sennheiser": ["Momentum 4 Wireless", "Momentum True Wireless 3"]
    },
    models: {
      "AirPods Max": ["AirPods Max (Uzay Grisi / Gümüş)", "AirPods Max (Gök Mavisi)", "AirPods Max (Yeşil / Pembe)"],
      "AirPods Pro 2 (USB-C)": ["AirPods Pro 2. Nesil (MagSafe USB-C Kılıflı)"],
      "WH-1000XM5 (ANC)": ["Sony WH-1000XM5 Gürültü Engelleyici (Siyah / Gümüş)"],
      "QuietComfort Ultra": ["Bose QuietComfort Ultra Kulaküstü ANC"]
    },
    cpus: {
      "All": ["Apple H2 / H1 Ses Çipi", "Sony QN1 Gürültü Engelleme İşlemcisi", "Bose Custom DSP"]
    },
    rams: ["Dahili Yüksek Çözünürlüklü DAC / DSP"],
    storages: ["Kablosuz Bluetooth 5.3 + ANC"],
    screenSizes: ["Aktif Gürültü Engelleme (ANC) + Şeffaf Mod"]
  }
};

export const CONDITION_OPTIONS = {
  batteryHealth: ["%100 (Orijinal)", "%95 - %99", "%90 - %94", "%85 - %89", "%80 - %84", "%80 Altı / Servis Uyarısı"],
  ssdHealth: ["%100 Sağlık", "%95+ Sağlık", "%90+ Sağlık", "Bilinmiyor / Test Edilmedi"],
  warrantyPeriods: ["12 - 24 Ay", "6 - 12 Ay", "1 - 6 Ay", "Garantisi Yok / Bitti"],
  registrationStatuses: [
    "🇹🇷 Türkiye Resmi Distribütör Cihazı (BTK Kayıtlı)",
    "✈️ Yurt Dışı (Pasaport Kayıtlı)",
    "⚠️ Yurt Dışı (Kayıtsız / Süresi Dolmuş)"
  ],
  consoleGamepads: [
    "🎮 1 Adet Orijinal Kol",
    "🎮 2 Adet Orijinal Kol (Çift Kol)",
    "🎮 3+ Adet Kol",
    "🕹️ Kolsuz / Sadece Ana Konsol"
  ],
  gpuSecurityTags: [
    "🛡️ Orijinal Güvenlik Bandı Üzerinde (Açılmamış)",
    "🔧 Termal Macun Yenilenmiş (Temiz)",
    "⚠️ İçi Açılmış / Tamir Görmüş"
  ],
  boxAndInvoiceOptions: [
    { id: "both", label: "Kutu & Fatura Var", desc: "Orijinal kutusu ve faturası eksiksiz mevcut" },
    { id: "box_only", label: "Sadece Kutu Var", desc: "Faturası kayıp, kutusu ve aparatları mevcut" },
    { id: "invoice_only", label: "Sadece Fatura Var", desc: "Kutusu yok, garanti veya satın alma faturası var" },
    { id: "none", label: "Kutu / Fatura Yok", desc: "Sadece cihaz ve şarj aparatı mevcut" }
  ],
  cosmetics: [
    { id: "flawless", label: "Sıfır Gibi", desc: "Kılcal çizik dahi yok, vitrin kondisyonunda" },
    { id: "good", label: "İyi", desc: "Hafif kullanım izleri var, darbe veya ezik yok" },
    { id: "medium", label: "Orta", desc: "Gözle görülür çizikler ve hafif sürtünme izleri" },
    { id: "poor", label: "Kötü", desc: "Belirgin deformasyon, vuruk veya kasa hasarı" }
  ],
  adapters: ["Orijinal", "Muadil", "Yok / Adaptörsüz"],
  workingStates: [
    { id: "perfect", label: "Sorunsuz Çalışıyor", desc: "Tüm donanımlar, klavye, ekran ve portlar aktif" },
    { id: "issues", label: "Bazı Sorunları Var", desc: "Donanım veya işlevsellik kusuru mevcut" }
  ]
};
