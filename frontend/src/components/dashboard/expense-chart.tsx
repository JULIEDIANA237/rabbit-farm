'use client';

import { BarChart3 } from 'lucide-react';

interface Props {
  monthlyExpenses: number;
}

export function ExpenseChart({
  monthlyExpenses,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <BarChart3 size={20} />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">
            Dépenses
          </h2>

          <p className="text-sm text-slate-500">
            Dépenses enregistrées ce mois.
          </p>
        </div>
      </div>

      <div className="flex h-48 items-end justify-center">
        <div className="flex w-24 flex-col items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">
            {monthlyExpenses.toLocaleString('fr-FR')}
          </span>

          <div
            className="w-full rounded-t-xl bg-emerald-500 transition-all"
            style={{
              height: monthlyExpenses > 0 ? '120px' : '8px',
            }}
          />

          <span className="text-xs text-slate-500">
            Ce mois
          </span>
        </div>
      </div>
    </div>
  );
}