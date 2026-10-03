'use client';

import type { Rabbit } from '@/types/rabbit';

import { RabbitCard } from './rabbit-card';

interface RabbitListProps {
  rabbits: Rabbit[];
  loading?: boolean;
}

export function RabbitList({
  rabbits,
  loading = false,
}: RabbitListProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map(
          (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-square animate-pulse bg-slate-100" />

              <div className="space-y-3 p-4">
                <div className="h-5 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ),
        )}
      </div>
    );
  }

  if (rabbits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <p className="font-semibold text-slate-700">
          Aucun lapin enregistré.
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Commencez par ajouter votre premier
          lapin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rabbits.map((rabbit) => (
        <RabbitCard
          key={rabbit.id}
          rabbit={rabbit}
        />
      ))}
    </div>
  );
}