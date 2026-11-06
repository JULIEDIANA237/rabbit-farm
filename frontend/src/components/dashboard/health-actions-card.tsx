'use client';

import Link from 'next/link';
import { Syringe } from 'lucide-react';

import type { DashboardHealthAction } from '@/types/dashboard.types';
import { HEALTH_TYPE, label } from '@/lib/labels';
import { formatDate } from '@/lib/format';

export function HealthActionsCard({ actions }: { actions: DashboardHealthAction[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Syringe size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Traitements et vaccins</h2>
          <p className="text-sm text-slate-500">Échéances des 7 prochains jours</p>
        </div>
      </div>

      {actions.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun soin prévu.</p>
      ) : (
        <ul className="space-y-2">
          {actions.slice(0, 6).map((a) => (
            <li key={a.id}>
              <Link
                href={`/rabbits/${a.rabbitId}`}
                className={`flex items-center justify-between rounded-xl p-3 text-sm ${
                  a.overdue ? 'bg-red-50' : 'bg-slate-50'
                }`}
              >
                <span>
                  <strong>{a.rabbitCode}</strong> · {label(HEALTH_TYPE, a.type)} · {a.label}
                </span>
                <span className={a.overdue ? 'font-semibold text-red-600' : 'text-slate-500'}>
                  {formatDate(a.dueDate)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
