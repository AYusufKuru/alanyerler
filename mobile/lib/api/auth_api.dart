import 'api_client.dart';

class AuthUser {
  const AuthUser({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
  });

  final String id;
  final String name;
  final String email;
  final String role;

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'role': role,
      };
}

class AuthSession {
  const AuthSession({required this.accessToken, required this.user});

  final String accessToken;
  final AuthUser user;
}

class AuthApi {
  AuthApi(this._client);

  final ApiClient _client;

  Future<AuthSession> register({
    required String name,
    required String email,
    required String password,
  }) {
    return _auth('/auth/register', {
      'name': name,
      'email': email,
      'password': password,
    });
  }

  Future<AuthSession> login({
    required String email,
    required String password,
  }) {
    return _auth('/auth/login', {
      'email': email,
      'password': password,
    });
  }

  Future<AccountProfile> account(String token) async {
    final result = await _client.get('/auth/account', token: token);
    if (result is! Map) throw ApiException('Hesap okunamadı.');
    return AccountProfile.fromJson(Map<String, dynamic>.from(result));
  }

  Future<AccountProfile> updateAccount(String token, Map<String, dynamic> body) async {
    final result = await _client.patch('/auth/account', token: token, body: body);
    if (result is! Map) throw ApiException('Hesap kaydedilemedi.');
    return AccountProfile.fromJson(Map<String, dynamic>.from(result));
  }

  Future<List<SaleRow>> sales(String token) async {
    final result = await _client.get('/auth/account/sales', token: token);
    if (result is! List) throw ApiException('Satışlar okunamadı.');
    return result.whereType<Map>().map((item) => SaleRow.fromJson(Map<String, dynamic>.from(item))).toList();
  }

  Future<AccountPage> page(String key) async {
    final result = await _client.get('/auth/account/pages/$key');
    if (result is! Map) throw ApiException('Sayfa okunamadı.');
    return AccountPage.fromJson(Map<String, dynamic>.from(result));
  }

  Future<void> deleteAccount(String token, String password) async {
    await _client.delete('/auth/account', token: token, body: {'password': password});
  }

  Future<void> changePassword({
    required String token,
    required String currentPassword,
    required String newPassword,
  }) async {
    await _client.post(
      '/auth/change-password',
      token: token,
      body: {
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      },
    );
  }

  Future<int> categoryCount(String token) async {
    final result = await _client.get('/categories', token: token);
    if (result is! List) {
      throw ApiException('Katalog okunamadı.');
    }
    return result.length;
  }

  Future<AuthSession> _auth(String path, Map<String, dynamic> body) async {
    final result = await _client.post(path, body: body);
    if (result is! Map<String, dynamic>) {
      throw ApiException('Sunucu cevabı okunamadı.');
    }
    final user = result['user'];
    final token = result['accessToken'];
    if (user is! Map<String, dynamic> || token is! String) {
      throw ApiException('Sunucu cevabı okunamadı.');
    }
    return AuthSession(accessToken: token, user: AuthUser.fromJson(user));
  }
}

class AccountProfile {
  const AccountProfile({
    required this.name,
    required this.email,
    required this.phoneVerified,
    required this.phoneVerification,
    required this.notifyOffers,
    required this.notifyMessages,
    required this.messageNotices,
    this.phone,
  });

  final String name;
  final String email;
  final String? phone;
  final bool phoneVerified;
  final String phoneVerification;
  final bool notifyOffers;
  final bool notifyMessages;
  final String messageNotices;

  factory AccountProfile.fromJson(Map<String, dynamic> json) {
    return AccountProfile(
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      phone: json['phone'] as String?,
      phoneVerified: json['phoneVerified'] == true,
      phoneVerification: json['phoneVerification'] as String? ?? '',
      notifyOffers: json['notifyOffers'] != false,
      notifyMessages: json['notifyMessages'] != false,
      messageNotices: json['messageNotices'] as String? ?? '',
    );
  }
}

class SaleRow {
  const SaleRow({required this.title, required this.storeName, this.price, this.saleLabel = ''});

  final String title;
  final String storeName;
  final double? price;
  final String saleLabel;

  factory SaleRow.fromJson(Map<String, dynamic> json) {
    return SaleRow(
      title: json['title'] as String? ?? '',
      storeName: json['storeName'] as String? ?? '',
      price: json['price'] is num ? (json['price'] as num).toDouble() : null,
      saleLabel: json['saleLabel'] as String? ?? '',
    );
  }
}

class AccountPage {
  const AccountPage({required this.title, required this.body});

  final String title;
  final List<String> body;

  factory AccountPage.fromJson(Map<String, dynamic> json) {
    final body = json['body'];
    return AccountPage(
      title: json['title'] as String? ?? '',
      body: body is List ? body.whereType<String>().toList() : const [],
    );
  }
}
