'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import {
  Badge, Button, Card, ErrorBox, Field, FormGrid, Grid, Input, Loading, Modal, PageHeader, Select, Stat, Table, Textarea,
} from '@/components/ui/kit';
import { useCageOptions, useRabbitOptions } from '@/graphql/options';
import { toFloat, toInt, useForm } from '@/hooks/use-form';
import { clean, formatDate, formatNumber, fromDateInput, toDateInput } from '@/lib/format';
import { LOT_STATUS, MOVEMENT_REASON, label, options } from '@/lib/labels';

const LOT = gql`
  query FatteningLot($id: ID!) {
    fatteningLot(id: $id) {
      id
      code
      status
      entryDate
      exitDate
      observation
      activeMemberCount
      currentCageId
      currentCageCode
      latestAverageWeight
      latestWeighingDate
    }
    lotMemberships(lotId: $id) { id rabbitId rabbitCode joinedAt leftAt reason }
    weighings(lotId: $id) { id date totalWeight animalCount averageWeight ageInDays }
    lotCageMovements(lotId: $id) { id cageCode startedAt endedAt reason }
  }
`;

const ADD = gql`
  mutation AddMembers($input: AddLotMembersInput!) { addLotMembers(input: $input) { id } }
`;
const REMOVE = gql`
  mutation RemoveMembers($input: RemoveLotMembersInput!) { removeLotMembers(input: $input) { id } }
`;
const WEIGH = gql`
  mutation Weigh($input: CreateWeighingInput!) { createWeighing(input: $input) { id } }
`;
const MOVE = gql`
  mutation MoveLot($input: MoveFatteningLotInput!) { moveFatteningLot(input: $input) { id } }
`;
const COMPLETE = gql`
  mutation CompleteLot($input: CompleteFatteningLotInput!) { completeFatteningLot(input: $input) { id } }
`;

interface LotData {
  fatteningLot: {
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
  };
  lotMemberships: Array<{ id: string; rabbitId: string; rabbitCode?: string | null; joinedAt: string; leftAt?: string | null; reason?: string | null }>;
  weighings: Array<{ id: string; date: string; totalWeight: number; animalCount: number; averageWeight?: number | null; ageInDays?: number | null }>;
  lotCageMovements: Array<{ id: string; cageCode?: string | null; startedAt: string; endedAt?: string | null; reason?: string | null }>;
}

type Kind = 'add' | 'weigh' | 'move' | 'complete' | null;

export default function LotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, loading, error, refetch } = useQuery<LotData>(LOT, { variables: { id } });
  const [kind, setKind] = useState<Kind>(null);
  const [remove] = useMutation(REMOVE, { refetchQueries: ['FatteningLot'] });

  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const lot = data.fatteningLot;
  const active = data.lotMemberships.filter((m) => !m.leftAt);
  const first = data.weighings.at(-1);
  const last = data.weighings[0];
  const gmq =
    first && last && first.id !== last.id && first.averageWeight && last.averageWeight
      ? ((last.averageWeight - first.averageWeight) * 1000) /
        Math.max(1, (new Date(last.date).getTime() - new Date(first.date).getTime()) / 86_400_000)
      : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Lot d'engraissement · ${label(LOT_STATUS, lot.status)}`}
        title={lot.code}
        description={`Entré le ${formatDate(lot.entryDate)}${lot.currentCageCode ? ` · cage ${lot.currentCageCode}` : ''}`}
        actions={
          lot.status === 'ACTIVE' && (
            <>
              <Button variant="secondary" onClick={() => setKind('add')}>Ajouter des lapins</Button>
              <Button variant="secondary" onClick={() => setKind('move')}>Déplacer</Button>
              <Button variant="secondary" onClick={() => setKind('weigh')}>Pesée</Button>
              <Link href={`/sales?new=1&lotId=${lot.id}`}>
                <Button>Vendre le lot</Button>
              </Link>
              <Button variant="ghost" onClick={() => setKind('complete')}>Clôturer</Button>
            </>
          )
        }
      />

      <Grid>
        <Stat label="Lapins présents" value={lot.activeMemberCount} tone="info" />
        <Stat label="Poids moyen" value={lot.latestAverageWeight != null ? `${formatNumber(lot.latestAverageWeight, 3)} kg` : '—'} hint={formatDate(lot.latestWeighingDate)} />
        <Stat label="Gain moyen quotidien" value={gmq != null ? `${formatNumber(gmq, 0)} g/j` : '—'} tone="success" />
        <Stat label="Pesées" value={data.weighings.length} />
      </Grid>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Membres">
          <Table
            rows={data.lotMemberships}
            empty="Aucun lapin"
            columns={[
              { header: 'Lapin', cell: (m) => <Link className="font-semibold text-emerald-700" href={`/rabbits/${m.rabbitId}`}>{m.rabbitCode}</Link> },
              { header: 'Entrée', cell: (m) => formatDate(m.joinedAt) },
              { header: 'Sortie', cell: (m) => (m.leftAt ? `${formatDate(m.leftAt)}${m.reason ? ` · ${m.reason}` : ''}` : <Badge tone="green">présent</Badge>) },
              {
                header: '',
                cell: (m) =>
                  !m.leftAt &&
                  lot.status === 'ACTIVE' && (
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-xs"
                      onClick={() => remove({ variables: { input: { lotId: lot.id, rabbitIds: [m.rabbitId], reason: 'Retrait' } } }).catch((e) => window.alert(e.message))}
                    >
                      Retirer
                    </Button>
                  ),
              },
            ]}
          />
        </Card>
        <div className="space-y-6">
          <Card title="Pesées">
            <Table
              rows={data.weighings}
              empty="Aucune pesée"
              columns={[
                { header: 'Date', cell: (w) => formatDate(w.date) },
                { header: 'Animaux', cell: (w) => w.animalCount },
                { header: 'Total', cell: (w) => `${formatNumber(w.totalWeight, 2)} kg` },
                { header: 'Moyenne', cell: (w) => `${formatNumber(w.averageWeight ?? w.totalWeight / w.animalCount, 3)} kg` },
                { header: 'Âge', cell: (w) => (w.ageInDays != null ? `${w.ageInDays} j` : '—') },
              ]}
            />
          </Card>
          <Card title="Emplacements">
            <ul className="space-y-2 text-sm">
              {data.lotCageMovements.map((m) => (
                <li key={m.id} className="flex justify-between rounded-xl bg-slate-50 p-3">
                  <span>Cage {m.cageCode} · {label(MOVEMENT_REASON, m.reason)}</span>
                  <span className="text-slate-500">
                    {formatDate(m.startedAt)} → {m.endedAt ? formatDate(m.endedAt) : 'actuel'}
                  </span>
                </li>
              ))}
              {data.lotCageMovements.length === 0 && <li className="text-slate-500">Aucun déplacement.</li>}
            </ul>
          </Card>
        </div>
      </div>

      <LotModal kind={kind} lotId={lot.id} memberCount={active.length} onClose={() => setKind(null)} />
    </div>
  );
}

function LotModal({ kind, lotId, memberCount, onClose }: { kind: Kind; lotId: string; memberCount: number; onClose: () => void }) {
  const rabbits = useRabbitOptions();
  const cages = useCageOptions();
  const [selected, setSelected] = useState<string[]>([]);
  const { bind, values, reset } = useForm({
    date: toDateInput(),
    cageId: '',
    reason: 'FATTENING',
    totalWeight: '',
    animalCount: String(memberCount),
    ageInDays: '',
    observation: '',
  });
  const opts = { refetchQueries: ['FatteningLot', 'FatteningLots', 'LotOptions'] };
  const [add, a] = useMutation(ADD, opts);
  const [weigh, w] = useMutation(WEIGH, opts);
  const [move, m] = useMutation(MOVE, opts);
  const [complete, c] = useMutation(COMPLETE, opts);

  if (!kind) return null;
  const mutation = { add: a, weigh: w, move: m, complete: c }[kind];
  const close = () => {
    reset();
    setSelected([]);
    [a, w, m, c].forEach((x) => x.reset());
    onClose();
  };
  const observation = values.observation || undefined;

  async function submit() {
    if (kind === 'add') await add({ variables: { input: { lotId, rabbitIds: selected } } });
    if (kind === 'weigh')
      await weigh({
        variables: {
          input: clean({
            lotId,
            date: fromDateInput(values.date),
            totalWeight: toFloat(values.totalWeight) ?? 0,
            animalCount: toInt(values.animalCount) ?? memberCount,
            ageInDays: toInt(values.ageInDays),
            observation,
          }),
        },
      });
    if (kind === 'move') await move({ variables: { input: clean({ lotId, cageId: values.cageId, reason: values.reason, observation }) } });
    if (kind === 'complete') await complete({ variables: { input: clean({ id: lotId, exitDate: fromDateInput(values.date), observation }) } });
    close();
  }

  const titles = { add: 'Ajouter des lapins au lot', weigh: 'Pesée du lot', move: 'Déplacer le lot', complete: 'Clôturer le lot' };

  return (
    <Modal
      open
      title={titles[kind]}
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button loading={mutation.loading} onClick={() => submit().catch(() => undefined)}>Enregistrer</Button>
        </>
      }
    >
      {kind === 'add' && (
        <div className="max-h-72 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
          {rabbits.rabbits
            .filter((r) => r.purpose !== 'BREEDER')
            .map((r) => (
              <label key={r.id} className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selected.includes(r.id)}
                  onChange={() => setSelected((s) => (s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id]))}
                />
                {r.code} {r.currentCageCode && <span className="text-slate-400">· cage {r.currentCageCode}</span>}
              </label>
            ))}
        </div>
      )}
      {kind !== 'add' && (
        <FormGrid>
          {kind !== 'move' && (
            <Field label="Date">
              <Input type="date" {...bind('date')} />
            </Field>
          )}
          {kind === 'weigh' && (
            <>
              <Field label="Poids total (kg)">
                <Input inputMode="decimal" required {...bind('totalWeight')} />
              </Field>
              <Field label="Nombre d'animaux pesés">
                <Input type="number" min={1} {...bind('animalCount')} />
              </Field>
              <Field label="Âge (jours)">
                <Input type="number" min={0} {...bind('ageInDays')} />
              </Field>
            </>
          )}
          {kind === 'move' && (
            <>
              <Field label="Nouvelle cage">
                <Select placeholder="Choisir…" options={cages.options} {...bind('cageId')} />
              </Field>
              <Field label="Raison">
                <Select options={options(MOVEMENT_REASON)} {...bind('reason')} />
              </Field>
            </>
          )}
        </FormGrid>
      )}
      {kind !== 'add' && (
        <Field label="Observation">
          <Textarea {...bind('observation')} />
        </Field>
      )}
      <ErrorBox error={mutation.error} />
    </Modal>
  );
}
