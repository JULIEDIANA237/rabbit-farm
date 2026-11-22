import type { INestApplication } from '@nestjs/common';

import { createTestApp, gql, gqlOk, registerFarm } from './utils/graphql.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

const OVERVIEW = `{ agentOverview { aiEnabled mailEnabled brief { text usedAi pending } pending { id kind action status title href recipient draft } } }`;

/** Agent de la propriétaire : détection, validation, refus, expiration. */
describe('Agent propriétaire (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let farmer: string;
  let owner: string;

  const overview = async () => (await gqlOk(app, OVERVIEW, undefined, owner)).agentOverview;
  const refresh = () => gqlOk(app, `mutation { refreshAgent { text pending usedAi } }`, undefined, owner);

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    farmer = await registerFarm(app, 'agent-eleveur');
    owner = await registerFarm(app, 'agent-proprio');
    const { me } = await gqlOk(app, `{ me { email } }`, undefined, owner);
    process.env.PLATFORM_ADMIN_EMAILS = me.email;
    await prisma.agentSuggestion.deleteMany();
    await prisma.agentLog.deleteMany();
    await prisma.agentBrief.deleteMany();
    await prisma.contactMessage.deleteMany();
  });

  afterAll(async () => {
    delete process.env.PLATFORM_ADMIN_EMAILS;
    await app.close();
  });

  it('est réservé à la propriétaire', async () => {
    const res = await gql(app, `{ agentOverview { aiEnabled } }`, undefined, farmer);
    expect(res.errors?.[0]?.message).toContain('Réservé');
    const run = await gql(app, `mutation { refreshAgent { text } }`, undefined, farmer);
    expect(run.errors?.[0]?.message).toContain('Réservé');
  });

  it('propose de confirmer un paiement et de répondre à un message, puis exécute la validation', async () => {
    const { declareSubscriptionPayment: payment } = await gqlOk(
      app,
      `mutation { declareSubscriptionPayment(plan: MONTHLY, reference: "AG-123") { id } }`,
      undefined,
      farmer,
    );
    await gqlOk(app, `mutation ($input: ContactMessageInput!) { sendContactMessage(input: $input) }`, {
      input: { name: 'Paul', contact: '+237 699 00 00 00', message: 'Bonjour, comment payer l’abonnement ?' },
    });

    const { refreshAgent } = await refresh();
    expect(refreshAgent.usedAi).toBe(false);
    expect(refreshAgent.text.length).toBeGreaterThan(10);

    const view = await overview();
    expect(view.aiEnabled).toBe(false);
    const pay = view.pending.find((s: { kind: string }) => s.kind === 'PAYMENT');
    const contact = view.pending.find((s: { kind: string }) => s.kind === 'CONTACT');
    expect(pay).toMatchObject({ action: 'CONFIRM_PAYMENT', status: 'PENDING' });
    expect(contact).toMatchObject({ action: 'REPLY_CONTACT', recipient: '+237 699 00 00 00' });
    expect(contact.draft).toContain('[Réponse à compléter]');

    // Une deuxième tournée ne crée pas de doublon.
    await refresh();
    expect((await overview()).pending.filter((s: { kind: string }) => s.kind === 'PAYMENT')).toHaveLength(1);

    const { approveAgentSuggestion } = await gqlOk(
      app,
      `mutation ($id: ID!) { approveAgentSuggestion(id: $id) { status resolvedBy } }`,
      { id: pay.id },
      owner,
    );
    expect(approveAgentSuggestion.status).toBe('DONE');
    expect((await prisma.subscriptionPayment.findUniqueOrThrow({ where: { id: payment.id } })).status).toBe('CONFIRMED');

    // Contact par téléphone : réponse faite sur WhatsApp, le message est marqué traité.
    await gqlOk(app, `mutation ($id: ID!, $d: String) { approveAgentSuggestion(id: $id, draft: $d) { status } }`, {
      id: contact.id,
      d: 'Bonjour Paul, tu paies par Orange Money depuis l’onglet Abonnement.',
    }, owner);
    expect((await prisma.contactMessage.findFirstOrThrow({ where: { name: 'Paul' } })).handled).toBe(true);

    const again = await gql(app, `mutation ($id: ID!) { approveAgentSuggestion(id: $id) { status } }`, { id: pay.id }, owner);
    expect(again.errors?.[0]?.message).toContain('déjà traitée');

    const { agentLog } = await gqlOk(app, `{ agentLog { actor action } }`, undefined, owner);
    expect(agentLog).toEqual(expect.arrayContaining([
      expect.objectContaining({ actor: 'OWNER', action: 'CONFIRM_PAYMENT' }),
      expect.objectContaining({ actor: 'AGENT', action: 'BRIEF' }),
    ]));
  });

  it('ignore une proposition et expire celle dont la situation a disparu', async () => {
    await gqlOk(app, `mutation ($input: ContactMessageInput!) { sendContactMessage(input: $input) }`, {
      input: { name: 'Awa', contact: 'awa@example.cm', message: 'Je voudrais une démonstration.' },
    });
    await gqlOk(app, `mutation ($input: ContactMessageInput!) { sendContactMessage(input: $input) }`, {
      input: { name: 'Jean', contact: 'jean@example.cm', message: 'Avez-vous une version hors ligne ?' },
    });
    await refresh();
    const pending = (await overview()).pending;
    const awa = pending.find((s: { title: string }) => s.title.includes('Awa'));
    const jean = pending.find((s: { title: string }) => s.title.includes('Jean'));

    const { dismissAgentSuggestion } = await gqlOk(app, `mutation ($id: ID!) { dismissAgentSuggestion(id: $id) { status } }`, { id: awa.id }, owner);
    expect(dismissAgentSuggestion.status).toBe('DISMISSED');

    // Jean est traité à la main dans l'onglet Messages : la proposition expire.
    await prisma.contactMessage.updateMany({ where: { name: 'Jean' }, data: { handled: true } });
    await refresh();
    expect((await overview()).pending.find((s: { id: string }) => s.id === jean.id)).toBeUndefined();
    const { agentHistory } = await gqlOk(app, `{ agentHistory { id status } }`, undefined, owner);
    expect(agentHistory).toEqual(expect.arrayContaining([
      { id: jean.id, status: 'EXPIRED' },
      { id: awa.id, status: 'DISMISSED' },
    ]));
  });

  it('refuse d’envoyer un e-mail qui contient encore le passage à compléter', async () => {
    // Inséré directement : la zone contact est limitée à 3 envois par minute.
    await prisma.contactMessage.create({ data: { name: 'Marie', contact: 'marie@example.cm', message: 'Quel est le prix annuel ?' } });
    await refresh();
    const marie = (await overview()).pending.find((s: { title: string }) => s.title.includes('Marie'));
    const res = await gql(app, `mutation ($id: ID!) { approveAgentSuggestion(id: $id) { status } }`, { id: marie.id }, owner);
    expect(res.errors?.[0]?.message).toContain('Réponse à compléter');
  });

  it('répond que l’IA n’est pas configurée pour les questions libres', async () => {
    const res = await gql(app, `mutation { askAgent(input: { question: "Combien d'abonnés ?" }) }`, undefined, owner);
    expect(res.errors?.[0]?.message).toContain('IA n’est pas configurée');
  });
});
