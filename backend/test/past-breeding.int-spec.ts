import type { INestApplication } from '@nestjs/common';

import { createTestApp, daysAgo, gql, gqlOk, registerFarm } from './utils/graphql.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

/** Saillie ancienne saisie alors qu'une autre est en cours : tout est enregistré jusqu'au lot. */
describe('Saillie antérieure (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let female: string;
  let male: string;
  let cage: string;

  const run = <T = any>(query: string, variables?: Record<string, unknown>) => gqlOk<T>(app, query, variables, token);
  const RECORD = `mutation ($input: RecordPastBreedingInput!) { recordPastBreeding(input: $input) { id status birthId } }`;
  const rabbit = async (code: string, sex: string) =>
    (
      await run(`mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id } }`, {
        input: { code, sex, purpose: 'BREEDER', birthDate: daysAgo(400) },
      })
    ).createRabbit.id as string;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    token = await registerFarm(app, 'saillie-ancienne');
    female = await rabbit('F-ANC', 'FEMALE');
    male = await rabbit('M-ANC', 'MALE');
    const { createSection } = await run(`mutation ($input: CreateSectionInput!) { createSection(input: $input) { id } }`, {
      input: { name: 'Engraissement', type: 'FATTENING' },
    });
    ({ createCage: { id: cage } } = await run(`mutation ($input: CreateCageInput!) { createCage(input: $input) { id } }`, {
      input: { sectionId: createSection.id, code: 'E-01', capacity: 10 },
    }));
    // Saillie en cours, faite il y a 5 jours.
    await run(`mutation ($input: CreateBreedingInput!) { createBreeding(input: $input) { id } }`, {
      input: { femaleId: female, maleId: male, breedingDate: daysAgo(5) },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('refuse une saillie de moins de 65 jours', async () => {
    const res = await gql(app, RECORD, { input: { femaleId: female, maleId: male, breedingDate: daysAgo(50), liveBorn: 6, weanedCount: 5 } }, token);
    expect(res.errors?.[0]?.message).toContain('65 jours');
  });

  it('enregistre mise bas, sevrage, morts, lot et cage', async () => {
    const { recordPastBreeding } = await run(RECORD, {
      input: { femaleId: female, maleId: male, breedingDate: daysAgo(80), liveBorn: 7, stillBorn: 1, weanedCount: 5, cageId: cage, averageWeight: 0.8 },
    });
    expect(recordPastBreeding.status).toBe('BIRTH_RECORDED');

    const birth = await prisma.birth.findUniqueOrThrow({ where: { id: recordPastBreeding.birthId }, include: { litter: true } });
    expect(birth).toMatchObject({ liveBorn: 7, stillBorn: 1 });
    expect(birth.litter).toMatchObject({ currentCount: 0, status: 'WEANED' });

    const kits = await prisma.rabbit.findMany({ where: { birthLitterId: birth.litter!.id } });
    expect(kits.filter((k) => k.status === 'DEAD')).toHaveLength(2);
    const alive = kits.filter((k) => k.status === 'ACTIVE').map((k) => k.id);
    expect(alive).toHaveLength(5);

    const memberships = await prisma.lotMembership.findMany({ where: { rabbitId: { in: alive }, leftAt: null }, include: { lot: true } });
    expect(memberships).toHaveLength(5);
    const lotId = memberships[0].lotId;
    expect(await prisma.lotCageMovement.findFirst({ where: { lotId, cageId: cage, endedAt: null } })).toBeTruthy();
    expect(await prisma.rabbitCageMovement.count({ where: { rabbitId: { in: alive }, cageId: cage, endedAt: null } })).toBe(5);

    // Rien d'ancien ne reste à faire, et la saillie en cours n'a pas bougé.
    const open = await prisma.task.count({
      where: { sourceId: { in: [recordPastBreeding.id, birth.id] }, status: { in: ['TODO', 'IN_PROGRESS'] } },
    });
    expect(open).toBe(0);
    const active = await prisma.breeding.findMany({ where: { femaleId: female, status: 'AWAITING_PALPATION' } });
    expect(active).toHaveLength(1);
  });

  it('refuse une saillie qui tombe pendant une autre gestation', async () => {
    // La portée précédente : saillie il y a 80 jours, mise bas il y a 49 jours.
    const res = await gql(app, RECORD, { input: { femaleId: female, maleId: male, breedingDate: daysAgo(70), liveBorn: 6, weanedCount: 5 } }, token);
    expect(res.errors?.[0]?.message).toContain('pendant cette gestation');
    const again = await gql(app, RECORD, { input: { femaleId: female, maleId: male, breedingDate: daysAgo(80), liveBorn: 6, weanedCount: 5 } }, token);
    expect(again.errors?.[0]?.message).toContain('déjà enregistrée');
  });

  it('refuse une mise bas hors de la gestation', async () => {
    const res = await gql(app, RECORD, {
      input: { femaleId: female, maleId: male, breedingDate: daysAgo(200), birthDate: daysAgo(100), liveBorn: 6, weanedCount: 5 },
    }, token);
    expect(res.errors?.[0]?.message).toContain('entre 25 et 40 jours');
  });

  it('cage trop petite : rien n’est enregistré', async () => {
    const before = await prisma.breeding.count({ where: { femaleId: female } });
    const res = await gql(app, RECORD, {
      input: { femaleId: female, maleId: male, breedingDate: daysAgo(150), liveBorn: 12, weanedCount: 11, cageId: cage },
    }, token);
    expect(res.errors?.[0]?.message).toContain('ne peut pas recevoir');
    expect(await prisma.breeding.count({ where: { femaleId: female } })).toBe(before);
  });
});
