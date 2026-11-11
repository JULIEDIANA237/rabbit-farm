import { reminderMessage } from './reminder-message';

describe('reminderMessage', () => {
  it('résume la journée', () => {
    expect(reminderMessage({ dueToday: 3, overdue: 1, birthsSoon: 2 })?.body).toBe(
      '3 tâches prévues aujourd’hui, 1 tâche en retard, 2 mises bas attendues sous 2 jours.',
    );
  });

  it('ne dérange pas quand il n’y a rien', () => {
    expect(reminderMessage({ dueToday: 0, overdue: 0, birthsSoon: 0 })).toBeNull();
  });
});
