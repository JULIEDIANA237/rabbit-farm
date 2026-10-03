'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

import { useCreateRabbit } from '@/hooks/rabbits/useCreateRabbit';
import type {
  CreateRabbitInput,
  RabbitSex,
} from '@/types/rabbit';

export function RabbitForm() {
  const router = useRouter();

  const { createRabbit, loading, error } = useCreateRabbit();

  const [form, setForm] = useState<CreateRabbitInput>({
    code: '',
    sex: 'FEMALE',
    birthDate: '',
    color: '',
    weight: undefined,
    observations: '',
  });

  const updateField = <K extends keyof CreateRabbitInput>(
    field: K,
    value: CreateRabbitInput[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.code.trim()) {
      return;
    }

    try {
      const input: CreateRabbitInput = {
        ...form,
        code: form.code.trim(),
        birthDate: form.birthDate || undefined,
        color: form.color || undefined,
        observations: form.observations || undefined,
        weight:
          form.weight !== undefined &&
          !Number.isNaN(form.weight)
            ? Number(form.weight)
            : undefined,
      };

      await createRabbit(input);

      router.push('/rabbits');
      router.refresh();
    } catch {
      // L'erreur Apollo est exposée par le hook.
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 pb-28">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600"
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900">
            Nouveau lapin
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Ajoutez un lapin à votre cheptel.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Code *
              </label>

              <input
                value={form.code}
                onChange={(event) =>
                  updateField('code', event.target.value)
                }
                placeholder="Ex : F03"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Sexe *
              </label>

              <select
                value={form.sex}
                onChange={(event) =>
                  updateField(
                    'sex',
                    event.target.value as RabbitSex,
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="FEMALE">Femelle</option>
                <option value="MALE">Mâle</option>
                <option value="UNKNOWN">Sexe Inconnu</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date de naissance
              </label>

              <input
                type="date"
                value={form.birthDate ?? ''}
                onChange={(event) =>
                  updateField('birthDate', event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Poids (kg)
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                value={form.weight ?? ''}
                onChange={(event) =>
                  updateField(
                    'weight',
                    event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  )
                }
                placeholder="Ex : 4.2"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Type génétique
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Couleur
              </label>

              <input
                value={form.color ?? ''}
                onChange={(event) =>
                  updateField('color', event.target.value)
                }
                placeholder="Ex : Blanc"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Observations
            </label>

            <textarea
              value={form.observations ?? ''}
              onChange={(event) =>
                updateField(
                  'observations',
                  event.target.value,
                )
              }
              rows={4}
              placeholder="Informations complémentaires..."
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />

              {loading
                ? 'Création...'
                : 'Créer le lapin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}