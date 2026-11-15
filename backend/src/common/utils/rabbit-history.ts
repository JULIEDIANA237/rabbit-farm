import type { Prisma, PrismaClient } from '../../generated/prisma/client.js';

type Db = Prisma.TransactionClient | PrismaClient;

/**
 * Liste ce qui empêche de supprimer définitivement des lapins :
 * tout historique (reproduction, santé, ventes, pesées...) doit être
 * conservé. Retourne une phrase par type d'historique trouvé.
 */
export async function rabbitDeletionBlockers(db: Db, rabbitIds: string[]) {
  if (!rabbitIds.length) return [];
  const ids = { in: rabbitIds };
  const [
    children,
    breedings,
    litters,
    lots,
    weighings,
    health,
    sales,
    mortalities,
    weanings,
    adoptions,
  ] = await Promise.all([
    db.rabbit.count({ where: { OR: [{ fatherId: ids }, { motherId: ids }] } }),
    db.breeding.count({ where: { OR: [{ femaleId: ids }, { maleId: ids }] } }),
    db.litter.count({ where: { OR: [{ motherId: ids }, { fatherId: ids }] } }),
    db.lotMembership.count({ where: { rabbitId: ids } }),
    db.weighing.count({ where: { rabbitId: ids } }),
    db.healthRecord.count({ where: { rabbitId: ids } }),
    db.saleItem.count({ where: { rabbitId: ids } }),
    db.mortalityRecord.count({ where: { rabbitId: ids } }),
    db.weaningRabbit.count({ where: { rabbitId: ids } }),
    db.adoptionRabbit.count({ where: { rabbitId: ids } }),
  ]);
  const blockers: string[] = [];
  if (children) blockers.push('des descendants');
  if (breedings || litters) blockers.push('des accouplements ou portées');
  if (lots) blockers.push('un lot d’engraissement');
  if (weighings) blockers.push('des pesées');
  if (health) blockers.push('des fiches santé');
  if (sales) blockers.push('une vente');
  if (mortalities) blockers.push('une sortie ou un décès');
  if (weanings) blockers.push('un sevrage');
  if (adoptions) blockers.push('une adoption');
  return blockers;
}

/**
 * Efface tout ce qui est lié à des lapins avant leur suppression définitive :
 * pesées, soins, cages, lots, sevrages, adoptions, sorties, tâches,
 * accouplements et, pour une femelle, ses mises bas et ses portées.
 * Les petits restent dans l'élevage (sans lien vers ce parent) et les
 * ventes restent enregistrées (la ligne garde son montant, sans le lapin).
 */
export async function purgeRabbitRecords(db: Prisma.TransactionClient, farmId: string, rabbitIds: string[]) {
  if (!rabbitIds.length) return;
  const ids = { in: rabbitIds };

  const breedings = await db.breeding.findMany({
    where: { farmId, OR: [{ femaleId: ids }, { maleId: ids }] },
    select: { id: true },
  });
  const litters = await db.litter.findMany({
    where: { farmId, motherId: ids },
    select: { id: true, weanings: { select: { id: true } } },
  });
  const births = await db.birth.findMany({ where: { farmId, motherId: ids }, select: { id: true } });
  const litterIds = litters.map((l) => l.id);
  const sourceIds = [
    ...breedings.map((b) => b.id),
    ...births.map((b) => b.id),
    ...litterIds,
    ...litters.flatMap((l) => l.weanings.map((w) => w.id)),
  ];

  // Tâches liées au lapin ou à ses accouplements, mises bas, portées et sevrages.
  await db.task.deleteMany({
    where: { farmId, OR: [{ rabbitId: ids }, ...(sourceIds.length ? [{ sourceId: { in: sourceIds } }] : [])] },
  });

  // Les petits et les portées d'un père restent, sans ce parent.
  await db.rabbit.updateMany({ where: { farmId, motherId: ids }, data: { motherId: null } });
  await db.rabbit.updateMany({ where: { farmId, fatherId: ids }, data: { fatherId: null } });
  await db.litter.updateMany({ where: { farmId, fatherId: ids }, data: { fatherId: null } });

  if (litterIds.length) {
    await db.litterAdoption.deleteMany({
      where: { OR: [{ sourceLitterId: { in: litterIds } }, { destinationLitterId: { in: litterIds } }] },
    });
    await db.litter.deleteMany({ where: { id: { in: litterIds } } });
  }
  await db.birth.deleteMany({ where: { farmId, motherId: ids } });
  if (breedings.length) {
    await db.breeding.deleteMany({ where: { id: { in: breedings.map((b) => b.id) } } });
  }

  await db.weaningRabbit.deleteMany({ where: { rabbitId: ids } });
  await db.adoptionRabbit.deleteMany({ where: { rabbitId: ids } });
  await db.mortalityRecord.deleteMany({ where: { farmId, rabbitId: ids } });
  await db.careRecord.deleteMany({ where: { farmId, rabbitId: ids } });
  // Pesées, fiches santé, cages, lots, photos et identifiants
  // partent avec le lapin (suppression en cascade).
}
