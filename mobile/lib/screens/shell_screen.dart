import 'dart:async';

import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../api_config.dart';
import '../api/catalog_api.dart';
import '../api/messages_api.dart';
import '../models/catalog.dart';
import '../models/offer.dart';
import '../session/session_controller.dart';
import '../theme.dart';
import 'home_screen.dart';
import 'messages_screen.dart';
import 'notifications_screen.dart';
import 'offers_screen.dart';
import 'profile_screen.dart';
import 'sell_wizard.dart';

class ShellScreen extends StatefulWidget {
  const ShellScreen({super.key});

  @override
  State<ShellScreen> createState() => _ShellScreenState();
}

class _ShellScreenState extends State<ShellScreen> {
  final _api = CatalogApi(ApiClient());
  final _messages = MessagesApi(ApiClient());
  var _tab = 0;
  var _loading = true;
  String? _error;
  var _notificationCount = 0;
  var _messageUnread = 0;
  List<CategoryModel> _categories = const [];
  List<ListingSummary> _listings = const [];
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      _load();
      _timer = Timer.periodic(const Duration(seconds: 5), (_) => _refreshQuietly());
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _load() async {
    final token = SessionScope.of(context).token;
    if (token == null) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final categories = await _api.categories(token);
      final listings = await _api.listings(token);
      final notes = await _messages.notifications(token);
      final conversations = await _messages.list(token);
      if (!mounted) return;
      setState(() {
        _categories = categories;
        _listings = listings;
        _notificationCount = notes.where((item) => item.readAt == null).length;
        _messageUnread = conversations.fold(0, (sum, row) => sum + row.unreadCount);
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

  Future<void> _refreshQuietly() async {
    final token = SessionScope.of(context).token;
    if (token == null || !mounted) return;
    try {
      final listings = await _api.listings(token);
      final notes = await _messages.notifications(token);
      final conversations = await _messages.list(token);
      if (!mounted) return;
      final nextNotes = notes.where((item) => item.readAt == null).length;
      final nextUnread = conversations.fold<int>(0, (sum, row) => sum + row.unreadCount);
      final changedListings = listings.length != _listings.length ||
          listings.any((listing) {
            final current = _listings.where((item) => item.id == listing.id);
            if (current.isEmpty) return true;
            return current.first.offerCount != listing.offerCount ||
                current.first.status != listing.status ||
                current.first.highestOffer != listing.highestOffer;
          });
      if (!changedListings && nextNotes == _notificationCount && nextUnread == _messageUnread) return;
      setState(() {
        _listings = listings;
        _notificationCount = nextNotes;
        _messageUnread = nextUnread;
      });
    } on ApiException {
      return;
    }
  }

  Future<void> _openSell([CategoryModel? category]) async {
    final token = SessionScope.of(context).token;
    if (token == null) return;
    final listingId = await Navigator.of(context).push<String>(
      MaterialPageRoute<String>(
        builder: (context) => SellWizard(
          categories: _categories,
          token: token,
          initialCategoryId: category?.id,
        ),
      ),
    );
    if (listingId == null || !mounted) return;
    setState(() => _tab = 1);
    await _load();
    if (listingId.isEmpty || !mounted) return;
    await Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => OffersScreen(token: token, listingId: listingId),
      ),
    );
    if (mounted) await _load();
  }

  @override
  Widget build(BuildContext context) {
    final session = SessionScope.of(context);
    return Scaffold(
      body: IndexedStack(
        index: _tab,
        children: [
          HomeScreen(
            categories: _categories,
            loading: _loading,
            error: _error,
            onRetry: _load,
            onSell: () => _openSell(),
            onCategory: _openSell,
            notificationCount: _notificationCount,
            onProfile: () => setState(() => _tab = 3),
            onNotifications: () async {
              final token = session.token;
              if (token == null) return;
              await Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (context) => NotificationsScreen(token: token),
                ),
              );
              if (mounted) await _load();
            },
          ),
          _ListingsTab(
            listings: _listings,
            loading: _loading,
            notificationCount: _notificationCount,
            onNotifications: () async {
              final token = session.token;
              if (token == null) return;
              await Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (context) => NotificationsScreen(token: token),
                ),
              );
              if (mounted) await _load();
            },
            onSell: () => _openSell(),
            onOpen: (listing) async {
              final token = session.token;
              if (token == null) return;
              await Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (context) => OffersScreen(token: token, listingId: listing.id),
                ),
              );
              if (mounted) await _load();
            },
          ),
          MessagesScreen(
            token: session.token ?? '',
            onOpenOffers: () => setState(() => _tab = 1),
          ),
          ProfileScreen(
            token: session.token ?? '',
            onLogout: session.logout,
          ),
        ],
      ),
      bottomNavigationBar: _BottomBar(
        tab: _tab,
        messageUnread: _messageUnread,
        onTab: (index) => setState(() => _tab = index),
        onSell: _categories.isEmpty ? null : () => _openSell(),
      ),
    );
  }
}

class _BottomBar extends StatelessWidget {
  const _BottomBar({
    required this.tab,
    required this.messageUnread,
    required this.onTab,
    required this.onSell,
  });

  final int tab;
  final int messageUnread;
  final ValueChanged<int> onTab;
  final VoidCallback? onSell;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      child: DecoratedBox(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: AppColors.line)),
        ),
        child: SafeArea(
          top: false,
          child: SizedBox(
            height: 74,
            child: Row(
              children: [
                _NavSlot(
                  label: 'Anasayfa',
                  selected: tab == 0,
                  onTap: () => onTab(0),
                  icon: Icon(tab == 0 ? Icons.home : Icons.home_outlined),
                ),
                _NavSlot(
                  label: 'Teklifler',
                  selected: tab == 1,
                  onTap: () => onTab(1),
                  icon: Icon(tab == 1 ? Icons.local_offer : Icons.local_offer_outlined),
                ),
                _SellSlot(onTap: onSell),
                _NavSlot(
                  label: 'Mesajlar',
                  selected: tab == 2,
                  onTap: () => onTab(2),
                  icon: Badge(
                    isLabelVisible: messageUnread > 0,
                    label: Text('$messageUnread'),
                    child: Icon(tab == 2 ? Icons.chat_bubble : Icons.chat_bubble_outline),
                  ),
                ),
                _NavSlot(
                  label: 'Profil',
                  selected: tab == 3,
                  onTap: () => onTab(3),
                  icon: Icon(tab == 3 ? Icons.person : Icons.person_outline),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavSlot extends StatelessWidget {
  const _NavSlot({
    required this.label,
    required this.selected,
    required this.onTap,
    required this.icon,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;
  final Widget icon;

  @override
  Widget build(BuildContext context) {
    final color = selected ? AppColors.blue : AppColors.muted;
    return Expanded(
      child: InkWell(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: 44, child: Center(child: IconTheme(data: IconThemeData(color: color, size: 24), child: icon))),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(fontSize: 11, height: 1.1, color: color, fontWeight: selected ? FontWeight.w700 : FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }
}

class _SellSlot extends StatelessWidget {
  const _SellSlot({required this.onTap});

  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              height: 44,
              child: Center(
                child: Container(
                  width: 42,
                  height: 42,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: AppColors.blue,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.blue.withValues(alpha: 0.28),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: const Icon(Icons.add, color: Colors.white, size: 28),
                ),
              ),
            ),
            const SizedBox(height: 2),
            const Text(
              'Cihaz Sat',
              style: TextStyle(fontSize: 11, height: 1.1, color: AppColors.muted, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }
}

class _ListingsTab extends StatefulWidget {
  const _ListingsTab({
    required this.listings,
    required this.loading,
    required this.onOpen,
    required this.onSell,
    required this.onNotifications,
    required this.notificationCount,
  });

  final List<ListingSummary> listings;
  final bool loading;
  final ValueChanged<ListingSummary> onOpen;
  final VoidCallback onSell;
  final VoidCallback onNotifications;
  final int notificationCount;

  @override
  State<_ListingsTab> createState() => _ListingsTabState();
}

class _ListingsTabState extends State<_ListingsTab> {
  var _filter = 'aktif';
  Timer? _clock;

  @override
  void initState() {
    super.initState();
    _clock = Timer.periodic(const Duration(seconds: 30), (_) {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _clock?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final visible = widget.listings.where((listing) => _bucket(listing) == _filter).toList();
    final activeCount = widget.listings.where((listing) => _bucket(listing) == 'aktif').length;
    final doneCount = widget.listings.where((listing) => _bucket(listing) == 'tamamlanan').length;
    final offerTotal = widget.listings.fold<int>(0, (sum, listing) => sum + listing.offerCount);
    return ColoredBox(
      color: const Color(0xFFF5F7FB),
      child: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
          children: [
            Row(
              children: [
                const Text.rich(
                  TextSpan(
                    style: TextStyle(fontSize: 26, height: 1, fontWeight: FontWeight.w800, letterSpacing: -0.4),
                    children: [
                      TextSpan(text: 'Alan ', style: TextStyle(color: AppColors.ink)),
                      TextSpan(text: 'Yerler', style: TextStyle(color: AppColors.blue)),
                    ],
                  ),
                ),
                const Spacer(),
                IconButton(
                  onPressed: widget.onNotifications,
                  icon: Badge(
                    isLabelVisible: widget.notificationCount > 0,
                    smallSize: 8,
                    backgroundColor: const Color(0xFFEF4444),
                    child: const Icon(Icons.notifications_none, size: 26, color: AppColors.ink),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text('Teklifler', style: TextStyle(fontSize: 32, height: 1.05, fontWeight: FontWeight.w800, letterSpacing: -0.6)),
            const SizedBox(height: 6),
            const Text(
              'Cihazlarına gelen teklifleri takip et.',
              style: TextStyle(color: AppColors.muted, fontSize: 15),
            ),
            const SizedBox(height: 16),
            _StatStrip(activeCount: activeCount, offerTotal: offerTotal),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(child: _FilterPill(label: 'Aktif ($activeCount)', selected: _filter == 'aktif', onTap: () => setState(() => _filter = 'aktif'))),
                const SizedBox(width: 8),
                Expanded(child: _FilterPill(label: 'Tamamlanan ($doneCount)', selected: _filter == 'tamamlanan', onTap: () => setState(() => _filter = 'tamamlanan'))),
              ],
            ),
            const SizedBox(height: 14),
            if (widget.loading)
              const LinearProgressIndicator()
            else if (visible.isEmpty)
              Text(_emptyLabel(_filter), style: const TextStyle(color: AppColors.muted, height: 1.4))
            else
              for (final listing in visible) _OfferCard(listing: listing, onOpen: () => widget.onOpen(listing)),
            const SizedBox(height: 6),
            const _NoteCard(
              icon: Icons.verified_user_outlined,
              title: 'Karar verirken',
              body: 'Fiyatla birlikte mağaza puanını ve teslimat koşullarını da incele.',
            ),
            const SizedBox(height: 10),
            _NoteCard(
              icon: Icons.add,
              title: 'Başka bir cihazın mı var?',
              body: 'Yeni cihaz ekle, mağazalardan teklif al.',
              trailing: const Icon(Icons.chevron_right, color: Color(0xFF8AA0B8)),
              onTap: widget.onSell,
            ),
          ],
        ),
      ),
    );
  }
}

class _StatStrip extends StatelessWidget {
  const _StatStrip({required this.activeCount, required this.offerTotal});

  final int activeCount;
  final int offerTotal;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE6EDF5)),
      ),
      child: Row(
        children: [
          Expanded(child: _StatItem(icon: Icons.smartphone_outlined, value: '$activeCount', label: 'Aktif cihaz')),
          const SizedBox(width: 1, height: 42, child: ColoredBox(color: Color(0xFFE6EDF5))),
          Expanded(child: _StatItem(icon: Icons.article_outlined, value: '$offerTotal', label: 'Gelen teklif')),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  const _StatItem({required this.icon, required this.value, required this.label});

  final IconData icon;
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, color: AppColors.blue, size: 22),
        const SizedBox(width: 10),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(value, style: const TextStyle(fontSize: 22, height: 1, fontWeight: FontWeight.w800)),
            const SizedBox(height: 3),
            Text(label, style: const TextStyle(color: AppColors.muted, fontSize: 12.5)),
          ],
        ),
      ],
    );
  }
}

class _FilterPill extends StatelessWidget {
  const _FilterPill({required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? AppColors.blue : Colors.transparent,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: selected ? Colors.white : AppColors.muted,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
      ),
    );
  }
}

class _OfferCard extends StatelessWidget {
  const _OfferCard({required this.listing, required this.onOpen});

  final ListingSummary listing;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    final specs = _specLine(listing);
    final photo = mediaUrl(listing.photo);
    final hasOffers = listing.offerCount > 0;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFE6EDF5)),
      ),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 92,
                height: 112,
                decoration: BoxDecoration(color: const Color(0xFFF4F7FB), borderRadius: BorderRadius.circular(16)),
                clipBehavior: Clip.antiAlias,
                child: photo.isEmpty
                    ? const Icon(Icons.smartphone, color: AppColors.blue, size: 36)
                    : Image.network(photo, fit: BoxFit.contain),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(listing.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                        ),
                        if (hasOffers && _bucket(listing) == 'aktif')
                          const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.circle, size: 8, color: AppColors.blue),
                              SizedBox(width: 4),
                              Text('Yeni teklif var', style: TextStyle(color: AppColors.blue, fontSize: 11.5, fontWeight: FontWeight.w700)),
                            ],
                          ),
                      ],
                    ),
                    if (specs.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(specs, style: const TextStyle(color: AppColors.muted, fontSize: 13)),
                    ],
                    const SizedBox(height: 8),
                    if (hasOffers)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: const Color(0xFFE7F8EE), borderRadius: BorderRadius.circular(20)),
                        child: Text(
                          '${listing.offerCount} teklif geldi',
                          style: const TextStyle(color: Color(0xFF159947), fontSize: 12, fontWeight: FontWeight.w800),
                        ),
                      )
                    else ...[
                      const Text('Teklif bekleniyor', style: TextStyle(color: AppColors.muted, fontWeight: FontWeight.w700)),
                      if (_timeLabel(listing).isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(_timeLabel(listing), style: const TextStyle(color: AppColors.blue, fontWeight: FontWeight.w700, fontSize: 12.5)),
                      ],
                    ],
                    if (listing.highestOffer != null) ...[
                      const SizedBox(height: 10),
                      const Text('En yüksek teklif', style: TextStyle(color: AppColors.muted, fontSize: 12.5)),
                      const SizedBox(height: 2),
                      Text(formatTry(listing.highestOffer!), style: const TextStyle(color: AppColors.blue, fontSize: 28, height: 1.05, fontWeight: FontWeight.w800)),
                      const SizedBox(height: 2),
                      Text('${listing.offerCount} mağazanın teklifini karşılaştır.', style: const TextStyle(color: AppColors.muted, fontSize: 12.5)),
                    ],
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.blue,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              onPressed: onOpen,
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('Teklifleri İncele', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                  SizedBox(width: 8),
                  Icon(Icons.arrow_forward, size: 18),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NoteCard extends StatelessWidget {
  const _NoteCard({
    required this.icon,
    required this.title,
    required this.body,
    this.trailing,
    this.onTap,
  });

  final IconData icon;
  final String title;
  final String body;
  final Widget? trailing;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: const Color(0xFFE6EDF5)),
          ),
          child: Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: const BoxDecoration(color: Color(0xFFEFF4FF), shape: BoxShape.circle),
                child: Icon(icon, color: AppColors.blue, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontWeight: FontWeight.w800)),
                    const SizedBox(height: 2),
                    Text(body, style: const TextStyle(color: AppColors.muted, fontSize: 12.5, height: 1.3)),
                  ],
                ),
              ),
              ?trailing,
            ],
          ),
        ),
      ),
    );
  }
}

String _emptyLabel(String filter) {
  if (filter == 'taslak') return 'Taslak yok. İlan gönderilmeden kaydedilmiyor.';
  if (filter == 'tamamlanan') return 'Kabul edilmiş teklif yok.';
  if (filter == 'dolan') return 'Süresi dolan ilan yok.';
  return 'Aktif ilan yok. Cihaz Sat ile ilan oluşturabilirsin.';
}

String _specLine(ListingSummary listing) {
  return [listing.storage, listing.color].where((part) => part.isNotEmpty).join(' · ');
}

String _bucket(ListingSummary listing) {
  if (listing.status == 'kabul') return 'tamamlanan';
  if (listing.status == 'kapatildi') return 'dolan';
  final ends = listing.offerWindowEndsAt;
  if (ends != null && !ends.isAfter(DateTime.now())) return 'dolan';
  return 'aktif';
}

String _timeLabel(ListingSummary listing) {
  if (listing.status == 'kabul') return 'Teklif kabul edildi';
  if (listing.status == 'kapatildi') return 'Kapatıldı';
  final ends = listing.offerWindowEndsAt;
  if (ends == null) return '';
  final left = ends.difference(DateTime.now());
  if (left.isNegative || left.inSeconds == 0) return 'Süre doldu';
  if (left.inHours >= 1) return '${left.inHours} saat kaldı';
  final minutes = left.inMinutes;
  return '${minutes < 1 ? 1 : minutes} dakika kaldı';
}

