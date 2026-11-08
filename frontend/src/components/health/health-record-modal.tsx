'use client';

import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

import { Button, ErrorBox, Field, FormGrid, Input, Modal, Select, Textarea } from '@/components/ui/kit';
import { useRabbitOptions } from '@/graphql/options';
import { useForm, type Prefill } from '@/hooks/use-form';
import { AiFill } from '@/components/assistant/ai-fill';
import { clean, fromDateInput, toDateInput } from '@/lib/format';
import { HEALTH_TYPE, options } from '@/lib/labels';

const CREATE = gql`
  mutation CreateHealthRecord($input: CreateHealthRecordInput!) { createHealthRecord(input: $input) { id } }
`;

export function HealthRecordModal({
  open,
  onClose,
  rabbitId,
  rabbitCode,
  prefill,
}: {
  open: boolean;
  onClose: () => void;
  rabbitId?: string;
  rabbitCode?: string;
  prefill?: Prefill;
}) {
  const rabbits = useRabbitOptions();
  const { bind, values, reset, setValues } = useForm({
    rabbitId: rabbitId ?? '',
    type: 'OBSERVATION',
    date: toDateInput(),
    symptoms: '',
    suspicion: '',
    diagnosis: '',
    treatment: '',
    medication: '',
    dosage: '',
    nextDueDate: '',
    observation: '',
    ...prefill,
    ...(rabbitId ? { rabbitId } : {}),
  });
  const [create, { loading, error, reset: resetMutation }] = useMutation(CREATE, {
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
      title="Nouvel enregistrement sanitaire"
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
                  input: clean({
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
      <AiFill
        form="HEALTH"
        context={rabbitCode ? `Lapin concerné : ${rabbitCode}` : undefined}
        onFill={(fields) => setValues((previous) => ({ ...previous, ...fields, ...(rabbitId ? { rabbitId } : {}) }))}
      />
      <FormGrid>
        {!rabbitId && (
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
