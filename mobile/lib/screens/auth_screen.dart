import 'package:flutter/material.dart';

import '../session/session_controller.dart';
import '../theme.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirm = TextEditingController();
  bool _register = false;
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    _confirm.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final email = _email.text.trim();
    final password = _password.text;
    String? error;
    if (!email.contains('@') || !email.contains('.')) {
      error = 'Geçerli bir e-posta girin.';
    } else if (password.length < 8) {
      error = 'Şifre en az 8 karakter olmalı.';
    } else if (_register) {
      if (_name.text.trim().length < 2) {
        error = 'Ad soyad en az 2 karakter olmalı.';
      } else if (password != _confirm.text) {
        error = 'Şifreler aynı değil.';
      }
    }
    if (error != null) {
      setState(() => _error = error);
      return;
    }

    setState(() {
      _busy = true;
      _error = null;
    });
    final session = SessionScope.of(context);
    final result = _register
        ? await session.register(
            name: _name.text.trim(),
            email: email,
            password: password,
          )
        : await session.login(email: email, password: password);
    if (!mounted) return;
    setState(() {
      _busy = false;
      _error = result;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(24, 36, 24, 24),
          children: [
            const Text(
              'Alan Yerler',
              style: TextStyle(
                color: AppColors.blue,
                fontWeight: FontWeight.w800,
                fontSize: 18,
              ),
            ),
            const SizedBox(height: 28),
            Text(
              _register ? 'Hesap oluştur' : 'Giriş yap',
              style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 8),
            Text(
              _register
                  ? 'E-posta ve şifreyle üye ol.'
                  : 'Kayıtlı e-posta ve şifrenle devam et.',
              style: const TextStyle(color: AppColors.muted, fontSize: 16),
            ),
            const SizedBox(height: 28),
            if (_register) ...[
              TextField(
                key: const Key('name'),
                controller: _name,
                textInputAction: TextInputAction.next,
                textCapitalization: TextCapitalization.words,
                decoration: const InputDecoration(labelText: 'Ad soyad'),
              ),
              const SizedBox(height: 12),
            ],
            TextField(
              key: const Key('email'),
              controller: _email,
              keyboardType: TextInputType.emailAddress,
              autocorrect: false,
              textInputAction: TextInputAction.next,
              decoration: const InputDecoration(labelText: 'E-posta'),
            ),
            const SizedBox(height: 12),
            TextField(
              key: const Key('password'),
              controller: _password,
              obscureText: true,
              textInputAction: _register ? TextInputAction.next : TextInputAction.done,
              onSubmitted: (_) {
                if (!_register) _submit();
              },
              decoration: const InputDecoration(labelText: 'Şifre'),
            ),
            if (_register) ...[
              const SizedBox(height: 12),
              TextField(
                key: const Key('confirm'),
                controller: _confirm,
                obscureText: true,
                onSubmitted: (_) => _submit(),
                decoration: const InputDecoration(labelText: 'Şifre tekrar'),
              ),
            ],
            if (_error != null) ...[
              const SizedBox(height: 14),
              Text(_error!, style: const TextStyle(color: Color(0xFFB42318))),
            ],
            const SizedBox(height: 20),
            PrimaryButton(
              label: _register ? 'Kayıt ol' : 'Giriş yap',
              busy: _busy,
              onPressed: _submit,
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: _busy
                  ? null
                  : () => setState(() {
                        _register = !_register;
                        _error = null;
                      }),
              child: Text(
                _register ? 'Hesabın var mı? Giriş yap' : 'Hesabın yok mu? Kayıt ol',
              ),
            ),
          ],
        ),
      ),
    );
  }
}
