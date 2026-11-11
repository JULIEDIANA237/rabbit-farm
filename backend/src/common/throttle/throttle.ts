import { SetMetadata } from '@nestjs/common';

/**
 * Limite de requêtes par adresse IP et par route.
 *
 * Remplace @nestjs/throttler : ce paquet est publié en CommonJS et fait
 * require() de @nestjs/common (ESM uniquement), ce que l'environnement
 * d'exécution de Vercel refuse (ERR_REQUIRE_ESM).
 */
export interface ThrottleLimit {
  limit: number;
  ttl: number;
}

export const THROTTLE_KEY = 'rabbitfarm:throttle';

export const DEFAULT_THROTTLE: ThrottleLimit = { limit: 300, ttl: 60_000 };

/** Même forme que l'ancien décorateur : @Throttle({ default: { limit, ttl } }). */
export const Throttle = (options: { default: ThrottleLimit }) =>
  SetMetadata(THROTTLE_KEY, options.default);
