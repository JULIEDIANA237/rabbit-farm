import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp, gqlOk, registerFarm } from './utils/graphql.js';

/** Saisie hors ligne renvoyée deux fois : une seule est enregistrée. */
describe('Saisies hors ligne (intégration)', () => {
  let app: INestApplication;
  let token: string;

  const send = async (offlineId: string, title: string, dueDate = new Date().toISOString()) => {
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .set('X-Offline-Id', offlineId)
      .send({
        query: `mutation ($input: CreateTaskInput!) { createTask(input: $input) { id } }`,
        variables: { input: { title, dueDate } },
      });
    return res.body as { data?: { createTask: { id: string } }; errors?: Array<{ message: string }> };
  };

  const count = async (title: string) => {
    const { tasks } = await gqlOk(app, `{ tasks { title } }`, undefined, token);
    return tasks.filter((t: { title: string }) => t.title === title).length;
  };

  beforeAll(async () => {
    ({ app } = await createTestApp());
    token = await registerFarm(app, 'hors-ligne');
  });

  afterAll(async () => {
    await app.close();
  });

  it('enregistre la saisie une seule fois', async () => {
    const id = 'f3c1a2b4-0000-4000-8000-000000000001';
    expect((await send(id, 'Nettoyer les cages')).errors).toBeUndefined();
    const again = await send(id, 'Nettoyer les cages');
    expect(again.errors?.[0]?.message).toContain('déjà reçue');
    expect(await count('Nettoyer les cages')).toBe(1);
  });

  it('une saisie refusée peut être renvoyée avec le même identifiant', async () => {
    const id = 'f3c1a2b4-0000-4000-8000-000000000002';
    const refused = await send(id, 'Vacciner', 'pas une date');
    expect(refused.errors?.length).toBeGreaterThan(0);
    expect(refused.errors?.[0]?.message).not.toContain('déjà reçue');
    expect((await send(id, 'Vacciner')).errors).toBeUndefined();
    expect(await count('Vacciner')).toBe(1);
  });

  it('sans identifiant, rien ne change', async () => {
    await gqlOk(app, `mutation { createTask(input: { title: "Peser", dueDate: "${new Date().toISOString()}" }) { id } }`, undefined, token);
    await gqlOk(app, `mutation { createTask(input: { title: "Peser", dueDate: "${new Date().toISOString()}" }) { id } }`, undefined, token);
    expect(await count('Peser')).toBe(2);
  });
});
