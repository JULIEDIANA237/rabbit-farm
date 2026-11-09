'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import { Badge, Button, Card, ErrorBox, Loading, PageHeader, Table, Tabs } from '@/components/ui/kit';
import { HealthRecordModal } from '@/components/health/health-record-modal';
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
      type
      date
      symptoms
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
      type
      medication
      treatment
      nextDueDate
    }
  }
`;

interface HealthRecord {
  id: string;
  rabbitId: string;
  rabbitCode?: string | null;
  type: string;
  date: string;
  symptoms?: string | null;
  diagnosis?: string | null;
  treatment?: string | null;
  medication?: string | null;
  dosage?: string | null;
  nextDueDate?: string | null;
}

const TYPE_TONE = { OBSERVATION: 'slate', TREATMENT: 'amber', VACCINATION: 'blue', ANALYSIS: 'pink', CONTROL: 'green' } as const;

export default function HealthPage() {
  const [type, setType] = useState<string>('ALL');
  const creating = useCreateModal();
  const { data, loading, error, refetch } = useQuery<{
    healthRecords: HealthRecord[];
    upcomingHealthActions: HealthRecord[];
  }>(RECORDS, { variables: { type: type === 'ALL' ? undefined : type } });

  const now = useNow();

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

      <Card title="À faire (14 prochains jours)">
        {(data?.upcomingHealthActions ?? []).length === 0 ? (
          <p className="text-sm text-slate-500">Aucune échéance.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {data?.upcomingHealthActions.map((a) => {
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
          rows={data?.healthRecords ?? []}
          empty="Aucun enregistrement"
          columns={[
            { header: 'Date', cell: (r) => formatDate(r.date) },
            { header: 'Lapin', cell: (r) => <Link className="font-semibold text-emerald-700" href={`/rabbits/${r.rabbitId}`}>{r.rabbitCode}</Link> },
            { header: 'Type', cell: (r) => <Badge tone={TYPE_TONE[r.type as keyof typeof TYPE_TONE]}>{label(HEALTH_TYPE, r.type)}</Badge> },
            { header: 'Symptômes / diagnostic', cell: (r) => [r.symptoms, r.diagnosis].filter(Boolean).join(' · ') || '—' },
            { header: 'Traitement', cell: (r) => [r.treatment, r.medication, r.dosage].filter(Boolean).join(' · ') || '—' },
            { header: 'Prochaine échéance', cell: (r) => formatDate(r.nextDueDate) },
          ]}
        />
      )}

      <HealthRecordModal key={creating.key} open={creating.open} prefill={creating.prefill} onClose={creating.close} />
    </div>
  );
}
