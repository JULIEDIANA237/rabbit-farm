import type { INestApplication } from '@nestjs/common';

import { createTestApp, gql, gqlOk, registerFarm } from './utils/graphql.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

/** Zone contact de la page d'accueil : envoi sans compte, lecture par la propriétaire. */
describe('Zone contact (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let farmer: string;
  let owner: string;

  const send = (input: Record<string, string>) =>
    gql(app, `mutation ($input: ContactMessageInput!) { sendContactMessage(input: $input) }`, { input });

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    farmer = await registerFarm(app, 'contact-eleveur');
    owner = await registerFarm(app, 'contact-proprio');
    const { me } = await gqlOk(app, `{ me { email } }`, undefined, owner);
    process.env.PLATFORM_ADMIN_EMAILS = me.email;
    await prisma.contactMessage.deleteMany();
  });

  afterAll(async () => {
    delete process.env.PLATFORM_ADMIN_EMAILS;
    await app.close();
  });

  it('un visiteur sans compte envoie un message, que seule la propriétaire lit', async () => {
    const sent = await send({ name: 'Paul', contact: '+237 6 99 00 00 00', message: 'Je voudrais une démonstration de l’app.' });
    expect(sent.errors).toBeUndefined();
    expect(sent.data?.sendContactMessage).toBe(true);

    const refused = await gql(app, `{ contactMessages { id } }`, undefined, farmer);
    expect(refused.errors?.[0]?.message).toContain('Réservé');

    const { contactMessages } = await gqlOk(app, `{ contactMessages { id name contact message handled } }`, undefined, owner);
    expect(contactMessages).toEqual([
      expect.objectContaining({ name: 'Paul', contact: '+237 6 99 00 00 00', handled: false }),
    ]);

    const { setContactMessageHandled } = await gqlOk(
      app,
      `mutation ($id: ID!) { setContactMessageHandled(id: $id, handled: true) { handled } }`,
      { id: contactMessages[0].id },
      owner,
    );
    expect(setContactMessageHandled.handled).toBe(true);
  });

  it('affiche les prix sans compte', async () => {
    const res = await gql(app, `{ publicPricing { trialDays monthlyPrice yearlyPrice } }`);
    expect(res.errors).toBeUndefined();
    expect(res.data?.publicPricing).toEqual({ trialDays: expect.any(Number), monthlyPrice: expect.any(Number), yearlyPrice: expect.any(Number) });
  });

  it('refuse un message trop court et ignore les robots', async () => {
    const short = await send({ name: 'Al', contact: 'a@b.cm', message: 'Salut' });
    expect(short.errors).toBeDefined();

    const bot = await send({ name: 'Robot', contact: 'bot@spam.io', message: 'Achetez nos produits miracles !', website: 'http://spam.io' });
    expect(bot.data?.sendContactMessage).toBe(true);
    expect(await prisma.contactMessage.count({ where: { name: 'Robot' } })).toBe(0);
  });
});
