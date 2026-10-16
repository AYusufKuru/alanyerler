import '../models/catalog.dart';
import 'api_client.dart';

class CatalogApi {
  CatalogApi(this._client);

  final ApiClient _client;

  Future<List<CategoryModel>> categories(String token) async {
    final result = await _client.get('/categories', token: token);
    if (result is! List) {
      throw ApiException('Katalog okunamadı.');
    }
    return result
        .whereType<Map>()
        .map((item) => CategoryModel.fromJson(Map<String, dynamic>.from(item)))
        .toList();
  }

  Future<List<ListingSummary>> listings(String token) async {
    final result = await _client.get('/listings', token: token);
    if (result is! List) {
      throw ApiException('İlanlar okunamadı.');
    }
    return result
        .whereType<Map>()
        .map((item) => ListingSummary.fromJson(Map<String, dynamic>.from(item)))
        .toList();
  }
}
