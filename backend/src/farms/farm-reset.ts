import type { Prisma, PrismaClient } from '../generated/prisma/client.js';

import { purgeRabbitRecords } from '../common/utils/rabbit-history.js';

type Db = Prisma.TransactionClient | PrismaClient;

/** Lapereaux d'engraissement nés à la ferme (même règle que la page Lapereaux). */
const kitWhere = (farmId: string) => ({
  farmId,
  birthLitterId: { not: null },
  purpose: 'FATTENING' as const,
});

/**
 * Ce que la réinitialisation efface, avec le nombre d'enregistrements.
 * Restent : lapins adultes et reproducteurs, tâches, stock, dépenses,
 * bâtiments, cages, races et réglages.
 */
export async function farmResetCounts(db: Db, farmId: string) {
  const [breedings, births, litters, kits, weanings, lots, weighings, health, care, sales, mortalities] =
    await Promise.all([
      db.breeding.count({ where: { farmId } }),
      db.birth.count({ where: { farmId } }),
      db.litter.count({ where: { farmId } }),
      db.rabbit.count({ where: kitWhere(farmId) }),
      db.weaning.count({ where: { farmId } }),
      db.fatteningLot.count({ where: { farmId } }),
      db.weighing.count({ where: { OR: [{ rabbit: { farmId } }, { lot: { farmId } }] } }),
      db.healthRecord.count({ where: { farmId } }),
      db.careRecord.count({ where: { farmId } }),
      db.sale.count({ where: { farmId } }),
      db.mortalityRecord.count({ where: { farmId } }),
    ]);
  return [
    { label: 'Accouplements et palpations', count: breedings },
    { label: 'Mises bas', count: births },
    { label: 'Portées', count: litters },
    { label: 'Lapereaux d’engraissement', count: kits },
    { label: 'Sevrages', count: weanings },
    { label: 'Lots d’engraissement', count: lots },
    { label: 'Pesées', count: weighings },
    { label: 'Fiches santé', count: health },
    { label: 'Soins', count: care },
    { label: 'Ventes et paiements', count: sales },
    { label: 'Sorties et décès', count: mortalities },
  ];
}

/** Efface tout sauf les lapins adultes, les tâches, le stock et les dépenses. */
export async function resetFarmRecords(db: Prisma.TransactionClient, farmId: string) {
  const kits = await db.rabbit.findMany({ where: kitWhere(farmId), select: { id: true } });
  // Les lapereaux partent avec ce qui les concerne (dont leurs propres tâches).
  await purgeRabbitRecords(db, farmId, kits.map((k) => k.id));
  if (kits.length) {
    await db.rabbit.deleteMany({ where: { id: { in: kits.map((k) => k.id) } } });
  }

  await db.sale.deleteMany({ where: { farmId } }); // lignes et paiements en cascade
  await db.mortalityRecord.deleteMany({ where: { farmId } });
  await db.careRecord.deleteMany({ where: { farmId } });
  await db.healthRecord.deleteMany({ where: { farmId } });
  await db.weighing.deleteMany({ where: { OR: [{ rabbit: { farmId } }, { lot: { farmId } }] } });
  await db.fatteningLot.deleteMany({ where: { farmId } }); // membres et cages du lot en cascade
  await db.weaningRabbit.deleteMany({ where: { weaning: { farmId } } });
  await db.weaning.deleteMany({ where: { farmId } });
  await db.adoptionRabbit.deleteMany({ where: { adoption: { farmId } } });
  await db.litterAdoption.deleteMany({ where: { farmId } });
  await db.litter.deleteMany({ where: { farmId } }); // les adultes nés ici gardent leurs parents
  await db.nestInstallation.deleteMany({ where: { farmId } });
  await db.birth.deleteMany({ where: { farmId } });
  await db.pregnancy.deleteMany({ where: { farmId } });
  await db.breeding.deleteMany({ where: { farmId } });
  // Les lapins gardés restent tels quels (statut, cage, passé).
}
