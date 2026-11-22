import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export const IS_PLATFORM_ADMIN = gql`
  query IsPlatformAdmin { isPlatformAdmin }
`;

/** La personne connectée est-elle la propriétaire de l'app ? (null tant qu'on ne sait pas) */
export function usePlatformAdmin(): boolean | null {
  const { data, error } = useQuery<{ isPlatformAdmin: boolean }>(IS_PLATFORM_ADMIN, { fetchPolicy: 'cache-first' });
  if (error) return false;
  return data ? data.isPlatformAdmin : null;
}
