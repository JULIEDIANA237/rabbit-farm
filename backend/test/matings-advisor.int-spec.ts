import type { INestApplication } from '@nestjs/common';

import { createTestApp, daysAgo, gql, gqlOk, registerFarm } from './utils/graphql.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

/**
 * Saillies (limite du mâle, plusieurs saillies le même jour),
 * assistant du tableau de bord et note de l'app.
 */
describe('Saillies, assistant et note (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  const run = <T = any>(query: string, variables?: Record<string, unknown>) =>
    gqlOk<T>(app, query, variables, token);

  const rabbit = async (code: string, sex: string) =>
    (
      await run(
        `mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id } }`,
        { input: { code, sex, purpose: 'BREEDER', birthDate: daysAgo(400), previousLitters: 0, previousMatings: 0 } },
      )
    ).createRabbit.id as string;

  const mate = (femaleId: string, maleId: string, breedingDate: string) =>
    gql(
      app,
      `mutation ($input: CreateBreedingInput!) { createBreeding(input: $input) { id matingCount matings { date male { code } } } }`,
      { input: { femaleId, maleId, breedingDate, acknowledgeWarnings: true } },
      token,
    );

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    token = await registerFarm(app, 'matings');
  });

  afterAll(async () => {
    await app.close();
  });

  it('un mâle ne couvre pas plus de 2 femelles en 24 h', async () => {
    const male = await rabbit('M-LIM', 'MALE');
    const [f1, f2, f3] = [await rabbit('F-LIM1', 'FEMALE'), await rabbit('F-LIM2', 'FEMALE'), await rabbit('F-LIM3', 'FEMALE')];
    const day = daysAgo(2);
    expect((await mate(f1, male, day)).errors).toBeUndefined();
    expect((await mate(f2, male, day)).errors).toBeUndefined();

    const { matingContext } = await run(
      `query ($f: ID, $m: ID, $d: DateTime!) { matingContext(femaleId: $f, maleId: $m, date: $d) { maleFemalesLast24h maleLimitReached } }`,
      { f: f3, m: male, d: day },
    );
    expect(matingContext).toEqual({ maleFemalesLast24h: expect.arrayContaining(['F-LIM1', 'F-LIM2']), maleLimitReached: true });

    const third = await mate(f3, male, day);
    expect(third.errors?.[0]?.message).toContain('ne doit pas couvrir plus de 2 femelles');

    // Le lendemain (24 h plus tard), il peut de nouveau saillir.
    expect((await mate(f3, male, daysAgo(1))).errors).toBeUndefined();
  });

  it('une deuxième saillie le même jour s’ajoute au même accouplement', async () => {
    const [m1, m2] = [await rabbit('M-DUO1', 'MALE'), await rabbit('M-DUO2', 'MALE')];
    const female = await rabbit('F-DUO', 'FEMALE');
    const day = daysAgo(3);
    const first = await mate(female, m1, day);
    const second = await mate(female, m2, day);
    expect(second.errors).toBeUndefined();
    expect(second.data!.createBreeding.id).toBe(first.data!.createBreeding.id);
    expect(second.data!.createBreeding.matingCount).toBe(2);
    expect(second.data!.createBreeding.matings[0].male.code).toBe('M-DUO2');
    expect(await prisma.breeding.count({ where: { femaleId: female } })).toBe(1);

    // Un autre jour, l'accouplement en cours bloque toujours.
    const later = await mate(female, m1, daysAgo(1));
    expect(later.errors?.[0]?.message).toContain('accouplement actif');
  });

  it('l’assistant propose des saillies et le passé des reproducteurs', async () => {
    const female = await rabbit('F-LIBRE', 'FEMALE');
    await prisma.rabbit.update({ where: { id: female }, data: { previousLitters: null } });
    const { farmSuggestions } = await run(`{ farmSuggestions { key kind title href } }`);
    const keys = farmSuggestions.map((s: { key: string }) => s.key);
    expect(keys).toContain(`MATE_${female}`);
    expect(keys).toContain('BREEDER_PAST');
    const mateSuggestion = farmSuggestions.find((s: { key: string }) => s.key === `MATE_${female}`);
    expect(mateSuggestion.kind).toBe('TODO');
    expect(mateSuggestion.href).toContain('/breeding?new=1&prefill=');
  });

  it('note de l’app et chiffres réservés à la propriétaire', async () => {
    const { rateApp } = await run(`mutation { rateApp(stars: 4, comment: "Très pratique") { stars comment } }`);
    expect(rateApp).toEqual({ stars: 4, comment: 'Très pratique' });
    await run(`mutation { rateApp(stars: 5) { stars } }`);
    expect(await prisma.appRating.count()).toBeGreaterThanOrEqual(1);

    const refused = await gql(app, `{ platformStats { users } }`, undefined, token);
    expect(refused.errors?.[0]?.message).toContain('Réservé');

    const { me } = await run(`{ me { email } }`);
    process.env.PLATFORM_ADMIN_EMAILS = `autre@x.cm, ${me.email.toUpperCase()}`;
    const { platformStats, isPlatformAdmin } = await run(
      `{ isPlatformAdmin platformStats { farms users activeUsers7d ratingsCount averageRating ratingDistribution } }`,
    );
    delete process.env.PLATFORM_ADMIN_EMAILS;
    expect(isPlatformAdmin).toBe(true);
    expect(platformStats.users).toBeGreaterThanOrEqual(1);
    expect(platformStats.activeUsers7d).toBeGreaterThanOrEqual(1);
    expect(platformStats.ratingDistribution[4]).toBeGreaterThanOrEqual(1);
  });
});
