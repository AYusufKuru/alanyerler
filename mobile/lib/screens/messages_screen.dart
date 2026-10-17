import 'dart:async';

import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../api/messages_api.dart';
import '../api_config.dart';
import '../models/message.dart';
import '../models/offer.dart';
import '../theme.dart';
import 'chat_screen.dart';

class MessagesScreen extends StatefulWidget {
  const MessagesScreen({super.key, required this.token, required this.onOpenOffers});

  final String token;
  final VoidCallback onOpenOffers;

  @override
  State<MessagesScreen> createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  final _api = MessagesApi(ApiClient());
  final _search = TextEditingController();
  var _filter = 'all';
  var _loading = true;
  String? _error;
  List<ConversationSummary> _rows = const [];
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
    _search.dispose();
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
      final rows = await _api.list(widget.token);
      if (!mounted) return;
      setState(() {
        _rows = rows;
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

  Future<void> _open(ConversationSummary row) async {
    final detail = await _api.one(widget.token, row.id);
    if (!mounted) return;
    await Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (context) => ChatScreen(token: widget.token, initial: detail)),
    );
    await _load();
  }

  List<ConversationSummary> get _visible {
    final query = _search.text.trim().toLowerCase();
    return _rows.where((row) {
      if (_filter == 'offers' && row.offerPrice == null) return false;
      if (_filter == 'favorites' && !row.favorite) return false;
      if (query.isEmpty) return true;
      return row.storeName.toLowerCase().contains(query) || row.listingTitle.toLowerCase().contains(query);
    }).toList();
  }

  Future<void> _toggleFavorite(ConversationSummary row) async {
    try {
      await _api.favorite(widget.token, row.id, !row.favorite);
      await _load(silent: true);
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() => _error = error.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final visible = _visible;
    return ColoredBox(
      color: const Color(0xFFF5F7FB),
      child: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
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
            const SizedBox(height: 16),
            const Text('Mesajlar', style: TextStyle(fontSize: 32, height: 1.05, fontWeight: FontWeight.w800, letterSpacing: -0.6)),
            const SizedBox(height: 6),
            const Text('Mağazalarla görüşmelerin burada.', style: TextStyle(color: AppColors.muted, fontSize: 15)),
            const SizedBox(height: 14),
            TextField(
              controller: _search,
              onChanged: (_) => setState(() {}),
              decoration: InputDecoration(
                hintText: 'Mağaza veya cihaz ara',
                prefixIcon: const Icon(Icons.search, color: AppColors.muted),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE6EDF5))),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE6EDF5))),
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _Chip(label: 'Tümü (${_rows.length})', selected: _filter == 'all', onTap: () => setState(() => _filter = 'all')),
                _Chip(label: 'Tekliflerim', selected: _filter == 'offers', onTap: () => setState(() => _filter = 'offers')),
                _Chip(label: 'Favoriler', icon: Icons.star_border, selected: _filter == 'favorites', onTap: () => setState(() => _filter = 'favorites')),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Text('Konuşmalar', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                const Spacer(),
                Text('${visible.length} görüşme', style: const TextStyle(color: AppColors.muted)),
              ],
            ),
            const SizedBox(height: 10),
            if (_loading) const LinearProgressIndicator(),
            if (_error != null) ...[
              const SizedBox(height: 8),
              Text(_error!, style: const TextStyle(color: Color(0xFFB42318))),
            ],
            if (!_loading && visible.isEmpty)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 18),
                child: Text('Henüz konuşma yok. Teklif detayından mağazaya yazabilirsin.', style: TextStyle(color: AppColors.muted, height: 1.4)),
              )
            else
              for (final row in visible)
                _ThreadCard(row: row, onOpen: () => _open(row), onFavorite: () => _toggleFavorite(row)),
            const SizedBox(height: 8),
            const _NoteCard(),
            const SizedBox(height: 12),
            OutlinedButton(
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.blue,
                side: const BorderSide(color: Color(0xFFD6E4FF)),
                backgroundColor: const Color(0xFFF4F8FF),
                minimumSize: const Size.fromHeight(52),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              onPressed: widget.onOpenOffers,
              child: const Row(
                children: [
                  SizedBox(width: 8),
                  Icon(Icons.local_offer_outlined),
                  SizedBox(width: 8),
                  Expanded(child: Text('Tekliflerime Git', style: TextStyle(fontWeight: FontWeight.w800))),
                  Icon(Icons.chevron_right),
                  SizedBox(width: 4),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label, required this.selected, required this.onTap, this.icon});

  final String label;
  final bool selected;
  final VoidCallback onTap;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? AppColors.blue : Colors.white,
      borderRadius: BorderRadius.circular(24),
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: selected ? AppColors.blue : const Color(0xFFE6EDF5)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 16, color: selected ? Colors.white : AppColors.ink),
                const SizedBox(width: 4),
              ],
              Text(label, style: TextStyle(color: selected ? Colors.white : AppColors.ink, fontWeight: FontWeight.w800)),
            ],
          ),
        ),
      ),
    );
  }
}

class _ThreadCard extends StatelessWidget {
  const _ThreadCard({required this.row, required this.onOpen, required this.onFavorite});

  final ConversationSummary row;
  final VoidCallback onOpen;
  final VoidCallback onFavorite;

  @override
  Widget build(BuildContext context) {
    final logo = mediaUrl(row.storeLogo);
    final initial = row.storeName.isEmpty ? '?' : row.storeName[0].toUpperCase();
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFE6EDF5)),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(22),
        onTap: onOpen,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 22,
                    backgroundColor: const Color(0xFFE8EFFF),
                    backgroundImage: logo.isEmpty ? null : NetworkImage(logo),
                    child: logo.isEmpty ? Text(initial, style: const TextStyle(color: AppColors.blue, fontWeight: FontWeight.w800)) : null,
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(row.storeName, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                        if (row.listingTitle.isNotEmpty)
                          Row(
                            children: [
                              const Icon(Icons.smartphone, size: 14, color: AppColors.muted),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(row.listingTitle, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(color: AppColors.muted, fontSize: 13)),
                              ),
                            ],
                          ),
                      ],
                    ),
                  ),
                  IconButton(
                    visualDensity: VisualDensity.compact,
                    onPressed: onFavorite,
                    icon: Icon(row.favorite ? Icons.star : Icons.star_border, color: const Color(0xFFF5A524)),
                  ),
                  if (row.lastAt != null)
                    Text(_clock(row.lastAt!), style: const TextStyle(color: AppColors.muted, fontSize: 12)),
                ],
              ),
              if ((row.lastBody ?? '').isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(row.lastBody!, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(color: AppColors.muted, height: 1.3)),
              ],
              if (row.offerPrice != null) ...[
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 10),
                  child: Divider(height: 1, color: Color(0xFFE6EDF5)),
                ),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Mağaza teklifi', style: TextStyle(color: AppColors.muted, fontSize: 12)),
                          Text(formatTry(row.offerPrice!), style: const TextStyle(color: AppColors.blue, fontSize: 22, fontWeight: FontWeight.w800)),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right, color: Color(0xFF8AA0B8)),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _NoteCard extends StatelessWidget {
  const _NoteCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF4F8FF),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE3EDFF)),
      ),
      child: const Row(
        children: [
          Icon(Icons.forum_outlined, color: AppColors.blue),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Her konuşma, doğru cihazla', style: TextStyle(fontWeight: FontWeight.w800)),
                SizedBox(height: 2),
                Text('Cihaz ve teklif bilgileri aynı konuşmada takip et.', style: TextStyle(color: AppColors.muted, fontSize: 12.5, height: 1.3)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

String _clock(DateTime value) {
  final local = value.toLocal();
  return '${local.hour.toString().padLeft(2, '0')}:${local.minute.toString().padLeft(2, '0')}';
}
