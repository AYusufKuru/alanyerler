import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../api/messages_api.dart';
import '../models/message.dart';
import '../models/offer.dart';
import '../theme.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key, required this.token});

  final String token;

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final _api = MessagesApi(ApiClient());
  var _loading = true;
  String? _error;
  List<AppNotification> _rows = const [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final rows = await _api.notifications(widget.token);
      if (!mounted) return;
      setState(() {
        _rows = rows;
        _loading = false;
      });
      await _api.markNotificationsRead(widget.token);
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() {
        _error = error.message;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bildirimler')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!))
              : _rows.isEmpty
                  ? const Center(child: Text('Henüz bildirimin yok.'))
                  : ListView(
                      children: [
                        for (final row in _rows)
                          ListTile(
                            title: Text(row.title, style: const TextStyle(fontWeight: FontWeight.w800)),
                            subtitle: Text(row.body),
                            trailing: Text(
                              offerClock(row.createdAt),
                              style: const TextStyle(color: AppColors.muted, fontSize: 12),
                            ),
                          ),
                      ],
                    ),
    );
  }
}
