/**
 * Autonomie alimentaire (§46) :
 *
 *   stock actuel ÷ consommation quotidienne moyenne = jours d'autonomie
 *
 * La consommation moyenne est calculée sur une fenêtre glissante
 * (30 jours par défaut) à partir des mouvements CONSUMPTION.
 */

export interface ConsumptionMovement {
  type: string;
  quantity: number;
  date: Date;
}

export interface AutonomyResult {
  averageDailyConsumption: number | null;
  autonomyDays: number | null;
  windowDays: number;
}

export const DEFAULT_AUTONOMY_WINDOW_DAYS = 30;

export function computeAutonomy(
  currentStock: number,
  movements: ConsumptionMovement[],
  now: Date = new Date(),
  windowDays = DEFAULT_AUTONOMY_WINDOW_DAYS,
): AutonomyResult {
  const windowStart = new Date(now.getTime() - windowDays * 86_400_000);

  const consumptions = movements.filter(
    (movement) =>
      movement.type === 'CONSUMPTION' &&
      movement.date >= windowStart &&
      movement.date <= now,
  );

  if (consumptions.length === 0) {
    return { averageDailyConsumption: null, autonomyDays: null, windowDays };
  }

  // La période réelle commence au premier mouvement de la fenêtre
  // pour ne pas sous-estimer la consommation d'un stock récent.
  const firstDate = consumptions.reduce(
    (min, movement) => (movement.date < min ? movement.date : min),
    consumptions[0].date,
  );
  const observedDays = Math.max(
    1,
    Math.ceil((now.getTime() - firstDate.getTime()) / 86_400_000),
  );
  const period = Math.min(windowDays, observedDays);

  const total = consumptions.reduce(
    (sum, movement) => sum + Math.abs(movement.quantity),
    0,
  );
  const averageDailyConsumption = total / period;

  return {
    averageDailyConsumption: Number(averageDailyConsumption.toFixed(3)),
    autonomyDays:
      averageDailyConsumption > 0
        ? Number((Math.max(currentStock, 0) / averageDailyConsumption).toFixed(1))
        : null,
    windowDays,
  };
}

/**
 * Stock reconstitué à partir des mouvements (§45) :
 * initial + achats + retours − consommation − pertes ± ajustements.
 */
export function stockFromMovements(
  movements: Array<{ type: string; quantity: number }>,
): number {
  return movements.reduce((sum, movement) => {
    switch (movement.type) {
      case 'INITIAL':
      case 'PURCHASE':
      case 'RETURN':
        return sum + Math.abs(movement.quantity);
      case 'CONSUMPTION':
      case 'LOSS':
        return sum - Math.abs(movement.quantity);
      default:
        return sum + movement.quantity;
    }
  }, 0);
}
