import { gql } from '@apollo/client';

export const BREEDERS_PAST = gql`
  query BreedersPast {
    rabbitsPaginated(input: { category: ADULT, status: ACTIVE, pageSize: 200 }) {
      items {
        id code sex purpose origin previousLitters previousKitsBorn lastBirthDate maternalBehavior
        previousMatings healthHistory previousKitsLost cannibalismCases previousFemales
      }
    }
  }
`;

export interface BreederPast {
  id: string;
  code: string;
  sex: string;
  purpose: string;
  origin?: string | null;
  previousLitters?: number | null;
  previousKitsBorn?: number | null;
  lastBirthDate?: string | null;
  maternalBehavior?: string | null;
  previousMatings?: number | null;
  healthHistory?: string | null;
  previousKitsLost?: number | null;
  cannibalismCases?: number | null;
  previousFemales?: number | null;
}

const BREEDING = ['BREEDER', 'FUTURE_BREEDER'];

/** Reproducteur dont le passé n'a jamais été renseigné. */
export function needsPast(r: BreederPast) {
  if (!BREEDING.includes(r.purpose)) return false;
  if (r.sex === 'FEMALE') return r.previousLitters == null;
  if (r.sex === 'MALE') return r.previousMatings == null && r.previousFemales == null;
  return false;
}

/** Seuls les reproducteurs (femelles et mâles) sont listés. */
export const isBreeder = (r: BreederPast) => BREEDING.includes(r.purpose) && (r.sex === 'FEMALE' || r.sex === 'MALE');
