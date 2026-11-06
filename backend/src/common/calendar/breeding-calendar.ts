/**
 * Calendrier de reproduction (§22, §34, §47 du cahier).
 *
 * Toutes les dates sont prévisionnelles : ce ne sont pas
 * des garanties biologiques.
 */

export const BREEDING_CALENDAR = {
  palpationStart: 10,
  palpationEnd: 14,
  nest: 28,
  birthStart: 30,
  birthEnd: 32,
  weaning: 35,
  /** Nouvelle palpation après un résultat non concluant. */
  repalpationDelay: 4,
} as const;

export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function diffInDays(from: Date, to: Date): number {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY);
}

export interface BreedingCalendar {
  palpationStartDate: Date;
  palpationEndDate: Date;
  nestDate: Date;
  expectedBirthStartDate: Date;
  expectedBirthEndDate: Date;
}

export function computeBreedingCalendar(breedingDate: Date): BreedingCalendar {
  if (Number.isNaN(breedingDate.getTime())) {
    throw new Error('Date d’accouplement invalide.');
  }

  return {
    palpationStartDate: addDays(breedingDate, BREEDING_CALENDAR.palpationStart),
    palpationEndDate: addDays(breedingDate, BREEDING_CALENDAR.palpationEnd),
    nestDate: addDays(breedingDate, BREEDING_CALENDAR.nest),
    expectedBirthStartDate: addDays(breedingDate, BREEDING_CALENDAR.birthStart),
    expectedBirthEndDate: addDays(breedingDate, BREEDING_CALENDAR.birthEnd),
  };
}

export function computeWeaningDate(birthDate: Date): Date {
  return addDays(birthDate, BREEDING_CALENDAR.weaning);
}

/**
 * Âge en jours à une date donnée (null si la date de naissance est inconnue).
 */
export function ageInDays(
  birthDate: Date | null | undefined,
  at: Date = new Date(),
): number | null {
  if (!birthDate) return null;
  return diffInDays(birthDate, at);
}
