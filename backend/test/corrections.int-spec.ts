import type { INestApplication } from '@nestjs/common';

import { createTestApp, daysAgo, gql, gqlOk, registerFarm } from './utils/graphql.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

/**
 * Corrections (modifier / supprimer) et rations journalières,
 * sur une vraie base PostgreSQL.
 */
describe('Corrections et rations (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  const run = <T = any>(query: string, variables?: Record<string, unknown>) =>
    gqlOk<T>(app, query, variables, token);

  const rabbit = async (code: string, sex: string, extra: Record<string, unknown> = {}) =>
    (
      await run(
        `mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id } }`,
        { input: { code, sex, purpose: 'BREEDER', birthDate: daysAgo(400), ...extra } },
      )
    ).createRabbit.id as string;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    token = await registerFarm(app, 'corrections');
  });

  afterAll(async () => {
    await app.close();
  });

  it('supprimer un mouvement de stock rétablit le stock', async () => {
    const { createInventoryItem: item } = await run(
      `mutation ($input: CreateInventoryItemInput!) { createInventoryItem(input: $input) { id currentStock } }`,
      { input: { name: 'Granulés', type: 'FEED', unit: 'kg', unitPrice: 300, initialStock: 100, initialStockDate: daysAgo(5) } },
    );
    expect(item.currentStock).toBe(100);

    const { createStockMovement: movement } = await run(
      `mutation ($input: CreateStockMovementInput!) { createStockMovement(input: $input) { id } }`,
      { input: { inventoryItemId: item.id, type: 'CONSUMPTION', quantity: 30, date: daysAgo(1) } },
    );
    await run(`mutation ($id: ID!) { deleteStockMovement(id: $id) }`, { id: movement.id });

    const { inventoryItem } = await run(
      `query ($id: ID!) { inventoryItem(id: $id) { currentStock stockValue } }`,
      { id: item.id },
    );
    expect(inventoryItem).toEqual({ currentStock: 100, stockValue: 30000 });
  });

  it('rations : besoin par catégorie puis déduction des jours écoulés', async () => {
    const female = await rabbit('F-RATION', 'FEMALE');
    const male = await rabbit('M-RATION', 'MALE');
    const { createBreeding } = await run(
      `mutation ($input: CreateBreedingInput!) { createBreeding(input: $input) { id } }`,
      { input: { femaleId: female, maleId: male, breedingDate: daysAgo(15) } },
    );
    await run(
      `mutation ($input: CreatePregnancyCheckInput!) { createPregnancyCheck(input: $input) { id } }`,
      { input: { breedingId: createBreeding.id, checkedDate: daysAgo(3), result: 'PREGNANT' } },
    );

    const item = await prisma.inventoryItem.findFirstOrThrow({ where: { name: 'Granulés' } });
    const { setFeedRations } = await run(
      `mutation ($input: SetFeedRationsInput!) { setFeedRations(input: $input) { dailyNeed pendingDays } }`,
      {
        input: {
          inventoryItemId: item.id,
          startDate: daysAgo(4),
          rations: [
            { category: 'PREGNANT', dailyQuantity: 0.25 },
            { category: 'MAINTENANCE', dailyQuantity: 0.15 },
          ],
        },
      },
    );
    // 1 gestante × 0,25 + 1 mâle (entretien) × 0,15
    expect(setFeedRations.dailyNeed).toBeCloseTo(0.4);
    expect(setFeedRations.pendingDays).toBe(4);

    await run(`mutation ($id: ID!) { applyFeedRations(inventoryItemId: $id) { quantity } }`, { id: item.id });
    const after = await prisma.inventoryItem.findUniqueOrThrow({ where: { id: item.id } });
    expect(after.currentStock).toBeCloseTo(98.4);

    const again = await gql(app, `mutation ($id: ID!) { applyFeedRations(inventoryItemId: $id) { quantity } }`, { id: item.id }, token);
    expect(again.errors?.[0]?.message).toMatch(/aucune ration/i);
  });

  it('supprimer un accouplement efface ses palpations et ses tâches', async () => {
    const breeding = await prisma.breeding.findFirstOrThrow({});
    await run(`mutation ($id: ID!) { deleteBreeding(id: $id) }`, { id: breeding.id });
    expect(await prisma.pregnancy.count({ where: { breedingId: breeding.id } })).toBe(0);
    expect(await prisma.task.count({ where: { sourceId: breeding.id } })).toBe(0);
  });

  it('supprimer une vente remet le lapin en activité', async () => {
    const sold = await rabbit('VENDU', 'MALE', { purpose: 'FATTENING' });
    const { createSale } = await run(
      `mutation ($input: CreateSaleInput!) { createSale(input: $input) { id } }`,
      { input: { saleDate: daysAgo(2), items: [{ rabbitId: sold, unitPrice: 5000 }] } },
    );
    await run(
      `mutation ($input: CreatePaymentInput!) { addPayment(input: $input) { id } }`,
      { input: { saleId: createSale.id, amount: 2000, paymentDate: daysAgo(1), method: 'CASH' } },
    );
    expect((await prisma.rabbit.findUniqueOrThrow({ where: { id: sold } })).status).toBe('SOLD');

    await run(`mutation ($id: ID!) { deleteSale(id: $id) }`, { id: createSale.id });
    const restored = await prisma.rabbit.findUniqueOrThrow({ where: { id: sold } });
    expect(restored.status).toBe('ACTIVE');
    expect(restored.exitDate).toBeNull();
    expect(await prisma.payment.count({ where: { saleId: createSale.id } })).toBe(0);
  });

  it('un lapin avec historique ne peut pas être supprimé, un lapin créé par erreur oui', async () => {
    const withHistory = await prisma.rabbit.findFirstOrThrow({ where: { code: 'F-RATION' } });
    await run(
      `mutation ($input: CreateHealthRecordInput!) { createHealthRecord(input: $input) { id } }`,
      { input: { rabbitId: withHistory.id, date: daysAgo(1), symptoms: 'Toux' } },
    );
    const refused = await gql(app, `mutation ($id: ID!) { deleteRabbit(id: $id) }`, { id: withHistory.id }, token);
    expect(refused.errors?.[0]?.message).toMatch(/sortie/);

    const mistake = await rabbit('ERREUR', 'MALE');
    await run(`mutation ($id: ID!) { deleteRabbit(id: $id) }`, { id: mistake });
    expect(await prisma.rabbit.count({ where: { id: mistake } })).toBe(0);
  });

  it('annuler un décès saisi par erreur', async () => {
    const dead = await rabbit('MORT', 'MALE');
    await run(
      `mutation ($input: RecordRabbitExitInput!) { recordRabbitExit(input: $input) { id } }`,
      { input: { rabbitId: dead, status: 'DEAD', date: daysAgo(1), cause: 'Erreur' } },
    );
    await run(`mutation ($id: ID!) { cancelRabbitExit(rabbitId: $id) { status } }`, { id: dead });
    expect((await prisma.rabbit.findUniqueOrThrow({ where: { id: dead } })).status).toBe('ACTIVE');
    expect(await prisma.mortalityRecord.count({ where: { rabbitId: dead } })).toBe(0);
  });

  it('lapins et lapereaux sont paginés séparément', async () => {
    const page = (category: string) =>
      run(
        `query ($input: RabbitsPaginationInput) { rabbitsPaginated(input: $input) { total items { code } } }`,
        { input: { category, pageSize: 50 } },
      );
    const kits = await page('KIT');
    const adults = await page('ADULT');
    expect(kits.rabbitsPaginated.total).toBe(0);
    expect(adults.rabbitsPaginated.items.map((r: { code: string }) => r.code)).toContain('F-RATION');
  });
  it('cages : modifier, supprimer une cage vide, refuser une cage avec historique', async () => {
    const { createSection } = await run(
      `mutation ($input: CreateSectionInput!) { createSection(input: $input) { id } }`,
      { input: { name: 'Bâtiment test', type: 'MATERNITY' } },
    );
    const cage = async (code: string) =>
      (
        await run(`mutation ($input: CreateCageInput!) { createCage(input: $input) { id } }`, {
          input: { sectionId: createSection.id, code, capacity: 2 },
        })
      ).createCage.id as string;

    const empty = await cage('C-VIDE');
    const { updateCage } = await run(
      `mutation ($input: UpdateCageInput!) { updateCage(input: $input) { code capacity type } }`,
      { input: { id: empty, code: 'C-RENOMMEE', capacity: 4, type: 'Grillage' } },
    );
    expect(updateCage).toEqual({ code: 'C-RENOMMEE', capacity: 4, type: 'Grillage' });
    await run(`mutation ($id: ID!) { deleteCage(id: $id) { id } }`, { id: empty });

    const used = await cage('C-HISTO');
    const first = await cage('C-SUIVANTE');
    const r = await rabbit('R-CAGE', 'FEMALE');
    const move = `mutation ($input: MoveRabbitInput!) { moveRabbit(input: $input) { id } }`;
    await run(move, { input: { rabbitId: r, cageId: used, movedAt: daysAgo(10) } });

    const occupied = await gql(app, `mutation ($id: ID!) { deleteCage(id: $id) { id } }`, { id: used }, token);
    expect(occupied.errors?.[0]?.message).toMatch(/contenant encore des lapins/);

    await run(move, { input: { rabbitId: r, cageId: first, movedAt: daysAgo(2) } });
    const history = await gql(app, `mutation ($id: ID!) { deleteCage(id: $id) { id } }`, { id: used }, token);
    expect(history.errors?.[0]?.message).toMatch(/historique/);
    expect(await prisma.rabbitCageMovement.count({ where: { cageId: used } })).toBe(1);
  });
  it('sevrage : crée le lot d’engraissement, y place les lapereaux et enregistre la pesée', async () => {
    const female = await rabbit('F-SEVRAGE', 'FEMALE');
    const male = await rabbit('M-SEVRAGE', 'MALE');
    const { createBreeding } = await run(
      `mutation ($input: CreateBreedingInput!) { createBreeding(input: $input) { id } }`,
      { input: { femaleId: female, maleId: male, breedingDate: daysAgo(70) } },
    );
    await run(
      `mutation ($input: CreatePregnancyCheckInput!) { createPregnancyCheck(input: $input) { id } }`,
      { input: { breedingId: createBreeding.id, checkedDate: daysAgo(58), result: 'PREGNANT' } },
    );
    const { createBirth } = await run(
      `mutation ($input: CreateBirthInput!) { createBirth(input: $input) { litterId litterCode } }`,
      { input: { breedingId: createBreeding.id, birthDate: daysAgo(38), liveBorn: 6, stillBorn: 0 } },
    );

    // Aucun lapereau choisi à la main, seul le poids moyen est saisi.
    const { createWeaning } = await run(
      `mutation ($input: CreateWeaningInput!) { createWeaning(input: $input) { id totalWeight averageWeight fatteningLotCode } }`,
      {
        input: {
          litterId: createBirth.litterId,
          plannedDate: daysAgo(3),
          actualDate: daysAgo(3),
          quantity: 5,
          averageWeight: 0.8,
          createFatteningLot: true,
        },
      },
    );
    expect(createWeaning).toMatchObject({ totalWeight: 4, averageWeight: 0.8, fatteningLotCode: `LOT-${createBirth.litterCode}` });

    const { fatteningLots } = await run(`query { fatteningLots { code activeMemberCount latestAverageWeight } }`);
    const lot = fatteningLots.find((l: { code: string }) => l.code === `LOT-${createBirth.litterCode}`);
    expect(lot).toEqual({ code: `LOT-${createBirth.litterCode}`, activeMemberCount: 5, latestAverageWeight: 0.8 });

    // Le 6e lapereau, non sevré, reste avec la mère (hors du lot).
    const inLot = await prisma.lotMembership.count({ where: { leftAt: null, rabbit: { birthLitterId: createBirth.litterId } } });
    expect(inLot).toBe(5);

    // Fiche de suivi : de la saillie au lot.
    const lotId = (await prisma.fatteningLot.findFirstOrThrow({ where: { code: `LOT-${createBirth.litterCode}` } })).id;
    const { lotTrackingSheet: sheet } = await run(
      `query ($id: ID!) { lotTrackingSheet(lotId: $id) {
        lotCode enteredCount activeCount
        litters { code motherCode fatherCode gestationDays liveBorn weaned weaningAgeDays weaningAverageWeight events { label } }
        weighings { animalCount averageWeight }
      } }`,
      { id: lotId },
    );
    expect(sheet).toMatchObject({
      lotCode: `LOT-${createBirth.litterCode}`,
      enteredCount: 5,
      activeCount: 5,
      weighings: [{ animalCount: 5, averageWeight: 0.8 }],
    });
    expect(sheet.litters[0]).toMatchObject({
      motherCode: 'F-SEVRAGE',
      fatherCode: 'M-SEVRAGE',
      gestationDays: 32,
      liveBorn: 6,
      weaned: 5,
      weaningAgeDays: 35,
      weaningAverageWeight: 0.8,
    });
    expect(sheet.litters[0].events.map((e: { label: string }) => e.label)).toEqual([
      'Saillie de F-SEVRAGE par M-SEVRAGE',
      'Palpation positive',
      'Mise bas : 6 vivant(s)',
      'Sevrage de 5 lapereau(x), 800 g en moyenne',
    ]);
  });
});
