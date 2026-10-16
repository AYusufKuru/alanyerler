# PLAN 4: Canlı Mesajlaşma Merkezi, Teklif Sözleşmesi & İşletme Profili
**Kaynak Arayüz:** Fotoğraf 1 (Mesajlar Gelen Kutusu, Chat Ekranı & Teklif Kartı, İşletme Profili)  
**Hedef:** Kullanıcı ile teklif veren işletmeler arasında güvenli, şeffaf, teklif onaylama butonlu ve konum bilgisi içeren gerçek zamanlı mesajlaşma altyapısı ile kapsamlı onaylı işletme profili sayfası.

---

## 1. Genel Bakış ve Deneyim Mimarisi
Pazar yerinde en kritik aşama fiyatta el sıkışma ve teslimattır. Bu modül 3 temel bileşenden oluşur:
1. **Mesajlar Gelen Kutusu (Inbox):** İşletmelerden gelen mesajların filtrelenebildiği ve okunmamış bildirimlerin görüldüğü merkez.
2. **Canlı Sohbet (Chat) & İnteraktif Teklif Kartı:** Mağaza ile anlık yazışma, cihaz özet barı, teklif kabul butonu ve konum paylaşımı.
3. **Kapsamlı İşletme Profili (Store Profile):** Mağazanın vitrin fotoğrafı, rozetleri, harita konumu, çalışma saatleri ve değerlendirmeleri.

---

## 2. Ekran A: Mesajlar Gelen Kutusu (Inbox Hub)
*(Fotoğraf 1 - Sol Ekran)*

* **Üst Başlık:** `Mesajlar`
* **Sağ Üst Arama İkonu:** `🔍` (Mağaza veya cihaz adına göre anında filtreleme).
* **Filtre Sekmeleri (Pills):**
  * `[ Tümü (4) ]` (Aktif: Mavi zemin veya mavi alt çizgi)
  * `[ Tekliflerim (4) ]`
  * `[ Favoriler (2) ]`
* **Mesaj Öğeleri Listesi (Birebir Fotoğraftaki Gibi):**
  1. **TechStore** (Mavi Onay Tiki `✓`)
     * Son Mesaj: *"Merhaba, cihazınız için 42.500 TL teklifimizi iletebilirim. İsterseniz..."*
     * Zaman: `14:32`
     * Okunmamış Rozeti: `(2)` (Mavi yuvarlak rozet)
     * Profil Avatarı: Siyah zemin üzerine TECH yazısı.
  2. **Giga Bilişim**
     * Son Mesaj: *"Cihazın durumu çok iyi görünüyor. 41.000 TL teklifimiz geçerlidir."*
     * Zaman: `13:15`
     * Okunmamış Rozeti: `(1)` (Kırmızı yuvarlak rozet)
     * Avatar: Mavi GIGA.
  3. **Nova Teknoloji**
     * Son Mesaj: *"Merhaba, 39.750 TL teklif sunabiliyoruz. Detayları konuşabiliriz."*
     * Zaman: `12:48`
     * Sağ Simge: Satılan MacBook Pro küçük görseli.
  4. **Plus Elektronik**
     * Son Mesaj: *"Teklifimiz 38.500 TL'dir. İletişim bilgilerinizi paylaşabilir misiniz?"*
     * Zaman: `11:03`
     * Sağ Simge: MacBook görseli.
  5. **Metro Bilişim**
     * Son Mesaj: *"Cihazınızla ilgileniyoruz. 37.000 TL teklifimiz geçerlidir."*
     * Zaman: `10:21`
  6. **DataBilgisayar**
     * Son Mesaj: *"Merhaba, cihazın faturası var mı? Varsa 39.000 TL teklif sunabiliriz."*
     * Zaman: `Dün`
  7. **SmartTech**
     * Son Mesaj: *"Cihazla ilgili birkaç sorumuz var."*
     * Zaman: `Dün`

---

## 3. Ekran B: Canlı Sohbet (Interactive Chat Workspace)
*(Fotoğraf 1 - Orta Ekran)*

* **Üst Başlık Barı:**
  * `← Geri` butonu.
  * Mağaza Avatarı ve İsmi: `TechStore ✓`
  * Durum: `🟢 Çevrimiçi` (Yeşil nokta ile parıldayan metin).
  * Sağ Eylemler: Telefon ikonu `📞`, Menü ikonu `•••`.
* **Sabit Cihaz Önizleme Kartı (Pinned Item Bar):**
  * Sol: MacBook Pro 14" (2023) küçük fotoğrafı.
  * Orta: `MacBook Pro 14" (2023)` - `M2 Pro • 16 GB • 512 GB`
  * Sağ: Sağ Ok `➔` (Tıklandığında cihaz ilan kartını açar).
* **Mesaj Akışı & Baloncukları:**
  * **İşletme Balonu (Gri):**
    *"Merhaba, cihazınız için 42.500 TL teklifimizi iletebilirim. İsterseniz detayları konuşalım."* (Saat: `14:32`)
  * **Zengin İnteraktif Teklif Kartı (Rich Proposal Card):**
    * Üst Başlık: Yeşil etiket ikonu, `Teklif Fiyatı: 42.500 TL`
    * Sağ Buton: `Teklifi Kabul Et ➔` (Mavi parlak buton). Tıklandığında teklif onay modalı açılır, teklif durumu "Kabul Edildi"ye döner.
    * **Teklif Detayları Listesi:**
      * `🛡️ Geçerlilik Süresi:` 3 gün
      * `💳 Ödeme Şekli:` Nakit / Havale
      * `🚚 Teslimat:` Mağaza / Adresinizden
      * `📋 Ek Bilgi:` Cihaz kontrolü sonrası nihai fiyat belirlenir.
  * **Kullanıcı Balonu (Mavi, Sağda):**
    *"Merhaba, teklifiniz için teşekkür ederim. Cihazı ne zaman teslim edebilirim?"* (Saat: `14:35`, `✓✓ Mavi Çift Tik`)
  * **İşletme Cevap Balonu (Gri):**
    *"Bugün veya yarın mağazamıza getirebilirsiniz. Konumumuz aşağıdadır."* (Saat: `14:36`)
  * **İşletme Konum Kartı (Location Bubble):**
    * Mavi harita pini ikonu: `📍 TechStore - Kadıköy`
    * Adres: `Bağdat Cad. No:123, Kadıköy / İstanbul ➔`
* **Alt Mesaj Giriş Barı:**
  * Ataş / Dosya ikonu `📎` (Fotoğraf veya belge göndermek için).
  * Mesaj Alanı: Input/Textarea `Mesajınızı yazın...`
  * Gönder Butonu: Mavi dairesel ok ikonu `➤`.
  * **Gerçekçi Simülasyon:** Kullanıcı mesaj yazdığında mağaza 1-2 saniye sonra gerçekçi şekilde "yazıyor..." durumuna geçer ve otomatik cevap üretir.

---

## 4. Ekran C: Kapsamlı İşletme Profili (Store Profile Page)
*(Fotoğraf 1 - Sağ Ekran)*

* **Üst Bar:** `← Geri` | Başlık: `İşletme Profili`
* **Vitrin ve Logo Bölümü:**
  * Geniş vitrin fotoğrafı (Modern Kadıköy teknoloji mağazası vitrini).
  * Mağaza Logo Rozeti: Siyah zemin üzerine beyaz TECH + mavi onaylı işletme tiki `✓`.
* **Mağaza Başlığı & Değerlendirme:**
  * İsim: `TechStore`
  * Puan: `⭐ 4.9 (320 değerlendirme)`
  * Konum & Mesafe: `📍 İstanbul • 2.3 km`
  * Sağ Eylem: `❤️ Takip Et` butonu.
* **Güven ve Sertifika Rozetleri (Badges):**
  * `[ 🛡️ Güvenilir İşletme ]`
  * `[ ⚡ Hızlı Dönüş ]`
  * `[ 🏪 Yerinde Satış ]`
  * `[ 🏢 Kurumsal ]`
* **Hakkında Bölümü:**
  * Başlık: `Hakkında ➔`
  * Metin: *"10+ yıllık deneyimimizle laptop, bilgisayar, telefon ve oyun konsolu alım-satımı yapıyoruz. Tüm cihazlar için hızlı ve güvenilir teklif sunuyoruz."*
* **Konum & Harita:**
  * Başlık: `Konum` | Sağ: `Haritada Gör ➔`
  * İnteraktif mini harita önizlemesi (Kadıköy Bağdat Caddesi üzerinde kırmızı pin).
  * Adres Metni: `📍 Bağdat Cad. No:123, Kadıköy / İstanbul` | `↗ Yol Tarifi Al`
* **Çalışma Saatleri:**
  * Saat ikonu `🕒 Çalışma Saatleri`
  * `Pazartesi - Cumartesi:` `09:00 - 20:00`
  * `Pazar:` `10:00 - 18:00`
* **Sabit Alt Aksiyon Butonu:**
  * `💬 Mesaj Gönder` (Geniş mavi buton, tıklandığında anında chat'i açar).

---

## 5. Başarı ve Tamamlanma Kriteri (Definition of Done)
1. Fotoğraf 1'deki Mesajlar gelen kutusu, Chat ekranı ve İşletme Profili ekranları birebir çalışır durumda kodlanmalı.
2. Chat içerisindeki **"Teklifi Kabul Et"** butonu tıklandığında teklif kabul onay penceresi açılmalı ve durum güncellenmeli.
3. Mesaj yazıp gönderme mekanizması çalışmalı, simüle edilmiş mağaza yanıtı gelebilmeli.
4. İşletme profilindeki adres, çalışma saatleri, harita ve rozetler eksiksiz görüntülenmeli.
