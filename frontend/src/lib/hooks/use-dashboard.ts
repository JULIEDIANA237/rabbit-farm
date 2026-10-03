'use client';

import { useQuery } from '@apollo/client/react';

import { DASHBOARD_QUERY } from '@/lib/graphql/dashboard.queries';
import type { DashboardQueryData } from '@/lib/graphql/dashboard.types';

export function useDashboard() {
  const { data, loading, error, refetch } =
    useQuery<DashboardQueryData>(DASHBOARD_QUERY, {
      fetchPolicy: 'cache-and-network',
    });

  return {
    dashboard: data?.dashboard ?? null,
    loading,
    error,
    refetch,
  };
}