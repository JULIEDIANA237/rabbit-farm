import type { Rabbit } from '@/types/rabbit';

interface RabbitIdentificationCardProps {
  rabbit: Rabbit;
}

export function RabbitIdentificationCard({
  rabbit,
}: RabbitIdentificationCardProps) {
  const identifications = rabbit.identifications ?? [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Identifications
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Numéros et moyens d'identification physique.
        </p>
      </div>

      {identifications.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-5 text-center">
          <p className="text-sm text-slate-500">
            Aucune identification enregistrée.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {identifications.map((identification) => (
            <div
              key={identification.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {identification.type}
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {identification.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}