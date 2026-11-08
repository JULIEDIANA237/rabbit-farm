import { execSync } from 'node:child_process';

/**
 * Applique les migrations sur la base de test avant la suite.
 */
export default function globalSetup() {
  const url =
    process.env.TEST_DATABASE_URL ??
    'postgresql://postgres@localhost:5432/rabbitfarm_test';

  if (!/test/i.test(new URL(url).pathname)) {
    throw new Error(`Base de test invalide : ${url}`);
  }

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    // prisma.config.ts préfère DATABASE_URL_UNPOOLED : on le force aussi
    // pour que les migrations de test ne visent jamais la vraie base.
    env: { ...process.env, DATABASE_URL: url, DATABASE_URL_UNPOOLED: url },
  });
}
