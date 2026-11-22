import type { Prisma, PrismaClient } from '../generated/prisma/client.js';
import { BreedingStatus } from '../generated/prisma/client.js';

type Db = Prisma.TransactionClient | PrismaClient;

/** Un mâle ne doit pas couvrir plus de 2 femelles différentes en 24 h. */
export const MAX_FEMALES_PER_MALE_24H = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Femelles déjà saillies par ce mâle dans les 24 h autour de `date`
 * (accouplements et saillies supplémentaires, annulés exclus).
 */
export async function femalesCoveredAround(db: Db, farmId: string, maleId: string, date: Date) {
  const window = { gt: new Date(date.getTime() - DAY_MS), lt: new Date(date.getTime() + DAY_MS) };
  const [main, extra] = await Promise.all([
    db.breeding.findMany({
      where: { farmId, maleId, breedingDate: window, status: { not: BreedingStatus.CANCELLED } },
      select: { female: { select: { id: true, code: true } } },
    }),
    db.breedingMating.findMany({
      where: { maleId, date: window, breeding: { farmId, status: { not: BreedingStatus.CANCELLED } } },
      select: { breeding: { select: { female: { select: { id: true, code: true } } } } },
    }),
  ]);
  const females = new Map<string, string>();
  for (const b of main) females.set(b.female.id, b.female.code);
  for (const m of extra) females.set(m.breeding.female.id, m.breeding.female.code);
  return [...females].map(([id, code]) => ({ id, code }));
}

/** Les deux dates tombent-elles le même jour (moins de 24 h d'écart) ? */
export function sameMatingDay(a: Date, b: Date) {
  return Math.abs(a.getTime() - b.getTime()) < DAY_MS;
}

export function maleLimitMessage(maleCode: string, codes: string[]) {
  return `Le mâle ${maleCode} a déjà sailli ${codes.length} femelles en 24 h (${codes.join(', ')}). ` +
    `Un mâle ne doit pas couvrir plus de ${MAX_FEMALES_PER_MALE_24H} femelles par 24 h : choisis un autre mâle ou attends demain.`;
}
