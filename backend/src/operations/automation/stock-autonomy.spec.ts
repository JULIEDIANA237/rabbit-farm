import { computeAutonomy, stockFromMovements } from './stock-autonomy.js';

describe('stock-autonomy (§45, §46)', () => {
  const now = new Date('2026-11-06T12:00:00.000Z');
  const daysAgo = (days: number) => new Date(now.getTime() - days * 86_400_000);

  it('reconstitue le stock à partir des mouvements', () => {
    expect(
      stockFromMovements([
        { type: 'INITIAL', quantity: 500 },
        { type: 'PURCHASE', quantity: 200 },
        { type: 'CONSUMPTION', quantity: 300 },
        { type: 'LOSS', quantity: 20 },
        { type: 'ADJUSTMENT', quantity: -15 },
        { type: 'RETURN', quantity: 5 },
      ]),
    ).toBe(370);
  });

  it('calcule 18 jours d’autonomie pour 180 kg à 10 kg/jour (exemple du cahier)', () => {
    const movements = Array.from({ length: 30 }, (_, index) => ({
      type: 'CONSUMPTION',
      quantity: 10,
      date: daysAgo(index + 1),
    }));

    const result = computeAutonomy(180, movements, now);

    expect(result.averageDailyConsumption).toBe(10);
    expect(result.autonomyDays).toBe(18);
  });

  it('ignore les consommations hors de la fenêtre et les autres types', () => {
    const result = computeAutonomy(
      100,
      [
        { type: 'CONSUMPTION', quantity: 999, date: daysAgo(60) },
        { type: 'PURCHASE', quantity: 500, date: daysAgo(2) },
        { type: 'CONSUMPTION', quantity: 20, date: daysAgo(4) },
      ],
      now,
    );

    expect(result.averageDailyConsumption).toBe(5);
    expect(result.autonomyDays).toBe(20);
  });

  it('retourne null sans consommation enregistrée', () => {
    const result = computeAutonomy(100, [], now);

    expect(result.averageDailyConsumption).toBeNull();
    expect(result.autonomyDays).toBeNull();
  });
});
