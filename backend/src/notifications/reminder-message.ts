export interface ReminderCounts {
  dueToday: number;
  overdue: number;
  birthsSoon: number;
}

const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`;

/** Texte du rappel du matin, ou null s'il n'y a rien à signaler. */
export function reminderMessage(counts: ReminderCounts): { title: string; body: string } | null {
  const parts: string[] = [];
  if (counts.dueToday > 0) parts.push(plural(counts.dueToday, 'tâche prévue aujourd’hui', 'tâches prévues aujourd’hui'));
  if (counts.overdue > 0) parts.push(plural(counts.overdue, 'tâche en retard', 'tâches en retard'));
  if (counts.birthsSoon > 0) parts.push(plural(counts.birthsSoon, 'mise bas attendue sous 2 jours', 'mises bas attendues sous 2 jours'));
  if (parts.length === 0) return null;
  return { title: 'RabbitFarm : ta journée', body: `${parts.join(', ')}.` };
}
