import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export const RABBIT_OPTIONS = gql`
  query RabbitOptions($input: RabbitsPaginationInput) {
    rabbitsPaginated(input: $input) {
      items {
        id
        code
        sex
        purpose
        status
        birthDate
        currentCageCode
      }
    }
  }
`;

export const CAGE_OPTIONS = gql`
  query CageOptions {
    cages {
      id
      code
      capacity
      rabbitCount
      status
      sectionId
    }
  }
`;

export const LOT_OPTIONS = gql`
  query LotOptions {
    fatteningLots {
      id
      code
      status
      activeMemberCount
    }
  }
`;

export const LITTER_OPTIONS = gql`
  query LitterOptions {
    litters {
      id
      code
      status
      currentCount
      birthDate
      mother {
        code
      }
    }
  }
`;

export const CUSTOMER_OPTIONS = gql`
  query CustomerOptions {
    customers {
      id
      name
    }
  }
`;

export const BREED_OPTIONS = gql`
  query BreedOptions {
    breeds {
      id
      name
    }
  }
`;

export interface RabbitOption {
  id: string;
  code: string;
  sex: string;
  purpose: string;
  status: string;
  birthDate?: string | null;
  currentCageCode?: string | null;
}

type Opt = { value: string; label: string };

export function useRabbitOptions(filter: { sex?: string; purpose?: string; status?: string } = {}) {
  const { data, loading } = useQuery<{ rabbitsPaginated: { items: RabbitOption[] } }>(RABBIT_OPTIONS, {
    variables: { input: { pageSize: 200, status: 'status' in filter ? filter.status : 'ACTIVE', sex: filter.sex, purpose: filter.purpose } },
  });
  const rabbits = data?.rabbitsPaginated.items ?? [];
  const options: Opt[] = rabbits.map((r) => ({
    value: r.id,
    label: `${r.code}${r.currentCageCode ? ` · cage ${r.currentCageCode}` : ''}`,
  }));
  return { rabbits, options, loading };
}

export function useCageOptions() {
  const { data } = useQuery<{ cages: Array<{ id: string; code: string; capacity: number; rabbitCount: number; status: string }> }>(
    CAGE_OPTIONS,
  );
  const cages = data?.cages ?? [];
  return {
    cages,
    options: cages
      .filter((c) => c.status === 'ACTIVE')
      .map((c) => ({ value: c.id, label: `${c.code} (${c.rabbitCount}/${c.capacity})` })),
  };
}

export function useLotOptions(activeOnly = true) {
  const { data } = useQuery<{ fatteningLots: Array<{ id: string; code: string; status: string; activeMemberCount: number }> }>(
    LOT_OPTIONS,
  );
  const lots = (data?.fatteningLots ?? []).filter((l) => !activeOnly || l.status === 'ACTIVE');
  return { lots, options: lots.map((l) => ({ value: l.id, label: `${l.code} (${l.activeMemberCount} lapins)` })) };
}

export function useLitterOptions(activeOnly = true) {
  const { data } = useQuery<{
    litters: Array<{ id: string; code: string; status: string; currentCount: number; mother?: { code: string } | null }>;
  }>(LITTER_OPTIONS);
  const litters = (data?.litters ?? []).filter((l) => !activeOnly || l.status === 'ACTIVE');
  return {
    litters,
    options: litters.map((l) => ({
      value: l.id,
      label: `${l.code} · ${l.mother?.code ?? '?'} (${l.currentCount})`,
    })),
  };
}

export function useCustomerOptions() {
  const { data } = useQuery<{ customers: Array<{ id: string; name: string }> }>(CUSTOMER_OPTIONS);
  return { options: (data?.customers ?? []).map((c) => ({ value: c.id, label: c.name })) };
}

export function useBreedOptions() {
  const { data } = useQuery<{ breeds: Array<{ id: string; name: string }> }>(BREED_OPTIONS);
  return { options: (data?.breeds ?? []).map((b) => ({ value: b.id, label: b.name })) };
}
