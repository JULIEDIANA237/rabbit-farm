import type { INestApplication } from '@nestjs/common';

import { createTestApp, daysAgo, gqlOk, registerFarm } from './utils/graphql.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

/**
 * Achat au sac, passé des reproducteurs, profil avant saillie,
 * lapins prêts pour la vente et soins saisis par l'éleveur.
 */
describe('Élevage au quotidien (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  const run = <T = any>(query: string, variables?: Record<string, unknown>) =>
    gqlOk<T>(app, query, variables, token);

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    token = await registerFarm(app, 'elevage');
  });

  afterAll(async () => {
    await app.close();
  });

  it('stock : un article acheté au sac garde son conditionnement', async () => {
    // Sac de 50 kg à 50 000 : 1 000 le kg, 2 sacs en stock.
    const { createInventoryItem: item } = await run(
      `mutation ($input: CreateInventoryItemInput!) { createInventoryItem(input: $input) { id packageName packageSize unitPrice currentStock stockValue } }`,
      { input: { name: 'Provende', type: 'FEED', unit: 'kg', packageName: 'sac', packageSize: 50, unitPrice: 1000, initialStock: 100 } },
    );
    expect(item).toMatchObject({ packageName: 'sac', packageSize: 50, unitPrice: 1000, currentStock: 100, stockValue: 100000 });

    const { updateInventoryItem } = await run(
      `mutation ($input: UpdateInventoryItemInput!) { updateInventoryItem(input: $input) { packageName packageSize } }`,
      { input: { id: item.id, packageName: null, packageSize: null } },
    );
    expect(updateInventoryItem).toEqual({ packageName: null, packageSize: null });
  });

  it('femelle : son passé est enregistré et repris avant la saillie', async () => {
    const { createRabbit: female } = await run(
      `mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id purpose previousLitters maternalBehavior healthHistory } }`,
      {
        input: {
          code: 'F-PASSE',
          sex: 'FEMALE',
          purpose: 'BREEDER',
          birthDate: daysAgo(400),
          weight: 2.5,
          previousLitters: 2,
          previousKitsBorn: 15,
          lastBirthDate: daysAgo(5),
          maternalBehavior: 'GOOD',
          healthHistory: 'Gale des oreilles',
        },
      },
    );
    expect(female).toMatchObject({ purpose: 'BREEDER', previousLitters: 2, maternalBehavior: 'GOOD', healthHistory: 'Gale des oreilles' });
    // Les antécédents rejoignent le suivi sanitaire.
    expect(await prisma.healthRecord.count({ where: { rabbitId: female.id } })).toBe(1);

    const { reproductionProfile: profile } = await run(
      `query ($id: ID!) { reproductionProfile(rabbitId: $id) { totalLitters kitsBornAlive averageLiveBorn daysSinceLastBirth warnings } }`,
      { id: female.id },
    );
    expect(profile).toMatchObject({ totalLitters: 2, kitsBornAlive: 15, averageLiveBorn: 7.5, daysSinceLastBirth: 5 });
    expect(profile.warnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Poids faible'),
        expect.stringContaining('Mise bas il y a 5 jour(s)'),
        expect.stringContaining('1 problème(s) de santé'),
      ]),
    );

    // Les poids saisis à la saillie mettent la fiche à jour.
    const { createRabbit: male } = await run(
      `mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id } }`,
      { input: { code: 'M-PASSE', sex: 'MALE', purpose: 'BREEDER', birthDate: daysAgo(400), previousMatings: 12 } },
    );
    await run(`mutation ($input: CreateBreedingInput!) { createBreeding(input: $input) { id } }`, {
      input: { femaleId: female.id, maleId: male.id, breedingDate: daysAgo(0), femaleWeight: 3.9, maleWeight: 4.3, acknowledgeWarnings: true },
    });
    const weights = await prisma.rabbit.findMany({ where: { id: { in: [female.id, male.id] } }, select: { code: true, weight: true } });
    expect(Object.fromEntries(weights.map((w) => [w.code, Number(w.weight)]))).toEqual({ 'F-PASSE': 3.9, 'M-PASSE': 4.3 });
    const { reproductionProfile: maleProfile } = await run(
      `query ($id: ID!) { reproductionProfile(rabbitId: $id) { totalMatings matingsLast7Days } }`,
      { id: male.id },
    );
    expect(maleProfile).toEqual({ totalMatings: 13, matingsLast7Days: 1 });
  });

  it('vente : lapins prêts selon l’âge et le poids, ou choisis à la main', async () => {
    const create = async (code: string, extra: Record<string, unknown>) =>
      (
        await run(`mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id } }`, {
          input: { code, sex: 'UNKNOWN', purpose: 'FATTENING', ...extra },
        })
      ).createRabbit.id as string;
    await create('V-LOURD', { birthDate: daysAgo(70), weight: 2.7 });
    await create('V-AGE', { birthDate: daysAgo(100) });
    await create('V-BIENTOT', { birthDate: daysAgo(80) });
    await create('V-JEUNE', { birthDate: daysAgo(40) });

    const list = async () =>
      (await run(`{ saleReadiness { criteria { minAgeDays } ready { code manual } soon { code } } }`)).saleReadiness;
    let readiness = await list();
    expect(readiness.criteria.minAgeDays).toBe(90);
    expect(readiness.ready.map((r: { code: string }) => r.code).sort()).toEqual(['V-AGE', 'V-LOURD']);
    expect(readiness.soon.map((r: { code: string }) => r.code)).toEqual(['V-BIENTOT']);

    const young = (await prisma.rabbit.findFirstOrThrow({ where: { code: 'V-JEUNE' } })).id;
    await run(`mutation ($ids: [ID!]!) { setRabbitsReadyForSale(rabbitIds: $ids, ready: true) }`, { ids: [young] });
    await run(`mutation { updateSaleCriteria(minAgeDays: 75, minWeightKg: 3) { minAgeDays } }`);
    readiness = await list();
    expect(readiness.ready.map((r: { code: string }) => r.code).sort()).toEqual(['V-AGE', 'V-BIENTOT', 'V-JEUNE']);
    expect(readiness.ready.find((r: { code: string }) => r.code === 'V-JEUNE').manual).toBe(true);
  });

  it('soins : saisis librement, avec une tâche pour le prochain soin', async () => {
    const { createCareRecord: care } = await run(
      `mutation ($input: CreateCareRecordInput!) { createCareRecord(input: $input) { id targetLabel nextDate } }`,
      { input: { date: daysAgo(0), careType: 'Vermifuge', scope: 'FARM', product: 'Ivomec', nextDate: daysAgo(-14) } },
    );
    expect(care.targetLabel).toBe('Toute la ferme');
    const task = await prisma.task.findFirstOrThrow({ where: { sourceId: care.id } });
    expect(task.title).toBe('Soin : Vermifuge (Toute la ferme)');

    await expect(
      gqlOkFails(`mutation { createCareRecord(input: { date: "${daysAgo(0)}", careType: "Vitamines", scope: CAGE }) { id } }`),
    ).resolves.toContain('Choisis la cage');

    await run(`mutation ($id: ID!) { deleteCareRecord(id: $id) }`, { id: care.id });
    expect(await prisma.task.count({ where: { sourceId: care.id } })).toBe(0);
  });

  async function gqlOkFails(query: string) {
    try {
      await run(query);
      return 'aucune erreur';
    } catch (error) {
      return String(error);
    }
  }
});
