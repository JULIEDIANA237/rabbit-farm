import { buildBriefing, type BriefingInput } from './briefing';

const empty: BriefingInput = {
  overdueTasks: 0,
  dueTodayByKey: {},
  otherTasksToday: 0,
  birthsExpectedSoon: 0,
  deathsLast7Days: 0,
  deathsPrevious7Days: 0,
  lowStockItems: 0,
};

describe('buildBriefing (point du jour)', () => {
  it('ne signale rien quand tout est à jour', () => {
    expect(buildBriefing(empty)).toEqual([]);
  });

  it('liste les retards en premier puis les tâches automatiques du jour', () => {
    const items = buildBriefing({
      ...empty,
      overdueTasks: 2,
      dueTodayByKey: { BREEDING_PALPATION: 3, LITTER_WEANING: 1 },
      otherTasksToday: 1,
    });

    expect(items.map((item) => item.key)).toEqual(['OVERDUE', 'BREEDING_PALPATION', 'LITTER_WEANING', 'TASKS_TODAY']);
    expect(items[0]).toMatchObject({ label: '2 tâches en retard', tone: 'danger' });
    expect(items[1].label).toBe('3 palpations à faire');
    expect(items[2].label).toBe('1 portée à sevrer');
  });

  it('alerte sur une mortalité en nette hausse seulement', () => {
    expect(buildBriefing({ ...empty, deathsLast7Days: 2, deathsPrevious7Days: 0 })).toEqual([]);
    expect(buildBriefing({ ...empty, deathsLast7Days: 4, deathsPrevious7Days: 3 })).toEqual([]);

    const [alert] = buildBriefing({ ...empty, deathsLast7Days: 5, deathsPrevious7Days: 1 });
    expect(alert).toMatchObject({ key: 'MORTALITY_SPIKE', tone: 'danger', count: 5 });
  });

  it('signale le stock bas et les mises bas proches', () => {
    const items = buildBriefing({ ...empty, birthsExpectedSoon: 2, lowStockItems: 1 });
    expect(items.map((item) => item.label)).toEqual([
      '2 mises bas prévues d\'ici 3 jours',
      '1 article sous le stock minimum',
    ]);
  });
});
