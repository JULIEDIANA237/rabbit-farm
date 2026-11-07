/**
 * Point du jour : calcul déterministe (sans IA) de ce qui demande
 * l'attention de l'éleveur aujourd'hui. L'IA peut ensuite le résumer.
 */

export type BriefingTone = 'info' | 'warning' | 'danger' | 'success';

export interface BriefingItem {
  key: string;
  label: string;
  count: number;
  href: string;
  tone: BriefingTone;
}

export interface BriefingInput {
  overdueTasks: number;
  /** Tâches automatiques à faire aujourd'hui, par clé d'automatisation. */
  dueTodayByKey: Record<string, number>;
  /** Autres tâches (manuelles) à faire aujourd'hui. */
  otherTasksToday: number;
  birthsExpectedSoon: number;
  deathsLast7Days: number;
  deathsPrevious7Days: number;
  lowStockItems: number;
}

const AUTOMATION_ITEMS: Array<{ key: string; label: (n: number) => string; href: string; tone: BriefingTone }> = [
  { key: 'BREEDING_PALPATION', label: (n) => `${n} palpation${n > 1 ? 's' : ''} à faire`, href: '/tasks', tone: 'info' },
  { key: 'BREEDING_NEST', label: (n) => `${n} nid${n > 1 ? 's' : ''} à installer`, href: '/tasks', tone: 'info' },
  { key: 'BREEDING_BIRTH', label: (n) => `${n} mise${n > 1 ? 's' : ''} bas attendue${n > 1 ? 's' : ''} aujourd'hui`, href: '/tasks', tone: 'warning' },
  { key: 'LITTER_WEANING', label: (n) => `${n} portée${n > 1 ? 's' : ''} à sevrer`, href: '/weaning', tone: 'info' },
  { key: 'HEALTH_FOLLOW_UP', label: (n) => `${n} suivi${n > 1 ? 's' : ''} sanitaire${n > 1 ? 's' : ''}`, href: '/health', tone: 'warning' },
  { key: 'STOCK_REORDER', label: (n) => `${n} réapprovisionnement${n > 1 ? 's' : ''} à prévoir`, href: '/operations/inventory', tone: 'warning' },
];

export function buildBriefing(input: BriefingInput): BriefingItem[] {
  const items: BriefingItem[] = [];

  if (input.overdueTasks > 0) {
    items.push({
      key: 'OVERDUE',
      label: `${input.overdueTasks} tâche${input.overdueTasks > 1 ? 's' : ''} en retard`,
      count: input.overdueTasks,
      href: '/tasks',
      tone: 'danger',
    });
  }

  for (const definition of AUTOMATION_ITEMS) {
    const count = input.dueTodayByKey[definition.key] ?? 0;
    if (count > 0) {
      items.push({ key: definition.key, label: definition.label(count), count, href: definition.href, tone: definition.tone });
    }
  }

  if (input.otherTasksToday > 0) {
    items.push({
      key: 'TASKS_TODAY',
      label: `${input.otherTasksToday} autre${input.otherTasksToday > 1 ? 's' : ''} tâche${input.otherTasksToday > 1 ? 's' : ''} du jour`,
      count: input.otherTasksToday,
      href: '/tasks',
      tone: 'info',
    });
  }

  if (input.birthsExpectedSoon > 0) {
    items.push({
      key: 'BIRTHS_SOON',
      label: `${input.birthsExpectedSoon} mise${input.birthsExpectedSoon > 1 ? 's' : ''} bas prévue${input.birthsExpectedSoon > 1 ? 's' : ''} d'ici 3 jours`,
      count: input.birthsExpectedSoon,
      href: '/breeding',
      tone: 'info',
    });
  }

  // Alerte mortalité : au moins 3 morts sur 7 jours et en nette hausse.
  const { deathsLast7Days: recent, deathsPrevious7Days: previous } = input;
  if (recent >= 3 && recent >= Math.max(2 * previous, previous + 3)) {
    items.push({
      key: 'MORTALITY_SPIKE',
      label: `Mortalité en hausse : ${recent} morts en 7 jours (contre ${previous} la semaine d'avant)`,
      count: recent,
      href: '/statistics',
      tone: 'danger',
    });
  }

  if (input.lowStockItems > 0) {
    items.push({
      key: 'LOW_STOCK',
      label: `${input.lowStockItems} article${input.lowStockItems > 1 ? 's' : ''} sous le stock minimum`,
      count: input.lowStockItems,
      href: '/operations/inventory',
      tone: 'warning',
    });
  }

  return items;
}
