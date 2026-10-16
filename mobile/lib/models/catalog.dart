class CatalogField {
  const CatalogField({
    required this.key,
    required this.label,
    required this.required,
    this.options,
    this.maxLength,
  });

  final String key;
  final String label;
  final bool required;
  final List<String>? options;
  final int? maxLength;

  factory CatalogField.fromJson(Map<String, dynamic> json) {
    final options = json['options'];
    return CatalogField(
      key: json['key'] as String,
      label: json['label'] as String,
      required: json['required'] == true,
      options: options is List ? options.map((item) => item.toString()).toList() : null,
      maxLength: json['maxLength'] is int ? json['maxLength'] as int : null,
    );
  }
}

class DeviceTypeModel {
  const DeviceTypeModel({
    required this.id,
    required this.name,
    required this.slug,
    required this.specFields,
    required this.conditionFields,
  });

  final String id;
  final String name;
  final String slug;
  final List<CatalogField> specFields;
  final List<CatalogField> conditionFields;

  factory DeviceTypeModel.fromJson(Map<String, dynamic> json) {
    return DeviceTypeModel(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      specFields: _fields(json['specFields']),
      conditionFields: _fields(json['conditionFields']),
    );
  }
}

class CategoryModel {
  const CategoryModel({
    required this.id,
    required this.name,
    required this.slug,
    required this.deviceTypes,
  });

  final String id;
  final String name;
  final String slug;
  final List<DeviceTypeModel> deviceTypes;

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    final types = json['deviceTypes'];
    return CategoryModel(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      deviceTypes: types is List
          ? types
              .whereType<Map>()
              .map((item) => DeviceTypeModel.fromJson(Map<String, dynamic>.from(item)))
              .toList()
          : const [],
    );
  }
}

class ListingSummary {
  const ListingSummary({
    required this.id,
    required this.title,
    required this.status,
    required this.offerCount,
    this.storage = '',
    this.color = '',
    this.highestOffer,
    this.offerWindowEndsAt,
  });

  final String id;
  final String title;
  final String status;
  final int offerCount;
  final String storage;
  final String color;
  final double? highestOffer;
  final DateTime? offerWindowEndsAt;

  factory ListingSummary.fromJson(Map<String, dynamic> json) {
    return ListingSummary(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      status: json['status'] as String? ?? '',
      offerCount: json['offerCount'] is int ? json['offerCount'] as int : 0,
      storage: _spec(json['specs'], 'depolama', 'storage'),
      color: _spec(json['specs'], 'renk', 'color'),
      highestOffer: json['highestOffer'] is num ? (json['highestOffer'] as num).toDouble() : null,
      offerWindowEndsAt: DateTime.tryParse(json['offerWindowEndsAt'] as String? ?? ''),
    );
  }
}

String _spec(Object? raw, String key, String fallback) {
  if (raw is! Map) return '';
  final value = raw[key] ?? raw[fallback];
  if (value == 'Diğer') {
    final typed = raw['${key}Diger'] ?? raw['${fallback}Diger'];
    return typed is String ? typed : '';
  }
  return value is String ? value : '';
}

List<CatalogField> _fields(Object? raw) {
  if (raw is! List) return const [];
  return raw
      .whereType<Map>()
      .map((item) => CatalogField.fromJson(Map<String, dynamic>.from(item)))
      .toList();
}

String? missingFieldMessage(List<CatalogField> fields, Map<String, String> values) {
  for (final field in fields) {
    final value = values[field.key]?.trim() ?? '';
    if (field.required && value.isEmpty) {
      return '${field.label} gerekli.';
    }
    if (value == 'Diğer') {
      final other = values['${field.key}Diger']?.trim() ?? '';
      if (other.isEmpty) {
        return '${field.label} için diğer değeri yazın.';
      }
      if (other.length > 80) {
        return '${field.label} diğer değeri en fazla 80 karakter olabilir.';
      }
    }
    final maxLength = field.maxLength;
    if (maxLength != null && value.length > maxLength) {
      return '${field.label} en fazla $maxLength karakter olabilir.';
    }
  }
  return null;
}
