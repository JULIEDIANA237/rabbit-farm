'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { ExternalLink } from 'lucide-react';

import { Button, ErrorBox, Field, FormGrid, Input, Modal, Textarea } from '@/components/ui/kit';
import { RowActions } from '@/components/ui/row-actions';
import { DELETE_HEALTH_RECORD, HealthRecordModal, type EditableHealthRecord } from '@/components/health/health-record-modal';
import { formatDate, fromDateInput, toDateInput } from '@/lib/format';

export interface HistoryEvent {
  date: string;
  type: string;
  title: string;
  detail?: string | null;
  referenceId?: string | null;
  recordId?: string | null;
  note?: string | null;
  weightKg?: number | null;
}

const UPDATE_EVENT = gql`
  mutation UpdateRabbitHistoryEvent($input: UpdateRabbitHistoryInput!) { updateRabbitHistoryEvent(input: $input) }
`;
const DELETE_EVENT = gql`
  mutation DeleteRabbitHistoryEvent($rabbitId: ID!, $type: String!, $recordId: ID!) {
    deleteRabbitHistoryEvent(rabbitId: $rabbitId, type: $type, recordId: $recordId)
  }
`;
const UPDATE_WEIGHING = gql`
  mutation UpdateRabbitWeighing($input: UpdateWeighingInput!) { updateWeighing(input: $input) { id } }
`;
const DELETE_WEIGHING = gql`
  mutation DeleteRabbitWeighing($id: ID!) { deleteWeighing(id: $id) }
`;
const DELETE_BREEDING = gql`
  mutation DeleteRabbitBreeding($id: ID!) { deleteBreeding(id: $id) }
`;
const CANCEL_EXIT = gql`
  mutation CancelExitFromHistory($rabbitId: ID!) { cancelRabbitExit(rabbitId: $rabbitId) { id status } }
`;
const HEALTH_RECORD = gql`
  query HistoryHealthRecord($id: ID!) {
    healthRecordsByRabbit(rabbitId: $id) { id rabbitId type date symptoms suspicion diagnosis treatment medication dosage nextDueDate observation }
  }
`;

const REFETCH = ['RabbitTrace', 'Rabbit', 'RabbitHealth', 'Dashboard', 'Tasks', 'FarmStructure'];

/** Ce qu'on peut faire sur chaque type d'événement. */
const EDIT_HERE = ['CAGE', 'LOT', 'EXIT', 'WEIGHING', 'HEALTH'];
const DELETE_HERE = ['CAGE', 'LOT', 'WEANING', 'ADOPTION', 'EXIT', 'WEIGHING', 'HEALTH', 'BREEDING'];

/** Page où l'événement se modifie en entier. */
function sourceHref(e: HistoryEvent) {
  switch (e.type) {
    case 'BIRTH':
      return e.referenceId ? `/litters/${e.referenceId}` : null;
    case 'BREEDING':
      return '/breeding';
    case 'SALE':
      return '/sales';
    case 'WEANING':
      return '/weaning';
    case 'LOT':
      return e.referenceId ? `/fattening/${e.referenceId}` : '/fattening';
    default:
      return null;
  }
}

/**
 * Boutons Modifier / Supprimer d'une ligne de l'historique d'un lapin.
 * Les événements partagés (vente, portée…) renvoient vers leur page.
 */
export function HistoryEventActions({ rabbitId, event }: { rabbitId: string; event: HistoryEvent }) {
  const client = useApolloClient();
  const [editing, setEditing] = useState(false);
  const [health, setHealth] = useState<EditableHealthRecord | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const canEdit = EDIT_HERE.includes(event.type) && Boolean(event.recordId);
  const targetId = event.type === 'BREEDING' ? event.referenceId : event.recordId;
  const canDelete = DELETE_HERE.includes(event.type) && Boolean(targetId);
  const href = sourceHref(event);

  async function openEdit() {
    if (event.type !== 'HEALTH') {
      setEditing(true);
      return;
    }
    const { data } = await client.query<{ healthRecordsByRabbit: EditableHealthRecord[] }>({
      query: HEALTH_RECORD,
      variables: { id: rabbitId },
      fetchPolicy: 'network-only',
    });
    const record = data?.healthRecordsByRabbit.find((r) => r.id === event.recordId);
    if (record) setHealth(record);
  }

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      const id = targetId;
      if (event.type === 'WEIGHING') {
        await client.mutate({ mutation: DELETE_WEIGHING, variables: { id } });
      } else if (event.type === 'HEALTH') {
        await client.mutate({ mutation: DELETE_HEALTH_RECORD, variables: { id } });
      } else if (event.type === 'BREEDING') {
        await client.mutate({ mutation: DELETE_BREEDING, variables: { id } });
      } else if (event.type === 'EXIT') {
        await client.mutate({ mutation: CANCEL_EXIT, variables: { rabbitId } });
      } else {
        await client.mutate({ mutation: DELETE_EVENT, variables: { rabbitId, type: event.type, recordId: id } });
      }
      await client.refetchQueries({ include: REFETCH });
      setConfirming(false);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Suppression impossible'));
    } finally {
      setBusy(false);
    }
  }

  if (!canEdit && !canDelete && !href) return null;

  return (
    <>
      <RowActions onEdit={canEdit ? () => void openEdit() : undefined} onDelete={canDelete ? () => setConfirming(true) : undefined}>
        {href && (
          <Link
            href={href}
            title="Ouvrir"
            aria-label="Ouvrir"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-emerald-700"
          >
            <ExternalLink size={16} />
          </Link>
        )}
      </RowActions>

      {confirming && (
        <Modal
          open
          title={event.type === 'EXIT' ? 'Annuler la sortie' : 'Supprimer de l’historique'}
          onClose={() => setConfirming(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirming(false)}>Annuler</Button>
              <Button variant="danger" loading={busy} onClick={() => void remove()}>
                {event.type === 'EXIT' ? 'Annuler la sortie' : 'Supprimer'}
              </Button>
            </>
          }
        >
          <p className="text-sm text-slate-700">
            {event.type === 'EXIT' ? 'Annuler' : 'Supprimer'} <strong>{event.title}</strong> du {formatDate(event.date)} ?
          </p>
          <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{deleteHint(event.type)}</p>
          <ErrorBox error={error} />
        </Modal>
      )}

      {editing && <EditEventModal rabbitId={rabbitId} event={event} onClose={() => setEditing(false)} />}
      {health && <HealthRecordModal key={health.id} open editing={health} onClose={() => setHealth(null)} />}
    </>
  );
}

function deleteHint(type: string) {
  switch (type) {
    case 'CAGE':
      return 'Si c’est sa cage actuelle, le lapin retourne dans sa cage précédente.';
    case 'EXIT':
      return 'Le lapin redevient actif et retrouve sa cage et son lot.';
    case 'BREEDING':
      return 'La saillie est supprimée avec ses palpations, sa mise bas et ses tâches. Les lapereaux déjà nés restent.';
    case 'WEANING':
    case 'ADOPTION':
      return 'Le lapin est seulement retiré de cet événement ; le reste de la portée n’est pas modifié.';
    default:
      return 'Cette ligne sera supprimée définitivement.';
  }
}

function EditEventModal({ rabbitId, event, onClose }: { rabbitId: string; event: HistoryEvent; onClose: () => void }) {
  const [date, setDate] = useState(toDateInput(event.date));
  const [note, setNote] = useState(event.note ?? '');
  const [weight, setWeight] = useState(event.weightKg != null ? String(event.weightKg).replace('.', ',') : '');
  const [updateEvent, updateState] = useMutation(UPDATE_EVENT, { refetchQueries: REFETCH, awaitRefetchQueries: true });
  const [updateWeighing, weighingState] = useMutation(UPDATE_WEIGHING, { refetchQueries: REFETCH, awaitRefetchQueries: true });
  const isWeighing = event.type === 'WEIGHING';
  const weightKg = Number(weight.replace(',', '.'));
  const noteLabel = event.type === 'EXIT' ? 'Cause' : event.type === 'LOT' ? null : 'Observation';

  function save() {
    const run = isWeighing
      ? updateWeighing({
          variables: {
            input: {
              id: event.recordId,
              date: fromDateInput(date),
              totalWeight: weightKg,
              animalCount: 1,
              averageWeight: weightKg,
              observation: note,
            },
          },
        })
      : updateEvent({
          variables: {
            input: {
              rabbitId,
              type: event.type,
              recordId: event.recordId,
              date: fromDateInput(date),
              ...(noteLabel ? { note } : {}),
            },
          },
        });
    run.then(onClose).catch(() => undefined);
  }

  return (
    <Modal
      open
      title={`Modifier : ${event.title}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button
            loading={updateState.loading || weighingState.loading}
            disabled={!date || (isWeighing && !(weightKg > 0))}
            onClick={save}
          >
            Enregistrer
          </Button>
        </>
      }
    >
      <FormGrid>
        <Field label="Date">
          <Input type="date" value={date} max={toDateInput()} onChange={(e) => setDate(e.target.value)} />
        </Field>
        {isWeighing && (
          <Field label="Poids (kg)">
            <Input inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </Field>
        )}
      </FormGrid>
      {(noteLabel || isWeighing) && (
        <Field label={noteLabel ?? 'Observation'}>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      )}
      <ErrorBox error={updateState.error ?? weighingState.error} />
    </Modal>
  );
}
