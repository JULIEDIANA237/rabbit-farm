'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import { Badge, Button, ErrorBox, Field, FormGrid, Grid, Input, Loading, Modal, PageHeader, Select, Stat, Table, Textarea } from '@/components/ui/kit';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';
import { FeedingPlanCard } from '@/components/stock/feeding-plan';
import { toFloat, useForm } from '@/hooks/use-form';
import { CURRENCY, clean, cleanEdit, formatDate, formatMoney, formatNumber, fromDateInput, toDateInput } from '@/lib/format';
import { INVENTORY_TYPE, STOCK_MOVEMENT, label, options } from '@/lib/labels';

const ITEMS = gql`
  query InventoryItems {
    inventoryItems {
      id
      name
      type
      unit
      currentStock
      minimumStock
      unitPrice
      stockValue
      description
      isBelowMinimum
      averageDailyConsumption
      autonomyDays
      movements { id type quantity date description unitCost }
    }
  }
`;
const CREATE_ITEM = gql`
  mutation CreateInventoryItem($input: CreateInventoryItemInput!) { createInventoryItem(input: $input) { id } }
`;
const UPDATE_ITEM = gql`
  mutation UpdateInventoryItem($input: UpdateInventoryItemInput!) { updateInventoryItem(input: $input) { id } }
`;
const DELETE_ITEM = gql`
  mutation DeleteInventoryItem($id: ID!) { deleteInventoryItem(id: $id) }
`;
const DELETE_MOVE = gql`
  mutation DeleteStockMovement($id: ID!) { deleteStockMovement(id: $id) }
`;
const MOVE = gql`
  mutation StockMovement($input: CreateStockMovementInput!) { createStockMovement(input: $input) { id } }
`;

interface Item {
  id: string;
  name: string;
  type: string;
  unit: string;
  currentStock: number;
  minimumStock?: number | null;
  unitPrice?: number | null;
  stockValue?: number | null;
  description?: string | null;
  isBelowMinimum: boolean;
  averageDailyConsumption?: number | null;
  autonomyDays?: number | null;
  movements: Array<{ id: string; type: string; quantity: number; date: string; description?: string | null; unitCost?: number | null }>;
}

const refetchQueries = ['InventoryItems', 'FeedingPlan', 'Dashboard', 'HeaderTasks'];

export default function InventoryPage() {
  const [creating, setCreating] = useState(false);
  const [moving, setMoving] = useState<Item | null>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const { data, loading, error, refetch } = useQuery<{ inventoryItems: Item[] }>(ITEMS);
  const items = data?.inventoryItems ?? [];
  // L'historique suit les données rechargées (après suppression d'un mouvement).
  const history = items.find((i) => i.id === historyId) ?? null;
  const removeItem = useDeleteAction(DELETE_ITEM, { refetchQueries });
  const removeMove = useDeleteAction(DELETE_MOVE, { refetchQueries });
  const totalValue = items.reduce((sum, i) => sum + (i.stockValue ?? 0), 0);
  const unpriced = items.filter((i) => i.unitPrice == null).length;

  return (
    <div>
      <PageHeader
        eyebrow="Opérations"
        title="Stock"
        description="Aliments, médicaments et matériel. L'autonomie est calculée sur la consommation des 30 derniers jours."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus size={16} /> Nouvel article
          </Button>
        }
      />
      {items.length > 0 && (
        <div className="mb-6">
          <Grid cols={3}>
            <Stat label="Valeur du stock" value={formatMoney(totalValue)} tone="success" />
            <Stat label="Articles" value={items.length} />
            <Stat label="Sans prix" value={unpriced} tone={unpriced ? 'warning' : undefined} />
          </Grid>
        </div>
      )}
      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : (
        <Table
          rows={items}
          empty="Aucun article en stock"
          columns={[
            { header: 'Article', cell: (i) => <button type="button" className="font-semibold text-emerald-700" onClick={() => setHistoryId(i.id)}>{i.name}</button> },
            { header: 'Type', cell: (i) => label(INVENTORY_TYPE, i.type) },
            {
              header: 'Stock',
              cell: (i) => (
                <span className={i.isBelowMinimum ? 'font-semibold text-red-600' : ''}>
                  {formatNumber(i.currentStock, 2)} {i.unit}
                </span>
              ),
            },
            { header: 'Prix unitaire', cell: (i) => (i.unitPrice != null ? `${formatMoney(i.unitPrice)} / ${i.unit}` : '—') },
            { header: 'Valeur', cell: (i) => (i.stockValue != null ? <strong>{formatMoney(i.stockValue)}</strong> : '—') },
            { header: 'Minimum', cell: (i) => (i.minimumStock != null ? `${i.minimumStock} ${i.unit}` : '—') },
            { header: 'Conso. / jour', cell: (i) => (i.averageDailyConsumption ? `${formatNumber(i.averageDailyConsumption, 2)} ${i.unit}` : '—') },
            {
              header: 'Autonomie',
              cell: (i) =>
                i.autonomyDays != null ? (
                  <Badge tone={i.autonomyDays <= 7 ? 'red' : i.autonomyDays <= 14 ? 'amber' : 'green'}>{formatNumber(i.autonomyDays, 1)} j</Badge>
                ) : (
                  '—'
                ),
            },
            {
              header: '',
              cell: (i) => (
                <RowActions
                  onEdit={() => setEditing(i)}
                  onDelete={() =>
                    removeItem.ask(i.id, `l'article « ${i.name} »`, i.movements.length ? `Ses ${i.movements.length} mouvement(s) de stock seront aussi supprimés.` : undefined)
                  }
                >
                  <Button className="px-3 py-1 text-xs" onClick={() => setMoving(i)}>Mouvement</Button>
                </RowActions>
              ),
            },
          ]}
        />
      )}

      {items.length > 0 && (
        <div className="mt-6">
          <FeedingPlanCard />
        </div>
      )}

      {creating && <ItemModal onClose={() => setCreating(false)} />}
      {editing && <ItemModal key={editing.id} editing={editing} onClose={() => setEditing(null)} />}
      {removeItem.dialog}
      {removeMove.dialog}
      {moving && <MovementModal item={moving} onClose={() => setMoving(null)} />}
      {history && (
        <Modal open title={`Mouvements — ${history.name}`} onClose={() => setHistoryId(null)}>
          <Table
            rows={history.movements}
            empty="Aucun mouvement"
            columns={[
              { header: 'Date', cell: (m) => formatDate(m.date) },
              { header: 'Type', cell: (m) => label(STOCK_MOVEMENT, m.type) },
              { header: 'Quantité', cell: (m) => `${m.quantity} ${history.unit}` },
              { header: 'Coût unitaire', cell: (m) => (m.unitCost != null ? formatMoney(m.unitCost) : '—') },
              { header: 'Description', cell: (m) => m.description ?? '—' },
              {
                header: '',
                cell: (m) => (
                  <RowActions
                    onDelete={() =>
                      removeMove.ask(m.id, `le mouvement du ${formatDate(m.date)} (${label(STOCK_MOVEMENT, m.type)}, ${m.quantity} ${history.unit})`, 'Le stock actuel sera recalculé.')
                    }
                  />
                ),
              },
            ]}
          />
        </Modal>
      )}
    </div>
  );
}

function ItemModal({ onClose, editing }: { onClose: () => void; editing?: Item }) {
  const { bind, values } = useForm({
    name: editing?.name ?? '',
    type: editing?.type ?? 'FEED',
    unit: editing?.unit ?? 'kg',
    minimumStock: editing?.minimumStock != null ? String(editing.minimumStock) : '',
    unitPrice: editing?.unitPrice != null ? String(editing.unitPrice) : '',
    description: editing?.description ?? '',
    initialStock: '',
    initialStockDate: toDateInput(),
  });
  const [save, { loading, error }] = useMutation(editing ? UPDATE_ITEM : CREATE_ITEM, { refetchQueries });
  const { initialStock, initialStockDate, ...fields } = values;
  const payload = { ...fields, minimumStock: toFloat(values.minimumStock), unitPrice: toFloat(values.unitPrice) };
  const submit = () =>
    save({
      variables: {
        input: editing
          ? {
              id: editing.id,
              ...cleanEdit(payload, ['description']),
              minimumStock: payload.minimumStock ?? null,
              unitPrice: payload.unitPrice ?? null,
            }
          : clean({
              ...payload,
              initialStock: toFloat(initialStock),
              initialStockDate: initialStock ? fromDateInput(initialStockDate) : undefined,
            }),
      },
    })
      .then(onClose)
      .catch(() => undefined);
  return (
    <Modal
      open
      title={editing ? `Modifier « ${editing.name} »` : 'Nouvel article'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button loading={loading} disabled={!values.name || !values.unit} onClick={submit}>
            {editing ? 'Enregistrer' : 'Créer'}
          </Button>
        </>
      }
    >
      <FormGrid>
        <Field label="Nom">
          <Input {...bind('name')} />
        </Field>
        <Field label="Type">
          <Select options={options(INVENTORY_TYPE)} {...bind('type')} />
        </Field>
        <Field label="Unité">
          <Input placeholder="kg, sac, dose, flacon…" {...bind('unit')} />
        </Field>
        <Field label={`Prix unitaire (${CURRENCY} par ${values.unit || 'unité'})`} hint="Mis à jour automatiquement à chaque achat avec un coût">
          <Input inputMode="decimal" {...bind('unitPrice')} />
        </Field>
        <Field label="Stock minimum" hint="Une tâche de réapprovisionnement est créée en dessous">
          <Input inputMode="decimal" {...bind('minimumStock')} />
        </Field>
        {!editing && (
          <>
            <Field label={`Stock initial (${values.unit || 'unité'})`} hint="Quantité disponible au départ">
              <Input inputMode="decimal" {...bind('initialStock')} />
            </Field>
            <Field label="Date du stock initial">
              <Input type="date" {...bind('initialStockDate')} />
            </Field>
          </>
        )}
      </FormGrid>
      {!editing && values.type === 'FEED' && (
        <p className="text-xs text-slate-500">
          Après la création, définis les rations journalières par catégorie de lapin dans « Rations journalières ».
        </p>
      )}
      <Field label="Description">
        <Textarea {...bind('description')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}

function MovementModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const { bind, values } = useForm({
    type: 'CONSUMPTION',
    quantity: '',
    date: toDateInput(),
    unitCost: item.unitPrice != null ? String(item.unitPrice) : '',
    description: '',
    reference: '',
  });
  const [move, { loading, error }] = useMutation(MOVE, { refetchQueries });
  return (
    <Modal
      open
      title={`${item.name} — stock actuel ${formatNumber(item.currentStock, 2)} ${item.unit}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button
            loading={loading}
            disabled={!values.quantity}
            onClick={() =>
              move({
                variables: {
                  input: clean({
                    ...values,
                    inventoryItemId: item.id,
                    date: fromDateInput(values.date),
                    quantity: toFloat(values.quantity),
                    unitCost:
                      values.type === 'PURCHASE' || values.type === 'INITIAL' ? toFloat(values.unitCost) : undefined,
                  }),
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
      <FormGrid>
        <Field label="Type de mouvement">
          <Select options={options(STOCK_MOVEMENT)} {...bind('type')} />
        </Field>
        <Field label={`Quantité (${item.unit})`} hint={values.type === 'ADJUSTMENT' ? 'Variation signée : +5 ou -3' : undefined}>
          <Input inputMode="decimal" {...bind('quantity')} />
        </Field>
        <Field label="Date">
          <Input type="date" {...bind('date')} />
        </Field>
        {(values.type === 'PURCHASE' || values.type === 'INITIAL') && (
          <Field label={`Coût unitaire (${CURRENCY})`}>
            <Input inputMode="decimal" {...bind('unitCost')} />
          </Field>
        )}
        <Field label="Description">
          <Input {...bind('description')} />
        </Field>
        <Field label="Référence">
          <Input {...bind('reference')} />
        </Field>
      </FormGrid>
      <ErrorBox error={error} />
    </Modal>
  );
}
