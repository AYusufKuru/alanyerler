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
  const MessagesScreen({super.key, required this.token});

  final String token;

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
      final rows = await _api.list(widget.token, filter: _filter, query: _search.text);
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

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
            child: Text('Mesajlar', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: TextField(
              controller: _search,
              decoration: const InputDecoration(hintText: 'Mağaza ara'),
              onSubmitted: (_) => _load(),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 0),
            child: Row(
              children: [
                _Filter(label: 'Tümü', selected: _filter == 'all', onTap: () => _setFilter('all')),
                _Filter(label: 'Tekliflerim', selected: _filter == 'offers', onTap: () => _setFilter('offers')),
                _Filter(label: 'Favoriler', selected: _filter == 'favorites', onTap: () => _setFilter('favorites')),
              ],
            ),
          ),
          if (_loading) const LinearProgressIndicator(),
          if (_error != null)
            Padding(
              padding: const EdgeInsets.all(20),
              child: Text(_error!, style: const TextStyle(color: Color(0xFFB42318))),
            ),
          Expanded(
            child: _rows.isEmpty && !_loading
                ? const Padding(
                    padding: EdgeInsets.all(20),
                    child: Text(
                      'Henüz konuşma yok. Teklif detayından mağazaya yazabilirsin.',
                      style: TextStyle(color: AppColors.muted, height: 1.4),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(12, 8, 12, 96),
                    itemCount: _rows.length,
                    itemBuilder: (context, index) {
                      final row = _rows[index];
                      final logo = mediaUrl(row.storeLogo);
                      return ListTile(
                        onTap: () => _open(row),
                        leading: logo.isEmpty
                            ? CircleAvatar(
                                backgroundColor: const Color(0xFFE8EFFF),
                                child: Text(
                                  row.storeName.isEmpty ? '?' : row.storeName[0].toUpperCase(),
                                  style: const TextStyle(color: AppColors.blue, fontWeight: FontWeight.w800),
                                ),
                              )
                            : CircleAvatar(backgroundImage: NetworkImage(logo)),
                        title: Text(row.storeName, style: const TextStyle(fontWeight: FontWeight.w800)),
                        subtitle: Text(
                          row.lastBody ?? row.listingTitle,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        trailing: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            if (row.lastAt != null)
                              Text(offerClock(row.lastAt!), style: const TextStyle(fontSize: 12, color: AppColors.muted)),
                            if (row.unreadCount > 0)
                              Container(
                                margin: const EdgeInsets.only(top: 4),
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.blue,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  '${row.unreadCount}',
                                  style: const TextStyle(color: Colors.white, fontSize: 12),
                                ),
                              ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  void _setFilter(String filter) {
    setState(() => _filter = filter);
    _load();
  }
}

class _Filter extends StatelessWidget {
  const _Filter({required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onTap,
      child: Text(
        label,
        style: TextStyle(
          color: selected ? AppColors.blue : AppColors.muted,
          fontWeight: selected ? FontWeight.w800 : FontWeight.w600,
        ),
      ),
    );
  }
}
