# PLAN 3: Canlı Teklif Radarı, Teklifler Listesi & Teklif Detayı
**Kaynak Arayüz:** Fotoğraf 2 (Teklif Gönderildi Radarı, Gelen Teklifler Listesi, Teklif Detayı)  
**Hedef:** Kullanıcının satış sihirbazından gönderdiği cihaz için gerçek zamanlı dağıtım sürecini izleyebileceği, işletmelerden gelen teklifleri karşılaştırabileceği ve en yüksek teklifin detaylarını inceleyebileceği interaktif modül.

---

## 1. Genel Bakış ve Deneyim Akışı
Kullanıcı cihazını ilana açtığında üç ardışık ekran/durum deneyimler:
1. **Ekran A - Dağıtım Radarı:** *"Cihazınız işletmelere gönderildi"* başlığı altında tekliflerin canlı toplanma süreci.
2. **Ekran B - Gelen Teklifler:** 5 farklı kurumsal işletmenin verdiği fiyat tekliflerinin listesi ve sıralanması.
3. **Ekran C - Teklif Detayı:** En yüksek teklifi veren mağazanın detayları, sözleşme şartları ve *"İletişime Geç"* aksiyonu.

---

## 2. Ekran A: Dağıtım & Teklif Bekleme Radarı
*(Fotoğraf 2 - Sol Ekran)*

* **İlerleme Çubuğu:**
  * `[✓ 1 Cihaz]` ➔ `[✓ 2 Özellikler]` ➔ `[✓ 3 Durum]` ➔ `[● 4 Teklifler]`
* **Merkezi Radar Animasyonu:**
  * Ortada satılan cihazın görseli (MacBook Pro).
  * Cihazın çevresinde dalga dalga yayılan radyo/radar halkaları (CSS Keyframe Pulse efekti).
  * Çevrede beliren onaylı mağaza simgeleri (yeşil, mavi pinler ve dükkan ikonları).
* **Başlık & Açıklama:**
  * Başlık: `Cihazınız işletmelere gönderildi.`
  * Açıklama: *"Bilgilerinizi paylaştık, işletmeler size en iyi tekliflerini iletiyor. Bu genellikle birkaç dakika sürer."*
* **Canlı Zaman Çizelgesi (Canlı Durum Kontrol Listesi):**
  * `[✓]` **Cihaz bilgileri gönderildi** (Mavi onay tik ikonu)
  * `[✓]` **Uygun işletmelerle paylaşıldı** (Mavi onay tik ikonu)
  * `[🔄 / Pulse]` **Teklifler toplanıyor** (Mavi parlayan halka animasyonu, *"Bu işlem birkaç dakika sürebilir."*)
  * `[⚪]` **Teklifler listeleniyor** (Sırada bekleyen gri halka)
* **Alt Bildirim Kutusu:**
  * Sol: Zil ikonu.
  * Metin: *"Teklifler geldiğinde anında bildirim alacaksınız. Sayfayı veya tarayıcıyı kapatsanız bile teklifleriniz profilinizde saklanır."*
* **Hızlı Geçiş Butonu:** Kullanıcının beklemeden teklifleri görmesi için akıllı simülasyon butonu: `Teklifleri Hemen Gör ➔`.

---

## 3. Ekran B: Gelen Teklifler (Canlı Teklif Borsası)
*(Fotoğraf 2 - Orta Ekran)*

* **Üst Cihaz Özet Kartı:**
  * Görsel: MacBook Pro 14" (2023)
  * Detay: `M2 Pro • 16 GB • 512 GB`
  * Aksiyon Linki: `Detayları Gör ➔` (Cihazın tüm teknik özelliklerini açılır popup ile gösterir).
* **Başlık ve Sıralama Barı:**
  * Sol: `5 işletmeden teklif geldi` (Kalın, koyu yazı).
  * Sağ: Sıralama Dropdown: `⇅ En Yüksek Fiyat` (Seçenekler: En Yüksek Fiyat, En Yakın Mağaza, En Yüksek Puan).
* **Teklif Kartları Listesi (Birebir Fotoğraf 2'deki Değerler):**
  1. **TechStore**
     * Rozet: `🟢 En Yüksek Teklif` (Yeşil pill rozet)
     * Puan & Konum: `⭐ 4.9 (320)` | `İstanbul • 2.3 km`
     * Teklif Fiyatı: `42.500 TL` (Büyük kalın siyah metin)
     * Zaman: `Bugün 14:32`
     * Buton: `Detayları Gör ➔` (Mavi dolgulu buton)
  2. **Giga Bilişim**
     * Logo: Mavi GIGA ikonu
     * Puan & Konum: `⭐ 4.8 (180)` | `İstanbul • 4.1 km`
     * Teklif Fiyatı: `41.000 TL`
     * Zaman: `Bugün 13:15`
     * Buton: `Detayları Gör ➔`
  3. **Nova Teknoloji**
     * Logo: Siyah N ikonu
     * Puan & Konum: `⭐ 4.7 (210)` | `Ankara • 8.6 km`
     * Teklif Fiyatı: `39.750 TL`
     * Zaman: `Bugün 12:48`
     * Buton: `Detayları Gör ➔`
  4. **Plus Elektronik**
     * Logo: Mor PLUS ikonu
     * Puan & Konum: `⭐ 4.6 (95)` | `İzmir • 12.2 km`
     * Teklif Fiyatı: `38.500 TL`
     * Zaman: `Bugün 11:03`
     * Buton: `Detayları Gör ➔`
  5. **Metro Bilişim**
     * Logo: Turuncu M ikonu
     * Puan & Konum: `⭐ 4.5 (140)` | `İstanbul • 5.7 km`
     * Teklif Fiyatı: `37.000 TL`
     * Zaman: `Bugün 10:21`
     * Buton: `Detayları Gör ➔`

---

## 4. Ekran C: Teklif Detayı
*(Fotoğraf 2 - Sağ Ekran)*

* **Üst Bar:** `← Geri` | Başlık: `Teklif Detayı`
* **Mağaza Profil Bloğu:**
  * Mağaza vitrin fotoğrafı (Gerçekçi modern teknoloji mağazası iç mekanı).
  * Mağaza logosu (Siyah zemin üzerine TECHStore yazısı, mavi onay tiki).
  * Başlık: `TechStore`
  * Puan & Değerlendirme: `⭐ 4.9 (320 değerlendirme)`
  * Konum: `📍 İstanbul • 2.3 km`
  * Buton: `Profili Gör ➔` (Doğrudan Plan 4'teki mağaza profiline yönlendirir).
* **Güven Rozetleri Çubuğu:**
  * `[🛡️ Güvenilir İşletme]`
  * `[⚡ Hızlı Dönüş]`
  * `[🏪 Yerinde Satış]`
  * `[🏢 Kurumsal]`
* **Teklif Vurgu Kartı (Büyük Yeşil-Mavi Kart):**
  * Üst etiket: `✨ Sana Özel Teklif` | Sağda zaman: `Bugün 14:32`
  * Fiyat: **`42.500 TL`** (Devasa yeşil tipografi)
  * Ana Eylem Butonu: `💬 İletişime Geç` (Tıklandığında doğrudan **Plan 4: Chat Ekranı** açılır).
* **Teklif Detayları Tablosu:**
  * `Cihaz:` MacBook Pro 14" (2023)
  * `İşlemci:` M2 Pro
  * `RAM:` 16 GB
  * `Depolama:` 512 GB SSD
  * `Durum:` İyi / Sıfır Gibi
  * `Teklif Geçerlilik Süresi:` 3 gün
* **"Nasıl Devam Ederim?" Bilgilendirme Kutusu:**
  * Mavi bilgi ikonu `ℹ️`
  * Açıklama: *"İletişime geçerek cihazınızı bu fiyattan satmak için detayları görüşebilirsiniz. İşletme size konum, randevu ve teslimat süreci hakkında bilgi verecektir."*

---

## 5. Veri Modeli ve Dinamik Teklif Motoru
```javascript
const offersData = [
  {
    id: "off-techstore-01",
    storeId: "store-techstore",
    storeName: "TechStore",
    rating: 4.9,
    reviewCount: 320,
    distance: "2.3 km",
    city: "İstanbul",
    offerPrice: 42500,
    isHighest: true,
    badges: ["Güvenilir İşletme", "Hızlı Dönüş", "Yerinde Satış", "Kurumsal"],
    validityDays: 3,
    status: "active",
    createdAt: "Bugün 14:32"
  },
  // Giga Bilişim (41.000 TL), Nova Teknoloji (39.750 TL) vb.
];
```

---

## 6. Başarı ve Tamamlanma Kriteri (Definition of Done)
1. Radar ekranındaki pulse animasyonu ve durum adımları canlı gibi akıcı çalışmalı.
2. Gelen teklifler listesinde 5 mağazanın teklifleri sıralanabilmeli (fiyat/puan/mesafe).
3. "Detayları Gör" tıklandığında Teklif Detay paneli açılmalı ve "İletişime Geç" butonu doğrudan Plan 4'teki sohbet ekranını başlatmalı.
