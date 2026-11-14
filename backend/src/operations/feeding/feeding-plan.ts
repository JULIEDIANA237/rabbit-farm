/**
 * Calcul des rations journalières (fonctions pures, testées à part).
 *
 * Chaque lapin actif est classé dans UNE catégorie :
 *   1. lapereau encore sous la mère → non compté (nourri avec la mère) ;
 *   2. femelle allaitante (portée active non sevrée) → LACTATING ;
 *   3. femelle gestante confirmée → PREGNANT ;
 *   4. destination engraissement → FATTENING ;
 *   5. tous les autres (mâles, femelles vides, futurs reproducteurs,
 *      réformes) → MAINTENANCE.
 */

export const FEEDING_CATEGORIES = ['PREGNANT', 'LACTATING', 'FATTENING', 'MAINTENANCE'] as const;
export type FeedingCategoryKey = (typeof FEEDING_CATEGORIES)[number];

export interface RabbitForFeeding {
  id: string;
  sex: string;
  purpose: string;
  /** Statut de la portée de naissance (ACTIVE = encore sous la mère). */
  birthLitterStatus?: string | null;
}

export interface Headcounts {
  PREGNANT: number;
  LACTATING: number;
  FATTENING: number;
  MAINTENANCE: number;
  underMother: number;
}

export function classifyRabbit(
  rabbit: RabbitForFeeding,
  pregnantIds: Set<string>,
  lactatingIds: Set<string>,
): FeedingCategoryKey | 'UNDER_MOTHER' {
  if (rabbit.birthLitterStatus === 'ACTIVE') return 'UNDER_MOTHER';
  if (lactatingIds.has(rabbit.id)) return 'LACTATING';
  if (pregnantIds.has(rabbit.id)) return 'PREGNANT';
  if (rabbit.purpose === 'FATTENING') return 'FATTENING';
  return 'MAINTENANCE';
}

export function countHeadcounts(
  rabbits: RabbitForFeeding[],
  pregnantIds: Set<string>,
  lactatingIds: Set<string>,
): Headcounts {
  const counts: Headcounts = { PREGNANT: 0, LACTATING: 0, FATTENING: 0, MAINTENANCE: 0, underMother: 0 };
  for (const rabbit of rabbits) {
    const category = classifyRabbit(rabbit, pregnantIds, lactatingIds);
    if (category === 'UNDER_MOTHER') counts.underMother += 1;
    else counts[category] += 1;
  }
  return counts;
}

/** Besoin journalier d'un aliment = Σ (effectif × ration par lapin). */
export function dailyNeed(
  rations: Array<{ category: FeedingCategoryKey; dailyQuantity: number }>,
  counts: Headcounts,
) {
  return round(rations.reduce((sum, r) => sum + r.dailyQuantity * counts[r.category], 0));
}

const DAY = 86_400_000;

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Jours entiers écoulés depuis la dernière déduction (aujourd'hui exclu). */
export function pendingDays(appliedUntil: Date | null, until: Date) {
  if (!appliedUntil) return 0;
  return Math.max(0, Math.floor((startOfDay(until).getTime() - startOfDay(appliedUntil).getTime()) / DAY));
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY);
}

export function round(value: number, digits = 3) {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}
