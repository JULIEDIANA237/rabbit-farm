import type { Rabbit } from '@/types/rabbit';
import {
  getRabbitSexLabel,
  getRabbitStatusLabel,
} from '@/lib/rabbits/rabbit-labels';

interface RabbitInfoCardProps {
  rabbit: Rabbit;
}

export function RabbitInfoCard({
  rabbit,
}: RabbitInfoCardProps) {
  const formatDate = (date?: string | null) => {
    if (!date) return '—';

    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
    }).format(new Date(date));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Informations générales
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Informations d'identification et caractéristiques du lapin.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Info
          label="Code"
          value={rabbit.code}
        />

        <Info
          label="Sexe"
          value={getRabbitSexLabel(rabbit.sex)}
        />

        <Info
          label="Statut"
          value={getRabbitStatusLabel(rabbit.status)}
        />

        <Info
          label="Statut"
          value={rabbit.status ?? '—'}
        />

        <Info
          label="Date de naissance"
          value={formatDate(rabbit.birthDate)}
        />

        <Info
          label="Poids"
          value={
            rabbit.weight != null
              ? `${rabbit.weight} kg`
              : '—'
          }
        />

        <Info
          label="Couleur"
          value={rabbit.color ?? '—'}
        />
      </div>

      {rabbit.observations && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Observations
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {rabbit.observations}
          </p>
        </div>
      )}
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}