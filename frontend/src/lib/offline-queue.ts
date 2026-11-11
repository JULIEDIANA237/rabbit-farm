import { ApolloLink, type FetchResult } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { print, type FieldNode, type OperationDefinitionNode } from 'graphql';
import { Observable } from 'rxjs';

import { getAccessToken } from './auth-storage';

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
  lastError?: string;
}

const STORAGE_KEY = 'rabbitfarm.offline-queue';
export const OFFLINE_QUEUE_EVENT = 'rabbitfarm:offline-queue';
export const OFFLINE_MESSAGE =
  'Pas de réseau : la saisie est gardée sur ce téléphone et sera envoyée automatiquement au retour de la connexion.';

/** Saisies qui n'ont pas de sens hors ligne (connexion, IA, notifications…). */
const ONLINE_ONLY = new Set([
  'login',
  'register',
  'requestPasswordReset',
  'resetPassword',
  'askAssistant',
  'fillFormWithAi',
  'subscribePush',
  'unsubscribePush',
  'sendTestPush',
]);

const LABELS: Record<string, string> = {
  createRabbit: 'Nouveau lapin',
  updateRabbit: 'Modification d’un lapin',
  moveRabbit: 'Déplacement d’un lapin',
  recordRabbitExit: 'Sortie d’un lapin',
  createBreeding: 'Saillie',
  createPregnancyCheck: 'Palpation',
  recordNestInstallation: 'Pose du nid',
  createBirth: 'Mise bas',
  createWeaning: 'Sevrage',
  completeWeaning: 'Sevrage réalisé',
  createWeighing: 'Pesée',
  createHealthRecord: 'Soin / observation',
  createExpense: 'Dépense',
  createSale: 'Vente',
  addPayment: 'Paiement',
  createTask: 'Tâche',
  updateTask: 'Mise à jour d’une tâche',
  createStockMovement: 'Mouvement de stock',
  recordLitterMortality: 'Mortalité de portée',
};

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

export function getQueue() {
  return typeof window === 'undefined' ? [] : readQueue();
}

export function removeFromQueue(id: string) {
  writeQueue(readQueue().filter((item) => item.id !== id));
}

function enqueue(item: Omit<QueuedMutation, 'id' | 'createdAt'>) {
  const queue = readQueue();
  if (queue.some((queued) => queued.key === item.key)) return;
  queue.push({ ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() });
  writeQueue(queue);
}

const isNetworkFailure = (error: unknown) =>
  error instanceof TypeError || (error as { name?: string })?.name === 'TypeError' || /failed to fetch|network/i.test(String((error as Error)?.message));

/** Lien Apollo : met les saisies en file d'attente quand le réseau manque. */
export function createOfflineLink() {
  return new ApolloLink((operation, forward) => {
    const definition = getMainDefinition(operation.query) as OperationDefinitionNode;
    const field = (definition.selectionSet.selections[0] as FieldNode | undefined)?.name.value ?? '';
    const queueable = definition.operation === 'mutation' && !ONLINE_ONLY.has(field) && typeof window !== 'undefined';
    if (!queueable) return forward(operation);

    const item = {
      field,
      label: LABELS[field] ?? field,
      query: print(operation.query),
      variables: operation.variables as Record<string, unknown>,
      key: JSON.stringify([field, operation.variables]),
    };

    if (!navigator.onLine) {
      enqueue(item);
      return new Observable<FetchResult>((observer) => observer.error(new OfflineQueuedError()));
    }

    return new Observable<FetchResult>((observer) => {
      const subscription = forward(operation).subscribe({
        next: (value) => observer.next(value),
        complete: () => observer.complete(),
        error: (error: unknown) => {
          if (isNetworkFailure(error)) {
            enqueue(item);
            observer.error(new OfflineQueuedError());
          } else {
            observer.error(error);
          }
        },
      });
      return () => subscription.unsubscribe();
    });
  });
}

let flushing = false;

/**
 * Envoie les saisies en attente, dans l'ordre. Une saisie refusée par le
 * serveur (donnée invalide) reste dans la liste avec son erreur, pour que
 * l'éleveur la corrige ou la supprime.
 */
export async function flushQueue(graphqlUrl: string): Promise<{ sent: number; failed: number }> {
  if (flushing || typeof window === 'undefined' || !navigator.onLine) return { sent: 0, failed: 0 };
  flushing = true;
  let sent = 0;
  let failed = 0;
  try {
    for (const item of readQueue()) {
      const token = getAccessToken();
      let response: Response;
      try {
        response = await fetch(graphqlUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ query: item.query, variables: item.variables }),
        });
      } catch {
        break; // Toujours pas de réseau : on réessaiera plus tard.
      }
      const result = (await response.json().catch(() => null)) as { errors?: Array<{ message: string }> } | null;
      const queue = readQueue();
      if (response.ok && result && !result.errors?.length) {
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
