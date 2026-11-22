'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Stethoscope } from 'lucide-react';

import { ErrorBox, Input, Loading, PageHeader } from '@/components/ui/kit';
import { ADVICE_SHEETS, type AdviceSheet } from '@/components/companion/companion';

const TOPICS = ['Santé', 'Lapereaux', 'Reproduction', 'Croissance', 'Ferme'];

export default function AdvicePage() {
  const { data, loading, error, refetch } = useQuery<{ adviceSheets: AdviceSheet[] }>(ADVICE_SHEETS, { fetchPolicy: 'cache-first' });
  const [search, setSearch] = useState('');

  // Lien depuis une question (/advice#chaleur) : ouvre et montre la fiche.
  useEffect(() => {
    const key = decodeURIComponent(window.location.hash.slice(1));
    if (!key || !data) return;
    requestAnimationFrame(() => {
      const sheet = document.getElementById(key);
      if (sheet instanceof HTMLDetailsElement) sheet.open = true;
      sheet?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [data]);

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = (data?.adviceSheets ?? []).filter(
      (a) => !q || [a.title, a.summary, ...a.signs, ...a.actions].some((t) => t.toLowerCase().includes(q)),
    );
    return TOPICS.map((topic) => ({ topic, sheets: list.filter((a) => a.topic === topic) })).filter((g) => g.sheets.length > 0);
  }, [data, search]);

  return (
    <div>
      <PageHeader
        eyebrow="Mon assistant"
        title="Fiches conseils"
        description="Les bons gestes, en bref. Pour un traitement, demande toujours conseil à un vétérinaire."
      />
      <div className="mb-5 max-w-md">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Chercher : diarrhée, chaleur, nid…" aria-label="Chercher une fiche" />
      </div>
      {error && !data && <ErrorBox error={error} onRetry={() => refetch()} />}
      {!data && loading && <Loading />}
      <div className="space-y-6">
        {groups.map((g) => (
          <section key={g.topic}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{g.topic}</h2>
            <div className="space-y-2">
              {g.sheets.map((a) => (
                <details
                  key={a.key}
                  id={a.key}
                  className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm open:border-emerald-300"
                >
                  <summary className="cursor-pointer list-none">
                    <p className="font-semibold text-slate-900">{a.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{a.summary}</p>
                  </summary>
                  <div className="mt-3 space-y-3 text-sm">
                    {a.signs.length > 0 && (
                      <div>
                        <p className="font-medium text-slate-800">Ce qu’on observe</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-slate-700">
                          {a.signs.map((s) => <li key={s}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-800">Que faire</p>
                      <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-slate-700">
                        {a.actions.map((s) => <li key={s}>{s}</li>)}
                      </ol>
                    </div>
                    {a.vet && (
                      <p className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-red-800">
                        <Stethoscope size={16} className="mt-0.5 shrink-0" /> <span><strong>Vétérinaire :</strong> {a.vet}</span>
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
