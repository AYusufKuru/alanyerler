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
  final _slots = List<XFile?>.filled(5, null);
  final _picker = ImagePicker();
  var _busy = false;
  int? _picking;
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

  List<XFile> get _filledPhotos => _slots.whereType<XFile>().toList();

  Future<void> _capture(int index, ImageSource source) async {
    setState(() => _picking = index);
    try {
      final file = await _picker.pickImage(source: source, imageQuality: 80);
      if (!mounted || file == null) return;
      setState(() {
        _slots[index] = file;
        _error = null;
      });
    } finally {
      if (mounted) setState(() => _picking = null);
    }
  }

  void _movePhoto(int index, int direction) {
    final target = index + direction;
    if (target < 0 || target >= _slots.length) return;
    setState(() {
      final current = _slots[index];
      _slots[index] = _slots[target];
      _slots[target] = current;
    });
  }

  void _enlargePhoto(XFile file, String title) {
    showDialog<void>(
      context: context,
      builder: (context) => Dialog(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 8, 8),
              child: Row(
                children: [
                  Expanded(child: Text(title, style: const TextStyle(fontWeight: FontWeight.w800))),
                  IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
                ],
              ),
            ),
            SizedBox(
              width: MediaQuery.sizeOf(context).width * 0.8,
              height: MediaQuery.sizeOf(context).height * 0.6,
              child: InteractiveViewer(
                child: Image.file(File(file.path), fit: BoxFit.contain),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submit() async {
    final category = _category;
    final deviceType = _deviceType;
    if (category == null || deviceType == null) return;
    final photos = _filledPhotos;
    if (photos.length < 2) {
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
        photos: photos,
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
                for (var i = 0; i < _slots.length; i++) {
                  _slots[i] = null;
                }
                _error = null;
              }),
            );
          },
        ),
      ],
    );
  }

  Widget _photoStep() {
    final shots = photoShots(_deviceType?.slug);
    final filled = _filledPhotos.length;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Fotoğraflar',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 8),
        Text(
          '$filled/5 · en az 2 fotoğraf. Sırayla çekin.',
          style: const TextStyle(color: AppColors.muted),
        ),
        if (_busy) ...[
          const SizedBox(height: 12),
          const LinearProgressIndicator(),
          const SizedBox(height: 6),
          const Text('Fotoğraflar yükleniyor', style: TextStyle(fontWeight: FontWeight.w700)),
        ],
        const SizedBox(height: 12),
        for (var index = 0; index < shots.length; index++)
          _PhotoShotCard(
            index: index,
            shot: shots[index],
            file: _slots[index],
            busy: _busy,
            picking: _picking == index,
            onGallery: () => _capture(index, ImageSource.gallery),
            onCamera: () => _capture(index, ImageSource.camera),
            onDelete: () => setState(() => _slots[index] = null),
            onUp: index == 0 ? null : () => _movePhoto(index, -1),
            onDown: index == shots.length - 1 ? null : () => _movePhoto(index, 1),
            onEnlarge: _slots[index] == null ? null : () => _enlargePhoto(_slots[index]!, shots[index].title),
          ),
      ],
    );
  }
}

class PhotoShot {
  const PhotoShot({required this.title, required this.prompt, this.optional = false});

  final String title;
  final String prompt;
  final bool optional;
}

List<PhotoShot> photoShots(String? slug) {
  PhotoShot shot(String title, String prompt, {bool optional = false}) {
    return PhotoShot(title: title, prompt: prompt, optional: optional);
  }

  const defect = PhotoShot(
    title: 'Kusurlu bölge',
    prompt: 'Varsa kusurlu bölgeyi yakın çekin. Yoksa bu kare boş kalabilir.',
    optional: true,
  );
  return switch (slug) {
    'iphone' || 'android-telefon' => [
      shot('Ön yüz', 'Cihazın ön yüzünü çekin.'),
      shot('Arka yüz', 'Cihazın arka yüzünü çekin.'),
      shot('Kenarlar', 'Sağ ve sol kenarları çekin.'),
      shot('Ekran açık', 'Ekranı açıkken çekin.'),
      defect,
    ],
    'laptop' || 'macbook' => [
      shot('Ekran açık', 'Ekranı açıkken önden çekin.'),
      shot('Klavye', 'Klavyeyi ve üst gövdeyi çekin.'),
      shot('Kapak', 'Kapağın dışını çekin.'),
      shot('Kenarlar', 'Portların olduğu kenarı çekin.'),
      defect,
    ],
    'masaustu' || 'mac-masaustu' => [
      shot('Ön yüz', 'Kasanın önünü çekin.'),
      shot('Yan panel', 'Yan kapağı çekin.'),
      shot('Arka portlar', 'Arkadaki bağlantıları çekin.'),
      shot('İç donanım', 'Kapak açıksa içini çekin.'),
      defect,
    ],
    'ipad' || 'android-tablet' => [
      shot('Ön yüz', 'Ekranı kapalıyken önden çekin.'),
      shot('Arka yüz', 'Arka kapağı çekin.'),
      shot('Kenarlar', 'Kenarları çekin.'),
      shot('Ekran açık', 'Ekranı açıkken çekin.'),
      defect,
    ],
    'playstation' || 'xbox' || 'nintendo' => [
      shot('Ön yüz', 'Konsolun önünü çekin.'),
      shot('Arka yüz', 'Portların olduğu arkayı çekin.'),
      shot('Kollar', 'Kolları çekin.'),
      shot('Kablolar', 'Güç ve görüntü kablosunu çekin.'),
      defect,
    ],
    'nvidia' || 'amd-ekran-karti' => [
      shot('Fanlar', 'Fanların olduğu yüzü çekin.'),
      shot('Arka plaka', 'Metal arka plakayı çekin.'),
      shot('Portlar', 'Görüntü çıkışlarını çekin.'),
      shot('Bağlantı', 'Altın bağlantı şeridini çekin.'),
      defect,
    ],
    'apple-watch' || 'diger-saat' => [
      shot('Ön cam', 'Ön camı çekin.'),
      shot('Arka sensör', 'Arka sensörü çekin.'),
      shot('Kordon', 'Kordonu çekin.'),
      shot('Şarj', 'Şarj kablosunu çekin.'),
      defect,
    ],
    'kulaklik' => [
      shot('Kulaklıklar', 'Kulak yastıklarını çekin.'),
      shot('Bant', 'Kafa bandını ve menteşeleri çekin.'),
      shot('Kılıf', 'Kılıfı veya kutuyu çekin.'),
      shot('Uçlar', 'Yedek uç veya kabloyu çekin.'),
      defect,
    ],
    _ => [
      shot('Ön yüz', 'Cihazın ön yüzünü çekin.'),
      shot('Arka yüz', 'Cihazın arka yüzünü çekin.'),
      shot('Kenarlar', 'Kenarları çekin.'),
      shot('Detay', 'Ekran veya bağlantıları çekin.'),
      defect,
    ],
  };
}

class _PhotoShotCard extends StatelessWidget {
  const _PhotoShotCard({
    required this.index,
    required this.shot,
    required this.file,
    required this.busy,
    required this.picking,
    required this.onGallery,
    required this.onCamera,
    required this.onDelete,
    required this.onUp,
    required this.onDown,
    required this.onEnlarge,
  });

  final int index;
  final PhotoShot shot;
  final XFile? file;
  final bool busy;
  final bool picking;
  final VoidCallback onGallery;
  final VoidCallback onCamera;
  final VoidCallback onDelete;
  final VoidCallback? onUp;
  final VoidCallback? onDown;
  final VoidCallback? onEnlarge;

  @override
  Widget build(BuildContext context) {
    final locked = busy || picking;
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF7F9FC),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE4EBF5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('${index + 1}. ${shot.title}', style: const TextStyle(fontWeight: FontWeight.w800)),
          const SizedBox(height: 2),
          Text(
            shot.prompt,
            style: const TextStyle(color: AppColors.muted, fontSize: 13),
          ),
          const SizedBox(height: 10),
          if (picking)
            const LinearProgressIndicator()
          else if (file != null)
            Row(
              children: [
                GestureDetector(
                  onTap: onEnlarge,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.file(File(file!.path), width: 72, height: 72, fit: BoxFit.cover),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Wrap(
                    spacing: 4,
                    children: [
                      IconButton(onPressed: locked ? null : onEnlarge, icon: const Icon(Icons.open_in_full), tooltip: 'Büyüt'),
                      IconButton(onPressed: locked ? null : onGallery, icon: const Icon(Icons.photo_library_outlined), tooltip: 'Galeriden değiştir'),
                      IconButton(onPressed: locked ? null : onCamera, icon: const Icon(Icons.photo_camera_outlined), tooltip: 'Yeniden çek'),
                      IconButton(onPressed: locked ? null : onDelete, icon: const Icon(Icons.delete_outline), tooltip: 'Sil'),
                      IconButton(onPressed: locked ? null : onUp, icon: const Icon(Icons.arrow_upward), tooltip: 'Yukarı'),
                      IconButton(onPressed: locked ? null : onDown, icon: const Icon(Icons.arrow_downward), tooltip: 'Aşağı'),
                    ],
                  ),
                ),
              ],
            )
          else
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: locked ? null : onGallery,
                    icon: const Icon(Icons.photo_library_outlined),
                    label: const Text('Galeri'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: locked ? null : onCamera,
                    icon: const Icon(Icons.photo_camera_outlined),
                    label: const Text('Kamera'),
                  ),
                ),
              ],
            ),
        ],
      ),
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

