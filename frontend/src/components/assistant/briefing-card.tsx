'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/kit';
import { DAILY_BRIEFING, useAssistantEnabled } from '@/lib/assistant';

interface BriefingItem {
  key: string;
  label: string;
  count: number;
  href: string;
  tone: 'info' | 'warning' | 'danger' | 'success';
}

const TONES: Record<BriefingItem['tone'], string> = {
  info: 'bg-sky-50 text-sky-800 ring-sky-100',
  warning: 'bg-amber-50 text-amber-800 ring-amber-100',
  danger: 'bg-red-50 text-red-800 ring-red-100',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
};

/** Point du jour : calculé par l'app, résumé par l'IA à la demande. */
export function BriefingCard() {
  const aiEnabled = useAssistantEnabled();
  const [withSummary, setWithSummary] = useState(false);
  const { data, loading } = useQuery<{
    dailyBriefing: { date: string; summary?: string | null; items: BriefingItem[] };
  }>(DAILY_BRIEFING, { variables: { withSummary }, fetchPolicy: 'cache-and-network' });

  const briefing = data?.dailyBriefing;
  const items = briefing?.items ?? [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-slate-900">Point du jour</h2>
        {aiEnabled && items.length > 0 && !briefing?.summary && (
          <Button variant="secondary" loading={withSummary && loading} onClick={() => setWithSummary(true)}>
            <Sparkles size={16} className="text-violet-600" /> Résumer avec l&apos;IA
          </Button>
        )}
      </div>

      {briefing?.summary && (
        <p className="mb-3 rounded-xl bg-violet-50 p-3 text-sm text-violet-900">
          <Sparkles size={14} className="mr-1 inline text-violet-600" />
          {briefing.summary}
        </p>
      )}

      {!briefing && loading ? (
        <p className="text-sm text-slate-500">Calcul du point du jour…</p>
      ) : items.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 size={18} /> Rien d&apos;urgent aujourd&apos;hui. Bon travail !
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.key}>
              <Link href={item.href} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ring-1 ${TONES[item.tone] ?? TONES.info}`}>
                {item.label}
                <ChevronRight size={16} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
