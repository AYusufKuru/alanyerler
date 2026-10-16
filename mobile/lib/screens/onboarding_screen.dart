import 'package:flutter/material.dart';

import '../session/session_controller.dart';
import '../theme.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _page = PageController();
  int _index = 0;

  static const _pages = [
    _Page(
      title: 'Cihazını Sat,\nEn İyi Teklifi Bul.',
      body:
          'Telefon, bilgisayar, oyun konsolu ve daha fazlası için bilgileri gir. İşletmelerden gelen teklifleri karşılaştır, sana en uygun olanı seç.',
    ),
    _Page(
      title: 'Adım Adım\nKolayca Ekle.',
      body:
          'Cihazının marka, model, teknik özellikleri ve mevcut durumunu birkaç adımda ekle. Satış sürecini senin için kolaylaştırıyoruz.',
    ),
    _Page(
      title: 'Teklifler\nCebine Gelsin.',
      body:
          'İlanını oluştur, işletmelerin bildirdiği fiyat tekliflerini gör. Teklifleri karşılaştır, en iyi teklifi seç.',
    ),
    _Page(
      title: 'Güvenli ve\nKolay Satış.',
      body:
          'Beğendiğin teklifi seç, uygulama üzerinden işletmeyle iletişime geç. Cihazını güvenle, hızlı ve kolayca sat.',
    ),
  ];

  @override
  void dispose() {
    _page.dispose();
    super.dispose();
  }

  void _go(int next) {
    _page.animateToPage(
      next,
      duration: const Duration(milliseconds: 280),
      curve: Curves.easeOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    final last = _index == _pages.length - 1;
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 12, 24, 12),
          child: Column(
            children: [
              Expanded(
                child: PageView.builder(
                  controller: _page,
                  itemCount: _pages.length,
                  onPageChanged: (value) => setState(() => _index = value),
                  itemBuilder: (context, index) {
                    final page = _pages[index];
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Alan Yerler',
                          style: TextStyle(
                            color: AppColors.blue,
                            fontWeight: FontWeight.w800,
                            fontSize: 18,
                          ),
                        ),
                        const SizedBox(height: 28),
                        Text(
                          page.title,
                          style: const TextStyle(
                            fontSize: 34,
                            height: 1.05,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          page.body,
                          style: const TextStyle(
                            color: AppColors.muted,
                            fontSize: 16,
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 28),
                        Expanded(child: _art(index)),
                      ],
                    );
                  },
                ),
              ),
              if (_index == 0)
                PrimaryButton(
                  label: 'Cihazımı Satmak İstiyorum',
                  onPressed: () => _go(1),
                ),
              if (last)
                PrimaryButton(
                  label: 'Hemen Başla',
                  onPressed: () => SessionScope.of(context).finishOnboarding(),
                ),
              const SizedBox(height: 8),
              Row(
                children: [
                  TextButton(
                    onPressed: () => SessionScope.of(context).finishOnboarding(),
                    child: const Text('Geç'),
                  ),
                  Expanded(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(_pages.length, (index) {
                        final active = index == _index;
                        return AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: active ? 18 : 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: active ? AppColors.blue : AppColors.line,
                            borderRadius: BorderRadius.circular(8),
                          ),
                        );
                      }),
                    ),
                  ),
                  TextButton(
                    onPressed: last ? null : () => _go(_index + 1),
                    child: const Text('İleri'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _art(int index) {
    return switch (index) {
      0 => const _Steps(),
      1 => const _InfoCard(
          icon: Icons.phone_iphone,
          title: 'İlan oluştur',
          lines: ['Cihaz türü', 'Özellikler', 'Durum', 'Fotoğraflar'],
        ),
      2 => const _InfoCard(
          icon: Icons.local_offer_outlined,
          title: 'Gelen teklifler',
          lines: ['Mağazanın bildirdiği fiyat', 'Yüksekten düşüğe sıra'],
        ),
      _ => const _Steps(
          labels: ['Güvenilir işletme', 'Hızlı teklif', 'Kolay iletişim', 'Güvenli satış'],
        ),
    };
  }
}

class _Page {
  const _Page({required this.title, required this.body});

  final String title;
  final String body;
}

class _Steps extends StatelessWidget {
  const _Steps({
    this.labels = const ['Cihazını ekle', 'Fotoğraf yükle', 'Teklifleri gör', 'Mesajlaş'],
  });

  final List<String> labels;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: [
        for (final label in labels)
          Container(
            width: 148,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.canvas,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
          ),
      ],
    );
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.icon,
    required this.title,
    required this.lines,
  });

  final IconData icon;
  final String title;
  final List<String> lines;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.topCenter,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.canvas,
          borderRadius: BorderRadius.circular(24),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: AppColors.blue, size: 36),
            const SizedBox(height: 12),
            Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            for (final line in lines)
              Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Text(line, style: const TextStyle(color: AppColors.muted)),
              ),
          ],
        ),
      ),
    );
  }
}
