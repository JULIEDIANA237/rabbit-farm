import type { INestApplication } from '@nestjs/common';

import { createTestApp, daysAgo, gql, gqlOk, registerFarm } from './utils/graphql.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

/** Essai gratuit, lecture seule à la fin, paiement déclaré puis confirmé. */
describe('Essai et abonnement (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let farmer: string;
  let owner: string;
  let farmId: string;

  const createRabbit = (token: string, code: string) =>
    gql(
      app,
      `mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id } }`,
      { input: { code, sex: 'FEMALE', purpose: 'BREEDER', birthDate: daysAgo(300), previousLitters: 0, previousMatings: 0 } },
      token,
    );

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    farmer = await registerFarm(app, 'abo-eleveur');
    owner = await registerFarm(app, 'abo-proprio');
    const { me } = await gqlOk(app, `{ me { email } }`, undefined, owner);
    process.env.PLATFORM_ADMIN_EMAILS = me.email;
    await prisma.platformSetting.deleteMany();
  });

  afterAll(async () => {
    delete process.env.PLATFORM_ADMIN_EMAILS;
    await app.close();
  });

  it('un nouvel élevage commence par 30 jours d’essai', async () => {
    const { subscriptionStatus } = await gqlOk(
      app,
      `{ subscriptionStatus { status readOnly daysLeft settings { trialDays monthlyPrice yearlyPrice } } }`,
      undefined,
      farmer,
    );
    expect(subscriptionStatus).toEqual({
      status: 'TRIAL',
      readOnly: false,
      daysLeft: 30,
      settings: { trialDays: 30, monthlyPrice: 1000, yearlyPrice: 10000 },
    });
    expect((await createRabbit(farmer, 'ABO-1')).errors).toBeUndefined();
  });

  it('après l’essai, l’élevage passe en lecture seule', async () => {
    const { subscriptionAdmin } = await gqlOk(app, `{ subscriptionAdmin { farms { farmId ownerEmail } } }`, undefined, owner);
    const { me } = await gqlOk(app, `{ me { email } }`, undefined, farmer);
    farmId = subscriptionAdmin.farms.find((f: { ownerEmail: string }) => f.ownerEmail === me.email).farmId;
    await prisma.farm.update({ where: { id: farmId }, data: { trialEndsAt: new Date(Date.now() - 1000) } });
    // Le cache de 30 s est vidé par un réglage de la propriétaire.
    await gqlOk(app, `mutation { updatePlatformSettings(input: { paymentInstructions: "Orange Money 6XX" }) { trialDays } }`, undefined, owner);

    const blocked = await createRabbit(farmer, 'ABO-2');
    expect(blocked.errors?.[0]?.message).toContain('lecture seule');
    // La lecture et la note restent permises.
    await gqlOk(app, `{ rabbits { total } }`, undefined, farmer);
    await gqlOk(app, `mutation { rateApp(stars: 5) { stars } }`, undefined, farmer);
    const { subscriptionStatus } = await gqlOk(app, `{ subscriptionStatus { status readOnly settings { paymentInstructions } } }`, undefined, farmer);
    expect(subscriptionStatus).toEqual({ status: 'EXPIRED', readOnly: true, settings: { paymentInstructions: 'Orange Money 6XX' } });
  });

  it('un paiement déclaré puis confirmé rouvre l’accès pour un an', async () => {
    const { declareSubscriptionPayment } = await gqlOk(
      app,
      `mutation { declareSubscriptionPayment(plan: YEARLY, reference: "MP2611.1234") { id amount status } }`,
      undefined,
      farmer,
    );
    expect(declareSubscriptionPayment).toMatchObject({ amount: 10000, status: 'PENDING' });

    const refused = await gql(app, `mutation ($id: ID!) { confirmSubscriptionPayment(id: $id) { id } }`, { id: declareSubscriptionPayment.id }, farmer);
    expect(refused.errors?.[0]?.message).toContain('Réservé');

    const { subscriptionAdmin } = await gqlOk(app, `{ subscriptionAdmin { pendingPayments { id farmName reference } } }`, undefined, owner);
    expect(subscriptionAdmin.pendingPayments).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: declareSubscriptionPayment.id, reference: 'MP2611.1234' })]),
    );
    await gqlOk(app, `mutation ($id: ID!) { confirmSubscriptionPayment(id: $id) { status } }`, { id: declareSubscriptionPayment.id }, owner);

    const { subscriptionStatus } = await gqlOk(app, `{ subscriptionStatus { status readOnly daysLeft } }`, undefined, farmer);
    expect(subscriptionStatus.status).toBe('ACTIVE');
    expect(subscriptionStatus.daysLeft).toBeGreaterThanOrEqual(365);
    expect((await createRabbit(farmer, 'ABO-3')).errors).toBeUndefined();

    const { subscriptionAdmin: after } = await gqlOk(app, `{ subscriptionAdmin { revenueTotal payingFarms } }`, undefined, owner);
    expect(after.revenueTotal).toBeGreaterThanOrEqual(10000);
    expect(after.payingFarms).toBeGreaterThanOrEqual(1);
  });

  it('la propriétaire n’est jamais bloquée et peut offrir des jours', async () => {
    const { subscriptionStatus } = await gqlOk(app, `{ subscriptionStatus { status } }`, undefined, owner);
    expect(subscriptionStatus.status).toBe('EXEMPT');
    await gqlOk(app, `mutation ($f: ID!) { extendTrial(farmId: $f, days: 7) }`, { f: farmId }, owner);
    const farm = await prisma.farm.findUniqueOrThrow({ where: { id: farmId } });
    expect(farm.trialEndsAt!.getTime()).toBeGreaterThan(Date.now() + 6 * 86_400_000);
  });

  it('un accès gratuit à vie ne bloque jamais l’élevage', async () => {
    await prisma.farm.update({ where: { id: farmId }, data: { trialEndsAt: new Date(Date.now() - 1000), paidUntil: null } });
    await gqlOk(app, `mutation ($f: ID!) { setFarmFreeAccess(farmId: $f, free: true) }`, { f: farmId }, owner);
    const { subscriptionStatus } = await gqlOk(app, `{ subscriptionStatus { status readOnly } }`, undefined, farmer);
    expect(subscriptionStatus).toEqual({ status: 'EXEMPT', readOnly: false });
    expect((await createRabbit(farmer, 'ABO-4')).errors).toBeUndefined();
  });
});
