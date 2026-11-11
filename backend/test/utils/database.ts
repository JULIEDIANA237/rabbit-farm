import type { PrismaService } from '../../src/prisma/prisma.service.js';

/**
 * Vide toutes les tables (sauf l'historique des migrations).
 */
export async function resetDatabase(prisma: PrismaService) {
  const tables = await prisma.$queryRawUnsafe<Array<{ tablename: string }>>(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`,
  );

  if (!tables.length) return;

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tables.map((t) => `"public"."${t.tablename}"`).join(', ')} CASCADE`,
  );
}
