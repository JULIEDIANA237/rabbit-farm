import { formatMoney, formatNumber } from './format';

/** Conditionnement d'achat d'un article (ex. sac de 25 kg). */
export interface Packaging {
  unit: string;
  packageName?: string | null;
  packageSize?: number | null;
}

export const hasPackage = (item: Packaging): item is Packaging & { packageName: string; packageSize: number } =>
  !!item.packageName && !!item.packageSize && item.packageSize > 0;

const plural = (name: string, count: number) => (count >= 2 && !/[sx]$/.test(name) ? `${name}s` : name);

/** « 2,5 sacs » pour une quantité exprimée dans l'unité de stock. */
export function inPackages(item: Packaging, quantity: number): string | null {
  if (!hasPackage(item)) return null;
  const count = quantity / item.packageSize;
  return `${formatNumber(count, 1)} ${plural(item.packageName, count)}`;
}

/** Libellé du conditionnement : « sac de 25 kg ». */
export function packageLabel(item: Packaging): string | null {
  if (!hasPackage(item)) return null;
  return `${item.packageName} de ${formatNumber(item.packageSize, 2)} ${item.unit}`;
}

/** Prix d'un conditionnement à partir du prix unitaire. */
export function packagePrice(item: Packaging & { unitPrice?: number | null }): number | null {
  const price = item.unitPrice;
  if (price == null || !hasPackage(item)) return null;
  return Math.round(price * item.packageSize);
}

/** « 50 000 FCFA / sac (2 000 FCFA / kg) » ou « 2 000 FCFA / kg ». */
export function priceLabel(item: Packaging & { unitPrice?: number | null }): string {
  if (item.unitPrice == null) return '—';
  const perUnit = `${formatMoney(item.unitPrice)} / ${item.unit}`;
  const perPackage = packagePrice(item);
  return perPackage != null ? `${formatMoney(perPackage)} / ${item.packageName} (${perUnit})` : perUnit;
}
