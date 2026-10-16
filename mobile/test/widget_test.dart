import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:alan_yerler/main.dart';
import 'package:alan_yerler/models/catalog.dart';
import 'package:alan_yerler/screens/sell_wizard.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Açılış ekranı gelir', (tester) async {
    SharedPreferences.setMockInitialValues({});
    await tester.pumpWidget(const AlanYerlerApp());
    await tester.pumpAndSettle();

    expect(find.text('Cihazını Sat,\nEn İyi Teklifi Bul.'), findsOneWidget);
  });

  testWidgets('Geç ile giriş ekranına geçer', (tester) async {
    SharedPreferences.setMockInitialValues({});
    await tester.pumpWidget(const AlanYerlerApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Geç'));
    await tester.pumpAndSettle();

    expect(find.text('Giriş yap'), findsWidgets);
    expect(find.text('E-posta'), findsOneWidget);
  });

  testWidgets('Kısa şifre kayıtta durur', (tester) async {
    SharedPreferences.setMockInitialValues({'seen_onboarding': true});
    await tester.pumpWidget(const AlanYerlerApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Hesabın yok mu? Kayıt ol'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byKey(const Key('name')), 'Ayse Yilmaz');
    await tester.enterText(find.byKey(const Key('email')), 'ayse@example.com');
    await tester.enterText(find.byKey(const Key('password')), 'kisa');
    await tester.enterText(find.byKey(const Key('confirm')), 'kisa');
    await tester.tap(find.widgetWithText(FilledButton, 'Kayıt ol'));
    await tester.pump();

    expect(find.text('Şifre en az 8 karakter olmalı.'), findsOneWidget);
  });

  testWidgets('Cihaz türü seçilmeden devam edilmez', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: SellWizard(
          token: '',
          categories: [
            CategoryModel(
              id: 'c1',
              name: 'Telefon',
              slug: 'telefon',
              deviceTypes: [
                DeviceTypeModel(
                  id: 'd1',
                  name: 'iPhone',
                  slug: 'iphone',
                  specFields: [
                    CatalogField(
                      key: 'marka',
                      label: 'Marka',
                      required: true,
                      options: ['Apple'],
                    ),
                  ],
                  conditionFields: [],
                ),
              ],
            ),
          ],
        ),
      ),
    );

    await tester.tap(find.widgetWithText(FilledButton, 'Devam Et'));
    await tester.pump();
    expect(find.text('Cihaz türü seçin.'), findsOneWidget);

    await tester.drag(find.byType(ListView), const Offset(0, -240));
    await tester.pumpAndSettle();
    await tester.tap(find.text('iPhone'));
    await tester.pump();
    await tester.tap(find.widgetWithText(FilledButton, 'Devam Et'));
    await tester.pump();
    expect(find.text('iPhone\'unuzun özellikleri'), findsOneWidget);
  });

  testWidgets('Cihaz sat ekranında ürün kartları var', (tester) async {
    DeviceTypeModel type(String slug, String name) {
      return DeviceTypeModel(
        id: slug,
        name: name,
        slug: slug,
        specFields: const [],
        conditionFields: const [],
      );
    }

    CategoryModel category(String slug, String name, List<DeviceTypeModel> types) {
      return CategoryModel(id: slug, name: name, slug: slug, deviceTypes: types);
    }

    await tester.pumpWidget(
      MaterialApp(
        home: SellWizard(
          token: '',
          categories: [
            category('bilgisayar', 'Bilgisayar', [
              type('laptop', 'Laptop'),
              type('masaustu', 'Masaüstü'),
              type('macbook', 'MacBook'),
              type('mac-masaustu', 'Mac Masaüstü'),
            ]),
            category('telefon', 'Telefon', [type('iphone', 'iPhone')]),
            category('tablet', 'Tablet', [type('ipad', 'iPad')]),
            category('oyun-konsolu', 'Oyun Konsolu', [type('playstation', 'PlayStation')]),
            category('ekran-karti', 'Ekran Kartı', [type('nvidia', 'NVIDIA')]),
            category('akilli-saat', 'Akıllı Saat', [type('apple-watch', 'Apple Watch')]),
            category('kulaklik', 'Kulaklık', [type('kulaklik', 'Kulaklık')]),
          ],
        ),
      ),
    );

    for (final name in [
      'Laptop',
      'Masaüstü',
      'MacBook',
      'Mac Masaüstü',
      'iPhone',
      'iPad',
      'Oyun Konsolu',
      'Ekran Kartı',
      'Akıllı Saat',
      'Kulaklık',
    ]) {
      expect(find.text(name), findsOneWidget, reason: name);
    }
  });
}
