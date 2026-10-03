import type { Rabbit } from '@/types/rabbit';

interface RabbitGenealogyCardProps {
  rabbit: Rabbit;
}

export function RabbitGenealogyCard({
  rabbit,
}: RabbitGenealogyCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Généalogie
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Traçabilité des parents du lapin.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ParentCard
          label="Père"
          value={rabbit.fatherId}
        />

        <ParentCard
          label="Mère"
          value={rabbit.motherId}
        />
      </div>
    </section>
  );
}

function ParentCard({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-all text-sm font-medium text-slate-800">
        {value ?? 'Non renseigné'}
      </p>
    </div>
  );
}