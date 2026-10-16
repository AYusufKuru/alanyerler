# PLAN 5: Onboarding & Güven Mimarisi, Veri Entegrasyonu & Mobil Köprüsü
**Kaynak Arayüz:** Fotoğraf 5 (4 Karşılama/Onboarding Ekranı) + Sistemler Arası Entegrasyon  
**Hedef:** Web sitesine ilk kez gelen kullanıcılara platformun nasıl çalıştığını ve güvenilirliğini anlatan interaktif tanıtım/onboarding modülü, 5 plan arasındaki veri köprüsü (State Management) ve ileride mobil uygulama ile stabil entegre olabilmesi için gerekli teknik altyapı.

---

## 1. Genel Bakış ve Amaç
Kullanıcıların "Neden bu web sitesini kullanmalıyım?", "Uygulama indirmeme gerçekten gerek yok mu?", "Param güvende mi?" sorularına fotoğraf 5'teki 4 temel vaat ile yanıt verilir. Ayrıca tüm ekranlar arasındaki veri transferi kalıcı hale getirilir.

---

## 2. Fotoğraf 5 Temelli 4 Değer & Onboarding Paneli

### 2.1. Panel 1: "Cihazını Sat, En İyi Teklifi Bul."
* **Görsel Tasarım:**
  * Merkezde cihaz vitrini (iPhone, MacBook, PS5, Ekran kartı, AirPods).
  * Çevresinde yüzen teklif baloncukları:
    * `TechStore: 41.250 TL >`
    * `Giga Bilişim: 40.000 TL >`
    * `Nova Teknoloji: 38.500 TL >`
    * `Plus Elektronik: 39.750 TL >`
* **Metin:**
  * Başlık: `Cihazını Sat, En İyi Teklifi Bul.`
  * Açıklama: *"Telefon, bilgisayar, oyun konsolu ve daha fazlası için bilgileri gir. İşletmelerden gelen teklifleri karşılaştır, sana en uygun olanı seç."*
* **Aksiyon:** `Cihazımı Satmak İstiyorum ➔`

---

### 2.2. Panel 2: "Adım Adım Kolayca Ekle."
* **Görsel Tasarım:**
  * Şık bir akıllı telefon çerçevesi içerisinde açılan ilan sihirbazı önizlemesi: Kategori seçimi (Telefon, Bilgisayar, Konsol, Ekran kartı, Tablet, Diğer).
* **Metin:**
  * Başlık: `Adım Adım Kolayca Ekle.`
  * Açıklama: *"Cihazının marka, model, teknik özellikleri ve mevcut durumunu birkaç adımda ekle. Satış sürecini senin için kolaylaştırıyoruz."*
* **Aksiyon:** `İleri ➔`

---

### 2.3. Panel 3: "Teklifler Cebine Gelsin."
* **Görsel Tasarım:**
  * Canlı teklifler ekranı maketi: iPhone 15 Pro ilanına gelen TechStore (41.250 TL), Giga Bilişim (40.000 TL), Nova Teknoloji (38.500 TL) kartları ve *"Teklifi Gör"* butonları.
* **Metin:**
  * Başlık: `Teklifler Cebine Gelsin.`
  * Açıklama: *"İlanını oluştur, güvenilir işletmelerden gelen fiyat tekliflerini anında gör. Teklifleri karşılaştır, en iyi teklifi seç."*
* **Aksiyon:** `İleri ➔`

---

### 2.4. Panel 4: "Güvenli ve Kolay Satış."
* **Görsel Tasarım:**
  * 3D el sıkışma (güvenli anlaşma) illüstrasyonu, mavi güvenlik kalkanı, yeşil onaylı satış ikonları.
  * 4 Güvenlik Rozeti:
    * `[ 🛡️ Güvenilir İşletmeler ]`
    * `[ ⚡ Hızlı Teklif ]`
    * `[ 💬 Kolay İletişim ]`
    * `[ ✅ Güvenli Satış ]`
* **Metin:**
  * Başlık: `Güvenli ve Kolay Satış.`
  * Açıklama: *"Beğendiğin teklifi seç, web üzerinden işletmeyle iletişime geç. Cihazını güvenle, hızlı ve kolayca sat."*
* **Aksiyon:** `Hemen Başla ➔` (Doğrudan ana portala veya satış sihirbazına bağlar).

---

## 3. Web Uygulamasında Onboarding Deneyimi
* Web sitesine giren kullanıcı için bu 4 kart hem **Hero altında interaktif bir "Neden Alan Yerler?" vitrini** olarak hem de istendiğinde üst menüdeki **"Nasıl Çalışır?"** butonuna tıklandığında açılan modern bir **Modal Slider / Carousel** olarak çalışır.
* Sayfa noktaları (pagination dots: `● ○ ○ ○`) ve `Geç` / `İleri ➔` kontrolleri ile tam etkileşimlidir.

---

## 4. Uçtan Uca Veri Modeli ve State Management (Local Database)
Platformun "sadece bir sayfa" değil, gerçek bir web uygulaması gibi çalışması için aşağıdaki modüller birbiriyle kalıcı olarak konuşur:

```
[ Plan 2: Satış Sihirbazı ]
           │ (Cihaz Kaydedildi)
           ▼
[ LocalStorage Store: devices ] ──► [ Plan 3: Teklif Radarı & Gelen Teklifler ]
                                                   │
                                                   │ (Teklifi Seç / İletişime Geç)
                                                   ▼
                                    [ Plan 4: Canlı Sohbet & Teklif Kabulü ]
                                                   │
                                                   │ (Mağaza Bilgileri)
                                                   ▼
                                    [ Plan 4: İşletme Detay Profili ]
```

### Kalıcı Veri Deposu (Persistence):
* `localStorage.getItem('alan_yerler_devices')`
* `localStorage.getItem('alan_yerler_offers')`
* `localStorage.getItem('alan_yerler_chats')`
* `localStorage.getItem('alan_yerler_favorites')`
Sayfa yenilense bile teklifler, ilanlar ve mesajlaşmalar asla silinmez.

---

## 5. Gelecekte Mobil Uygulama Entegrasyonu (API-Ready Architecture)
* **REST/JSON Uyumluluğu:** Uygulamada kullanılan tüm JavaScript veri modelleri ileride backend (Node.js/Firebase/Supabase/Go) veya mobil uygulama (React Native/Flutter/iOS/Android) ile sıfır veri dönüşümüyle eşleşecek biçimde tasarlanmıştır.
* **PWA (Progressive Web App) Desteği:**
  * `manifest.json` dosyası eklenerek mobil tarayıcıda *"Ana Ekrana Ekle"* desteği sağlanır.
  * Mobil tarayıcıda adres çubuğu gizlenip tam ekran uygulama hissi verilir.
* **Responsive Çözünürlük Matrisi:**
  * Masaüstü: `1440px - 1920px` (Geniş pazar yeri düzeni)
  * Laptop/Tablet: `768px - 1200px` (İki sütunlu esnek düzen)
  * Mobil Web: `360px - 480px` (Fotoğraflardaki natif mobil arayüzün birebir akıcılığı)

---

## 6. Başarı ve Tamamlanma Kriteri (Definition of Done)
1. Fotoğraf 5'teki 4 onboarding/güven kartı hem vitrin hem de interaktif modal olarak kusursuz çalışmalı.
2. Tüm planlar (1, 2, 3, 4, 5) arasında veri alışverişi kesintisiz çalışmalı (örneğin sihirbazdan yeni bir cihaz eklendiğinde teklifler ve mesajlar dinamik olarak güncellenmeli).
3. PWA manifest ve mobil uyumluluk meta etiketleri eksiksiz eklenmeli.
