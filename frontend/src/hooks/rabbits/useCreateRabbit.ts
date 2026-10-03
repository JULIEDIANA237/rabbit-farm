'use client';

import { useMutation } from '@apollo/client/react';
import { CREATE_RABBIT } from '@/graphql/rabbits/mutations';
import { GET_RABBITS_PAGINATED } from '@/graphql/rabbits/queries';
import type {
  CreateRabbitInput,
  Rabbit,
} from '@/types/rabbit';

interface CreateRabbitResponse {
  createRabbit: Rabbit;
}

export function useCreateRabbit() {
  const [createRabbitMutation, mutationState] =
    useMutation<CreateRabbitResponse>(CREATE_RABBIT, {
      refetchQueries: [
        {
          query: GET_RABBITS_PAGINATED,
        },
      ],
      awaitRefetchQueries: true,
    });

  const createRabbit = async (
    input: CreateRabbitInput,
  ) => {
    const result = await createRabbitMutation({
      variables: {
        input,
      },

      refetchQueries: [
        {
          query: GET_RABBITS_PAGINATED,
        },
      ],

      awaitRefetchQueries: true,
    });

    return result.data?.createRabbit;
  };

  return {
    createRabbit,

    loading: mutationState.loading,

    error: mutationState.error,

    data: mutationState.data,
  };

}