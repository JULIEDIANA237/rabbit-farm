import { describeNetworkError } from '../common/utils/network-error.js';
import { API_KEY_VARS, type AiProvider } from './ai-config.js';

/**
 * Explique pourquoi un appel au modèle a échoué, en français, pour
 * l'éleveur (message affiché) comme pour les logs du serveur.
 */
/** Statut HTTP renvoyé par le fournisseur, s'il y en a un. */
export function aiErrorStatus(error: unknown): number | undefined {
  let current: unknown = error;
  for (let depth = 0; current && typeof current === 'object' && depth < 6; depth += 1) {
    const value = current as Record<string, unknown>;
    if (typeof value.statusCode === 'number') return value.statusCode;
    current = value.lastError ?? value.cause;
  }
  return undefined;
}

/** Le modèle est saturé ou en panne : un autre modèle peut réussir. */
export function isOverloaded(error: unknown): boolean {
  const status = aiErrorStatus(error);
  return status === 429 || (status !== undefined && status >= 500);
}

export function describeAiError(error: unknown, provider: AiProvider): string {
  const chain: Array<Record<string, unknown>> = [];
  let current: unknown = error;
  for (let depth = 0; current && typeof current === 'object' && depth < 6; depth += 1) {
    const value = current as Record<string, unknown>;
    chain.push(value);
    current = value.lastError ?? value.cause;
  }

  if (chain.some((item) => item.name === 'TimeoutError' || item.name === 'AbortError')) {
    return "L'assistant IA a mis trop de temps à répondre. Vérifie ta connexion internet puis réessaie.";
  }

  const status = chain.map((item) => item.statusCode).find((code): code is number => typeof code === 'number');
  if (status === 429) {
    return "Le quota gratuit de l'IA est épuisé pour le moment. Réessaie dans quelques minutes.";
  }
  if (status === 400 || status === 401 || status === 403) {
    const body = chain.map((item) => item.responseBody).find((text) => typeof text === 'string') as string | undefined;
    if (status !== 400 || /api[_ ]?key/i.test(body ?? '')) {
      return `La clé ${API_KEY_VARS[provider]} est refusée par le fournisseur d'IA : vérifie-la dans le .env puis redémarre le backend.`;
    }
  }
  if (status === 404) {
    return "Le modèle d'IA demandé (AI_MODEL) n'existe pas chez ce fournisseur.";
  }
  if (status !== undefined && status >= 500) {
    return "Le service d'IA est momentanément indisponible. Réessaie dans un instant.";
  }

  const network = describeNetworkError(error instanceof Object && 'lastError' in error ? (error as { lastError: unknown }).lastError : error);
  if (/certificat|connexion|adresse|réseau/.test(network)) {
    return `L'assistant IA est injoignable : ${network}.`;
  }
  return "L'assistant IA ne répond pas pour le moment. Vérifie la connexion ou réessaie dans un instant.";
}
