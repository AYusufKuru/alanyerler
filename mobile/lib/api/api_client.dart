import 'dart:convert';

import 'package:http/http.dart' as http;

import '../api_config.dart';

class ApiException implements Exception {
  ApiException(this.message);

  final String message;
}

class ApiClient {
  ApiClient({http.Client? client, String? baseUrl})
      : _client = client ?? http.Client(),
        _baseUrl = baseUrl ?? apiBaseUrl();

  final http.Client _client;
  final String _baseUrl;

  Future<dynamic> get(String path, {String? token}) {
    return _send('GET', path, token: token);
  }

  Future<dynamic> post(
    String path, {
    Map<String, dynamic>? body,
    String? token,
  }) {
    return _send('POST', path, body: body, token: token);
  }

  Future<dynamic> delete(String path, {String? token}) {
    return _send('DELETE', path, token: token);
  }

  Future<dynamic> patch(
    String path, {
    Map<String, dynamic>? body,
    String? token,
  }) {
    return _send('PATCH', path, body: body, token: token);
  }

  Future<dynamic> _send(
    String method,
    String path, {
    Map<String, dynamic>? body,
    String? token,
  }) async {
    try {
      final request = http.Request(method, Uri.parse('$_baseUrl$path'));
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      if (body != null) {
        request.headers['Content-Type'] = 'application/json';
        request.body = jsonEncode(body);
      }
      final response = await _client.send(request).timeout(const Duration(seconds: 15));
      final text = await response.stream.bytesToString();
      final decoded = text.isEmpty ? null : jsonDecode(text);
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return decoded;
      }
      final message = decoded is Map && decoded['message'] is String
          ? decoded['message'] as String
          : 'İstek tamamlanamadı.';
      throw ApiException(message);
    } on ApiException {
      rethrow;
    } catch (_) {
      throw ApiException('Sunucuya bağlanılamadı.');
    }
  }
}
