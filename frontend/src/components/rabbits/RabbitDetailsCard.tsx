import {
  ClipboardList,
  FileText,
} from 'lucide-react';

import type { RabbitDetails } from '@/types/rabbit';

interface Props {
  rabbit: RabbitDetails;
}

export function RabbitDetailsCard({
  rabbit,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <ClipboardList size={21} />
        </div>

        <div>
          <h2 className="font-semibold text-slate-900">
            Traçabilité
          </h2>

          <p className="text-sm text-slate-500">
            Identifications et observations
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {rabbit.identifications.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Aucune identification physique enregistrée.
          </div>
        ) : (
          rabbit.identifications.map(
            (identification) => (
              <div
                key={identification.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {identification.type}
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {identification.value}
                  </p>
                </div>

                <FileText
                  size={18}
                  className="text-slate-400"
                />
              </div>
            ),
          )
        )}
      </div>

      {rabbit.observations && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Observations
          </p>

          <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {rabbit.observations}
          </p>
        </div>
      )}
    </section>
  );
}