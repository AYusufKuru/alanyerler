class StoreCard {
  const StoreCard({
    required this.id,
    required this.name,
    required this.city,
    this.logo,
    this.cover,
    this.badges = const [],
    this.rating,
    this.reviewCount,
  });

  final String id;
  final String name;
  final String city;
  final String? logo;
  final String? cover;
  final List<String> badges;
  final double? rating;
  final int? reviewCount;

  factory StoreCard.fromJson(Map<String, dynamic> json) {
    final badges = json['badges'];
    return StoreCard(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      city: json['city'] as String? ?? '',
      logo: json['logo'] as String?,
      cover: json['cover'] as String?,
      badges: badges is List ? badges.whereType<String>().toList() : const [],
      rating: _double(json['rating']),
      reviewCount: json['reviewCount'] is int ? json['reviewCount'] as int : null,
    );
  }
}

class CustomerOffer {
  const CustomerOffer({
    required this.id,
    required this.price,
    required this.currency,
    required this.createdAt,
    required this.updatedAt,
    required this.store,
  });

  final String id;
  final double price;
  final String currency;
  final DateTime createdAt;
  final DateTime updatedAt;
  final StoreCard store;

  factory CustomerOffer.fromJson(Map<String, dynamic> json) {
    final store = json['store'];
    return CustomerOffer(
      id: json['id'] as String? ?? '',
      price: _double(json['price']) ?? 0,
      currency: json['currency'] as String? ?? 'TRY',
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(json['updatedAt'] as String? ?? '') ?? DateTime.now(),
      store: store is Map ? StoreCard.fromJson(Map<String, dynamic>.from(store)) : const StoreCard(id: '', name: '', city: ''),
    );
  }
}

class ListingDetail {
  const ListingDetail({
    required this.id,
    required this.title,
    required this.status,
    required this.specs,
    required this.condition,
    required this.photos,
    required this.offerCount,
  });

  final String id;
  final String title;
  final String status;
  final Map<String, String> specs;
  final Map<String, String> condition;
  final List<String> photos;
  final int offerCount;

  factory ListingDetail.fromJson(Map<String, dynamic> json) {
    final photos = json['photos'];
    return ListingDetail(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      status: json['status'] as String? ?? '',
      specs: _stringMap(json['specs']),
      condition: _stringMap(json['condition']),
      photos: photos is List
          ? photos
              .whereType<Map>()
              .map((item) => item['path'])
              .whereType<String>()
              .toList()
          : const [],
      offerCount: json['offerCount'] is int ? json['offerCount'] as int : 0,
    );
  }
}

class StoreProfile {
  const StoreProfile({
    required this.id,
    required this.name,
    required this.city,
    required this.address,
    required this.about,
    required this.hours,
    required this.badges,
    this.logo,
    this.cover,
    this.rating,
    this.reviewCount,
  });

  final String id;
  final String name;
  final String city;
  final String address;
  final String about;
  final List<String> hours;
  final List<String> badges;
  final String? logo;
  final String? cover;
  final double? rating;
  final int? reviewCount;

  factory StoreProfile.fromJson(Map<String, dynamic> json) {
    return StoreProfile(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      city: json['city'] as String? ?? '',
      address: json['address'] as String? ?? '',
      about: json['about'] as String? ?? '',
      hours: _stringList(json['hours']),
      badges: _stringList(json['badges']),
      logo: json['logo'] as String?,
      cover: json['cover'] as String?,
      rating: _double(json['rating']),
      reviewCount: json['reviewCount'] is int ? json['reviewCount'] as int : null,
    );
  }
}

double? _double(Object? value) {
  if (value is num) return value.toDouble();
  return null;
}

Map<String, String> _stringMap(Object? value) {
  if (value is! Map) return const {};
  return value.map((key, item) => MapEntry(key.toString(), item?.toString() ?? ''));
}

List<String> _stringList(Object? value) {
  if (value is! List) return const [];
  return value.whereType<String>().toList();
}

String formatTry(num price) {
  final negative = price < 0;
  final fixed = price.abs().toStringAsFixed(2);
  final parts = fixed.split('.');
  final whole = parts[0].replaceAllMapped(
    RegExp(r'\B(?=(\d{3})+(?!\d))'),
    (match) => '.',
  );
  final cents = parts[1];
  final text = cents == '00' ? whole : '$whole,$cents';
  return '${negative ? '-' : ''}$text TL';
}

String offerClock(DateTime value) {
  final local = value.toLocal();
  final now = DateTime.now();
  final clock =
      '${local.hour.toString().padLeft(2, '0')}:${local.minute.toString().padLeft(2, '0')}';
  final sameDay = local.year == now.year && local.month == now.month && local.day == now.day;
  if (sameDay) return 'Bugün $clock';
  return '${local.day}.${local.month}.${local.year} $clock';
}

String specSummary(Map<String, String> specs) {
  const keys = ['model', 'islemci', 'ram', 'depolama', 'ekranBoyutu'];
  final parts = <String>[];
  for (final key in keys) {
    final value = displayField(specs, key);
    if (value != null && value.isNotEmpty) parts.add(value);
  }
  return parts.join(' · ');
}

const fieldLabels = <String, String>{
  'marka': 'Marka',
  'seri': 'Seri',
  'model': 'Model',
  'islemci': 'İşlemci',
  'ekranKarti': 'Ekran kartı',
  'ram': 'RAM',
  'depolama': 'Depolama',
  'ekranBoyutu': 'Ekran boyutu',
  'renk': 'Renk',
  'bellek': 'Bellek',
  'baglanti': 'Bağlantı',
  'kasaOlcusu': 'Kasa ölçüsü',
  'kolAdedi': 'Kol adedi',
  'pilSagligi': 'Pil sağlığı',
  'depolamaSagligi': 'Depolama sağlığı',
  'kutuFatura': 'Kutu / fatura',
  'kalanGaranti': 'Kalan garanti',
  'kozmetik': 'Kozmetik durum',
  'adaptor': 'Adaptör',
  'calisma': 'Çalışma durumu',
  'ekBilgi': 'Ek bilgi',
};

String? displayField(Map<String, String> values, String key) {
  final value = values[key];
  if (value == null || value.isEmpty) return null;
  if (value == 'Diğer') return values['${key}Diger'] ?? value;
  return value;
}

List<MapEntry<String, String>> visibleFields(Map<String, String> values) {
  return [
    for (final entry in values.entries)
      if (!entry.key.endsWith('Diger'))
        MapEntry(fieldLabels[entry.key] ?? entry.key, displayField(values, entry.key) ?? entry.value),
  ];
}

String ratingText(double? rating, int? reviewCount) {
  if (rating == null) return '';
  final score = rating.toStringAsFixed(1);
  if (reviewCount == null) return score;
  return '$score ($reviewCount)';
}
