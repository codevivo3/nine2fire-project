/**
 * FILE: src/components/tools/fire-tracker/fireTrackerFormatters.ts
 *
 * PURPOSE:
 * - Collects parsing and locale-aware formatting helpers for calculator inputs and results
 *
 * NOTES:
 * - The helpers normalize user-entered values back to plain JS-friendly numbers
 *   so the calculation engine does not need locale-specific branches
 */
import type { CurrencyCode } from './fireTrackerTypes';

export function parseNumber(value: string, label: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a valid number`);
  }

  return parsed;
}

export function toDecimalPercent(value: number) {
  return value / 100;
}

export function getCurrencySymbol(currency: CurrencyCode) {
  return currency === 'EUR' ? '€' : '$';
}

export function getLocaleTag(locale: string) {
  return locale === 'it' ? 'it-IT' : 'en-US';
}

export function normalizeLocalizedNumber(value: string, locale: string) {
  const decimalSeparator = locale === 'it' ? ',' : '.';
  const groupingSeparator = locale === 'it' ? '.' : ',';

  const withoutSpaces = value.replace(/\s+/g, '');
  const withoutGrouping = withoutSpaces.split(groupingSeparator).join('');
  const normalized = withoutGrouping.replace(decimalSeparator, '.');

  return normalized.replace(/[^\d.-]/g, '');
}

export function formatEditingValue(value: string, locale: string) {
  if (!value) {
    return '';
  }

  return locale === 'it' ? value.replace('.', ',') : value;
}

export function formatMoneyValue(value: string, locale: string) {
  if (!value) {
    return '';
  }

  if (value === '-' || value === '.' || value === '-.') {
    return formatEditingValue(value, locale);
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return formatEditingValue(value, locale);
  }

  return new Intl.NumberFormat(getLocaleTag(locale), {
    maximumFractionDigits: 20,
  }).format(parsed);
}
