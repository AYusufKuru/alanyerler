import { BadRequestException } from '@nestjs/common';
import { CatalogField } from './catalog';

const OTHER = 'Diğer';

export function validateFields(
  fields: CatalogField[],
  input: Record<string, unknown>,
  groupLabel: string,
): Record<string, string> {
  const allowed = new Set<string>();
  for (const field of fields) {
    allowed.add(field.key);
    if (field.options?.includes(OTHER)) {
      allowed.add(`${field.key}Diger`);
    }
  }

  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) {
      throw new BadRequestException(
        `${groupLabel} içinde bilinmeyen alan: ${key}`,
      );
    }
  }

  const result: Record<string, string> = {};
  for (const field of fields) {
    const raw = input[field.key];
    if (raw == null || raw === '') {
      if (field.required) {
        throw new BadRequestException(`${field.label} gerekli.`);
      }
      continue;
    }
    if (typeof raw !== 'string') {
      throw new BadRequestException(`${field.label} metin olmalı.`);
    }
    const value = raw.trim();
    if (!value) {
      if (field.required) {
        throw new BadRequestException(`${field.label} gerekli.`);
      }
      continue;
    }
    if (field.maxLength && value.length > field.maxLength) {
      throw new BadRequestException(
        `${field.label} en fazla ${field.maxLength} karakter olabilir.`,
      );
    }
    if (field.options && !field.options.includes(value)) {
      throw new BadRequestException(`${field.label} için geçersiz seçim.`);
    }
    if (value === OTHER) {
      const otherRaw = input[`${field.key}Diger`];
      if (typeof otherRaw !== 'string' || !otherRaw.trim()) {
        throw new BadRequestException(`${field.label} için diğer değeri yazın.`);
      }
      if (otherRaw.trim().length > 80) {
        throw new BadRequestException(
          `${field.label} diğer değeri en fazla 80 karakter olabilir.`,
        );
      }
      result[`${field.key}Diger`] = otherRaw.trim();
    }
    result[field.key] = value;
  }

  return result;
}

export function displayValue(
  values: Record<string, string>,
  key: string,
): string | undefined {
  const value = values[key];
  if (!value) {
    return undefined;
  }
  if (value === OTHER) {
    return values[`${key}Diger`] ?? value;
  }
  return value;
}
