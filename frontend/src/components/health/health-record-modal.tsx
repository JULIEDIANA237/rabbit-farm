'use client';

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

import { Button, ErrorBox, Field, FormGrid, Input, Modal, Select, Textarea } from '@/components/ui/kit';
import { useRabbitOptions } from '@/graphql/options';
import { useForm, type Prefill } from '@/hooks/use-form';
import { AiFill } from '@/components/assistant/ai-fill';
import { clean, cleanEdit, fromDateInput, toDateInput } from '@/lib/format';
import { HEALTH_TYPE, options } from '@/lib/labels';

const CREATE = gql`
  mutation CreateHealthRecord($input: CreateHealthRecordInput!) { createHealthRecord(input: $input) { id } }
`;
const UPDATE = gql`
  mutation UpdateHealthRecord($input: UpdateHealthRecordInput!) { updateHealthRecord(input: $input) { id } }
`;
export const DELETE_HEALTH_RECORD = gql`
  mutation DeleteHealthRecord($id: ID!) { deleteHealthRecord(id: $id) }
`;

/** Fiche sanitaire à corriger. */
export interface EditableHealthRecord {
  id: string;
  rabbitId: string;
  type: string;
  date: string;
  symptoms?: string | null;
  suspicion?: string | null;
  diagnosis?: string | null;
  treatment?: string | null;
  medication?: string | null;
  dosage?: string | null;
  nextDueDate?: string | null;
  observation?: string | null;
}

const TEXT_FIELDS = ['symptoms', 'suspicion', 'diagnosis', 'treatment', 'medication', 'dosage', 'observation'] as const;

export function HealthRecordModal({
  open,
  onClose,
  rabbitId,
  rabbitCode,
  prefill,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  rabbitId?: string;
  rabbitCode?: string;
  prefill?: Prefill;
  editing?: EditableHealthRecord;
}) {
  const rabbits = useRabbitOptions();
  const fixedRabbit = rabbitId ?? editing?.rabbitId;
  const { bind, values, reset, setValues } = useForm({
    rabbitId: fixedRabbit ?? '',
    type: editing?.type ?? 'OBSERVATION',
    date: toDateInput(editing?.date),
    symptoms: editing?.symptoms ?? '',
    suspicion: editing?.suspicion ?? '',
    diagnosis: editing?.diagnosis ?? '',
    treatment: editing?.treatment ?? '',
    medication: editing?.medication ?? '',
    dosage: editing?.dosage ?? '',
    nextDueDate: editing?.nextDueDate ? toDateInput(editing.nextDueDate) : '',
    observation: editing?.observation ?? '',
    ...prefill,
    ...(fixedRabbit ? { rabbitId: fixedRabbit } : {}),
  });
  const [create, { loading, error, reset: resetMutation }] = useMutation(editing ? UPDATE : CREATE, {
    refetchQueries: ['HealthRecords', 'Dashboard', 'RabbitHealth'],
  });
  const close = () => {
    reset();
    resetMutation();
    onClose();
  };

  return (
    <Modal
      open={open}
      title={editing ? 'Modifier l’enregistrement sanitaire' : 'Nouvel enregistrement sanitaire'}
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button
            loading={loading}
            disabled={!values.rabbitId}
            onClick={() =>
              create({
                variables: {
                  input: editing
                    ? {
                        id: editing.id,
                        ...cleanEdit(
                          { ...values, rabbitId: undefined, date: fromDateInput(values.date), nextDueDate: undefined },
                          [...TEXT_FIELDS],
                        ),
                        nextDueDate: values.nextDueDate ? fromDateInput(values.nextDueDate) : null,
                      }
                    : clean({
                        ...values,
                        date: fromDateInput(values.date),
                        nextDueDate: values.nextDueDate ? fromDateInput(values.nextDueDate) : undefined,
                      }),
                },
              })
                .then(close)
                .catch(() => undefined)
            }
          >
            Enregistrer
          </Button>
        </>
      }
    >
      {!editing && <AiFill
        form="HEALTH"
        context={rabbitCode ? `Lapin concerné : ${rabbitCode}` : undefined}
        onFill={(fields) => setValues((previous) => ({ ...previous, ...fields, ...(rabbitId ? { rabbitId } : {}) }))}
      />}
      <FormGrid>
        {!fixedRabbit && (
          <Field label="Lapin">
            <Select placeholder="Choisir…" options={rabbits.options} {...bind('rabbitId')} />
          </Field>
        )}
        <Field label="Type">
          <Select options={options(HEALTH_TYPE)} {...bind('type')} />
        </Field>
        <Field label="Date">
          <Input type="date" {...bind('date')} />
        </Field>
        <Field label="Symptômes">
          <Input {...bind('symptoms')} />
        </Field>
        <Field label="Suspicion">
          <Input {...bind('suspicion')} />
        </Field>
        <Field label="Diagnostic">
          <Input {...bind('diagnosis')} />
        </Field>
        <Field label="Traitement">
          <Input {...bind('treatment')} />
        </Field>
        <Field label="Médicament / vaccin">
          <Input {...bind('medication')} />
        </Field>
        <Field label="Dosage">
          <Input {...bind('dosage')} />
        </Field>
        <Field label="Prochaine échéance" hint="Rappel, contrôle ou fin de traitement">
          <Input type="date" {...bind('nextDueDate')} />
        </Field>
      </FormGrid>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}
