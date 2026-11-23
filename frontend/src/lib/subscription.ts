import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export const SUBSCRIPTION_STATUS = gql`
  query SubscriptionStatus {
    subscriptionStatus {
      status readOnly trialEndsAt paidUntil daysLeft
      settings { trialDays monthlyPrice yearlyPrice paymentInstructions }
      pendingPayment { id plan amount reference createdAt }
      onlinePaymentEnabled onlineOperators
    }
  }
`;

export type AccessStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'EXEMPT';
export type Plan = 'MONTHLY' | 'YEARLY';

export interface SubscriptionStatus {
  status: AccessStatus;
  readOnly: boolean;
  trialEndsAt: string;
  paidUntil?: string | null;
  daysLeft: number;
  settings: { trialDays: number; monthlyPrice: number; yearlyPrice: number; paymentInstructions?: string | null };
  pendingPayment?: { id: string; plan: Plan; amount: number; reference?: string | null; createdAt: string } | null;
  onlinePaymentEnabled: boolean;
  onlineOperators: Array<'MTN' | 'ORANGE'>;
}

export const PLAN_LABEL: Record<Plan, string> = { MONTHLY: 'Mensuel', YEARLY: 'Annuel' };

/** État de l'essai ou de l'abonnement de l'élevage connecté. */
export function useSubscription() {
  const { data, loading, refetch } = useQuery<{ subscriptionStatus: SubscriptionStatus }>(SUBSCRIPTION_STATUS, {
    fetchPolicy: 'cache-and-network',
  });
  return { subscription: data?.subscriptionStatus ?? null, loading, refetch };
}

export const days = (n: number) => `${n} jour${n > 1 ? 's' : ''}`;
