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
