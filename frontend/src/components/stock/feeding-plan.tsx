'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Calculator, Wheat } from 'lucide-react';

import { Badge, Button, Card, ErrorBox, Field, FormGrid, Input, Loading, Modal, Table } from '@/components/ui/kit';
import { toFloat, useForm } from '@/hooks/use-form';
import { formatDate, formatMoney, formatNumber, fromDateInput, toDateInput } from '@/lib/format';

export const FEEDING_PLAN = gql`
  query FeedingPlan {
    feedingPlan {
      headcounts { PREGNANT LACTATING FATTENING MAINTENANCE underMother }
      items {
        inventoryItemId
        name
        unit
        currentStock
        unitPrice
        rations { category dailyQuantity }
        dailyNeed
        dailyCost
        appliedUntil
        pendingDays
        pendingQuantity
        estimatedStock
        autonomyDays
        depletionDate
      }
    }
  }
`;
const SET_RATIONS = gql`
  mutation SetFeedRations($input: SetFeedRationsInput!) { setFeedRations(input: $input) { inventoryItemId } }
`;
const APPLY = gql`
  mutation ApplyFeedRations($inventoryItemId: ID!) { applyFeedRations(inventoryItemId: $inventoryItemId) { id quantity } }
`;

type Category = 'PREGNANT' | 'LACTATING' | 'FATTENING' | 'MAINTENANCE';

const CATEGORIES: Array<{ key: Category; label: string; hint: string; suggestion: string }> = [
  { key: 'PREGNANT', label: 'Gestantes', hint: 'Femelles dont la palpation est positive', suggestion: '0.2' },
  { key: 'LACTATING', label: 'Allaitantes', hint: 'Mères avec une portée non sevrée (lapereaux compris)', suggestion: '0.35' },
  { key: 'FATTENING', label: 'Engraissement', hint: 'Lapins sevrés destinés à la vente', suggestion: '0.12' },
  { key: 'MAINTENANCE', label: 'Autres', hint: 'Mâles, femelles vides, futurs reproducteurs, réformes', suggestion: '0.15' },
];

interface PlanItem {
  inventoryItemId: string;
  name: string;
  unit: string;
  currentStock: number;
  unitPrice?: number | null;
  rations: Array<{ category: Category; dailyQuantity: number }>;
  dailyNeed: number;
  dailyCost?: number | null;
  appliedUntil?: string | null;
  pendingDays: number;
  pendingQuantity: number;
  estimatedStock: number;
  autonomyDays?: number | null;
  depletionDate?: string | null;
}

interface Plan {
  headcounts: Record<Category, number> & { underMother: number };
  items: PlanItem[];
}

const refetchQueries = ['FeedingPlan', 'InventoryItems', 'Dashboard', 'HeaderTasks'];

/**
 * Rations journalières : quantité d'aliment par lapin et par jour selon
 * son état. Le besoin de la ferme suit l'effectif actuel et se déduit
 * du stock en un clic.
 */
export function FeedingPlanCard() {
  const { data, loading, error, refetch } = useQuery<{ feedingPlan: Plan }>(FEEDING_PLAN, { fetchPolicy: 'cache-and-network' });
  const [editing, setEditing] = useState<PlanItem | null>(null);
  const [apply, applying] = useMutation(APPLY, { refetchQueries, awaitRefetchQueries: true });

  if (loading && !data) return <Loading />;
  const plan = data?.feedingPlan;
  const counts = plan?.headcounts;

  return (
    <Card title="Rations journalières">
      <p className="mb-4 text-sm text-slate-600">
        Indique la quantité donnée <strong>par lapin et par jour</strong> pour chaque aliment. L&apos;app calcule le besoin de
        la ferme avec ton effectif actuel, le coût par jour et le nombre de jours de stock restants.
      </p>
      <ErrorBox error={error ?? applying.error} onRetry={() => refetch()} />

      {counts && (
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {CATEGORIES.map((c) => (
            <div key={c.key} className="rounded-xl bg-slate-50 p-3" title={c.hint}>
              <p className="text-xs text-slate-500">{c.label}</p>
              <p className="text-lg font-semibold text-slate-900">{counts[c.key]}</p>
            </div>
          ))}
          <div className="rounded-xl bg-slate-50 p-3" title="Nourris avec leur mère, non comptés">
            <p className="text-xs text-slate-500">Sous la mère</p>
            <p className="text-lg font-semibold text-slate-400">{counts.underMother}</p>
          </div>
        </div>
      )}

      <Table
        rows={(plan?.items ?? []).map((i) => ({ ...i, id: i.inventoryItemId }))}
        empty="Aucun aliment : crée un article de type « Aliment » pour définir ses rations."
        columns={[
          { header: 'Aliment', cell: (i) => <strong>{i.name}</strong> },
          {
            header: 'Rations / lapin / jour',
            cell: (i) =>
              i.rations.length ? (
                <span className="whitespace-normal text-xs">
                  {CATEGORIES.filter((c) => i.rations.some((r) => r.category === c.key))
                    .map((c) => `${c.label} ${formatNumber(i.rations.find((r) => r.category === c.key)!.dailyQuantity, 3)} ${i.unit}`)
                    .join(' · ')}
                </span>
              ) : (
                <span className="text-xs text-amber-700">À définir</span>
              ),
          },
          { header: 'Besoin / jour', cell: (i) => (i.dailyNeed ? `${formatNumber(i.dailyNeed, 2)} ${i.unit}` : '—') },
          { header: 'Coût / jour', cell: (i) => (i.dailyCost != null && i.dailyNeed ? formatMoney(i.dailyCost) : '—') },
          { header: 'Stock estimé', cell: (i) => `${formatNumber(i.estimatedStock, 2)} ${i.unit}` },
          {
            header: 'Autonomie',
            cell: (i) =>
              i.autonomyDays != null ? (
                <Badge tone={i.autonomyDays <= 7 ? 'red' : i.autonomyDays <= 14 ? 'amber' : 'green'}>
                  {formatNumber(i.autonomyDays, 0)} j · rupture vers le {formatDate(i.depletionDate)}
                </Badge>
              ) : (
                '—'
              ),
          },
          {
            header: '',
            cell: (i) => (
              <div className="flex gap-1">
                <Button variant="secondary" className="px-3 py-1 text-xs" onClick={() => setEditing(i)}>
                  <Calculator size={14} /> Rations
                </Button>
                {i.pendingDays > 0 && (
                  <Button
                    className="px-3 py-1 text-xs"
                    loading={applying.loading}
                    onClick={() => apply({ variables: { inventoryItemId: i.inventoryItemId } }).catch(() => undefined)}
                    title={`Déduire ${formatNumber(i.pendingQuantity, 2)} ${i.unit} pour ${i.pendingDays} jour(s)`}
                  >
                    <Wheat size={14} /> Déduire {i.pendingDays} j ({formatNumber(i.pendingQuantity, 1)} {i.unit})
                  </Button>
                )}
              </div>
            ),
          },
        ]}
      />
      <p className="mt-3 text-xs text-slate-500">
        « Déduire » enregistre une consommation pour les jours écoulés depuis la dernière déduction, calculée sur
        l&apos;effectif actuel. Une déduction se supprime dans l&apos;historique des mouvements de l&apos;article.
      </p>

      {editing && <RationModal key={editing.inventoryItemId} item={editing} onClose={() => setEditing(null)} />}
    </Card>
  );
}

function RationModal({ item, onClose }: { item: PlanItem; onClose: () => void }) {
  const initial = Object.fromEntries(
    CATEGORIES.map((c) => [c.key, String(item.rations.find((r) => r.category === c.key)?.dailyQuantity ?? '')]),
  ) as Record<Category, string>;
  const { bind, values, setValues } = useForm({
    ...initial,
    startDate: toDateInput(item.appliedUntil),
  });
  const [save, { loading, error }] = useMutation(SET_RATIONS, { refetchQueries, awaitRefetchQueries: true });
  const firstSetup = item.rations.length === 0;

  return (
    <Modal
      open
      title={`Rations — ${item.name}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button
            loading={loading}
            onClick={() =>
              save({
                variables: {
                  input: {
                    inventoryItemId: item.inventoryItemId,
                    rations: CATEGORIES.map((c) => ({ category: c.key, dailyQuantity: toFloat(values[c.key]) ?? 0 })),
                    startDate: fromDateInput(values.startDate),
                  },
                },
              })
                .then(onClose)
                .catch(() => undefined)
            }
          >
            Enregistrer
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">
        Quantité en <strong>{item.unit}</strong> par lapin et par jour. Laisse vide une catégorie qui ne reçoit pas cet aliment.
      </p>
      <FormGrid>
        {CATEGORIES.map((c) => (
          <Field key={c.key} label={`${c.label} (${item.unit} / lapin / jour)`} hint={c.hint}>
            <Input inputMode="decimal" placeholder={`ex. ${c.suggestion}`} {...bind(c.key)} />
          </Field>
        ))}
        <Field
          label="Compter les rations à partir du"
          hint={firstSetup ? 'Date du stock initial ou du début de distribution' : 'Dernière déduction enregistrée'}
        >
          <Input type="date" {...bind('startDate')} />
        </Field>
      </FormGrid>
      {firstSetup && (
        <button
          type="button"
          className="text-xs font-medium text-emerald-700 hover:underline"
          onClick={() => setValues((v) => ({ ...v, ...Object.fromEntries(CATEGORIES.map((c) => [c.key, c.suggestion])) }))}
        >
          Pré-remplir avec des valeurs indicatives (granulés, à adapter à ton élevage)
        </button>
      )}
      <ErrorBox error={error} />
    </Modal>
  );
}
