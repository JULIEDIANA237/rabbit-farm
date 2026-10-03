'use client';

import {
  ArrowLeft,
  Loader2,
  Save,
} from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { useRabbit } from '@/hooks/rabbits/useRabbits';
import { useUpdateRabbit } from '@/hooks/rabbits/useUpdateRabbit';

import type {
  RabbitSex,
  RabbitStatus,
} from '@/types/rabbit';

import {
  getRabbitSexLabel,
  getRabbitStatusLabel,
} from '@/lib/rabbits/rabbit-labels';

interface EditRabbitPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRabbitPage({
  params,
}: EditRabbitPageProps) {
  const { id } = await params;

  return <EditRabbitForm rabbitId={id} />;
}

function EditRabbitForm({
  rabbitId,
}: {
  rabbitId: string;
}) {
  const router = useRouter();

  const {
    rabbit,
    loading: rabbitLoading,
    error: rabbitError,
  } = useRabbit(rabbitId);

  const {
    updateRabbit,
    loading: updating,
    error: updateError,
  } = useUpdateRabbit();

  const [code, setCode] = useState('');
  const [sex, setSex] =
    useState<RabbitSex>('UNKNOWN');

  const [status, setStatus] =
    useState<RabbitStatus>('ACTIVE');

  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [observations, setObservations] =
    useState('');

  const [initialized, setInitialized] =
    useState(false);

  if (rabbit && !initialized) {
    setCode(rabbit.code);
    setSex(rabbit.sex);
    setStatus(rabbit.status ?? 'ACTIVE');
    setColor(rabbit.color ?? '');
    setWeight(
      rabbit.weight != null
        ? String(rabbit.weight)
        : '',
    );
    setObservations(
      rabbit.observations ?? '',
    );

    setInitialized(true);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!rabbit) {
      return;
    }

    try {
      await updateRabbit({
        id: rabbit.id,
        code: code.trim(),
        sex,
        status,
        color: color.trim() || undefined,
        weight: weight
          ? Number(weight)
          : undefined,
        observations:
          observations.trim() || undefined,
      });

      router.push(`/rabbits/${rabbit.id}`);
      router.refresh();
    } catch {
      // L'erreur est exposée par updateError.
    }
  }

  if (rabbitLoading && !rabbit) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6 pb-28">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-96 rounded-2xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (rabbitError || !rabbit) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6 pb-28">
        <Link
          href="/rabbits"
          className="inline-flex items-center gap-2 text-sm text-slate-600"
        >
          <ArrowLeft size={16} />
          Retour aux lapins
        </Link>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Impossible de charger ce lapin.
          {rabbitError?.message && (
            <>
              <br />
              {rabbitError.message}
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 pb-28">
      <Link
        href={`/rabbits/${rabbit.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Retour à la fiche
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Modifier {rabbit.code}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Mettre à jour les informations du lapin.
        </p>
      </div>

      {updateError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Échec de la modification.
          <br />
          {updateError.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">
            Informations principales
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Code">
              <input
                value={code}
                onChange={(event) =>
                  setCode(event.target.value)
                }
                required
                className="input"
              />
            </Field>

            <Field label="Sexe">
              <select
                value={sex}
                onChange={(event) =>
                  setSex(
                    event.target.value as RabbitSex,
                  )
                }
                className="input"
              >
                <option value="UNKNOWN">
                  {getRabbitSexLabel('UNKNOWN')}
                </option>

                <option value="MALE">
                  {getRabbitSexLabel('MALE')}
                </option>

                <option value="FEMALE">
                  {getRabbitSexLabel('FEMALE')}
                </option>
              </select>
            </Field>

            <Field label="Statut">
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as RabbitStatus,
                  )
                }
                className="input"
              >
                {(
                  [
                    'ACTIVE',
                    'SOLD',
                    'DEAD',
                    'TRANSFERRED',
                    'ARCHIVED',
                  ] as RabbitStatus[]
                ).map((value) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {getRabbitStatusLabel(value)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Couleur">
              <input
                value={color}
                onChange={(event) =>
                  setColor(event.target.value)
                }
                className="input"
              />
            </Field>

            <Field label="Poids (kg)">
              <input
                type="number"
                step="0.01"
                min="0"
                value={weight}
                onChange={(event) =>
                  setWeight(event.target.value)
                }
                className="input"
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Observations">
              <textarea
                value={observations}
                onChange={(event) =>
                  setObservations(event.target.value)
                }
                rows={4}
                className="input resize-none"
              />
            </Field>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/rabbits/${rabbit.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={updating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updating ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {updating
              ? 'Enregistrement...'
              : 'Enregistrer'}
          </button>
        </div>
      </form>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}