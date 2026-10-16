import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../api/api_client.dart';
import '../api/listings_api.dart';
import '../category_images.dart';
import '../models/catalog.dart';
import '../theme.dart';
import 'field_form.dart';
import 'listing_sent_view.dart';

class SellWizard extends StatefulWidget {
  const SellWizard({
    super.key,
    required this.categories,
    required this.token,
    this.initialCategoryId,
  });

  final List<CategoryModel> categories;
  final String token;
  final String? initialCategoryId;

  @override
  State<SellWizard> createState() => _SellWizardState();
}

class _SellWizardState extends State<SellWizard> {
  late CategoryModel? _category = _initialCategory();
  DeviceTypeModel? _deviceType;
  var _showSubtypes = false;
  var _step = 0;
  var _specs = <String, String>{};
  var _condition = <String, String>{};
  final _photos = <XFile>[];
  final _picker = ImagePicker();
  var _busy = false;
  var _sent = false;
  String? _error;

  CategoryModel? _initialCategory() {
    final id = widget.initialCategoryId;
    if (id == null) return null;
    for (final category in widget.categories) {
      if (category.id == id) return category;
    }
    return null;
  }

  void _back() {
    if (_step == 0 && _showSubtypes) {
      setState(() {
        _showSubtypes = false;
        _deviceType = null;
        _error = null;
      });
      return;
    }
    if (_step == 0) {
      Navigator.of(context).pop();
      return;
    }
    setState(() {
      _error = null;
      _step -= 1;
    });
  }

  void _continue() {
    if (_step == 0 && _deviceType == null) {
      final category = _category;
      if (category != null && category.deviceTypes.length > 1 && !_showSubtypes) {
        setState(() {
          _showSubtypes = true;
          _error = null;
        });
        return;
      }
      setState(() => _error = 'Cihaz türü seçin.');
      return;
    }
    if (_step == 1) {
      final message = missingFieldMessage(_deviceType!.specFields, _specs);
      if (message != null) {
        setState(() => _error = message);
        return;
      }
    }
    if (_step == 2) {
      final message = missingFieldMessage(_deviceType!.conditionFields, _condition);
      if (message != null) {
        setState(() => _error = message);
        return;
      }
    }
    if (_step >= 3) return;
    setState(() {
      _error = null;
      _step += 1;
    });
  }

  Future<void> _addPhotos(List<XFile> picked) async {
    if (picked.isEmpty) return;
    final next = [..._photos, ...picked];
    setState(() {
      _photos
        ..clear()
        ..addAll(next.take(5));
      _error = next.length > 5 ? 'En fazla 5 fotoğraf eklenebilir.' : null;
    });
  }

  Future<void> _submit() async {
    final category = _category;
    final deviceType = _deviceType;
    if (category == null || deviceType == null) return;
    if (_photos.length < 2) {
      setState(() => _error = 'En az 2 fotoğraf ekleyin.');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await ListingsApi().submit(
        token: widget.token,
        categoryId: category.id,
        deviceTypeId: deviceType.id,
        specs: _specs,
        condition: _condition,
        photos: _photos,
      );
      if (!mounted) return;
      setState(() {
        _busy = false;
        _sent = true;
      });
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() {
        _busy = false;
        _error = error.message;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_sent) {
      return _SentListing(onDone: () => Navigator.of(context).pop(true));
    }
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  IconButton(onPressed: _back, icon: const Icon(Icons.chevron_left, size: 28)),
                  const Expanded(
                    child: Text(
                      'Cihaz Sat',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('İptal'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              WizardProgress(step: _step),
              const SizedBox(height: 18),
              Expanded(
                child: ListView(
                  children: [
                    if (_step == 0) _deviceGrid(),
                    if (_step == 1 && _deviceType != null) ...[
                      Text(
                        _specHeadline(_deviceType!.name),
                        style: const TextStyle(fontSize: 28, height: 1.15, fontWeight: FontWeight.w800),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _specHint(_deviceType!),
                        style: const TextStyle(color: AppColors.muted, fontSize: 14, height: 1.35),
                      ),
                      const SizedBox(height: 14),
                      _SelectedDevice(
                        type: _deviceType!,
                        onChange: () => setState(() {
                          _error = null;
                          _step = 0;
                        }),
                      ),
                      const SizedBox(height: 14),
                      FieldForm(
                        fields: _deviceType!.specFields,
                        values: _specs,
                        onChanged: (value) => setState(() {
                          _specs = value;
                          _error = null;
                        }),
                      ),
                    ],
                    if (_step == 2 && _deviceType != null) ...[
                      Text(
                        _conditionHeadline(_deviceType!.name),
                        style: const TextStyle(fontSize: 28, height: 1.15, fontWeight: FontWeight.w800),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Cihazınızın mevcut durumunu doğru ve eksiksiz belirtin.',
                        style: TextStyle(color: AppColors.muted, fontSize: 14, height: 1.35),
                      ),
                      const SizedBox(height: 14),
                      FieldForm(
                        fields: _deviceType!.conditionFields,
                        values: _condition,
                        onChanged: (value) => setState(() {
                          _condition = value;
                          _error = null;
                        }),
                      ),
                    ],
                    if (_step == 3) _photoStep(),
                  ],
                ),
              ),
              if (_error != null) ...[
                const SizedBox(height: 8),
                Text(_error!, style: const TextStyle(color: Color(0xFFB42318))),
              ],
              const SizedBox(height: 8),
              Row(
                  children: [
                    if (_step > 0 || _showSubtypes) ...[
                      SizedBox(
                        height: 52,
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.ink,
                            side: const BorderSide(color: Color(0xFFE6EDF5)),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            padding: const EdgeInsets.symmetric(horizontal: 14),
                          ),
                          onPressed: _busy ? null : _back,
                          icon: const Icon(Icons.arrow_back, size: 18),
                          label: const Text('Geri', style: TextStyle(fontWeight: FontWeight.w700)),
                        ),
                      ),
                      const SizedBox(width: 12),
                    ],
                    Expanded(
                      child: SizedBox(
                        height: 52,
                        child: FilledButton(
                          style: FilledButton.styleFrom(
                            backgroundColor: AppColors.blue,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          onPressed: _busy ? null : (_step < 3 ? _continue : _submit),
                          child: _busy
                              ? const SizedBox(
                                  width: 22,
                                  height: 22,
                                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                )
                              : Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      _step < 3 ? 'Devam Et' : 'Gönder',
                                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                                    ),
                                    if (_step < 3) ...[
                                      const SizedBox(width: 8),
                                      const Icon(Icons.arrow_forward, size: 18),
                                    ],
                                  ],
                                ),
                        ),
                      ),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }

  static const _showcase = [
    'laptop',
    'masaustu',
    'macbook',
    'mac-masaustu',
    'iphone',
    'ipad',
    'oyun-konsolu',
    'ekran-karti',
    'akilli-saat',
    'kulaklik',
  ];

  List<({CategoryModel category, DeviceTypeModel? type, String title, String slug})> _showcaseChoices() {
    final types = <String, ({CategoryModel category, DeviceTypeModel type})>{};
    final categories = <String, CategoryModel>{};
    for (final category in widget.categories) {
      categories[category.slug] = category;
      for (final type in category.deviceTypes) {
        types[type.slug] = (category: category, type: type);
      }
    }
    final choices = <({CategoryModel category, DeviceTypeModel? type, String title, String slug})>[];
    for (final slug in _showcase) {
      final type = types[slug];
      if (type != null) {
        choices.add((category: type.category, type: type.type, title: type.type.name, slug: slug));
        continue;
      }
      final category = categories[slug];
      if (category != null) {
        choices.add((category: category, type: null, title: category.name, slug: slug));
      }
    }
    return choices;
  }

  Widget _deviceGrid() {
    if (_showSubtypes && _category != null) {
      return _typeGrid(
        title: '${_category!.name} seçin',
        subtitle: 'Devam etmek için cihaz türünü seçin.',
        choices: [
          for (final type in _category!.deviceTypes)
            (category: _category!, type: type, title: type.name, slug: type.slug),
        ],
      );
    }
    return _typeGrid(
      title: 'Hangi cihazı\nsatmak istiyorsunuz?',
      subtitle: 'Cihazınızı seçin, bilgilerinizi doldurun ve işletmelerden gelen teklifleri alın.',
      choices: _showcaseChoices(),
    );
  }

  Widget _typeGrid({
    required String title,
    required String subtitle,
    required List<({CategoryModel category, DeviceTypeModel? type, String title, String slug})> choices,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 28, height: 1.15, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 8),
        Text(
          subtitle,
          style: const TextStyle(color: AppColors.muted, height: 1.35),
        ),
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: choices.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.05,
          ),
          itemBuilder: (context, index) {
            final choice = choices[index];
            final selected = choice.type == null
                ? _deviceType == null && _category?.id == choice.category.id
                : _deviceType?.id == choice.type!.id;
            return _TypeCard(
              title: choice.title,
              image: deviceTypeImage(choice.slug),
              icon: sellCardIcon(choice.slug),
              selected: selected,
              onTap: () => setState(() {
                _category = choice.category;
                _deviceType = choice.type;
                _specs = {};
                _condition = {};
                _error = null;
              }),
            );
          },
        ),
      ],
    );
  }

  Widget _photoStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Fotoğraflar',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 8),
        Text(
          '${_photos.length}/5 · en az 2 fotoğraf',
          style: const TextStyle(color: AppColors.muted),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _busy
                    ? null
                    : () async {
                        final picked = await _picker.pickMultiImage(imageQuality: 80);
                        await _addPhotos(picked);
                      },
                icon: const Icon(Icons.photo_library_outlined),
                label: const Text('Galeri'),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _busy
                    ? null
                    : () async {
                        final picked = await _picker.pickImage(
                          source: ImageSource.camera,
                          imageQuality: 80,
                        );
                        if (picked != null) await _addPhotos([picked]);
                      },
                icon: const Icon(Icons.photo_camera_outlined),
                label: const Text('Kamera'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        for (var index = 0; index < _photos.length; index++)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image.file(
                    File(_photos[index].path),
                    width: 64,
                    height: 64,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(child: Text('Fotoğraf ${index + 1}')),
                IconButton(
                  onPressed: _busy
                      ? null
                      : () => setState(() {
                            _photos.removeAt(index);
                            _error = null;
                          }),
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

String _specHeadline(String name) {
  return switch (name) {
    'Laptop' => 'Laptopunuzun özellikleri',
    'Masaüstü' => 'Masaüstünüzün özellikleri',
    'MacBook' => 'MacBook\'unuzun özellikleri',
    'Mac Masaüstü' => 'Mac masaüstünüzün özellikleri',
    'iPhone' => 'iPhone\'unuzun özellikleri',
    'iPad' => 'iPad\'inizin özellikleri',
    'PlayStation' => 'PlayStation\'ınızın özellikleri',
    'Xbox' => 'Xbox\'ınızın özellikleri',
    'Nintendo' => 'Nintendo\'nuzun özellikleri',
    'NVIDIA' || 'AMD' => 'Ekran kartınızın özellikleri',
    'Apple Watch' => 'Saatinizin özellikleri',
    'Kulaklık' => 'Kulaklığınızın özellikleri',
    'Android telefon' => 'Telefonunuzun özellikleri',
    'Android tablet' => 'Tabletinizin özellikleri',
    _ => '$name özellikleri',
  };
}

String _conditionHeadline(String name) {
  final headline = _specHeadline(name);
  if (headline.endsWith('özellikleri')) {
    return headline.replaceFirst('özellikleri', 'durumu');
  }
  return '$name durumu';
}

String _specHint(DeviceTypeModel type) {
  if (type.slug == 'laptop' || type.slug == 'macbook') {
    return 'Marka, seri, işlemci, ekran kartı, RAM ve disk bilgilerini seçin.';
  }
  final labels = type.specFields.map((field) => field.label.toLowerCase()).toList();
  if (labels.isEmpty) return 'Bilgileri seçin.';
  if (labels.length == 1) return '${labels.first} bilgisini seçin.';
  final last = labels.removeLast();
  final head = labels.join(', ');
  final first = head[0].toUpperCase() + head.substring(1);
  return '$first ve $last bilgilerini seçin.';
}

class _SelectedDevice extends StatelessWidget {
  const _SelectedDevice({required this.type, required this.onChange});

  final DeviceTypeModel type;
  final VoidCallback onChange;

  @override
  Widget build(BuildContext context) {
    final image = deviceTypeImage(type.slug);
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFF4F7FB),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            width: 64,
            height: 48,
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
            child: image == null
                ? const Icon(Icons.devices_outlined, color: AppColors.blue)
                : Image.asset(image, fit: BoxFit.contain),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Seçiminiz', style: TextStyle(color: AppColors.muted, fontSize: 12)),
                Text(type.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
              ],
            ),
          ),
          Material(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            child: InkWell(
              borderRadius: BorderRadius.circular(12),
              onTap: onChange,
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('Değiştir', style: TextStyle(fontWeight: FontWeight.w700)),
                    SizedBox(width: 4),
                    Icon(Icons.swap_horiz, size: 18),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TypeCard extends StatelessWidget {
  const _TypeCard({
    required this.title,
    required this.selected,
    required this.onTap,
    this.image,
    this.icon,
  });

  final String title;
  final bool selected;
  final VoidCallback onTap;
  final String? image;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? const Color(0xFFF3F7FF) : Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(color: selected ? AppColors.blue : AppColors.line, width: selected ? 1.6 : 1),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 10),
          child: Column(
            children: [
              Expanded(
                child: image != null
                    ? Image.asset(image!, fit: BoxFit.contain)
                    : Icon(icon ?? Icons.devices_outlined, color: AppColors.blue, size: 42),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                  ),
                  Icon(Icons.chevron_right, size: 18, color: selected ? AppColors.blue : AppColors.muted),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SentListing extends StatelessWidget {
  const _SentListing({required this.onDone});

  final VoidCallback onDone;

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) onDone();
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFF7F9FC),
        body: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: onDone,
                      icon: const Icon(Icons.chevron_left, size: 28),
                    ),
                    const Expanded(
                      child: Text(
                        'Teklifler',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                      ),
                    ),
                    const SizedBox(width: 48),
                  ],
                ),
              ),
              const Expanded(child: ListingSentView()),
            ],
          ),
        ),
      ),
    );
  }
}

