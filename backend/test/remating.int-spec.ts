import type { INestApplication } from '@nestjs/common';

import { createTestApp, daysAgo, gql, gqlOk, registerFarm } from './utils/graphql.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

/** Après la mise bas : déparasitage, questionnaire de ressaillie, sevrage et lot obligatoires. */
describe('Après la mise bas (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let female: string;
  let litterId: string;

  const run = <T = any>(query: string, variables?: Record<string, unknown>) => gqlOk<T>(app, query, variables, token);
  const rabbit = async (code: string, sex: string) =>
    (
      await run(`mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id } }`, {
        input: { code, sex, purpose: 'BREEDER', birthDate: daysAgo(400), previousLitters: 0, previousMatings: 0 },
      })
    ).createRabbit.id as string;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    token = await registerFarm(app, 'ressaillie');
    female = await rabbit('F-RES', 'FEMALE');
    const male = await rabbit('M-RES', 'MALE');
    await prisma.rabbit.update({ where: { id: female }, data: { weight: 4.2 } });
    const { createBreeding } = await run(`mutation ($input: CreateBreedingInput!) { createBreeding(input: $input) { id } }`, {
      input: { femaleId: female, maleId: male, breedingDate: daysAgo(43) },
    });
    await run(`mutation ($input: CreatePregnancyCheckInput!) { createPregnancyCheck(input: $input) { id } }`, {
      input: { breedingId: createBreeding.id, checkedDate: daysAgo(31), result: 'PREGNANT' },
    });
    ({ createBirth: { litterId } } = await run(`mutation ($input: CreateBirthInput!) { createBirth(input: $input) { litterId } }`, {
      input: { breedingId: createBreeding.id, birthDate: daysAgo(12), liveBorn: 7, stillBorn: 0 },
    }));
  });

  afterAll(async () => {
    await app.close();
  });

  it('la mise bas crée le déparasitage de la mère et la ressaillie à J+10', async () => {
    const tasks = await prisma.task.findMany({ where: { rabbitId: female, automationKey: { in: ['BIRTH_DEWORM', 'BIRTH_REMATING'] } } });
    expect(tasks.map((t) => t.automationKey).sort()).toEqual(['BIRTH_DEWORM', 'BIRTH_REMATING']);
    expect(tasks.find((t) => t.automationKey === 'BIRTH_DEWORM')!.description).toContain('Pandex 1 %');

    // L'assistant du tableau de bord propose le questionnaire plutôt qu'une saillie directe.
    const { farmSuggestions } = await run(`{ farmSuggestions { key href } }`);
    const keys = farmSuggestions.map((x: { key: string }) => x.key);
    expect(keys).toContain(`REMATING_${female}`);
    expect(keys).not.toContain(`MATE_${female}`);
  });

  it('maigre : pas prête, la tâche est reportée', async () => {
    const { rematingContext } = await run(`query ($f: ID!) { rematingContext(femaleId: $f) { daysSinceBirth kitsNursing lastWeightKg taskId } }`, { f: female });
    expect(rematingContext).toMatchObject({ daysSinceBirth: 12, kitsNursing: 7, lastWeightKg: 4.2 });
    expect(rematingContext.taskId).toBeTruthy();

    const input = { femaleId: female, weightKg: 4.1, bodyCondition: 'THIN', mastitis: false, sick: false, goodAppetite: true, vulva: 'RED' };
    const { assessRemating } = await run(`mutation ($input: AssessRematingInput!) { assessRemating(input: $input) { verdict waitDays nextCheck } }`, { input });
    expect(assessRemating).toMatchObject({ verdict: 'NOT_READY', waitDays: 7 });
    const task = await prisma.task.findUniqueOrThrow({ where: { id: rematingContext.taskId } });
    expect(task.status).toBe('TODO');
    expect(task.dueDate.getTime()).toBeGreaterThan(Date.now() + 6 * 86_400_000);

    const ready = await run(`mutation ($input: AssessRematingInput!) { assessRemating(input: $input) { verdict advice } }`, {
      input: { ...input, bodyCondition: 'GOOD' },
    });
    expect(ready.assessRemating.verdict).toBe('READY');
    expect((await prisma.task.findUniqueOrThrow({ where: { id: rematingContext.taskId } })).status).toBe('COMPLETED');
    expect(Number((await prisma.rabbit.findUniqueOrThrow({ where: { id: female } })).weight)).toBeCloseTo(4.1);
  });

  it('le sevrage exige la portée', async () => {
    const res = await gql(app, `mutation ($input: CreateWeaningInput!) { createWeaning(input: $input) { id } }`, { input: { litterId: '', plannedDate: daysAgo(0), quantity: 5 } }, token);
    expect(res.errors?.[0]?.message).toContain('portée');
    expect(litterId).toBeTruthy();
  });

  it('le formulaire de lot reçoit le prochain code libre', async () => {
    const { nextFatteningLotCode } = await run(`{ nextFatteningLotCode }`);
    expect(nextFatteningLotCode).toMatch(/^LOT-\d{2}$/);
  });
});
