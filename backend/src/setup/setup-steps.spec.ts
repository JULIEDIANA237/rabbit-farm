import { setupProgress, type SetupCounts } from './setup-steps.js';

const empty: SetupCounts = { hasLocation: false, cages: 0, females: 0, males: 0, breedings: 0, stockItems: 0, pushSubscriptions: 0 };

describe('démarrage de la ferme', () => {
  it('commence par les femelles, avec la photo du cahier en raccourci', () => {
    const p = setupProgress(empty);
    expect(p.percent).toBe(0);
    expect(p.next).toMatchObject({ key: 'FEMALES', altHref: '/import' });
  });

  it('avance étape par étape et finit à 100 %', () => {
    const half = setupProgress({ ...empty, females: 4, males: 1, cages: 6 });
    expect(half.done).toBe(3);
    expect(half.percent).toBe(43);
    expect(half.next?.key).toBe('BREEDING');
    const full = setupProgress({ hasLocation: true, cages: 1, females: 1, males: 1, breedings: 1, stockItems: 1, pushSubscriptions: 1 });
    expect(full).toMatchObject({ percent: 100, next: null });
  });
});
