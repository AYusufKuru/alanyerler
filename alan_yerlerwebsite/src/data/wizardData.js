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
      "ROG Strix": ["Intel Core i9-14900HX", "Intel Core i7-13650HX", "AMD Ryzen 9 7945HX"],
      "TUF Gaming": ["Intel Core i7-13650HX", "AMD Ryzen 7 7840HS", "Intel Core i5-13500H"],
      "Zenbook": ["Intel Core Ultra 7", "Intel Core i7-13700H", "Intel Core i5-13500H"],
      "Vivobook Pro": ["Intel Core i7-13700H", "Intel Core i5-13500H", "AMD Ryzen 7 7840HS"],
      "Legion Pro": ["Intel Core i9-14900HX", "Intel Core i7-13700HX", "AMD Ryzen 7 7745HX"],
      "IdeaPad Gaming": ["Intel Core i5-13500H", "AMD Ryzen 7 7840HS", "Intel Core i7-13700H"],
      "ThinkPad": ["Intel Core i7-13700H", "Intel Core i5-13500H", "AMD Ryzen 7 7840HS"],
      "LOQ": ["Intel Core i5-13500H", "Intel Core i7-13650HX", "AMD Ryzen 7 7840HS"],
      "Alienware": ["Intel Core i9-13980HX", "Intel Core i7-13700H"],
      "G15 / G16": ["Intel Core i7-13700H", "AMD Ryzen 7 7840HS", "Intel Core i5-13500H"],
      "XPS 15 / 17": ["Intel Core i7-13700H", "Intel Core i9-13980HX"],
      "Inspiron": ["Intel Core i5-13500H", "Intel Core i7-13700H", "AMD Ryzen 7 7840HS"],
      "Omen Gaming": ["Intel Core i7-13700H", "AMD Ryzen 7 7840HS", "Intel Core i9-13900HX"],
      "Victus 16": ["Intel Core i7-13700H", "AMD Ryzen 7 7840HS", "Intel Core i5-13500H"],
      "Pavilion Gaming": ["Intel Core i5-13500H", "AMD Ryzen 5 7640HS"],
      "Envy": ["Intel Core i7-13700H", "Intel Core i5-13500H", "AMD Ryzen 7 7840HS"],
      "Tulpar Serisi": ["Intel Core i7-13700H", "Intel Core i7-12700H", "Intel Core i9-13900HX"],
      "Abra Serisi": ["Intel Core i5-12500H", "Intel Core i7-12700H"],
      "Semruk Serisi": ["Intel Core i7-12700H", "Intel Core i5-12500H"],
      "Huma": ["Intel Core i5-12500H", "Intel Core i7-12700H"],
      "Raider GE": ["Intel Core i9-14900HX", "Intel Core i7-13700HX"],
      "Stealth GS": ["Intel Core i7-13700H", "Intel Core Ultra 7"],
      "Katana / Pulse": ["Intel Core i7-13650HX", "Intel Core i5-13500H"],
      "Titan": ["Intel Core i9-14900HX"],
      "Predator Helios": ["Intel Core i7-13700HX", "Intel Core i9-13900HX"],
      "Nitro 5 / 16": ["Intel Core i5-13500H", "AMD Ryzen 7 7840HS"],
      "Swift X": ["Intel Core i7-13700H", "Intel Core Ultra 7"],
      "MateBook X Pro": ["Intel Core Ultra 7", "Intel Core i7-13700H"],
      "MateBook 16s": ["Intel Core i7-13700H", "Intel Core i9-13900H"],
      "MateBook D16": ["Intel Core i5-13500H", "AMD Ryzen 7 7840HS"]
    },
    gpus: {
      "ROG Strix": ["NVIDIA GeForce RTX 4090 16GB", "NVIDIA GeForce RTX 4080 12GB", "NVIDIA GeForce RTX 4070 8GB", "NVIDIA GeForce RTX 4060 8GB"],
      "TUF Gaming": ["NVIDIA GeForce RTX 4070 8GB", "NVIDIA GeForce RTX 4060 8GB", "NVIDIA GeForce RTX 4050 6GB", "AMD Radeon RX 7600M XT"],
      "Zenbook": ["Dahili Grafik (Intel Iris)"],
      "Vivobook Pro": ["NVIDIA GeForce RTX 4050 6GB", "Dahili Grafik (Intel Iris)"],
      "Legion Pro": ["NVIDIA GeForce RTX 4090 16GB", "NVIDIA GeForce RTX 4080 12GB", "NVIDIA GeForce RTX 4070 8GB", "NVIDIA GeForce RTX 4060 8GB"],
      "IdeaPad Gaming": ["NVIDIA GeForce RTX 4060 8GB", "NVIDIA GeForce RTX 4050 6GB", "NVIDIA GeForce RTX 3060 6GB"],
      "ThinkPad": ["Dahili Grafik (Intel Iris)"],
      "LOQ": ["NVIDIA GeForce RTX 4060 8GB", "NVIDIA GeForce RTX 4050 6GB"],
      "Alienware": ["NVIDIA GeForce RTX 4090 16GB", "NVIDIA GeForce RTX 4080 12GB", "NVIDIA GeForce RTX 4070 8GB"],
      "G15 / G16": ["NVIDIA GeForce RTX 4070 8GB", "NVIDIA GeForce RTX 4060 8GB", "NVIDIA GeForce RTX 4050 6GB"],
      "XPS 15 / 17": ["NVIDIA GeForce RTX 4070 8GB", "NVIDIA GeForce RTX 4060 8GB", "Dahili Grafik (Intel Iris)"],
      "Inspiron": ["Dahili Grafik (Intel Iris / Radeon)", "NVIDIA GeForce RTX 4050 6GB"],
      "Omen Gaming": ["NVIDIA GeForce RTX 4080 12GB", "NVIDIA GeForce RTX 4070 8GB", "NVIDIA GeForce RTX 4060 8GB"],
      "Victus 16": ["NVIDIA GeForce RTX 4070 8GB", "NVIDIA GeForce RTX 4060 8GB", "NVIDIA GeForce RTX 4050 6GB"],
      "Pavilion Gaming": ["NVIDIA GeForce RTX 4050 6GB", "NVIDIA GeForce RTX 3060 6GB"],
      "Envy": ["Dahili Grafik (Intel Iris)"],
      "Tulpar Serisi": ["NVIDIA GeForce RTX 4070 8GB", "NVIDIA GeForce RTX 4060 8GB", "NVIDIA GeForce RTX 3060 6GB"],
      "Abra Serisi": ["NVIDIA GeForce RTX 4050 6GB", "NVIDIA GeForce RTX 3050 4GB"],
      "Semruk Serisi": ["NVIDIA GeForce RTX 4060 8GB", "NVIDIA GeForce RTX 4050 6GB"],
      "Huma": ["Dahili Grafik (Intel Iris)"],
      "Raider GE": ["NVIDIA GeForce RTX 4090 16GB", "NVIDIA GeForce RTX 4080 12GB", "NVIDIA GeForce RTX 4070 8GB"],
      "Stealth GS": ["NVIDIA GeForce RTX 4070 8GB", "NVIDIA GeForce RTX 4060 8GB"],
      "Katana / Pulse": ["NVIDIA GeForce RTX 4060 8GB", "NVIDIA GeForce RTX 4050 6GB"],
      "Titan": ["NVIDIA GeForce RTX 4090 16GB", "NVIDIA GeForce RTX 4080 12GB"],
      "Predator Helios": ["NVIDIA GeForce RTX 4080 12GB", "NVIDIA GeForce RTX 4070 8GB", "NVIDIA GeForce RTX 4060 8GB"],
      "Nitro 5 / 16": ["NVIDIA GeForce RTX 4060 8GB", "NVIDIA GeForce RTX 4050 6GB", "NVIDIA GeForce RTX 3060 6GB"],
      "Swift X": ["NVIDIA GeForce RTX 4050 6GB", "Dahili Grafik (Intel Iris)"],
      "MateBook X Pro": ["Dahili Grafik (Intel Iris)"],
      "MateBook 16s": ["Dahili Grafik (Intel Iris)"],
      "MateBook D16": ["Dahili Grafik (Intel Iris / Radeon)"]
    },
    rams: ["8 GB", "16 GB", "24 GB", "32 GB", "64 GB"],
    storages: ["256 GB SSD", "512 GB SSD", "1 TB NVMe SSD", "2 TB NVMe SSD"],
    screenSizes: {
      "ROG Strix": ["16 inç QHD+ (240Hz)", "17.3 inç (165Hz)", "18 inç (240Hz)"],
      "TUF Gaming": ["15.6 inç (144Hz)", "16 inç (144Hz)"],
      "Zenbook": ["14 inç", "15.6 inç"],
      "Vivobook Pro": ["15.6 inç", "16 inç"],
      "Legion Pro": ["16 inç QHD+ (240Hz)", "17.3 inç (165Hz)"],
      "IdeaPad Gaming": ["15.6 inç (144Hz)", "16 inç (144Hz)"],
      "ThinkPad": ["14 inç", "15.6 inç", "16 inç"],
      "LOQ": ["15.6 inç (144Hz)", "16 inç (144Hz)"],
      "Alienware": ["16 inç QHD+ (240Hz)", "18 inç (240Hz)"],
      "G15 / G16": ["15.6 inç (165Hz)", "16 inç (165Hz)"],
      "XPS 15 / 17": ["15.6 inç", "17 inç"],
      "Inspiron": ["14 inç", "15.6 inç"],
      "Omen Gaming": ["16 inç QHD+ (240Hz)", "17.3 inç (165Hz)"],
      "Victus 16": ["16.1 inç (144Hz)"],
      "Pavilion Gaming": ["15.6 inç (144Hz)"],
      "Envy": ["14 inç", "15.6 inç", "16 inç"],
      "Tulpar Serisi": ["15.6 inç (144Hz)", "17.3 inç (144Hz)"],
      "Abra Serisi": ["15.6 inç (144Hz)"],
      "Semruk Serisi": ["15.6 inç (144Hz)", "17.3 inç (144Hz)"],
      "Huma": ["15.6 inç"],
      "Raider GE": ["16 inç QHD+ (240Hz)", "18 inç (240Hz)"],
      "Stealth GS": ["14 inç", "16 inç"],
      "Katana / Pulse": ["15.6 inç (144Hz)", "17.3 inç (144Hz)"],
      "Titan": ["18 inç (240Hz)"],
      "Predator Helios": ["16 inç (165Hz)", "18 inç (240Hz)"],
      "Nitro 5 / 16": ["15.6 inç (144Hz)", "16 inç (165Hz)"],
      "Swift X": ["14 inç"],
      "MateBook X Pro": ["14.2 inç"],
      "MateBook 16s": ["16 inç"],
      "MateBook D16": ["16 inç"]
    }
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
      "MacBook Pro 16\"": ["Apple M3 Max", "Apple M3 Pro", "Apple M2 Max", "Apple M2 Pro", "Apple M1 Max", "Apple M1 Pro"],
      "MacBook Pro 14\"": ["Apple M3 Max", "Apple M3 Pro", "Apple M3", "Apple M2 Pro", "Apple M1 Pro"],
      "MacBook Pro 13\"": ["Apple M2", "Apple M1"],
      "MacBook Air 15\"": ["Apple M3", "Apple M2"],
      "MacBook Air 13.6\"": ["Apple M3", "Apple M2"],
      "MacBook Air 13.3\"": ["Apple M1"]
    },
    gpus: {
      "MacBook Pro 16\"": ["Dahili Apple GPU"],
      "MacBook Pro 14\"": ["Dahili Apple GPU"],
      "MacBook Pro 13\"": ["Dahili Apple GPU"],
      "MacBook Air 15\"": ["Dahili Apple GPU"],
      "MacBook Air 13.6\"": ["Dahili Apple GPU"],
      "MacBook Air 13.3\"": ["Dahili Apple GPU"]
    },
    rams: {
      "MacBook Pro 16\"": ["16 GB", "32 GB", "36 GB", "48 GB", "64 GB", "96 GB", "128 GB"],
      "MacBook Pro 14\"": ["16 GB", "18 GB", "32 GB", "36 GB", "64 GB", "96 GB"],
      "MacBook Pro 13\"": ["8 GB", "16 GB", "24 GB"],
      "MacBook Air 15\"": ["8 GB", "16 GB", "24 GB"],
      "MacBook Air 13.6\"": ["8 GB", "16 GB", "24 GB"],
      "MacBook Air 13.3\"": ["8 GB", "16 GB"]
    },
    storages: {
      "MacBook Pro 16\"": ["512 GB SSD", "1 TB SSD", "2 TB SSD", "4 TB SSD", "8 TB SSD"],
      "MacBook Pro 14\"": ["512 GB SSD", "1 TB SSD", "2 TB SSD", "4 TB SSD"],
      "MacBook Pro 13\"": ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD"],
      "MacBook Air 15\"": ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD"],
      "MacBook Air 13.6\"": ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD"],
      "MacBook Air 13.3\"": ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD"]
    },
    screenSizes: {
      "MacBook Pro 16\"": ["16.2 inç Liquid Retina XDR"],
      "MacBook Pro 14\"": ["14.2 inç Liquid Retina XDR"],
      "MacBook Pro 13\"": ["13.3 inç Retina"],
      "MacBook Air 15\"": ["15.3 inç Liquid Retina"],
      "MacBook Air 13.6\"": ["13.6 inç Liquid Retina"],
      "MacBook Air 13.3\"": ["13.3 inç Retina"]
    }
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
      "iPhone 15 Serisi": ["Apple A17 Pro", "Apple A16 Bionic"],
      "iPhone 14 Serisi": ["Apple A16 Bionic", "Apple A15 Bionic"],
      "iPhone 13 Serisi": ["Apple A15 Bionic"],
      "iPhone 12 Serisi": ["Apple A14 Bionic"],
      "iPhone 11 Serisi": ["Apple A13 Bionic"],
      "Galaxy S24 Serisi": ["Snapdragon 8 Gen 3 for Galaxy", "Exynos 2400"],
      "Galaxy S23 Serisi": ["Snapdragon 8 Gen 2 for Galaxy"],
      "Galaxy Z Fold / Flip": ["Snapdragon 8 Gen 2 for Galaxy"],
      "Galaxy S22 Serisi": ["Snapdragon 8 Gen 1", "Exynos 2200"],
      "Galaxy A Serisi": ["Exynos 1380", "Snapdragon 7 Gen 1"],
      "Xiaomi 14 / 13 Ultra": ["Snapdragon 8 Gen 3", "Snapdragon 8 Gen 2"],
      "Xiaomi 13T / 12T": ["MediaTek Dimensity 9200+", "MediaTek Dimensity 8200"],
      "Redmi Note 13 / 12 Pro+": ["MediaTek Dimensity 7200 Ultra", "Snapdragon 7s Gen 2"],
      "POCO F / X Serisi": ["Snapdragon 8 Gen 2", "Snapdragon 7+ Gen 2"],
      "Pixel 8 Pro": ["Google Tensor G3"],
      "Pixel 8": ["Google Tensor G3"],
      "Pixel 7 Pro": ["Google Tensor G2"],
      "OnePlus 12": ["Snapdragon 8 Gen 3"],
      "OnePlus 11": ["Snapdragon 8 Gen 2"],
      "OnePlus Open": ["Snapdragon 8 Gen 2"]
    },
    gpus: {},
    rams: {
      "iPhone 15 Serisi": ["8 GB"],
      "iPhone 14 Serisi": ["6 GB"],
      "iPhone 13 Serisi": ["4 GB", "6 GB"],
      "iPhone 12 Serisi": ["4 GB", "6 GB"],
      "iPhone 11 Serisi": ["4 GB"],
      "Galaxy S24 Serisi": ["8 GB", "12 GB"],
      "Galaxy S23 Serisi": ["8 GB", "12 GB"],
      "Galaxy Z Fold / Flip": ["8 GB", "12 GB"],
      "Galaxy S22 Serisi": ["8 GB", "12 GB"],
      "Galaxy A Serisi": ["6 GB", "8 GB"],
      default: ["8 GB", "12 GB", "16 GB"]
    },
    storages: {
      "iPhone 11 Serisi": ["64 GB", "128 GB", "256 GB"],
      "iPhone 12 Serisi": ["64 GB", "128 GB", "256 GB"],
      "iPhone 13 Serisi": ["128 GB", "256 GB", "512 GB", "1 TB"],
      "Galaxy A Serisi": ["128 GB", "256 GB"],
      default: ["128 GB", "256 GB", "512 GB", "1 TB"]
    },
    screenSizes: {
      "iPhone 15 Serisi": ["6.1 inç", "6.7 inç"],
      "iPhone 14 Serisi": ["6.1 inç", "6.7 inç"],
      "iPhone 13 Serisi": ["5.4 inç", "6.1 inç", "6.7 inç"],
      "iPhone 12 Serisi": ["5.4 inç", "6.1 inç", "6.7 inç"],
      "iPhone 11 Serisi": ["6.1 inç"],
      "Galaxy S24 Serisi": ["6.2 inç", "6.7 inç", "6.8 inç"],
      "Galaxy S23 Serisi": ["6.1 inç", "6.6 inç", "6.8 inç"],
      "Galaxy Z Fold / Flip": ["6.7 inç kapak", "7.6 inç iç ekran"],
      "Galaxy S22 Serisi": ["6.1 inç", "6.6 inç", "6.8 inç"],
      "Galaxy A Serisi": ["6.4 inç", "6.6 inç"],
      "Xiaomi 14 / 13 Ultra": ["6.36 inç", "6.73 inç"],
      "Xiaomi 13T / 12T": ["6.67 inç"],
      "Redmi Note 13 / 12 Pro+": ["6.67 inç"],
      "POCO F / X Serisi": ["6.67 inç"],
      "Pixel 8 Pro": ["6.7 inç"],
      "Pixel 8": ["6.2 inç"],
      "Pixel 7 Pro": ["6.7 inç"],
      "OnePlus 12": ["6.82 inç"],
      "OnePlus 11": ["6.7 inç"],
      "OnePlus Open": ["7.8 inç iç ekran"]
    }
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
      "Ultra High-End Gaming": ["Intel Core i9-14900K", "AMD Ryzen 9 7950X3D", "AMD Ryzen 7 7800X3D"],
      "Mid-Range Gaming": ["Intel Core i7-14700K", "AMD Ryzen 7 7700X", "Intel Core i5-14400F"],
      "Workstation / Render Kasası": ["Intel Core i9-14900K", "AMD Ryzen 9 7950X"],
      "F/P Oyuncu Kasası": ["AMD Ryzen 5 7600", "Intel Core i5-13400F", "AMD Ryzen 5 5600"],
      "ROG Hyperion GR701": ["Intel Core i9-14900K", "AMD Ryzen 9 7950X3D"],
      "ROG Strix GT15": ["Intel Core i7-14700K", "AMD Ryzen 7 7700X"],
      "ROG Strix G35": ["Intel Core i7-13700K", "AMD Ryzen 7 7700X"],
      "MEG Trident X2": ["Intel Core i9-14900K", "AMD Ryzen 9 7950X"],
      "MPG Infinite X2": ["Intel Core i7-14700K", "AMD Ryzen 7 7700X"],
      "MAG Codex 6": ["Intel Core i5-14400F", "AMD Ryzen 5 7600"],
      "Aurora R16": ["Intel Core i9-14900KF", "Intel Core i7-14700KF"],
      "Aurora R15": ["Intel Core i9-13900KF", "Intel Core i7-13700KF"]
    },
    gpus: {
      "Ultra High-End Gaming": ["NVIDIA GeForce RTX 4090 24GB", "NVIDIA GeForce RTX 4080 Super 16GB"],
      "Mid-Range Gaming": ["NVIDIA GeForce RTX 4070 Ti Super 16GB", "NVIDIA GeForce RTX 4070 Super 12GB", "NVIDIA GeForce RTX 4060 Ti 8GB"],
      "Workstation / Render Kasası": ["NVIDIA GeForce RTX 4090 24GB", "NVIDIA GeForce RTX 4080 Super 16GB"],
      "F/P Oyuncu Kasası": ["NVIDIA GeForce RTX 4060 8GB", "NVIDIA GeForce RTX 3060 12GB"],
      "ROG Hyperion GR701": ["NVIDIA GeForce RTX 4090 24GB", "NVIDIA GeForce RTX 4080 Super 16GB"],
      "ROG Strix GT15": ["NVIDIA GeForce RTX 4070 Super 12GB", "NVIDIA GeForce RTX 4060 Ti 8GB"],
      "ROG Strix G35": ["NVIDIA GeForce RTX 4070 8GB", "NVIDIA GeForce RTX 4060 8GB"],
      "MEG Trident X2": ["NVIDIA GeForce RTX 4090 24GB", "NVIDIA GeForce RTX 4080 Super 16GB"],
      "MPG Infinite X2": ["NVIDIA GeForce RTX 4070 Ti Super 16GB", "NVIDIA GeForce RTX 4070 Super 12GB"],
      "MAG Codex 6": ["NVIDIA GeForce RTX 4060 8GB", "NVIDIA GeForce RTX 4060 Ti 8GB"],
      "Aurora R16": ["NVIDIA GeForce RTX 4080 Super 16GB", "NVIDIA GeForce RTX 4070 8GB"],
      "Aurora R15": ["NVIDIA GeForce RTX 4080 12GB", "NVIDIA GeForce RTX 4070 8GB"]
    },
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
      "Mac Studio": ["Apple M2 Ultra", "Apple M2 Max", "Apple M1 Ultra", "Apple M1 Max"],
      "Mac Mini": ["Apple M2 Pro", "Apple M2", "Apple M1"],
      "iMac 24\"": ["Apple M3", "Apple M1"],
      "Mac Pro": ["Apple M2 Ultra"]
    },
    gpus: {
      "Mac Studio": ["Dahili Apple GPU"],
      "Mac Mini": ["Dahili Apple GPU"],
      "iMac 24\"": ["Dahili Apple GPU"],
      "Mac Pro": ["Dahili Apple GPU"]
    },
    rams: {
      "Mac Studio": ["32 GB", "64 GB", "96 GB", "128 GB", "192 GB"],
      "Mac Mini": ["8 GB", "16 GB", "24 GB", "32 GB"],
      "iMac 24\"": ["8 GB", "16 GB", "24 GB"],
      "Mac Pro": ["64 GB", "128 GB", "192 GB"]
    },
    storages: {
      "Mac Studio": ["512 GB SSD", "1 TB SSD", "2 TB SSD", "4 TB SSD", "8 TB SSD"],
      "Mac Mini": ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD"],
      "iMac 24\"": ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD"],
      "Mac Pro": ["1 TB SSD", "2 TB SSD", "4 TB SSD", "8 TB SSD"]
    },
    screenSizes: {
      "Mac Studio": ["Kasa (Harici Ekran)"],
      "Mac Mini": ["Kasa (Harici Ekran)"],
      "iMac 24\"": ["24 inç 4.5K Retina"],
      "Mac Pro": ["Kasa (Harici Ekran)"]
    }
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
      "iPad Pro 13\" (M4)": ["Apple M4"],
      "iPad Pro 11\" (M4)": ["Apple M4"],
      "iPad Pro 12.9\" (M2)": ["Apple M2"],
      "iPad Air 13\" (M2)": ["Apple M2"],
      "iPad Air 11\" (M2)": ["Apple M2"],
      "iPad Mini 6": ["Apple A15 Bionic"],
      "iPad 10. Nesil": ["Apple A14 Bionic"],
      "Galaxy Tab S9 Ultra": ["Snapdragon 8 Gen 2"],
      "Galaxy Tab S9+": ["Snapdragon 8 Gen 2"],
      "Galaxy Tab S9": ["Snapdragon 8 Gen 2"],
      "Galaxy Tab S9 FE": ["Exynos 1380"],
      "Xiaomi Pad 6S Pro 12.4\"": ["Snapdragon 8 Gen 2"],
      "Xiaomi Pad 6": ["Snapdragon 870"],
      "Redmi Pad Pro": ["Snapdragon 7s Gen 2"]
    },
    gpus: {},
    rams: {
      "iPad Pro 13\" (M4)": ["8 GB", "16 GB"],
      "iPad Pro 11\" (M4)": ["8 GB", "16 GB"],
      "iPad Pro 12.9\" (M2)": ["8 GB", "16 GB"],
      "iPad Air 13\" (M2)": ["8 GB"],
      "iPad Air 11\" (M2)": ["8 GB"],
      "iPad Mini 6": ["4 GB"],
      "iPad 10. Nesil": ["4 GB"],
      "Galaxy Tab S9 Ultra": ["12 GB", "16 GB"],
      "Galaxy Tab S9+": ["12 GB"],
      "Galaxy Tab S9": ["8 GB", "12 GB"],
      "Galaxy Tab S9 FE": ["6 GB", "8 GB"],
      "Xiaomi Pad 6S Pro 12.4\"": ["8 GB", "12 GB"],
      "Xiaomi Pad 6": ["6 GB", "8 GB"],
      "Redmi Pad Pro": ["6 GB", "8 GB"]
    },
    storages: {
      "iPad Pro 13\" (M4)": ["256 GB", "512 GB", "1 TB", "2 TB"],
      "iPad Pro 11\" (M4)": ["256 GB", "512 GB", "1 TB", "2 TB"],
      "iPad Mini 6": ["64 GB", "256 GB"],
      "iPad 10. Nesil": ["64 GB", "256 GB"],
      "Galaxy Tab S9 FE": ["128 GB", "256 GB"],
      default: ["128 GB", "256 GB", "512 GB", "1 TB"]
    },
    screenSizes: {
      "iPad Pro 13\" (M4)": ["13 inç"],
      "iPad Pro 11\" (M4)": ["11 inç"],
      "iPad Pro 12.9\" (M2)": ["12.9 inç"],
      "iPad Air 13\" (M2)": ["13 inç"],
      "iPad Air 11\" (M2)": ["11 inç"],
      "iPad Mini 6": ["8.3 inç"],
      "iPad 10. Nesil": ["10.9 inç"],
      "Galaxy Tab S9 Ultra": ["14.6 inç"],
      "Galaxy Tab S9+": ["12.4 inç"],
      "Galaxy Tab S9": ["11 inç"],
      "Galaxy Tab S9 FE": ["10.9 inç"],
      "Xiaomi Pad 6S Pro 12.4\"": ["12.4 inç"],
      "Xiaomi Pad 6": ["11 inç"],
      "Redmi Pad Pro": ["12.1 inç"]
    }
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
    gpus: {},
    rams: {},
    storages: {
      "PlayStation 5 Slim": ["1 TB SSD"],
      "PlayStation 5 Standart / Fat": ["825 GB SSD"],
      "PlayStation 4 Pro": ["1 TB"],
      "PlayStation 4 Slim": ["500 GB", "1 TB"],
      "Xbox Series X": ["1 TB SSD", "2 TB SSD"],
      "Xbox Series S": ["512 GB SSD", "1 TB SSD"],
      "Xbox One X": ["1 TB"],
      "Nintendo Switch OLED": ["64 GB"],
      "Nintendo Switch V2": ["32 GB"],
      "Nintendo Switch Lite": ["32 GB"],
      "Steam Deck OLED": ["512 GB SSD", "1 TB SSD"],
      "Steam Deck LCD": ["256 GB SSD", "512 GB SSD"]
    },
    screenSizes: {
      "PlayStation 5 Slim": ["Harici ekran / TV"],
      "PlayStation 5 Standart / Fat": ["Harici ekran / TV"],
      "PlayStation 4 Pro": ["Harici ekran / TV"],
      "PlayStation 4 Slim": ["Harici ekran / TV"],
      "Xbox Series X": ["Harici ekran / TV"],
      "Xbox Series S": ["Harici ekran / TV"],
      "Xbox One X": ["Harici ekran / TV"],
      "Nintendo Switch OLED": ["7.0 inç OLED"],
      "Nintendo Switch V2": ["6.2 inç"],
      "Nintendo Switch Lite": ["5.5 inç"],
      "Steam Deck OLED": ["7.4 inç OLED"],
      "Steam Deck LCD": ["7.0 inç LCD"]
    }
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
    gpus: {
      "Nitro+ Radeon": ["AMD RDNA 3"],
      "Pulse Radeon": ["AMD RDNA 3"],
      "Pure Radeon": ["AMD RDNA 3"],
      default: ["NVIDIA Ada Lovelace"]
    },
    rams: {
      "Nitro+ Radeon": ["16 GB", "20 GB", "24 GB"],
      "Pulse Radeon": ["8 GB", "16 GB"],
      "Pure Radeon": ["8 GB", "16 GB"],
      "ROG Strix": ["12 GB", "16 GB", "24 GB"],
      "TUF Gaming": ["8 GB", "12 GB", "16 GB"],
      "Suprim X": ["12 GB", "16 GB", "24 GB"],
      default: ["8 GB", "12 GB", "16 GB"]
    },
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
    rams: {
      "Apple Watch Ultra 2": ["1 GB"],
      "Apple Watch Ultra": ["1 GB"],
      "Apple Watch Series 9": ["1 GB"],
      "Apple Watch Series 8": ["1 GB"],
      "Apple Watch SE 2": ["1 GB"],
      default: ["Dahili bellek"]
    },
    storages: {
      "Apple Watch Ultra 2": ["64 GB"],
      "Apple Watch Ultra": ["32 GB"],
      "Apple Watch Series 9": ["64 GB"],
      "Apple Watch Series 8": ["32 GB"],
      "Apple Watch SE 2": ["32 GB"],
      "Galaxy Watch 6 Classic": ["16 GB"],
      "Galaxy Watch 6": ["16 GB"],
      "Galaxy Watch 5 Pro": ["16 GB"],
      default: ["32 GB"]
    },
    screenSizes: {
      "Apple Watch Ultra 2": ["49 mm"],
      "Apple Watch Ultra": ["49 mm"],
      "Apple Watch Series 9": ["41 mm", "45 mm"],
      "Apple Watch Series 8": ["41 mm", "45 mm"],
      "Apple Watch SE 2": ["40 mm", "44 mm"],
      "Galaxy Watch 6 Classic": ["43 mm", "47 mm"],
      "Galaxy Watch 6": ["40 mm", "44 mm"],
      "Galaxy Watch 5 Pro": ["45 mm"],
      "Watch Ultimate (Safir)": ["48 mm"],
      "Watch GT 4": ["41 mm", "46 mm"],
      "Watch 4 Pro": ["48 mm"],
      "Fenix 7X Pro Solar": ["51 mm"],
      "Epix Pro Gen 2": ["47 mm", "51 mm"],
      "Forerunner 965": ["47 mm"]
    }
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
    { id: "kusursuz", label: "Kusursuz", desc: "Çizik, darbe ve kullanım izi yok." },
    { id: "cok-iyi", label: "Çok İyi", desc: "Yakından bakınca hafif iz olabilir, darbe yok." },
    { id: "iyi", label: "İyi", desc: "Günlük kullanımdan ince izler var, ezik yok." },
    { id: "orta", label: "Orta", desc: "Belirgin çizik veya sürtme var, cihaz bütün." },
    { id: "hasarli", label: "Hasarlı", desc: "Ezik, çatlak veya kırık var." }
  ],
  adapters: ["Orijinal", "Muadil", "Yok / Adaptörsüz"],
  workingStates: [
    { id: "perfect", label: "Sorunsuz Çalışıyor", desc: "Tüm donanımlar, klavye, ekran ve portlar aktif" },
    { id: "issues", label: "Bazı Sorunları Var", desc: "Donanım veya işlevsellik kusuru mevcut" }
  ]
};

export function choiceList(data, field, series, brand) {
  const value = data?.[field];
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (series && Array.isArray(value[series])) return value[series];
  if (brand && Array.isArray(value[brand])) return value[brand];
  if (Array.isArray(value.default)) return value.default;
  return [];
}

export function listed(current, options) {
  if (options.includes(current)) return current;
  return options[0] || '';
}

export function seriesFor(data, brand, model) {
  const seriesList = data?.series?.[brand] || [];
  const found = seriesList.find((series) => (data.models?.[series] || []).includes(model));
  return found || seriesList[0] || '';
}

export function defaultSpecs(category) {
  const data = DEVICE_SPECS_DATA[category] || DEVICE_SPECS_DATA.laptop;
  const brand = data.brands[0];
  const series = (data.series[brand] || [])[0] || '';
  const model = (data.models[series] || [series])[0] || '';
  return {
    brand,
    series,
    model,
    cpu: choiceList(data, 'cpus', series, brand)[0] || '',
    gpu: choiceList(data, 'gpus', series, brand)[0] || '',
    ram: choiceList(data, 'rams', series, brand)[0] || '',
    storage: choiceList(data, 'storages', series, brand)[0] || '',
    screenSize: choiceList(data, 'screenSizes', series, brand)[0] || '',
  };
}
