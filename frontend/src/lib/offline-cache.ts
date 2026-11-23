import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';

import { getAccessToken } from './auth-storage';

/**
 * Données gardées sur le téléphone.
 *
 * Le cache Apollo (les données déjà vues) est copié dans IndexedDB, une copie
 * par compte. Sans réseau, l'app relit cette copie au lieu d'afficher un
 * écran vide.
 */

const DB_NAME = 'rabbitfarm-offline';
const STORE = 'kv';
const SAVED_AT_KEY = 'rabbitfarm.offline-saved-at';
export const OFFLINE_CACHE_EVENT = 'rabbitfarm:offline-cache';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const request = action(db.transaction(STORE, mode).objectStore(STORE));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

/** Identifiant du compte connecté, ou null. */
export function currentAccount(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  try {
    return jwtDecode<{ sub?: string }>(token).sub ?? null;
  } catch {
    return null;
  }
}

/** Copie séparée par compte. */
function accountKey(): string | null {
  const account = currentAccount();
  return account ? `apollo:${account}` : null;
}

interface Snapshot {
  savedAt: string;
  data: NormalizedCacheObject;
}

/** Remet en mémoire la copie du compte connecté. */
export async function restoreCache(client: ApolloClient): Promise<void> {
  const key = accountKey();
  if (!key || typeof indexedDB === 'undefined') return;
  try {
    const snapshot = await run<Snapshot | undefined>('readonly', (store) => store.get(key));
    if (snapshot?.data) client.cache.restore(snapshot.data);
  } catch {
    // Stockage indisponible (navigation privée…) : l'app marche en ligne.
  }
}

let timer: ReturnType<typeof setTimeout> | undefined;

/** Enregistre la copie un peu après la dernière réponse du serveur. */
export function scheduleSave(client: ApolloClient) {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    const key = accountKey();
    if (!key) return;
    const snapshot: Snapshot = { savedAt: new Date().toISOString(), data: client.cache.extract() as NormalizedCacheObject };
    run('readwrite', (store) => store.put(snapshot, key)).catch(() => undefined);
  }, 1500);
}

/** Note l'heure de la dernière donnée reçue du serveur. */
export function markFresh() {
  try {
    window.localStorage.setItem(SAVED_AT_KEY, new Date().toISOString());
  } catch {
    // Rien à faire.
  }
}

export function lastFreshAt(): Date | null {
  try {
    const value = window.localStorage.getItem(SAVED_AT_KEY);
    return value ? new Date(value) : null;
  } catch {
    return null;
  }
}

/** Déconnexion : la copie du compte est effacée du téléphone. */
export async function clearOfflineCache() {
  const key = accountKey();
  clearTimeout(timer);
  try {
    window.localStorage.removeItem(SAVED_AT_KEY);
    if (key && typeof indexedDB !== 'undefined') await run('readwrite', (store) => store.delete(key));
  } catch {
    // Rien à faire.
  }
}
