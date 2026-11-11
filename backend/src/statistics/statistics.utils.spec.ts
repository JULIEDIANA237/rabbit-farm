import {
  average,
  averageWeightByAge,
  breederPerformances,
  estimatedCostPerKg,
  lastMonths,
  rate,
} from './statistics.utils.js';

describe('statistics.utils (§51-53)', () => {
  it('calcule taux et moyennes', () => {
    expect(rate(12, 14)).toBe(85.7);
    expect(rate(1, 0)).toBeNull();
    expect(average([14, 7, 9])).toBe(10);
    expect(average([])).toBeNull();
  });

  it('calcule les performances par femelle (survie, sevrage, taille de portée)', () => {
    const perf = breederPerformances(
      [
        { motherId: 'F10', fatherId: 'M02', liveBorn: 14, stillBorn: 1, deaths: 2, weaned: 12 },
        { motherId: 'F10', fatherId: 'M03', liveBorn: 8, stillBorn: 0, deaths: 0, weaned: 8 },
        { motherId: 'F11', fatherId: 'M02', liveBorn: 6, stillBorn: 2, deaths: 3, weaned: 3 },
      ],
      'mother',
    );

    const f10 = perf.find((p) => p.rabbitId === 'F10');
    expect(f10).toMatchObject({
      litters: 2,
      bornAlive: 22,
      stillBorn: 1,
      deaths: 2,
      weaned: 20,
      averageLitterSize: 11,
      survivalRate: 90.9,
      weaningRate: 90.9,
    });

    const males = breederPerformances(
      [
        { motherId: 'F10', fatherId: 'M02', liveBorn: 14, stillBorn: 1, deaths: 2, weaned: 12 },
        { motherId: 'F11', fatherId: 'M02', liveBorn: 6, stillBorn: 2, deaths: 3, weaned: 3 },
        { motherId: 'F12', fatherId: null, liveBorn: 5, stillBorn: 0, deaths: 0, weaned: 5 },
      ],
      'father',
    );
    expect(males).toHaveLength(1);
    expect(males[0].bornAlive).toBe(20);
  });

  it('pondère les pesées de lot par le nombre d’animaux', () => {
    const result = averageWeightByAge([
      { ageInDays: 60, averageWeight: 1.7, animalCount: 8 },
      { ageInDays: 58, averageWeight: 1.85, animalCount: 1 },
      { ageInDays: 30, averageWeight: 0.6, animalCount: 10 },
      { ageInDays: null, averageWeight: 2, animalCount: 1 },
    ]);

    expect(result.find((r) => r.label === '36-60 j')).toEqual({
      label: '36-60 j',
      sampleCount: 9,
      averageWeight: 1.717,
    });
    expect(result.find((r) => r.label === '0-35 j')?.averageWeight).toBe(0.6);
    expect(result.find((r) => r.label === '> 120 j')?.averageWeight).toBeNull();
  });

  it('estime le coût du kilo uniquement si un poids vendu est connu', () => {
    expect(estimatedCostPerKg(1000, 0)).toBeNull();
    expect(estimatedCostPerKg(1000, 400)).toBe(2.5);
  });

  it('liste les derniers mois', () => {
    expect(lastMonths(3, new Date('2026-02-15T00:00:00Z'))).toEqual([
      '2025-12',
      '2026-01',
      '2026-02',
    ]);
  });
});
