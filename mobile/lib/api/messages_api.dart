import '../models/message.dart';
import 'api_client.dart';

class MessagesApi {
  MessagesApi(this._client);

  final ApiClient _client;

  Future<List<ConversationSummary>> list(String token, {String filter = 'all', String query = ''}) async {
    final path = '/conversations?filter=$filter&q=${Uri.encodeQueryComponent(query)}';
    final result = await _client.get(path, token: token);
    if (result is! List) throw ApiException('Konuşmalar okunamadı.');
    return result
        .whereType<Map>()
        .map((item) => ConversationSummary.fromJson(Map<String, dynamic>.from(item)))
        .toList();
  }

  Future<ConversationDetail> open(String token, String listingId, String storeId) async {
    final result = await _client.post(
      '/conversations',
      token: token,
      body: {'listingId': listingId, 'storeId': storeId},
    );
    return _detail(result);
  }

  Future<ConversationDetail> one(String token, String id) async {
    return _detail(await _client.get('/conversations/$id', token: token));
  }

  Future<ConversationDetail> send(String token, String id, String body) async {
    return _detail(
      await _client.post('/conversations/$id/messages', token: token, body: {'body': body}),
    );
  }

  Future<ConversationDetail> favorite(String token, String id, bool on) async {
    if (on) {
      return _detail(await _client.post('/conversations/$id/favorite', token: token));
    }
    return _detail(await _client.delete('/conversations/$id/favorite', token: token));
  }

  Future<List<AppNotification>> notifications(String token) async {
    final result = await _client.get('/notifications', token: token);
    if (result is! List) throw ApiException('Bildirimler okunamadı.');
    return result
        .whereType<Map>()
        .map((item) => AppNotification.fromJson(Map<String, dynamic>.from(item)))
        .toList();
  }

  Future<void> markNotificationsRead(String token) {
    return _client.post('/notifications/read', token: token, body: {}).then((_) {});
  }

  ConversationDetail _detail(dynamic result) {
    if (result is! Map) throw ApiException('Konuşma okunamadı.');
    return ConversationDetail.fromJson(Map<String, dynamic>.from(result));
  }
}
