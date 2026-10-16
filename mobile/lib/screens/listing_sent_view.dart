import 'package:flutter/material.dart';

import '../theme.dart';
import 'field_form.dart';

class ListingSentView extends StatelessWidget {
  const ListingSentView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
      children: const [
        WizardProgress(
          step: 3,
          labels: ['Cihaz', 'Özellikler', 'Durum', 'Teklifler'],
        ),
        SizedBox(height: 8),
        _SentHero(),
        SizedBox(height: 6),
        Text(
          'Cihazınız işletmelere\ngönderildi.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 26, height: 1.15, fontWeight: FontWeight.w800),
        ),
        SizedBox(height: 10),
        Text(
          'Bilgilerinizi paylaştık, işletmeler size en iyi tekliflerini iletiyor. Bu genellikle birkaç dakika sürer.',
          textAlign: TextAlign.center,
          style: TextStyle(color: AppColors.muted, fontSize: 14, height: 1.4),
        ),
        SizedBox(height: 18),
        _SentTimeline(),
        SizedBox(height: 12),
        _SentNotice(),
      ],
    );
  }
}

class _SentHero extends StatelessWidget {
  const _SentHero();

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'assets/categories/teklif-slider.png',
      height: 214,
      fit: BoxFit.contain,
    );
  }
}

class _SentTimeline extends StatelessWidget {
  const _SentTimeline();

  @override
  Widget build(BuildContext context) {
    const items = [
      _SentStep('Cihaz bilgileri gönderildi', state: _SentMark.done),
      _SentStep('Uygun işletmelerle paylaşıldı', state: _SentMark.done),
      _SentStep(
        'Teklifler toplanıyor',
        state: _SentMark.current,
        hint: 'Bu işlem birkaç dakika sürebilir.',
      ),
      _SentStep('Teklifler listeleniyor', state: _SentMark.waiting),
    ];
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE7EEF6)),
      ),
      child: Column(
        children: [
          for (var index = 0; index < items.length; index++) ...[
            if (index > 0) const SizedBox(height: 14),
            _SentStepRow(step: items[index]),
          ],
        ],
      ),
    );
  }
}

enum _SentMark { done, current, waiting }

class _SentStep {
  const _SentStep(this.title, {required this.state, this.hint});

  final String title;
  final _SentMark state;
  final String? hint;
}

class _SentStepRow extends StatelessWidget {
  const _SentStepRow({required this.step});

  final _SentStep step;

  @override
  Widget build(BuildContext context) {
    final pending = step.state == _SentMark.waiting;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 1),
          child: _SentMarkIcon(state: step.state),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                step.title,
                style: TextStyle(
                  fontSize: 15,
                  height: 1.2,
                  fontWeight: FontWeight.w700,
                  color: pending ? const Color(0xFFB7C3D3) : AppColors.ink,
                ),
              ),
              if (step.hint != null) ...[
                const SizedBox(height: 2),
                Text(
                  step.hint!,
                  style: const TextStyle(color: AppColors.muted, fontSize: 12.5, height: 1.3),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}

class _SentMarkIcon extends StatelessWidget {
  const _SentMarkIcon({required this.state});

  final _SentMark state;

  @override
  Widget build(BuildContext context) {
    return switch (state) {
      _SentMark.done => Container(
          width: 22,
          height: 22,
          alignment: Alignment.center,
          decoration: const BoxDecoration(color: AppColors.blue, shape: BoxShape.circle),
          child: const Icon(Icons.check, color: Colors.white, size: 14),
        ),
      _SentMark.current => Container(
          width: 22,
          height: 22,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white,
            border: Border.all(color: AppColors.blue, width: 2),
          ),
        ),
      _SentMark.waiting => Container(
          width: 22,
          height: 22,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: const Color(0xFFD5DEE8), width: 2),
          ),
        ),
    };
  }
}

class _SentNotice extends StatelessWidget {
  const _SentNotice();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
      decoration: BoxDecoration(
        color: const Color(0xFFE8F1FF),
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _NoticeBell(),
          SizedBox(width: 12),
          Expanded(
            child: Text.rich(
              TextSpan(
                style: TextStyle(color: AppColors.ink, fontSize: 13.5, height: 1.35),
                children: [
                  TextSpan(
                    text: 'Teklifler geldiğinde anında bildirim alacaksınız.\n',
                    style: TextStyle(fontWeight: FontWeight.w700),
                  ),
                  TextSpan(
                    text: 'Uygulamayı kapatsanız bile size haber vereceğiz.',
                    style: TextStyle(fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NoticeBell extends StatelessWidget {
  const _NoticeBell();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 36,
      height: 36,
      alignment: Alignment.center,
      decoration: const BoxDecoration(color: Color(0xFFD7E7FF), shape: BoxShape.circle),
      child: const Icon(Icons.notifications_none_rounded, color: AppColors.blue, size: 20),
    );
  }
}
