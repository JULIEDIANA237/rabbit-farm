import { computeBreedingCalendar } from '../../common/calendar/breeding-calendar.js';
import {
  AUTOMATION_KEYS,
  planBreedingTasks,
  planHealthFollowUpTask,
  planRepalpationTask,
  planStockReorderTask,
  planWeaningTask,
} from './task-planner.js';

describe('task-planner (§47)', () => {
  const breedingDate = new Date('2026-09-10T00:00:00.000Z');
  const breeding = {
    id: 'b1',
    femaleId: 'f10',
    femaleCode: 'F10',
    maleCode: 'M02',
    ...computeBreedingCalendar(breedingDate),
  };

  it('génère palpation (J+10), nid (J+28) et mise bas (J+30) après accouplement', () => {
    const tasks = planBreedingTasks(breeding);

    expect(tasks.map((task) => task.automationKey)).toEqual([
      AUTOMATION_KEYS.PALPATION,
      AUTOMATION_KEYS.NEST,
      AUTOMATION_KEYS.BIRTH,
    ]);
    expect(tasks[0].dueDate.toISOString().slice(0, 10)).toBe('2026-09-20');
    expect(tasks[1].dueDate.toISOString().slice(0, 10)).toBe('2026-10-08');
    expect(tasks[2].dueDate.toISOString().slice(0, 10)).toBe('2026-10-10');
    expect(tasks[1].title).toBe('Installer le nid de F10');
    expect(tasks.every((task) => task.sourceId === 'b1')).toBe(true);
    expect(tasks.every((task) => task.rabbitId === 'f10')).toBe(true);
    expect(tasks[0].description).toContain('F10 × M02');
  });

  it('replanifie une palpation 4 jours après un résultat non concluant', () => {
    const task = planRepalpationTask(breeding, new Date('2026-09-21T00:00:00.000Z'));

    expect(task.automationKey).toBe(AUTOMATION_KEYS.PALPATION);
    expect(task.dueDate.toISOString().slice(0, 10)).toBe('2026-09-25');
  });

  it('planifie le sevrage à J+35 après la naissance', () => {
    const task = planWeaningTask({
      id: 'birth1',
      birthDate: new Date('2026-10-11T00:00:00.000Z'),
      motherId: 'f10',
      motherCode: 'F10',
      litterCode: 'L001',
    });

    expect(task.title).toBe('Sevrer la portée L001');
    expect(task.dueDate.toISOString().slice(0, 10)).toBe('2026-11-15');
    expect(task.sourceType).toBe('BIRTH');
  });

  it('crée un rappel de vaccination prioritaire', () => {
    const task = planHealthFollowUpTask({
      id: 'h1',
      rabbitId: 'r34',
      rabbitCode: 'R034',
      type: 'VACCINATION',
      nextDueDate: new Date('2026-12-01T00:00:00.000Z'),
      medication: 'VHD',
    });

    expect(task.title).toBe('Rappel de vaccination de R034');
    expect(task.priority).toBe('HIGH');
    expect(task.description).toContain('VHD');
  });

  it('crée un contrôle pour un traitement', () => {
    const task = planHealthFollowUpTask({
      id: 'h2',
      rabbitId: 'r34',
      rabbitCode: 'R034',
      type: 'TREATMENT',
      nextDueDate: new Date('2026-12-01T00:00:00.000Z'),
    });

    expect(task.title).toBe('Contrôle sanitaire de R034');
    expect(task.priority).toBe('MEDIUM');
  });

  it('crée une tâche urgente quand le stock est épuisé', () => {
    const task = planStockReorderTask({
      id: 'i1',
      name: 'Granulés',
      unit: 'kg',
      currentStock: 0,
      minimumStock: 50,
      autonomyDays: 0,
    });

    expect(task.priority).toBe('URGENT');
    expect(task.description).toContain('Autonomie estimée : 0 jour');
  });
});
