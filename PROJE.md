# Alan Yerler — Proje Tanımı

Bu dosya uygulamanın kaynak tanımıdır. Geliştirme buradaki kurallara göre yapılır. Arayüz referansı `ai_support` klasöründeki görsellerdir.

## 1. Ürün

Müşteri cihazını satmak için ilan açar. Gerçek mağazalar fiyatı Alan Yerler’e bildirir. Yönetici, mağazayı ve mağazanın söylediği fiyatı panele işler. Müşteri yalnızca işlenmiş gerçek teklifleri görür ve mesajlaşarak satışı kendisi yürütür.

Mağaza uygulaması yoktur. Mağaza fiyatı telefon, mesaj veya benzeri yolla işletmeye bildirir. Kayıt ve fiyat girişi panelden yapılır.

## 2. Teknoloji

| Katman | Seçim |
| --- | --- |
| Mobil (App Store + Play Store) | Flutter |
| Yönetim paneli | Web, React (Vite) |
| API | NestJS |
| Veritabanı | PostgreSQL |
| Sunucu | Ubuntu Linux |
| Dosyalar | Sunucuda `uploads/` dizini |
| Bildirim | Firebase Cloud Messaging |

Mobil arayüz her iki mağazada aynı çizilir. Panel ayrı bir web uygulamasıdır ve aynı API’yi kullanır.

## 3. Roller

- **Müşteri:** Uygulamadan kayıt olur, ilan açar, teklifleri görür, mağazayla yazışır.
- **Yönetici:** Panele girer. Mağaza ekler, ilana teklif işler, mağaza konuşmasına cevap yazar, kullanıcı oluşturur.
- **Mağaza:** Sistemde kendi girişi yoktur. Paneldeki mağaza kaydı, işletmeye bilgi vermiş gerçek bir mağazadır.

## 4. Teklif kuralı

1. Panelde mağaza kaydı açılır: ticari ad, logo, kapak, şehir, adres, hakkımızda, çalışma saatleri, rozetler. Puan ve değerlendirme sayısı yalnız mağaza bildirmişse ve yönetici girmişse yazılır. Boşsa ekranda sayı gösterilmez.
2. Bir ilana teklif eklenirken mağaza seçilir ve tutar, mağazanın bildirdiği fiyat olarak yazılır.
3. Listede yalnız o ilana işlenmiş teklifler görünür. Sıra, fiyatın yüksekten düşüğe halidir. En yüksek tutarın kartında “En Yüksek Teklif” rozeti durur.
4. Aynı ilana aynı mağazanın ikinci bir açık teklifi olmaz. Mağaza yeni fiyat bildirirse mevcut teklif güncellenir.
5. Teklif, yönetici panelden kaldırana kadar durur. Otomatik süre dolumu yoktur.
6. Hiç teklif yokken müşteri bekleme ekranında kalır. Liste, ilk gerçek teklif düşünce açılır.
7. Konum alınmaz. Kilometre yazılmaz. Mağaza kartında paneldeki şehir ve adres görünür.
8. Sistem firma seçmez, fiyat üretmez, fiyat düşürmez ve listeyi sahte kayıtla doldurmaz.

## 5. Müşteri uygulaması

Alt menü: **Anasayfa**, **Teklifler**, **Cihaz Sat**, **Mesajlar**, **Profil**.

Görsel eşlemesi:

| Ekran | Görsel |
| --- | --- |
| Açılış tanıtımı (4 sayfa) | `ai_support/5.jpeg` |
| Anasayfa | `ai_support/3.jpeg` |
| Cihaz türü, özellikler, durum | `ai_support/4.jpeg` |
| İlan gönderildi / teklif listesi / teklif detayı | `ai_support/1.jpeg` |
| Mesajlar, sohbet, mağaza profili | `ai_support/2.jpeg` |

### 5.1 Açılış ve hesap

İlk kurulumda 4 tanıtım sayfası bir kez gösterilir. Son sayfadaki **Hemen Başla** kayıt/girişe gider. Geç ile de atlanır.

Üyelik e-posta ve şifredir. Kayıt alanları: ad soyad, e-posta, şifre. Şifre en az 8 karakterdir. Giriş aynı e-posta ve şifreyle yapılır. Çıkış profil ekranındadır.

Yönetici panelden de müşteri hesabı açıp şifre atayabilir. Bu hesap aynı uygulamadan girer.

### 5.2 Anasayfa

Üstte Alan Yerler, bildirim zili ve profil kısayolu vardır. Karşılama kartındaki **Hemen Başla** satış sihirbazını açar.

Kategoriler:

- Telefon
- Bilgisayar / Laptop
- Oyun Konsolu
- Ekran Kartı
- Tablet
- Akıllı Saat
- Kulaklık

Kategori seçimi de sihirbazı, o kategori seçili halde açar. “Nasıl çalışır?” dört adımı anlatır: cihazı ekle, fotoğraf yükle, teklifleri gör, mesajlaş. Üstteki teklif sayacı, müşterinin teklif almış ilanlarının sayısıdır.

### 5.3 Satış sihirbazı

Dört adım: **Cihaz Türü → Özellikler → Durum → Fotoğraflar**. İptal, taslağı siler ve anasayfaya döner. Geri, bir önceki adıma döner.

**Cihaz türü.** Seçilen kategorinin alt türleri listelenir. Laptop kategorisinde görseldeki gibi Laptop, Masaüstü, MacBook, Mac Masaüstü ayrılır. Diğer kategorilerde marka aileleri (örneğin Telefon için iPhone ve Android telefon) listelenir. Seçilmeden devam edilmez.

**Özellikler.** Alanlar türe göredir. Zorunlular yıldızlıdır. Laptop için görseldeki alanlar geçerlidir: marka, seri, model, işlemci, ekran kartı, RAM, depolama, ekran boyutu. Diğer türlerin alanları:

| Tür | Alanlar |
| --- | --- |
| Telefon | Marka, model, depolama, renk, pil sağlığı |
| Masaüstü | Marka, model, işlemci, ekran kartı, RAM, depolama |
| Oyun konsolu | Marka, model, depolama, kol adedi |
| Ekran kartı | Marka, model, bellek |
| Tablet | Marka, model, depolama, bağlantı (Wi‑Fi / hücresel) |
| Akıllı saat | Marka, model, kasa ölçüsü |
| Kulaklık | Marka, model, bağlantı (kablolu / kablosuz) |

Seçenek listeleri ilk sürümde sabittir. Listede olmayan değer için “Diğer” ve kısa metin vardır.

**Durum.** Görseldeki alanlar, türe uyanları gösterilir:

- Pil sağlığı (telefon, tablet, saat, laptop)
- Depolama sağlığı (SSD’li cihazlar)
- Kutu / fatura: Var, Yok
- Kalan garanti: Yok, 0–6 ay, 6–12 ay, 12 aydan fazla
- Kozmetik: Sıfır gibi, İyi, Orta, Kötü
- Adaptör veya şarj: Orijinal, Muadil, Yok (türe göre)
- Çalışma durumu: Sorunsuz çalışıyor, Bazı sorunlar var, Çalışmıyor
- Ek bilgi, isteğe bağlı, en fazla 200 karakter

**Fotoğraflar.** Zorunlu. En az 2, en fazla 5 fotoğraf. Kameradan veya galeriden eklenir. Sayı tutmazsa gönderilmez.

Gönderimden sonra ilan durumu `bekliyor` olur ve “Cihazınız işletmelere gönderildi” ekranı açılır. Adımlar: cihaz bilgileri gönderildi, uygun işletmelerle paylaşıldı, teklifler toplanıyor, teklifler listeleniyor. İlk ikisi gönderimde tamamlanır. Üçüncüsü, teklif yokken sürer. Dördüncüsü, en az bir teklif işlenince tamamlanır. Bu ekrandan çıkılınca ilan **Teklifler** sekmesinde durur.

### 5.4 Teklifler

Müşterinin bütün ilanları bu sekmededir. Bir ilana girilince cihaz özeti ve o ilanın teklifleri görünür. Kartta mağaza adı, şehir, varsa puan, fiyat, saat ve **Detayları Gör** vardır.

Teklif detayında mağaza özeti, fiyat, ilan özellikleri ve **İletişime Geç** vardır. Bu düğme o mağazayla, bu ilana bağlı konuşmayı açar. Uygulama içi kabul, ödeme, randevu ve teslim adımı yoktur. Satış mesajda konuşulur.

Mağaza profilinde kapak, logo, ad, şehir, adres, hakkında, rozetler, çalışma saatleri ve **Mesaj Gönder** vardır. Harita karesi, adres metnini gösterir; kullanıcı konumu istenmez. Takip etme yoktur.

### 5.5 Mesajlar

Sekmeler: **Tümü**, **Tekliflerim**, **Favoriler**. Favori, konuşmayı yıldızlamaktır. Arama, mağaza adına göredir.

Konuşma bir ilan ve bir mağazaya bağlıdır. Müşteri yazar. Cevap panelden, aynı konuşmaya düşer. Müşteri ekranında gönderen, teklifi veren mağazadır; cevap metnini yönetici, mağazanın işletmeye bildirdiği bilgiye göre yazar.

Liste satırında son mesaj, saat ve okunmamış sayısı görünür. Yeni teklif düşünce uygulama içi bildirim ve push gider. İzin reddedilirse akış bildirim olmadan da çalışır.

### 5.6 Profil

Ad, e-posta, şifre değiştirme ve çıkış. Müşteri kendi ilanını, teklif gelmeden önce silebilir. Teklif geldikten sonra ilanı yalnız yönetici kapatır.

## 6. Yönetim paneli

Web panel. Yönetici e-posta ve şifreyle girer. İlk yönetici hesabı kurulumda veritabanına yazılır.

Menü:

1. **İlanlar.** Gelen ilanlar, müşteri, kategori, durum, fotoğraflar, özellikler. Durumlar: `bekliyor`, `teklif_var`, `kapatıldı`.
2. **Teklif işleme.** İlan seçilir, kayıtlı mağaza seçilir, mağazanın bildirdiği tutar yazılır. İsteğe bağlı kısa not (ödendi biçimi, teslim gibi) yalnız panelde durur, müşteriye “uydurma ikinci fiyat” olarak yansımaz. Teklif silinince listeden kalkar ve loga yazılır.
3. **Mağazalar.** Ekle, düzenle, pasife al. Pasif mağaza yeni teklife seçilemez. Eski teklifleri, teklif silinmedikçe durur.
4. **Mesajlar.** Konuşmalar mağaza ve ilan başlığıyla listelenir. Yönetici cevap yazar. Cevap, seçili mağazanın konuşmasına gider.
5. **Kullanıcılar.** Müşteri veya yönetici hesabı açılır, şifre atanır, hesap pasife alınır. Pasif hesap giriş yapamaz.
6. **Log.** Kim, ne zaman, hangi kayda ne yaptı. En az şunlar yazılır: giriş, kullanıcı oluşturma, şifre atama, mağaza ekleme/düzenleme/pasif, teklif ekleme/güncelleme/silme, ilan kapatma, panelden mesaj gönderme.

Panelde fiyat öneren, firma karıştıran veya eksik teklif tamamlayan bir araç yoktur.

## 7. Veri modeli

- **users:** id, name, email, password_hash, role (`customer` | `admin`), active, created_at
- **categories:** id, name, slug
- **device_types:** id, category_id, name
- **listings:** id, user_id, category_id, device_type_id, title, specs (json), condition (json), status, created_at
- **listing_photos:** id, listing_id, path, sort_order
- **stores:** id, name, logo, cover, city, address, about, hours (json), badges (json), rating (nullable), review_count (nullable), active, created_at
- **offers:** id, listing_id, store_id, price, currency (`TRY`), note, created_by, created_at, updated_at
- **conversations:** id, listing_id, store_id, customer_id, created_at
- **messages:** id, conversation_id, sender_role (`customer` | `admin`), sender_id, body, created_at, read_at
- **favorites:** user_id, conversation_id
- **device_tokens:** user_id, token, platform
- **audit_logs:** id, actor_id, action, entity, entity_id, metadata (json), created_at

`offers` üzerinde `(listing_id, store_id)` benzersizdir. Fiyat sıfırdan büyük bir TL tutarıdır. Fotoğraf sayısı 2 ile 5 arasındadır.

## 8. Ana akışlar

**İlan.** Müşteri dört adımı doldurur, 2–5 fotoğraf yükler, ilan `bekliyor` olur.

**Teklif.** Yönetici ilanı açar, mağazayı seçer, bildirilen fiyatı kaydeder. İlan `teklif_var` olur. Müşteriye push gider. Liste fiyata göre dizilir.

**Mesaj.** Müşteri tekliften veya mağaza profilinden konuşma açar. Yönetici panelden cevaplar. Konuşma, ilan kapatılsa da okunur kalır; yeni mesaj yalnız ilan açıksa gider.

**Kapanış.** Ödeme ve teslim uygulamada yoktur. Yönetici satış bittiyse ilanı kapatır. Kapalı ilana yeni teklif eklenmez.

## 9. API özeti

Kimlik: `POST /auth/register`, `POST /auth/login`, `POST /auth/change-password`. Cevapta access token vardır.

Müşteri: kategoriler, ilan oluşturma, fotoğraf yükleme, kendi ilanları, ilanın teklifleri, mağaza profili, konuşmalar, mesaj gönderme, favori, bildirim jetonu.

Yönetici rotaları `admin` rolü ister: ilan listesi, mağaza CRUD, teklif CRUD, konuşmalar, cevap, kullanıcı oluşturma ve şifre atama, kullanıcıyı pasife alma, log listesi.

Herkese açık yazma yoktur. Müşteri yalnız kendi ilanını, kendi konuşmasını ve kendisine verilmiş teklifi okur.

## 10. Sunucu

Ubuntu üzerinde PostgreSQL, API ve panel aynı makinededir. Yüklenen fotoğraflar `uploads/` altındadır ve API üzerinden sunulur. Alan adı, port ve bağlantı bilgisi kurulum sırasında `.env` dosyasına yazılır. Bu dosya repoya konmaz.

Ortam değişkenleri: `DATABASE_URL`, `JWT_SECRET`, `UPLOAD_DIR`, `PORT`, Firebase servis hesabı yolu.

## 11. Bu sürümde yok

- Mağaza kendi hesabıyla giriş ve kendi fiyatını yazma
- Uygulama içi ödeme, komisyon, teklif kabul, kargo, randevu
- Kullanıcı konumu ve mesafe
- Otomatik fiyat, otomatik mağaza seçimi, eksik listeyi tamamlayan kayıt
- Sosyal giriş
- Canlı harita

## 12. Ekranda kasıtlı farklar

Görsellerdeki kilometre, “3 gün geçerlilik”, “Teklifi Kabul Et” ve sabit beş firma bu sürümde uygulanmaz. Mesafe yoktur. Teklif, silinene kadar durur. Satış düğmesi mesajlaşmadır. Listede kaç gerçek teklif varsa o kadar kart vardır.
