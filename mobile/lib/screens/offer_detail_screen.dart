import 'package:flutter/material.dart';

import '../api_config.dart';
import '../models/offer.dart';
import '../theme.dart';
import 'chat_screen.dart';
import 'store_profile_screen.dart';

class OfferDetailScreen extends StatelessWidget {
  const OfferDetailScreen({
    super.key,
    required this.token,
    required this.listing,
    required this.offer,
    required this.highest,
  });

  final String token;
  final ListingDetail listing;
  final CustomerOffer offer;
  final bool highest;

  @override
  Widget build(BuildContext context) {
    final rows = _detailRows(listing);
    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FC),
      body: SafeArea(
        child: Column(
          children: [
            SizedBox(
              height: 52,
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.chevron_left, size: 28),
                  ),
                  const Expanded(
                    child: Text(
                      'Teklif Detayı',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                children: [
                  _StoreOfferCard(
                    token: token,
                    listingId: listing.id,
                    offer: offer,
                    highest: highest,
                  ),
                  const SizedBox(height: 22),
                  const Text('Teklif Detayları', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 6),
                  for (var index = 0; index < rows.length; index++) ...[
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(rows[index].key, style: const TextStyle(color: AppColors.muted, fontSize: 14)),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Text(
                              rows[index].value,
                              textAlign: TextAlign.end,
                              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, height: 1.3),
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (index < rows.length - 1) const Divider(height: 1, color: Color(0xFFE6EDF5)),
                  ],
                  const SizedBox(height: 8),
                  const _NextStepNote(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

List<MapEntry<String, String>> _detailRows(ListingDetail listing) {
  final rows = <MapEntry<String, String>>[];
  if (listing.title.isNotEmpty) rows.add(MapEntry('Cihaz', listing.title));
  for (final row in visibleFields(listing.specs)) {
    if (row.key == 'Model' && row.value == listing.title) continue;
    rows.add(row);
  }
  for (final row in visibleFields(listing.condition)) {
    rows.add(row.key == 'Kozmetik durum' ? MapEntry('Durum', row.value) : row);
  }
  return rows;
}

class _StoreOfferCard extends StatelessWidget {
  const _StoreOfferCard({
    required this.token,
    required this.listingId,
    required this.offer,
    required this.highest,
  });

  final String token;
  final String listingId;
  final CustomerOffer offer;
  final bool highest;

  @override
  Widget build(BuildContext context) {
    final store = offer.store;
    final cover = mediaUrl(store.cover);
    final logo = mediaUrl(store.logo);
    final letter = store.name.isEmpty ? '?' : store.name[0];
    final rating = _ratingLine(store);
    final verified = store.badges.any((badge) {
      final text = badge.toLowerCase();
      return text.contains('güven') || text.contains('guven') || text.contains('onay');
    });
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1B4F93).withValues(alpha: 0.08),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          SizedBox(
            height: 168,
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Positioned.fill(
                  child: ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
                    child: cover.isEmpty
                        ? const ColoredBox(color: Color(0xFFE7EEF8))
                        : Image.network(
                            cover,
                            fit: BoxFit.cover,
                            errorBuilder: (_, _, _) => const ColoredBox(color: Color(0xFFE7EEF8)),
                          ),
                  ),
                ),
                Positioned(
                  left: 16,
                  bottom: -30,
                  child: Container(
                    padding: const EdgeInsets.all(3),
                    decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                    child: logo.isEmpty
                        ? _LogoMark(letter: letter, size: 58)
                        : ClipOval(
                            child: Image.network(
                              logo,
                              width: 58,
                              height: 58,
                              fit: BoxFit.cover,
                              errorBuilder: (_, _, _) => _LogoMark(letter: letter, size: 58),
                            ),
                          ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
            child: Column(
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(width: 74),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  store.name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                                ),
                              ),
                              if (verified) ...[
                                const SizedBox(width: 4),
                                const Icon(Icons.verified, color: Color(0xFF22C55E), size: 18),
                              ],
                            ],
                          ),
                          if (rating.isNotEmpty) ...[
                            const SizedBox(height: 3),
                            Row(
                              children: [
                                const Icon(Icons.star_rounded, size: 16, color: Color(0xFFF5B400)),
                                const SizedBox(width: 3),
                                Flexible(
                                  child: Text(
                                    rating,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(color: AppColors.muted, fontSize: 13),
                                  ),
                                ),
                              ],
                            ),
                          ],
                          if (store.city.isNotEmpty) ...[
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                const Icon(Icons.location_on_outlined, size: 15, color: AppColors.muted),
                                const SizedBox(width: 2),
                                Flexible(
                                  child: Text(
                                    store.city,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(color: AppColors.muted, fontSize: 13),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    _ProfileButton(
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (context) => StoreProfileScreen(
                              token: token,
                              storeId: store.id,
                              listingId: listingId,
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const _TrustBadges(),
                const SizedBox(height: 14),
                _PriceBox(
                  price: formatTry(offer.price),
                  when: offerClock(offer.updatedAt),
                  label: highest ? 'En Yüksek Teklif' : 'Sana Özel Teklif',
                  onChat: () => openStoreChat(
                    context,
                    token: token,
                    listingId: listingId,
                    storeId: store.id,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

String _ratingLine(StoreCard store) {
  final rating = store.rating;
  if (rating == null) return '';
  final score = rating.toStringAsFixed(1);
  final count = store.reviewCount;
  if (count == null) return score;
  return '$score ($count değerlendirme)';
}

class _LogoMark extends StatelessWidget {
  const _LogoMark({required this.letter, required this.size});

  final String letter;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: const BoxDecoration(color: Color(0xFF111827), shape: BoxShape.circle),
      child: Text(
        letter.toUpperCase(),
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16),
      ),
    );
  }
}

class _ProfileButton extends StatelessWidget {
  const _ProfileButton({required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.only(left: 12, right: 6, top: 7, bottom: 7),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFD7E3F0)),
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Profili Gör', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
              Icon(Icons.chevron_right, size: 18, color: Color(0xFF8AA0B8)),
            ],
          ),
        ),
      ),
    );
  }
}

class _TrustBadges extends StatelessWidget {
  const _TrustBadges();

  @override
  Widget build(BuildContext context) {
    const items = [
      _TrustBadge(
        'Güvenilir İşletme',
        Icons.verified_user_outlined,
        Color(0xFF3B82F6),
        Color(0xFFE8F1FF),
      ),
      _TrustBadge(
        'Hızlı Dönüş',
        Icons.chat_bubble_outline,
        Color(0xFF22C55E),
        Color(0xFFE7F8EE),
      ),
      _TrustBadge(
        'Yerinde Satış',
        Icons.location_on_outlined,
        Color(0xFF3B82F6),
        Color(0xFFE8F1FF),
      ),
      _TrustBadge(
        'Kurumsal',
        Icons.apartment_outlined,
        Color(0xFF64748B),
        Color(0xFFF1F4F8),
      ),
    ];
    return Column(
      children: [
        for (var row = 0; row < items.length; row += 2) ...[
          if (row > 0) const SizedBox(height: 10),
          Row(
            children: [
              Expanded(child: items[row]),
              const SizedBox(width: 12),
              Expanded(child: items[row + 1]),
            ],
          ),
        ],
      ],
    );
  }
}

class _TrustBadge extends StatelessWidget {
  const _TrustBadge(this.label, this.icon, this.color, this.background);

  final String label;
  final IconData icon;
  final Color color;
  final Color background;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 28,
          height: 28,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: background,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, size: 16, color: color),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            label,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 12, height: 1.2, fontWeight: FontWeight.w600, color: Color(0xFF3E5168)),
          ),
        ),
      ],
    );
  }
}

class _PriceBox extends StatelessWidget {
  const _PriceBox({
    required this.price,
    required this.when,
    required this.label,
    required this.onChat,
  });

  final String price;
  final String when;
  final String label;
  final VoidCallback onChat;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
      decoration: BoxDecoration(
        color: const Color(0xFFF3F6FB),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFE5F8EC),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.sell_outlined, size: 14, color: Color(0xFF16A34A)),
                    const SizedBox(width: 4),
                    Text(
                      label,
                      style: const TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.w700, fontSize: 12),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              Text(when, style: const TextStyle(color: AppColors.muted, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            price,
            style: const TextStyle(color: AppColors.blue, fontSize: 32, fontWeight: FontWeight.w800, height: 1.1),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: FilledButton.icon(
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.blue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              onPressed: onChat,
              icon: const Icon(Icons.chat_bubble_outline, size: 18),
              label: const Text('İletişime Geç', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            ),
          ),
        ],
      ),
    );
  }
}

class _NextStepNote extends StatelessWidget {
  const _NextStepNote();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFE8F1FF),
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.info, color: AppColors.blue, size: 22),
          SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Nasıl devam ederim?', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                SizedBox(height: 4),
                Text(
                  'İletişime geçerek cihazınızı bu fiyattan satmak için detayları görüşebilirsiniz. İşletme size konum, randevu ve teslimat süreci hakkında bilgi verecektir.',
                  style: TextStyle(color: AppColors.ink, fontSize: 13, height: 1.4),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
