'use client';

import { useState, type RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, X } from 'lucide-react';

import { downloadPdf } from '@/lib/export-pdf';

/** Barre d'un document (fiche, reçu) : retour, téléchargement PDF, fermeture. */
export function PrintToolbar({
  sheet,
  filename,
  fallbackHref,
}: {
  sheet: RefObject<HTMLElement | null>;
  filename?: string;
  fallbackHref: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const close = () => (window.history.length > 1 ? router.back() : router.push(fallbackHref));

  return (
    <div data-pdf-hidden className="mb-6 flex flex-wrap items-center justify-between gap-2 print:hidden">
      <button
        type="button"
        onClick={close}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
      >
        <ArrowLeft size={16} /> Retour
      </button>
      <div className="flex gap-2">
        {filename && (
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              if (!sheet.current) return;
              setBusy(true);
              setError(null);
              try {
                await downloadPdf(sheet.current, filename);
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Le PDF n’a pas pu être créé.');
              } finally {
                setBusy(false);
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            <Download size={16} /> {busy ? 'Préparation…' : 'Télécharger en PDF'}
          </button>
        )}
        <button type="button" onClick={close} aria-label="Fermer" title="Fermer" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
          <X size={20} />
        </button>
      </div>
      {error && <p className="w-full text-sm text-red-700">{error}</p>}
    </div>
  );
}
