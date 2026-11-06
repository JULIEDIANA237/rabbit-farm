'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import {
  Badge, Button, ErrorBox, Field, FormGrid, Input, Loading, Modal, PageHeader, Select, Table, Tabs, Textarea,
} from '@/components/ui/kit';
import { useLitterOptions, useLotOptions } from '@/graphql/options';
import { toFloat, toInt, useForm, useOpenFromQuery } from '@/hooks/use-form';
import { clean, formatDate, formatNumber, fromDateInput, toDateInput } from '@/lib/format';

const WEANINGS = gql`
  query Weanings {
    weanings {
      id
      litterId
      litterCode
      plannedDate
      actualDate
      quantity
      averageWeight
      totalWeight
      observation
    }
  }
`;
const CREATE = gql`
  mutation CreateWeaning($input: CreateWeaningInput!) { createWeaning(input: $input) { id } }
`;
const COMPLETE = gql`
  mutation CompleteWeaning($input: CompleteWeaningInput!) { completeWeaning(input: $input) { id } }
`;

interface Weaning {
  id: string;
  litterId: string;
  litterCode?: string | null;
  plannedDate: string;
  actualDate?: string | null;
  quantity: number;
  averageWeight?: number | null;
  totalWeight?: number | null;
}

const refetchQueries = ['Weanings', 'Dashboard', 'LitterOptions'];

export default function WeaningPage() {
  const [tab, setTab] = useState<'planned' | 'done'>('planned');
  const [creating, setCreating] = useState(false);
  const [completing, setCompleting] = useState<Weaning | null>(null);
  useOpenFromQuery(() => setCreating(true));

  const { data, loading, error, refetch } = useQuery<{ weanings: Weaning[] }>(WEANINGS);
  const rows = (data?.weanings ?? []).filter((w) => (tab === 'planned' ? !w.actualDate : !!w.actualDate));

  return (
    <div>
      <PageHeader
        eyebrow="Sevrage"
        title="Sevrages"
        description="Sevrage à J+35 par défaut. Les lapereaux sevrés peuvent rejoindre un lot d'engraissement."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus size={16} /> Nouveau sevrage
          </Button>
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'planned', label: 'Planifiés' },
          { value: 'done', label: 'Réalisés' },
        ]}
      />
      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : (
        <Table
          rows={rows}
          empty={tab === 'planned' ? 'Aucun sevrage planifié' : 'Aucun sevrage réalisé'}
          columns={[
            {
              header: 'Portée',
              cell: (w) => <Link className="font-semibold text-emerald-700" href={`/litters/${w.litterId}`}>{w.litterCode ?? '—'}</Link>,
            },
            { header: 'Prévu le', cell: (w) => formatDate(w.plannedDate) },
            { header: 'Réalisé le', cell: (w) => (w.actualDate ? <Badge tone="green">{formatDate(w.actualDate)}</Badge> : '—') },
            { header: 'Quantité', cell: (w) => w.quantity },
            { header: 'Poids moyen', cell: (w) => (w.averageWeight != null ? `${formatNumber(w.averageWeight, 3)} kg` : '—') },
            {
              header: '',
              cell: (w) => !w.actualDate && <Button className="px-3 py-1 text-xs" onClick={() => setCompleting(w)}>Réaliser</Button>,
            },
          ]}
        />
      )}
      <WeaningModal open={creating} onClose={() => setCreating(false)} />
      {completing && <WeaningModal open weaning={completing} onClose={() => setCompleting(null)} />}
    </div>
  );
}

function WeaningModal({ open, weaning, onClose }: { open: boolean; weaning?: Weaning; onClose: () => void }) {
  const litters = useLitterOptions();
  const lots = useLotOptions();
  const { bind, values, reset } = useForm({
    litterId: '',
    plannedDate: toDateInput(),
    done: weaning ? 'yes' : 'no',
    actualDate: toDateInput(),
    quantity: weaning ? String(weaning.quantity) : '',
    averageWeight: '',
    totalWeight: '',
    fatteningLotId: '',
    observation: '',
  });
  const [create, c] = useMutation(CREATE, { refetchQueries });
  const [complete, k] = useMutation(COMPLETE, { refetchQueries });
  const mutation = weaning ? k : c;

  const close = () => {
    reset();
    c.reset();
    k.reset();
    onClose();
  };

  const selectedLitter = litters.litters.find((l) => l.id === values.litterId);
  const done = weaning || values.done === 'yes';

  async function submit() {
    const common = {
      quantity: toInt(values.quantity),
      averageWeight: toFloat(values.averageWeight),
      totalWeight: toFloat(values.totalWeight),
      fatteningLotId: values.fatteningLotId,
      observation: values.observation,
    };
    if (weaning) {
      await complete({ variables: { input: clean({ id: weaning.id, actualDate: fromDateInput(values.actualDate), ...common }) } });
    } else {
      await create({
        variables: {
          input: clean({
            litterId: values.litterId,
            plannedDate: fromDateInput(values.plannedDate),
            actualDate: done ? fromDateInput(values.actualDate) : undefined,
            ...common,
            quantity: common.quantity ?? selectedLitter?.currentCount ?? 0,
          }),
        },
      });
    }
    close();
  }

  return (
    <Modal
      open={open}
      title={weaning ? `Réaliser le sevrage ${weaning.litterCode ?? ''}` : 'Nouveau sevrage'}
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button loading={mutation.loading} onClick={() => submit().catch(() => undefined)}>Enregistrer</Button>
        </>
      }
    >
      <FormGrid>
        {!weaning && (
          <>
            <Field label="Portée">
              <Select placeholder="Choisir…" options={litters.options} {...bind('litterId')} />
            </Field>
            <Field label="Date prévue">
              <Input type="date" {...bind('plannedDate')} />
            </Field>
            <Field label="Déjà réalisé ?">
              <Select options={[{ value: 'no', label: 'Non, planifier' }, { value: 'yes', label: 'Oui, sevrer maintenant' }]} {...bind('done')} />
            </Field>
          </>
        )}
        {done && (
          <Field label="Date de sevrage">
            <Input type="date" {...bind('actualDate')} />
          </Field>
        )}
        <Field label="Nombre de lapereaux">
          <Input type="number" min={1} placeholder={selectedLitter ? String(selectedLitter.currentCount) : ''} {...bind('quantity')} />
        </Field>
        {done && (
          <>
            <Field label="Poids moyen (kg)">
              <Input inputMode="decimal" {...bind('averageWeight')} />
            </Field>
            <Field label="Poids total (kg)">
              <Input inputMode="decimal" {...bind('totalWeight')} />
            </Field>
            <Field label="Lot d’engraissement">
              <Select placeholder="Aucun" options={lots.options} {...bind('fatteningLotId')} />
            </Field>
          </>
        )}
      </FormGrid>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={mutation.error} />
    </Modal>
  );
}
