'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  Edit,
  Scale,
  VenusAndMars,
} from 'lucide-react';

import { useRabbit } from '@/hooks/rabbits/useRabbits';
import { RabbitPhotoManager } from '@/components/rabbits/RabbitPhotoManager';
import { RabbitLifecycle } from '@/components/rabbits/RabbitLifecycle';
import { PURPOSE, RABBIT_STATUS, label } from '@/lib/labels';

function sexLabel(sex: string) {
  switch (sex) {
    case 'MALE':
      return 'Mâle';

    case 'FEMALE':
      return 'Femelle';

    case 'UNKNOWN':
      return 'Sexe inconnu';

    default:
      return sex;
  }
}

export default function RabbitDetailsPage() {
  const params = useParams();

  const id = String(params.id);

  const {
    rabbit,
    loading,
    error,
    refetch,
  } = useRabbit(id);

  if (loading && !rabbit) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200" />

        <div className="mt-6 h-96 animate-pulse rounded-2xl bg-slate-100" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          Impossible de charger le lapin.
          <p className="mt-2 text-sm">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  if (!rabbit) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-2xl bg-slate-100 p-8 text-center">
          Lapin introuvable.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/rabbits"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft size={18} />

          <span className="hidden sm:inline">
            Retour aux lapins
          </span>
        </Link>

        <Link
          href={`/rabbits/${rabbit.id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Edit size={16} />
          Modifier
        </Link>
      </div>

      <header className="mb-6">
        <p className="text-sm font-medium text-emerald-600">
          Fiche lapin
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          {rabbit.code}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {sexLabel(rabbit.sex)}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <RabbitPhotoManager
          rabbitId={rabbit.id}
          photos={rabbit.photos ?? []}
          onChanged={() => {
            void refetch();
          }}
        />

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 font-semibold text-slate-900">
            Informations
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={<VenusAndMars size={18} />}
              label="Sexe"
              value={sexLabel(rabbit.sex)}
            />

            <InfoCard
              icon={<Scale size={18} />}
              label="Poids"
              value={
                rabbit.weight != null
                  ? `${rabbit.weight} kg`
                  : 'Non renseigné'
              }
            />

            <InfoCard
              icon={<CalendarDays size={18} />}
              label="Naissance"
              value={
                rabbit.birthDate
                  ? new Date(
                      rabbit.birthDate,
                    ).toLocaleDateString('fr-FR')
                  : 'Non renseignée'
              }
            />

            <InfoCard
              label="Couleur"
              value={
                rabbit.color ?? 'Non renseignée'
              }
            />

            <InfoCard label="Statut" value={label(RABBIT_STATUS, rabbit.status)} />
            <InfoCard label="Destination" value={label(PURPOSE, rabbit.purpose)} />
            <InfoCard label="Race" value={rabbit.breedName ?? 'Non renseignée'} />
            <InfoCard label="Cage actuelle" value={rabbit.currentCageCode ?? 'Aucune'} />
            {rabbit.originalCode && <InfoCard label="Code d'origine" value={rabbit.originalCode} />}
            {rabbit.exitDate && (
              <InfoCard
                label="Sortie"
                value={`${new Date(rabbit.exitDate).toLocaleDateString('fr-FR')}${rabbit.exitCause ? ` · ${rabbit.exitCause}` : ''}`}
              />
            )}
          </div>

          {rabbit.observations && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Observations
              </p>

              <p className="mt-2 text-sm text-slate-700">
                {rabbit.observations}
              </p>
            </div>
          )}
        </section>
      </div>

      <RabbitLifecycle rabbitId={rabbit.id} active={rabbit.status === 'ACTIVE'} />
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}