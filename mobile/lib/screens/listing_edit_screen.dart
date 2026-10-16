import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../api/catalog_api.dart';
import '../api/offers_api.dart';
import '../models/catalog.dart';
import '../models/offer.dart';
import '../theme.dart';

class ListingEditScreen extends StatefulWidget {
  const ListingEditScreen({super.key, required this.token, required this.listing});

  final String token;
  final ListingDetail listing;

  @override
  State<ListingEditScreen> createState() => _ListingEditScreenState();
}

class _ListingEditScreenState extends State<ListingEditScreen> {
  DeviceTypeModel? _type;
  late Map<String, String> _specs = Map<String, String>.from(widget.listing.specs);
  late Map<String, String> _condition = Map<String, String>.from(widget.listing.condition);
  var _loading = true;
  var _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final categories = await CatalogApi(ApiClient()).categories(widget.token);
      DeviceTypeModel? match;
      for (final category in categories) {
        for (final type in category.deviceTypes) {
          if (type.id == widget.listing.deviceTypeId) match = type;
        }
      }
      if (!mounted) return;
      setState(() {
        _type = match;
        _loading = false;
        _error = match == null ? 'Bu ilanın formu bulunamadı.' : null;
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() {
        _error = error.message;
        _loading = false;
      });
    }
  }

  Future<void> _save() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await OffersApi(ApiClient()).updateListing(widget.token, widget.listing.id, _specs, _condition);
      if (mounted) Navigator.of(context).pop(true);
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() => _error = error.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final type = _type;
    return Scaffold(
      appBar: AppBar(title: const Text('İlanı düzenle')),
      body: _loading
          ? const LinearProgressIndicator()
          : ListView(
              padding: const EdgeInsets.all(20),
              children: [
                if (widget.listing.offerCount > 0)
                  const Padding(
                    padding: EdgeInsets.only(bottom: 12),
                    child: Text('Gelen tekliflerin fiyatı aynı kalır.'),
                  ),
                if (_error != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Text(_error!, style: const TextStyle(color: Color(0xFFB42318))),
                  ),
                if (type != null) ...[
                  const Text('Özellikler', style: TextStyle(fontWeight: FontWeight.w800)),
                  for (final field in type.specFields) _field(field, _specs, (next) => setState(() => _specs = next)),
                  const SizedBox(height: 16),
                  const Text('Durum', style: TextStyle(fontWeight: FontWeight.w800)),
                  for (final field in type.conditionFields) _field(field, _condition, (next) => setState(() => _condition = next)),
                  const SizedBox(height: 16),
                  PrimaryButton(label: 'Kaydet', busy: _busy, onPressed: _save),
                ],
              ],
            ),
    );
  }

  Widget _field(CatalogField field, Map<String, String> values, ValueChanged<Map<String, String>> onChanged) {
    final value = values[field.key] ?? '';
    final options = field.options;
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(field.label),
          if (options == null)
            TextFormField(
              initialValue: value,
              onChanged: (next) => onChanged({...values, field.key: next}),
            )
          else
            DropdownButtonFormField<String>(
              initialValue: options.contains(value) ? value : null,
              items: [
                for (final option in options) DropdownMenuItem(value: option, child: Text(option)),
              ],
              onChanged: (next) {
                if (next == null) return;
                onChanged({...values, field.key: next});
              },
            ),
          if (value == 'Diğer')
            TextFormField(
              initialValue: values['${field.key}Diger'] ?? '',
              decoration: const InputDecoration(labelText: 'Kendi değerin'),
              onChanged: (next) => onChanged({...values, '${field.key}Diger': next}),
            ),
        ],
      ),
    );
  }
}
