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
