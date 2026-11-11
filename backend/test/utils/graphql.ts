import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModuleBuilder } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module.js';
import { PrismaService } from '../../src/prisma/prisma.service.js';
import { resetDatabase } from './database.js';

export async function createTestApp(
  configure: (builder: TestingModuleBuilder) => TestingModuleBuilder = (builder) => builder,
) {
  const moduleRef = await configure(
    Test.createTestingModule({
      imports: [AppModule],
    }),
  ).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.init();

  const prisma = app.get(PrismaService);
  await resetDatabase(prisma);

  return { app, prisma };
}

export type GqlResult<T> = { data?: T; errors?: Array<{ message: string }> };

export async function gql<T = Record<string, any>>(
  app: INestApplication,
  query: string,
  variables: Record<string, unknown> = {},
  token?: string,
): Promise<GqlResult<T>> {
  const req = request(app.getHttpServer()).post('/graphql');
  if (token) req.set('Authorization', `Bearer ${token}`);
  const res = await req.send({ query, variables });
  return res.body as GqlResult<T>;
}

/**
 * Exécute une requête et échoue si GraphQL renvoie une erreur.
 */
export async function gqlOk<T = Record<string, any>>(
  app: INestApplication,
  query: string,
  variables: Record<string, unknown> = {},
  token?: string,
): Promise<T> {
  const result = await gql<T>(app, query, variables, token);
  if (result.errors?.length) {
    throw new Error(result.errors.map((e) => e.message).join(' | '));
  }
  return result.data as T;
}

export const daysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString();

export async function registerFarm(app: INestApplication, suffix = 'a') {
  const data = await gqlOk<{ register: { accessToken: string } }>(
    app,
    `mutation ($input: RegisterInput!) { register(input: $input) { accessToken } }`,
    {
      input: {
        email: `eleveur-${suffix}@example.com`,
        password: 'motdepasse123',
        firstName: 'Test',
        lastName: 'Éleveur',
        farmName: `Ferme ${suffix}`,
      },
    },
  );
  return data.register.accessToken;
}
