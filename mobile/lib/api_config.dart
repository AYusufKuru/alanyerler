import 'dart:io';

import 'package:flutter/foundation.dart';

String apiBaseUrl() {
  const override = String.fromEnvironment('API_BASE_URL');
  if (override.isNotEmpty) {
    return override;
  }
  if (kIsWeb) {
    return 'http://localhost:3000';
  }
  if (Platform.isAndroid) {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
}

String mediaUrl(String? path) {
  if (path == null || path.isEmpty) return '';
  if (path.startsWith('http')) return path;
  return '${apiBaseUrl()}$path';
}
