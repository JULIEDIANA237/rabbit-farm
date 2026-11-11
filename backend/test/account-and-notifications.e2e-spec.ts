import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MockLanguageModelV4 } from 'ai/test';

import { ASSISTANT_CONFIG, ASSISTANT_MODEL } from '../src/assistant/assistant.service.js';
import { readAiConfig } from '../src/assistant/ai-config.js';
import { MailService, type MailMessage } from '../src/mail/mail.service.js';
import { createTestApp, gql, gqlOk, registerFarm } from './utils/graphql.js';

/**
 * Mot de passe oublié, notifications (abonnement + tâche planifiée) et
 * limite quotidienne de l'IA enregistrée en base.
 */
describe('Compte, notifications et limite IA (e2e)', () => {
  let app: INestApplication;
  const mails: MailMessage[] = [];
  const model = new MockLanguageModelV4({
    doGenerate: async () => ({
      content: [{ type: 'text', text: 'ok' }],
      finishReason: { unified: 'stop', raw: 'stop' },
      usage: { inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 }, outputTokens: { total: 1, text: 1, reasoning: 0 } },
      warnings: [],
    }) as never,
  });

  beforeAll(async () => {
    ({ app } = await createTestApp((builder) =>
      builder
        .overrideProvider(MailService)
        .useValue({ configured: true, send: async (message: MailMessage) => void mails.push(message) })
        .overrideProvider(ASSISTANT_MODEL)
        .useValue(model)
        .overrideProvider(ASSISTANT_CONFIG)
        .useValue({ ...readAiConfig({ GOOGLE_GENERATIVE_AI_API_KEY: 'test' }), dailyLimit: 2 }),
    ));
  });

  afterAll(async () => {
    await app.close();
  });

  const login = (email: string, password: string) =>
    gql(app, 'mutation ($input: LoginInput!) { login(input: $input) { accessToken } }', { input: { email, password } });

  it('réinitialise le mot de passe avec le lien reçu par e-mail, une seule fois', async () => {
    await registerFarm(app, 'oubli');
    const email = 'eleveur-oubli@example.com';

    const unknown = await gqlOk(app, 'mutation ($input: RequestPasswordResetInput!) { requestPasswordReset(input: $input) }', {
      input: { email: 'personne@example.com' },
    });
    expect(unknown.requestPasswordReset).toBe(true);
    expect(mails).toHaveLength(0);

    await gqlOk(app, 'mutation ($input: RequestPasswordResetInput!) { requestPasswordReset(input: $input) }', { input: { email } });
    expect(mails).toHaveLength(1);
    const token = new URL(mails[0].text.match(/https?:\/\/\S+/)![0]).searchParams.get('token')!;

    const reset = await gqlOk(app, 'mutation ($input: ResetPasswordInput!) { resetPassword(input: $input) }', {
      input: { token, password: 'nouveau-mdp-123' },
    });
    expect(reset.resetPassword).toBe(true);

    expect((await login(email, 'motdepasse123')).errors).toBeDefined();
    expect((await login(email, 'nouveau-mdp-123')).errors).toBeUndefined();

    const again = await gql(app, 'mutation ($input: ResetPasswordInput!) { resetPassword(input: $input) }', {
      input: { token, password: 'encore-un-autre' },
    });
    expect(again.errors?.[0].message).toMatch(/plus valable/);
  });

  it('abonne un appareil aux rappels et protège la tâche planifiée', async () => {
    const token = await registerFarm(app, 'push');
    const config = await gqlOk(app, '{ pushConfig { enabled publicKey } }', {}, token);
    expect(config.pushConfig.enabled).toBe(false);

    const subscribed = await gqlOk(
      app,
      'mutation ($input: PushSubscriptionInput!) { subscribePush(input: $input) }',
      { input: { endpoint: 'https://push.example.com/abc', p256dh: 'cle', auth: 'secret' } },
      token,
    );
    expect(subscribed.subscribePush).toBe(true);

    const previous = process.env.CRON_SECRET;
    process.env.CRON_SECRET = 'secret-de-test-assez-long';
    try {
      await request(app.getHttpServer()).get('/cron/daily-reminders').expect(401);
      const ok = await request(app.getHttpServer())
        .get('/cron/daily-reminders')
        .set('Authorization', 'Bearer secret-de-test-assez-long')
        .expect(200);
      // Sans clés VAPID, rien n'est envoyé.
      expect(ok.body).toEqual({ farms: 0, sent: 0 });
    } finally {
      process.env.CRON_SECRET = previous;
    }
  });

  it('compte les demandes à l’IA en base et applique la limite quotidienne', async () => {
    const token = await registerFarm(app, 'quota');
    const ask = () =>
      gql(app, 'mutation ($input: AskAssistantInput!) { askAssistant(input: $input) { text } }', { input: { message: 'Bonjour' } }, token);

    expect((await ask()).errors).toBeUndefined();
    expect((await ask()).errors).toBeUndefined();
    const third = await ask();
    expect(third.errors?.[0].message).toMatch(/Limite quotidienne/);
  });
});
