import 'package:flutter/material.dart';

import '../models/catalog.dart';
import '../theme.dart';

class FieldForm extends StatelessWidget {
  const FieldForm({
    super.key,
    required this.fields,
    required this.values,
    required this.onChanged,
  });

  final List<CatalogField> fields;
  final Map<String, String> values;
  final ValueChanged<Map<String, String>> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final field in fields) ...[
          _FieldBlock(
            field: field,
            values: values,
            storageAsSsd: fields.any((item) => item.key == 'islemci'),
            onChanged: onChanged,
          ),
          const SizedBox(height: 10),
        ],
      ],
    );
  }
}

class _FieldBlock extends StatelessWidget {
  const _FieldBlock({
    required this.field,
    required this.values,
    required this.storageAsSsd,
    required this.onChanged,
  });

  final CatalogField field;
  final Map<String, String> values;
  final bool storageAsSsd;
  final ValueChanged<Map<String, String>> onChanged;

  @override
  Widget build(BuildContext context) {
    final options = field.options;
    final selected = values[field.key];
    final selectRow = options != null;
    final note = field.key == 'ekBilgi';
    final title = _fieldTitle(field, storageAsSsd);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (!selectRow && !note) ...[
          Text(
            field.required ? '${field.label} *' : field.label,
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
        ],
        if (note)
          _NoteCard(
            icon: _fieldIcon(field.key, selected),
            label: 'Ek Bilgi (Opsiyonel)',
            child: _BoundText(
              key: ValueKey(field.key),
              initial: selected ?? '',
              maxLength: field.maxLength,
              maxLines: 3,
              plain: true,
              hint: 'Cihazınızla ilgili ek bir bilgi ekleyebilirsiniz...\n(ör. küçük çizik, klavye durumu vb.)',
              onChanged: (value) => onChanged({...values, field.key: value}),
            ),
          )
        else if (options == null)
          _BoundText(
            key: ValueKey(field.key),
            initial: selected ?? '',
            maxLength: field.maxLength,
            maxLines: field.maxLength != null && field.maxLength! > 80 ? 3 : 1,
            hint: 'Yazın',
            onChanged: (value) => onChanged({...values, field.key: value}),
          )
        else
          _SelectRow(
            icon: _fieldIcon(field.key, selected),
            iconColor: _fieldIconColor(field.key),
            label: title,
            required: field.required,
            value: options.contains(selected) ? _optionLabel(selected!) : null,
            onTap: () async {
              final picked = await _pickOption(context, _fieldTitle(field, storageAsSsd), options, selected);
              if (picked == null) return;
              final next = {...values, field.key: picked};
              if (picked != 'Diğer') next.remove('${field.key}Diger');
              onChanged(next);
            },
          ),
        if (selected == 'Diğer') ...[
          const SizedBox(height: 8),
          _BoundText(
            key: ValueKey('${field.key}Diger'),
            initial: values['${field.key}Diger'] ?? '',
            hint: '${field.label} yazın',
            onChanged: (value) => onChanged({...values, '${field.key}Diger': value}),
          ),
        ],
      ],
    );
  }
}

String _fieldTitle(CatalogField field, bool storageAsSsd) {
  if (field.key == 'depolama' && storageAsSsd) return 'Depolama (SSD)';
  if (field.key == 'depolamaSagligi') return 'Depolama (SSD) Sağlığı';
  if (field.key == 'calisma') return 'Cihazın Çalışma Durumu';
  return field.label;
}

String _optionLabel(String value) {
  return switch (value) {
    'Sıfır gibi' => 'Sıfır Gibi',
    'Sorunsuz çalışıyor' => 'Sorunsuz Çalışıyor',
    'Bazı sorunlar var' => 'Bazı Sorunlar Var',
    '0–6 ay' => '0 – 6 Ay',
    '6–12 ay' => '6 – 12 Ay',
    '12 aydan fazla' => '12 Aydan Fazla',
    _ => value,
  };
}

IconData _fieldIcon(String key, String? value) {
  return switch (key) {
    'marka' => value == 'Apple' ? Icons.apple : Icons.storefront_outlined,
    'seri' => Icons.layers_outlined,
    'model' => Icons.laptop_mac_outlined,
    'islemci' => Icons.memory_outlined,
    'ekranKarti' => Icons.developer_board_outlined,
    'ram' => Icons.sd_card_outlined,
    'depolama' => Icons.album_outlined,
    'ekranBoyutu' => Icons.monitor_outlined,
    'renk' => Icons.palette_outlined,
    'bellek' => Icons.sd_card_outlined,
    'baglanti' => Icons.wifi,
    'kolAdedi' => Icons.sports_esports_outlined,
    'kasaOlcusu' => Icons.watch_outlined,
    'pilSagligi' => Icons.battery_charging_full,
    'depolamaSagligi' => Icons.sd_storage_rounded,
    'kutuFatura' => Icons.description_outlined,
    'kutu' => Icons.inventory_2_outlined,
    'fatura' => Icons.receipt_long_outlined,
    'kalanGaranti' => Icons.shield_outlined,
    'kozmetik' => Icons.auto_awesome_outlined,
    'adaptor' => Icons.power_outlined,
    'calisma' => Icons.check_circle_outline,
    'ekBilgi' => Icons.edit_note_outlined,
    _ => Icons.tune,
  };
}

Color _fieldIconColor(String key) {
  return switch (key) {
    'pilSagligi' => const Color(0xFF3DDC84),
    'depolamaSagligi' => const Color(0xFF2EBD6B),
    _ => const Color(0xFF5C6B82),
  };
}

Future<String?> _pickOption(
  BuildContext context,
  String title,
  List<String> options,
  String? selected,
) {
  final height = (options.length * 52.0 + 28).clamp(120.0, MediaQuery.sizeOf(context).height * 0.62);
  return showModalBottomSheet<String>(
    context: context,
    showDragHandle: true,
    builder: (context) {
      return SafeArea(
        child: SizedBox(
          height: height,
          child: ListView(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 8),
                child: Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
              ),
              for (final option in options)
                ListTile(
                  title: Text(_optionLabel(option)),
                  trailing: option == selected ? const Icon(Icons.check, color: AppColors.blue) : null,
                  onTap: () => Navigator.pop(context, option),
                ),
            ],
          ),
        ),
      );
    },
  );
}

class _SelectRow extends StatelessWidget {
  const _SelectRow({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.required,
    required this.value,
    required this.onTap,
  });

  final IconData icon;
  final Color iconColor;
  final String label;
  final bool required;
  final String? value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Container(
          constraints: const BoxConstraints(minHeight: 56),
          padding: const EdgeInsets.fromLTRB(12, 8, 8, 8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE6EDF5)),
          ),
          child: LayoutBuilder(
            builder: (context, constraints) {
              return Row(
                children: [
                  Icon(icon, size: 22, color: iconColor),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text.rich(
                      TextSpan(
                        text: label,
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.ink),
                        children: [
                          if (required)
                            const TextSpan(text: ' *', style: TextStyle(color: Color(0xFFE11D48), fontWeight: FontWeight.w700)),
                        ],
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  ConstrainedBox(
                    constraints: BoxConstraints(maxWidth: constraints.maxWidth * 0.5),
                    child: _ValuePill(value: value),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}

class _ValuePill extends StatelessWidget {
  const _ValuePill({required this.value});

  final String? value;

  @override
  Widget build(BuildContext context) {
    final chosen = value != null;
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 7, 6, 7),
      decoration: BoxDecoration(
        color: const Color(0xFFF2F5F9),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Flexible(
            child: Text(
              value ?? 'Seçin',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: chosen ? AppColors.ink : AppColors.muted,
                fontWeight: FontWeight.w600,
                fontSize: 13.5,
              ),
            ),
          ),
          const Icon(Icons.keyboard_arrow_down_rounded, size: 20, color: Color(0xFF98A8BC)),
        ],
      ),
    );
  }
}

class _NoteCard extends StatelessWidget {
  const _NoteCard({required this.icon, required this.label, required this.child});

  final IconData icon;
  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE6EDF5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 22, color: const Color(0xFF5C6B82)),
              const SizedBox(width: 10),
              Text(label, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
            ],
          ),
          const SizedBox(height: 6),
          child,
        ],
      ),
    );
  }
}

class _BoundText extends StatefulWidget {
  const _BoundText({
    super.key,
    required this.initial,
    required this.onChanged,
    required this.hint,
    this.maxLength,
    this.maxLines = 1,
    this.plain = false,
  });

  final String initial;
  final ValueChanged<String> onChanged;
  final String hint;
  final int? maxLength;
  final int maxLines;
  final bool plain;

  @override
  State<_BoundText> createState() => _BoundTextState();
}

class _BoundTextState extends State<_BoundText> {
  late final TextEditingController _controller = TextEditingController(text: widget.initial);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final field = TextField(
      controller: _controller,
      maxLength: widget.maxLength,
      maxLines: widget.maxLines,
      decoration: widget.plain
          ? InputDecoration(
              hintText: widget.hint,
              hintStyle: const TextStyle(color: AppColors.muted, fontSize: 13, height: 1.35),
              border: InputBorder.none,
              enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none,
              counterText: '',
              contentPadding: EdgeInsets.zero,
              filled: false,
            )
          : InputDecoration(hintText: widget.hint),
      onChanged: (value) {
        widget.onChanged(value);
        if (widget.plain) setState(() {});
      },
    );
    if (!widget.plain || widget.maxLength == null) return field;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        field,
        Align(
          alignment: Alignment.centerRight,
          child: Text(
            '${_controller.text.length}/${widget.maxLength}',
            style: const TextStyle(color: AppColors.muted, fontSize: 12),
          ),
        ),
      ],
    );
  }
}

class WizardProgress extends StatelessWidget {
  const WizardProgress({super.key, required this.step, this.labels = defaultLabels});

  final int step;
  final List<String> labels;

  static const defaultLabels = ['Cihaz Türü', 'Özellikler', 'Durum', 'Fotoğraflar'];

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final slot = constraints.maxWidth / labels.length;
        return Column(
          children: [
            SizedBox(
              height: 28,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Positioned(
                    left: slot / 2,
                    right: slot / 2,
                    child: Row(
                      children: [
                        for (var index = 0; index < labels.length - 1; index++)
                          Expanded(
                            child: Container(
                              height: 3,
                              color: index < step ? AppColors.blue : const Color(0xFFE4EBF5),
                            ),
                          ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      for (var index = 0; index < labels.length; index++)
                        Expanded(
                          child: Center(
                            child: Container(
                              width: 28,
                              height: 28,
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                color: index <= step ? AppColors.blue : const Color(0xFFE8EEF5),
                                shape: BoxShape.circle,
                              ),
                              child: index < step
                                  ? const Icon(Icons.check, color: Colors.white, size: 16)
                                  : Text(
                                      '${index + 1}',
                                      style: TextStyle(
                                        color: index == step ? Colors.white : AppColors.muted,
                                        fontSize: 13,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 6),
            Row(
              children: [
                for (var index = 0; index < labels.length; index++)
                  Expanded(
                    child: Text(
                      labels[index],
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 11,
                        color: index == step ? AppColors.blue : AppColors.muted,
                        fontWeight: index == step ? FontWeight.w700 : FontWeight.w500,
                      ),
                    ),
                  ),
              ],
            ),
          ],
        );
      },
    );
  }
}
