import 'dart:async';

import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../api/auth_api.dart';
import '../api/catalog_api.dart';
import '../api/messages_api.dart';
import '../models/catalog.dart';
import '../session/session_controller.dart';
import '../theme.dart';
import 'home_screen.dart';
import 'messages_screen.dart';
import 'notifications_screen.dart';
import 'offers_screen.dart';
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
            return current.first.offerCount != listing.offerCount || current.first.status != listing.status;
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
    final submitted = await Navigator.of(context).push<bool>(
      MaterialPageRoute<bool>(
        builder: (context) => SellWizard(
          categories: _categories,
          token: token,
          initialCategoryId: category?.id,
        ),
      ),
    );
    if (submitted == true && mounted) {
      setState(() => _tab = 1);
      await _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    final session = SessionScope.of(context);
    final user = session.user;
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
          MessagesScreen(token: session.token ?? ''),
          _ProfileTab(
            name: user?.name ?? '',
            email: user?.email ?? '',
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

class _ListingsTab extends StatelessWidget {
  const _ListingsTab({
    required this.listings,
    required this.loading,
    required this.onOpen,
  });

  final List<ListingSummary> listings;
  final bool loading;
  final ValueChanged<ListingSummary> onOpen;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 16, 20, 96),
        children: [
          const Text('Teklifler', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
          const SizedBox(height: 12),
          if (loading)
            const LinearProgressIndicator()
          else if (listings.isEmpty)
            const Text(
              'Henüz ilanın yok. Cihaz Sat ile ilan oluşturabilirsin.',
              style: TextStyle(color: AppColors.muted, height: 1.4),
            )
          else
            for (final listing in listings)
              InkWell(
                onTap: () => onOpen(listing),
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.canvas,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(listing.title, style: const TextStyle(fontWeight: FontWeight.w800)),
                            const SizedBox(height: 4),
                            Text(
                              _statusLabel(listing),
                              style: const TextStyle(color: AppColors.muted),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right, color: AppColors.muted),
                    ],
                  ),
                ),
              ),
        ],
      ),
    );
  }
}

String _statusLabel(ListingSummary listing) {
  if (listing.offerCount > 0 || listing.status == 'teklif_var') {
    return '${listing.offerCount} teklif geldi';
  }
  if (listing.status == 'kapatildi') return 'Kapatıldı';
  return 'Teklif bekleniyor';
}

class _ProfileTab extends StatefulWidget {
  const _ProfileTab({
    required this.name,
    required this.email,
    required this.token,
    required this.onLogout,
  });

  final String name;
  final String email;
  final String token;
  final VoidCallback onLogout;

  @override
  State<_ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<_ProfileTab> {
  final _current = TextEditingController();
  final _next = TextEditingController();
  final _api = AuthApi(ApiClient());
  var _busy = false;
  String? _message;
  var _ok = false;

  @override
  void dispose() {
    _current.dispose();
    _next.dispose();
    super.dispose();
  }

  Future<void> _change() async {
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      await _api.changePassword(
        token: widget.token,
        currentPassword: _current.text,
        newPassword: _next.text,
      );
      _current.clear();
      _next.clear();
      if (!mounted) return;
      setState(() {
        _ok = true;
        _message = 'Şifre güncellendi.';
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() {
        _ok = false;
        _message = error.message;
      });
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Text('Profil', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
          const SizedBox(height: 16),
          Text(widget.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(widget.email, style: const TextStyle(color: AppColors.muted)),
          const SizedBox(height: 28),
          const Text('Şifre değiştir', style: TextStyle(fontWeight: FontWeight.w800)),
          const SizedBox(height: 8),
          TextField(
            controller: _current,
            obscureText: true,
            decoration: const InputDecoration(labelText: 'Mevcut şifre'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _next,
            obscureText: true,
            decoration: const InputDecoration(labelText: 'Yeni şifre'),
          ),
          if (_message != null) ...[
            const SizedBox(height: 8),
            Text(_message!, style: TextStyle(color: _ok ? const Color(0xFF067647) : const Color(0xFFB42318))),
          ],
          const SizedBox(height: 12),
          PrimaryButton(label: 'Şifreyi kaydet', busy: _busy, onPressed: _change),
          const SizedBox(height: 24),
          PrimaryButton(label: 'Çıkış yap', onPressed: widget.onLogout),
        ],
      ),
    );
  }
}
