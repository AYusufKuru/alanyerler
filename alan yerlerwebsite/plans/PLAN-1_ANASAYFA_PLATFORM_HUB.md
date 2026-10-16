# PLAN 1: Ana Sayfa & Platform Hub'ı
**Kaynak Arayüz:** Fotoğraf 3 (Alan Yerler Mobil Ana Sayfası)  
**Hedef:** Bu mobil arayüzün masaüstü, tablet ve mobil web tarayıcılarında çalışan, yüksek estetikli, akıcı ve eksiksiz bir web platformu hub'ı olarak inşa edilmesi.

---

## 1. Genel Bakış ve Amaç
Kullanıcı web sitesini açtığında bir reklam veya statik açılış sayfasıyla değil; anında cihaz seçip teklif almaya başlayabileceği, platformun güven ve şeffaflık ilkelerini hissedebileceği son derece modern bir **Pazar Yeri Portalı** ile karşılaşacaktır.

---

## 2. Tasarım Sistemi & Görsel Dil (Design Tokens)
* **Renk Paleti:**
  * **Brand Primary (Ana Mavi):** `#2563EB` (Royal Blue) - Hover: `#1D4ED8`, Aktif: `#1E40AF`
  * **Brand Light Blue:** `#EFF6FF` / `#DBEAFE` (Kart arka planları ve hafif vurgular)
  * **Accent Emerald (Fiyat & Güven):** `#10B981` / `#059669` (Teklifler ve onay rozetleri)
  * **Surface / Arka Plan:** `#F8FAFC` (Ferah gri-beyaz taban), `#FFFFFF` (Kart yüzeyleri)
  * **Koyu Tonlar / Metin:** Başlıklar `#0F172A` (Slate 900), Gövde metinleri `#334155` (Slate 700), İkincil `#64748B` (Slate 500)
  * **Kenarlık & Çerçeveler:** `#E2E8F0` / `#F1F5F9`
* **Tipografi:** Google Fonts `Plus Jakarta Sans` veya `Inter` (300, 400, 500, 600, 700, 800 ağırlıkları). Keskin, kurumsal ve okunabilir.
* **Gölge ve Derinlik:**
  * `box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04);`
  * Hover durumunda kartlarda hafif kalkma (`transform: translateY(-4px);`) ve derinleşen gölge efekti.
* **Border Radius:** Buton ve kartlarda modern 14px - 20px oval/yumuşak köşeler.

---

## 3. Ekran Bileşenleri ve Ayrıntılı Düzen

### 3.1. Üst Bar & Navigasyon (Header)
* **Sol Alan:**
  * "Alan Yerler" logo tipografisi (Kalın, modern, mavi vurgulu nokta/ikon ile).
  * Alt etiket: "Doğrulanmış İkinci El Teknoloji Pazarı".
* **Orta Alan (Masaüstü Menü):**
  * `Anasayfa` (Aktif gösterge)
  * `Nasıl Çalışır?` (Pürüzsüz kaydırma veya modal açar)
  * `Kategoriler` (Açılır hızlı seçim menüsü)
  * `Teklifleri Takip Et` (Canlı teklifler merkezine hızlı geçiş)
  * `Kurumsal Alıcılar` (Onaylı mağazalar listesi)
* **Sağ Alan (Aksiyon & Bildirim):**
  * **Canlı Bildirim Zili:** Kırmızı/Mavi okunmamış rozeti ("2"). Tıklandığında açılır popover (Örn: *"TechStore MacBook ilanınıza 42.500 TL teklif verdi"*).
  * **Hızlı Aksiyon Butonu:** `+ Cihaz Sat` (Gradient mavi, göz alıcı vurgu butonu).
  * **Kullanıcı / Giriş Alanı:** Profil avatarı, tıklandığında "İlanlarım", "Favorilerim", "Ayarlar" menüsü.

---

### 3.2. Hero Bölümü ("Cihazını Sat, En İyi Teklifi Al")
* **Sol Metin ve Eylem Bloğu:**
  * Ana Başlık: `Cihazını Sat, En İyi Teklifi Al.`
  * Açıklama: *"Telefon, bilgisayar, oyun konsolu ve daha fazlası için yüzlerce onaylı işletmeden gelen gerçek teklifleri karşılaştır, en yüksek fiyata güvenle sat."*
  * **Canlı Rozet (Live Badge):** Yeşil trend ikonuyla parıldayan: `📈 3 İşletmeden Teklif Geldi!` animasyonlu bildirim etiketi.
  * **Ana CTA Butonu:** `Hemen Başla ➔` (Doğrudan kategori seçimine veya satış sihirbazına akıcı geçiş sağlar).
  * İkincil Link: `Nasıl çalıştığını gör` (kısa tanıtım animasyonu).
* **Sağ Görsel Alanı (Zengin Teknoloji Kolajı):**
  * Gerçekçi yüksek çözünürlüklü cihaz kompozisyonu (iPhone 15 Pro, MacBook Pro M-serisi, PlayStation 5, RTX Ekran Kartı, Apple Watch Ultra, AirPods).
  * Üzerinde asılı duran yüzen canlı teklif kartları (Floating Cards):
    * Kart A: *TechStore: 42.500 TL* (Yeşil onaylı etiket)
    * Kart B: *Giga Bilişim: 41.000 TL* (Mavi etiket)

---

### 3.3. Cihaz Kategori Seçim Izgarası ("Hangi cihazı satmak istiyorsunuz?")
Kullanıcı satmak istediği kategoriyi seçerek anında ilan sihirbazını tetikler.
* **Başlık Alanı:**
  * Üst etiket: `— CİHAZ SEÇ`
  * Başlık: `Hangi cihazı satmak istiyorsunuz?`
  * Alt bilgi: *"Satmak istediğiniz cihaz kategorisini seçerek teklif toplamaya başlayın."*
* **7 Ana Kategori Kartı (Görsel ve Butonlu):**
  1. **Telefon** (iPhone / Samsung / Xiaomi görselleri, sağ alt ok butonu `➔`, aktif alıcı sayısı rozeti: "45 Alıcı")
  2. **Bilgisayar / Laptop** (MacBook & Gaming Laptop görselleri, `➔`, "38 Alıcı")
  3. **Oyun Konsolu** (PlayStation 5 / Xbox Series X / Nintendo, `➔`, "29 Alıcı")
  4. **Ekran Kartı** (Nvidia RTX 40/30 serisi, AMD Radeon, `➔`, "18 Alıcı")
  5. **Tablet** (iPad Pro, iPad Air, Galaxy Tab, `➔`, "24 Alıcı")
  6. **Akıllı Saat** (Apple Watch Ultra, Galaxy Watch, `➔`, "16 Alıcı")
  7. **Kulaklık** (AirPods Max, Sony WH-1000XM5, `➔`, "12 Alıcı")
* **Etkileşim:** Kart üzerine gelindiğinde (hover) arka planda hafif mavi parıltı, cihaz görselinde mikro ölçeklenme (`scale: 1.05`) ve ok butonunda renk değişimi. Tıklanıldığında doğrudan **Plan 2 (Cihaz Satış Sihirbazı)** başlatılır.

---

### 3.4. "Nasıl Çalışır?" 4 Adımlı İnteraktif Akış
Mobil fotoğraftaki 4 adımı masaüstü ve web için etkileşimli, anlaşılır ve numaralı adımlarla sunar:
* **Başlık:** `NASIL ÇALIŞIR?` — `Detayları Gör ➔`
* **Adım Kartları:**
  1. **1. Cihazını Ekle:** Mavi döküman ikonu. *"Marka, model ve teknik detayları 1 dakikada eksiksiz gir."*
  2. **2. Fotoğrafları Yükle:** Mor kamera ikonu. *"Cihazının net fotoğraflarını yükle, işletmelere şeffaf göster."*
  3. **3. Teklifleri Al:** Yeşil etiket ikonu. *"Bölgendeki ve Türkiye'deki doğrulanmış işletmelerden anında teklif topla."*
  4. **4. En İyisini Seç:** Turuncu el sıkışma ikonu. *"En yüksek veya en güvenilir teklifi seç, doğrudan iletişime geçip sat."*
* **Bağlantı Çizgisi:** Adımlar arasında kesikli ilerleme çizgisi ve durum göstergesi.

---

### 3.5. Güven ve Doğrulanmış İşletme Bandı (Trust Banner)
* **Görsel Alan:** Güvenli mavi kalkan ikonu, onaylı tik işareti.
* **Metin:** `Güvenli ve Güvenilir: Doğrulanmış işletmelerden teklif al, güvenle satış yap.`
* **Ek Güven Göstergeleri:**
  * *"Sıfır Komisyon"*
  * *"Yüz Yüze veya Korumalı Kargo"*
  * *"Vergi Levhalı Onaylı Esnaf & Mağazalar"*
* **Sağ Ok Aksiyonu:** `Detaylı Güvenlik Kılavuzu ➔`

---

### 3.6. Canlı Piyasa ve Son Kabul Edilen Teklifler Bandı (Web Özel)
* Sitenin yapay zeka gibi donuk durmasını engelleyen, platformun canlı ve yaşayan bir borsa gibi çalıştığını hissettiren kayan canlı şerit (Ticker):
  * *"Son Satış: Kadıköy / MacBook Pro M1 ➔ 24.500 TL kabul edildi (5 dk önce)"*
  * *"Yeni Teklif: Beşiktaş / iPhone 14 Pro ➔ 34.000 TL teklif verildi (2 dk önce)"*

---

### 3.7. Alt Gezinme & Footer
* **Masaüstü:** Alan Yerler hakkında, kurumsal mağazalar, SSS, gizlilik sözleşmesi, KVKK, müşteri destek hattı.
* **Mobil Tarayıcı Görünümü:** Fotoğraftaki gibi sabit alt bar:
  * `[🏠 Anasayfa]` `[🏷️ Teklifler]` `[➕ Cihaz Sat (Merkezi Buton)]` `[💬 Mesajlar (Rozetli)]` `[👤 Profil]`

---

## 4. Teknik & Veri Modeli
* Sayfa bileşenleri ve durumları `appState.currentView = 'home'` ile kontrol edilir.
* Kategoriye tıklandığında `startSellWizard(categoryId)` çağrılarak seçilen kategori doğrudan sihirbaza taşınır.
* Bildirim sistemine tıklanınca canlı teklif simülasyonları ve mesaj önizlemeleri tetiklenir.

---

## 5. Başarı ve Tamamlanma Kriteri (Definition of Done)
1. Fotoğraf 3'teki tüm görsel hiyerarşi, butonlar, ikonlar, kartlar ve oranlar web'e eksiksiz aktarılmış olmalı.
2. Masaüstü çözünürlüklerde ferah bir web portalı, mobil ekranlarda ise natif uygulama kalitesinde kusursuz responsive olmalı.
3. Kategori kartları ve CTA butonları doğrudan Plan 2 sihirbazını başlatmalı.
