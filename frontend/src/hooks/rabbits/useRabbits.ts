'use client';

import { useQuery } from '@apollo/client/react';

import {
  GET_RABBIT,
  GET_RABBITS_PAGINATED,
} from '@/graphql/rabbits/queries';

import type {
  RabbitDetails,
  RabbitsPage,
} from '@/types/rabbit';

interface GetRabbitsResponse {
  rabbitsPaginated: RabbitsPage;
}

interface GetRabbitsVariables {
  input: {
    page: number;
    pageSize: number;
    search: string;
  };
}

interface GetRabbitResponse {
  rabbit: RabbitDetails;
}

interface GetRabbitVariables {
  id: string;
}

export function useRabbits(
  page: number,
  pageSize: number,
  search: string,
) {
  const {
    data,
    loading,
    error,
  } = useQuery<
    GetRabbitsResponse,
    GetRabbitsVariables
  >(GET_RABBITS_PAGINATED, {
    variables: {
      input: {
        page,
        pageSize,
        search,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const rabbitsPage = data?.rabbitsPaginated;

  return {
    rabbits: rabbitsPage?.items ?? [],
    loading,
    error,
    total: rabbitsPage?.total ?? 0,
    totalPages: rabbitsPage?.totalPages ?? 0,
    currentPage: rabbitsPage?.page ?? page,
    hasNextPage: rabbitsPage?.hasNextPage ?? false,
    hasPreviousPage: rabbitsPage?.hasPreviousPage ?? false,
  };
}

export function useRabbit(id: string) {
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<
    GetRabbitResponse,
    GetRabbitVariables
  >(GET_RABBIT, {
    variables: {
      id,
    },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  return {
    rabbit: data?.rabbit ?? null,
    loading,
    error,
    refetch,
  };
}