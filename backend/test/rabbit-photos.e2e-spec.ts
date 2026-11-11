import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { PrismaService } from '../src/prisma/prisma.service';
import { SupabaseStorageService } from '../src/storage/supabase-storage.service';
import { createTestApp, daysAgo, gqlOk, registerFarm } from './utils/graphql';

/**
 * Photos des lapins par l'API REST, avec un stockage simulé.
 */
describe('Photos des lapins (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let rabbitId: string;
  let uploads = 0;
  const storage = {
    uploadRabbitPhoto: async () => {
      uploads += 1;
      return { url: `https://photos.test/${uploads}.jpg`, path: `p/${uploads}.jpg` };
    },
    deleteFile: async () => undefined,
  };

  const http = () => request(app.getHttpServer());
  const photos = () =>
    app.get(PrismaService).rabbitPhoto.findMany({ where: { rabbitId }, orderBy: { createdAt: 'asc' } });
  const upload = (isPrimary?: boolean) => {
    const req = http().post(`/rabbits/${rabbitId}/photos`).set('Authorization', `Bearer ${token}`);
    if (isPrimary !== undefined) req.field('isPrimary', String(isPrimary));
    return req.attach('file', Buffer.from('fake'), { filename: 'lapin.jpg', contentType: 'image/jpeg' });
  };

  beforeAll(async () => {
    ({ app } = await createTestApp((builder) => builder.overrideProvider(SupabaseStorageService).useValue(storage)));
    token = await registerFarm(app, 'photos');
    const data = await gqlOk(
      app,
      'mutation ($input: CreateRabbitInput!) { createRabbit(input: $input) { id } }',
      { input: { code: 'P01', sex: 'FEMALE', purpose: 'BREEDER', birthDate: daysAgo(200) } },
      token,
    );
    rabbitId = data.createRabbit.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('ajoute à la galerie sans changer la principale, puis change et supprime la principale', async () => {
    await upload().expect(201);
    await upload(false).expect(201);
    let [first, second] = await photos();
    expect([first.isPrimary, second.isPrimary]).toEqual([true, false]);

    await http().patch(`/rabbits/photos/${second.id}/primary`).set('Authorization', `Bearer ${token}`).expect(200);
    [first, second] = await photos();
    expect([first.isPrimary, second.isPrimary]).toEqual([false, true]);

    await http().delete(`/rabbits/photos/${second.id}`).set('Authorization', `Bearer ${token}`).expect(200);
    const rest = await photos();
    expect(rest).toHaveLength(1);
    expect(rest[0].isPrimary).toBe(true);
  });

  it("refuse la photo d'une autre ferme", async () => {
    const [photo] = await photos();
    const other = await registerFarm(app, 'photos-autre');
    await http().patch(`/rabbits/photos/${photo.id}/primary`).set('Authorization', `Bearer ${other}`).expect(404);
  });
});
