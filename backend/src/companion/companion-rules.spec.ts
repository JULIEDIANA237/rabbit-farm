import { DAY, HOUR, detectQuestions, localDayStart, localHour, nextSlot, type Snapshot } from './companion-rules.js';
import { ADVICE_BY_KEY } from './advice.js';

// Mardi 24 novembre 2026, 13 h à Douala (12 h UTC).
const now = new Date('2026-11-24T12:00:00Z');

const snap = (over: Partial<Snapshot> = {}): Snapshot => ({
  now,
  treatments: [],
  dueReminders: [],
  breedings: [],
  births: [],
  litters: [],
  deaths: [],
  lots: [],
  feed: [],
  femalesFailed: [],
  malesToday: [],
  readyCount: 0,
  rabbitsActive: 10,
  lastActivityAt: now,
  heat: null,
  week: null,
  ...over,
});

const kinds = (s: Snapshot) => detectQuestions(s).map((q) => q.kind);

describe('assistant bras droit : horaires', () => {
  it('les tournées tombent à 6 h, 13 h et 18 h, heure de Douala', () => {
    expect(localHour(nextSlot(new Date('2026-11-24T04:00:00Z')))).toBe(6);
    expect(localHour(nextSlot(new Date('2026-11-24T06:30:00Z')))).toBe(13);
    expect(localHour(nextSlot(new Date('2026-11-24T12:30:00Z')))).toBe(18);
    const late = nextSlot(new Date('2026-11-24T20:00:00Z'));
    expect(localHour(late)).toBe(6);
    expect(localDayStart(late).getTime()).toBe(localDayStart(now).getTime() + DAY);
  });
});

describe('assistant bras droit : questions', () => {
  it('une injection du matin donne une question de suivi à la tournée du soir, avec « Il va mal » qui agit', () => {
    const [q] = detectQuestions(snap({
      treatments: [{ id: 'h1', rabbitId: 'r1', target: 'F07', label: 'une injection', createdAt: new Date('2026-11-24T08:00:00Z') }],
    }));
    expect(q).toMatchObject({ key: 'TREAT:h1', kind: 'TREATMENT_FOLLOWUP', rabbitId: 'r1' });
    expect(localHour(q.askAt)).toBe(13);
    expect(q.title).toBe('F07 a reçu une injection aujourd’hui. Comment va-t-il ?');
    expect(q.options.find((o) => o.value === 'bad')).toMatchObject({ effect: 'OBSERVE_BAD' });
    expect(q.options.find((o) => o.value === 'later')?.snoozeDays).toBeGreaterThan(0);
  });

  it('palpation à J+10, nid à J+28 seulement si la lapine est gestante et sans nid', () => {
    const b = (days: number, status: string, hasNest = false) => ({
      id: `b${days}${status}`, femaleId: 'f1', femaleCode: 'F03', breedingDate: new Date(now.getTime() - days * DAY), status, hasNest, hasBirth: false,
    });
    expect(kinds(snap({ breedings: [b(11, 'AWAITING_PALPATION')] }))).toEqual(['PALPATION']);
    expect(kinds(snap({ breedings: [b(5, 'AWAITING_PALPATION')] }))).toEqual([]);
    expect(kinds(snap({ breedings: [b(28, 'PREGNANT')] }))).toEqual(['NEST']);
    expect(kinds(snap({ breedings: [b(28, 'PREGNANT', true)] }))).toEqual([]);
    expect(kinds(snap({ breedings: [b(28, 'NON_PREGNANT')] }))).toEqual([]);
  });

  it('mise bas, lapereaux à J+3, mort sans cause : les questions de suivi', () => {
    const found = detectQuestions(snap({
      births: [{ id: 'bi1', motherId: 'f1', motherCode: 'F03', liveBorn: 7, createdAt: new Date(now.getTime() - 20 * HOUR) }],
      litters: [{ id: 'l1', motherId: 'f1', motherCode: 'F03', birthDate: new Date(now.getTime() - 3 * DAY), currentCount: 7 }],
      deaths: [{ id: 'd1', date: now, createdAt: now, count: 1, cause: null, label: 'lapereau de F03' }],
    }));
    expect(found.map((q) => q.kind).sort()).toEqual(['BIRTH_FOLLOWUP', 'DEATH_CAUSE', 'KITS_FOLLOWUP']);
    expect(found.find((q) => q.kind === 'BIRTH_FOLLOWUP')?.title).toContain('7 petits vivants');
    expect(found.find((q) => q.kind === 'DEATH_CAUSE')?.options.every((o) => o.effect === 'SET_CAUSE')).toBe(true);
  });

  it('3 morts en 7 jours déclenchent une alerte immédiate', () => {
    const death = (id: string, days: number, count = 1) => ({ id, date: new Date(now.getTime() - days * DAY), createdAt: new Date(now.getTime() - days * DAY), count, cause: 'Diarrhée', label: `lot ${id}` });
    const [alert] = detectQuestions(snap({ deaths: [death('a', 1), death('b', 3, 2)] }));
    expect(alert).toMatchObject({ kind: 'DEATH_CLUSTER', severity: 'danger', adviceKey: 'mortalite-serie' });
    expect(alert.askAt).toEqual(now);
    expect(kinds(snap({ deaths: [death('a', 1), death('b', 9, 5)] }))).toEqual([]);
  });

  it('croissance faible d’un lot (poids en kg ou en g), chaleur, stock bas', () => {
    const lot = (a: number, b: number) => ({ id: 'L4', code: 'L-04', weighings: [{ date: new Date(now.getTime() - 8 * DAY), averageWeight: a }, { date: now, averageWeight: b }] });
    expect(detectQuestions(snap({ lots: [lot(1.2, 1.28)] }))[0].title).toContain('10 g par jour');
    expect(kinds(snap({ lots: [lot(1200, 1440)] }))).toEqual([]); // 30 g/j : normal
    const heat = detectQuestions(snap({ heat: { today: 30, tomorrow: 36 } }));
    expect(heat).toHaveLength(1);
    expect(heat[0]).toMatchObject({ kind: 'HEAT', severity: 'danger' });
    expect(heat[0].title).toContain('demain');
    const [stock] = detectQuestions(snap({ feed: [{ id: 'i1', name: 'granulés', unit: 'kg', currentStock: 10, minimumStock: null, dailyUse: 2.5 }] }));
    expect(stock.title).toBe('Il reste environ 4 jours de granulés');
  });

  it('femelle à réformer, mâle à reposer, lapins prêts, ferme silencieuse', () => {
    expect(kinds(snap({
      femalesFailed: [{ id: 'f9', code: 'F12', misses: 3 }],
      malesToday: [{ id: 'm1', code: 'M02', matings: 2 }],
      readyCount: 4,
      lastActivityAt: new Date(now.getTime() - 4 * DAY),
    })).sort()).toEqual(['FEMALE_FAILED', 'IDLE', 'MALE_REST', 'READY_TO_SELL']);
  });

  it('le bilan du dimanche soir, avec un conseil qui suit la semaine', () => {
    const sunday = new Date('2026-11-29T16:30:00Z');
    const week = { births: 12, deaths: 0, sales: 3, salesAmount: 15000, expenses: 8000 };
    const [w] = detectQuestions(snap({ now: sunday, lastActivityAt: sunday, week }));
    expect(w.kind).toBe('WEEKLY');
    expect(w.title).toBe('Ta semaine : 12 naissances, 0 mort, 3 ventes (15 000 FCFA), 8 000 FCFA de dépenses');
    expect(localHour(w.askAt)).toBe(18);
    expect(detectQuestions(snap({ week }))).toEqual([]); // pas un dimanche
    expect(detectQuestions(snap({ now: sunday, lastActivityAt: sunday, week: { ...week, deaths: 2 } }))[0].adviceKey).toBe('mortalite-serie');
  });

  it('chaque fiche citée par une question existe', () => {
    const all = detectQuestions(snap({
      treatments: [{ id: 'h1', rabbitId: 'r1', target: 'F07', label: 'un soin', createdAt: now }],
      dueReminders: [{ id: 'c1', source: 'CARE', label: 'Vermifuge', target: 'la ferme', rabbitId: null, dueDate: now }],
      deaths: [{ id: 'd1', date: now, createdAt: now, count: 3, cause: null, label: 'F01' }],
      heat: { today: 33, tomorrow: null },
      readyCount: 1,
      femalesFailed: [{ id: 'f9', code: 'F12', misses: 3 }],
    }));
    const keys = all.flatMap((q) => [q.adviceKey, ...q.options.map((o) => o.adviceKey)]).filter(Boolean) as string[];
    expect(keys.length).toBeGreaterThan(5);
    for (const key of keys) expect(ADVICE_BY_KEY.has(key)).toBe(true);
  });
});
