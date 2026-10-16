import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../api/auth_api.dart';
import '../models/offer.dart';
import '../theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({
    super.key,
    required this.token,
    required this.onLogout,
  });

  final String token;
  final VoidCallback onLogout;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: FutureBuilder<AccountProfile>(
        future: AuthApi(ApiClient()).account(token),
        builder: (context, snapshot) {
          final profile = snapshot.data;
          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 96),
            children: [
              const Text('Profil', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
              const SizedBox(height: 12),
              Text(profile?.name ?? '', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
              Text(profile?.email ?? '', style: const TextStyle(color: AppColors.muted)),
              if (snapshot.hasError)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text('${snapshot.error}', style: const TextStyle(color: Color(0xFFB42318))),
                ),
              const SizedBox(height: 16),
              _tile(context, 'Hesap bilgilerim', const _AccountPage()),
              _tile(context, 'Telefon numarası', const _PhonePage()),
              _tile(context, 'Telefon doğrulama', const _PhoneStatusPage()),
              _tile(context, 'Satış geçmişim', const _SalesPage()),
              _tile(context, 'Değerlendirmelerim', const _NotePage(
                title: 'Değerlendirmelerim',
                body: 'Mağaza değerlendirmesi henüz hesaba yazılmıyor.',
              )),
              _tile(context, 'Favori mağazalar', const _NotePage(
                title: 'Favori mağazalar',
                body: 'Mağaza takibi henüz hesaba yazılmıyor.',
              )),
              _tile(context, 'Bildirim ayarları', const _NotifyPage()),
              _tile(context, 'Şifre değiştir', const _PasswordPage()),
              _tile(context, 'Yardım / Destek', const _LegalPage(pageKey: 'help')),
              _tile(context, 'Sıkça Sorulan Sorular', const _LegalPage(pageKey: 'faq')),
              _tile(context, 'Gizlilik Politikası', const _LegalPage(pageKey: 'privacy')),
              _tile(context, 'Kullanım Koşulları', const _LegalPage(pageKey: 'terms')),
              _tile(context, 'KVKK', const _LegalPage(pageKey: 'kvkk')),
              _tile(context, 'Hesabımı sil', const _DeletePage()),
              const SizedBox(height: 8),
              PrimaryButton(label: 'Çıkış yap', onPressed: onLogout),
            ],
          );
        },
      ),
    );
  }

  Widget _tile(BuildContext context, String title, Widget page) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
      trailing: const Icon(Icons.chevron_right),
      onTap: () {
        Navigator.of(context).push(MaterialPageRoute<void>(
          builder: (context) => _ProfileScaffold(title: title, token: token, onLogout: onLogout, child: page),
        ));
      },
    );
  }
}

class _ProfileScaffold extends StatelessWidget {
  const _ProfileScaffold({
    required this.title,
    required this.token,
    required this.onLogout,
    required this.child,
  });

  final String title;
  final String token;
  final Widget child;
  final VoidCallback onLogout;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: child is _DeletePage
            ? _DeletePage(token: token, onDeleted: onLogout)
            : _withToken(child, token),
      ),
    );
  }

  Widget _withToken(Widget child, String token) {
    if (child is _AccountPage) return _AccountPage(token: token);
    if (child is _PhonePage) return _PhonePage(token: token);
    if (child is _PhoneStatusPage) return _PhoneStatusPage(token: token);
    if (child is _SalesPage) return _SalesPage(token: token);
    if (child is _NotifyPage) return _NotifyPage(token: token);
    if (child is _PasswordPage) return _PasswordPage(token: token);
    if (child is _LegalPage) return _LegalPage(pageKey: child.pageKey);
    return child;
  }
}

class _AccountPage extends StatefulWidget {
  const _AccountPage({this.token = ''});
  final String token;
  @override
  State<_AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<_AccountPage> {
  final _name = TextEditingController();
  final _api = AuthApi(ApiClient());
  var _email = '';
  var _ready = false;
  var _busy = false;
  String? _message;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final profile = await _api.account(widget.token);
    if (!mounted) return;
    _name.text = profile.name;
    setState(() {
      _email = profile.email;
      _ready = true;
    });
  }

  Future<void> _save() async {
    setState(() => _busy = true);
    try {
      await _api.updateAccount(widget.token, {'name': _name.text.trim()});
      if (mounted) setState(() => _message = 'Kaydedildi.');
    } on ApiException catch (error) {
      if (mounted) setState(() => _message = error.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_ready) return const LinearProgressIndicator();
    return ListView(
      children: [
        TextField(controller: _name, decoration: const InputDecoration(labelText: 'Ad')),
        const SizedBox(height: 12),
        Text(_email, style: const TextStyle(color: AppColors.muted)),
        if (_message != null) ...[const SizedBox(height: 8), Text(_message!)],
        const SizedBox(height: 16),
        PrimaryButton(label: 'Kaydet', busy: _busy, onPressed: _save),
      ],
    );
  }
}

class _PhonePage extends StatefulWidget {
  const _PhonePage({this.token = ''});
  final String token;
  @override
  State<_PhonePage> createState() => _PhonePageState();
}

class _PhonePageState extends State<_PhonePage> {
  final _phone = TextEditingController();
  final _api = AuthApi(ApiClient());
  var _busy = false;
  String? _message;

  @override
  void initState() {
    super.initState();
    _api.account(widget.token).then((profile) {
      if (mounted) _phone.text = profile.phone ?? '';
    });
  }

  @override
  void dispose() {
    _phone.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _busy = true);
    try {
      final profile = await _api.updateAccount(widget.token, {'phone': _phone.text.trim()});
      if (mounted) setState(() => _message = profile.phone == null ? 'Telefon silindi.' : 'Telefon kaydedildi.');
    } on ApiException catch (error) {
      if (mounted) setState(() => _message = error.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        TextField(controller: _phone, keyboardType: TextInputType.phone, decoration: const InputDecoration(labelText: 'Telefon')),
        if (_message != null) ...[const SizedBox(height: 8), Text(_message!)],
        const SizedBox(height: 16),
        PrimaryButton(label: 'Kaydet', busy: _busy, onPressed: _save),
      ],
    );
  }
}

class _PhoneStatusPage extends StatelessWidget {
  const _PhoneStatusPage({this.token = ''});
  final String token;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<AccountProfile>(
      future: AuthApi(ApiClient()).account(token),
      builder: (context, snapshot) {
        final profile = snapshot.data;
        if (profile == null) return const LinearProgressIndicator();
        return ListView(
          children: [
            Text(profile.phone ?? 'Telefon kayıtlı değil', style: const TextStyle(fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            Text(profile.phoneVerified ? 'Doğrulandı' : 'Doğrulanmadı'),
            const SizedBox(height: 8),
            Text(profile.phoneVerification, style: const TextStyle(color: AppColors.muted, height: 1.4)),
          ],
        );
      },
    );
  }
}

class _SalesPage extends StatelessWidget {
  const _SalesPage({this.token = ''});
  final String token;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<SaleRow>>(
      future: AuthApi(ApiClient()).sales(token),
      builder: (context, snapshot) {
        final rows = snapshot.data;
        if (snapshot.hasError) return Text('${snapshot.error}');
        if (rows == null) return const LinearProgressIndicator();
        if (rows.isEmpty) return const Text('Kabul edilmiş satış yok.');
        return ListView(
          children: [
            for (final row in rows)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(row.title, style: const TextStyle(fontWeight: FontWeight.w800)),
                    if (row.storeName.isNotEmpty) Text(row.storeName),
                    if (row.price != null) Text(formatTry(row.price!)),
                    if (row.saleLabel.isNotEmpty) Text(row.saleLabel),
                  ],
                ),
              ),
          ],
        );
      },
    );
  }
}

class _NotifyPage extends StatefulWidget {
  const _NotifyPage({this.token = ''});
  final String token;
  @override
  State<_NotifyPage> createState() => _NotifyPageState();
}

class _NotifyPageState extends State<_NotifyPage> {
  AccountProfile? _profile;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final profile = await AuthApi(ApiClient()).account(widget.token);
      if (mounted) setState(() => _profile = profile);
    } on ApiException catch (error) {
      if (mounted) setState(() => _error = error.message);
    }
  }

  Future<void> _set(Map<String, dynamic> body) async {
    try {
      final profile = await AuthApi(ApiClient()).updateAccount(widget.token, body);
      if (mounted) setState(() => _profile = profile);
    } on ApiException catch (error) {
      if (mounted) setState(() => _error = error.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = _profile;
    if (_error != null && profile == null) return Text(_error!);
    if (profile == null) return const LinearProgressIndicator();
    return ListView(
      children: [
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Teklif bildirimleri'),
          value: profile.notifyOffers,
          onChanged: (value) => _set({'notifyOffers': value}),
        ),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Mesaj bildirimi tercihi'),
          subtitle: Text(profile.messageNotices),
          value: profile.notifyMessages,
          onChanged: (value) => _set({'notifyMessages': value}),
        ),
      ],
    );
  }
}

class _PasswordPage extends StatefulWidget {
  const _PasswordPage({this.token = ''});
  final String token;
  @override
  State<_PasswordPage> createState() => _PasswordPageState();
}

class _PasswordPageState extends State<_PasswordPage> {
  final _current = TextEditingController();
  final _next = TextEditingController();
  var _busy = false;
  String? _message;

  @override
  void dispose() {
    _current.dispose();
    _next.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() => _busy = true);
    try {
      await AuthApi(ApiClient()).changePassword(
        token: widget.token,
        currentPassword: _current.text,
        newPassword: _next.text,
      );
      _current.clear();
      _next.clear();
      if (mounted) setState(() => _message = 'Şifre güncellendi.');
    } on ApiException catch (error) {
      if (mounted) setState(() => _message = error.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        TextField(controller: _current, obscureText: true, decoration: const InputDecoration(labelText: 'Mevcut şifre')),
        const SizedBox(height: 12),
        TextField(controller: _next, obscureText: true, decoration: const InputDecoration(labelText: 'Yeni şifre')),
        if (_message != null) ...[const SizedBox(height: 8), Text(_message!)],
        const SizedBox(height: 16),
        PrimaryButton(label: 'Şifreyi kaydet', busy: _busy, onPressed: _save),
      ],
    );
  }
}

class _LegalPage extends StatelessWidget {
  const _LegalPage({required this.pageKey});
  final String pageKey;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<AccountPage>(
      future: AuthApi(ApiClient()).page(pageKey),
      builder: (context, snapshot) {
        final page = snapshot.data;
        if (snapshot.hasError) return Text('${snapshot.error}');
        if (page == null) return const LinearProgressIndicator();
        return ListView(
          children: [
            for (final paragraph in page.body)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Text(paragraph, style: const TextStyle(height: 1.45)),
              ),
          ],
        );
      },
    );
  }
}

class _NotePage extends StatelessWidget {
  const _NotePage({required this.title, required this.body});
  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    return Text(body, style: const TextStyle(height: 1.45));
  }
}

class _DeletePage extends StatefulWidget {
  const _DeletePage({this.token = '', this.onDeleted});
  final String token;
  final VoidCallback? onDeleted;

  @override
  State<_DeletePage> createState() => _DeletePageState();
}

class _DeletePageState extends State<_DeletePage> {
  final _password = TextEditingController();
  var _busy = false;
  String? _error;

  @override
  void dispose() {
    _password.dispose();
    super.dispose();
  }

  Future<void> _delete() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await AuthApi(ApiClient()).deleteAccount(widget.token, _password.text);
      widget.onDeleted?.call();
    } on ApiException catch (error) {
      if (mounted) setState(() => _error = error.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        const Text(
          'Hesap silinince ilanların, fotoğrafların, mesajların ve bildirimlerin de silinir. Bu işlem geri alınmaz.',
          style: TextStyle(height: 1.45),
        ),
        const SizedBox(height: 12),
        TextField(controller: _password, obscureText: true, decoration: const InputDecoration(labelText: 'Şifre')),
        if (_error != null) ...[
          const SizedBox(height: 8),
          Text(_error!, style: const TextStyle(color: Color(0xFFB42318))),
        ],
        const SizedBox(height: 16),
        PrimaryButton(label: 'Hesabımı sil', busy: _busy, onPressed: _delete),
      ],
    );
  }
}
