'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import { Badge, Button, ErrorBox, Field, FormGrid, Input, Loading, Modal, PageHeader, Select, Table, Textarea } from '@/components/ui/kit';
import { toFloat, useForm } from '@/hooks/use-form';
import { CURRENCY, clean, formatDate, formatNumber, fromDateInput, toDateInput } from '@/lib/format';
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
  isBelowMinimum: boolean;
  averageDailyConsumption?: number | null;
  autonomyDays?: number | null;
  movements: Array<{ id: string; type: string; quantity: number; date: string; description?: string | null }>;
}

const refetchQueries = ['InventoryItems', 'Dashboard', 'HeaderTasks'];

export default function InventoryPage() {
  const [creating, setCreating] = useState(false);
  const [moving, setMoving] = useState<Item | null>(null);
  const [history, setHistory] = useState<Item | null>(null);
  const { data, loading, error, refetch } = useQuery<{ inventoryItems: Item[] }>(ITEMS);

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
      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : (
        <Table
          rows={data?.inventoryItems ?? []}
          empty="Aucun article en stock"
          columns={[
            { header: 'Article', cell: (i) => <button type="button" className="font-semibold text-emerald-700" onClick={() => setHistory(i)}>{i.name}</button> },
            { header: 'Type', cell: (i) => label(INVENTORY_TYPE, i.type) },
            {
              header: 'Stock',
              cell: (i) => (
                <span className={i.isBelowMinimum ? 'font-semibold text-red-600' : ''}>
                  {formatNumber(i.currentStock, 2)} {i.unit}
                </span>
              ),
            },
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
            { header: '', cell: (i) => <Button className="px-3 py-1 text-xs" onClick={() => setMoving(i)}>Mouvement</Button> },
          ]}
        />
      )}

      <ItemModal open={creating} onClose={() => setCreating(false)} />
      {moving && <MovementModal item={moving} onClose={() => setMoving(null)} />}
      {history && (
        <Modal open title={`Mouvements — ${history.name}`} onClose={() => setHistory(null)}>
          <Table
            rows={history.movements}
            empty="Aucun mouvement"
            columns={[
              { header: 'Date', cell: (m) => formatDate(m.date) },
              { header: 'Type', cell: (m) => label(STOCK_MOVEMENT, m.type) },
              { header: 'Quantité', cell: (m) => `${m.quantity} ${history.unit}` },
              { header: 'Description', cell: (m) => m.description ?? '—' },
            ]}
          />
        </Modal>
      )}
    </div>
  );
}

function ItemModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { bind, values, reset } = useForm({ name: '', type: 'FEED', unit: 'kg', minimumStock: '', description: '' });
  const [create, { loading, error, reset: r }] = useMutation(CREATE_ITEM, { refetchQueries });
  const close = () => {
    reset();
    r();
    onClose();
  };
  return (
    <Modal
      open={open}
      title="Nouvel article"
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button
            loading={loading}
            disabled={!values.name}
            onClick={() => create({ variables: { input: clean({ ...values, minimumStock: toFloat(values.minimumStock) }) } }).then(close).catch(() => undefined)}
          >
            Créer
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
        <Field label="Stock minimum" hint="Une tâche de réapprovisionnement est créée en dessous">
          <Input inputMode="decimal" {...bind('minimumStock')} />
        </Field>
      </FormGrid>
      <Field label="Description">
        <Textarea {...bind('description')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}

function MovementModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const { bind, values } = useForm({ type: 'CONSUMPTION', quantity: '', date: toDateInput(), unitCost: '', description: '', reference: '' });
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
                    unitCost: toFloat(values.unitCost),
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
        {values.type === 'PURCHASE' && (
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
