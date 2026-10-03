'use client';

import { Scale } from 'lucide-react';

import type { DashboardWeaning } from '@/types/dashboard.types';

interface Props {
  weanings: DashboardWeaning[];
}

export function WeaningCard({ weanings }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Scale size={20} />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">
            Sevrages planifiés
          </h2>

          <p className="text-sm text-slate-500">
            Prochains lots à sevrer.
          </p>
        </div>
      </div>

      {weanings.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500">
          Aucun sevrage planifié.
        </div>
      ) : (
        <div className="space-y-3">
          {weanings.slice(0, 6).map((weaning) => (
            <div
              key={weaning.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
            >
              <div>
                <p className="text-sm font-semibold">
                  Lot {weaning.litterId.slice(0, 8)}
                </p>

                <p className="text-xs text-slate-500">
                  {new Date(
                    weaning.plannedDate,
                  ).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-violet-600">
                  {weaning.quantity} lapins
                </p>

                {weaning.averageWeight != null && (
                  <p className="text-xs text-slate-500">
                    {weaning.averageWeight.toFixed(2)} kg
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}