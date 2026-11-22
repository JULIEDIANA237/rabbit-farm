import { accessOf, extendPeriod } from './access.js';
import { AccessStatus } from './subscription.models.js';

const now = new Date('2026-11-22T12:00:00Z');
const created = new Date('2026-11-10T12:00:00Z');

describe('accessOf', () => {
  it('compte l’essai à partir de la création', () => {
    expect(accessOf({ createdAt: created, trialEndsAt: null, paidUntil: null }, 30, false, now)).toMatchObject({
      status: AccessStatus.TRIAL,
      daysLeft: 18,
      readOnly: false,
    });
  });

  it('passe en lecture seule après l’essai', () => {
    const a = accessOf({ createdAt: created, trialEndsAt: null, paidUntil: null }, 10, false, now);
    expect(a).toMatchObject({ status: AccessStatus.EXPIRED, readOnly: true, daysLeft: 0 });
  });

  it('un abonnement payé l’emporte sur l’essai fini', () => {
    const a = accessOf({ createdAt: created, trialEndsAt: created, paidUntil: new Date('2026-12-22T12:00:00Z') }, 30, false, now);
    expect(a).toMatchObject({ status: AccessStatus.ACTIVE, daysLeft: 30, readOnly: false });
  });

  it('la propriétaire de l’app n’est jamais bloquée', () => {
    expect(accessOf({ createdAt: created, trialEndsAt: created, paidUntil: null }, 30, true, now).status).toBe(AccessStatus.EXEMPT);
  });
});

describe('extendPeriod', () => {
  it('prolonge depuis la fin en cours', () => {
    expect(extendPeriod(new Date('2026-12-01T00:00:00Z'), 'MONTHLY', now).toISOString()).toBe('2027-01-01T00:00:00.000Z');
  });
  it('repart d’aujourd’hui si la période est finie', () => {
    expect(extendPeriod(new Date('2026-01-01T00:00:00Z'), 'YEARLY', now).toISOString()).toBe('2027-11-22T12:00:00.000Z');
  });
});
