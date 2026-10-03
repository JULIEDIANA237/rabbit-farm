'use client';

import { useState } from 'react';

import {
  Check,
  Loader2,
  Mars,
  Venus,
} from 'lucide-react';

import { useUpdateRabbit } from '@/hooks/rabbits/useUpdateRabbit';

import type { RabbitSex } from '@/types/rabbit';

interface DetermineSexActionProps {
  rabbitId: string;
}

export function DetermineSexAction({
  rabbitId,
}: DetermineSexActionProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const {
    updateRabbit,
    loading,
    error,
  } = useUpdateRabbit();

  const handleSexChange = async (
    sex: RabbitSex,
  ) => {
    try {
      await updateRabbit({
        id: rabbitId,
        sex,
      });

      setOpen(false);
    } catch (err) {
      console.error(
        '[RABBIT] Erreur modification sexe:',
        err,
      );
    }
  };

  return (
    <>
      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-amber-900">
              Sexe non déterminé
            </h2>

            <p className="mt-1 text-sm text-amber-700">
              Le sexe de ce lapin n'a pas encore été identifié.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700"
          >
            <Check size={17} />

            Déterminer le sexe
          </button>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="w-full rounded-t-3xl bg-white p-6 shadow-xl sm:max-w-md sm:rounded-3xl">
            <h2 className="text-lg font-bold text-slate-900">
              Déterminer le sexe
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sélectionnez le sexe observé pour ce lapin.
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error.message}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleSexChange('MALE')
                }
                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 p-5 font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2
                    size={26}
                    className="animate-spin"
                  />
                ) : (
                  <Mars
                    size={28}
                    className="text-blue-600"
                  />
                )}

                Mâle
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  handleSexChange('FEMALE')
                }
                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 p-5 font-semibold text-slate-700 transition hover:border-pink-300 hover:bg-pink-50 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2
                    size={26}
                    className="animate-spin"
                  />
                ) : (
                  <Venus
                    size={28}
                    className="text-pink-600"
                  />
                )}

                Femelle
              </button>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </>
  );
}