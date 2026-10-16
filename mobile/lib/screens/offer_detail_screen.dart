import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../api/offers_api.dart';
import '../models/offer.dart';
import '../theme.dart';
import 'chat_screen.dart';

class OfferDetailScreen extends StatefulWidget {
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
  State<OfferDetailScreen> createState() => _OfferDetailScreenState();
}

class _OfferDetailScreenState extends State<OfferDetailScreen> {
  var _busy = false;
  var _accepted = false;
  String? _error;
  late List<SaleStepView> _sale = widget.listing.acceptedOfferId == widget.offer.id ? widget.listing.sale : const [];

  @override
  void initState() {
    super.initState();
    _accepted = widget.offer.accepted || widget.listing.acceptedOfferId == widget.offer.id;
  }

  bool get _otherAccepted {
    final chosen = widget.listing.acceptedOfferId;
    return chosen != null && chosen.isNotEmpty && chosen != widget.offer.id;
  }

  Future<void> _accept() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final sale = await OffersApi(ApiClient()).accept(widget.token, widget.listing.id, widget.offer.id);
      if (!mounted) return;
      setState(() {
        _accepted = true;
        if (sale.isNotEmpty) _sale = sale;
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() => _error = error.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final offer = widget.offer;
    final store = offer.store;
    final rows = _detailRows(widget.listing);
    final rating = _ratingLine(store);
    final terms = offer.terms.isEmpty ? _fallbackTerms : offer.terms;
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
                    onPressed: () => Navigator.of(context).pop(_accepted),
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
                  Text(
                    formatTry(offer.price),
                    style: const TextStyle(color: AppColors.blue, fontSize: 36, fontWeight: FontWeight.w800, height: 1.1),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    offer.label,
                    style: TextStyle(
                      color: offer.kind == 'kesin' ? const Color(0xFF15803D) : const Color(0xFFB45309),
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  if (offer.disclaimer.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(offer.disclaimer, style: const TextStyle(color: AppColors.muted, height: 1.35)),
                  ],
                  const SizedBox(height: 16),
                  Text(store.name, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
                  if (rating != null) ...[
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Icon(Icons.star_rounded, size: 18, color: Color(0xFFF5B400)),
                        const SizedBox(width: 4),
                        Text(rating, style: const TextStyle(fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ],
                  if (store.verified) ...[
                    const SizedBox(height: 6),
                    const Row(
                      children: [
                        Icon(Icons.check_circle, size: 18, color: Color(0xFF16A34A)),
                        SizedBox(width: 6),
                        Text('Doğrulanmış İşletme', style: TextStyle(fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ],
                  if (_accepted && _sale.isNotEmpty) ...[
                    const SizedBox(height: 18),
                    const Text('Satış Durumu', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 8),
                    for (final step in _sale)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Text(
                          step.state == 'done' ? '✓ ${step.label}' : step.label,
                          style: TextStyle(
                            fontWeight: step.state == 'upcoming' ? FontWeight.w500 : FontWeight.w800,
                            color: step.state == 'done'
                                ? const Color(0xFF15803D)
                                : step.state == 'current'
                                    ? AppColors.blue
                                    : AppColors.muted,
                          ),
                        ),
                      ),
                  ],
                  const SizedBox(height: 18),
                  const Text('Teklif şartları', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 8),
                  for (final term in terms)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Text('• $term', style: const TextStyle(height: 1.35)),
                    ),
                  if (_error != null) ...[
                    const SizedBox(height: 8),
                    Text(_error!, style: const TextStyle(color: Color(0xFFB42318))),
                  ],
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: FilledButton(
                      style: FilledButton.styleFrom(
                        backgroundColor: AppColors.blue,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: _busy || _accepted || _otherAccepted ? null : _accept,
                      child: Text(
                        _accepted
                            ? 'Teklif kabul edildi'
                            : _otherAccepted
                                ? 'Başka teklif kabul edildi'
                                : 'Teklifi Kabul Et',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: TextButton(
                      onPressed: () => openStoreChat(
                        context,
                        token: widget.token,
                        listingId: widget.listing.id,
                        storeId: store.id,
                      ),
                      child: const Text('Mağazaya Mesaj Gönder'),
                    ),
                  ),
                  if (rows.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    const Text('Cihaz', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                    for (final row in rows)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Row(
                          children: [
                            Text(row.key, style: const TextStyle(color: AppColors.muted)),
                            const Spacer(),
                            Flexible(
                              child: Text(row.value, textAlign: TextAlign.end, style: const TextStyle(fontWeight: FontWeight.w700)),
                            ),
                          ],
                        ),
                      ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

const _fallbackTerms = [
  'Elden teslim',
  'Cihaz mağazada kontrol edilir',
  'Ödeme aynı gün',
  'Teklif toplama süresi 1 saattir',
];

String? _ratingLine(StoreCard store) {
  final rating = store.rating;
  if (rating == null) return null;
  final score = rating.toStringAsFixed(1);
  final count = store.reviewCount;
  if (count == null) return score;
  return '$score · $count değerlendirme';
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
