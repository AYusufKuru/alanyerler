# MASTER ROADMAP: Alan Yerler Web Uygulaması (Master Proje Yönetim Dosyası)

Bu doküman, mobil uygulamanın **birebir tüm yeteneklerini tarayıcıya taşıyan**, uygulama indirmek istemeyen kullanıcılara kesintisiz bir deneyim sunan ve gelecekte mobil uygulama ile stabil entegre olacak **Alan Yerler Web Platformu**'nun 5 aşamalı uygulama planını ve durumunu takip eder.

---

## 🎯 Proje Vizyonu
* **Amaç:** Basit bir tanıtım sayfası değil; kullanıcının cihazını adım adım ekleyip ilan oluşturabildiği, onaylı işletmelerden gerçek zamanlı teklifler toplayabildiği, pazarlık ve teklif kabulü yapabileceği, anlık mesajlaşabileceği ve mağaza profillerini inceleyebileceği **uçtan uca çalışan bir Pazar Yeri Web Uygulaması**.
* **Tasarım Standartları:** Sıradan yapay zeka veya hazır şablon hissiyatından uzak; Apple / Swappie / Revolut standardında modern tipografi, yumuşak gölgeler, glassmorphism cam efektleri, mikro animasyonlar ve yüksek dönüşümlü UX.
* **Teknik Çatı:** Modüler, yüksek performanslı, bağımlılıksız (zero-bloat) web mimarisi, kalıcı yerel durum yönetimi (Local Persistence / State Management), PWA desteği ve mobil API'lara hazır JSON veri modelleri.

---

## 🗺️ 5 Detaylı Plan Dosyası ve Durum Tablosu

| # | Plan Dosyası | Kaynak Görsel | Odak Noktası | Durum |
|---|---|---|---|---|
| **1** | [PLAN-1_ANASAYFA_PLATFORM_HUB.md](file:///c:/Users/dell/Desktop/alan%20yerlerwebsite/plans/PLAN-1_ANASAYFA_PLATFORM_HUB.md) | **Fotoğraf 3** | Ana Platform Portalı, Lüks Header & Nav, Hero & Canlı Teklif Rozeti, 7 Kategori Izgarası, "Nasıl Çalışır?" 4 Adımlı Akış, Güvenlik Bandı | ✅ Tamamlandı |
| **2** | [PLAN-2_CIHAZ_SATIS_SIHIRBAZI.md](file:///c:/Users/dell/Desktop/alan%20yerlerwebsite/plans/PLAN-2_CIHAZ_SATIS_SIHIRBAZI.md) | **Fotoğraf 4** | 4 Kademeli Satış Sihirbazı (Cihaz Türü ➔ Dinamik Donanım Seçici ➔ Sağlık & Kozmetik Durumu ➔ Fotoğraf Yükleme & Özet) | ✅ Tamamlandı |
| **3** | [PLAN-3_TEKLIF_RADARI_VE_GELEN_TEKLIFLER.md](file:///c:/Users/dell/Desktop/alan%20yerlerwebsite/plans/PLAN-3_TEKLIF_RADARI_VE_GELEN_TEKLIFLER.md) | **Fotoğraf 2** | Canlı Dağıtım Radarı, Canlı Durum Zaman Çizelgesi, "Gelen Teklifler" Karşılaştırma Listesi, Teklif Detay Kartı ve Güvenlik Rehberi | ✅ Tamamlandı |
| **4** | [PLAN-4_MESAJLASMA_VE_ISLETME_PROFILI.md](file:///c:/Users/dell/Desktop/alan%20yerlerwebsite/plans/PLAN-4_MESAJLASMA_VE_ISLETME_PROFILI.md) | **Fotoğraf 1** | Gelen Kutusu (Filtreli), Canlı Chat Arayüzü, Gömülü "42.500 TL Teklifi Kabul Et" Sözleşme Kartı, Mağaza Lokasyonu, Detaylı İşletme Profili | ✅ Tamamlandı |
| **5** | [PLAN-5_ONBOARDING_GUVEN_VE_MOBIL_ENTEGRASYON.md](file:///c:/Users/dell/Desktop/alan%20yerlerwebsite/plans/PLAN-5_ONBOARDING_GUVEN_VE_MOBIL_ENTEGRASYON.md) | **Fotoğraf 5** | İnteraktif Değer & Güven Vitrini (Onboarding), 5 Modül Arası Veri Köprüsü, Mobil Entegrasyon Katmanı, PWA & Responsive Testler | ✅ Tamamlandı |

---

## ⚙️ İlerleme Kuralı
1. Her plan kendi dosyasında en ince piksel, etkileşim, form alanı ve veri yapısına kadar belgelenmiştir.
2. Bir plan tamamlanıp kullanıcı tarafından onaylanmadan bir sonraki plana geçilmeyecektir.
3. Her adım bittiğinde bu belgedeki durum güncellenecek ve unutma veya kapsam kaybı kesinlikle yaşanmayacaktır.

---

## 🚀 Uçtan Uca Baştan Sona Çalışan Deneyim Akışı
1. **Ana Sayfa Portalı (Plan 1 - Fotoğraf 3):** Ticker, Hero değerleme hesaplayıcı, 7 lüks kategori, "Nasıl Çalışır?" akışı, Fotoğraf 5 temelli Onboarding slider ve onaylı mağazalar dizini.
2. **Cihaz Satış Sihirbazı (Plan 2 - Fotoğraf 4):** 4 adımlı form; Kategori ➔ Dinamik Özellikler ➔ Sağlık/Kozmetik/Aksesuarlar ➔ Fotoğraf Yükleme & Hızlı Test Doldurucu. Veriler kalıcı olarak `localStorage: alan_yerler_devices` içine kaydedilir.
3. **Teklif Radarı & Gelen Teklifler (Plan 3 - Fotoğraf 2):** 3 dalga halkalı animasyon, 4 uydu mağaza, dönen spinner kontrol listesi, 5 kurumsal işletmeden canlı fiyat teklifleri (TechStore 42.500 TL), sıralama dropdown'ı ve vitrinli teklif detay sayfası.
4. **Canlı Mesajlaşma & Sözleşme (Plan 4 - Fotoğraf 1):** Tümü/Teklifler/Favoriler filtreli gelen kutusu, arama motoru, sabit cihaz önizleme barı, **Gömülü "42.500 TL Teklifi Kabul Et" sözleşme kartı** (kabul edildi durumuna geçer), Kadıköy harita konumu ve dinamik mağaza yanıt simülasyonu.
5. **Kullanıcı Profili & İlanlarım (Plan 5 - Fotoğraf 5 & Entegrasyon):** Aktif ilanların listelendiği, en yüksek tekliflerin takip edilebildiği, mağazaların favoriye eklendiği ve PWA desteği olan kullanıcı yönetim merkezi.
6. **Cihaz Kataloğu & Kapsam Genişletme:** 8 ana kategori (Laptop, Masaüstü PC, MacBook, Mac Masaüstü, Telefon, Tablet/iPad, Oyun Konsolu, Ekran Kartı, Akıllı Saat, Premium Kulaklık) için derin teknik özellik matrisi, Hero değerleme hesaplayıcısında canlı kondisyon (Sıfır Gibi / Çok İyi / İyi) çarpanları, kategoriye özel dinamik fotoğraf yükleme kılavuzları ve 24 eksik CSS sınıfının tam styling çözümü.

---

## 📊 Güncel Sağlık & Doğrulama Durumu
* **Build:** `npm run build` ➔ 0 Hata (Vite 6, 1617 modül, dist bundle hazır).
* **Dev Server:** `http://localhost:3000/` ➔ Canlı (HTTP/1.1 200 OK).
* **CSS Denetimi:** 24 adet eksik sınıf tamamlandı, mobil alt tabbar güvenli padding (`padding-bottom: 96px`) uygulandı, form butonları ve segmentli seçimler standardize edildi.

