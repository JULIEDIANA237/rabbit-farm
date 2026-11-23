'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useApolloClient } from '@apollo/client/react';

import { restoreCache } from '@/lib/offline-cache';
import { prefetchFieldData } from '@/lib/offline-prefetch';

let restoring: Promise<void> | null = null;

/**
 * Remet en mémoire les données gardées sur le téléphone avant le premier
 * écran de l'app, puis précharge les écrans du terrain quand le réseau est là.
 */
export function OfflineCacheGate({ children }: { children: ReactNode }) {
  const client = useApolloClient();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
    };
    // Au plus 1,5 s d'attente : un stockage lent ne bloque pas l'app.
    const timer = window.setTimeout(finish, 1500);
    restoring ??= restoreCache(client);
    void restoring.finally(() => {
      window.clearTimeout(timer);
      finish();
    });
    return () => window.clearTimeout(timer);
  }, [client]);

  useEffect(() => {
    if (!ready) return;
    const prefetch = () => void prefetchFieldData(client);
    const first = window.setTimeout(prefetch, 4000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') prefetch();
    };
    window.addEventListener('online', prefetch);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(first);
      window.removeEventListener('online', prefetch);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [client, ready]);

  return ready ? <>{children}</> : null;
}

/** Après une déconnexion, le compte suivant relira sa propre copie. */
export function resetOfflineRestore() {
  restoring = null;
}
