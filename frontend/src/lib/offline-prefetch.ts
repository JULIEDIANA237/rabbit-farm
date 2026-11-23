import type { ApolloClient, DocumentNode } from '@apollo/client';

import { ME_QUERY } from '@/graphql/auth/mutations';
import { FARM_STRUCTURE, OPEN_TASKS_QUERY, TASKS_QUERY } from '@/graphql/field-queries';
import { BREED_OPTIONS, CAGE_OPTIONS, LITTER_OPTIONS, LOT_OPTIONS, RABBIT_OPTIONS } from '@/graphql/options';
import { GET_RABBITS_PAGINATED } from '@/graphql/rabbits/queries';
import { BREEDERS_PAST } from '@/components/rabbits/breeders-past';

import { SUBSCRIPTION_STATUS } from './subscription';

/**
 * Préchargement hors ligne : quand le réseau est là, l'app charge en tâche de
 * fond les écrans du terrain, pour qu'ils s'ouvrent même sans réseau.
 */

const LAST_KEY = 'rabbitfarm.offline-prefetch';
const EVERY_MS = 20 * 60_000;

/** Pages gardées par le service worker (fichiers de l'app compris). */
export const FIELD_PAGES = [
  '/dashboard',
  '/rabbits',
  '/kits',
  '/farm',
  '/tasks',
  '/breeding',
  '/births',
  '/weaning',
  '/health',
  '/care',
  '/fattening',
  '/operations/inventory',
];

const QUERIES: Array<{ query: DocumentNode; variables?: Record<string, unknown> }> = [
  { query: ME_QUERY },
  { query: SUBSCRIPTION_STATUS },
  { query: FARM_STRUCTURE },
  { query: OPEN_TASKS_QUERY },
  { query: TASKS_QUERY, variables: { openOnly: true } },
  { query: CAGE_OPTIONS },
  { query: LOT_OPTIONS },
  { query: LITTER_OPTIONS },
  { query: BREED_OPTIONS },
  { query: BREEDERS_PAST },
  { query: RABBIT_OPTIONS, variables: { input: { pageSize: 200, status: 'ACTIVE' } } },
  { query: RABBIT_OPTIONS, variables: { input: { pageSize: 200, status: 'ACTIVE', sex: 'FEMALE' } } },
  { query: RABBIT_OPTIONS, variables: { input: { pageSize: 200, status: 'ACTIVE', sex: 'MALE' } } },
  { query: GET_RABBITS_PAGINATED, variables: { input: { page: 1, pageSize: 10, search: '', category: 'ADULT' } } },
  { query: GET_RABBITS_PAGINATED, variables: { input: { page: 1, pageSize: 60, search: '', category: 'KIT' } } },
];

let running = false;

export async function prefetchFieldData(client: ApolloClient, { force = false } = {}) {
  if (running || typeof window === 'undefined' || !navigator.onLine) return;
  try {
    const last = Number(window.localStorage.getItem(LAST_KEY) ?? 0);
    if (!force && Date.now() - last < EVERY_MS) return;
    window.localStorage.setItem(LAST_KEY, String(Date.now()));
  } catch {
    // Sans stockage, on précharge quand même.
  }
  running = true;
  try {
    // Une requête après l'autre, pour ne pas ralentir l'écran ouvert.
    for (const { query, variables } of QUERIES) {
      await client.query({ query, variables, fetchPolicy: 'network-only' }).catch(() => undefined);
    }
    navigator.serviceWorker?.controller?.postMessage({ type: 'precache', urls: FIELD_PAGES });
  } finally {
    running = false;
  }
}
