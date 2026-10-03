'use client';

import { useQuery } from '@apollo/client/react';
import { DASHBOARD_QUERY } from '@/lib/graphql/dashboard.queries';
import type { DashboardData } from '@/types/dashboard.types';

interface DashboardQueryResult {
  dashboard: DashboardData;
}

export function useDashboard() {
  const { data, loading, error, refetch } =
    useQuery<DashboardQueryResult>(DASHBOARD_QUERY, {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    });

  return {
    dashboard: data?.dashboard ?? null,
    loading,
    error,
    refetch,
  };
}