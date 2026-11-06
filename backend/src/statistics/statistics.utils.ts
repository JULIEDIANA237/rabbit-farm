/**
 * Calculs de performances (§50 à §53). Fonctions pures.
 */

export function rate(part: number, total: number): number | null {
  if (!total) return null;
  return Number(((part / total) * 100).toFixed(1));
}

export function average(values: number[]): number | null {
  if (!values.length) return null;
  return Number((values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(3));
}

export interface LitterFacts {
  motherId: string;
  fatherId: string | null;
  liveBorn: number;
  stillBorn: number;
  deaths: number;
  weaned: number;
}

export interface BreederPerformance {
  rabbitId: string;
  litters: number;
  bornAlive: number;
  stillBorn: number;
  deaths: number;
  weaned: number;
  averageLitterSize: number | null;
  survivalRate: number | null;
  weaningRate: number | null;
}

/**
 * Performances par reproducteur (mère ou père).
 */
export function breederPerformances(
  litters: LitterFacts[],
  role: 'mother' | 'father',
): BreederPerformance[] {
  const byBreeder = new Map<string, LitterFacts[]>();

  for (const litter of litters) {
    const id = role === 'mother' ? litter.motherId : litter.fatherId;
    if (!id) continue;
    const list = byBreeder.get(id) ?? [];
    list.push(litter);
    byBreeder.set(id, list);
  }

  return [...byBreeder.entries()].map(([rabbitId, list]) => {
    const bornAlive = list.reduce((s, l) => s + l.liveBorn, 0);
    const stillBorn = list.reduce((s, l) => s + l.stillBorn, 0);
    const deaths = list.reduce((s, l) => s + l.deaths, 0);
    const weaned = list.reduce((s, l) => s + l.weaned, 0);

    return {
      rabbitId,
      litters: list.length,
      bornAlive,
      stillBorn,
      deaths,
      weaned,
      averageLitterSize: average(list.map((l) => l.liveBorn)),
      survivalRate: rate(Math.max(0, bornAlive - deaths), bornAlive),
      weaningRate: rate(weaned, bornAlive),
    };
  });
}

export const AGE_BRACKETS: Array<{ label: string; min: number; max: number }> = [
  { label: '0-35 j', min: 0, max: 35 },
  { label: '36-60 j', min: 36, max: 60 },
  { label: '61-90 j', min: 61, max: 90 },
  { label: '91-120 j', min: 91, max: 120 },
  { label: '> 120 j', min: 121, max: Number.MAX_SAFE_INTEGER },
];

/**
 * Poids moyen individuel par tranche d'âge (§51).
 * Une pesée de lot compte pour `animalCount` animaux au poids moyen.
 */
export function averageWeightByAge(
  weighings: Array<{ ageInDays: number | null; averageWeight: number | null; animalCount: number }>,
) {
  return AGE_BRACKETS.map((bracket) => {
    const samples = weighings.filter(
      (w) =>
        w.ageInDays != null &&
        w.averageWeight != null &&
        w.ageInDays >= bracket.min &&
        w.ageInDays <= bracket.max,
    );
    const animals = samples.reduce((s, w) => s + w.animalCount, 0);
    const total = samples.reduce(
      (s, w) => s + (w.averageWeight as number) * w.animalCount,
      0,
    );

    return {
      label: bracket.label,
      sampleCount: animals,
      averageWeight: animals ? Number((total / animals).toFixed(3)) : null,
    };
  });
}

/**
 * Coût de production estimé du kilogramme (§53).
 * Retourne null tant qu'aucun poids vendu n'est connu.
 */
export function estimatedCostPerKg(totalExpenses: number, kgSold: number) {
  if (!kgSold || kgSold <= 0) return null;
  return Number((totalExpenses / kgSold).toFixed(2));
}

export function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function lastMonths(count: number, now = new Date()) {
  const months: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    months.push(monthKey(d));
  }
  return months;
}
