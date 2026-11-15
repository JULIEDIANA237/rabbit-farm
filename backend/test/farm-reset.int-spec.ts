import type { INestApplication } from '@nestjs/common';

import { createTestApp, daysAgo, gql, gqlOk, registerFarm } from './utils/graphql.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

/**
 * Bouton « Réinitialiser » : tout part sauf les lapins adultes,
 * les tâches, le stock et les dépenses.
 */
describe('Réinitialisation de l’élevage (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  const run = <T = any>(query: string, variables?: Record<string, unknown>) =>
    gqlOk<T>(app, query, variables, token);

  const rabbit = async (code: string, sex: string) =>
    (
      await run(
        `mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id } }`,
        { input: { code, sex, purpose: 'BREEDER', birthDate: daysAgo(400) } },
      )
    ).createRabbit.id as string;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    token = await registerFarm(app, 'reset');
  });

  afterAll(async () => {
    await app.close();
  });

  it('efface reproduction, lapereaux, santé et ventes, garde lapins, tâches, stock et dépenses', async () => {
    const female = await rabbit('F-RESET', 'FEMALE');
    const male = await rabbit('M-RESET', 'MALE');
    const { me } = await run(`{ me { farm { id } } }`);
    const farmId = me.farm.id as string;

    const { createBreeding } = await run(
      `mutation ($input: CreateBreedingInput!) { createBreeding(input: $input) { id } }`,
      { input: { femaleId: female, maleId: male, breedingDate: daysAgo(50) } },
    );
    await run(
      `mutation ($input: CreatePregnancyCheckInput!) { createPregnancyCheck(input: $input) { id } }`,
      { input: { breedingId: createBreeding.id, checkedDate: daysAgo(38), result: 'PREGNANT' } },
    );
    const { createBirth } = await run(
      `mutation ($input: CreateBirthInput!) { createBirth(input: $input) { litterId } }`,
      { input: { breedingId: createBreeding.id, birthDate: daysAgo(18), liveBorn: 3, stillBorn: 0 } },
    );
    const kits = await prisma.rabbit.findMany({ where: { birthLitterId: createBirth.litterId } });
    await run(
      `mutation ($input: CreateSaleInput!) { createSale(input: $input) { id } }`,
      { input: { saleDate: daysAgo(1), items: [{ rabbitId: kits[0].id, unitPrice: 4000 }] } },
    );
    await run(
      `mutation ($input: CreateHealthRecordInput!) { createHealthRecord(input: $input) { id } }`,
      { input: { rabbitId: female, date: daysAgo(1), symptoms: 'Toux' } },
    );
    await prisma.expense.create({ data: { farmId, category: 'FEED', amount: 15000, date: new Date() } });
    await prisma.inventoryItem.create({ data: { farmId, name: 'Granulés', type: 'FEED', unit: 'kg', currentStock: 50 } });
    const tasksBefore = await prisma.task.count({ where: { farmId, rabbitId: null } });
    const femaleTasks = await prisma.task.count({ where: { farmId, rabbitId: female } });
    await prisma.task.create({ data: { farmId, title: 'Réparer l’abreuvoir', dueDate: new Date() } });

    const { farmResetPreview } = await run(`{ farmResetPreview { label count } }`);
    expect(farmResetPreview).toEqual(
      expect.arrayContaining([
        { label: 'Lapereaux d’engraissement', count: 3 },
        { label: 'Ventes et paiements', count: 1 },
      ]),
    );

    const refused = await gql(app, `mutation { resetFarmData(confirmation: "oui") { count } }`, undefined, token);
    expect(refused.errors?.[0]?.message).toContain('RÉINITIALISER');

    await run(`mutation { resetFarmData(confirmation: "réinitialiser") { label count } }`);

    expect(await prisma.rabbit.count({ where: { farmId } })).toBe(2);
    for (const model of ['breeding', 'pregnancy', 'birth', 'litter', 'sale', 'healthRecord'] as const) {
      expect(await (prisma[model] as any).count({ where: { farmId } })).toBe(0);
    }
    expect(await prisma.expense.count({ where: { farmId } })).toBe(1);
    expect(await prisma.inventoryItem.count({ where: { farmId } })).toBe(1);
    expect(await prisma.task.count({ where: { farmId, rabbitId: null } })).toBe(tasksBefore + 1);
    // Les tâches des lapins gardés restent aussi.
    expect(await prisma.task.count({ where: { farmId, rabbitId: female } })).toBe(femaleTasks);
  });
});
