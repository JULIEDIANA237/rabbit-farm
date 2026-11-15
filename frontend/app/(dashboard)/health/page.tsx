'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import { Badge, Button, Card, ErrorBox, Loading, PageHeader, Table, Tabs } from '@/components/ui/kit';
import { DELETE_HEALTH_RECORD, HealthRecordModal, type EditableHealthRecord } from '@/components/health/health-record-modal';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';
import { formatDate } from '@/lib/format';
import { useNow } from '@/hooks/use-now';
import { useCreateModal } from '@/hooks/use-form';
import { HEALTH_TYPE, label, options } from '@/lib/labels';

const RECORDS = gql`
  query HealthRecords($type: HealthRecordType) {
    healthRecords(type: $type) {
      id
      rabbitId
      rabbitCode
      isKit
      type
      date
      symptoms
      suspicion
      diagnosis
      treatment
      medication
      dosage
      nextDueDate
      observation
    }
    upcomingHealthActions(days: 14) {
      id
      rabbitId
      rabbitCode
      isKit
      type
      medication
      treatment
      nextDueDate
    }
  }
`;

interface HealthRecord extends EditableHealthRecord {
  rabbitCode?: string | null;
  isKit?: boolean | null;
}

type Zone = 'ADULT' | 'KIT';

const TYPE_TONE = { OBSERVATION: 'slate', TREATMENT: 'amber', VACCINATION: 'blue', ANALYSIS: 'pink', CONTROL: 'green' } as const;

export default function HealthPage() {
  const [type, setType] = useState<string>('ALL');
  // Deux zones séparées : adultes et lapereaux, pour ne pas mélanger.
  const [zone, setZone] = useState<Zone>('ADULT');
  const inZone = (r: HealthRecord) => (zone === 'KIT' ? Boolean(r.isKit) : !r.isKit);
  const creating = useCreateModal();
  const [editing, setEditing] = useState<HealthRecord | null>(null);
  const remove = useDeleteAction(DELETE_HEALTH_RECORD, { refetchQueries: ['HealthRecords', 'Dashboard', 'RabbitHealth', 'Tasks'] });
  const { data, loading, error, refetch } = useQuery<{
    healthRecords: HealthRecord[];
    upcomingHealthActions: HealthRecord[];
  }>(RECORDS, { variables: { type: type === 'ALL' ? undefined : type } });

  const now = useNow();
  const all = data?.healthRecords ?? [];
  const rows = all.filter(inZone);
  const upcoming = (data?.upcomingHealthActions ?? []).filter(inZone);
  const kitCount = all.filter((r) => r.isKit).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Santé"
        title="Suivi sanitaire"
        description="Symptômes, traitements, vaccinations, analyses et contrôles. Une échéance crée une tâche de suivi."
        actions={
          <Button onClick={() => creating.openModal()}>
            <Plus size={16} /> Nouvel enregistrement
          </Button>
        }
      />

      <Tabs
        value={zone}
        onChange={setZone}
        tabs={[
          { value: 'ADULT', label: `Adultes (${all.length - kitCount})` },
          { value: 'KIT', label: `Lapereaux (${kitCount})` },
        ]}
      />

      <Card title={`À faire (14 prochains jours) · ${zone === 'KIT' ? 'lapereaux' : 'adultes'}`}>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune échéance.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {upcoming.map((a) => {
              const overdue = a.nextDueDate && new Date(a.nextDueDate).getTime() < now;
              return (
                <li key={a.id} className={`flex justify-between rounded-xl p-3 text-sm ${overdue ? 'bg-red-50' : 'bg-slate-50'}`}>
                  <span>
                    <Link href={`/rabbits/${a.rabbitId}`} className="font-semibold">{a.rabbitCode}</Link> · {label(HEALTH_TYPE, a.type)}{' '}
                    {a.medication || a.treatment}
                  </span>
                  <span className={overdue ? 'font-semibold text-red-600' : 'text-slate-500'}>{formatDate(a.nextDueDate)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Tabs value={type} onChange={setType} tabs={[{ value: 'ALL', label: 'Tous' }, ...options(HEALTH_TYPE).map((o) => ({ value: o.value, label: o.label }))]} />

      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : (
        <Table
          rows={rows}
          empty={zone === 'KIT' ? 'Aucun enregistrement pour les lapereaux' : 'Aucun enregistrement pour les adultes'}
          columns={[
            { header: 'Date', cell: (r) => formatDate(r.date) },
            { header: zone === 'KIT' ? 'Lapereau' : 'Lapin', cell: (r) => <Link className="font-semibold text-emerald-700" href={`/rabbits/${r.rabbitId}`}>{r.rabbitCode}</Link> },
            { header: 'Type', cell: (r) => <Badge tone={TYPE_TONE[r.type as keyof typeof TYPE_TONE]}>{label(HEALTH_TYPE, r.type)}</Badge> },
            { header: 'Symptômes / diagnostic', cell: (r) => [r.symptoms, r.diagnosis].filter(Boolean).join(' · ') || '—' },
            { header: 'Traitement', cell: (r) => [r.treatment, r.medication, r.dosage].filter(Boolean).join(' · ') || '—' },
            { header: 'Prochaine échéance', cell: (r) => formatDate(r.nextDueDate) },
            {
              header: '',
              cell: (r) => (
                <RowActions
                  onEdit={() => setEditing(r)}
                  onDelete={() => remove.ask(r.id, `l'enregistrement du ${formatDate(r.date)} (${r.rabbitCode ?? 'lapin'})`)}
                />
              ),
            },
          ]}
        />
      )}

      <HealthRecordModal key={creating.key} open={creating.open} prefill={creating.prefill} onClose={creating.close} />
      {editing && <HealthRecordModal key={editing.id} open editing={editing} onClose={() => setEditing(null)} />}
      {remove.dialog}
    </div>
  );
}
