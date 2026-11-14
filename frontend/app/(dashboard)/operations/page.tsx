'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import { Button, Card, ErrorBox, Field, FormGrid, Grid, Input, Loading, Modal, PageHeader, Select, Stat, Table, Textarea } from '@/components/ui/kit';
import { toFloat, useCreateModal, useForm, type Prefill } from '@/hooks/use-form';
import { AiFill } from '@/components/assistant/ai-fill';
import { CURRENCY, clean, cleanEdit, formatDate, formatMoney, fromDateInput, toDateInput } from '@/lib/format';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';
import { EXPENSE_CATEGORY, PAYMENT_METHOD, label, options } from '@/lib/labels';

const EXPENSES = gql`
  query Expenses {
    expenses {
      id
      date
      category
      amount
      description
      supplier
      reference
      paymentMethod
      observation
    }
  }
`;
const CREATE = gql`
  mutation CreateExpense($input: CreateExpenseInput!) { createExpense(input: $input) { id } }
`;
const UPDATE = gql`
  mutation UpdateExpense($input: UpdateExpenseInput!) { updateExpense(input: $input) { id } }
`;
const DELETE = gql`
  mutation DeleteExpense($id: ID!) { deleteExpense(id: $id) }
`;

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description?: string | null;
  supplier?: string | null;
  reference?: string | null;
  paymentMethod?: string | null;
  observation?: string | null;
}

export default function OperationsPage() {
  const creating = useCreateModal();
  const [editing, setEditing] = useState<Expense | null>(null);
  const remove = useDeleteAction(DELETE, { refetchQueries: ['Expenses', 'Dashboard'] });
  const [category, setCategory] = useState('');
  const { data, loading, error, refetch } = useQuery<{ expenses: Expense[] }>(EXPENSES);
  const expenses = useMemo(
    () => (data?.expenses ?? []).filter((e) => !category || e.category === category),
    [data, category],
  );

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const all = data?.expenses ?? [];
  const thisMonth = all.filter((e) => new Date(e.date) >= monthStart).reduce((s, e) => s + e.amount, 0);
  const byCategory = Object.entries(
    all.reduce<Record<string, number>>((acc, e) => ({ ...acc, [e.category]: (acc[e.category] ?? 0) + e.amount }), {}),
  ).sort((a, b) => b[1] - a[1]);
  const total = all.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Opérations"
        title="Dépenses"
        description="Alimentation, soins, énergie, équipement, main-d'œuvre…"
        actions={
          <>
            <Link href="/operations/inventory">
              <Button variant="secondary">Stock</Button>
            </Link>
            <Button onClick={() => creating.openModal()}>
              <Plus size={16} /> Nouvelle dépense
            </Button>
          </>
        }
      />

      <Grid cols={3}>
        <Stat label="Ce mois-ci" value={formatMoney(thisMonth)} tone="warning" />
        <Stat label="Total enregistré" value={formatMoney(total)} />
        <Stat label="Nombre de dépenses" value={all.length} />
      </Grid>

      {byCategory.length > 0 && (
        <Card title="Répartition par catégorie">
          <div className="space-y-2">
            {byCategory.map(([cat, amount]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm">
                  <span>{label(EXPENSE_CATEGORY, cat)}</span>
                  <span className="font-medium">{formatMoney(amount)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${(amount / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="max-w-xs">
        <Select placeholder="Toutes les catégories" options={options(EXPENSE_CATEGORY)} value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>

      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : (
        <Table
          rows={expenses}
          empty="Aucune dépense"
          columns={[
            { header: 'Date', cell: (e) => formatDate(e.date) },
            { header: 'Catégorie', cell: (e) => label(EXPENSE_CATEGORY, e.category) },
            { header: 'Description', cell: (e) => e.description ?? '—' },
            { header: 'Fournisseur', cell: (e) => e.supplier ?? '—' },
            { header: 'Paiement', cell: (e) => label(PAYMENT_METHOD, e.paymentMethod) },
            { header: 'Montant', cell: (e) => <strong>{formatMoney(e.amount)}</strong> },
            {
              header: '',
              cell: (e) => (
                <RowActions
                  onEdit={() => setEditing(e)}
                  onDelete={() => remove.ask(e.id, `la dépense de ${formatMoney(e.amount)} du ${formatDate(e.date)}`)}
                />
              ),
            },
          ]}
        />
      )}

      <ExpenseModal key={creating.key} open={creating.open} prefill={creating.prefill} onClose={creating.close} />
      {editing && <ExpenseModal key={editing.id} open editing={editing} onClose={() => setEditing(null)} />}
      {remove.dialog}
    </div>
  );
}

function ExpenseModal({
  open,
  onClose,
  prefill,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  prefill?: Prefill;
  editing?: Expense;
}) {
  const { bind, values, reset, setValues } = useForm({
    date: toDateInput(editing?.date),
    category: editing?.category ?? 'FEED',
    amount: editing ? String(editing.amount) : '',
    description: editing?.description ?? '',
    supplier: editing?.supplier ?? '',
    reference: editing?.reference ?? '',
    paymentMethod: editing?.paymentMethod ?? 'CASH',
    observation: editing?.observation ?? '',
    ...prefill,
  });
  const [save, { loading, error, reset: resetMutation }] = useMutation(editing ? UPDATE : CREATE, {
    refetchQueries: ['Expenses', 'Dashboard'],
  });
  const payload = { ...values, date: fromDateInput(values.date), amount: toFloat(values.amount) };
  const create = () =>
    save({
      variables: {
        input: editing
          ? { id: editing.id, ...cleanEdit(payload, ['description', 'supplier', 'reference', 'observation']) }
          : clean(payload),
      },
    });
  const close = () => {
    reset();
    resetMutation();
    onClose();
  };
  return (
    <Modal
      open={open}
      title={editing ? 'Modifier la dépense' : 'Nouvelle dépense'}
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button
            loading={loading}
            disabled={!values.amount}
            onClick={() => create().then(close).catch(() => undefined)}
          >
            Enregistrer
          </Button>
        </>
      }
    >
      {!editing && <AiFill form="EXPENSE" onFill={(fields) => setValues((previous) => ({ ...previous, ...fields }))} />}
      <FormGrid>
        <Field label="Date">
          <Input type="date" {...bind('date')} />
        </Field>
        <Field label="Catégorie">
          <Select options={options(EXPENSE_CATEGORY)} {...bind('category')} />
        </Field>
        <Field label={`Montant (${CURRENCY})`}>
          <Input inputMode="decimal" {...bind('amount')} />
        </Field>
        <Field label="Moyen de paiement">
          <Select options={options(PAYMENT_METHOD)} {...bind('paymentMethod')} />
        </Field>
        <Field label="Description">
          <Input {...bind('description')} />
        </Field>
        <Field label="Fournisseur">
          <Input {...bind('supplier')} />
        </Field>
        <Field label="Référence / facture">
          <Input {...bind('reference')} />
        </Field>
      </FormGrid>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}
