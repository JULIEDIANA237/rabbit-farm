/**
 * Variables d'environnement des tests d'intégration et e2e.
 * Les tests tournent TOUJOURS sur une base dédiée (jamais la base de dev).
 */
const url =
  process.env.TEST_DATABASE_URL ??
  'postgresql://postgres@localhost:5432/rabbitfarm_test';

if (!/test/i.test(new URL(url).pathname)) {
  throw new Error(
    `TEST_DATABASE_URL doit pointer vers une base de test (nom contenant "test") : ${url}`,
  );
}

process.env.DATABASE_URL = url;
// PrismaService et prisma.config.ts préfèrent DATABASE_URL_UNPOOLED, et
// dotenv recharge .env : on le fixe (au lieu de le supprimer) pour que
// les tests ne visent jamais la vraie base.
process.env.DATABASE_URL_UNPOOLED = url;
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';

// Le stockage des photos (Supabase) n'est pas sollicité par ces tests.
process.env.SUPABASE_URL = process.env.SUPABASE_URL ?? 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'sb_secret_test_only';
