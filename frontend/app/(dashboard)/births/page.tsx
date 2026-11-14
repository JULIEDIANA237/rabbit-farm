'use client';

import Link from 'next/link';
import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import { Badge, Button, Card, ErrorBox, Field, FormGrid, Grid, Input, Loading, Modal, PageHeader, Stat, Table, Tabs, Textarea } from '@/components/ui/kit';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';
import { toInt, useForm } from '@/hooks/use-form';
import { formatDate, formatPercent, fromDateInput, toDateInput } from '@/lib/format';
import { LITTER_STATUS, label } from '@/lib/labels';

const LITTERS = gql`
  query Litters {
    litters {
      id
      code
      status
      birthDate
      liveBorn
      stillBorn
      currentCount
      kitCount
      mother { id code }
      father { id code }
    }
    births {
      id
      birthDate
      liveBorn
      stillBorn
      litterId
      litterCode
      observation
      mother { id code }
      father { id code }
    }
  }
`;

interface Litter {
  id: string;
  code: string;
  status: string;
  birthDate: string;
  liveBorn: number;
  stillBorn: number;
  currentCount: number;
  kitCount: number;
  mother?: { id: string; code: string } | null;
  father?: { id: string; code: string } | null;
}

interface Birth {
  id: string;
  birthDate: string;
  liveBorn: number;
  stillBorn: number;
  litterId?: string | null;
  litterCode?: string | null;
  observation?: string | null;
  mother?: { code: string } | null;
  father?: { code: string } | null;
}

const UPDATE_BIRTH = gql`
  mutation UpdateBirth($input: UpdateBirthInput!) { updateBirth(input: $input) { id } }
`;
const DELETE_BIRTH = gql`
  mutation DeleteBirth($id: ID!) { deleteBirth(id: $id) }
`;
const refetchQueries = ['Litters', 'Breedings', 'Dashboard', 'Tasks', 'HeaderTasks'];

const ageDays = (d: string) => Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);

export default function BirthsPage() {
  const [tab, setTab] = useState<'litters' | 'births'>('litters');
  const { data, loading, error, refetch } = useQuery<{ litters: Litter[]; births: Birth[] }>(LITTERS);
  const [editing, setEditing] = useState<Birth | null>(null);
  const remove = useDeleteAction(DELETE_BIRTH, { refetchQueries });
  const birthActions = (b?: Birth) =>
    b && (
      <RowActions
        onEdit={() => setEditing(b)}
        onDelete={() =>
          remove.ask(
            b.id,
            `la mise bas du ${formatDate(b.birthDate)} (${b.mother?.code ?? ''})`,
            'La portée et ses lapereaux sont supprimés (impossible s’ils ont déjà un historique : sevrage, pesée, soin…). L’accouplement redevient « gestante ».',
          )
        }
      />
    );

  const litters = data?.litters ?? [];
  const births = data?.births ?? [];
  const active = litters.filter((l) => l.status === 'ACTIVE');
  const liveBorn = births.reduce((s, b) => s + b.liveBorn, 0);
  const stillBorn = births.reduce((s, b) => s + b.stillBorn, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Naissances"
        title="Portées et mises bas"
        description="Les mises bas s'enregistrent depuis la page Reproduction ; chaque portée a sa fiche."
        actions={
          <Link href="/breeding">
            <Button>Enregistrer une mise bas</Button>
          </Link>
        }
      />

      <div className="mb-6">
        <Grid>
          <Stat label="Portées sous la mère" value={active.length} tone="info" />
          <Stat label="Lapereaux sous la mère" value={active.reduce((s, l) => s + l.currentCount, 0)} />
          <Stat label="Nés vivants (total)" value={liveBorn} tone="success" />
          <Stat
            label="Mortinatalité"
            value={formatPercent(liveBorn + stillBorn ? (stillBorn / (liveBorn + stillBorn)) * 100 : null)}
            hint={`${stillBorn} mort-né${stillBorn > 1 ? 's' : ''} sur ${liveBorn + stillBorn} naissances`}
          />
        </Grid>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'litters', label: 'Portées' },
          { value: 'births', label: 'Mises bas' },
        ]}
      />

      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : tab === 'litters' ? (
        <Table
          rows={litters}
          empty="Aucune portée"
          columns={[
            { header: 'Portée', cell: (l) => <Link className="font-semibold text-emerald-700" href={`/litters/${l.id}`}>{l.code}</Link> },
            { header: 'Mère', cell: (l) => l.mother?.code ?? '—' },
            { header: 'Père', cell: (l) => l.father?.code ?? '—' },
            { header: 'Naissance', cell: (l) => `${formatDate(l.birthDate)} (${ageDays(l.birthDate)} j)` },
            { header: 'Vivants / mort-nés', cell: (l) => `${l.liveBorn} / ${l.stillBorn}` },
            { header: 'Effectif actuel', cell: (l) => l.currentCount },
            { header: 'Statut', cell: (l) => <Badge tone={l.status === 'ACTIVE' ? 'pink' : 'slate'}>{label(LITTER_STATUS, l.status)}</Badge> },
            { header: '', cell: (l) => birthActions(births.find((b) => b.litterId === l.id)) },
          ]}
        />
      ) : (
        <Card>
          <Table
            rows={births}
            empty="Aucune mise bas"
            columns={[
              { header: 'Date', cell: (b) => formatDate(b.birthDate) },
              { header: 'Mère', cell: (b) => b.mother?.code ?? '—' },
              { header: 'Père', cell: (b) => b.father?.code ?? '—' },
              { header: 'Vivants', cell: (b) => b.liveBorn },
              { header: 'Mort-nés', cell: (b) => b.stillBorn },
              {
                header: 'Portée',
                cell: (b) => (b.litterId ? <Link className="text-emerald-700" href={`/litters/${b.litterId}`}>{b.litterCode}</Link> : '—'),
              },
              { header: '', cell: (b) => birthActions(b) },
            ]}
          />
        </Card>
      )}
      {editing && <EditBirthModal key={editing.id} birth={editing} onClose={() => setEditing(null)} />}
      {remove.dialog}
    </div>
  );
}

function EditBirthModal({ birth, onClose }: { birth: Birth; onClose: () => void }) {
  const { bind, values } = useForm({
    birthDate: toDateInput(birth.birthDate),
    stillBorn: String(birth.stillBorn),
    observation: birth.observation ?? '',
  });
  const [save, { loading, error }] = useMutation(UPDATE_BIRTH, { refetchQueries });
  return (
    <Modal
      open
      title={`Modifier la mise bas de ${birth.mother?.code ?? ''}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button
            loading={loading}
            onClick={() =>
              save({
                variables: {
                  input: {
                    id: birth.id,
                    birthDate: fromDateInput(values.birthDate),
                    stillBorn: toInt(values.stillBorn),
                    observation: values.observation,
                  },
                },
              })
                .then(onClose)
                .catch(() => undefined)
            }
          >
            Enregistrer
          </Button>
        </>
      }
    >
      <FormGrid>
        <Field label="Date de mise bas" hint="La date de naissance des lapereaux suit">
          <Input type="date" {...bind('birthDate')} />
        </Field>
        <Field label="Mort-nés">
          <Input inputMode="numeric" {...bind('stillBorn')} />
        </Field>
      </FormGrid>
      <p className="text-xs text-slate-500">
        Nés vivants : {birth.liveBorn}. Pour corriger ce nombre, supprime la mise bas puis enregistre-la à nouveau.
      </p>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}
