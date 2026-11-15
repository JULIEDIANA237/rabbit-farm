const DAY = 86_400_000;

export interface ProfileFacts {
  sex: string;
  ageDays: number | null;
  weight: number | null;
  daysSinceLastBirth: number | null;
  nursingKits: number;
  matingsLast7Days: number;
  maternalBehavior: string | null;
  recentHealthCount: number;
  activeBreedingStatus: string | null;
}

/** Repères usuels en élevage de lapins de chair. */
export const BREEDING_GUIDE = {
  femaleMinAgeDays: 120,
  maleMinAgeDays: 150,
  femaleMinWeightKg: 3,
  maleMinWeightKg: 3,
  minDaysAfterBirth: 10,
  maxMatingsPerWeek: 4,
};

export const daysBetween = (from: Date, to: Date) => Math.floor((to.getTime() - from.getTime()) / DAY);

/** Points d'attention affichés avant d'enregistrer une saillie. */
export function profileWarnings(facts: ProfileFacts): string[] {
  const g = BREEDING_GUIDE;
  const female = facts.sex === 'FEMALE';
  const warnings: string[] = [];
  const minAge = female ? g.femaleMinAgeDays : g.maleMinAgeDays;
  if (facts.ageDays != null && facts.ageDays < minAge) {
    warnings.push(`Encore jeune : ${facts.ageDays} jours (on attend en général ${Math.round(minAge / 30)} mois).`);
  }
  const minWeight = female ? g.femaleMinWeightKg : g.maleMinWeightKg;
  if (facts.weight != null && facts.weight < minWeight) {
    warnings.push(`Poids faible : ${String(facts.weight).replace('.', ',')} kg (au moins ${minWeight} kg conseillés).`);
  }
  if (facts.weight == null) warnings.push('Poids inconnu : pèse-le avant la saillie.');
  if (facts.recentHealthCount > 0) {
    warnings.push(`${facts.recentHealthCount} problème(s) de santé noté(s) ces 30 derniers jours.`);
  }
  if (female) {
    if (facts.activeBreedingStatus) warnings.push('Elle a déjà une saillie en cours.');
    if (facts.daysSinceLastBirth != null && facts.daysSinceLastBirth < g.minDaysAfterBirth) {
      warnings.push(`Mise bas il y a ${facts.daysSinceLastBirth} jour(s) : attends au moins ${g.minDaysAfterBirth} jours.`);
    }
    if (facts.maternalBehavior === 'POOR') warnings.push('Notée comme mauvaise mère.');
  } else if (facts.matingsLast7Days >= g.maxMatingsPerWeek) {
    warnings.push(`Déjà ${facts.matingsLast7Days} saillies cette semaine : laisse-le se reposer.`);
  }
  return warnings;
}
