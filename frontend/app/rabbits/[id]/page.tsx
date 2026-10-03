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

import { useQuery } from '@apollo/client/react';

import { GET_RABBIT } from '@/graphql/rabbits/queries';

import type {
  Rabbit,
} from '@/types/rabbit';

import { RabbitPhoto } from '@/components/rabbits/RabbitPhoto';
import { RabbitPhotoManager } from '@/components/rabbits/RabbitPhotoManager';

import { useRabbitPhotos } from '@/hooks/rabbits/useRabbitPhotos';

interface GetRabbitResponse {
  rabbit: Rabbit;
}

export default function RabbitDetailsPage() {
  const params = useParams();

  const id = String(params.id);

  const { data, loading, error, refetch } =
    useQuery<GetRabbitResponse>(
      GET_RABBIT,
      {
        variables: { id },
        skip: !id,
      },
    );

  const rabbit = data?.rabbit;

  const {
    uploadPhoto,
    deletePhoto,
    setPrimaryPhoto,
    uploading,
    deleting,
    settingPrimary,
  } = useRabbitPhotos(
    id,
    async () => {
      await refetch();
    },
  );

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        Chargement...
      </main>
    );
  }

  if (error || !rabbit) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-xl bg-red-50 p-4 text-red-700">
          Impossible de charger ce lapin.
          {error?.message}
        </div>
      </main>
    );
  }

  const primaryPhoto =
    rabbit.photos?.find(
      (photo) => photo.isPrimary,
    ) ?? rabbit.photos?.[0];

  const sexLabel =
    rabbit.sex === 'MALE'
      ? 'Mâle'
      : rabbit.sex === 'FEMALE'
        ? 'Femelle'
        : 'Sexe inconnu';

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/rabbits"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Lapins
        </Link>

        <Link
          href={`/rabbits/${rabbit.id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Edit size={17} />
          Modifier
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <RabbitPhoto
            photo={primaryPhoto}
            alt={`Lapin ${rabbit.code}`}
            size={250}
            className="mx-auto !h-auto !w-full aspect-square"
          />

          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              {rabbit.code}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {sexLabel}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Informations
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<VenusAndMars size={18} />}
                label="Sexe"
                value={sexLabel}
              />

              <InfoItem
                icon={<CalendarDays size={18} />}
                label="Date de naissance"
                value={
                  rabbit.birthDate
                    ? new Date(
                        rabbit.birthDate,
                      ).toLocaleDateString(
                        'fr-FR',
                      )
                    : 'Non renseignée'
                }
              />

              <InfoItem
                icon={<Scale size={18} />}
                label="Poids"
                value={
                  rabbit.weight != null
                    ? `${rabbit.weight} kg`
                    : 'Non renseigné'
                }
              />

              <InfoItem
                label="Couleur"
                value={
                  rabbit.color ??
                  'Non renseignée'
                }
              />
            </div>

            {rabbit.observations && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Observations
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {rabbit.observations}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <RabbitPhotoManager
              rabbitId={rabbit.id}
              photos={rabbit.photos ?? []}
              uploading={uploading}
              deleting={deleting}
              settingPrimary={settingPrimary}
              onUpload={uploadPhoto}
              onDelete={deletePhoto}
              onSetPrimary={setPrimaryPhoto}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      {icon && (
        <div className="text-emerald-600">
          {icon}
        </div>
      )}

      <div>
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}