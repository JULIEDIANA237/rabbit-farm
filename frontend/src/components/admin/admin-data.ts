import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import type { AccessStatus, Plan } from '@/lib/subscription';

export const SUBSCRIPTION_ADMIN = gql`
  query SubscriptionAdmin {
    subscriptionAdmin {
      revenue30d revenueTotal payingFarms trialFarms expiredFarms
      settings { trialDays monthlyPrice yearlyPrice paymentInstructions }
      pendingPayments { id farmName plan amount reference createdAt }
      confirmedPayments { id farmName plan amount reference provider confirmedAt periodEnd }
      farms { farmId farmName ownerEmail memberEmails createdAt status daysLeft trialEndsAt paidUntil freeAccess }
    }
  }
`;
export const PLATFORM_STATS = gql`
  query PlatformStats {
    platformStats {
      farms users newUsers30d activeUsers7d activeUsers30d rabbits
      ratingsCount averageRating ratingDistribution
      latestRatings { id stars comment farmName updatedAt }
    }
  }
`;
const UPDATE_SETTINGS = gql`
  mutation UpdatePlatformSettings($input: PlatformSettingsInput!) { updatePlatformSettings(input: $input) { trialDays } }
`;
const CONFIRM = gql`mutation ConfirmSubscriptionPayment($id: ID!) { confirmSubscriptionPayment(id: $id) { id } }`;
const REJECT = gql`mutation RejectSubscriptionPayment($id: ID!) { rejectSubscriptionPayment(id: $id) { id } }`;
const ACTIVATE = gql`mutation ActivateSubscription($farmId: ID!, $plan: SubscriptionPlan!) { activateSubscription(farmId: $farmId, plan: $plan) }`;
const EXTEND = gql`mutation ExtendTrial($farmId: ID!, $days: Int!) { extendTrial(farmId: $farmId, days: $days) }`;
const DELETE_PAYMENT = gql`mutation DeleteSubscriptionPayment($id: ID!) { deleteSubscriptionPayment(id: $id) }`;
const FREE = gql`mutation SetFarmFreeAccess($farmId: ID!, $free: Boolean!) { setFarmFreeAccess(farmId: $farmId, free: $free) }`;

export type Settings = { trialDays: number; monthlyPrice: number; yearlyPrice: number; paymentInstructions?: string | null };
export type FarmRow = {
  farmId: string; farmName: string; ownerEmail?: string | null; memberEmails: string[]; createdAt: string;
  status: AccessStatus; daysLeft: number; trialEndsAt: string; paidUntil?: string | null; freeAccess: boolean;
};
export type PendingPayment = { id: string; farmName?: string | null; plan: Plan; amount: number; reference?: string | null; createdAt: string };
export type ConfirmedPayment = {
  id: string; farmName?: string | null; plan: Plan; amount: number; reference?: string | null;
  provider?: string | null; confirmedAt?: string | null; periodEnd?: string | null;
};
export type SubscriptionAdmin = {
  revenue30d: number; revenueTotal: number; payingFarms: number; trialFarms: number; expiredFarms: number;
  settings: Settings; pendingPayments: PendingPayment[]; confirmedPayments: ConfirmedPayment[]; farms: FarmRow[];
};
export type PlatformStats = {
  farms: number; users: number; newUsers30d: number; activeUsers7d: number; activeUsers30d: number; rabbits: number;
  ratingsCount: number; averageRating?: number | null; ratingDistribution: number[];
  latestRatings: { id: string; stars: number; comment?: string | null; farmName?: string | null; updatedAt: string }[];
};

const refetchQueries = ['SubscriptionAdmin'];

export function useSubscriptionAdmin() {
  const { data, error, loading } = useQuery<{ subscriptionAdmin: SubscriptionAdmin }>(SUBSCRIPTION_ADMIN, { fetchPolicy: 'cache-and-network' });
  return { admin: data?.subscriptionAdmin ?? null, error, loading };
}

export function usePlatformStats() {
  const { data, error, loading } = useQuery<{ platformStats: PlatformStats }>(PLATFORM_STATS, { fetchPolicy: 'cache-and-network' });
  return { stats: data?.platformStats ?? null, error, loading };
}

export function useAdminActions() {
  const opts = { refetchQueries };
  const [confirm] = useMutation(CONFIRM, opts);
  const [reject] = useMutation(REJECT, opts);
  const [activate] = useMutation(ACTIVATE, opts);
  const [extend] = useMutation(EXTEND, opts);
  const [setFree] = useMutation(FREE, opts);
  const [removePayment, removeState] = useMutation(DELETE_PAYMENT, opts);
  const [saveSettings, saveState] = useMutation(UPDATE_SETTINGS, opts);
  return { confirm, reject, activate, extend, setFree, saveSettings, saveState, removePayment, removeState };
}
