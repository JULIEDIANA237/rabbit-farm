'use client';

import { useMutation } from '@apollo/client/react';

import {
  GET_RABBIT,
  GET_RABBITS_PAGINATED,
} from '@/graphql/rabbits/queries';

import { UPDATE_RABBIT } from '@/graphql/rabbits/mutations';

import type {
  Rabbit,
  UpdateRabbitInput,
} from '@/types/rabbit';

interface UpdateRabbitResponse {
  updateRabbit: Rabbit;
}

interface UpdateRabbitVariables {
  input: UpdateRabbitInput;
}

export function useUpdateRabbit() {
  const [
    updateRabbitMutation,
    mutationState,
  ] = useMutation<
    UpdateRabbitResponse,
    UpdateRabbitVariables
  >(UPDATE_RABBIT);

  const updateRabbit = async (
    input: UpdateRabbitInput,
  ) => {
    return updateRabbitMutation({
      variables: {
        input,
      },

      refetchQueries: [
        {
          query: GET_RABBIT,
          variables: {
            id: input.id,
          },
        },
        {
          query: GET_RABBITS_PAGINATED,
        },
      ],

      awaitRefetchQueries: true,
    });
  };

  return {
    updateRabbit,
    loading: mutationState.loading,
    error: mutationState.error,
    data: mutationState.data,
  };
}