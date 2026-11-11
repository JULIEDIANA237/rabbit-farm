import { computeSaleStatus, summarizeCustomerAccount } from './sales.utils.js';

describe('sales.utils (§42, §43)', () => {
  it('calcule le statut de paiement', () => {
    expect(computeSaleStatus(100, 0)).toBe('UNPAID');
    expect(computeSaleStatus(100, 40)).toBe('PARTIALLY_PAID');
    expect(computeSaleStatus(100, 100)).toBe('PAID');
    expect(computeSaleStatus(100, 99.99999)).toBe('PAID');
  });

  it('calcule le crédit restant d’un client en ignorant les ventes annulées', () => {
    const summary = summarizeCustomerAccount([
      { status: 'PAID', totalAmount: 50, paid: 50 },
      { status: 'PARTIALLY_PAID', totalAmount: 120, paid: 20 },
      { status: 'CANCELLED', totalAmount: 999, paid: 0 },
    ]);

    expect(summary).toEqual({
      saleCount: 2,
      totalPurchases: 170,
      totalPaid: 70,
      outstandingBalance: 100,
    });
  });
});
