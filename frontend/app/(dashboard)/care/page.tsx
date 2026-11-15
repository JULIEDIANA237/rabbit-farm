'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import { Badge, Button, ErrorBox, Field, FormGrid, Grid, Input, Loading, Modal, PageHeader, Select, Stat, Table, Textarea } from '@/components/ui/kit';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';
import { useCageOptions, useLotOptions, useRabbitOptions } from '@/graphql/options';
import { toInt, useCreateModal, useForm } from '@/hooks/use-form';
import { useNow } from '@/hooks/use-now';
import { clean, formatDate, fromDateInput, toDateInput } from '@/lib/format';

const CARE_RECORDS = gql`
  query CareRecords {
    careRecords {
      id
      date
      careType
      scope
      sectionId
      cageId
      lotId
      rabbitId
      targetLabel
      product
      dose
      animalCount
      notes
      nextDate
    }
  }
`;
const SECTIONS = gql`
  query CareSections {
    sections { id name }
  }
`;
const CREATE = gql`
  mutation CreateCareRecord($input: CreateCareRecordInput!) { createCareRecord(input: $input) { id } }
`;
const UPDATE = gql`
  mutation UpdateCareRecord($input: UpdateCareRecordInput!) { updateCareRecord(input: $input) { id } }
`;
const DELETE = gql`
  mutation DeleteCareRecord($id: ID!) { deleteCareRecord(id: $id) }
`;

interface CareRecord {
  id: string;
  date: string;
  careType: string;
  scope: string;
  sectionId: string | null;
  cageId: string | null;
  lotId: string | null;
  rabbitId: string | null;
  targetLabel: string;
  product: string | null;
  dose: string | null;
  animalCount: number | null;
  notes: string | null;
  nextDate: string | null;
}

/** Soins courants proposés ; l'éleveur peut écrire le sien. */
const CARE_TYPES = [
  'Nettoyage des cages',
  'Désinfection',
  'Vermifuge',
  'Vitamines / anti-stress',
  'Anticoccidien',
  'Vaccin',
  'Antibiotique',
  'Soin de plaie',
  'Traitement contre la gale',
  'Coupe des griffes',
  'Changement de litière',
];

const SCOPES = [
  { value: 'FARM', label: 'Toute la ferme' },
  { value: 'SECTION', label: 'Un bloc' },
  { value: 'CAGE', label: 'Une cage' },
  { value: 'LOT', label: 'Un lot d’engraissement' },
  { value: 'RABBIT', label: 'Un lapin' },
];

const refetchQueries = ['CareRecords', 'Tasks', 'HeaderTasks', 'Dashboard'];

export default function CarePage() {
  const creating = useCreateModal();
  const [editing, setEditing] = useState<CareRecord | null>(null);
  const remove = useDeleteAction(DELETE, { refetchQueries });
  const { data, loading, error, refetch } = useQuery<{ careRecords: CareRecord[] }>(CARE_RECORDS);
  const records = data?.careRecords ?? [];
  const today = toDateInput();
  const upcoming = records
    .filter((r) => r.nextDate && r.nextDate.slice(0, 10) >= today)
    .sort((a, b) => (a.nextDate! < b.nextDate! ? -1 : 1));
  const now = useNow();
  const monthAgo = new Date(now - 30 * 86_400_000).toISOString();
  const lastMonth = records.filter((r) => r.date >= monthAgo).length;

  return (
    <div>
      <PageHeader
        eyebrow="Santé"
        title="Soins"
        description="Note toi-même chaque soin donné : nettoyage, vermifuge, vitamines, vaccin… pour toute la ferme, un bloc, une cage, un lot ou un lapin. Si tu indiques un prochain soin, une tâche te le rappellera."
        actions={
          <Button onClick={() => creating.openModal()}>
            <Plus size={16} /> Noter un soin
          </Button>
        }
      />
      <ErrorBox error={error} onRetry={() => refetch()} />
      {records.length > 0 && (
        <div className="mb-6">
          <Grid cols={3}>
            <Stat label="Soins ces 30 jours" value={lastMonth} />
            <Stat label="Prochains soins prévus" value={upcoming.length} tone={upcoming.length ? 'info' : undefined} />
            <Stat label="Prochain" value={upcoming[0] ? formatDate(upcoming[0].nextDate) : '—'} hint={upcoming[0]?.careType} />
          </Grid>
        </div>
      )}
      {loading && !data ? (
        <Loading />
      ) : (
        <Table
          rows={records}
          empty="Aucun soin noté pour le moment"
          columns={[
            { header: 'Soin', cell: (r) => <span className="font-semibold text-slate-900">{r.careType}</span> },
            { header: 'Date', cell: (r) => formatDate(r.date) },
            { header: 'Pour', cell: (r) => r.targetLabel },
            {
              header: 'Produit',
              cell: (r) => [r.product, r.dose, r.animalCount ? `${r.animalCount} lapin(s)` : null].filter(Boolean).join(' · ') || '—',
            },
            {
              header: 'Prochain',
              cell: (r) =>
                r.nextDate ? <Badge tone={r.nextDate.slice(0, 10) >= today ? 'blue' : 'slate'}>{formatDate(r.nextDate)}</Badge> : '—',
            },
            { header: 'Notes', cell: (r) => r.notes ?? '—' },
            {
              header: '',
              cell: (r) => (
                <RowActions
                  onEdit={() => setEditing(r)}
                  onDelete={() => remove.ask(r.id, `le soin « ${r.careType} » du ${formatDate(r.date)}`)}
                />
              ),
            },
          ]}
        />
      )}
      {creating.open && <CareModal key={creating.key} onClose={creating.close} />}
      {editing && <CareModal key={editing.id} editing={editing} onClose={() => setEditing(null)} />}
      {remove.dialog}
    </div>
  );
}

function CareModal({ editing, onClose }: { editing?: CareRecord; onClose: () => void }) {
  const known = !editing || CARE_TYPES.includes(editing.careType);
  const { bind, values } = useForm({
    careChoice: editing ? (known ? editing.careType : '__other__') : CARE_TYPES[0],
    careOther: editing && !known ? editing.careType : '',
    date: editing ? editing.date.slice(0, 10) : toDateInput(),
    scope: editing?.scope ?? 'FARM',
    sectionId: editing?.sectionId ?? '',
    cageId: editing?.cageId ?? '',
    lotId: editing?.lotId ?? '',
    rabbitId: editing?.rabbitId ?? '',
    product: editing?.product ?? '',
    dose: editing?.dose ?? '',
    animalCount: editing?.animalCount != null ? String(editing.animalCount) : '',
    nextDate: editing?.nextDate ? editing.nextDate.slice(0, 10) : '',
    notes: editing?.notes ?? '',
  });
  const sections = useQuery<{ sections: Array<{ id: string; name: string }> }>(SECTIONS);
  const cages = useCageOptions();
  const lots = useLotOptions();
  const rabbits = useRabbitOptions();
  const [save, { loading, error }] = useMutation(editing ? UPDATE : CREATE, { refetchQueries });
  const careType = values.careChoice === '__other__' ? values.careOther.trim() : values.careChoice;
  const targetId = { SECTION: values.sectionId, CAGE: values.cageId, LOT: values.lotId, RABBIT: values.rabbitId }[values.scope as 'SECTION'];
  const missingTarget = values.scope !== 'FARM' && !targetId;

  const submit = () => {
    const fields = {
      date: fromDateInput(values.date),
      careType,
      scope: values.scope,
      sectionId: values.scope === 'SECTION' ? values.sectionId : undefined,
      cageId: values.scope === 'CAGE' ? values.cageId : undefined,
      lotId: values.scope === 'LOT' ? values.lotId : undefined,
      rabbitId: values.scope === 'RABBIT' ? values.rabbitId : undefined,
    };
    const optional = {
      product: values.product.trim() || null,
      dose: values.dose.trim() || null,
      animalCount: toInt(values.animalCount) ?? null,
      notes: values.notes.trim() || null,
      nextDate: values.nextDate ? fromDateInput(values.nextDate) : null,
    };
    const input = editing ? { id: editing.id, ...clean(fields), ...optional } : clean({ ...fields, ...optional });
    save({ variables: { input } })
      .then(onClose)
      .catch(() => undefined);
  };

  return (
    <Modal
      open
      title={editing ? 'Modifier le soin' : 'Noter un soin'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button loading={loading} disabled={!careType || !values.date || missingTarget} onClick={submit}>
            Enregistrer
          </Button>
        </>
      }
    >
      <FormGrid>
        <Field label="Soin donné">
          <Select options={[...CARE_TYPES.map((t) => ({ value: t, label: t })), { value: '__other__', label: 'Autre (je l’écris)' }]} {...bind('careChoice')} />
        </Field>
        {values.careChoice === '__other__' && (
          <Field label="Quel soin ?">
            <Input placeholder="ex. Bain anti-puces" {...bind('careOther')} />
          </Field>
        )}
        <Field label="Date">
          <Input type="date" {...bind('date')} />
        </Field>
        <Field label="Pour qui ?">
          <Select options={SCOPES} {...bind('scope')} />
        </Field>
        {values.scope === 'SECTION' && (
          <Field label="Bloc">
            <Select placeholder="Choisir…" options={(sections.data?.sections ?? []).map((s) => ({ value: s.id, label: s.name }))} {...bind('sectionId')} />
          </Field>
        )}
        {values.scope === 'CAGE' && (
          <Field label="Cage">
            <Select placeholder="Choisir…" options={cages.cages.map((c) => ({ value: c.id, label: c.code }))} {...bind('cageId')} />
          </Field>
        )}
        {values.scope === 'LOT' && (
          <Field label="Lot">
            <Select placeholder="Choisir…" options={lots.options} {...bind('lotId')} />
          </Field>
        )}
        {values.scope === 'RABBIT' && (
          <Field label="Lapin">
            <Select placeholder="Choisir…" options={rabbits.options} {...bind('rabbitId')} />
          </Field>
        )}
        <Field label="Produit utilisé" hint="Facultatif">
          <Input placeholder="ex. Ivermectine, eau de Javel" {...bind('product')} />
        </Field>
        <Field label="Dose" hint="Facultatif">
          <Input placeholder="ex. 1 ml par litre d’eau" {...bind('dose')} />
        </Field>
        <Field label="Nombre de lapins soignés" hint="Facultatif">
          <Input inputMode="numeric" {...bind('animalCount')} />
        </Field>
        <Field label="Prochain soin" hint="Une tâche est créée ce jour-là">
          <Input type="date" {...bind('nextDate')} />
        </Field>
      </FormGrid>
      <Field label="Notes">
        <Textarea placeholder="Ce que tu as observé, comment ça s’est passé…" {...bind('notes')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}
