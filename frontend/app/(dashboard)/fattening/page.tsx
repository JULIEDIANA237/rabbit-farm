'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import { Badge, Button, ErrorBox, Field, FormGrid, Input, Loading, Modal, PageHeader, Table, Textarea } from '@/components/ui/kit';
import { useForm } from '@/hooks/use-form';
import { clean, formatDate, formatNumber, fromDateInput, toDateInput } from '@/lib/format';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';
import { LOT_STATUS, label } from '@/lib/labels';

const LOTS = gql`
  query FatteningLots {
    fatteningLots {
      id
      code
      status
      entryDate
      exitDate
      observation
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
const UPDATE = gql`
  mutation UpdateLot($input: UpdateFatteningLotInput!) { updateFatteningLot(input: $input) { id } }
`;
const DELETE = gql`
  mutation DeleteLot($id: ID!) { deleteFatteningLot(id: $id) }
`;
const refetchQueries = ['FatteningLots', 'LotOptions'];

interface Lot {
  id: string;
  code: string;
  status: string;
  entryDate: string;
  exitDate?: string | null;
  observation?: string | null;
  activeMemberCount: number;
  currentCageCode?: string | null;
  latestAverageWeight?: number | null;
  latestWeighingDate?: string | null;
}

export default function FatteningPage() {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Lot | null>(null);
  const { data, loading, error, refetch } = useQuery<{ fatteningLots: Lot[] }>(LOTS);
  const remove = useDeleteAction(DELETE, { refetchQueries });

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
            {
              header: '',
              cell: (l) => (
                <RowActions
                  onEdit={() => setEditing(l)}
                  onDelete={() =>
                    remove.ask(l.id, `le lot ${l.code}`, 'Les lapins restent enregistrés ; l’historique du lot (membres, pesées du lot, cages) est supprimé.')
                  }
                />
              ),
            },
          ]}
        />
      )}
      {creating && <NewLotModal onClose={() => setCreating(false)} />}
      {editing && <LotModal key={editing.id} editing={editing} onClose={() => setEditing(null)} />}
      {remove.dialog}
    </div>
  );
}

const NEXT_LOT_CODE = gql`
  query NextFatteningLotCode { nextFatteningLotCode }
`;

/** Nouveau lot : le code libre suivant (LOT-01, LOT-02…) est déjà rempli. */
function NewLotModal({ onClose }: { onClose: () => void }) {
  const { data, error } = useQuery<{ nextFatteningLotCode: string }>(NEXT_LOT_CODE, { fetchPolicy: 'network-only' });
  if (error) return <LotModal initialCode="" onClose={onClose} />;
  if (!data) return null;
  return <LotModal initialCode={data.nextFatteningLotCode} onClose={onClose} />;
}

function LotModal({ onClose, editing, initialCode = '' }: { onClose: () => void; editing?: Lot; initialCode?: string }) {
  const { bind, values } = useForm({
    code: editing?.code ?? initialCode,
    entryDate: toDateInput(editing?.entryDate),
    observation: editing?.observation ?? '',
  });
  const [save, c] = useMutation(editing ? UPDATE : CREATE, { refetchQueries });
  const payload = { ...values, entryDate: fromDateInput(values.entryDate) };
  return (
    <Modal
      open
      title={editing ? `Modifier le lot ${editing.code}` : 'Nouveau lot'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button
            loading={c.loading}
            disabled={!values.code.trim()}
            onClick={() =>
              save({ variables: { input: editing ? { id: editing.id, ...payload } : clean(payload) } })
                .then(onClose)
                .catch(() => undefined)
            }
          >
            {editing ? 'Enregistrer' : 'Créer'}
          </Button>
        </>
      }
    >
      <FormGrid>
        <Field
          label="Code du lot (obligatoire)"
          hint={values.code.trim() ? (editing ? undefined : 'Proposé automatiquement : tu peux le changer.') : 'Saisis un code pour pouvoir créer le lot.'}
        >
          <Input placeholder="LOT-01" {...bind('code')} />
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
  );
}
