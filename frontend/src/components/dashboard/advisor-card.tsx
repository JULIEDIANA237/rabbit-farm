'use client';

import Link from 'next/link';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { CalendarClock, ChevronRight, Lightbulb, ListTodo } from 'lucide-react';
import type { ReactNode } from 'react';

export const FARM_SUGGESTIONS = gql`
  query FarmSuggestions {
    farmSuggestions { key kind title detail href actionLabel tone }
  }
`;

interface Suggestion {
  key: string;
  kind: 'TODO' | 'PLAN' | 'IDEA';
  title: string;
  detail?: string | null;
  href: string;
  actionLabel: string;
  tone: 'info' | 'warning' | 'danger' | 'success';
}

const TONES: Record<Suggestion['tone'], string> = {
  info: 'border-sky-100 bg-sky-50/60',
  warning: 'border-amber-200 bg-amber-50/70',
  danger: 'border-red-200 bg-red-50/70',
  success: 'border-emerald-200 bg-emerald-50/70',
};

const GROUPS: { kind: Suggestion['kind']; title: string; icon: ReactNode }[] = [
  { kind: 'TODO', title: 'À faire', icon: <ListTodo size={16} className="text-emerald-700" /> },
  { kind: 'PLAN', title: 'À prévoir', icon: <CalendarClock size={16} className="text-amber-700" /> },
  { kind: 'IDEA', title: 'Suggestions', icon: <Lightbulb size={16} className="text-violet-700" /> },
];

/** Assistant d'élevage : ce qu'il faut faire, prévoir, et quelques idées. */
export function AdvisorCard() {
  const { data, loading, error, refetch } = useQuery<{ farmSuggestions: Suggestion[] }>(FARM_SUGGESTIONS, {
    fetchPolicy: 'cache-and-network',
  });
  const items = data?.farmSuggestions ?? [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-1 font-semibold text-slate-900">Ton assistant d&apos;élevage</h2>
      <p className="mb-4 text-sm text-slate-500">Ce que l&apos;app te propose aujourd&apos;hui, d&apos;après tes données.</p>
      {!data && loading && <p className="text-sm text-slate-500">L&apos;assistant analyse ta ferme…</p>}
      {error && !data && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
          L&apos;assistant n&apos;a pas pu analyser ta ferme ({error.message}).{' '}
          <button type="button" className="font-medium underline" onClick={() => void refetch()}>
            Réessayer
          </button>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-3">
        {GROUPS.map((g) => {
          const list = items.filter((s) => s.kind === g.kind);
          if (list.length === 0) return null;
          return (
            <div key={g.kind} className="min-w-0 space-y-2">
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                {g.icon} {g.title}
                <span className="rounded-full bg-slate-100 px-2 text-xs text-slate-600">{list.length}</span>
              </h3>
              <ul className="space-y-2">
                {list.map((s) => (
                  <li key={s.key} className={`rounded-xl border p-3 text-sm ${TONES[s.tone] ?? TONES.info}`}>
                    <p className="font-medium text-slate-900">{s.title}</p>
                    {s.detail && <p className="mt-0.5 text-slate-600">{s.detail}</p>}
                    <Link href={s.href} className="mt-2 inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline">
                      {s.actionLabel} <ChevronRight size={14} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
