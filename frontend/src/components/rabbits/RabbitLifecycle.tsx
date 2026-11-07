'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import { Badge, Button, Card, ErrorBox, Field, FormGrid, Input, Loading, Modal, Select, Table, Tabs, Textarea } from '@/components/ui/kit';
import { PedigreeTree } from '@/components/genetics/pedigree-tree';
import { HealthRecordModal } from '@/components/health/health-record-modal';
import { useCageOptions } from '@/graphql/options';
import { parsePrefill, useForm, useUrlCommand, type Prefill } from '@/hooks/use-form';
import { AiFill } from '@/components/assistant/ai-fill';
import { clean, formatDate, fromDateInput, toDateInput } from '@/lib/format';
import { EXIT_STATUS, HEALTH_TYPE, MOVEMENT_REASON, RABBIT_STATUS, SEX, label, options } from '@/lib/labels';

const TRACE = gql`
  query RabbitTrace($id: ID!) {
    rabbitTraceability(rabbitId: $id) {
      birthLitterCode
      father { id code }
      mother { id code }
      events { date type title detail referenceId }
    }
    rabbitDescendants(rabbitId: $id, generations: 2) { id code sex status generation birthDate }
  }
`;
const HEALTH = gql`
  query RabbitHealth($id: ID!) {
    healthRecordsByRabbit(rabbitId: $id) { id type date symptoms diagnosis treatment medication dosage nextDueDate }
  }
`;
const MOVE = gql`
  mutation MoveRabbit($input: MoveRabbitInput!) { moveRabbit(input: $input) { id } }
`;
const EXIT = gql`
  mutation RecordRabbitExit($input: RecordRabbitExitInput!) { recordRabbitExit(input: $input) { id status } }
`;

const EVENT_TONE = {
  BIRTH: 'pink',
  CAGE: 'blue',
  LOT: 'green',
  WEANING: 'green',
  ADOPTION: 'amber',
  WEIGHING: 'slate',
  HEALTH: 'amber',
  BREEDING: 'pink',
  SALE: 'green',
  EXIT: 'red',
} as const;

const EVENT_LABEL: Record<string, string> = {
  BIRTH: 'Naissance',
  CAGE: 'Cage',
  LOT: 'Lot',
  WEANING: 'Sevrage',
  ADOPTION: 'Adoption',
  WEIGHING: 'Pesée',
  HEALTH: 'Santé',
  BREEDING: 'Reproduction',
  SALE: 'Vente',
  EXIT: 'Sortie',
};

type Tab = 'trace' | 'genealogy' | 'health';

export function RabbitLifecycle({ rabbitId, rabbitCode, active }: { rabbitId: string; rabbitCode?: string; active: boolean }) {
  const [tab, setTab] = useState<Tab>('trace');
  const [modal, setModal] = useState<'move' | 'exit' | 'health' | null>(null);
  const [exitPrefill, setExitPrefill] = useState<Prefill | undefined>();
  // Brouillon de sortie préparé par l'assistant (?exit=1&prefill=…).
  useUrlCommand((params) => {
    if (params.get('exit') !== '1') return false;
    setExitPrefill(parsePrefill(params.get('prefill')));
    setModal('exit');
    return true;
  });

  return (
    <section className="mt-6 space-y-4">
      {active && (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setModal('move')}>Déplacer</Button>
          <Button variant="secondary" onClick={() => setModal('health')}>Soin / observation</Button>
          <Button variant="danger" onClick={() => setModal('exit')}>Décès, réforme ou transfert</Button>
        </div>
      )}
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'trace', label: 'Traçabilité' },
          { value: 'genealogy', label: 'Généalogie' },
          { value: 'health', label: 'Santé' },
        ]}
      />
      {tab === 'trace' && <TraceTab rabbitId={rabbitId} />}
      {tab === 'genealogy' && <GenealogyTab rabbitId={rabbitId} />}
      {tab === 'health' && <HealthTab rabbitId={rabbitId} />}

      {modal === 'move' && <MoveModal rabbitId={rabbitId} onClose={() => setModal(null)} />}
      {modal === 'exit' && active && <ExitModal rabbitId={rabbitId} rabbitCode={rabbitCode} prefill={exitPrefill} onClose={() => setModal(null)} />}
      <HealthRecordModal open={modal === 'health'} rabbitId={rabbitId} rabbitCode={rabbitCode} onClose={() => setModal(null)} />
    </section>
  );
}

interface TraceData {
  rabbitTraceability: {
    birthLitterCode?: string | null;
    father?: { id: string; code: string } | null;
    mother?: { id: string; code: string } | null;
    events: Array<{ date: string; type: string; title: string; detail?: string | null; referenceId?: string | null }>;
  };
  rabbitDescendants: Array<{ id: string; code: string; sex: string; status: string; generation: number; birthDate?: string | null }>;
}

function TraceTab({ rabbitId }: { rabbitId: string }) {
  const { data, loading, error } = useQuery<TraceData>(TRACE, { variables: { id: rabbitId } });
  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const t = data?.rabbitTraceability;
  if (!t) return null;
  return (
    <Card
      title="Historique complet"
      subtitle={[
        t.birthLitterCode && `Portée ${t.birthLitterCode}`,
        t.mother && `Mère ${t.mother.code}`,
        t.father && `Père ${t.father.code}`,
      ]
        .filter(Boolean)
        .join(' · ')}
    >
      {t.events.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun événement enregistré.</p>
      ) : (
        <ol className="space-y-3">
          {t.events.map((e, i) => (
            <li key={`${e.type}-${i}`} className="flex gap-3 border-l-2 border-emerald-200 pl-3">
              <span className="w-24 shrink-0 text-sm text-slate-500">{formatDate(e.date)}</span>
              <div className="text-sm">
                <Badge tone={EVENT_TONE[e.type as keyof typeof EVENT_TONE] ?? 'slate'}>{EVENT_LABEL[e.type] ?? e.type}</Badge>{' '}
                <span className="font-medium text-slate-900">{e.title}</span>
                {e.detail && <p className="text-slate-500">{e.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

function GenealogyTab({ rabbitId }: { rabbitId: string }) {
  const { data } = useQuery<TraceData>(TRACE, { variables: { id: rabbitId } });
  return (
    <div className="space-y-4">
      <Card title="Ascendants (3 générations)">
        <PedigreeTree rabbitId={rabbitId} />
      </Card>
      <Card title="Descendants">
        <Table
          rows={data?.rabbitDescendants ?? []}
          empty="Aucun descendant"
          columns={[
            { header: 'Code', cell: (d) => <Link className="font-semibold text-emerald-700" href={`/rabbits/${d.id}`}>{d.code}</Link> },
            { header: 'Génération', cell: (d) => (d.generation === 1 ? 'Enfant' : 'Petit-enfant') },
            { header: 'Sexe', cell: (d) => label(SEX, d.sex) },
            { header: 'Naissance', cell: (d) => formatDate(d.birthDate) },
            { header: 'Statut', cell: (d) => label(RABBIT_STATUS, d.status) },
          ]}
        />
      </Card>
    </div>
  );
}

function HealthTab({ rabbitId }: { rabbitId: string }) {
  const { data, loading } = useQuery<{
    healthRecordsByRabbit: Array<{ id: string; type: string; date: string; symptoms?: string | null; diagnosis?: string | null; treatment?: string | null; medication?: string | null; nextDueDate?: string | null }>;
  }>(HEALTH, { variables: { id: rabbitId } });
  if (loading && !data) return <Loading />;
  return (
    <Table
      rows={data?.healthRecordsByRabbit ?? []}
      empty="Aucun enregistrement sanitaire"
      columns={[
        { header: 'Date', cell: (r) => formatDate(r.date) },
        { header: 'Type', cell: (r) => label(HEALTH_TYPE, r.type) },
        { header: 'Constat', cell: (r) => [r.symptoms, r.diagnosis].filter(Boolean).join(' · ') || '—' },
        { header: 'Traitement', cell: (r) => [r.treatment, r.medication].filter(Boolean).join(' · ') || '—' },
        { header: 'Échéance', cell: (r) => formatDate(r.nextDueDate) },
      ]}
    />
  );
}

const refetchQueries = ['Rabbit', 'RabbitTrace', 'RabbitOptions', 'Dashboard'];

function MoveModal({ rabbitId, onClose }: { rabbitId: string; onClose: () => void }) {
  const cages = useCageOptions();
  const { bind, values } = useForm({ cageId: '', reason: 'OTHER', movedAt: toDateInput(), observation: '' });
  const [move, { loading, error }] = useMutation(MOVE, { refetchQueries });
  return (
    <Modal
      open
      title="Déplacer le lapin"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button
            loading={loading}
            disabled={!values.cageId}
            onClick={() => move({ variables: { input: clean({ ...values, rabbitId, movedAt: fromDateInput(values.movedAt) }) } }).then(onClose).catch(() => undefined)}
          >
            Déplacer
          </Button>
        </>
      }
    >
      <FormGrid>
        <Field label="Cage">
          <Select placeholder="Choisir…" options={cages.options} {...bind('cageId')} />
        </Field>
        <Field label="Raison">
          <Select options={options(MOVEMENT_REASON)} {...bind('reason')} />
        </Field>
        <Field label="Date">
          <Input type="date" {...bind('movedAt')} />
        </Field>
      </FormGrid>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}

function ExitModal({
  rabbitId,
  rabbitCode,
  prefill,
  onClose,
}: {
  rabbitId: string;
  rabbitCode?: string;
  prefill?: Prefill;
  onClose: () => void;
}) {
  const { bind, values, setValues } = useForm({ status: 'DEAD', date: toDateInput(), cause: '', observation: '', ...prefill });
  const [exit, { loading, error }] = useMutation(EXIT, { refetchQueries });
  return (
    <Modal
      open
      title="Sortie de l'élevage"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button
            variant="danger"
            loading={loading}
            onClick={() => exit({ variables: { input: clean({ ...values, rabbitId, date: fromDateInput(values.date) }) } }).then(onClose).catch(() => undefined)}
          >
            Confirmer
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">
        Le lapin n&apos;est jamais supprimé : il garde son historique. Sa cage, son lot, ses accouplements en cours et ses tâches sont clôturés.
      </p>
      <AiFill
        form="RABBIT_EXIT"
        context={rabbitCode ? `Lapin : ${rabbitCode}` : undefined}
        onFill={(fields) => setValues((previous) => ({ ...previous, ...fields }))}
      />
      <FormGrid>
        <Field label="Motif">
          <Select options={options(EXIT_STATUS)} {...bind('status')} />
        </Field>
        <Field label="Date">
          <Input type="date" {...bind('date')} />
        </Field>
        <Field label="Cause">
          <Input {...bind('cause')} />
        </Field>
      </FormGrid>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}
