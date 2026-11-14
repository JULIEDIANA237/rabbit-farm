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

/** Valeurs indicatives en kg / lapin / jour (granulés), à adapter à chaque élevage. */
const CATEGORIES: Array<{ key: Category; label: string; one: string; hint: string; suggestion: number }> = [
  { key: 'PREGNANT', label: 'Gestantes', one: 'gestante(s)', hint: 'Femelles dont la palpation est positive', suggestion: 0.2 },
  { key: 'LACTATING', label: 'Allaitantes', one: 'allaitante(s)', hint: 'Mères avec une portée non sevrée (lapereaux compris)', suggestion: 0.35 },
  { key: 'FATTENING', label: 'Engraissement', one: 'en engraissement', hint: 'Lapins sevrés destinés à la vente', suggestion: 0.12 },
  { key: 'MAINTENANCE', label: 'Autres', one: 'autre(s)', hint: 'Mâles, femelles vides, futurs reproducteurs, réformes', suggestion: 0.15 },
];

/**
 * Pour un aliment compté en kg, la ration se saisit en grammes
 * (150 g est plus parlant que 0,15 kg). Elle reste stockée dans l'unité de l'article.
 */
function rationUnit(unit: string) {
  return /^(kg|kgs|kilo|kilos|kilogramme|kilogrammes)$/i.test(unit.trim()) ? { label: 'g', factor: 1000 } : { label: unit, factor: 1 };
}

/** « 3 gestante(s) × 200 g + 10 autre(s) × 150 g » */
function needDetail(item: Pick<PlanItem, 'unit' | 'rations'>, counts: Record<Category, number>) {
  const u = rationUnit(item.unit);
  return CATEGORIES.map((c) => ({ c, q: item.rations.find((r) => r.category === c.key)?.dailyQuantity ?? 0 }))
    .filter(({ c, q }) => q > 0 && counts[c.key] > 0)
    .map(({ c, q }) => `${counts[c.key]} ${c.one} × ${formatNumber(q * u.factor, u.factor > 1 ? 0 : 3)} ${u.label}`)
    .join(' + ');
}

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
        L&apos;app ne devine rien : c&apos;est <strong>toi qui indiques la ration d&apos;un lapin par jour</strong> pour chaque
        catégorie. Elle la multiplie par le nombre de lapins de chaque catégorie ci-dessous (ton effectif actuel) pour obtenir
        le besoin de la ferme, le coût par jour et les jours de stock restants.
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
                    .map((c) => {
                      const u = rationUnit(i.unit);
                      const q = i.rations.find((r) => r.category === c.key)!.dailyQuantity * u.factor;
                      return `${c.label} ${formatNumber(q, u.factor > 1 ? 0 : 3)} ${u.label}`;
                    })
                    .join(' · ')}
                </span>
              ) : (
                <span className="text-xs text-amber-700">À définir</span>
              ),
          },
          {
            header: 'Besoin de la ferme / jour',
            cell: (i) =>
              i.dailyNeed ? (
                <div className="whitespace-normal">
                  <strong>
                    {formatNumber(i.dailyNeed, 2)} {i.unit}
                  </strong>
                  {counts && <p className="text-xs text-slate-500">= {needDetail(i, counts)}</p>}
                </div>
              ) : (
                '—'
              ),
          },
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

      {editing && <RationModal key={editing.inventoryItemId} item={editing} counts={counts} onClose={() => setEditing(null)} />}
    </Card>
  );
}

function RationModal({
  item,
  counts,
  onClose,
}: {
  item: PlanItem;
  counts?: Record<Category, number> & { underMother: number };
  onClose: () => void;
}) {
  const u = rationUnit(item.unit);
  const show = (q: number) => String(+(q * u.factor).toFixed(u.factor > 1 ? 0 : 3));
  const initial = Object.fromEntries(
    CATEGORIES.map((c) => {
      const q = item.rations.find((r) => r.category === c.key)?.dailyQuantity;
      return [c.key, q ? show(q) : ''];
    }),
  ) as Record<Category, string>;
  const { bind, values, setValues } = useForm({
    ...initial,
    startDate: toDateInput(item.appliedUntil),
  });
  const [save, { loading, error }] = useMutation(SET_RATIONS, { refetchQueries, awaitRefetchQueries: true });
  const firstSetup = item.rations.length === 0;
  const rations = CATEGORIES.map((c) => ({ category: c.key, dailyQuantity: (toFloat(values[c.key]) ?? 0) / u.factor }));
  const preview = counts ? rations.reduce((sum, r) => sum + r.dailyQuantity * counts[r.category], 0) : null;

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
                    rations,
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
        Quantité en <strong>{u.label}</strong> donnée à <strong>un seul lapin</strong> par jour. Laisse vide une catégorie qui ne
        reçoit pas cet aliment.
      </p>
      <FormGrid>
        {CATEGORIES.map((c) => (
          <Field
            key={c.key}
            label={`${c.label} (${u.label} / lapin / jour)`}
            hint={`${c.hint}${counts ? ` · ${counts[c.key]} lapin(s) aujourd’hui` : ''}`}
          >
            <Input inputMode="decimal" placeholder={`ex. ${show(c.suggestion)}`} {...bind(c.key)} />
          </Field>
        ))}
        <Field
          label="Compter les rations à partir du"
          hint={firstSetup ? 'Date du stock initial ou du début de distribution' : 'Dernière déduction enregistrée'}
        >
          <Input type="date" {...bind('startDate')} />
        </Field>
      </FormGrid>
      {preview != null && (
        <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">
          Avec ton effectif actuel, la ferme consommera <strong>{formatNumber(preview, 2)} {item.unit} par jour</strong>
          {preview > 0 && item.currentStock > 0 ? `, soit environ ${formatNumber(item.currentStock / preview, 0)} jours de stock.` : '.'}
          {' '}Si ce total ne correspond pas à ce que tu donnes vraiment, ajuste les rations.
        </p>
      )}
      {firstSetup && (
        <button
          type="button"
          className="text-xs font-medium text-emerald-700 hover:underline"
          onClick={() => setValues((v) => ({ ...v, ...Object.fromEntries(CATEGORIES.map((c) => [c.key, show(c.suggestion)])) }))}
        >
          Pré-remplir avec des valeurs indicatives (granulés, à adapter à ton élevage)
        </button>
      )}
      <ErrorBox error={error} />
    </Modal>
  );
}
