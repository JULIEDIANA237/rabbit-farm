import { ApolloLink, type FetchResult } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { print, type FieldNode, type OperationDefinitionNode } from 'graphql';
import { Observable } from 'rxjs';

import { getAccessToken } from './auth-storage';
import { currentAccount, markFresh, scheduleSave } from './offline-cache';

/**
 * Saisie hors connexion.
 *
 * Quand le téléphone n'a pas de réseau, une saisie (mutation GraphQL) est
 * gardée dans le navigateur puis envoyée dans l'ordre au retour de la
 * connexion. La saisie identique déjà en attente n'est pas ajoutée deux fois.
 */

export interface QueuedMutation {
  id: string;
  key: string;
  field: string;
  label: string;
  query: string;
  variables: Record<string, unknown>;
  createdAt: string;
  /** Compte qui a fait la saisie : elle n'est envoyée qu'avec ce compte. */
  account?: string | null;
  lastError?: string;
}

const STORAGE_KEY = 'rabbitfarm.offline-queue';
export const OFFLINE_QUEUE_EVENT = 'rabbitfarm:offline-queue';
export const OFFLINE_MESSAGE =
  'Pas de réseau : la saisie est gardée sur ce téléphone et sera envoyée automatiquement au retour de la connexion.';

/**
 * Gestes du terrain qu'on peut noter sans réseau. Les autres saisies
 * (ventes, dépenses, ajout de lapins, IA, paiement…) demandent le réseau.
 */
const LABELS: Record<string, string> = {
  createBreeding: 'Saillie',
  createPregnancyCheck: 'Palpation',
  recordNestInstallation: 'Pose du nid',
  createBirth: 'Mise bas',
  createWeaning: 'Sevrage',
  completeWeaning: 'Sevrage réalisé',
  createHealthRecord: 'Soin / observation',
  createCareRecord: 'Soin',
  recordLitterMortality: 'Mort dans une portée',
  recordRabbitExit: 'Sortie ou mort d’un lapin',
  createWeighing: 'Pesée',
  updateTask: 'Tâche faite',
  createStockMovement: 'Sortie de stock',
};

export const isOfflineField = (field: string) => field in LABELS;

export const ONLINE_ONLY_MESSAGE = 'Pas de réseau : cette action demande une connexion. Réessaie quand le réseau revient.';
export const NO_DATA_MESSAGE =
  'Pas de réseau, et cette page n’est pas encore enregistrée sur ce téléphone. Ouvre-la une fois avec du réseau.';
const ALREADY_RECEIVED = /déjà reçue/i;

export class OfflineUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OfflineUnavailableError';
  }
}

export class OfflineQueuedError extends Error {
  constructor() {
    super(OFFLINE_MESSAGE);
    this.name = 'OfflineQueuedError';
  }
}

function readQueue(): QueuedMutation[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QueuedMutation[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedMutation[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Stockage plein ou indisponible : rien de plus à faire.
  }
  window.dispatchEvent(new Event(OFFLINE_QUEUE_EVENT));
}

/** Saisies en attente du compte connecté. */
export function getQueue() {
  if (typeof window === 'undefined') return [];
  const account = currentAccount();
  return readQueue().filter((item) => !item.account || item.account === account);
}

export function removeFromQueue(id: string) {
  writeQueue(readQueue().filter((item) => item.id !== id));
}

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}-${Math.random().toString(16).slice(2, 10)}`;

/** Une saisie refusée par le serveur, à revoir par l'éleveur. */
export const needsReview = (item: QueuedMutation) => Boolean(item.lastError);

function enqueue(item: Omit<QueuedMutation, 'id' | 'createdAt'>) {
  const queue = readQueue();
  if (queue.some((queued) => queued.key === item.key)) return;
  queue.push({ ...item, id: newId(), account: currentAccount(), createdAt: new Date().toISOString() });
  writeQueue(queue);
}

const isNetworkFailure = (error: unknown) =>
  error instanceof TypeError || (error as { name?: string })?.name === 'TypeError' || /failed to fetch|network/i.test(String((error as Error)?.message));

/** Relit la réponse dans les données gardées sur le téléphone. */
function fromCache(operation: Parameters<ApolloLink.RequestHandler>[0]): FetchResult | null {
  try {
    const data = operation.client.cache.readQuery({ query: operation.query, variables: operation.variables });
    return data ? { data } : null;
  } catch {
    return null;
  }
}

const cachedOrError = (operation: Parameters<ApolloLink.RequestHandler>[0]) =>
  new Observable<FetchResult>((observer) => {
    const cached = fromCache(operation);
    if (cached) {
      observer.next(cached);
      observer.complete();
    } else {
      observer.error(new OfflineUnavailableError(NO_DATA_MESSAGE));
    }
  });

/**
 * Lien Apollo du hors ligne.
 * - Lecture : sans réseau (ou réseau qui lâche), réponse tirée des données gardées.
 * - Gestes du terrain : gardés dans une file d'attente, envoyés au retour du réseau.
 * - Autres saisies : refusées avec un message clair.
 */
export function createOfflineLink() {
  return new ApolloLink((operation, forward) => {
    if (typeof window === 'undefined') return forward(operation);
    const definition = getMainDefinition(operation.query) as OperationDefinitionNode;
    const field = (definition.selectionSet.selections[0] as FieldNode | undefined)?.name.value ?? '';
    const client = operation.client;
    const isQuery = definition.operation === 'query';
    const isMutation = definition.operation === 'mutation';
    const queueable = isMutation && isOfflineField(field);

    const item = {
      field,
      label: LABELS[field] ?? field,
      query: print(operation.query),
      variables: operation.variables as Record<string, unknown>,
      key: JSON.stringify([field, operation.variables]),
    };

    if (!navigator.onLine) {
      if (isQuery) return cachedOrError(operation);
      if (queueable) {
        enqueue(item);
        return new Observable<FetchResult>((observer) => observer.error(new OfflineQueuedError()));
      }
      if (isMutation) return new Observable<FetchResult>((observer) => observer.error(new OfflineUnavailableError(ONLINE_ONLY_MESSAGE)));
      return forward(operation);
    }

    return new Observable<FetchResult>((observer) => {
      let fallback: { unsubscribe: () => void } | undefined;
      const subscription = forward(operation).subscribe({
        next: (value) => {
          markFresh();
          scheduleSave(client);
          observer.next(value);
        },
        complete: () => observer.complete(),
        error: (error: unknown) => {
          if (!isNetworkFailure(error)) return observer.error(error);
          if (isQuery) {
            fallback = cachedOrError(operation).subscribe(observer);
          } else if (queueable) {
            enqueue(item);
            observer.error(new OfflineQueuedError());
          } else {
            observer.error(new OfflineUnavailableError(ONLINE_ONLY_MESSAGE));
          }
        },
      });
      return () => {
        subscription.unsubscribe();
        fallback?.unsubscribe();
      };
    });
  });
}

let flushing = false;

/**
 * Envoie les saisies en attente, dans l'ordre. Une saisie refusée par le
 * serveur (donnée invalide) reste dans la liste avec son erreur, pour que
 * l'éleveur la corrige ou la supprime.
 */
export async function flushQueue(graphqlUrl: string, { retryRefused = false } = {}): Promise<{ sent: number; failed: number }> {
  if (flushing || typeof window === 'undefined' || !navigator.onLine) return { sent: 0, failed: 0 };
  flushing = true;
  let sent = 0;
  let failed = 0;
  try {
    for (const item of readQueue()) {
      if (item.lastError && !retryRefused) continue;
      if (item.account && item.account !== currentAccount()) continue;
      const token = getAccessToken();
      if (!token) break; // Session fermée : la file attend la reconnexion.
      let response: Response;
      try {
        response = await fetch(graphqlUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Offline-Id': item.id },
          body: JSON.stringify({ query: item.query, variables: item.variables }),
        });
      } catch {
        break; // Toujours pas de réseau : on réessaiera plus tard.
      }
      const result = (await response.json().catch(() => null)) as {
        errors?: Array<{ message: string; extensions?: { code?: string } }>;
      } | null;
      const errors = result?.errors ?? [];
      if (errors.some((e) => e.extensions?.code === 'UNAUTHENTICATED' || /unauthorized/i.test(e.message))) break;
      if (!response.ok && !result) break; // Serveur injoignable : nouvel essai plus tard.
      const queue = readQueue();
      const alreadyReceived = errors.length > 0 && errors.every((e) => ALREADY_RECEIVED.test(e.message));
      if ((response.ok && result && errors.length === 0) || alreadyReceived) {
        writeQueue(queue.filter((queued) => queued.id !== item.id));
        sent += 1;
      } else {
        const message = result?.errors?.[0]?.message ?? `Erreur ${response.status}`;
        writeQueue(queue.map((queued) => (queued.id === item.id ? { ...queued, lastError: message } : queued)));
        failed += 1;
      }
    }
  } finally {
    flushing = false;
  }
  return { sent, failed };
}
