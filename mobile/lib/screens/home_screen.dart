import 'dart:async';

import 'package:flutter/material.dart';

import '../category_images.dart';
import '../models/catalog.dart';
import '../theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({
    super.key,
    required this.categories,
    required this.loading,
    required this.error,
    required this.onRetry,
    required this.onSell,
    required this.onCategory,
    required this.onProfile,
    required this.onNotifications,
    this.notificationCount = 0,
  });

  final List<CategoryModel> categories;
  final bool loading;
  final String? error;
  final VoidCallback onRetry;
  final VoidCallback onSell;
  final ValueChanged<CategoryModel> onCategory;
  final VoidCallback onProfile;
  final VoidCallback onNotifications;
  final int notificationCount;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
        children: [
          Row(
            children: [
              const Text.rich(
                TextSpan(
                  style: TextStyle(fontSize: 28, height: 1, fontWeight: FontWeight.w800, letterSpacing: -0.4),
                  children: [
                    TextSpan(text: 'Alan ', style: TextStyle(color: AppColors.ink)),
                    TextSpan(text: 'Yerler', style: TextStyle(color: AppColors.blue)),
                  ],
                ),
              ),
              const Spacer(),
              IconButton(
                visualDensity: VisualDensity.compact,
                onPressed: onNotifications,
                icon: Badge(
                  isLabelVisible: notificationCount > 0,
                  smallSize: 8,
                  backgroundColor: const Color(0xFFEF4444),
                  child: const Icon(Icons.notifications_none, size: 26, color: AppColors.ink),
                ),
              ),
              const SizedBox(width: 4),
              Material(
                color: const Color(0xFFE8EEF6),
                shape: const CircleBorder(),
                child: InkWell(
                  customBorder: const CircleBorder(),
                  onTap: onProfile,
                  child: const SizedBox(
                    width: 36,
                    height: 36,
                    child: Icon(Icons.person, size: 22, color: Color(0xFF5C6B82)),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          _Hero(onSell: onSell),
          const SizedBox(height: 22),
          const Text(
            'CİHAZ SEÇ',
            style: TextStyle(
              color: AppColors.blue,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.1,
              fontSize: 11,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Hangi cihazı satmak istiyorsunuz?',
            style: TextStyle(fontSize: 22, height: 1.15, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 6),
          const Text(
            'Satmak istediğiniz cihaz kategorisini seçerek ilan oluşturmaya başlayın.',
            style: TextStyle(color: AppColors.muted, fontSize: 13.5, height: 1.35),
          ),
          const SizedBox(height: 14),
          if (loading)
            const LinearProgressIndicator()
          else if (error != null) ...[
            Text(error!, style: const TextStyle(color: Color(0xFFB42318))),
            TextButton(onPressed: onRetry, child: const Text('Tekrar dene')),
          ] else
            _CategoryBoard(categories: categories, onCategory: onCategory),
          const SizedBox(height: 26),
          const _HowItWorks(),
          const SizedBox(height: 18),
          const _TrustBanner(),
        ],
      ),
    );
  }
}

class _Hero extends StatefulWidget {
  const _Hero({required this.onSell});

  final VoidCallback onSell;

  @override
  State<_Hero> createState() => _HeroState();
}

class _HeroState extends State<_Hero> {
  static const _slides = [
    'assets/categories/banner.png',
    'assets/categories/banner-2.png',
  ];

  final _page = PageController();
  Timer? _timer;
  var _index = 0;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 5), (_) => _go(_index + 1));
  }

  @override
  void dispose() {
    _timer?.cancel();
    _page.dispose();
    super.dispose();
  }

  void _go(int next) {
    if (!_page.hasClients) return;
    final page = (next % _slides.length + _slides.length) % _slides.length;
    _page.animateToPage(page, duration: const Duration(milliseconds: 650), curve: Curves.ease);
  }

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 2048 / 768,
      child: Stack(
        alignment: Alignment.center,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(22),
            child: PageView.builder(
              controller: _page,
              itemCount: _slides.length,
              onPageChanged: (index) => setState(() => _index = index),
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: widget.onSell,
                  child: Image.asset(_slides[index], fit: BoxFit.cover),
                );
              },
            ),
          ),
          Positioned(
            left: 8,
            child: _BannerArrow(icon: Icons.chevron_left, onTap: () => _go(_index - 1)),
          ),
          Positioned(
            right: 8,
            child: _BannerArrow(icon: Icons.chevron_right, onTap: () => _go(_index + 1)),
          ),
          Positioned(
            bottom: 10,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                for (var dot = 0; dot < _slides.length; dot++) ...[
                  if (dot > 0) const SizedBox(width: 6),
                  GestureDetector(
                    onTap: () => _go(dot),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: dot == _index ? AppColors.blue : const Color(0x4710233F),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BannerArrow extends StatelessWidget {
  const _BannerArrow({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xEBFFFFFF),
      elevation: 2,
      shadowColor: const Color(0x1F10233F),
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: SizedBox(width: 34, height: 34, child: Icon(icon, size: 22, color: AppColors.ink)),
      ),
    );
  }
}

const _homeOrder = [
  'telefon',
  'bilgisayar',
  'oyun-konsolu',
  'ekran-karti',
  'tablet',
  'akilli-saat',
  'kulaklik',
];

String _homeName(CategoryModel category) {
  return switch (category.slug) {
    'bilgisayar' => 'Bilgisayar/Laptop',
    _ => category.name,
  };
}

class _CategoryBoard extends StatelessWidget {
  const _CategoryBoard({required this.categories, required this.onCategory});

  final List<CategoryModel> categories;
  final ValueChanged<CategoryModel> onCategory;

  @override
  Widget build(BuildContext context) {
    final bySlug = {for (final category in categories) category.slug: category};
    final shown = [for (final slug in _homeOrder) if (bySlug[slug] != null) bySlug[slug]!];
    final extra = categories.where((category) => !_homeOrder.contains(category.slug));
    final cards = [...shown, ...extra];
    if (cards.isEmpty) return const SizedBox.shrink();
    final top = cards.take(3).toList();
    final bottom = cards.skip(3).toList();
    return Column(
      children: [
        _CategoryRow(categories: top, height: 132, onCategory: onCategory),
        if (bottom.isNotEmpty) ...[
          const SizedBox(height: 10),
          _CategoryRow(categories: bottom, height: 116, onCategory: onCategory),
        ],
      ],
    );
  }
}

class _CategoryRow extends StatelessWidget {
  const _CategoryRow({
    required this.categories,
    required this.height,
    required this.onCategory,
  });

  final List<CategoryModel> categories;
  final double height;
  final ValueChanged<CategoryModel> onCategory;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: Row(
        children: [
          for (var index = 0; index < categories.length; index++) ...[
            if (index > 0) const SizedBox(width: 8),
            Expanded(
              child: _CategoryCard(
                category: categories[index],
                onTap: () => onCategory(categories[index]),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  const _CategoryCard({required this.category, required this.onTap});

  final CategoryModel category;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFFF4F7FB),
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(6, 8, 6, 8),
          child: Column(
            children: [
              Expanded(
                child: switch (categoryImage(category.slug)) {
                  final image? => Image.asset(image, fit: BoxFit.contain),
                  _ => Icon(_iconFor(category.slug), color: AppColors.blue),
                },
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      _homeName(category),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 11, height: 1.1, fontWeight: FontWeight.w700),
                    ),
                  ),
                  const Icon(Icons.chevron_right, size: 16, color: Color(0xFF8AA0B8)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

IconData _iconFor(String slug) {
  return switch (slug) {
    'telefon' => Icons.smartphone,
    'bilgisayar' => Icons.laptop_mac,
    'oyun-konsolu' => Icons.sports_esports,
    'ekran-karti' => Icons.memory,
    'tablet' => Icons.tablet_mac,
    'akilli-saat' => Icons.watch,
    'kulaklik' => Icons.headphones,
    _ => Icons.devices,
  };
}

class _HowStep {
  const _HowStep(this.color, this.icon, this.title, this.body);

  final Color color;
  final IconData icon;
  final String title;
  final String body;
}

class _HowItWorks extends StatelessWidget {
  const _HowItWorks();

  static const _steps = [
    _HowStep(Color(0xFF2F6BFF), Icons.article_outlined, '1. Cihazını Ekle', 'Marka, model ve detayları gir.'),
    _HowStep(Color(0xFF7C5CFC), Icons.photo_camera_outlined, '2. Fotoğrafları Yükle', 'Cihazının fotoğraflarını ekle.'),
    _HowStep(Color(0xFF22C55E), Icons.local_offer_outlined, '3. Teklifleri Al', 'İşletmelerden gelen teklifleri gör.'),
    _HowStep(Color(0xFFF59E0B), Icons.handshake_outlined, '4. En İyisini Seç', 'Beğendiğin teklifle iletişime geç.'),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Row(
          children: [
            Text(
              'NASIL ÇALIŞIR?',
              style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 0.3, fontSize: 13),
            ),
            Spacer(),
            Text(
              'Detayları Gör',
              style: TextStyle(color: AppColors.blue, fontWeight: FontWeight.w700, fontSize: 13),
            ),
            Icon(Icons.chevron_right, size: 18, color: AppColors.blue),
          ],
        ),
        const SizedBox(height: 16),
        LayoutBuilder(
          builder: (context, constraints) {
            const circle = 40.0;
            final slot = constraints.maxWidth / _steps.length;
            return Stack(
              children: [
                Positioned(
                  left: slot / 2,
                  right: slot / 2,
                  top: circle / 2 - 1,
                  child: const SizedBox(
                    height: 2,
                    child: CustomPaint(painter: _DottedLinePainter()),
                  ),
                ),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    for (final step in _steps)
                      Expanded(
                        child: Column(
                          children: [
                            Container(
                              width: circle,
                              height: circle,
                              decoration: BoxDecoration(color: step.color, shape: BoxShape.circle),
                              child: Icon(step.icon, color: Colors.white, size: 20),
                            ),
                            const SizedBox(height: 10),
                            SizedBox(
                              height: 12 * 1.2 * 2,
                              child: Text(
                                step.title,
                                textAlign: TextAlign.center,
                                maxLines: 2,
                                style: const TextStyle(fontSize: 12, height: 1.2, fontWeight: FontWeight.w800),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              step.body,
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 11, height: 1.25, color: AppColors.muted),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ],
            );
          },
        ),
      ],
    );
  }
}

class _DottedLinePainter extends CustomPainter {
  const _DottedLinePainter();

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFFD5DEEA);
    const gap = 7.0;
    var x = 0.0;
    final y = size.height / 2;
    while (x <= size.width) {
      canvas.drawCircle(Offset(x, y), 1.7, paint);
      x += gap;
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _TrustBanner extends StatelessWidget {
  const _TrustBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 14, 10, 14),
      decoration: BoxDecoration(
        color: const Color(0xFF0E2A4A),
        borderRadius: BorderRadius.circular(18),
      ),
      child: const Row(
        children: [
          SizedBox(
            width: 40,
            height: 40,
            child: DecoratedBox(
              decoration: BoxDecoration(color: AppColors.blue, shape: BoxShape.circle),
              child: Center(child: Icon(Icons.verified_user, color: Colors.white, size: 22)),
            ),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Güvenli ve Güvenilir',
                  style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w800),
                ),
                SizedBox(height: 2),
                Text(
                  'Doğrulanmış işletmelerden teklif al, güvenle satış yap.',
                  style: TextStyle(color: Color(0xFFD5E4F7), fontSize: 12, height: 1.3),
                ),
              ],
            ),
          ),
          Icon(Icons.chevron_right, color: Colors.white),
        ],
      ),
    );
  }
}
