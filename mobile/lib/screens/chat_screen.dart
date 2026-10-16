import 'dart:async';

import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../api/messages_api.dart';
import '../models/message.dart';
import '../models/offer.dart';
import '../theme.dart';

Future<void> openStoreChat(
  BuildContext context, {
  required String token,
  required String listingId,
  required String storeId,
}) async {
  try {
    final detail = await MessagesApi(ApiClient()).open(token, listingId, storeId);
    if (!context.mounted) return;
    await Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => ChatScreen(token: token, initial: detail),
      ),
    );
  } on ApiException catch (error) {
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.message)));
  }
}

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key, required this.token, required this.initial});

  final String token;
  final ConversationDetail initial;

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _api = MessagesApi(ApiClient());
  final _input = TextEditingController();
  final _scroll = ScrollController();
  late ConversationDetail _detail = widget.initial;
  var _sending = false;
  String? _error;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 4), (_) => _refresh());
    WidgetsBinding.instance.addPostFrameCallback((_) => _toEnd());
  }

  @override
  void dispose() {
    _timer?.cancel();
    _input.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _refresh() async {
    if (_sending) return;
    try {
      final next = await _api.one(widget.token, _detail.id);
      if (!mounted) return;
      final grew = next.messages.length != _detail.messages.length;
      setState(() => _detail = next);
      if (grew) _toEnd();
    } on ApiException {
      return;
    }
  }

  void _toEnd() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scroll.hasClients) return;
      _scroll.jumpTo(_scroll.position.maxScrollExtent);
    });
  }

  Future<void> _send() async {
    final text = _input.text.trim();
    if (text.isEmpty || _sending) return;
    setState(() {
      _sending = true;
      _error = null;
    });
    try {
      final next = await _api.send(widget.token, _detail.id, text);
      if (!mounted) return;
      _input.clear();
      setState(() => _detail = next);
      _toEnd();
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() => _error = error.message);
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  Future<void> _favorite() async {
    try {
      final next = await _api.favorite(widget.token, _detail.id, !_detail.favorite);
      if (mounted) setState(() => _detail = next);
    } on ApiException catch (error) {
      if (mounted) setState(() => _error = error.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(_detail.storeName),
            Text(_detail.listingTitle, style: const TextStyle(fontSize: 12, color: AppColors.muted)),
          ],
        ),
        actions: [
          IconButton(
            onPressed: _favorite,
            icon: Icon(_detail.favorite ? Icons.star : Icons.star_border, color: const Color(0xFFF5A524)),
          ),
        ],
      ),
      body: Column(
        children: [
          if (_detail.offerPrice != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Teklif: ${formatTry(_detail.offerPrice!)}',
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
              ),
            ),
          Expanded(
            child: ListView(
              controller: _scroll,
              padding: const EdgeInsets.all(16),
              children: [
                if (_detail.messages.isEmpty)
                  const Text(
                    'Mağazayla satışı buradan konuşabilirsin.',
                    style: TextStyle(color: AppColors.muted),
                  ),
                for (final message in _detail.messages)
                  Align(
                    alignment: message.mine ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      constraints: const BoxConstraints(maxWidth: 280),
                      decoration: BoxDecoration(
                        color: message.mine ? AppColors.blue : AppColors.canvas,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (!message.mine)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 4),
                              child: Text(
                                _detail.storeName,
                                style: const TextStyle(color: AppColors.muted, fontSize: 12, fontWeight: FontWeight.w700),
                              ),
                            ),
                          Text(
                            message.body,
                            style: TextStyle(color: message.mine ? Colors.white : AppColors.ink, height: 1.3),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
          if (_error != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(_error!, style: const TextStyle(color: Color(0xFFB42318))),
            ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
              child: _detail.canSend
                  ? Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _input,
                            minLines: 1,
                            maxLines: 4,
                            decoration: const InputDecoration(hintText: 'Mesajını yazın...'),
                          ),
                        ),
                        IconButton(
                          onPressed: _sending ? null : _send,
                          icon: const Icon(Icons.send, color: AppColors.blue),
                        ),
                      ],
                    )
                  : const Text(
                      'Kapalı ilana mesaj gönderilmez. Eski mesajlar durur.',
                      style: TextStyle(color: AppColors.muted),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
