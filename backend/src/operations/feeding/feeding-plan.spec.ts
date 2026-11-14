import { classifyRabbit, countHeadcounts, dailyNeed, pendingDays } from './feeding-plan.js';

describe('rations journalières', () => {
  const pregnant = new Set(['f1', 'f3']);
  const lactating = new Set(['f2', 'f3']);
  const rabbits = [
    { id: 'f1', sex: 'FEMALE', purpose: 'BREEDER' },
    { id: 'f2', sex: 'FEMALE', purpose: 'BREEDER' },
    { id: 'f3', sex: 'FEMALE', purpose: 'BREEDER' },
    { id: 'f4', sex: 'FEMALE', purpose: 'BREEDER' },
    { id: 'm1', sex: 'MALE', purpose: 'BREEDER' },
    { id: 'k1', sex: 'UNKNOWN', purpose: 'FATTENING', birthLitterStatus: 'ACTIVE' },
    { id: 'k2', sex: 'MALE', purpose: 'FATTENING', birthLitterStatus: 'WEANED' },
    { id: 'p1', sex: 'MALE', purpose: 'FATTENING' },
  ];

  it('classe chaque lapin dans une seule catégorie', () => {
    expect(classifyRabbit(rabbits[2], pregnant, lactating)).toBe('LACTATING'); // gestante ET allaitante
    expect(countHeadcounts(rabbits, pregnant, lactating)).toEqual({
      PREGNANT: 1,
      LACTATING: 2,
      FATTENING: 2,
      MAINTENANCE: 2,
      underMother: 1,
    });
  });

  it('calcule le besoin journalier', () => {
    const counts = countHeadcounts(rabbits, pregnant, lactating);
    expect(
      dailyNeed(
        [
          { category: 'PREGNANT', dailyQuantity: 0.2 },
          { category: 'LACTATING', dailyQuantity: 0.35 },
          { category: 'FATTENING', dailyQuantity: 0.12 },
          { category: 'MAINTENANCE', dailyQuantity: 0.15 },
        ],
        counts,
      ),
    ).toBe(1.44);
  });

  it('compte les jours entiers à déduire', () => {
    expect(pendingDays(null, new Date('2026-11-14T10:00:00Z'))).toBe(0);
    expect(pendingDays(new Date('2026-11-10T12:00:00Z'), new Date('2026-11-14T08:00:00Z'))).toBe(4);
    expect(pendingDays(new Date('2026-11-15T00:00:00Z'), new Date('2026-11-14T08:00:00Z'))).toBe(0);
  });
});
