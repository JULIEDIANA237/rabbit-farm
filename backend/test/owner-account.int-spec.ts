import type { INestApplication } from '@nestjs/common';

import { createTestApp, gql, gqlOk, registerFarm } from './utils/graphql.js';
import type { PrismaService } from '../src/prisma/prisma.service.js';

const LOGIN = `mutation ($input: LoginInput!) { login(input: $input) { accessToken farm { id } } }`;

/** La propriétaire de l'app se connecte sans ferme ; sa ferme d'origine devient gratuite à vie. */
describe('Compte propriétaire sans ferme (intégration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    ({ app, prisma } = await createTestApp());
    await registerFarm(app, 'proprio-sans-ferme');
    await registerFarm(app, 'eleveur-normal');
    process.env.PLATFORM_ADMIN_EMAILS = 'eleveur-proprio-sans-ferme@example.com';
  });

  afterAll(async () => {
    delete process.env.PLATFORM_ADMIN_EMAILS;
    await app.close();
  });

  it('ouvre une session sans ferme qui donne accès à l’espace propriétaire', async () => {
    const { login } = await gqlOk(app, LOGIN, { input: { email: 'eleveur-proprio-sans-ferme@example.com', password: 'motdepasse123' } });
    expect(login.farm).toBeNull();

    const farm = await prisma.farm.findFirstOrThrow({ where: { name: 'Ferme proprio-sans-ferme' } });
    expect(farm.freeAccess).toBe(true);

    const { isPlatformAdmin } = await gqlOk(app, `{ isPlatformAdmin }`, undefined, login.accessToken);
    expect(isPlatformAdmin).toBe(true);
    const overview = await gql(app, `{ agentOverview { aiEnabled } }`, undefined, login.accessToken);
    expect(overview.errors).toBeUndefined();

    // Aucune donnée d'élevage n'est visible depuis cette session.
    const rabbits = await gql(app, `{ rabbits { id } }`, undefined, login.accessToken);
    expect(rabbits.data?.rabbits ?? []).toEqual([]);
  });

  it('un éleveur garde une session liée à sa ferme', async () => {
    const { login } = await gqlOk(app, LOGIN, { input: { email: 'eleveur-eleveur-normal@example.com', password: 'motdepasse123' } });
    expect(login.farm?.id).toEqual(expect.any(String));
  });
});
