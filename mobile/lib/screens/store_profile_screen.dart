import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../api/api_client.dart';
import '../api/offers_api.dart';
import '../api_config.dart';
import '../models/offer.dart';
import '../theme.dart';
import 'chat_screen.dart';

class StoreProfileScreen extends StatefulWidget {
  const StoreProfileScreen({
    super.key,
    required this.token,
    required this.storeId,
    required this.listingId,
  });

  final String token;
  final String storeId;
  final String listingId;

  @override
  State<StoreProfileScreen> createState() => _StoreProfileScreenState();
}

class _StoreProfileScreenState extends State<StoreProfileScreen> {
  final _api = OffersApi(ApiClient());
  var _loading = true;
  var _following = false;
  var _aboutOpen = false;
  String? _error;
  StoreProfile? _store;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final store = await _api.store(widget.token, widget.storeId);
      if (!mounted) return;
      setState(() {
        _store = store;
        _loading = false;
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() {
        _error = error.message;
        _loading = false;
      });
    }
  }

  Future<void> _copyAddress(StoreProfile store) async {
    final address = [store.address, store.city].where((part) => part.trim().isNotEmpty).join(', ');
    if (address.isEmpty) return;
    await Clipboard.setData(ClipboardData(text: address));
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Adres kopyalandı')));
  }

  @override
  Widget build(BuildContext context) {
    final store = _store;
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
                      'İşletme Profili',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : _error != null
                      ? Center(child: Text(_error!))
                      : store == null
                          ? const Center(child: Text('Mağaza bulunamadı.'))
                          : ListView(
                              padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
                              children: [
                                _StoreHero(
                                  store: store,
                                  following: _following,
                                  onFollow: () => setState(() => _following = !_following),
                                ),
                                if (store.about.trim().isNotEmpty) ...[
                                  const SizedBox(height: 18),
                                  _AboutBlock(
                                    text: store.about.trim(),
                                    expanded: _aboutOpen,
                                    onToggle: () => setState(() => _aboutOpen = !_aboutOpen),
                                  ),
                                ],
                                if (store.address.trim().isNotEmpty || store.city.trim().isNotEmpty) ...[
                                  const SizedBox(height: 18),
                                  _LocationBlock(
                                    store: store,
                                    onOpen: () => _copyAddress(store),
                                  ),
                                ],
                                if (store.hours.isNotEmpty) ...[
                                  const SizedBox(height: 16),
                                  _HoursCard(hours: store.hours),
                                ],
                              ],
                            ),
            ),
            if (store != null)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
                child: SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: FilledButton.icon(
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.blue,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    onPressed: () => openStoreChat(
                      context,
                      token: widget.token,
                      listingId: widget.listingId,
                      storeId: widget.storeId,
                    ),
                    icon: const Icon(Icons.chat_bubble_outline, size: 18),
                    label: const Text('Mesaj Gönder', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _StoreHero extends StatelessWidget {
  const _StoreHero({required this.store, required this.following, required this.onFollow});

  final StoreProfile store;
  final bool following;
  final VoidCallback onFollow;

  @override
  Widget build(BuildContext context) {
    final cover = mediaUrl(store.cover);
    final logo = mediaUrl(store.logo);
    final letter = store.name.isEmpty ? '?' : store.name[0];
    final rating = _ratingLine(store.rating, store.reviewCount);
    return Column(
      children: [
        SizedBox(
          height: 156,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Positioned.fill(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(18),
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
                left: 12,
                bottom: -28,
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                      child: logo.isEmpty
                          ? _LogoMark(letter: letter)
                          : ClipOval(
                              child: Image.network(
                                logo,
                                width: 64,
                                height: 64,
                                fit: BoxFit.cover,
                                errorBuilder: (_, _, _) => _LogoMark(letter: letter),
                              ),
                            ),
                    ),
                    const Positioned(
                      right: -2,
                      bottom: -2,
                      child: _VerifiedMark(),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(width: 84),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    store.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
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
                  if (store.city.trim().isNotEmpty) ...[
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
            _FollowButton(following: following, onPressed: onFollow),
          ],
        ),
        const SizedBox(height: 16),
        const _TrustBadges(),
      ],
    );
  }
}

String _ratingLine(double? rating, int? reviewCount) {
  if (rating == null) return '';
  final score = rating.toStringAsFixed(1);
  if (reviewCount == null) return score;
  return '$score ($reviewCount değerlendirme)';
}

class _LogoMark extends StatelessWidget {
  const _LogoMark({required this.letter});

  final String letter;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 64,
      height: 64,
      alignment: Alignment.center,
      decoration: const BoxDecoration(color: Color(0xFF111827), shape: BoxShape.circle),
      child: Text(
        letter.toUpperCase(),
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16),
      ),
    );
  }
}

class _VerifiedMark extends StatelessWidget {
  const _VerifiedMark();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 22,
      height: 22,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: AppColors.blue,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
      ),
      child: const Icon(Icons.check, color: Colors.white, size: 12),
    );
  }
}

class _FollowButton extends StatelessWidget {
  const _FollowButton({required this.following, required this.onPressed});

  final bool following;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFF3F8FF),
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFD5E6FF)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                following ? Icons.favorite : Icons.favorite_border,
                size: 16,
                color: AppColors.blue,
              ),
              const SizedBox(width: 6),
              Text(
                following ? 'Takipte' : 'Takip Et',
                style: const TextStyle(color: AppColors.blue, fontWeight: FontWeight.w700, fontSize: 13),
              ),
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
      _TrustBadge('Güvenilir İşletme', Icons.verified_user_outlined, Color(0xFF3B82F6), Color(0xFFE8F1FF)),
      _TrustBadge('Hızlı Dönüş', Icons.chat_bubble_outline, Color(0xFF22C55E), Color(0xFFE7F8EE)),
      _TrustBadge('Yerinde Satış', Icons.location_on_outlined, Color(0xFF3B82F6), Color(0xFFE8F1FF)),
      _TrustBadge('Kurumsal', Icons.apartment_outlined, Color(0xFF64748B), Color(0xFFF1F4F8)),
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
          decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(8)),
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

class _AboutBlock extends StatelessWidget {
  const _AboutBlock({required this.text, required this.expanded, required this.onToggle});

  final String text;
  final bool expanded;
  final VoidCallback onToggle;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Hakkında', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
        const SizedBox(height: 6),
        InkWell(
          onTap: onToggle,
          borderRadius: BorderRadius.circular(8),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Text(
                  text,
                  maxLines: expanded ? null : 3,
                  overflow: expanded ? TextOverflow.visible : TextOverflow.ellipsis,
                  style: const TextStyle(color: AppColors.muted, fontSize: 14, height: 1.4),
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                expanded ? Icons.expand_less : Icons.chevron_right,
                color: const Color(0xFF8AA0B8),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _LocationBlock extends StatelessWidget {
  const _LocationBlock({required this.store, required this.onOpen});

  final StoreProfile store;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final address = [store.address.trim(), store.city.trim()].where((part) => part.isNotEmpty).join(', ');
    return Column(
      children: [
        Row(
          children: [
            const Expanded(
              child: Text('Konum', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
            ),
            TextButton(
              onPressed: onOpen,
              style: TextButton.styleFrom(
                foregroundColor: AppColors.blue,
                padding: const EdgeInsets.symmetric(horizontal: 4),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: const Text('Haritada Gör', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ],
        ),
        const SizedBox(height: 8),
        const _MapSketch(),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: Text(address, style: const TextStyle(fontSize: 14, height: 1.3)),
            ),
            IconButton(
              onPressed: onOpen,
              icon: const Icon(Icons.near_me_outlined, color: AppColors.blue),
            ),
          ],
        ),
      ],
    );
  }
}

class _MapSketch extends StatelessWidget {
  const _MapSketch();

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: const SizedBox(
        height: 132,
        width: double.infinity,
        child: CustomPaint(
          painter: _MapPainter(),
          child: Center(child: Icon(Icons.location_on, color: Color(0xFFE11D48), size: 36)),
        ),
      ),
    );
  }
}

class _MapPainter extends CustomPainter {
  const _MapPainter();

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawRect(Offset.zero & size, Paint()..color = const Color(0xFFE6EEF7));
    final block = Paint()..color = const Color(0xFFF8FBFF);
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromLTWH(12, 16, size.width * 0.34, 42), const Radius.circular(6)),
      block,
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromLTWH(size.width * 0.52, 18, size.width * 0.36, 36), const Radius.circular(6)),
      block,
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(16, size.height * 0.62, size.width * 0.4, 32),
        const Radius.circular(6),
      ),
      block,
    );
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(size.width * 0.55, size.height * 0.58, size.width * 0.32, 40),
        const Radius.circular(6),
      ),
      block,
    );
    final road = Paint()
      ..color = Colors.white
      ..strokeWidth = 14
      ..strokeCap = StrokeCap.square;
    canvas.drawLine(Offset(0, size.height * 0.42), Offset(size.width, size.height * 0.5), road);
    canvas.drawLine(Offset(size.width * 0.38, 0), Offset(size.width * 0.46, size.height), road);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _HoursCard extends StatelessWidget {
  const _HoursCard({required this.hours});

  final List<String> hours;

  @override
  Widget build(BuildContext context) {
    final rows = [for (final line in hours) _HourRow.parse(line)];
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE6EDF5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.schedule, size: 20, color: AppColors.muted),
              SizedBox(width: 8),
              Expanded(
                child: Text('Çalışma Saatleri', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          for (final row in rows)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: Text(row.days, style: const TextStyle(fontSize: 14, height: 1.3))),
                  if (row.time.isNotEmpty) ...[
                    const SizedBox(width: 12),
                    Text(row.time, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  ],
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class _HourRow {
  const _HourRow(this.days, this.time);

  final String days;
  final String time;

  static final _time = RegExp(r'(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})');

  static _HourRow parse(String line) {
    final parts = line.split('|');
    if (parts.length == 2) {
      final span = parts[1].trim();
      if (span == 'Kapalı') return _HourRow(parts[0].trim(), 'Kapalı');
      final match = _time.firstMatch(span);
      if (match != null) return _HourRow(parts[0].trim(), '${match.group(1)} - ${match.group(2)}');
      return _HourRow(parts[0].trim(), span);
    }
    final match = _time.firstMatch(line);
    if (match == null) return _HourRow(line.trim(), '');
    final days = line
        .replaceRange(match.start, match.end, '')
        .trim()
        .replaceAll(RegExp(r'\s*[-–:]\s*$'), '');
    return _HourRow(days.isEmpty ? line.trim() : days, '${match.group(1)} - ${match.group(2)}'.replaceAll('.', ':'));
  }
}
