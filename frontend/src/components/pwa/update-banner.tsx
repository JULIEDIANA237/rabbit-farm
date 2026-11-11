'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

const CURRENT = process.env.NEXT_PUBLIC_BUILD_ID ?? 'dev';
const CHECK_EVERY_MS = 10 * 60_000;

/** Recharge l'application en récupérant la dernière version (service worker compris). */
export async function reloadApp() {
  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    await registration?.update();
  } catch {
    // Pas de service worker : un simple rechargement suffit.
  }
  window.location.reload();
}

/**
 * Bandeau « Nouvelle version disponible » : utile surtout sur téléphone,
 * où l'application installée n'a pas de bouton d'actualisation du navigateur.
 */
export function UpdateBanner() {
  const [available, setAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [reloading, setReloading] = useState(false);

  const check = useCallback(async () => {
    if (CURRENT === 'dev' || !navigator.onLine) return;
    try {
      const response = await fetch('/api/version', { cache: 'no-store' });
      if (!response.ok) return;
      const { version } = (await response.json()) as { version?: string };
      if (version && version !== CURRENT) setAvailable(true);
    } catch {
      // Hors ligne ou serveur indisponible : on réessaiera plus tard.
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(check, 5_000);
    const timer = setInterval(check, CHECK_EVERY_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void check();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [check]);

  if (!available || dismissed) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-40 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-slate-900 p-3 pl-4 text-sm text-white shadow-xl print:hidden lg:bottom-24"
    >
      <p className="flex-1">Une nouvelle version de l’application est disponible.</p>
      <button
        type="button"
        onClick={() => {
          setReloading(true);
          void reloadApp();
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 font-semibold text-white hover:bg-emerald-400"
      >
        <RefreshCw size={16} className={reloading ? 'animate-spin' : ''} />
        Actualiser
      </button>
      <button type="button" onClick={() => setDismissed(true)} aria-label="Plus tard" className="rounded-lg p-1 text-slate-300 hover:text-white">
        <X size={16} />
      </button>
    </div>
  );
}
