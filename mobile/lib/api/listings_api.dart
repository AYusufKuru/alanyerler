import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

import '../api_config.dart';
import '../photo_bytes.dart';
import 'api_client.dart';

class ListingsApi {
  ListingsApi({String? baseUrl}) : _baseUrl = baseUrl ?? apiBaseUrl();

  final String _baseUrl;

  Future<({String id, String title})> submit({
    required String token,
    required String categoryId,
    required String deviceTypeId,
    required Map<String, String> specs,
    required Map<String, String> condition,
    required List<XFile> photos,
  }) async {
    try {
      final request = http.MultipartRequest('POST', Uri.parse('$_baseUrl/listings/submit'));
      request.headers['Authorization'] = 'Bearer $token';
      request.fields['categoryId'] = categoryId;
      request.fields['deviceTypeId'] = deviceTypeId;
      request.fields['specs'] = jsonEncode(specs);
      request.fields['condition'] = jsonEncode(condition);
      for (final photo in photos) {
        request.files.add(await photoPart(photo));
      }
      final response = await request.send().timeout(const Duration(seconds: 60));
      final text = await response.stream.bytesToString();
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final decoded = text.isEmpty ? null : jsonDecode(text);
        final id = decoded is Map && decoded['id'] is String ? decoded['id'] as String : '';
        final title = decoded is Map && decoded['title'] is String ? decoded['title'] as String : '';
        return (id: id, title: title);
      }
      final decoded = text.isEmpty ? null : jsonDecode(text);
      final message = decoded is Map && decoded['message'] is String
          ? decoded['message'] as String
          : 'İlan gönderilemedi.';
      throw ApiException(message);
    } on ApiException {
      rethrow;
    } catch (_) {
      throw ApiException('Sunucuya bağlanılamadı.');
    }
  }
}
