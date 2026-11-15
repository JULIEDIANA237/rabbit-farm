'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus, Trash2 } from 'lucide-react';

import {
  Badge, Button, Card, ErrorBox, Field, FormGrid, Grid, Input, Loading, Modal, PageHeader, Select, Stat, Table, Tabs, Textarea,
  type BadgeTone,
} from '@/components/ui/kit';
import { useCustomerOptions, useLotOptions, useRabbitOptions } from '@/graphql/options';
import { toFloat, toInt, useForm, useOpenFromQuery } from '@/hooks/use-form';
import { CURRENCY, clean, cleanEdit, formatDate, formatMoney, fromDateInput, toDateInput } from '@/lib/format';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';
import { PAYMENT_METHOD, SALE_STATUS, label, options } from '@/lib/labels';

const SALES = gql`
  query Sales {
    sales {
      id
      saleDate
      status
      customerId
      customerName
      totalAmount
      paidAmount
      remainingAmount
      observation
      items { id description quantity unitPrice totalPrice weightKg pricePerKg rabbitCode lotCode }
      payments { id amount paymentDate method reference }
    }
    customers {
      id
      name
      phone
      email
      address
      notes
      saleCount
      totalPurchases
      totalPaid
      outstandingBalance
    }
  }
`;
const CREATE_SALE = gql`
  mutation CreateSale($input: CreateSaleInput!) { createSale(input: $input) { id } }
`;
const PAY = gql`
  mutation AddPayment($input: CreatePaymentInput!) { addPayment(input: $input) { id } }
`;
const CANCEL = gql`
  mutation CancelSale($input: CancelSaleInput!) { cancelSale(input: $input) { id } }
`;
const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) { createCustomer(input: $input) { id } }
`;
const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput!) { updateCustomer(input: $input) { id } }
`;
const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) { deleteCustomer(id: $id) }
`;
const UPDATE_SALE = gql`
  mutation UpdateSale($input: UpdateSaleInput!) { updateSale(input: $input) { id } }
`;
const DELETE_SALE = gql`
  mutation DeleteSale($id: ID!) { deleteSale(id: $id) }
`;
const DELETE_PAYMENT = gql`
  mutation DeletePayment($id: ID!) { deletePayment(id: $id) }
`;

interface Sale {
  id: string;
  saleDate: string;
  status: string;
  customerId?: string | null;
  customerName?: string | null;
  observation?: string | null;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  items: Array<{ id: string; description: string; quantity: number; totalPrice: number; weightKg?: number | null; pricePerKg?: number | null; rabbitCode?: string | null; lotCode?: string | null }>;
  payments: Array<{ id: string; amount: number; paymentDate: string; method: string }>;
}

interface Customer {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  saleCount: number;
  totalPurchases: number;
  totalPaid: number;
  outstandingBalance: number;
}

const STATUS_TONE: Record<string, BadgeTone> = { UNPAID: 'red', PARTIALLY_PAID: 'amber', PAID: 'green', CANCELLED: 'slate' };
const refetchQueries = ['Sales', 'Dashboard', 'RabbitOptions', 'LotOptions'];

function initialLotId() {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('lotId') ?? '';
}

/** Lapins à vendre passés par l'URL (depuis « Prêts pour la vente »). */
function initialRabbitIds() {
  if (typeof window === 'undefined') return [] as string[];
  return (new URLSearchParams(window.location.search).get('rabbitIds') ?? '').split(',').filter(Boolean);
}

export default function SalesPage() {
  const [tab, setTab] = useState<'sales' | 'customers'>('sales');
  const [creating, setCreating] = useState(false);
  const [lotId] = useState(initialLotId);
  const [rabbitIds] = useState(initialRabbitIds);
  const [paying, setPaying] = useState<Sale | null>(null);
  const [newCustomer, setNewCustomer] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const removeSale = useDeleteAction(DELETE_SALE, { refetchQueries });
  const removeCustomer = useDeleteAction(DELETE_CUSTOMER, { refetchQueries: ['Sales', 'CustomerOptions'] });
  useOpenFromQuery(() => setCreating(true));

  const { data, loading, error, refetch } = useQuery<{ sales: Sale[]; customers: Customer[] }>(SALES);
  const [cancel] = useMutation(CANCEL, { refetchQueries });

  const sales = data?.sales ?? [];
  const valid = sales.filter((s) => s.status !== 'CANCELLED');

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ventes"
        title="Ventes et clients"
        description="Vente à l'unité, au poids ou par lot ; paiements partiels et soldes clients."
        actions={
          <>
            <Button variant="secondary" onClick={() => setNewCustomer(true)}>Nouveau client</Button>
            <Button onClick={() => setCreating(true)}>
              <Plus size={16} /> Nouvelle vente
            </Button>
          </>
        }
      />

      <Grid>
        <Stat label="Chiffre d'affaires" value={formatMoney(valid.reduce((s, x) => s + x.totalAmount, 0))} tone="success" />
        <Stat label="Encaissé" value={formatMoney(valid.reduce((s, x) => s + x.paidAmount, 0))} />
        <Stat label="Reste à encaisser" value={formatMoney(valid.reduce((s, x) => s + x.remainingAmount, 0))} tone="warning" />
        <Stat label="Ventes" value={valid.length} />
      </Grid>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'sales', label: 'Ventes' },
          { value: 'customers', label: 'Clients' },
        ]}
      />
      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : tab === 'sales' ? (
        <Table
          rows={sales}
          empty="Aucune vente"
          columns={[
            { header: 'Date', cell: (s) => formatDate(s.saleDate) },
            { header: 'Client', cell: (s) => s.customerName ?? '—' },
            {
              header: 'Articles',
              cell: (s) => (
                <span className="whitespace-normal text-xs">
                  {s.items.map((i) => `${i.description}${i.weightKg ? ` (${i.weightKg} kg)` : ''}`).join(', ')}
                </span>
              ),
            },
            { header: 'Total', cell: (s) => <strong>{formatMoney(s.totalAmount)}</strong> },
            { header: 'Reste', cell: (s) => formatMoney(s.remainingAmount) },
            { header: 'Statut', cell: (s) => <Badge tone={STATUS_TONE[s.status]}>{label(SALE_STATUS, s.status)}</Badge> },
            {
              header: '',
              cell: (s) => (
                <RowActions
                  onEdit={() => setEditingSale(s)}
                  onDelete={() =>
                    removeSale.ask(
                      s.id,
                      `la vente du ${formatDate(s.saleDate)} (${formatMoney(s.totalAmount)})`,
                      s.status !== 'CANCELLED'
                        ? `Ses paiements seront supprimés et les lapins ou lots vendus redeviendront actifs.`
                        : undefined,
                    )
                  }
                >
                  {s.status !== 'CANCELLED' && (
                    <>
                      {/* Même onglet : dans l'app installée, un nouvel onglet n'a pas de bouton retour. */}
                      <Link
                        href={`/print/invoice/${s.id}`}
                        className="rounded-xl border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {s.remainingAmount > 0 ? 'Facture' : 'Reçu'}
                      </Link>
                      {s.remainingAmount > 0 && (
                        <Button className="px-3 py-1 text-xs" onClick={() => setPaying(s)}>Paiement</Button>
                      )}
                      {s.payments.length === 0 && (
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs text-red-600"
                          onClick={() => {
                            const reason = window.prompt("Motif d'annulation ?");
                            if (reason === null) return;
                            cancel({ variables: { input: { id: s.id, reason } } }).catch((e) => window.alert(e.message));
                          }}
                        >
                          Annuler
                        </Button>
                      )}
                    </>
                  )}
                </RowActions>
              ),
            },
          ]}
        />
      ) : (
        <Table
          rows={data?.customers ?? []}
          empty="Aucun client"
          columns={[
            { header: 'Client', cell: (c) => <strong>{c.name}</strong> },
            { header: 'Contact', cell: (c) => [c.phone, c.email].filter(Boolean).join(' · ') || '—' },
            { header: 'Ventes', cell: (c) => c.saleCount },
            { header: 'Achats', cell: (c) => formatMoney(c.totalPurchases) },
            { header: 'Payé', cell: (c) => formatMoney(c.totalPaid) },
            {
              header: 'Solde dû',
              cell: (c) => <span className={c.outstandingBalance > 0 ? 'font-semibold text-red-600' : ''}>{formatMoney(c.outstandingBalance)}</span>,
            },
            {
              header: '',
              cell: (c) => (
                <RowActions
                  onEdit={() => setEditingCustomer(c)}
                  onDelete={() =>
                    removeCustomer.ask(c.id, `le client « ${c.name} »`, c.saleCount ? `Ses ${c.saleCount} vente(s) sont conservées, sans client associé.` : undefined)
                  }
                />
              ),
            },
          ]}
        />
      )}

      <SaleModal open={creating} initialLotId={lotId} initialRabbitIds={rabbitIds} onClose={() => setCreating(false)} />
      {paying && <PaymentModal sale={paying} onClose={() => setPaying(null)} />}
      <CustomerModal open={newCustomer} onClose={() => setNewCustomer(false)} />
      {editingCustomer && <CustomerModal key={editingCustomer.id} open editing={editingCustomer} onClose={() => setEditingCustomer(null)} />}
      {editingSale && (
        <SaleEditModal
          key={editingSale.id}
          sale={sales.find((x) => x.id === editingSale.id) ?? editingSale}
          onClose={() => setEditingSale(null)}
        />
      )}
      {removeSale.dialog}
      {removeCustomer.dialog}
    </div>
  );
}

type Line = { kind: 'rabbit' | 'lot' | 'other'; rabbitId: string; lotId: string; description: string; mode: 'unit' | 'weight'; quantity: string; unitPrice: string; weightKg: string; pricePerKg: string };

const emptyLine = (lotId = ''): Line => ({
  kind: lotId ? 'lot' : 'rabbit',
  rabbitId: '',
  lotId,
  description: '',
  mode: lotId ? 'weight' : 'unit',
  quantity: '1',
  unitPrice: '',
  weightKg: '',
  pricePerKg: '',
});

function lineTotal(l: Line) {
  if (l.mode === 'weight') return (toFloat(l.weightKg) ?? 0) * (toFloat(l.pricePerKg) ?? 0);
  return (toInt(l.quantity) ?? 1) * (toFloat(l.unitPrice) ?? 0);
}

function SaleModal({
  open,
  initialLotId,
  initialRabbitIds = [],
  onClose,
}: {
  open: boolean;
  initialLotId: string;
  initialRabbitIds?: string[];
  onClose: () => void;
}) {
  const rabbits = useRabbitOptions();
  const lots = useLotOptions();
  const customers = useCustomerOptions();
  const { bind, values, reset } = useForm({ saleDate: toDateInput(), customerId: '', observation: '' });
  const [lines, setLines] = useState<Line[]>(() =>
    initialRabbitIds.length ? initialRabbitIds.map((rabbitId) => ({ ...emptyLine(), rabbitId })) : [emptyLine(initialLotId)],
  );
  const [create, { loading, error, reset: resetMutation }] = useMutation(CREATE_SALE, { refetchQueries });

  const update = (index: number, patch: Partial<Line>) => setLines((ls) => ls.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  const close = () => {
    reset();
    resetMutation();
    setLines([emptyLine()]);
    onClose();
  };

  async function submit() {
    await create({
      variables: {
        input: clean({
          saleDate: fromDateInput(values.saleDate),
          customerId: values.customerId,
          observation: values.observation,
          items: lines.map((l) =>
            clean({
              rabbitId: l.kind === 'rabbit' ? l.rabbitId : undefined,
              lotId: l.kind === 'lot' ? l.lotId : undefined,
              description: l.description,
              quantity: l.kind === 'other' && l.mode === 'unit' ? toInt(l.quantity) : undefined,
              unitPrice: l.mode === 'unit' ? toFloat(l.unitPrice) : undefined,
              weightKg: l.mode === 'weight' ? toFloat(l.weightKg) : undefined,
              pricePerKg: l.mode === 'weight' ? toFloat(l.pricePerKg) : undefined,
            }),
          ),
        }),
      },
    });
    close();
  }

  const total = lines.reduce((s, l) => s + lineTotal(l), 0);

  return (
    <Modal
      open={open}
      title="Nouvelle vente"
      onClose={close}
      footer={
        <>
          <span className="mr-auto self-center text-sm font-semibold">Total estimé : {formatMoney(total)}</span>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button loading={loading} onClick={() => submit().catch(() => undefined)}>Enregistrer</Button>
        </>
      }
    >
      <FormGrid>
        <Field label="Date">
          <Input type="date" {...bind('saleDate')} />
        </Field>
        <Field label="Client">
          <Select placeholder="Client de passage" options={customers.options} {...bind('customerId')} />
        </Field>
      </FormGrid>

      {lines.map((l, i) => (
        <Card key={i} className="!p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Article">
              <Select
                options={[
                  { value: 'rabbit', label: 'Lapin identifié' },
                  { value: 'lot', label: "Lot d'engraissement" },
                  { value: 'other', label: 'Autre (fumier, peaux…)' },
                ]}
                value={l.kind}
                onChange={(e) => update(i, { kind: e.target.value as Line['kind'], mode: e.target.value === 'lot' ? 'weight' : l.mode })}
              />
            </Field>
            {l.kind === 'rabbit' && (
              <Field label="Lapin">
                <Select placeholder="Choisir…" options={rabbits.options} value={l.rabbitId} onChange={(e) => update(i, { rabbitId: e.target.value })} />
              </Field>
            )}
            {l.kind === 'lot' && (
              <Field label="Lot">
                <Select placeholder="Choisir…" options={lots.options} value={l.lotId} onChange={(e) => update(i, { lotId: e.target.value })} />
              </Field>
            )}
            {l.kind === 'other' && (
              <Field label="Description">
                <Input value={l.description} onChange={(e) => update(i, { description: e.target.value })} />
              </Field>
            )}
            <Field label="Mode de prix">
              <Select
                options={[
                  { value: 'unit', label: l.kind === 'lot' ? 'Prix par lapin' : 'Prix unitaire' },
                  { value: 'weight', label: 'Au poids (kg)' },
                ]}
                value={l.mode}
                onChange={(e) => update(i, { mode: e.target.value as Line['mode'] })}
              />
            </Field>
            {l.mode === 'unit' ? (
              <>
                {l.kind === 'other' && (
                  <Field label="Quantité">
                    <Input type="number" min={1} value={l.quantity} onChange={(e) => update(i, { quantity: e.target.value })} />
                  </Field>
                )}
                <Field label={`Prix unitaire (${CURRENCY})`}>
                  <Input inputMode="decimal" value={l.unitPrice} onChange={(e) => update(i, { unitPrice: e.target.value })} />
                </Field>
              </>
            ) : (
              <>
                <Field label="Poids total (kg)">
                  <Input inputMode="decimal" value={l.weightKg} onChange={(e) => update(i, { weightKg: e.target.value })} />
                </Field>
                <Field label={`Prix au kg (${CURRENCY})`}>
                  <Input inputMode="decimal" value={l.pricePerKg} onChange={(e) => update(i, { pricePerKg: e.target.value })} />
                </Field>
              </>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">Sous-total : {formatMoney(lineTotal(l))}</span>
            {lines.length > 1 && (
              <Button variant="ghost" className="px-2 py-1 text-red-600" onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}>
                <Trash2 size={14} /> Retirer
              </Button>
            )}
          </div>
        </Card>
      ))}
      <Button variant="secondary" onClick={() => setLines((ls) => [...ls, emptyLine()])}>
        <Plus size={14} /> Ajouter un article
      </Button>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}

function PaymentModal({ sale, onClose }: { sale: Sale; onClose: () => void }) {
  const { bind, values } = useForm({
    amount: String(sale.remainingAmount),
    paymentDate: toDateInput(),
    method: 'CASH',
    reference: '',
  });
  const [pay, { loading, error }] = useMutation(PAY, { refetchQueries });

  return (
    <Modal
      open
      title={`Paiement — reste ${formatMoney(sale.remainingAmount)}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button
            loading={loading}
            onClick={() =>
              pay({
                variables: {
                  input: clean({
                    saleId: sale.id,
                    amount: toFloat(values.amount) ?? 0,
                    paymentDate: fromDateInput(values.paymentDate),
                    method: values.method,
                    reference: values.reference,
                  }),
                },
              })
                .then(onClose)
                .catch(() => undefined)
            }
          >
            Encaisser
          </Button>
        </>
      }
    >
      <FormGrid>
        <Field label={`Montant (${CURRENCY})`}>
          <Input inputMode="decimal" {...bind('amount')} />
        </Field>
        <Field label="Date">
          <Input type="date" {...bind('paymentDate')} />
        </Field>
        <Field label="Moyen de paiement">
          <Select options={options(PAYMENT_METHOD)} {...bind('method')} />
        </Field>
        <Field label="Référence">
          <Input placeholder="N° de transaction…" {...bind('reference')} />
        </Field>
      </FormGrid>
      {sale.payments.length > 0 && (
        <ul className="text-sm text-slate-600">
          {sale.payments.map((p) => (
            <li key={p.id}>
              {formatDate(p.paymentDate)} · {formatMoney(p.amount)} · {label(PAYMENT_METHOD, p.method)}
            </li>
          ))}
        </ul>
      )}
      <ErrorBox error={error} />
    </Modal>
  );
}

function CustomerModal({ open, onClose, editing }: { open: boolean; onClose: () => void; editing?: Customer }) {
  const { bind, values, reset } = useForm({
    name: editing?.name ?? '',
    phone: editing?.phone ?? '',
    email: editing?.email ?? '',
    address: editing?.address ?? '',
    notes: editing?.notes ?? '',
  });
  const [save, { loading, error, reset: resetMutation }] = useMutation(editing ? UPDATE_CUSTOMER : CREATE_CUSTOMER, {
    refetchQueries: ['Sales', 'CustomerOptions'],
  });
  const close = () => {
    reset();
    resetMutation();
    onClose();
  };
  return (
    <Modal
      open={open}
      title={editing ? `Modifier ${editing.name}` : 'Nouveau client'}
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button
            loading={loading}
            disabled={!values.name}
            onClick={() =>
              save({
                variables: {
                  input: editing ? { id: editing.id, ...cleanEdit(values, ['phone', 'email', 'address', 'notes']) } : clean(values),
                },
              })
                .then(close)
                .catch(() => undefined)
            }
          >
            {editing ? 'Enregistrer' : 'Créer'}
          </Button>
        </>
      }
    >
      <FormGrid>
        <Field label="Nom">
          <Input {...bind('name')} />
        </Field>
        <Field label="Téléphone">
          <Input type="tel" {...bind('phone')} />
        </Field>
        <Field label="Email">
          <Input type="email" {...bind('email')} />
        </Field>
        <Field label="Adresse">
          <Input {...bind('address')} />
        </Field>
      </FormGrid>
      <Field label="Notes">
        <Textarea {...bind('notes')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}

/** Correction d'une vente : date, client, observation et paiements. */
function SaleEditModal({ sale, onClose }: { sale: Sale; onClose: () => void }) {
  const customers = useCustomerOptions();
  const { bind, values } = useForm({
    saleDate: toDateInput(sale.saleDate),
    customerId: sale.customerId ?? '',
    observation: sale.observation ?? '',
  });
  const [save, { loading, error }] = useMutation(UPDATE_SALE, { refetchQueries });
  const removePayment = useDeleteAction(DELETE_PAYMENT, { refetchQueries });
  return (
    <Modal
      open
      title={`Modifier la vente du ${formatDate(sale.saleDate)}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Fermer</Button>
          <Button
            loading={loading}
            onClick={() =>
              save({ variables: { input: { id: sale.id, saleDate: fromDateInput(values.saleDate), customerId: values.customerId, observation: values.observation } } })
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
        <Field label="Date de vente">
          <Input type="date" {...bind('saleDate')} />
        </Field>
        <Field label="Client">
          <Select placeholder="Client de passage" options={customers.options} {...bind('customerId')} />
        </Field>
      </FormGrid>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <p className="text-xs text-slate-500">
        Pour changer les articles ou les prix, supprime la vente puis saisis-la à nouveau.
      </p>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Paiements</h3>
        <Table
          rows={sale.payments}
          empty="Aucun paiement"
          columns={[
            { header: 'Date', cell: (p) => formatDate(p.paymentDate) },
            { header: 'Montant', cell: (p) => <strong>{formatMoney(p.amount)}</strong> },
            { header: 'Moyen', cell: (p) => label(PAYMENT_METHOD, p.method) },
            {
              header: '',
              cell: (p) => (
                <RowActions onDelete={() => removePayment.ask(p.id, `le paiement de ${formatMoney(p.amount)} du ${formatDate(p.paymentDate)}`)} />
              ),
            },
          ]}
        />
      </div>
      <ErrorBox error={error} />
      {removePayment.dialog}
    </Modal>
  );
}
