import type { INestApplication } from '@nestjs/common';

import { createTestApp, daysAgo, gql, gqlOk, registerFarm } from './utils/graphql';
import type { PrismaService } from '../src/prisma/prisma.service';

/**
 * Tests d'intégration des règles métier sur une vraie base PostgreSQL.
 */
describe('Règles métier (intégration)', () => {
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

  const breed = (femaleId: string, maleId: string, acknowledgeWarnings = false) =>
    gql(
      app,
      `mutation ($input: CreateBreedingInput!) { createBreeding(input: $input) { id status } }`,
      { input: { femaleId, maleId, breedingDate: daysAgo(1), acknowledgeWarnings } },
      token,
    );

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    token = await registerFarm(app, 'regles');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('consanguinité', () => {
    let sister: string;
    let halfBrother: string;

    beforeAll(async () => {
      const mother = await rabbit('MERE', 'FEMALE');
      const father = await rabbit('PERE', 'MALE');
      const otherMother = await rabbit('MERE2', 'FEMALE');
      sister = await rabbit('SOEUR', 'FEMALE', {
        motherId: mother, fatherId: father, birthDate: daysAgo(200),
      });
      halfBrother = await rabbit('DEMI', 'MALE', {
        motherId: otherMother, fatherId: father, birthDate: daysAgo(200),
      });
    });

    it('politique WARN : demi-frère/sœur demande une confirmation', async () => {
      const refused = await breed(sister, halfBrother);
      expect(refused.errors?.[0]?.message).toMatch(/confirm|avertissement|risque/i);

      const accepted = await breed(sister, halfBrother, true);
      expect(accepted.errors).toBeUndefined();
      await prisma.breeding.deleteMany({});
      await prisma.task.deleteMany({});
    });

    it('politique BLOCK : le même croisement est interdit', async () => {
      await run(
        `mutation ($input: UpdateFarmInput!) { updateFarm(input: $input) { inbreedingPolicy } }`,
        { input: { inbreedingPolicy: 'BLOCK' } },
      );

      const blocked = await breed(sister, halfBrother, true);
      expect(blocked.errors?.[0]?.message).toBeDefined();
      expect(await prisma.breeding.count()).toBe(0);
    });

    it('refuse un cycle généalogique (un lapin parent de son ancêtre)', async () => {
      const father = await prisma.rabbit.findFirstOrThrow({ where: { code: 'PERE' } });
      const mother = await prisma.rabbit.findFirstOrThrow({ where: { code: 'MERE2' } });
      const result = await gql(
        app,
        `mutation ($input: UpdateRabbitInput!) { updateRabbit(input: $input) { id } }`,
        { input: { id: father.id, fatherId: halfBrother, motherId: mother.id } },
        token,
      );
      expect(result.errors?.[0]?.message).toBeDefined();
    });
  });

  describe('ventes', () => {
    it('annuler une vente remet le lapin actif et efface le reste à payer', async () => {
      const id = await rabbit('VENTE-1', 'MALE', { purpose: 'FATTENING' });
      const sale = await run(
        `mutation ($input: CreateSaleInput!) { createSale(input: $input) { id status totalAmount } }`,
        { input: { saleDate: daysAgo(0), items: [{ rabbitId: id, unitPrice: 8000 }] } },
      );
      expect(sale.createSale.totalAmount).toBe(8000);
      expect((await prisma.rabbit.findUniqueOrThrow({ where: { id } })).status).toBe('SOLD');

      const cancelled = await run(
        `mutation ($input: CancelSaleInput!) { cancelSale(input: $input) { status remainingAmount } }`,
        { input: { id: sale.createSale.id, reason: 'Client absent' } },
      );
      expect(cancelled.cancelSale.status).toBe('CANCELLED');
      expect(cancelled.cancelSale.remainingAmount).toBe(0);
      expect((await prisma.rabbit.findUniqueOrThrow({ where: { id } })).status).toBe('ACTIVE');
    });

    it('refuse un paiement supérieur au reste à payer', async () => {
      const id = await rabbit('VENTE-2', 'MALE', { purpose: 'FATTENING' });
      const sale = await run(
        `mutation ($input: CreateSaleInput!) { createSale(input: $input) { id } }`,
        { input: { saleDate: daysAgo(0), items: [{ rabbitId: id, unitPrice: 5000 }] } },
      );
      const result = await gql(
        app,
        `mutation ($input: CreatePaymentInput!) { addPayment(input: $input) { id } }`,
        { input: { saleId: sale.createSale.id, amount: 6000, paymentDate: daysAgo(0), method: 'CASH' } },
        token,
      );
      expect(result.errors?.[0]?.message).toBeDefined();
    });
  });

  describe('stock', () => {
    it('crée puis clôt automatiquement la tâche de réapprovisionnement', async () => {
      const item = await run(
        `mutation ($input: CreateInventoryItemInput!) { createInventoryItem(input: $input) { id } }`,
        { input: { name: 'Granulés', type: 'FEED', unit: 'kg', minimumStock: 20 } },
      );
      const inventoryItemId = item.createInventoryItem.id;
      const move = (type: string, quantity: number) =>
        run(
          `mutation ($input: CreateStockMovementInput!) { createStockMovement(input: $input) { id } }`,
          { input: { inventoryItemId, type, quantity, date: daysAgo(0) } },
        );

      await move('PURCHASE', 50);
      await move('CONSUMPTION', 35);

      const reorder = () =>
        prisma.task.findFirst({ where: { sourceId: inventoryItemId, automationKey: 'STOCK_REORDER' } });

      expect((await reorder())?.status).toBe('TODO');

      const items = await run(`{ inventoryItems { id currentStock isBelowMinimum autonomyDays } }`);
      const granules = items.inventoryItems.find((i: any) => i.id === inventoryItemId);
      expect(granules).toMatchObject({ currentStock: 15, isBelowMinimum: true });
      expect(granules.autonomyDays).toBeGreaterThan(0);

      await move('PURCHASE', 30);
      expect((await reorder())?.status).toBe('COMPLETED');
    });

    it('refuse une consommation supérieure au stock', async () => {
      const item = await run(
        `mutation ($input: CreateInventoryItemInput!) { createInventoryItem(input: $input) { id } }`,
        { input: { name: 'Vaccin', type: 'MEDICATION', unit: 'dose' } },
      );
      const result = await gql(
        app,
        `mutation ($input: CreateStockMovementInput!) { createStockMovement(input: $input) { id } }`,
        { input: { inventoryItemId: item.createInventoryItem.id, type: 'CONSUMPTION', quantity: 3, date: daysAgo(0) } },
        token,
      );
      expect(result.errors?.[0]?.message).toBeDefined();
    });
  });
});
