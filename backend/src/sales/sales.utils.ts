import { SaleStatus } from '../generated/prisma/enums';

const EPSILON = 0.0001;

/**
 * Statut de paiement d'une vente (§42).
 */
export function computeSaleStatus(totalAmount: number, paid: number): SaleStatus {
  if (paid <= EPSILON) return SaleStatus.UNPAID;
  if (paid + EPSILON >= totalAmount) return SaleStatus.PAID;
  return SaleStatus.PARTIALLY_PAID;
}

/**
 * Historique et crédit restant d'un client (§43).
 * Les ventes annulées sont exclues.
 */
export function summarizeCustomerAccount(
  sales: Array<{ status: string; totalAmount: number; paid: number }>,
) {
  const active = sales.filter((sale) => sale.status !== SaleStatus.CANCELLED);
  const totalPurchases = active.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalPaid = active.reduce((sum, sale) => sum + sale.paid, 0);

  return {
    saleCount: active.length,
    totalPurchases: Number(totalPurchases.toFixed(2)),
    totalPaid: Number(totalPaid.toFixed(2)),
    outstandingBalance: Number(Math.max(0, totalPurchases - totalPaid).toFixed(2)),
  };
}
