export const accountPages = {
  help: {
    title: 'Yardım / Destek',
    body: [
      'İlan, teklif ve mesaj kayıtların hesabına bağlıdır.',
      'Bir mağazayla cihazın durumu hakkında konuşmak için teklif ekranındaki mesajı kullan.',
      'Hesabını silmek profildeki Hesabımı sil adımındadır. Silinen ilan, fotoğraf, mesaj ve bildirim geri gelmez.',
      'Ayrı bir destek telefonu tanımlı değil. Hesabındaki e-posta adresi iletişim kaydıdır.',
    ],
  },
  faq: {
    title: 'Sıkça Sorulan Sorular',
    body: [
      'Ön teklif, cihaz bilgilerin doğruysa geçerli olan fiyattır. Kesin teklif, mağazanın bağladığı fiyattır.',
      'Teklif toplama süresi ilanın açılışından itibaren 1 saattir. Süre dolunca yeni teklif girilmez. Gelen teklif kabul edilebilir.',
      'Teklifi kabul etmek o ilanı seçilen mağazaya bağlar. Aynı ilanda ikinci bir teklif kabul edilmez.',
      'Telefon numarası kaydedilebilir. SMS ile doğrulama henüz açık değildir, bu yüzden numara doğrulanmış görünmez.',
      'Mağaza takibi ve mağaza puanı yazma hesaba bağlı değildir. Bu listeler boş kalır.',
    ],
  },
  privacy: {
    title: 'Gizlilik Politikası',
    body: [
      'Alan Yerler; ad, e-posta, şifre özeti, verdiğin telefon numarası, ilan bilgileri, fotoğraflar, mağazalarla mesajlar, bildirimler ve cihaz bildirim anahtarını saklar.',
      'Telefon numarası, sen kaydedene kadar boştur. SMS doğrulaması yapılmadığı için numara doğrulanmış sayılmaz.',
      'Teklif bildirimlerini profildeki bildirim ayarından kapatabilirsin. Kapalıyken yeni teklif kaydı durur, bildirim yazılmaz.',
      'Hesabını sildiğinde ilanların, fotoğrafların, mesajların, bildirimlerin ve cihaz anahtarın silinir. Şifre özeti de silinir.',
      'Bu metin mağaza incelemesi için uygulamanın işlediği veriyi anlatır. Ayrı bir şirket adresi veya vergi numarası bu kayıtta yoktur.',
    ],
  },
  terms: {
    title: 'Kullanım Koşulları',
    body: [
      'Hesap sana aittir. İlanı sen oluşturursun, teklifi mağaza verir.',
      'Ön teklif, ilandaki bilgilerin doğru olmasına bağlıdır. Mağaza cihazı gördükten sonra uyuşmazlık nedeniyle fiyatı değiştirebilir. Gerekçesiz düşüş mağaza puanını etkiler.',
      'Kabul edilen teklif, o ilan için seçilen fiyattır. Ödeme ve teslim koşulları teklif ekranında yazar: elden teslim, mağazada kontrol, ödeme aynı gün.',
      'Başka birinin cihazını veya sana ait olmayan fotoğrafları yüklemek hesabın kapatılmasına yol açabilir.',
      'Hesabı dilediğin zaman silebilirsin. Silme işlemi geri alınmaz.',
    ],
  },
  kvkk: {
    title: 'KVKK',
    body: [
      'Kişisel verilerin, cihazını satmak üzere ilan açman, teklif alman ve mağazayla yazışman için işlenir.',
      'İşlenen veriler: kimlik ve iletişim (ad, e-posta, varsa telefon), ilan içeriği, fotoğraflar, mesajlar ve bildirim tercihleri.',
      'Veriler hesabın durduğu sürece saklanır. Hesabını silmenle birlikte silinir.',
      'Bilgilerini profilinden düzeltebilir, bildirimleri kapatabilir ve hesabını silebilirsin.',
      'Başvuru için hesabındaki e-posta adresi kullanılır. Ayrı bir veri sorumlusu sicil numarası bu uygulamada kayıtlı değildir.',
    ],
  },
} as const;

export type AccountPageKey = keyof typeof accountPages;
