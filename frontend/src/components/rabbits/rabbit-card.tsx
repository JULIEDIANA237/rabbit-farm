'use client';

import Link from 'next/link';

import {
  CalendarDays,
  Scale,
  VenusAndMars,
} from 'lucide-react';

import type { Rabbit } from '@/types/rabbit';

import { RabbitPhoto } from './RabbitPhoto';

interface RabbitCardProps {
  rabbit: Rabbit;
}

export function RabbitCard({
  rabbit,
}: RabbitCardProps) {
  const primaryPhoto =
    rabbit.photos?.find(
      (photo) => photo.isPrimary,
    ) ?? rabbit.photos?.[0];

  const sex =
    rabbit.sex === 'MALE'
      ? 'Mâle'
      : rabbit.sex === 'FEMALE'
        ? 'Femelle'
        : 'Inconnu';

  return (
    <Link
      href={`/rabbits/${rabbit.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <RabbitPhoto
        photo={primaryPhoto}
        alt={`Lapin ${rabbit.code}`}
        size={260}
        className="!h-auto !w-full aspect-square rounded-none"
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900">
              {rabbit.code}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {sex}
            </p>
          </div>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {rabbit.status ?? 'ACTIF'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Scale size={14} />
            {rabbit.weight != null
              ? `${rabbit.weight} kg`
              : '—'}
          </div>

          <div className="flex items-center gap-1">
            <CalendarDays size={14} />

            {rabbit.birthDate
              ? new Date(
                  rabbit.birthDate,
                ).toLocaleDateString(
                  'fr-FR',
                )
              : '—'}
          </div>
        </div>
      </div>
    </Link>
  );
}