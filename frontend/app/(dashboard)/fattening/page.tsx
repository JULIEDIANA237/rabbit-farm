'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import { Badge, Button, ErrorBox, Field, FormGrid, Input, Loading, Modal, PageHeader, Table, Textarea } from '@/components/ui/kit';
import { useForm } from '@/hooks/use-form';
import { clean, formatDate, formatNumber, fromDateInput, toDateInput } from '@/lib/format';
import { LOT_STATUS, label } from '@/lib/labels';

const LOTS = gql`
  query FatteningLots {
    fatteningLots {
      id
      code
      status
      entryDate
      exitDate
      activeMemberCount
      currentCageCode
      latestAverageWeight
      latestWeighingDate
    }
  }
`;
const CREATE = gql`
  mutation CreateLot($input: CreateFatteningLotInput!) { createFatteningLot(input: $input) { id } }
`;

interface Lot {
  id: string;
  code: string;
  status: string;
  entryDate: string;
  exitDate?: string | null;
  activeMemberCount: number;
  currentCageCode?: string | null;
  latestAverageWeight?: number | null;
  latestWeighingDate?: string | null;
}

export default function FatteningPage() {
  const [creating, setCreating] = useState(false);
  const { data, loading, error, refetch } = useQuery<{ fatteningLots: Lot[] }>(LOTS);
  const { bind, values, reset } = useForm({ code: '', entryDate: toDateInput(), observation: '' });
  const [create, c] = useMutation(CREATE, { refetchQueries: ['FatteningLots', 'LotOptions'] });

  const close = () => {
    reset();
    c.reset();
    setCreating(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Engraissement"
        title="Lots d'engraissement"
        description="Suivi des lots : effectifs, cage, pesées et ventes."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus size={16} /> Nouveau lot
          </Button>
        }
      />
      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : (
        <Table
          rows={data?.fatteningLots ?? []}
          empty="Aucun lot"
          columns={[
            { header: 'Lot', cell: (l) => <Link className="font-semibold text-emerald-700" href={`/fattening/${l.id}`}>{l.code}</Link> },
            { header: 'Entrée', cell: (l) => formatDate(l.entryDate) },
            { header: 'Lapins', cell: (l) => l.activeMemberCount },
            { header: 'Cage', cell: (l) => l.currentCageCode ?? '—' },
            {
              header: 'Dernier poids moyen',
              cell: (l) => (l.latestAverageWeight != null ? `${formatNumber(l.latestAverageWeight, 3)} kg (${formatDate(l.latestWeighingDate)})` : '—'),
            },
            { header: 'Statut', cell: (l) => <Badge tone={l.status === 'ACTIVE' ? 'green' : 'slate'}>{label(LOT_STATUS, l.status)}</Badge> },
          ]}
        />
      )}
      <Modal
        open={creating}
        title="Nouveau lot"
        onClose={close}
        footer={
          <>
            <Button variant="secondary" onClick={close}>Annuler</Button>
            <Button
              loading={c.loading}
              disabled={!values.code}
              onClick={() =>
                create({ variables: { input: clean({ ...values, entryDate: fromDateInput(values.entryDate) }) } })
                  .then(close)
                  .catch(() => undefined)
              }
            >
              Créer
            </Button>
          </>
        }
      >
        <FormGrid>
          <Field label="Code du lot">
            <Input placeholder="LOT-2026-01" {...bind('code')} />
          </Field>
          <Field label="Date d'entrée">
            <Input type="date" {...bind('entryDate')} />
          </Field>
        </FormGrid>
        <Field label="Observation">
          <Textarea {...bind('observation')} />
        </Field>
        <ErrorBox error={c.error} />
      </Modal>
    </div>
  );
}
