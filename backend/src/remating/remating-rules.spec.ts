import { assessRemating, type RematingAnswers } from './remating-rules.js';

const good: RematingAnswers = { weightKg: 4, bodyCondition: 'GOOD', mastitis: false, sick: false, goodAppetite: true, vulva: 'RED' };
const facts = { daysSinceBirth: 11, kitsNursing: 7, previousWeightKg: 4.1 };

describe('assessRemating', () => {
  it('une femelle en bon état à J+11 est prête', () => {
    expect(assessRemating(good, facts)).toMatchObject({ verdict: 'READY', waitDays: 0 });
  });

  it('trop tôt après la mise bas', () => {
    expect(assessRemating(good, { ...facts, daysSinceBirth: 6 })).toMatchObject({ verdict: 'NOT_READY', waitDays: 4 });
  });

  it('maigre ou avec une mammite : pas prête', () => {
    expect(assessRemating({ ...good, bodyCondition: 'THIN' }, facts).verdict).toBe('NOT_READY');
    const r = assessRemating({ ...good, mastitis: true }, facts);
    expect(r).toMatchObject({ verdict: 'NOT_READY', waitDays: 14 });
    expect(r.advice.join(' ')).toContain('vétérinaire');
  });

  it('une forte perte de poids bloque, une perte moyenne fait attendre', () => {
    expect(assessRemating({ ...good, weightKg: 3.4 }, facts).verdict).toBe('NOT_READY');
    expect(assessRemating({ ...good, weightKg: 3.65 }, facts).verdict).toBe('WAIT');
  });

  it('vulve pâle ou grosse portée : attendre quelques jours', () => {
    expect(assessRemating({ ...good, vulva: 'PALE' }, facts)).toMatchObject({ verdict: 'WAIT', waitDays: 2 });
    expect(assessRemating(good, { ...facts, kitsNursing: 10 })).toMatchObject({ verdict: 'WAIT', waitDays: 4 });
  });
});
