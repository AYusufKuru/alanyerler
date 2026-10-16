# PLAN 2: Çok Kademeli Akıllı "Cihaz Sat" Sihirbazı (Wizard)
**Kaynak Arayüz:** Fotoğraf 4 (Cihaz Satış 4 Aşamalı Akış Ekranları)  
**Hedef:** Kullanıcının elindeki cihazı minimum eforla, standartlaştırılmış teknik ve kozmetik verilerle 1-2 dakika içinde işletmelere sunmasını sağlayan akıllı, çok adımlı satış sihirbazı.

---

## 1. Genel Bakış ve Mimari
Kullanıcılar cihaz satarken belirsizlik yaşamaz. Form karmaşık ve uzun bir sayfa yerine, mobil arayüzdeki gibi **4 ana kademeye** ayrılmıştır:
1. **Adım 1: Cihaz Türü Seçimi**
2. **Adım 2: Dinamik Teknik Özellikler**
3. **Adım 3: Cihaz Durumu & Sağlık Parametreleri**
4. **Adım 4: Fotoğraf Yükleme & Nihai Özet**

Sihirbaz, kullanıcının seçtiği kategoriye göre dinamik form alanları üretir (Örn: Laptop seçilirse İşlemci/RAM/SSD/Ekran sorulurken, Telefon seçilirse Depolama/Pil Sağlığı/Face ID durumu sorulur).

---

## 2. İlerleme Göstergesi (Step Wizard Indicator)
Ekranın en üstünde fotoğraf 4'te görülen şık yuvarlak adımlar ve bağlantı çizgisi yer alır:
* `(1) Cihaz Türü` ➔ `(2) Özellikler` ➔ `(3) Durum` ➔ `(4) Fotoğraflar`
* **Aktif Durum:** Mavi dolgulu yuvarlak, kalın mavi metin.
* **Tamamlanan Durum:** Mavi tik işaretli yuvarlak `✓`.
* **Bekleyen Durum:** Gri açık yuvarlak ve açık gri metin.
* **Sağ Üst Eylem:** `İptal` veya `Taslağı Kaydet` butonu.

---

## 3. Adım Detayları (Arayüz & Etkileşim)

### 3.1. Adım 1: Hangi Cihazı Satmak İstiyorsunuz?
* **Başlık:** `Hangi cihazı satmak istiyorsunuz?`
* **Açıklama:** *"Cihazınızı seçin, bilgilerinizi doldurun ve işletmelerden gelen teklifleri alın."*
* **Seçenek Izgarası (Grid):**
  * **Laptop** (Görseli + Başlık + Sağ Ok `➔`)
  * **Masaüstü PC** (Oyuncu/İş istasyonu kasa görseli + `➔`)
  * **MacBook** (Apple MacBook görseli + `➔`)
  * **Mac Masaüstü** (iMac / Mac Mini / Mac Studio + `➔`)
  * **iPhone** (iPhone serisi görseli + `➔`)
  * **iPad** (iPad serisi görseli + `➔`)
  * **Oyun Konsolu** (PS5 / Xbox Series X + `➔`)
  * **Ekran Kartı** (GPU görseli + `➔`)
* **Seçim Davranışı:** Bir karta tıklandığında etrafında 2px canlı mavi çerçeve belirir, hafifçe yükselir ve sağındaki ok dolgulu mavi olur.
* **Alt Bar:** Sabit mavi `Devam Et ➔` butonu (seçim yapılana kadar disabled/soluktur, seçim yapılınca aktifleşir).

---

### 3.2. Adım 2: Teknik Özellikler Formu (Örn: Laptop / MacBook Seçimi)
* **Üst Seçim Özeti:**
  * Seçilen cihaz kutusu: `Seçiminiz: Laptop` (Görsel ve etiket)
  * Sağda `Değiştir 🔄` butonu (Adım 1'e hızlı dönüş).
* **Başlık:** `Laptopunuzun özellikleri`
* **Alt Başlık:** *"Marka, seri, işlemci, ekran kartı, RAM ve disk bilgilerini seçin."*
* **Dinamik Seçim Alanları (Dropdown & Smart Pickers):**
  1. **Marka \***: `Apple`, `Asus`, `Lenovo`, `Dell`, `HP`, `MSI`, `Monster`, `Acer` vb.
  2. **Seri \***: `MacBook Pro`, `MacBook Air`, `ROG`, `Legion`, `TUF`, `Victus`...
  3. **Model \***: `MacBook Pro 14" (2023)`, `MacBook Air M2 13.6"`, `ROG Strix G16`...
  4. **İşlemci \***: `M2 Pro`, `M2 Max`, `M3 Pro`, `Intel Core i7 13700H`, `AMD Ryzen 7 7840HS`...
  5. **Ekran Kartı**: `Dahili (Apple GPU)`, `NVIDIA RTX 4060`, `NVIDIA RTX 4070`, `Intel Iris Xe`...
  6. **RAM \***: `8 GB`, `16 GB`, `32 GB`, `64 GB`, `128 GB`
  7. **Depolama (SSD) \***: `256 GB`, `512 GB`, `1 TB`, `2 TB`, `4 TB`
  8. **Ekran Boyutu**: `13.3 inç`, `14 inç`, `15.6 inç`, `16 inç`, `17.3 inç`
* **Navigasyon Butonları:**
  * Sol: `← Geri`
  * Sağ: `Devam Et ➔`

---

### 3.3. Adım 3: Laptopunuzun Durumu (Kozmetik & Donanım Sağlığı)
* **Başlık:** `Laptopunuzun durumu`
* **Alt Başlık:** *"Cihazınızın mevcut durumunu doğru ve eksiksiz belirtin."*
* **Parametre Alanları (Birebir Fotoğraf 4'teki Gibi):**
  1. **🔋 Pil Sağlığı:** Dropdown: `%100`, `%95 - %99`, `%90 - %94`, `%85 - %89`, `%80 - %84`, `%80 Altı / Servis Önerisi`
  2. **💾 Depolama (SSD) Sağlığı:** Dropdown: `%100 Sağlık`, `%95+ Sağlık`, `%90+ Sağlık`, `Bilinmiyor`
  3. **📦 Kutu / Fatura:** Yan yana Segment Butonlar: `[ Var ]` | `[ Yok ]` (Aktif olan koyu mavi arka plan ve beyaz yazı).
  4. **🛡️ Kalan Garanti Süresi:** Dropdown: `6 - 12 Ay`, `1 - 6 Ay`, `12 - 24 Ay`, `Garantisi Yok / Bitti`
  5. **✨ Kozmetik Durumu:** 4'lü Segment Seçici: `[ Sıfır Gibi ]` | `[ İyi ]` | `[ Orta ]` | `[ Kötü ]`
  6. **🔌 Adaptör:** Segment Seçici: `[ Orijinal ]` | `[ Muadil ]` | `[ Yok ]`
  7. **✔️ Cihazın Çalışma Durumu:** 2'li Kart/Buton:
     * `[ Sorunsuz Çalışıyor ]`
     * `[ Bazı Sorunları Var ]` (Tıklanırsa alt açıklama kutusu zorunlu olur)
  8. **📝 Ek Bilgi (Opsiyonel):**
     * Textarea kutusu: *"Cihazınızla ilgili ek bir bilgi ekleyebilirsiniz... (ör. küçük çizik, klavye durumu vb.)"*
     * Karakter sayacı: `0 / 200`
* **Navigasyon Butonları:**
  * `← Geri`
  * `Devam Et ➔`

---

### 3.4. Adım 4: Fotoğraf Yükleme & İlan Onayı
* **Başlık:** `Cihazınızın Fotoğraflarını Ekleyin`
* **Alt Başlık:** *"Doğru ve net fotoğraflar eklemek tekliflerin hızını ve tutarını %40 artırır."*
* **Görsel Yuvaları (Slots):**
  * Yuva 1: `Ön Yüz / Ekran Açık`
  * Yuva 2: `Klavye & Üst Gövde`
  * Yuva 3: `Kapak & Arka Yüzey`
  * Yuva 4: `Kutu, Fatura & Şarj Cihazı`
* **Sürükle-Bırak (Drag & Drop):** Fotoğrafları masaüstünden sürükleyip bırakabilme, anında küçük resim (thumbnail) ve silme/değiştirme butonu.
* **Hızlı Özet Kartı (Preview Recap):**
  * Cihaz: `MacBook Pro 14" (2023) - M2 Pro • 16GB • 512GB`
  * Kozmetik: `Sıfır Gibi`, Pil: `%100`, Fatura: `Var`
  * Tahmini Piyasa Teklif Aralığı: `38.000 TL - 43.500 TL`
* **Büyük Eylem Butonu:**
  * `🚀 Cihazı Gönder & Teklifleri Topla` (Tıklandığında veriler kaydedilir ve doğrudan **Plan 3: Teklif Radarı** açılır).

---

## 4. Veri Yapısı (JSON Data Model)
```json
{
  "id": "dev-macbook-14-2023",
  "category": "laptop",
  "brand": "Apple",
  "series": "MacBook Pro",
  "model": "MacBook Pro 14\" (2023)",
  "specs": {
    "cpu": "M2 Pro",
    "gpu": "Dahili (Apple GPU)",
    "ram": "16 GB",
    "storage": "512 GB SSD",
    "screenSize": "14 inç"
  },
  "condition": {
    "batteryHealth": 100,
    "ssdHealth": 100,
    "boxAndInvoice": true,
    "warranty": "6 - 12 Ay",
    "cosmetic": "Sıfır Gibi",
    "adapter": "Orijinal",
    "workingState": "Sorunsuz Çalışıyor",
    "notes": "Ekranda koruyucu var, kasada çizik dahi bulunmuyor."
  },
  "photos": ["/assets/macbook-cover.png", "/assets/macbook-keyboard.png"],
  "createdAt": "2026-10-15T00:45:00Z",
  "status": "collecting_offers"
}
```

---

## 5. Başarı ve Tamamlanma Kriteri (Definition of Done)
1. Fotoğraf 4'teki 3 ekranın tüm form elemanları (dropdownlar, pill toggle'lar, karakter sayacı, segment butonlar) eksiksiz çalışmalı.
2. Adımlar arası ileri/geri geçişlerde girilen veriler kaybolmamalı (`localStorage` senkronizasyonu).
3. Son adım onaylandığında otomatik olarak Plan 3 (Teklif Radarı) ekranına yönlendirmeli.
