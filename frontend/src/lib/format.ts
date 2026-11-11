export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? 'FCFA';

export function formatDate(value?: string | Date | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('fr-FR');
}

export function formatMoney(value?: number | null): string {
  if (value == null) return '—';
  return `${Math.round(value).toLocaleString('fr-FR')} ${CURRENCY}`;
}

export function formatNumber(value?: number | null, digits = 1): string {
  if (value == null) return '—';
  return value.toLocaleString('fr-FR', { maximumFractionDigits: digits });
}

export function formatPercent(value?: number | null): string {
  return value == null ? '—' : `${formatNumber(value)} %`;
}

/** Valeur pour un <input type="date"> (aujourd'hui par défaut). */
export function toDateInput(value?: string | Date | null): string {
  const date = value ? new Date(value) : new Date();
  return date.toISOString().slice(0, 10);
}

/** Convertit une date de formulaire en ISO (midi UTC pour éviter les décalages). */
export function fromDateInput(value: string): string {
  return new Date(`${value}T12:00:00.000Z`).toISOString();
}

export function ageInDays(birthDate?: string | null): number | null {
  if (!birthDate) return null;
  return Math.floor((Date.now() - new Date(birthDate).getTime()) / 86_400_000);
}

export function errorMessage(error: unknown): string {
  if (!error) return '';
  const message = error instanceof Error ? error.message : String(error);
  // Erreur réseau (API éteinte, mauvaise adresse, CORS…) : message compréhensible.
  if (/failed to fetch|networkerror|load failed|network request failed/i.test(message)) {
    return 'Serveur injoignable. Vérifie ta connexion internet, puis réessaie.';
  }
  return message;
}

/** Retire les chaînes vides pour ne pas envoyer "" au lieu de null. */
export function clean<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).filter(([, v]) => v !== '' && v !== undefined),
  ) as T;
}
