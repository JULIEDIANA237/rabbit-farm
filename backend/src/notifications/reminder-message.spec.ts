import { reminderMessage } from './reminder-message.js';

describe('reminderMessage', () => {
  it('résume la journée', () => {
    expect(reminderMessage({ dueToday: 3, overdue: 1, birthsSoon: 2 })?.body).toBe(
      '3 tâches prévues aujourd’hui, 1 tâche en retard, 2 mises bas attendues sous 2 jours.',
    );
  });

  it('signale les lapins prêts pour la vente', () => {
    expect(reminderMessage({ dueToday: 0, overdue: 0, birthsSoon: 0, readyForSale: 4 })?.body).toBe(
      '4 lapins prêts pour la vente.',
    );
  });

  it('ne dérange pas quand il n’y a rien', () => {
    expect(reminderMessage({ dueToday: 0, overdue: 0, birthsSoon: 0 })).toBeNull();
  });
});

describe('reminderMessage : ressaillie', () => {
  it('signale les femelles à évaluer', () => {
    expect(reminderMessage({ dueToday: 1, overdue: 0, birthsSoon: 0, rematingChecks: 1 })?.body).toContain(
      '1 femelle à évaluer pour une nouvelle saillie',
    );
  });
});
