import 'dart:async';

import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../api/offers_api.dart';
import '../api_config.dart';
import '../models/offer.dart';
import '../theme.dart';
import 'listing_edit_screen.dart';
import 'offer_detail_screen.dart';

class OffersScreen extends StatefulWidget {
  const OffersScreen({super.key, required this.token, required this.listingId});

  final String token;
  final String listingId;

  @override
  State<OffersScreen> createState() => _OffersScreenState();
}

class _OffersScreenState extends State<OffersScreen> {
  final _api = OffersApi(ApiClient());
  var _loading = true;
  String? _error;
  ListingDetail? _listing;
  List<CustomerOffer> _offers = const [];
  var _highestFirst = true;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _load();
    _timer = Timer.periodic(const Duration(seconds: 5), (_) => _load(silent: true));
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _load({bool silent = false}) async {
    if (!silent) {
      setState(() {
        _loading = true;
        _error = null;
      });
    }
    try {
      final listing = await _api.listing(widget.token, widget.listingId);
      final offers = await _api.offers(widget.token, widget.listingId);
      if (!mounted) return;
      setState(() {
        _listing = listing;
        _offers = offers;
        _loading = false;
        _error = null;
      });
    } on ApiException catch (error) {
      if (!mounted || silent) return;
      setState(() {
        _error = error.message;
        _loading = false;
      });
    }
  }

  bool get _locked {
    final status = _listing?.status;
    return status == 'kabul' || status == 'kapatildi';
  }

  Future<void> _edit() async {
    final listing = _listing;
    if (listing == null || _locked) return;
    final saved = await Navigator.of(context).push<bool>(
      MaterialPageRoute<bool>(
        builder: (context) => ListingEditScreen(token: widget.token, listing: listing),
      ),
    );
    if (saved == true) await _load();
  }

  Future<void> _cancel() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('İlanı iptal et'),
        content: const Text('İlan kapanır ve yeni teklif gelmez. Kayıt silinmez.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Vazgeç')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('İptal et')),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    try {
      await _api.cancelListing(widget.token, widget.listingId);
      if (mounted) Navigator.of(context).pop();
    } on ApiException catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.message)));
    }
  }

  Future<void> _delete() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('İlanı sil'),
        content: const Text('Teklif gelmeden ilanı silebilirsin. Bu işlem geri alınmaz.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Vazgeç')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Sil')),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    if (_offers.isNotEmpty || _listing?.status != 'bekliyor') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Teklif gelmiş ilanı yalnızca yönetici kapatabilir.')),
      );
      return;
    }
    try {
      await _api.deleteListing(widget.token, widget.listingId);
      if (mounted) Navigator.of(context).pop();
    } on ApiException catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.message)));
    }
  }

  Future<void> _openOffer(ListingDetail listing, CustomerOffer offer, bool highest) async {
    final accepted = await Navigator.of(context).push<bool>(
      MaterialPageRoute<bool>(
        builder: (context) => OfferDetailScreen(
          token: widget.token,
          listing: listing,
          offer: offer,
          highest: highest,
        ),
      ),
    );
    if (accepted == true && mounted) await _load();
  }

  void _openListing(ListingDetail listing) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => _ListingFacts(listing: listing),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final listing = _listing;
    final waiting = listing != null && _offers.isEmpty;
    final closed = listing?.status == 'kapatildi';
    final highestId = _offers.isEmpty ? null : _offers.first.id;
    final visible = _highestFirst ? _offers : _offers.reversed.toList();
    return Scaffold(
      backgroundColor: waiting && closed != true ? const Color(0xFFF7F9FC) : const Color(0xFFEDF3FC),
      body: SafeArea(
        child: Column(
          children: [
            _OffersHeader(
              title: waiting && closed != true ? 'Teklifler' : 'Gelen Teklifler',
              onBack: () => Navigator.of(context).pop(),
              onEdit: listing == null || _locked ? null : _edit,
              onCancel: listing == null || _locked ? null : _cancel,
              onDelete: listing != null && listing.status == 'bekliyor' && _offers.isEmpty ? _delete : null,
            ),
            if (listing?.sale.isNotEmpty == true)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Satış Durumu', style: TextStyle(fontWeight: FontWeight.w800)),
                    for (final step in listing!.sale)
                      Text(
                        step.state == 'done' ? '✓ ${step.label}' : step.label,
                        style: TextStyle(
                          color: step.state == 'done'
                              ? const Color(0xFF15803D)
                              : step.state == 'current'
                                  ? AppColors.blue
                                  : AppColors.muted,
                          fontWeight: step.state == 'upcoming' ? FontWeight.w500 : FontWeight.w800,
                        ),
                      ),
                  ],
                ),
              ),
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : _error != null
                      ? _Message(text: _error!, onRetry: _load)
                      : listing == null
                          ? const _Message(text: 'İlan bulunamadı.')
                          : waiting
                              ? closed
                                  ? const _ClosedListing()
                                  : _WaitingOffers(listing: listing)
                              : RefreshIndicator(
                                  onRefresh: _load,
                                  child: ListView(
                                    padding: const EdgeInsets.fromLTRB(16, 2, 16, 12),
                                    children: [
                                      _DeviceHeader(
                                        listing: listing,
                                        onOpen: () => _openListing(listing),
                                      ),
                                      const SizedBox(height: 10),
                                      Row(
                                        children: [
                                          Expanded(
                                            child: Text(
                                              '${_offers.length} işletmeden teklif geldi',
                                              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                                            ),
                                          ),
                                          InkWell(
                                            onTap: () => setState(() => _highestFirst = !_highestFirst),
                                            borderRadius: BorderRadius.circular(8),
                                            child: Padding(
                                              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
                                              child: Row(
                                                mainAxisSize: MainAxisSize.min,
                                                children: [
                                                  const Icon(Icons.swap_vert, size: 16, color: AppColors.muted),
                                                  const SizedBox(width: 2),
                                                  Text(
                                                    _highestFirst ? 'En Yüksek Fiyat' : 'En Düşük Fiyat',
                                                    style: const TextStyle(
                                                      color: AppColors.muted,
                                                      fontWeight: FontWeight.w600,
                                                      fontSize: 13,
                                                    ),
                                                  ),
                                                  const Icon(Icons.chevron_right, size: 16, color: AppColors.muted),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      for (final offer in visible)
                                        _OfferCard(
                                          offer: offer,
                                          highest: offer.id == highestId,
                                          onOpen: () => _openOffer(listing, offer, offer.id == highestId),
                                        ),
                                    ],
                                  ),
                                ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OffersHeader extends StatelessWidget {
  const _OffersHeader({
    required this.title,
    required this.onBack,
    required this.onEdit,
    required this.onCancel,
    required this.onDelete,
  });

  final String title;
  final VoidCallback onBack;
  final VoidCallback? onEdit;
  final VoidCallback? onCancel;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    final items = <PopupMenuEntry<String>>[
      if (onEdit != null) const PopupMenuItem(value: 'edit', child: Text('Düzenle')),
      if (onCancel != null) const PopupMenuItem(value: 'cancel', child: Text('İptal et')),
      if (onDelete != null) const PopupMenuItem(value: 'delete', child: Text('Sil')),
    ];
    return SizedBox(
      height: 52,
      child: Row(
        children: [
          IconButton(onPressed: onBack, icon: const Icon(Icons.chevron_left, size: 28)),
          Expanded(
            child: Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
            ),
          ),
          if (items.isEmpty)
            const SizedBox(width: 48)
          else
            PopupMenuButton<String>(
              onSelected: (value) {
                if (value == 'edit') onEdit?.call();
                if (value == 'cancel') onCancel?.call();
                if (value == 'delete') onDelete?.call();
              },
              itemBuilder: (context) => items,
            ),
        ],
      ),
    );
  }
}

class _DeviceHeader extends StatelessWidget {
  const _DeviceHeader({required this.listing, required this.onOpen});

  final ListingDetail listing;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final summary = _deviceLine(listing.specs);
    final photo = listing.photos.isEmpty ? '' : mediaUrl(listing.photos.first);
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1B4F93).withValues(alpha: 0.06),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: photo.isEmpty
                ? const _LetterBox(letter: 'A', size: 64)
                : Image.network(
                    photo,
                    width: 64,
                    height: 64,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => const _LetterBox(letter: 'A', size: 64),
                  ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  listing.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16),
                ),
                if (summary.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(
                    summary,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(color: AppColors.muted, fontSize: 13, height: 1.2),
                  ),
                ],
                const SizedBox(height: 6),
                _DetailsChip(onPressed: onOpen),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

String _deviceLine(Map<String, String> specs) {
  const keys = ['islemci', 'ram', 'depolama'];
  final parts = [
    for (final key in keys)
      if (displayField(specs, key) case final value?)
        if (value.isNotEmpty) value,
  ];
  if (parts.isNotEmpty) return parts.join(' • ');
  return specSummary(specs).replaceAll(' · ', ' • ');
}

class _OfferCard extends StatelessWidget {
  const _OfferCard({required this.offer, required this.highest, required this.onOpen});

  final CustomerOffer offer;
  final bool highest;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final store = offer.store;
    final rating = ratingText(store.rating, store.reviewCount);
    final logo = mediaUrl(store.logo);
    final letter = store.name.isEmpty ? '?' : store.name[0];
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1B4F93).withValues(alpha: 0.07),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        children: [
          if (highest) ...[
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDFFBEA),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.circle, size: 7, color: Color(0xFF16A34A)),
                      SizedBox(width: 5),
                      Text(
                        'En Yüksek Teklif',
                        style: TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.w700, fontSize: 11),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                Text(offerClock(offer.updatedAt), style: const TextStyle(color: AppColors.muted, fontSize: 11)),
              ],
            ),
            const SizedBox(height: 6),
          ],
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              logo.isEmpty
                  ? _LetterBox(letter: letter, color: _logoColor(store.name), size: 46)
                  : ClipOval(
                      child: Image.network(
                        logo,
                        width: 46,
                        height: 46,
                        fit: BoxFit.cover,
                        errorBuilder: (_, _, _) => _LetterBox(letter: letter, color: _logoColor(store.name), size: 46),
                      ),
                    ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      store.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, height: 1.15),
                    ),
                    if (rating.isNotEmpty)
                      Row(
                        children: [
                          const Icon(Icons.star, size: 13, color: Color(0xFFF5B400)),
                          const SizedBox(width: 2),
                          Text(rating, style: const TextStyle(color: AppColors.muted, fontSize: 11, height: 1.2)),
                        ],
                      ),
                    if (store.city.isNotEmpty)
                      Text(store.city, style: const TextStyle(color: AppColors.muted, fontSize: 11, height: 1.2)),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  if (!highest)
                    Text(offerClock(offer.updatedAt), style: const TextStyle(color: AppColors.muted, fontSize: 11)),
                  Text(
                    formatTry(offer.price),
                    style: const TextStyle(color: Color(0xFF0074FF), fontWeight: FontWeight.w800, fontSize: 18, height: 1.15),
                  ),
                  Text(
                    offer.label,
                    style: TextStyle(
                      color: offer.kind == 'kesin' ? const Color(0xFF15803D) : const Color(0xFFB45309),
                      fontWeight: FontWeight.w800,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(height: 6),
                  _DetailsButton(onPressed: onOpen),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _DetailsChip extends StatelessWidget {
  const _DetailsChip({required this.onPressed});

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
          padding: const EdgeInsets.only(left: 10, right: 4, top: 4, bottom: 4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFE3E8EF)),
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Detayları Gör',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.ink),
              ),
              Icon(Icons.chevron_right, size: 16, color: Color(0xFF8AA0B8)),
            ],
          ),
        ),
      ),
    );
  }
}

class _DetailsButton extends StatelessWidget {
  const _DetailsButton({required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      style: FilledButton.styleFrom(
        backgroundColor: const Color(0xFF0074FF),
        foregroundColor: Colors.white,
        minimumSize: const Size(0, 32),
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        padding: const EdgeInsets.only(left: 10, right: 4),
        visualDensity: VisualDensity.compact,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      onPressed: onPressed,
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('Detayları Gör', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
          Icon(Icons.chevron_right, size: 16),
        ],
      ),
    );
  }
}

class _WaitingOffers extends StatelessWidget {
  const _WaitingOffers({required this.listing});

  final ListingDetail listing;

  @override
  Widget build(BuildContext context) {
    final storage = listing.specs['depolama'] ?? '';
    final line = storage.isEmpty || listing.title.contains(storage)
        ? listing.title
        : '${listing.title} – $storage';
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 48, 24, 24),
      child: Column(
        children: [
          Text(
            line.isEmpty ? 'İlanınız işletmelerde' : line,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, height: 1.2),
          ),
          const SizedBox(height: 10),
          const Text(
            'Henüz teklif yok. Teklif toplama süresi 1 saat.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.muted, height: 1.4),
          ),
        ],
      ),
    );
  }
}

class _ClosedListing extends StatelessWidget {
  const _ClosedListing();

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Bu ilan kapatıldı.',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, height: 1.15),
          ),
          SizedBox(height: 8),
          Text(
            'Bu ilana işlenmiş bir teklif yok.',
            style: TextStyle(color: AppColors.muted, height: 1.4),
          ),
        ],
      ),
    );
  }
}

class _Message extends StatelessWidget {
  const _Message({required this.text, this.onRetry});

  final String text;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(text, textAlign: TextAlign.center),
            if (onRetry != null) ...[
              const SizedBox(height: 12),
              TextButton(onPressed: onRetry, child: const Text('Tekrar dene')),
            ],
          ],
        ),
      ),
    );
  }
}

class _ListingFacts extends StatelessWidget {
  const _ListingFacts({required this.listing});

  final ListingDetail listing;

  @override
  Widget build(BuildContext context) {
    final rows = [...visibleFields(listing.specs), ...visibleFields(listing.condition)];
    return Scaffold(
      backgroundColor: Colors.white,
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
                      'İlan Detayı',
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
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                children: [
                  Text(listing.title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 92,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: [
                        for (final path in listing.photos)
                          Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(14),
                              child: Image.network(
                                mediaUrl(path),
                                width: 92,
                                height: 92,
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  for (final row in rows)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        children: [
                          Expanded(child: Text(row.key, style: const TextStyle(color: AppColors.muted))),
                          const SizedBox(width: 12),
                          Expanded(child: Text(row.value, textAlign: TextAlign.end, style: const TextStyle(fontWeight: FontWeight.w700))),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LetterBox extends StatelessWidget {
  const _LetterBox({required this.letter, this.size = 46, this.color = AppColors.blue});

  final String letter;
  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
      child: Text(
        letter.toUpperCase(),
        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: size * 0.38),
      ),
    );
  }
}

Color _logoColor(String name) {
  const colors = [
    Color(0xFF16A34A),
    Color(0xFF2563EB),
    Color(0xFF111827),
    Color(0xFF7C3AED),
    Color(0xFFF97316),
  ];
  if (name.isEmpty) return colors.first;
  return colors[name.codeUnits.fold<int>(0, (sum, code) => sum + code) % colors.length];
}
