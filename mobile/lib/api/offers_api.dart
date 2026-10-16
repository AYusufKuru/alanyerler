import '../models/offer.dart';
import 'api_client.dart';

class OffersApi {
  OffersApi(this._client);

  final ApiClient _client;

  Future<ListingDetail> listing(String token, String id) async {
    final result = await _client.get('/listings/$id', token: token);
    if (result is! Map) throw ApiException('İlan okunamadı.');
    return ListingDetail.fromJson(Map<String, dynamic>.from(result));
  }

  Future<List<CustomerOffer>> offers(String token, String listingId) async {
    final result = await _client.get('/listings/$listingId/offers', token: token);
    if (result is! List) throw ApiException('Teklifler okunamadı.');
    return result
        .whereType<Map>()
        .map((item) => CustomerOffer.fromJson(Map<String, dynamic>.from(item)))
        .toList();
  }

  Future<StoreProfile> store(String token, String id) async {
    final result = await _client.get('/stores/$id', token: token);
    if (result is! Map) throw ApiException('Mağaza okunamadı.');
    return StoreProfile.fromJson(Map<String, dynamic>.from(result));
  }

  Future<void> deleteListing(String token, String id) {
    return _client.delete('/listings/$id', token: token).then((_) {});
  }
}
