import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../api/api_client.dart';
import '../api/auth_api.dart';

class SessionController extends ChangeNotifier {
  SessionController({AuthApi? authApi})
      : _authApi = authApi ?? AuthApi(ApiClient());

  static const _seenKey = 'seen_onboarding';
  static const _tokenKey = 'access_token';
  static const _userKey = 'user';

  final AuthApi _authApi;

  AuthUser? user;
  String? token;
  bool ready = false;
  bool seenOnboarding = false;

  Future<void> restore() async {
    final prefs = await SharedPreferences.getInstance();
    seenOnboarding = prefs.getBool(_seenKey) ?? false;
    token = prefs.getString(_tokenKey);
    final rawUser = prefs.getString(_userKey);
    if (token != null && rawUser != null) {
      user = AuthUser.fromJson(
        jsonDecode(rawUser) as Map<String, dynamic>,
      );
    }
    ready = true;
    notifyListeners();
  }

  Future<void> finishOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_seenKey, true);
    seenOnboarding = true;
    notifyListeners();
  }

  Future<String?> register({
    required String name,
    required String email,
    required String password,
  }) {
    return _save(() => _authApi.register(
          name: name,
          email: email,
          password: password,
        ));
  }

  Future<String?> login({
    required String email,
    required String password,
  }) {
    return _save(() => _authApi.login(email: email, password: password));
  }

  Future<int> categoryCount() {
    final current = token;
    if (current == null) {
      throw ApiException('Oturum bulunamadı.');
    }
    return _authApi.categoryCount(current);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
    token = null;
    user = null;
    notifyListeners();
  }

  Future<String?> _save(Future<AuthSession> Function() action) async {
    try {
      final session = await action();
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_tokenKey, session.accessToken);
      await prefs.setString(_userKey, jsonEncode(session.user.toJson()));
      token = session.accessToken;
      user = session.user;
      notifyListeners();
      return null;
    } on ApiException catch (error) {
      return error.message;
    }
  }
}

class SessionScope extends InheritedNotifier<SessionController> {
  const SessionScope({
    super.key,
    required SessionController controller,
    required super.child,
  }) : super(notifier: controller);

  static SessionController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<SessionScope>();
    assert(scope != null, 'SessionScope bulunamadı.');
    return scope!.notifier!;
  }
}
