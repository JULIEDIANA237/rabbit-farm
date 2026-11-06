'use client';

import { useEffect } from 'react';

/**
 * Enregistre le service worker (production uniquement,
 * pour ne pas gêner le rechargement à chaud en développement).
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);
  return null;
}
