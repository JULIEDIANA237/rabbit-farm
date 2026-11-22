import { buildSuggestions, type AdvisorFacts } from './suggestions.js';

const now = new Date('2026-11-22T10:00:00Z');
const empty: AdvisorFacts = {
  now,
  availableFemales: [],
  males: [],
  birthsNext7Days: [],
  freeMaternityCages: 0,
  litters: [],
  freeFatteningPlaces: 0,
  lots: [],
  feeds: [],
  breedersWithoutPast: 0,
};

describe('buildSuggestions', () => {
  it('donne toujours au moins un conseil, même sans rien à faire', () => {
    const out = buildSuggestions(empty);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ key: 'TIP_OF_DAY', kind: 'IDEA' });
  });

  it('rappelle palpations, nids et tâches en retard', () => {
    const out = buildSuggestions({
      ...empty,
      overdueTasks: 3,
      palpationsDue: [{ breedingId: 'b1', femaleCode: 'F01', start: new Date('2026-11-21'), end: new Date('2026-11-25') }],
      nestsDue: [{ breedingId: 'b2', femaleCode: 'F02', date: new Date('2026-11-23') }],
    });
    expect(out.map((s) => s.key)).toEqual(expect.arrayContaining(['TASKS_OVERDUE', 'PALPATION_b1', 'NEST_b2']));
    expect(out.find((s) => s.key === 'PALPATION_b1')!.href).toBe('/breeding?action=palpation&breedingId=b1');
  });

  it('propose le questionnaire plutôt qu’une saillie directe après une mise bas', () => {
    const out = buildSuggestions({
      ...empty,
      availableFemales: [{ id: 'f1', code: 'F01', ageDays: 300, daysSinceBirth: 10, lastPalpationNegative: false, rematingCheck: 'DUE' }],
      males: [{ id: 'm1', code: 'M01', femalesLast24h: 0, matingsLast7d: 0 }],
    });
    expect(out.map((s) => s.key)).toContain('REMATING_f1');
    expect(out.map((s) => s.key)).not.toContain('MATE_f1');
  });
});
