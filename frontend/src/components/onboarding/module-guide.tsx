'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Lightbulb, Sparkles, X } from 'lucide-react';

import { useAssistantEnabled } from '@/lib/assistant';

import { guideFor } from './guides';

/** Ouvre l'assistant IA avec une question déjà posée. */
export const ASK_ASSISTANT_EVENT = 'rabbitfarm:ask-assistant';
/** Réaffiche la bulle d'aide de la page (bouton « ? » de l'en-tête). */
export const SHOW_GUIDE_EVENT = 'rabbitfarm:show-guide';

const storageKey = (key: string) => `rabbitfarm:guide-seen:${key}`;

function seen(key: string) {
  try {
    return window.localStorage.getItem(storageKey(key)) === '1';
  } catch {
    return false;
  }
}

function markSeen(key: string) {
  try {
    window.localStorage.setItem(storageKey(key), '1');
  } catch {
    // Stockage indisponible : la bulle réapparaîtra, sans gravité.
  }
}

export function askAssistant(question: string) {
  window.dispatchEvent(new CustomEvent(ASK_ASSISTANT_EVENT, { detail: { question } }));
}

/**
 * Bulle d'aide affichée en haut d'un module à la première visite,
 * avec un bouton pour demander plus d'explications à l'assistant IA.
 */
export function ModuleGuide() {
  const pathname = usePathname();
  const guide = guideFor(pathname);
  const assistantEnabled = useAssistantEnabled();
  const [visibleKey, setVisibleKey] = useState<string | null>(null);

  useEffect(() => {
    // Lu après le montage : localStorage n'existe pas côté serveur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleKey(guide && !seen(guide.key) ? guide.key : null);
  }, [guide]);

  useEffect(() => {
    const show = () => guide && setVisibleKey(guide.key);
    window.addEventListener(SHOW_GUIDE_EVENT, show);
    return () => window.removeEventListener(SHOW_GUIDE_EVENT, show);
  }, [guide]);

  if (!guide || visibleKey !== guide.key) return null;

  const close = () => {
    markSeen(guide.key);
    setVisibleKey(null);
  };

  return (
    <aside
      role="note"
      aria-label={`Aide : ${guide.title}`}
      className="relative mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 pr-10 text-sm text-emerald-950 shadow-sm"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Fermer l’aide"
        className="absolute right-2 top-2 rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-100"
      >
        <X size={16} />
      </button>
      <p className="flex items-center gap-2 font-semibold">
        <Lightbulb size={18} className="shrink-0 text-amber-500" /> {guide.title}
      </p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-emerald-900">
        {guide.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={close}
          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          J&apos;ai compris
        </button>
        {assistantEnabled && <button
          type="button"
          onClick={() => askAssistant(guide.question)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
        >
          <Sparkles size={14} /> Demander à l&apos;assistant
        </button>}
      </div>
    </aside>
  );
}
