import { AccessStatus } from './subscription.models.js';

export const DAY = 86_400_000;

export interface FarmAccessFacts {
  createdAt: Date;
  trialEndsAt: Date | null;
  paidUntil: Date | null;
}

/** Fin de l'essai : date fixée sur l'élevage, sinon création + durée d'essai. */
export function trialEnd(farm: FarmAccessFacts, trialDays: number) {
  return farm.trialEndsAt ?? new Date(farm.createdAt.getTime() + trialDays * DAY);
}

/** État d'accès d'un élevage à une date donnée. */
export function accessOf(farm: FarmAccessFacts, trialDays: number, exempt: boolean, now = new Date()) {
  const trialEndsAt = trialEnd(farm, trialDays);
  const left = (d: Date) => Math.max(0, Math.ceil((d.getTime() - now.getTime()) / DAY));
  let status: AccessStatus;
  let daysLeft = 0;
  if (exempt) status = AccessStatus.EXEMPT;
  else if (farm.paidUntil && farm.paidUntil > now) {
    status = AccessStatus.ACTIVE;
    daysLeft = left(farm.paidUntil);
  } else if (trialEndsAt > now) {
    status = AccessStatus.TRIAL;
    daysLeft = left(trialEndsAt);
  } else status = AccessStatus.EXPIRED;
  return { status, daysLeft, trialEndsAt, readOnly: status === AccessStatus.EXPIRED };
}

/** Nouvelle fin de période : on prolonge à partir de la fin actuelle si elle est encore à venir. */
export function extendPeriod(paidUntil: Date | null, plan: 'MONTHLY' | 'YEARLY', now = new Date()) {
  const start = paidUntil && paidUntil > now ? new Date(paidUntil) : new Date(now);
  if (plan === 'YEARLY') start.setFullYear(start.getFullYear() + 1);
  else start.setMonth(start.getMonth() + 1);
  return start;
}
