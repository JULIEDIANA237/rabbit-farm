import { DAY, HOUR, detect, plainBrief, type AgentFacts, type FarmFacts } from './agent-rules.js';

const now = new Date('2026-11-23T05:00:00Z');

const farm = (over: Partial<FarmFacts> = {}): FarmFacts => ({
  id: 'f1',
  name: 'Ferme Test',
  createdAt: new Date(now.getTime() - 20 * DAY),
  status: 'TRIAL',
  daysLeft: 10,
  trialEndsAt: new Date(now.getTime() + 10 * DAY),
  paidUntil: null,
  ownerEmail: 'eleveur@test.cm',
  ownerFirstName: 'Awa',
  rabbits: 12,
  lastSeenAt: new Date(now.getTime() - DAY),
  ...over,
});

const facts = (over: Partial<AgentFacts> = {}): AgentFacts => ({
  now,
  monthlyPrice: 1000,
  yearlyPrice: 10000,
  appUrl: 'https://app.test',
  pendingPayments: [],
  farms: [],
  newUsers24h: 0,
  newFarms24h: 0,
  contacts: [],
  lowRatings: [],
  errors24h: 0,
  lastError: null,
  dbSizeMb: null,
  dbLimitMb: 512,
  totalUsers: 3,
  hostingPlan: 'hobby',
  ...over,
});

describe('agent : détection', () => {
  it('rien à signaler : aucune proposition et un point du matin rassurant', () => {
    const f = facts({ farms: [farm()] });
    expect(detect(f)).toEqual([]);
    expect(plainBrief(f, [])).toContain('Rien d’urgent');
  });

  it('un paiement en attente depuis plus de 24 h passe en urgent, avec l’action de confirmation', () => {
    const [p] = detect(facts({
      pendingPayments: [{ id: 'p1', farmName: 'Ferme A', amount: 10000, plan: 'YEARLY', reference: 'MP123', createdAt: new Date(now.getTime() - 30 * HOUR) }],
    }));
    expect(p).toMatchObject({ key: 'PAYMENT:p1', severity: 'danger', action: 'CONFIRM_PAYMENT', targetId: 'p1' });
    expect(p.title).toContain('10 000 FCFA');
    expect(p.detail).toContain('MP123');
  });

  it('un essai qui finit dans 3 jours donne un brouillon de rappel avec les prix', () => {
    const [s] = detect(facts({ farms: [farm({ daysLeft: 2, trialEndsAt: new Date(now.getTime() + 2 * DAY) })] }));
    expect(s).toMatchObject({ kind: 'TRIAL_ENDING', action: 'SEND_EMAIL', recipient: 'eleveur@test.cm' });
    expect(s.draft).toContain('Bonjour Awa');
    expect(s.draft).toContain('1 000 FCFA');
    expect(s.draft).toContain('https://app.test/subscription');
  });

  it('un élevage actif passé en lecture seule : proposer des jours d’essai et un message', () => {
    const end = new Date(now.getTime() - 2 * DAY);
    const kinds = detect(facts({ farms: [farm({ status: 'EXPIRED', daysLeft: 0, trialEndsAt: end })] })).map((s) => s.kind);
    expect(kinds).toEqual(expect.arrayContaining(['EXTEND_TRIAL', 'EXPIRED']));
  });

  it('les élevages gratuits à vie ne sont jamais relancés', () => {
    const f = farm({ status: 'EXEMPT', rabbits: 0, daysLeft: 0, lastSeenAt: new Date(now.getTime() - 60 * DAY) });
    expect(detect(facts({ farms: [f] }))).toEqual([]);
  });

  it('élevage sans lapin après 3 jours et élevage inactif depuis 14 jours', () => {
    const kinds = detect(facts({
      farms: [
        farm({ id: 'a', rabbits: 0, createdAt: new Date(now.getTime() - 4 * DAY) }),
        farm({ id: 'b', lastSeenAt: new Date(now.getTime() - 20 * DAY) }),
      ],
    })).map((s) => s.kind);
    expect(kinds).toEqual(['SETUP_STUCK', 'DORMANT']);
  });

  it('message de contact, avis négatif, erreurs et base pleine ; le plus urgent d’abord', () => {
    const found = detect(facts({
      contacts: [{ id: 'c1', name: 'Paul', contact: 'paul@test.cm', message: 'Bonjour, une démo ?', createdAt: now }],
      lowRatings: [{ id: 'r1', stars: 1, comment: 'Trop lent', farmName: 'Ferme B', updatedAt: now }],
      errors24h: 7,
      lastError: 'Timeout base de données',
      dbSizeMb: 450,
    }));
    expect(found[0].kind).toBe('ERRORS');
    expect(found.map((s) => s.kind)).toEqual(expect.arrayContaining(['CONTACT', 'RATING', 'DATABASE']));
    expect(found.find((s) => s.kind === 'CONTACT')).toMatchObject({ action: 'REPLY_CONTACT', recipient: 'paul@test.cm' });
  });

  it('un élevage sans e-mail de propriétaire ne produit pas de brouillon impossible à envoyer', () => {
    expect(detect(facts({ farms: [farm({ ownerEmail: null, daysLeft: 1 })] }))).toEqual([]);
  });

  it('rappelle de passer à Vercel Pro au-delà du seuil d’utilisateurs ou dès le premier abonné, plus après le passage', () => {
    expect(detect(facts({ totalUsers: 19 })).some((s) => s.kind === 'HOSTING')).toBe(false);
    const [h] = detect(facts({ totalUsers: 20 }));
    expect(h).toMatchObject({ kind: 'HOSTING', key: 'HOSTING:2026-11', action: 'NONE' });
    expect(h.detail).toContain('HOSTING_PLAN=pro');
    expect(detect(facts({ farms: [farm({ status: 'ACTIVE', daysLeft: 200 })] })).some((s) => s.kind === 'HOSTING')).toBe(true);
    expect(detect(facts({ totalUsers: 50, hostingPlan: 'pro' })).some((s) => s.kind === 'HOSTING')).toBe(false);
  });
});
