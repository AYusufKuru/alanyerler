import 'package:flutter/material.dart';

String? categoryImage(String slug) {
  return switch (slug) {
    'telefon' => 'assets/categories/iphone.png',
    'tablet' => 'assets/categories/ipad.png',
    'bilgisayar' => 'assets/categories/wlaptop.png',
    'oyun-konsolu' => 'assets/categories/oyunkonsolu.png',
    'ekran-karti' => 'assets/categories/ekrankarti.png',
    'akilli-saat' => 'assets/categories/akillisaat.png',
    'kulaklik' => 'assets/categories/kulaklik.png',
    _ => null,
  };
}

String? deviceTypeImage(String slug) {
  return switch (slug) {
    'laptop' => 'assets/categories/wlaptop.png',
    'macbook' => 'assets/categories/macbook.png',
    'masaustu' => 'assets/categories/masaustu.png',
    'mac-masaustu' => 'assets/categories/mac.png',
    'iphone' => 'assets/categories/iphone.png',
    'ipad' => 'assets/categories/ipad.png',
    'oyun-konsolu' => 'assets/categories/oyunkonsolu.png',
    'ekran-karti' => 'assets/categories/ekrankarti.png',
    'akilli-saat' => 'assets/categories/akillisaat.png',
    'kulaklik' => 'assets/categories/kulaklik.png',
    _ => null,
  };
}

IconData? sellCardIcon(String slug) {
  return switch (slug) {
    'oyun-konsolu' => Icons.sports_esports_outlined,
    'ekran-karti' => Icons.memory_outlined,
    _ => null,
  };
}
