'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import {
  Badge, Button, ErrorBox, Field, FormGrid, Input, Loading, Modal, PageHeader, Select, Table, Tabs, Textarea, type BadgeTone,
} from '@/components/ui/kit';
import { useRabbitOptions } from '@/graphql/options';
import { useCreateModal, useForm, type Prefill } from '@/hooks/use-form';
import { AiFill } from '@/components/assistant/ai-fill';
import { clean, formatDate, fromDateInput, toDateInput } from '@/lib/format';
import { TASK_PRIORITY, TASK_STATUS, label, options } from '@/lib/labels';

const TASKS = gql`
  query Tasks($status: TaskStatus, $openOnly: Boolean) {
    tasks(status: $status, openOnly: $openOnly) {
      id
      title
      description
      dueDate
      priority
      status
      rabbitId
      rabbitCode
      sourceType
      sourceId
      automationKey
      completedAt
    }
  }
`;
const CREATE = gql`
  mutation CreateTask($input: CreateTaskInput!) { createTask(input: $input) { id } }
`;
const UPDATE = gql`
  mutation UpdateTask($input: UpdateTaskInput!) { updateTask(input: $input) { id status } }
`;

interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate: string;
  priority: string;
  status: string;
  rabbitId?: string | null;
  rabbitCode?: string | null;
  automationKey?: string | null;
  sourceId?: string | null;
}

/**
 * Formulaire à ouvrir pour accomplir une tâche automatique,
 * déjà rempli avec ce que l'app connaît (femelle, lapin, portée…).
 */
function taskActionHref(task: Task): string | null {
  const id = task.sourceId;
  switch (task.automationKey) {
    case 'BREEDING_PALPATION':
      return id ? `/breeding?action=palpation&breedingId=${id}` : null;
    case 'BREEDING_NEST':
      return id ? `/breeding?action=nest&breedingId=${id}` : null;
    case 'BREEDING_BIRTH':
      return id ? `/breeding?action=birth&breedingId=${id}` : null;
    case 'LITTER_WEANING':
      return '/weaning?new=1';
    case 'HEALTH_FOLLOW_UP':
      return task.rabbitId
        ? `/health?new=1&prefill=${encodeURIComponent(JSON.stringify({ rabbitId: task.rabbitId, type: 'CONTROL' }))}`
        : '/health?new=1';
    case 'STOCK_REORDER':
      return '/operations/inventory';
    default:
      return null;
  }
}

const PRIORITY_TONE: Record<string, BadgeTone> = { LOW: 'slate', MEDIUM: 'blue', HIGH: 'amber', URGENT: 'red' };
const refetchQueries = ['Tasks', 'HeaderTasks', 'Dashboard'];

export default function TasksPage() {
  const [tab, setTab] = useState<'open' | 'COMPLETED' | 'CANCELLED'>('open');
  const creating = useCreateModal();
  const { data, loading, error, refetch } = useQuery<{ tasks: Task[] }>(TASKS, {
    variables: tab === 'open' ? { openOnly: true } : { status: tab },
  });
  const [update] = useMutation(UPDATE, { refetchQueries });

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const setStatus = (id: string, status: string) => update({ variables: { input: { id, status } } }).catch((e) => window.alert(e.message));

  return (
    <div>
      <PageHeader
        eyebrow="Organisation"
        title="Tâches"
        description="Les palpations, nids, mises bas, sevrages, soins et réapprovisionnements sont créés automatiquement."
        actions={
          <Button onClick={() => creating.openModal()}>
            <Plus size={16} /> Nouvelle tâche
          </Button>
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'open', label: 'À faire' },
          { value: 'COMPLETED', label: 'Terminées' },
          { value: 'CANCELLED', label: 'Annulées' },
        ]}
      />
      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : (
        <Table
          rows={data?.tasks ?? []}
          empty="Aucune tâche"
          columns={[
            {
              header: 'Échéance',
              cell: (t) => {
                const late = tab === 'open' && new Date(t.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
                const isToday = tab === 'open' && !late && new Date(t.dueDate) <= today;
                return <span className={late ? 'font-semibold text-red-600' : isToday ? 'font-semibold text-amber-700' : ''}>{formatDate(t.dueDate)}</span>;
              },
            },
            {
              header: 'Tâche',
              cell: (t) => (
                <div className="whitespace-normal">
                  <p className="font-medium text-slate-900">{t.title}</p>
                  {t.description && <p className="text-xs text-slate-500">{t.description}</p>}
                </div>
              ),
            },
            { header: 'Lapin', cell: (t) => (t.rabbitId ? <Link className="text-emerald-700" href={`/rabbits/${t.rabbitId}`}>{t.rabbitCode}</Link> : '—') },
            { header: 'Priorité', cell: (t) => <Badge tone={PRIORITY_TONE[t.priority]}>{label(TASK_PRIORITY, t.priority)}</Badge> },
            { header: 'Origine', cell: (t) => (t.automationKey ? <Badge tone="blue">auto</Badge> : 'manuelle') },
            { header: 'Statut', cell: (t) => label(TASK_STATUS, t.status) },
            {
              header: '',
              cell: (t) =>
                tab === 'open' ? (
                  <div className="flex gap-1">
                    {taskActionHref(t) && (
                      <Link href={taskActionHref(t) as string}>
                        <Button className="px-2 py-1 text-xs">Faire</Button>
                      </Link>
                    )}
                    {t.status === 'TODO' && (
                      <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => setStatus(t.id, 'IN_PROGRESS')}>Commencer</Button>
                    )}
                    <Button variant={taskActionHref(t) ? 'secondary' : 'primary'} className="px-2 py-1 text-xs" onClick={() => setStatus(t.id, 'COMPLETED')}>Terminer</Button>
                    <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => setStatus(t.id, 'CANCELLED')}>Annuler</Button>
                  </div>
                ) : (
                  <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => setStatus(t.id, 'TODO')}>Rouvrir</Button>
                ),
            },
          ]}
        />
      )}
      <TaskModal key={creating.key} open={creating.open} prefill={creating.prefill} onClose={creating.close} />
    </div>
  );
}

function TaskModal({ open, onClose, prefill }: { open: boolean; onClose: () => void; prefill?: Prefill }) {
  const rabbits = useRabbitOptions();
  const { bind, values, reset, setValues } = useForm({ title: '', description: '', dueDate: toDateInput(), priority: 'MEDIUM', rabbitId: '', ...prefill });
  const [create, { loading, error, reset: r }] = useMutation(CREATE, { refetchQueries });
  const close = () => {
    reset();
    r();
    onClose();
  };
  return (
    <Modal
      open={open}
      title="Nouvelle tâche"
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button
            loading={loading}
            disabled={!values.title}
            onClick={() => create({ variables: { input: clean({ ...values, dueDate: fromDateInput(values.dueDate), sourceType: 'MANUAL' }) } }).then(close).catch(() => undefined)}
          >
            Créer
          </Button>
        </>
      }
    >
      <AiFill form="TASK" onFill={(fields) => setValues((previous) => ({ ...previous, ...fields }))} />
      <Field label="Titre">
        <Input {...bind('title')} />
      </Field>
      <FormGrid>
        <Field label="Échéance">
          <Input type="date" {...bind('dueDate')} />
        </Field>
        <Field label="Priorité">
          <Select options={options(TASK_PRIORITY)} {...bind('priority')} />
        </Field>
        <Field label="Lapin concerné">
          <Select placeholder="Aucun" options={rabbits.options} {...bind('rabbitId')} />
        </Field>
      </FormGrid>
      <Field label="Description">
        <Textarea {...bind('description')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}
