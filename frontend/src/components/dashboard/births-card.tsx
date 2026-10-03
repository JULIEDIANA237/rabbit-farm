'use client';

import { Baby, CalendarDays } from 'lucide-react';

import type { DashboardBirth } from '@/types/dashboard.types';

interface Props {
  recentBirths: DashboardBirth[];
  expectedBirths: DashboardBirth[];
}

export function BirthsCard({
  recentBirths,
  expectedBirths,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
          <Baby size={20} />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">
            Naissances
          </h2>

          <p className="text-sm text-slate-500">
            Suivi des mises bas.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recentBirths.slice(0, 5).map((birth) => (
          <div
            key={birth.id}
            className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
          >
            <div>
              <p className="text-sm font-semibold">
                Femelle {birth.femaleCode}
              </p>

              <p className="text-xs text-slate-500">
                {new Date(
                  birth.birthDate,
                ).toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-emerald-600">
                {birth.liveBorn} vivants
              </p>

              <p className="text-xs text-slate-400">
                {birth.stillBorn} mort-nés
              </p>
            </div>
          </div>
        ))}

        {expectedBirths.slice(0, 3).map((birth) => (
          <div
            key={`expected-${birth.id}`}
            className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3"
          >
            <CalendarDays
              size={18}
              className="text-blue-600"
            />

            <div>
              <p className="text-sm font-semibold">
                Mise bas prévue — {birth.femaleCode}
              </p>

              <p className="text-xs text-slate-500">
                {new Date(
                  birth.birthDate,
                ).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}