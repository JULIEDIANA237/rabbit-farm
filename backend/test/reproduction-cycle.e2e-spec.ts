import type { INestApplication } from '@nestjs/common';

import type { PrismaService } from '../src/prisma/prisma.service.js';
import { createTestApp, daysAgo, gql, gqlOk, registerFarm } from './utils/graphql.js';

/**
 * Scénarios fonctionnels du cahier des charges :
 *  1. Accouplement → gestation → naissance → portée → sevrage
 *  2. Naissance → cages → déplacement → engraissement → vente
 * plus le contrôle de consanguinité, l'isolation entre fermes,
 * la traçabilité et les statistiques.
 */
describe('Cycle complet d’élevage (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  const ids: Record<string, string> = {};
  let kitIds: string[] = [];

  const run = <T = any>(query: string, variables?: Record<string, unknown>) =>
    gqlOk<T>(app, query, variables, token);

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    token = await registerFarm(app, 'cycle');
  });

  afterAll(async () => {
    await app.close();
  });

  it('refuse les requêtes non authentifiées', async () => {
    const result = await gql(app, '{ dashboard { totalRabbits } }');
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('prépare la ferme : section, cages, reproducteurs', async () => {
    const section = await run(
      `mutation ($input: CreateSectionInput!) { createSection(input: $input) { id } }`,
      { input: { name: 'Maternité', type: 'MATERNITY' } },
    );
    ids.section = section.createSection.id;

    for (const [key, code, capacity] of [
      ['cageMaternity', 'C01', 1],
      ['cageFattening', 'C02', 10],
    ] as const) {
      const cage = await run(
        `mutation ($input: CreateCageInput!) { createCage(input: $input) { id } }`,
        { input: { code, sectionId: ids.section, capacity } },
      );
      ids[key] = cage.createCage.id;
    }

    const createRabbit = async (code: string, sex: string, extra = {}) => {
      const data = await run(
        `mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id code } }`,
        { input: { code, sex, purpose: 'BREEDER', birthDate: daysAgo(400), ...extra } },
      );
      return data.createRabbit.id as string;
    };

    ids.female = await createRabbit('F001', 'FEMALE');
    ids.male = await createRabbit('M001', 'MALE');
    // Fils de F001 : un accouplement mère × fils doit être bloqué.
    ids.son = await createRabbit('M002', 'MALE', {
      motherId: ids.female,
      fatherId: ids.male,
      birthDate: daysAgo(200),
    });

    await run(
      `mutation ($input: MoveRabbitInput!) { moveRabbit(input: $input) { id cageCode } }`,
      { input: { rabbitId: ids.female, cageId: ids.cageMaternity, reason: 'MATERNITY' } },
    );
  });

  it('bloque un accouplement mère × fils (consanguinité)', async () => {
    const compat = await run(
      `query ($f: ID!, $m: ID!) { breedingCompatibility(femaleId: $f, maleId: $m) { level reasons { code } } }`,
      { f: ids.female, m: ids.son },
    );
    expect(compat.breedingCompatibility.level).toBe('BLOCKED');
    expect(compat.breedingCompatibility.reasons.map((r: any) => r.code)).toContain('PARENT_CHILD');

    const result = await gql(
      app,
      `mutation ($input: CreateBreedingInput!) { createBreeding(input: $input) { id } }`,
      { input: { femaleId: ids.female, maleId: ids.son, breedingDate: daysAgo(70) } },
      token,
    );
    expect(result.errors?.[0]?.message).toBeDefined();
  });

  it('scénario 1 : accouplement → gestation → naissance → portée → sevrage', async () => {
    // Accouplement : calendrier + tâches automatiques
    const breeding = await run(
      `mutation ($input: CreateBreedingInput!) {
        createBreeding(input: $input) { id status palpationStartDate nestDate expectedBirthStartDate }
      }`,
      { input: { femaleId: ids.female, maleId: ids.male, breedingDate: daysAgo(70) } },
    );
    ids.breeding = breeding.createBreeding.id;
    expect(breeding.createBreeding.status).toBe('AWAITING_PALPATION');
    expect(breeding.createBreeding.expectedBirthStartDate).toBeTruthy();

    const tasks = await run(`{ tasks(openOnly: true) { automationKey sourceId } }`);
    const keys = tasks.tasks
      .filter((t: any) => t.sourceId === ids.breeding)
      .map((t: any) => t.automationKey)
      .sort();
    expect(keys).toEqual(['BREEDING_BIRTH', 'BREEDING_NEST', 'BREEDING_PALPATION'].sort());

    // Palpation positive
    await run(
      `mutation ($input: CreatePregnancyCheckInput!) { createPregnancyCheck(input: $input) { id result } }`,
      { input: { breedingId: ids.breeding, checkedDate: daysAgo(60), result: 'PREGNANT' } },
    );

    // Nid
    await run(
      `mutation ($input: RecordNestInstallationInput!) { recordNestInstallation(input: $input) { id } }`,
      { input: { breedingId: ids.breeding, installedAt: daysAgo(42) } },
    );

    // Naissance : 6 vivants, 1 mort-né → portée L001 et lapereaux L001-01…06
    const birth = await run(
      `mutation ($input: CreateBirthInput!) { createBirth(input: $input) { id litterId litterCode liveBorn } }`,
      { input: { breedingId: ids.breeding, birthDate: daysAgo(40), liveBorn: 6, stillBorn: 1 } },
    );
    ids.litter = birth.createBirth.litterId;
    expect(birth.createBirth.litterCode).toBe('L001');

    const detail = await run(
      `query ($id: ID!) { litterDetail(id: $id) { litter { code currentCount status mother { code } father { code } } kits { id code } } }`,
      { id: ids.litter },
    );
    kitIds = detail.litterDetail.kits.map((k: any) => k.id);
    expect(detail.litterDetail.kits.map((k: any) => k.code)).toEqual([
      'L001-01', 'L001-02', 'L001-03', 'L001-04', 'L001-05', 'L001-06',
    ]);
    expect(detail.litterDetail.litter.currentCount).toBe(6);
    expect(detail.litterDetail.litter.mother.code).toBe('F001');
    expect(detail.litterDetail.litter.father.code).toBe('M001');

    // Les tâches de reproduction sont closes, une tâche de sevrage est créée.
    const after = await run(`{ tasks(openOnly: true) { automationKey } }`);
    expect(after.tasks.map((t: any) => t.automationKey)).toEqual(['LITTER_WEANING']);

    // Un lapereau meurt avant le sevrage.
    await run(
      `mutation ($input: RecordRabbitExitInput!) { recordRabbitExit(input: $input) { id status } }`,
      { input: { rabbitId: kitIds[5], status: 'DEAD', date: daysAgo(30), cause: 'Écrasement' } },
    );

    const litter = await prisma.litter.findUniqueOrThrow({ where: { id: ids.litter } });
    expect(litter.currentCount).toBe(5);

    // Lot d'engraissement puis sevrage des 5 survivants dans ce lot.
    const lot = await run(
      `mutation ($input: CreateFatteningLotInput!) { createFatteningLot(input: $input) { id code } }`,
      { input: { code: 'LOT-01', entryDate: daysAgo(5) } },
    );
    ids.lot = lot.createFatteningLot.id;

    const weaning = await run(
      `mutation ($input: CreateWeaningInput!) { createWeaning(input: $input) { id quantity actualDate litterCode } }`,
      {
        input: {
          litterId: ids.litter,
          plannedDate: daysAgo(5),
          actualDate: daysAgo(5),
          quantity: 5,
          averageWeight: 0.85,
          rabbitIds: kitIds.slice(0, 5),
          fatteningLotId: ids.lot,
        },
      },
    );
    expect(weaning.createWeaning.litterCode).toBe('L001');

    const weaned = await prisma.litter.findUniqueOrThrow({ where: { id: ids.litter } });
    expect(weaned.status).toBe('WEANED');

    const open = await run(`{ tasks(openOnly: true) { automationKey } }`);
    expect(open.tasks).toHaveLength(0);
  });

  it('scénario 2 : cages → déplacement → engraissement → vente', async () => {
    // Le lot est installé dans la cage d'engraissement avec ses membres.
    await run(
      `mutation ($input: MoveFatteningLotInput!) { moveFatteningLot(input: $input) { id } }`,
      { input: { lotId: ids.lot, cageId: ids.cageFattening, reason: 'FATTENING' } },
    );

    const lots = await run(`{ fatteningLots { id activeMemberCount currentCageId } }`);
    const lot = lots.fatteningLots.find((l: any) => l.id === ids.lot);
    expect(lot.activeMemberCount).toBe(5);
    expect(lot.currentCageId).toBe(ids.cageFattening);

    await run(
      `mutation ($input: CreateWeighingInput!) { createWeighing(input: $input) { id } }`,
      { input: { lotId: ids.lot, date: daysAgo(1), totalWeight: 11, animalCount: 5, ageInDays: 39 } },
    );

    await run(
      `mutation ($input: CreateExpenseInput!) { createExpense(input: $input) { id } }`,
      { input: { category: 'FEED', amount: 5500, date: daysAgo(3), description: 'Granulés' } },
    );

    // Vente du lot au poids : 11 kg × 2500 = 27 500.
    const sale = await run(
      `mutation ($input: CreateSaleInput!) { createSale(input: $input) { id status totalAmount remainingAmount } }`,
      {
        input: {
          saleDate: daysAgo(0),
          items: [{ lotId: ids.lot, weightKg: 11, pricePerKg: 2500 }],
        },
      },
    );
    ids.sale = sale.createSale.id;
    expect(sale.createSale.totalAmount).toBe(27500);
    expect(sale.createSale.status).toBe('UNPAID');

    const payment = await run(
      `mutation ($input: CreatePaymentInput!) { addPayment(input: $input) { id amount } }`,
      { input: { saleId: ids.sale, amount: 10000, paymentDate: daysAgo(0), method: 'MOBILE_MONEY' } },
    );
    expect(payment.addPayment.amount).toBe(10000);

    const updated = await run(
      `query ($id: ID!) { sale(id: $id) { status paidAmount remainingAmount } }`,
      { id: ids.sale },
    );
    expect(updated.sale).toEqual({ status: 'PARTIALLY_PAID', paidAmount: 10000, remainingAmount: 17500 });

    const sold = await prisma.rabbit.count({ where: { id: { in: kitIds.slice(0, 5) }, status: 'SOLD' } });
    expect(sold).toBe(5);
  });

  it('retrace l’historique complet d’un lapereau', async () => {
    const trace = await run(
      `query ($id: ID!) { rabbitTraceability(rabbitId: $id) { birthLitterCode mother { code } events { type } } }`,
      { id: kitIds[0] },
    );
    const types = trace.rabbitTraceability.events.map((e: any) => e.type);
    expect(trace.rabbitTraceability.birthLitterCode).toBe('L001');
    expect(trace.rabbitTraceability.mother.code).toBe('F001');
    for (const type of ['BIRTH', 'WEANING', 'LOT', 'CAGE', 'SALE']) {
      expect(types).toContain(type);
    }
    expect(types[0]).toBe('BIRTH');
  });

  it('calcule les statistiques et le tableau de bord', async () => {
    const stats = await run(`{
      farmStatistics {
        technical { births liveBorn stillBorn preWeaningDeaths weaned weaningRate fertilityRate }
        finance { revenue collected outstanding expenses margin kgSold estimatedCostPerKg }
        genetic { bestMothers { rabbitCode weaned } blockedPairs }
      }
    }`);
    const { technical, finance, genetic } = stats.farmStatistics;

    expect(technical).toMatchObject({
      births: 1,
      liveBorn: 6,
      stillBorn: 1,
      preWeaningDeaths: 1,
      weaned: 5,
      fertilityRate: 100,
    });
    expect(technical.weaningRate).toBeCloseTo(83.3, 1);
    expect(finance).toMatchObject({
      revenue: 27500,
      collected: 10000,
      outstanding: 17500,
      expenses: 5500,
      margin: 22000,
      kgSold: 11,
      estimatedCostPerKg: 500,
    });
    expect(genetic.bestMothers[0]).toEqual({ rabbitCode: 'F001', weaned: 5 });
    expect(genetic.blockedPairs).toBeGreaterThanOrEqual(1);

    const dashboard = await run(`{ dashboard { activeRabbits totalCages occupiedCages monthlyRevenue } }`);
    expect(dashboard.dashboard.activeRabbits).toBe(3);
    expect(dashboard.dashboard.totalCages).toBe(2);
    expect(dashboard.dashboard.monthlyRevenue).toBe(27500);
  });

  it('isole les données entre deux fermes', async () => {
    const other = await registerFarm(app, 'autre');
    const result = await gql(
      app,
      `query ($id: ID!) { rabbitTraceability(rabbitId: $id) { rabbit { id } } }`,
      { id: kitIds[0] },
      other,
    );
    expect(result.errors?.[0]?.message).toMatch(/introuvable/i);
  });
});
