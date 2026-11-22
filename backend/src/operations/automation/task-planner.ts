import {
  TaskPriority,
  TaskSourceType,
} from '../../generated/prisma/enums.js';
import {
  addDays,
  BREEDING_CALENDAR,
  computeWeaningDate,
} from '../../common/calendar/breeding-calendar.js';

/**
 * Planification des tâches générées par les événements métier (§47).
 *
 * Fonctions pures : elles décrivent les tâches à créer, le service
 * `TaskAutomationService` se charge de les enregistrer.
 */

export const AUTOMATION_KEYS = {
  PALPATION: 'BREEDING_PALPATION',
  NEST: 'BREEDING_NEST',
  BIRTH: 'BREEDING_BIRTH',
  WEANING: 'LITTER_WEANING',
  HEALTH_FOLLOW_UP: 'HEALTH_FOLLOW_UP',
  STOCK_REORDER: 'STOCK_REORDER',
  BIRTH_DEWORM: 'BIRTH_DEWORM',
  BIRTH_REMATING: 'BIRTH_REMATING',
} as const;

/** Jours après la mise bas avant de proposer une nouvelle saillie (rythme semi-intensif). */
export const REMATING_DELAY_DAYS = 10;

export type AutomationKey =
  (typeof AUTOMATION_KEYS)[keyof typeof AUTOMATION_KEYS];

export interface PlannedTask {
  automationKey: AutomationKey;
  title: string;
  description?: string;
  dueDate: Date;
  priority: TaskPriority;
  sourceType: TaskSourceType;
  sourceId: string;
  rabbitId?: string | null;
}

export interface BreedingForPlanning {
  id: string;
  femaleId: string;
  femaleCode: string;
  maleCode?: string;
  palpationStartDate: Date;
  palpationEndDate: Date;
  nestDate: Date;
  expectedBirthStartDate: Date;
  expectedBirthEndDate: Date;
}

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export function planBreedingTasks(breeding: BreedingForPlanning): PlannedTask[] {
  const couple = breeding.maleCode
    ? `${breeding.femaleCode} × ${breeding.maleCode}`
    : breeding.femaleCode;

  return [
    {
      automationKey: AUTOMATION_KEYS.PALPATION,
      title: `Palper ${breeding.femaleCode}`,
      description: `Palpation de ${couple} entre le ${formatDate(breeding.palpationStartDate)} et le ${formatDate(breeding.palpationEndDate)}.`,
      dueDate: breeding.palpationStartDate,
      priority: TaskPriority.HIGH,
      sourceType: TaskSourceType.BREEDING,
      sourceId: breeding.id,
      rabbitId: breeding.femaleId,
    },
    {
      automationKey: AUTOMATION_KEYS.NEST,
      title: `Installer le nid de ${breeding.femaleCode}`,
      description: `Installation du nid prévue vers J+${BREEDING_CALENDAR.nest}.`,
      dueDate: breeding.nestDate,
      priority: TaskPriority.MEDIUM,
      sourceType: TaskSourceType.BREEDING,
      sourceId: breeding.id,
      rabbitId: breeding.femaleId,
    },
    {
      automationKey: AUTOMATION_KEYS.BIRTH,
      title: `Surveiller la mise bas de ${breeding.femaleCode}`,
      description: `Mise bas probable entre le ${formatDate(breeding.expectedBirthStartDate)} et le ${formatDate(breeding.expectedBirthEndDate)}.`,
      dueDate: breeding.expectedBirthStartDate,
      priority: TaskPriority.HIGH,
      sourceType: TaskSourceType.BREEDING,
      sourceId: breeding.id,
      rabbitId: breeding.femaleId,
    },
  ];
}

export function planRepalpationTask(
  breeding: Pick<BreedingForPlanning, 'id' | 'femaleId' | 'femaleCode'>,
  checkDate: Date,
): PlannedTask {
  return {
    automationKey: AUTOMATION_KEYS.PALPATION,
    title: `Palper à nouveau ${breeding.femaleCode}`,
    description: 'Le résultat de la précédente palpation était non concluant.',
    dueDate: addDays(checkDate, BREEDING_CALENDAR.repalpationDelay),
    priority: TaskPriority.HIGH,
    sourceType: TaskSourceType.BREEDING,
    sourceId: breeding.id,
    rabbitId: breeding.femaleId,
  };
}

export function planWeaningTask(birth: {
  id: string;
  birthDate: Date;
  motherId: string;
  motherCode: string;
  litterCode?: string | null;
}): PlannedTask {
  const subject = birth.litterCode
    ? `la portée ${birth.litterCode}`
    : `la portée de ${birth.motherCode}`;

  return {
    automationKey: AUTOMATION_KEYS.WEANING,
    title: `Sevrer ${subject}`,
    description: `Sevrage prévu à J+${BREEDING_CALENDAR.weaning} après la mise bas.`,
    dueDate: computeWeaningDate(birth.birthDate),
    priority: TaskPriority.MEDIUM,
    sourceType: TaskSourceType.BIRTH,
    sourceId: birth.id,
    rabbitId: birth.motherId,
  };
}

/**
 * Après chaque mise bas : déparasiter la mère, puis, à J+10,
 * évaluer si elle est prête pour une nouvelle saillie (questionnaire).
 */
export function planPostBirthTasks(birth: {
  id: string;
  birthDate: Date;
  motherId: string;
  motherCode: string;
}): PlannedTask[] {
  return [
    {
      automationKey: AUTOMATION_KEYS.BIRTH_DEWORM,
      title: `Déparasiter ${birth.motherCode} après la mise bas`,
      description:
        'Injecter un déparasitant à la mère, par exemple Pandex 1 % (ivermectine), à la dose indiquée par la notice ou le vétérinaire.',
      dueDate: addDays(birth.birthDate, 1),
      priority: TaskPriority.HIGH,
      sourceType: TaskSourceType.BIRTH,
      sourceId: birth.id,
      rabbitId: birth.motherId,
    },
    {
      automationKey: AUTOMATION_KEYS.BIRTH_REMATING,
      title: `${birth.motherCode} peut-elle être ressaillie ?`,
      description: `${REMATING_DELAY_DAYS} jours après la mise bas : réponds au questionnaire (poids, état) pour savoir si elle est prête.`,
      dueDate: addDays(birth.birthDate, REMATING_DELAY_DAYS),
      priority: TaskPriority.MEDIUM,
      sourceType: TaskSourceType.BIRTH,
      sourceId: birth.id,
      rabbitId: birth.motherId,
    },
  ];
}

export function planHealthFollowUpTask(record: {
  id: string;
  rabbitId: string;
  rabbitCode: string;
  type: string;
  nextDueDate: Date;
  treatment?: string | null;
  medication?: string | null;
}): PlannedTask {
  const isVaccination = record.type === 'VACCINATION';
  const what = record.medication || record.treatment;

  return {
    automationKey: AUTOMATION_KEYS.HEALTH_FOLLOW_UP,
    title: isVaccination
      ? `Rappel de vaccination de ${record.rabbitCode}`
      : `Contrôle sanitaire de ${record.rabbitCode}`,
    description: what ? `Suivi : ${what}.` : undefined,
    dueDate: record.nextDueDate,
    priority: isVaccination ? TaskPriority.HIGH : TaskPriority.MEDIUM,
    sourceType: TaskSourceType.HEALTH,
    sourceId: record.id,
    rabbitId: record.rabbitId,
  };
}

export function planStockReorderTask(item: {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  autonomyDays?: number | null;
}, today = new Date()): PlannedTask {
  const autonomy =
    item.autonomyDays != null
      ? ` Autonomie estimée : ${Math.floor(item.autonomyDays)} jour(s).`
      : '';

  return {
    automationKey: AUTOMATION_KEYS.STOCK_REORDER,
    title: `Réapprovisionner ${item.name}`,
    description: `Stock actuel ${item.currentStock} ${item.unit} (minimum ${item.minimumStock} ${item.unit}).${autonomy}`,
    dueDate: today,
    priority:
      item.currentStock <= 0 ? TaskPriority.URGENT : TaskPriority.HIGH,
    sourceType: TaskSourceType.INVENTORY,
    sourceId: item.id,
    rabbitId: null,
  };
}
