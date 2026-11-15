/** Règles « prêt pour la vente », séparées pour être testées sans base. */

export interface ReadinessCriteria {
  minAgeDays: number;
  minWeightKg: number;
}

export interface ReadinessCandidate {
  ageDays: number | null;
  weight: number | null;
  manual: boolean;
  purpose: string;
}

export type ReadinessState = 'READY' | 'SOON' | 'NOT_YET';

/** Jours avant l'âge de vente pour qu'un lapin apparaisse dans « bientôt prêts ». */
export const SOON_DAYS = 14;

const kg = (value: number) => String(Math.round(value * 100) / 100).replace('.', ',');

export function evaluateReadiness(
  rabbit: ReadinessCandidate,
  criteria: ReadinessCriteria,
): { state: ReadinessState; reasons: string[] } {
  const reasons: string[] = [];
  if (rabbit.manual) reasons.push('Choisi par toi');
  const ageOk = rabbit.ageDays != null && rabbit.ageDays >= criteria.minAgeDays;
  const weightOk = rabbit.weight != null && rabbit.weight >= criteria.minWeightKg;
  if (weightOk) reasons.push(`Poids atteint : ${kg(rabbit.weight!)} kg`);
  if (ageOk) {
    reasons.push(
      rabbit.weight == null
        ? `Âge atteint : ${rabbit.ageDays} jours (poids inconnu, à peser)`
        : `Âge atteint : ${rabbit.ageDays} jours`,
    );
  }
  if (rabbit.purpose === 'REFORM' && !rabbit.manual) reasons.push('Reproducteur réformé');

  // Les reproducteurs ne sont proposés que si l'éleveur les choisit ou les réforme.
  const breeder = rabbit.purpose === 'BREEDER' || rabbit.purpose === 'FUTURE_BREEDER';
  if (rabbit.manual) return { state: 'READY', reasons };
  if (breeder) return { state: 'NOT_YET', reasons: [] };
  if (rabbit.purpose === 'REFORM') return { state: 'READY', reasons };
  // Âge atteint mais poids connu trop faible : pas encore.
  const tooLight = rabbit.weight != null && rabbit.weight < criteria.minWeightKg;
  if (weightOk || (ageOk && !tooLight)) return { state: 'READY', reasons };
  if (rabbit.ageDays != null && rabbit.ageDays >= criteria.minAgeDays - SOON_DAYS) {
    const left = Math.max(criteria.minAgeDays - rabbit.ageDays, 0);
    return {
      state: 'SOON',
      reasons: [
        tooLight
          ? `Âge atteint mais ${kg(rabbit.weight!)} kg (objectif ${kg(criteria.minWeightKg)} kg)`
          : `Prêt dans environ ${left} jour(s)`,
      ],
    };
  }
  return { state: 'NOT_YET', reasons: [] };
}
