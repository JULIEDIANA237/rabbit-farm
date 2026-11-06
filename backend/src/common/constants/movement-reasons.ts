import { BadRequestException } from '@nestjs/common';

/**
 * Raisons possibles d'un déplacement de cage (§9).
 */
export const MOVEMENT_REASONS = [
  'INITIAL_ASSIGNMENT',
  'BREEDING',
  'MATERNITY',
  'FATTENING',
  'QUARANTINE',
  'CLEANING',
  'HEALTH',
  'SALE',
  'AGGRESSION',
  'OVERCROWDING',
  'SEX_SEPARATION',
  'SIZE_DIFFERENCE',
  'OTHER',
] as const;

export type MovementReason = (typeof MOVEMENT_REASONS)[number];

/**
 * Normalise une raison saisie. Retourne null si vide,
 * lève une erreur si la valeur n'appartient pas à la liste.
 */
export function normalizeMovementReason(
  reason: string | null | undefined,
): MovementReason | null {
  const value = reason?.trim().toUpperCase();

  if (!value) return null;

  if (!(MOVEMENT_REASONS as readonly string[]).includes(value)) {
    throw new BadRequestException(
      `Raison de déplacement inconnue : ${reason}. Valeurs possibles : ${MOVEMENT_REASONS.join(', ')}.`,
    );
  }

  return value as MovementReason;
}
