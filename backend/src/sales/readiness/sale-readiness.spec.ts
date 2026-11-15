import { evaluateReadiness } from './sale-readiness.js';

const criteria = { minAgeDays: 90, minWeightKg: 2.5 };
const base = { ageDays: 60, weight: null, manual: false, purpose: 'FATTENING' };

describe('evaluateReadiness', () => {
  it('prêt quand le poids est atteint', () => {
    const r = evaluateReadiness({ ...base, weight: 2.6 }, criteria);
    expect(r.state).toBe('READY');
    expect(r.reasons).toContain('Poids atteint : 2,6 kg');
  });

  it('prêt à l’âge si le poids est inconnu, avec un rappel de pesée', () => {
    const r = evaluateReadiness({ ...base, ageDays: 95 }, criteria);
    expect(r.state).toBe('READY');
    expect(r.reasons[0]).toContain('à peser');
  });

  it('pas prêt si l’âge est atteint mais le lapin est trop léger', () => {
    const r = evaluateReadiness({ ...base, ageDays: 95, weight: 2 }, criteria);
    expect(r.state).toBe('SOON');
    expect(r.reasons[0]).toContain('objectif 2,5 kg');
  });

  it('bientôt prêt dans les 14 jours', () => {
    const r = evaluateReadiness({ ...base, ageDays: 80 }, criteria);
    expect(r).toEqual({ state: 'SOON', reasons: ['Prêt dans environ 10 jour(s)'] });
  });

  it('un reproducteur n’est proposé que s’il est choisi à la main', () => {
    expect(evaluateReadiness({ ...base, ageDays: 300, weight: 4, purpose: 'BREEDER' }, criteria).state).toBe('NOT_YET');
    const manual = evaluateReadiness({ ...base, ageDays: 300, weight: 4, purpose: 'BREEDER', manual: true }, criteria);
    expect(manual.state).toBe('READY');
    expect(manual.reasons[0]).toBe('Choisi par toi');
  });

  it('un reproducteur réformé est proposé', () => {
    expect(evaluateReadiness({ ...base, ageDays: 900, purpose: 'REFORM' }, criteria).state).toBe('READY');
  });
});
