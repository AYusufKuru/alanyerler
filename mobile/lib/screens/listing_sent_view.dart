import 'package:flutter/material.dart';

import '../theme.dart';

class ListingSentView extends StatelessWidget {
  const ListingSentView({super.key, required this.deviceLine, required this.onOffers});

  final String deviceLine;
  final VoidCallback onOffers;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 16),
      child: Column(
        children: [
          const Spacer(),
          Container(
            width: 72,
            height: 72,
            alignment: Alignment.center,
            decoration: const BoxDecoration(color: Color(0xFFE8F1FF), shape: BoxShape.circle),
            child: const Text('🎉', style: TextStyle(fontSize: 34)),
          ),
          const SizedBox(height: 18),
          const Text(
            'Cihazınız teklif almaya hazır',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 26, height: 1.2, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 10),
          Text(
            deviceLine,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.ink),
          ),
          const SizedBox(height: 12),
          const Text(
            'Cihazınız Konya\'daki ve Türkiye genelindeki uygun işletmelere gönderildi.',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.muted, fontSize: 14, height: 1.45),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE7EEF6)),
            ),
            child: const Text(
              'Teklif toplama süresi: 1 saat',
              style: TextStyle(fontWeight: FontWeight.w800),
            ),
          ),
          const Spacer(),
          SizedBox(
            width: double.infinity,
            height: 52,
            child: FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.blue,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              onPressed: onOffers,
              child: const Text('Tekliflerimi Gör', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            ),
          ),
        ],
      ),
    );
  }
}
