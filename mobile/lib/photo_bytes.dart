import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:image_picker/image_picker.dart';

import 'api/api_client.dart';

class PreparedPhoto {
  const PreparedPhoto(this.bytes, this.extension, this.subtype);

  final Uint8List bytes;
  final String extension;
  final String subtype;
}

PreparedPhoto? knownImage(Uint8List bytes) {
  if (bytes.length >= 3 && bytes[0] == 0xFF && bytes[1] == 0xD8 && bytes[2] == 0xFF) {
    return PreparedPhoto(bytes, '.jpg', 'jpeg');
  }
  if (bytes.length >= 8 &&
      bytes[0] == 0x89 &&
      bytes[1] == 0x50 &&
      bytes[2] == 0x4E &&
      bytes[3] == 0x47) {
    return PreparedPhoto(bytes, '.png', 'png');
  }
  if (bytes.length >= 12 &&
      String.fromCharCodes(bytes.sublist(0, 4)) == 'RIFF' &&
      String.fromCharCodes(bytes.sublist(8, 12)) == 'WEBP') {
    return PreparedPhoto(bytes, '.webp', 'webp');
  }
  return null;
}

Future<PreparedPhoto> preparePhoto(Uint8List bytes) async {
  final known = knownImage(bytes);
  if (known != null) return known;
  for (final width in [1600, 1280, 800]) {
    final png = await _encodePng(bytes, width);
    if (png.lengthInBytes <= 8 * 1024 * 1024) {
      return PreparedPhoto(png, '.png', 'png');
    }
  }
  throw ApiException('Fotoğraf çok büyük. Daha küçük bir kare seçin.');
}

Future<http.MultipartFile> photoPart(XFile photo) async {
  final prepared = await preparePhoto(await photo.readAsBytes());
  return http.MultipartFile.fromBytes(
    'photos',
    prepared.bytes,
    filename: 'photo${prepared.extension}',
    contentType: MediaType('image', prepared.subtype),
  );
}

Future<Uint8List> _encodePng(Uint8List bytes, int targetWidth) async {
  try {
    final codec = await ui.instantiateImageCodec(bytes, targetWidth: targetWidth);
    final frame = await codec.getNextFrame();
    try {
      final data = await frame.image.toByteData(format: ui.ImageByteFormat.png);
      if (data == null) {
        throw ApiException('Bu fotoğraf açılamadı.');
      }
      return data.buffer.asUint8List();
    } finally {
      frame.image.dispose();
    }
  } catch (error) {
    if (error is ApiException) rethrow;
    throw ApiException('Bu fotoğraf açılamadı. Başka bir kare seçin.');
  }
}
