import { createHmac } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { NotchPayClient, validSignature, type CheckoutInput, type RemotePayment } from '../src/subscription/notchpay.client.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { createTestApp, gql, gqlOk, registerFarm } from './utils/graphql.js';

/** Paiement Mobile Money en ligne avec un NotchPay simulé. */

const HASH = 'hsk_test_simulee';

class FakeNotchPay {
  enabled = true;
  operators = ['MTN', 'ORANGE'];
  canVerifyWebhooks = true;
  checkouts: CheckoutInput[] = [];
  remote = new Map<string, RemotePayment>();
  fail = false;
  chargeFails = false;
  /** Comme le vrai NotchPay : référence « trx… » à lui, la nôtre en merchant_reference, pas d'id. */
  trxStyle = false;
  charges: Array<{ reference: string; operator: string; phone: string }> = [];

  async checkout(input: CheckoutInput) {
    if (this.fail) throw new Error('panne');
    this.checkouts.push(input);
    const id = `pay_${this.checkouts.length}`;
    if (this.trxStyle) {
      const trx = `trx.${this.checkouts.length}`;
      this.remote.set(trx, { id: null, reference: trx, merchantReference: input.reference, status: 'pending', amount: input.amount, currency: 'XAF' });
      return { id: null, reference: trx, url: `https://pay.example/${trx}` };
    }
    this.remote.set(id, { id, reference: input.reference, status: 'pending', amount: input.amount, currency: 'XAF' });
    return { id, reference: input.reference, url: `https://pay.example/${id}` };
  }

  async charge(reference: string, operator: string, phone: string) {
    if (this.chargeFails) throw new Error('canal indisponible');
    this.charges.push({ reference, operator, phone });
    const p = this.remote.get(reference) ?? [...this.remote.values()].find((r) => r.reference === reference)!;
    p.status = 'processing';
  }

  async retrieve(ref: string) {
    return this.remote.get(ref) ?? [...this.remote.values()].find((p) => p.reference === ref || p.merchantReference === ref) ?? null;
  }

  verify(raw: string | Buffer, sig: string | undefined) {
    return validSignature(raw, sig, HASH);
  }
}

const START = `mutation ($plan: SubscriptionPlan!) { startSubscriptionCheckout(plan: $plan) { paymentId url } }`;
const DIRECT = `mutation ($plan: SubscriptionPlan!, $operator: MobileOperator, $phone: String) {
  startSubscriptionCheckout(plan: $plan, operator: $operator, phone: $phone) { paymentId url direct error }
}`;
const CHECK = `mutation ($r: String!) { checkSubscriptionPayment(reference: $r) { status periodEnd } }`;

describe('Paiement NotchPay (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let farmId: string;
  const fake = new FakeNotchPay();

  const webhook = (payload: unknown, signature?: string) => {
    const raw = JSON.stringify(payload);
    return request(app.getHttpServer())
      .post('/payments/notchpay/webhook')
      .set('Content-Type', 'application/json')
      .set('x-notch-signature', signature ?? createHmac('sha256', HASH).update(raw).digest('hex'))
      .send(raw);
  };

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp((b) => b.overrideProvider(NotchPayClient).useValue(fake)));
    token = await registerFarm(app, 'notchpay');
    farmId = (await prisma.farm.findFirstOrThrow({ where: { name: 'Ferme notchpay' } })).id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('ouvre une page de paiement au bon prix et signale le paiement en ligne', async () => {
    const { subscriptionStatus } = await gqlOk(app, `{ subscriptionStatus { onlinePaymentEnabled } }`, undefined, token);
    expect(subscriptionStatus.onlinePaymentEnabled).toBe(true);
    const { startSubscriptionCheckout } = await gqlOk(app, START, { plan: 'MONTHLY' }, token);
    expect(startSubscriptionCheckout.url).toBe('https://pay.example/pay_1');
    expect(fake.checkouts[0]).toMatchObject({ amount: 2500, reference: startSubscriptionCheckout.paymentId });
    expect(fake.checkouts[0].callback).toMatch(/\/subscription$/);
    const row = await prisma.subscriptionPayment.findUniqueOrThrow({ where: { id: startSubscriptionCheckout.paymentId } });
    expect(row).toMatchObject({ provider: 'NOTCHPAY', providerRef: 'pay_1', status: 'PENDING' });
    // Le paiement en ligne n'apparaît pas comme « déclaré » en attente.
    const { subscriptionStatus: s2 } = await gqlOk(app, `{ subscriptionStatus { pendingPayment { id } } }`, undefined, token);
    expect(s2.pendingPayment).toBeNull();
  });

  it('refuse un webhook mal signé', async () => {
    const res = await webhook({ event: 'payment.complete', data: { reference: 'x' } }, 'deadbeef');
    expect(res.status).toBe(401);
  });

  it('ne croit pas le webhook tant que NotchPay ne confirme pas', async () => {
    const res = await webhook({ type: 'payment.complete', data: { id: 'pay_1', status: 'complete' } });
    expect(res.status).toBe(200);
    const row = await prisma.subscriptionPayment.findFirstOrThrow({ where: { providerRef: 'pay_1' } });
    expect(row.status).toBe('PENDING');
  });

  it('active l’abonnement une seule fois même si le webhook arrive deux fois', async () => {
    fake.remote.get('pay_1')!.status = 'complete';
    expect((await webhook({ type: 'payment.complete', data: { id: 'pay_1' } })).status).toBe(200);
    expect((await webhook({ type: 'payment.complete', data: { id: 'pay_1' } })).status).toBe(200);
    const row = await prisma.subscriptionPayment.findFirstOrThrow({ where: { providerRef: 'pay_1' } });
    expect(row.status).toBe('CONFIRMED');
    const farm = await prisma.farm.findUniqueOrThrow({ where: { id: farmId } });
    expect(farm.paidUntil?.getTime()).toBe(row.periodEnd?.getTime());
    const days = (farm.paidUntil!.getTime() - Date.now()) / 86_400_000;
    expect(days).toBeGreaterThan(27);
    expect(days).toBeLessThan(32);
  });

  it('refuse un montant inférieur au prix', async () => {
    const { startSubscriptionCheckout } = await gqlOk(app, START, { plan: 'YEARLY' }, token);
    fake.remote.set('pay_2', { id: 'pay_2', reference: startSubscriptionCheckout.paymentId, status: 'complete', amount: 100, currency: 'XAF' });
    const { checkSubscriptionPayment } = await gqlOk(app, CHECK, { r: startSubscriptionCheckout.paymentId }, token);
    expect(checkSubscriptionPayment.status).toBe('PENDING');
  });

  it('un paiement annulé est rejeté, un paiement réussi est vu au retour sur l’app', async () => {
    fake.remote.get('pay_2')!.status = 'canceled';
    const { checkSubscriptionPayment: ko } = await gqlOk(app, CHECK, { r: 'pay_2' }, token);
    expect(ko.status).toBe('REJECTED');

    const before = (await prisma.farm.findUniqueOrThrow({ where: { id: farmId } })).paidUntil!;
    const { startSubscriptionCheckout } = await gqlOk(app, START, { plan: 'YEARLY' }, token);
    fake.remote.get('pay_3')!.status = 'complete';
    const { checkSubscriptionPayment: ok } = await gqlOk(app, CHECK, { r: startSubscriptionCheckout.paymentId }, token);
    expect(ok.status).toBe('CONFIRMED');
    const after = (await prisma.farm.findUniqueOrThrow({ where: { id: farmId } })).paidUntil!;
    expect((after.getTime() - before.getTime()) / 86_400_000).toBeGreaterThan(364);
  });

  it('un autre élevage ne peut pas vérifier ce paiement, et une panne NotchPay est expliquée', async () => {
    const other = await registerFarm(app, 'notchpay-autre');
    const res = await gql(app, CHECK, { r: 'pay_1' }, other);
    expect(res.errors?.[0].message).toMatch(/introuvable/);
    fake.fail = true;
    const res2 = await gql(app, START, { plan: 'MONTHLY' }, token);
    expect(res2.errors?.[0].message).toMatch(/ne répond pas/);
    fake.fail = false;
  });

  it('paiement direct : la demande part sur le téléphone, l’app suit jusqu’à l’activation', async () => {
    const before = (await prisma.farm.findUniqueOrThrow({ where: { id: farmId } })).paidUntil!;
    const { startSubscriptionCheckout: r } = await gqlOk(app, DIRECT, { plan: 'MONTHLY', operator: 'ORANGE', phone: '690 00 00 00' }, token);
    expect(r.direct).toBe(true);
    expect(fake.charges.at(-1)).toEqual({ reference: r.paymentId, operator: 'ORANGE', phone: '+237690000000' });
    const { checkSubscriptionPayment: waiting } = await gqlOk(app, CHECK, { r: r.paymentId }, token);
    expect(waiting.status).toBe('PENDING');
    [...fake.remote.values()].find((p) => p.reference === r.paymentId)!.status = 'complete';
    const { checkSubscriptionPayment: done } = await gqlOk(app, CHECK, { r: r.paymentId }, token);
    expect(done.status).toBe('CONFIRMED');
    const after = (await prisma.farm.findUniqueOrThrow({ where: { id: farmId } })).paidUntil!;
    expect(after.getTime()).toBeGreaterThan(before.getTime());
  });

  it('un opérateur non activé est refusé', async () => {
    fake.operators = ['MTN'];
    const { subscriptionStatus } = await gqlOk(app, `{ subscriptionStatus { onlineOperators } }`, undefined, token);
    expect(subscriptionStatus.onlineOperators).toEqual(['MTN']);
    const res = await gql(app, DIRECT, { plan: 'MONTHLY', operator: 'ORANGE', phone: '690000000' }, token);
    expect(res.errors?.[0].message).toMatch(/pas encore disponible/);
    fake.operators = ['MTN', 'ORANGE'];
  });

  it('paiement direct : numéro invalide refusé, échec d’envoi → page NotchPay en secours', async () => {
    const bad = await gql(app, DIRECT, { plan: 'MONTHLY', operator: 'MTN', phone: '22 22 22' }, token);
    expect(bad.errors?.[0].message).toMatch(/Numéro invalide/);
    fake.chargeFails = true;
    const { startSubscriptionCheckout: r } = await gqlOk(app, DIRECT, { plan: 'MONTHLY', operator: 'MTN', phone: '670000000' }, token);
    fake.chargeFails = false;
    expect(r.direct).toBe(false);
    expect(r.error).toBe('canal indisponible');
    expect(r.url).toMatch(/^https:\/\/pay\.example\//);
  });

  it('référence NotchPay « trx… » : suivi et webhook retrouvent le paiement', async () => {
    fake.trxStyle = true;
    const { startSubscriptionCheckout: r } = await gqlOk(app, DIRECT, { plan: 'MONTHLY', operator: 'MTN', phone: '670000000' }, token);
    expect(r.direct).toBe(true);
    const row = await prisma.subscriptionPayment.findUniqueOrThrow({ where: { id: r.paymentId } });
    expect(row.providerRef).toMatch(/^trx\./);
    expect(fake.charges.at(-1)!.reference).toBe(row.providerRef);
    const { checkSubscriptionPayment: waiting } = await gqlOk(app, CHECK, { r: r.paymentId }, token);
    expect(waiting.status).toBe('PENDING');
    fake.remote.get(row.providerRef!)!.status = 'complete';
    expect((await webhook({ type: 'payment.complete', data: { reference: row.providerRef } })).status).toBe(200);
    const after = await prisma.subscriptionPayment.findUniqueOrThrow({ where: { id: r.paymentId } });
    expect(after.status).toBe('CONFIRMED');
    fake.trxStyle = false;
  });
});
