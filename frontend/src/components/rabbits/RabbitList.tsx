import Link from 'next/link';

import type { Rabbit } from '@/types/rabbit';
import { RabbitAvatar } from './RabbitAvatar';

interface RabbitListProps {
  rabbits: Rabbit[];
  loading?: boolean;
}

export function RabbitList({
  rabbits,
  loading,
}: RabbitListProps) {
  if (loading) {
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (!rabbits.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
        <p className="font-semibold text-slate-800">
          Aucun lapin
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Commencez par enregistrer votre premier lapin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {rabbits.map((rabbit) => (
        <Link
          key={rabbit.id}
          href={`/rabbits/${rabbit.id}`}
          className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
        >
          <RabbitAvatar
            photos={rabbit.photos}
            size="md"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-semibold text-slate-900">
                {rabbit.code}
              </h3>

              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                {rabbit.sex === 'MALE'
                  ? 'Mâle'
                  : rabbit.sex === 'FEMALE'
                    ? 'Femelle'
                    : 'Inconnu'}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {rabbit.weight != null
                ? `${rabbit.weight} kg`
                : 'Poids non renseigné'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}