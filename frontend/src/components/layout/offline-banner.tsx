'use client';

import { useCallback, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { CloudOff, RefreshCw, Trash2, UploadCloud } from 'lucide-react';

import { graphqlUrl } from '@/lib/apollo-client';
import { flushQueue, getQueue, OFFLINE_QUEUE_EVENT, removeFromQueue, type QueuedMutation } from '@/lib/offline-queue';

/**
 * Bandeau hors connexion : signale l'absence de réseau, liste les saisies
 * en attente et les envoie au retour de la connexion.
 */
export function OfflineBanner() {
  const client = useApolloClient();
  const [online, setOnline] = useState(true);
  const [queue, setQueue] = useState<QueuedMutation[]>([]);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const flush = useCallback(async () => {
    if (!navigator.onLine || getQueue().length === 0) return;
    setSending(true);
    const { sent, failed } = await flushQueue(graphqlUrl);
    setSending(false);
    if (sent > 0) {
      setNotice(`${sent} saisie${sent > 1 ? 's' : ''} hors connexion envoyée${sent > 1 ? 's' : ''}.`);
      await client.refetchQueries({ include: 'active' }).catch(() => undefined);
    }
    if (failed > 0) setOpen(true);
  }, [client]);

  useEffect(() => {
    const sync = () => {
      setOnline(navigator.onLine);
      setQueue(getQueue());
    };
    const goOnline = () => {
      sync();
      void flush();
    };
    // Premier passage juste après l'affichage (envoie ce qui attend déjà).
    const initial = window.setTimeout(goOnline, 0);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', sync);
    window.addEventListener(OFFLINE_QUEUE_EVENT, sync);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', sync);
      window.removeEventListener(OFFLINE_QUEUE_EVENT, sync);
    };
  }, [flush]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (online && queue.length === 0 && !notice) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 md:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-3 gap-y-1">
        {!online ? (
          <span className="inline-flex items-center gap-2 font-medium">
            <CloudOff size={16} /> Hors connexion : tes saisies sont gardées sur ce téléphone.
          </span>
        ) : notice && queue.length === 0 ? (
          <span className="inline-flex items-center gap-2 font-medium text-emerald-800">
            <UploadCloud size={16} /> {notice}
          </span>
        ) : null}

        {queue.length > 0 && (
          <>
            <button type="button" onClick={() => setOpen((value) => !value)} className="font-semibold underline">
              {queue.length} saisie{queue.length > 1 ? 's' : ''} en attente d’envoi
            </button>
            {online && (
              <button
                type="button"
                onClick={() => void flush()}
                disabled={sending}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-60"
              >
                <RefreshCw size={13} className={sending ? 'animate-spin' : undefined} /> Envoyer maintenant
              </button>
            )}
          </>
        )}
      </div>

      {open && queue.length > 0 && (
        <ul className="mx-auto mt-2 max-w-[1600px] space-y-1">
          {queue.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 rounded-lg bg-white/70 px-3 py-2">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-amber-800">
                  Saisi le {new Date(item.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                  {item.lastError ? ` · refusé : ${item.lastError}` : ''}
                </p>
              </div>
              <button
                type="button"
                aria-label="Supprimer cette saisie"
                onClick={() => {
                  if (window.confirm('Supprimer cette saisie en attente ?')) removeFromQueue(item.id);
                }}
                className="rounded-lg p-1.5 text-red-700 hover:bg-red-50"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
