import type { INestApplication } from '@nestjs/common';

import { createTestApp, gql, gqlOk, registerFarm } from './utils/graphql.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';
import { CompanionService } from '../src/companion/companion.service.js';

const DAY = 86_400_000;
const QUESTIONS = `{ companionQuestions { id kind severity title adviceKey options { value label tone snooze href adviceKey } } }`;

/** Assistant « bras droit » : tournée, réponses en un geste et leurs effets. */
describe('Assistant bras droit (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companion: CompanionService;
  let token: string;
  let farmId: string;
  let rabbitId: string;

  const questions = async () => (await gqlOk(app, QUESTIONS, undefined, token)).companionQuestions as Array<{ id: string; kind: string; title: string; adviceKey: string | null; options: Array<{ value: string; snooze: boolean }> }>;
  const answer = (id: string, value: string) =>
    gqlOk(app, `mutation ($id: ID!, $v: String!) { answerCompanionQuestion(id: $id, value: $v) { status answer answerLabel adviceKey href askAt } }`, { id, v: value }, token);

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    companion = app.get(CompanionService);
    token = await registerFarm(app, 'bras-droit');
    farmId = (await prisma.farm.findFirstOrThrow({ where: { name: 'Ferme bras-droit' } })).id;
    const { createRabbit } = await gqlOk(
      app,
      `mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id } }`,
      { input: { code: 'F07', sex: 'FEMALE', purpose: 'BREEDER', birthDate: new Date(Date.now() - 300 * DAY).toISOString(), previousLitters: 0, previousMatings: 0 } },
      token,
    );
    rabbitId = createRabbit.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('après une injection, la tournée pose la question de suivi ; « Il va mal » crée une observation et une tâche', async () => {
    await prisma.healthRecord.create({
      data: { farmId, rabbitId, type: 'TREATMENT', date: new Date(), medication: 'antibiotique', createdAt: new Date(Date.now() - 20 * 3_600_000) },
    });
    await companion.tour({ notify: false });
    await companion.tour({ notify: false }); // une 2e tournée ne crée pas de doublon

    const list = await questions();
    const follow = list.filter((q) => q.kind === 'TREATMENT_FOLLOWUP');
    expect(follow).toHaveLength(1);
    expect(follow[0].title).toContain('F07 a reçu un traitement (antibiotique)');

    const { answerCompanionQuestion } = await answer(follow[0].id, 'bad');
    expect(answerCompanionQuestion).toMatchObject({ status: 'ANSWERED', answer: 'bad', adviceKey: 'perte-appetit' });
    expect(await prisma.healthRecord.count({ where: { rabbitId, type: 'OBSERVATION' } })).toBe(1);
    const task = await prisma.task.findFirstOrThrow({ where: { farmId, automationKey: 'COMPANION_CHECK' } });
    expect(task).toMatchObject({ title: 'Contrôler F07', priority: 'HIGH', rabbitId });

    const again = await gql(app, `mutation ($id: ID!) { answerCompanionQuestion(id: $id, value: "good") { status } }`, { id: follow[0].id }, token);
    expect(again.errors?.[0]?.message).toContain('déjà traitée');
  });

  it('« Pas encore vu » reporte la question ; une mort sans cause reçoit la cause choisie', async () => {
    const care = await prisma.careRecord.create({
      data: { farmId, date: new Date(), careType: 'Vitamines', scope: 'RABBIT', rabbitId, createdAt: new Date(Date.now() - 20 * 3_600_000) },
    });
    const death = await prisma.mortalityRecord.create({ data: { farmId, scope: "RABBIT", date: new Date(), count: 1, createdAt: new Date(Date.now() - 20 * 3_600_000) } });
    await companion.tour({ notify: false });

    const list = await questions();
    const careQ = list.find((q) => q.title.includes('vitamines'));
    expect(careQ).toBeDefined();
    const { answerCompanionQuestion: snoozed } = await answer(careQ!.id, 'later');
    expect(snoozed.status).toBe('PENDING');
    expect(new Date(snoozed.askAt).getTime()).toBeGreaterThan(Date.now());
    expect((await questions()).some((q) => q.id === careQ!.id)).toBe(false);

    const deathQ = list.find((q) => q.kind === 'DEATH_CAUSE');
    await answer(deathQ!.id, 'Diarrhée');
    expect((await prisma.mortalityRecord.findUniqueOrThrow({ where: { id: death.id } })).cause).toBe('Diarrhée');
    expect(care.id).toBeTruthy();
  });

  it('fiches conseils, réglages et autres fermes isolées', async () => {
    const { adviceSheets } = await gqlOk(app, `{ adviceSheets { key title actions } }`, undefined, token);
    expect(adviceSheets.length).toBeGreaterThanOrEqual(20);
    expect(adviceSheets.find((a: { key: string }) => a.key === 'chaleur').actions.length).toBeGreaterThan(2);

    const { updateCompanionSettings } = await gqlOk(
      app,
      `mutation { updateCompanionSettings(input: { maxPerDay: 1, location: "Douala, Bonabéri" }) { enabled maxPerDay location weatherReady } }`,
      undefined,
      token,
    );
    expect(updateCompanionSettings).toEqual({ enabled: true, maxPerDay: 1, location: 'Douala, Bonabéri', weatherReady: false });

    const other = await registerFarm(app, 'bras-droit-voisin');
    expect((await gqlOk(app, QUESTIONS, undefined, other)).companionQuestions).toEqual([]);
    const mine = (await questions())[0];
    const stolen = await gql(app, `mutation ($id: ID!) { dismissCompanionQuestion(id: $id) { status } }`, { id: mine.id }, other);
    expect(stolen.errors?.[0]?.message).toContain('introuvable');
  });

  it('l’éleveur peut demander un tour immédiat', async () => {
    const { companionTourNow } = await gqlOk(app, `mutation { companionTourNow { id kind } }`, undefined, token);
    expect(Array.isArray(companionTourNow)).toBe(true);
  });
});
