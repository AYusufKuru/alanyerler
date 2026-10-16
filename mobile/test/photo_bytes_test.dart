import 'dart:typed_data';

import 'package:alan_yerler/photo_bytes.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('jpg png ve webp imzası tanınır', () {
    expect(
      knownImage(Uint8List.fromList([0xFF, 0xD8, 0xFF, 0x00]))?.subtype,
      'jpeg',
    );
    expect(
      knownImage(Uint8List.fromList([0x89, 0x50, 0x4E, 0x47, 0, 0, 0, 0]))?.subtype,
      'png',
    );
    expect(
      knownImage(Uint8List.fromList([
        0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, // RIFF
        0x57, 0x45, 0x42, 0x50, // WEBP
      ]))?.subtype,
      'webp',
    );
    expect(knownImage(Uint8List.fromList([0, 1, 2, 3])), isNull);
  });
}
