import type { INestApplication } from '@nestjs/common';
import type { LanguageModelV4GenerateResult } from '@ai-sdk/provider';
import { MockLanguageModelV4 } from 'ai/test';
import request from 'supertest';

import { ASSISTANT_MODEL } from '../src/assistant/assistant.service.js';
import { CompanionService } from '../src/companion/companion.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { createTestApp, gqlOk, registerFarm } from './utils/graphql.js';

/** Prise en main : avancement du démarrage, liens de l'assistant, photo du cahier, questions de la 1re semaine. */

const usage = {
  inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 10, text: 10, reasoning: 0 },
} as unknown as LanguageModelV4GenerateResult['usage'];
const reply = (content: LanguageModelV4GenerateResult['content'], unified: 'stop' | 'tool-calls' = 'stop'): LanguageModelV4GenerateResult => ({
  content, finishReason: { unified, raw: unified }, usage, warnings: [],
});

const SETUP = `{ farmSetup { percent beginner rabbits steps { key done } } }`;

describe('Prise en main de l’app (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  const model = new MockLanguageModelV4();
  let queue: LanguageModelV4GenerateResult[] = [];
  const prompts: string[] = [];

  beforeAll(async () => {
    model.doGenerate = async (options) => {
      prompts.push(JSON.stringify(options.prompt));
      return queue.shift() ?? reply([{ type: 'text', text: 'fin' }]);
    };
    ({ app, prisma } = await createTestApp((b) => b.overrideProvider(ASSISTANT_MODEL).useValue(model)));
    token = await registerFarm(app, 'demarrage');
  });

  afterAll(async () => {
    await app.close();
  });

  it('une ferme neuve est à 0 %, en menu simplifié, et commence par les femelles', async () => {
    const { farmSetup } = await gqlOk(app, SETUP, undefined, token);
    expect(farmSetup).toMatchObject({ percent: 0, beginner: true, rabbits: 0 });
    expect(farmSetup.steps[0]).toEqual({ key: 'FEMALES', done: false });
  });

  it('l’assistant explique et propose un bouton vers le bon formulaire', async () => {
    queue = [
      reply([{ type: 'tool-call', toolCallId: 't1', toolName: 'ouvrirPage', input: JSON.stringify({ path: '/births?new=1', label: 'Noter la mise bas' }) }], 'tool-calls'),
      reply([{ type: 'text', text: 'Choisis la mère, la date, puis le nombre de petits.' }]),
    ];
    const { askAssistant } = await gqlOk(
      app,
      `mutation ($input: AskAssistantInput!) { askAssistant(input: $input) { text links { label href } } }`,
      { input: { message: 'Comment j’enregistre une mise bas ?' } },
      token,
    );
    expect(askAssistant.links).toEqual([{ label: 'Noter la mise bas', href: '/births?new=1' }]);
    expect(prompts.join(' ')).toContain('/import');
  });

  it('la photo du cahier donne un brouillon, puis l’éleveur enregistre tout d’un coup', async () => {
    const reading = {
      rabbits: [{ code: 'F01', sex: 'FEMALE', breed: 'Californien' }, { code: 'F02', sex: 'FEMALE' }],
      breedings: [{ femaleCode: 'F01', maleCode: 'M01', date: '2026-11-10' }],
      unreadable: [],
    };
    queue = [reply([{ type: 'text', text: JSON.stringify(reading) }])];
    const res = await request(app.getHttpServer())
      .post('/assistant/notebook')
      .set('Authorization', `Bearer ${token}`)
      .attach('photo', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), { filename: 'cahier.png', contentType: 'image/png' });
    expect(res.status).toBe(201);
    expect(res.body.rabbits.map((r: { code: string; sex: string }) => `${r.code}:${r.sex}`)).toEqual(['F01:FEMALE', 'F02:FEMALE', 'M01:MALE']);
    expect(res.body.breedings).toHaveLength(1);

    const refused = await request(app.getHttpServer()).post('/assistant/notebook').set('Authorization', `Bearer ${token}`)
      .attach('photo', Buffer.from('texte'), { filename: 'a.txt', contentType: 'text/plain' });
    expect(refused.status).toBe(400);

    const { importNotebook } = await gqlOk(
      app,
      `mutation ($input: ImportNotebookInput!) { importNotebook(input: $input) { rabbits breedings errors } }`,
      {
        input: {
          rabbits: res.body.rabbits.map(({ exists: _e, ...r }: Record<string, unknown>) => r),
          breedings: [...res.body.breedings, { femaleCode: 'F02', maleCode: 'M99', date: '2026-11-12' }],
        },
      },
      token,
    );
    expect(importNotebook).toMatchObject({ rabbits: 3, breedings: 1 });
    expect(importNotebook.errors).toEqual(['Saillie F02 × M99 : lapin introuvable (M99).']);
    const f01 = await prisma.rabbit.findFirstOrThrow({ where: { code: 'F01' } });
    expect(f01).toMatchObject({ sex: 'FEMALE', purpose: 'BREEDER', origin: 'Cahier de la ferme' });
    expect(f01.observations).toContain('Californien');

    const { farmSetup } = await gqlOk(app, SETUP, undefined, token);
    expect(farmSetup.steps.filter((s: { done: boolean }) => s.done).map((s: { key: string }) => s.key)).toEqual(['FEMALES', 'MALES', 'BREEDING']);
  });

  it('la tournée pose la prochaine étape de démarrage, puis la retire une fois faite', async () => {
    const companion = app.get(CompanionService);
    const farm = await prisma.farm.findFirstOrThrow({ where: { name: 'Ferme demarrage' } });
    await companion.tour({ farmId: farm.id, notify: false });
    const first = await prisma.companionQuestion.findFirstOrThrow({ where: { farmId: farm.id, kind: 'SETUP' } });
    expect(first.key).toMatch(/^SETUP:CAGES:/);

    const section = await prisma.section.create({ data: { farmId: farm.id, name: 'Bâtiment A', type: 'REPRODUCTION' } });
    await prisma.cage.create({ data: { farmId: farm.id, sectionId: section.id, code: 'C-01', capacity: 1 } });
    await companion.tour({ farmId: farm.id, notify: false });
    expect((await prisma.companionQuestion.findUniqueOrThrow({ where: { id: first.id } })).status).toBe('EXPIRED');
    const next = await prisma.companionQuestion.findFirstOrThrow({ where: { farmId: farm.id, kind: 'SETUP', status: 'PENDING' } });
    expect(next.key).toMatch(/^SETUP:STOCK:/);
  });
});
