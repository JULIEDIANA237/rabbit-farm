import {
  addDays,
  ageInDays,
  computeBreedingCalendar,
  computeWeaningDate,
  diffInDays,
} from './breeding-calendar.js';

describe('breeding-calendar', () => {
  const breedingDate = new Date('2026-09-10T00:00:00.000Z');

  it('calcule J+10, J+14, J+28, J+30 et J+32 après accouplement (§22)', () => {
    const calendar = computeBreedingCalendar(breedingDate);

    expect(calendar.palpationStartDate.toISOString()).toBe('2026-09-20T00:00:00.000Z');
    expect(calendar.palpationEndDate.toISOString()).toBe('2026-09-24T00:00:00.000Z');
    expect(calendar.nestDate.toISOString()).toBe('2026-10-08T00:00:00.000Z');
    expect(calendar.expectedBirthStartDate.toISOString()).toBe('2026-10-10T00:00:00.000Z');
    expect(calendar.expectedBirthEndDate.toISOString()).toBe('2026-10-12T00:00:00.000Z');
  });

  it('gère correctement les changements de mois et d’année', () => {
    const calendar = computeBreedingCalendar(new Date('2026-12-20T00:00:00.000Z'));

    expect(calendar.nestDate.toISOString()).toBe('2027-01-17T00:00:00.000Z');
    expect(calendar.expectedBirthEndDate.toISOString()).toBe('2027-01-21T00:00:00.000Z');
  });

  it('ne modifie pas la date d’origine', () => {
    const original = new Date(breedingDate);
    computeBreedingCalendar(original);
    expect(original.toISOString()).toBe(breedingDate.toISOString());
  });

  it('refuse une date invalide', () => {
    expect(() => computeBreedingCalendar(new Date('invalide'))).toThrow();
  });

  it('prévoit le sevrage à J+35 après la naissance (§34)', () => {
    expect(computeWeaningDate(new Date('2026-10-11T00:00:00.000Z')).toISOString()).toBe(
      '2026-11-15T00:00:00.000Z',
    );
  });

  it('calcule différences et âges en jours', () => {
    expect(diffInDays(breedingDate, addDays(breedingDate, 60))).toBe(60);
    expect(ageInDays(breedingDate, addDays(breedingDate, 35))).toBe(35);
    expect(ageInDays(null)).toBeNull();
  });
});
