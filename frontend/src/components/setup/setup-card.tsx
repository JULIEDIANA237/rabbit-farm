'use client';

import Link from 'next/link';
import { Camera, CheckCircle2, Circle, Rocket } from 'lucide-react';

import { useFarmSetup } from '@/lib/setup';

/** « Ta ferme est prête à X % » : les étapes de démarrage, la prochaine mise en avant. */
export function SetupCard() {
  const { setup } = useFarmSetup();
  if (!setup || setup.percent >= 100) return null;
  const next = setup.steps.find((s) => !s.done);

  return (
    <section className="min-w-0 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2">
        <Rocket size={18} className="text-emerald-700" />
        <h2 className="font-semibold text-slate-900">Ta ferme est prête à {setup.percent} %</h2>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={setup.percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${Math.max(4, setup.percent)}%` }} />
      </div>

      {next && (
        <div className="mt-4 rounded-xl bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Prochaine étape</p>
          <p className="mt-1 font-semibold text-slate-900">{next.title}</p>
          <p className="text-sm text-slate-600">{next.detail}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={next.href} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              On le fait maintenant
            </Link>
            {next.altHref && (
              <Link href={next.altHref} className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">
                <Camera size={16} /> {next.altLabel}
              </Link>
            )}
          </div>
        </div>
      )}

      <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
        {setup.steps.map((s) => (
          <li key={s.key} className="flex min-w-0 items-center gap-2">
            {s.done ? <CheckCircle2 size={16} className="shrink-0 text-emerald-600" /> : <Circle size={16} className="shrink-0 text-slate-300" />}
            {s.done ? (
              <span className="truncate text-slate-500 line-through">{s.title}</span>
            ) : (
              <Link href={s.href} className="truncate text-slate-800 hover:text-emerald-700 hover:underline">{s.title}</Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
