'use client';

import Link from 'next/link';
import { use, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import {
  Badge, Button, Card, ErrorBox, Field, FormGrid, Grid, Input, Loading, Modal, PageHeader, Select, Stat, Table, Textarea,
} from '@/components/ui/kit';
import { useCageOptions, useLitterOptions, useLotOptions } from '@/graphql/options';
import { toFloat, toInt, useForm } from '@/hooks/use-form';
import { useNow } from '@/hooks/use-now';
import { clean, formatDate, formatPercent, fromDateInput, toDateInput } from '@/lib/format';
import { ADOPTION_REASON, LITTER_STATUS, MOVEMENT_REASON, RABBIT_STATUS, SEX, label, options } from '@/lib/labels';

const DETAIL = gql`
  query LitterDetail($id: ID!) {
    litterDetail(id: $id) {
      litter {
        id
        code
        status
        birthDate
        liveBorn
        stillBorn
        currentCount
        mother { id code }
        father { id code }
      }
      kits {
        id
        code
        originalCode
        sex
        status
        currentCageCode
        currentLotCode
        rearingLitterCode
      }
      cageDistribution { cageId cageCode count }
      events { id date type label quantity weight }
      deaths
      weaned
      sold
      survivalRate
    }
  }
`;

const ASSIGN = gql`
  mutation Assign($input: AssignLitterRabbitsToCageInput!) { assignLitterRabbitsToCage(input: $input) { id } }
`;
const ADOPT = gql`
  mutation Adopt($input: CreateAdoptionInput!) { createAdoption(input: $input) { id } }
`;
const MORTALITY = gql`
  mutation LitterMortality($input: RecordLitterMortalityInput!) { recordLitterMortality(input: $input) { id } }
`;
const EXIT = gql`
  mutation KitExit($input: RecordRabbitExitInput!) { recordRabbitExit(input: $input) { id } }
`;
const WEAN = gql`
  mutation Wean($input: CreateWeaningInput!) { createWeaning(input: $input) { id } }
`;

interface Kit {
  id: string;
  code: string;
  originalCode?: string | null;
  sex: string;
  status: string;
  currentCageCode?: string | null;
  currentLotCode?: string | null;
  rearingLitterCode?: string | null;
}

interface Detail {
  litter: {
    id: string;
    code: string;
    status: string;
    birthDate: string;
    liveBorn: number;
    stillBorn: number;
    currentCount: number;
    mother?: { id: string; code: string } | null;
    father?: { id: string; code: string } | null;
  };
  kits: Kit[];
  cageDistribution: Array<{ cageId: string; cageCode: string; count: number }>;
  events: Array<{ id: string; date: string; type: string; label: string; quantity?: number | null; weight?: number | null }>;
  deaths: number;
  weaned: number;
  sold: number;
  survivalRate?: number | null;
}

type ActionKind = 'cage' | 'adoption' | 'mortality' | 'weaning' | null;

export default function LitterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, loading, error, refetch } = useQuery<{ litterDetail: Detail }>(DETAIL, { variables: { id } });
  const [selected, setSelected] = useState<string[]>([]);
  const [action, setAction] = useState<ActionKind>(null);
  const now = useNow();

  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox error={error} onRetry={() => refetch()} />;
  if (!data) return null;

  const { litter, kits } = data.litterDetail;
  const activeKits = kits.filter((k) => k.status === 'ACTIVE');
  const ageDays = Math.floor((now - new Date(litter.birthDate).getTime()) / 86_400_000);
  const toggle = (kitId: string) =>
    setSelected((s) => (s.includes(kitId) ? s.filter((x) => x !== kitId) : [...s, kitId]));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Portée · ${label(LITTER_STATUS, litter.status)}`}
        title={litter.code}
        description={`Née le ${formatDate(litter.birthDate)} (${ageDays} jours) · Mère ${litter.mother?.code ?? '—'} · Père ${litter.father?.code ?? '—'}`}
        actions={
          litter.status === 'ACTIVE' && (
            <>
              <Button variant="secondary" onClick={() => setAction('cage')}>Affecter en cage</Button>
              <Button variant="secondary" onClick={() => setAction('adoption')}>Adoption</Button>
              <Button variant="secondary" onClick={() => setAction('mortality')}>Mortalité</Button>
              <Button onClick={() => setAction('weaning')}>Sevrer</Button>
            </>
          )
        }
      />

      <Grid>
        <Stat label="Nés vivants / mort-nés" value={`${litter.liveBorn} / ${litter.stillBorn}`} />
        <Stat label="Effectif actuel" value={litter.currentCount} tone="info" />
        <Stat label="Morts" value={data.litterDetail.deaths} tone={data.litterDetail.deaths ? 'danger' : 'default'} />
        <Stat label="Survie" value={formatPercent(data.litterDetail.survivalRate)} tone="success" hint={`${data.litterDetail.weaned} sevrés · ${data.litterDetail.sold} vendus`} />
      </Grid>

      <Card
        title="Lapereaux"
        subtitle="Cochez des lapereaux pour les affecter, les adopter ou les sevrer."
      >
        <Table
          rows={kits}
          empty="Lapereaux non identifiés individuellement"
          columns={[
            {
              header: '',
              cell: (k) =>
                k.status === 'ACTIVE' ? (
                  <input type="checkbox" aria-label={`Sélectionner ${k.code}`} checked={selected.includes(k.id)} onChange={() => toggle(k.id)} />
                ) : null,
            },
            { header: 'Code', cell: (k) => <Link className="font-semibold text-emerald-700" href={`/rabbits/${k.id}`}>{k.code}</Link> },
            { header: 'Code d’origine', cell: (k) => k.originalCode ?? '—' },
            { header: 'Sexe', cell: (k) => label(SEX, k.sex) },
            { header: 'Cage', cell: (k) => k.currentCageCode ?? '—' },
            { header: 'Lot', cell: (k) => k.currentLotCode ?? '—' },
            { header: 'Élevé dans', cell: (k) => k.rearingLitterCode ?? litter.code },
            {
              header: 'Statut',
              cell: (k) => <Badge tone={k.status === 'ACTIVE' ? 'green' : k.status === 'DEAD' ? 'red' : 'slate'}>{label(RABBIT_STATUS, k.status)}</Badge>,
            },
            {
              header: '',
              cell: (k) => k.status === 'ACTIVE' && <KitDeathButton kitId={k.id} code={k.code} />,
            },
          ]}
        />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Répartition par cage">
          {data.litterDetail.cageDistribution.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune cage affectée.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.litterDetail.cageDistribution.map((c) => (
                <li key={c.cageId} className="flex justify-between rounded-xl bg-slate-50 p-3">
                  <span>Cage {c.cageCode}</span>
                  <strong>{c.count}</strong>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Historique">
          <ol className="space-y-2 text-sm">
            {data.litterDetail.events.map((e) => (
              <li key={e.id} className="flex justify-between gap-3 border-l-2 border-emerald-200 pl-3">
                <span>
                  {e.label}
                  {e.quantity != null && ` · ${e.quantity}`}
                  {e.weight != null && ` · ${e.weight} kg`}
                </span>
                <span className="text-slate-500">{formatDate(e.date)}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <LitterActionModal
        kind={action}
        litterId={litter.id}
        litterCount={litter.currentCount}
        selected={selected.length ? selected : activeKits.map((k) => k.id)}
        hasKits={activeKits.length > 0}
        onClose={() => {
          setAction(null);
          setSelected([]);
        }}
      />
    </div>
  );
}

function KitDeathButton({ kitId, code }: { kitId: string; code: string }) {
  const [exit, { loading }] = useMutation(EXIT, { refetchQueries: ['LitterDetail'] });
  return (
    <Button
      variant="ghost"
      className="px-2 py-1 text-xs text-red-600"
      loading={loading}
      onClick={() => {
        const cause = window.prompt(`Cause du décès de ${code} ?`);
        if (cause === null) return;
        exit({ variables: { input: { rabbitId: kitId, status: 'DEAD', date: new Date().toISOString(), cause } } }).catch((e) =>
          window.alert(e.message),
        );
      }}
    >
      Décès
    </Button>
  );
}

function LitterActionModal({
  kind,
  litterId,
  litterCount,
  selected,
  hasKits,
  onClose,
}: {
  kind: ActionKind;
  litterId: string;
  litterCount: number;
  selected: string[];
  hasKits: boolean;
  onClose: () => void;
}) {
  const cages = useCageOptions();
  const litters = useLitterOptions();
  const lots = useLotOptions();
  const { bind, values, reset } = useForm({
    date: toDateInput(),
    cageId: '',
    reason: 'MATERNITY',
    destinationLitterId: '',
    adoptionReason: 'EQUALIZATION',
    quantity: '',
    cause: '',
    averageWeight: '',
    totalWeight: '',
    fatteningLotId: '',
    observation: '',
  });

  const opts = { refetchQueries: ['LitterDetail', 'Litters', 'Dashboard'] };
  const [assign, a] = useMutation(ASSIGN, opts);
  const [adopt, ad] = useMutation(ADOPT, opts);
  const [mortality, m] = useMutation(MORTALITY, opts);
  const [wean, w] = useMutation(WEAN, opts);

  if (!kind) return null;
  const mutation = { cage: a, adoption: ad, mortality: m, weaning: w }[kind];
  const close = () => {
    reset();
    [a, ad, m, w].forEach((x) => x.reset());
    onClose();
  };
  const date = fromDateInput(values.date);
  const observation = values.observation || undefined;

  async function submit() {
    if (kind === 'cage') {
      await assign({ variables: { input: clean({ litterId, cageId: values.cageId, rabbitIds: selected, reason: values.reason, observation }) } });
    } else if (kind === 'adoption') {
      await adopt({
        variables: {
          input: clean({
            sourceLitterId: litterId,
            destinationLitterId: values.destinationLitterId,
            date,
            reason: values.adoptionReason,
            quantity: hasKits ? selected.length : toInt(values.quantity) ?? 0,
            rabbitIds: hasKits ? selected : undefined,
            observation,
          }),
        },
      });
    } else if (kind === 'mortality') {
      await mortality({ variables: { input: clean({ litterId, date, count: toInt(values.quantity) ?? 0, cause: values.cause, observation }) } });
    } else {
      await wean({
        variables: {
          input: clean({
            litterId,
            plannedDate: date,
            actualDate: date,
            quantity: hasKits ? selected.length : toInt(values.quantity) ?? litterCount,
            rabbitIds: hasKits ? selected : undefined,
            averageWeight: toFloat(values.averageWeight),
            totalWeight: toFloat(values.totalWeight),
            fatteningLotId: values.fatteningLotId,
            observation,
          }),
        },
      });
    }
    close();
  }

  const titles = {
    cage: `Affecter ${selected.length} lapereau(x) en cage`,
    adoption: 'Adoption vers une autre portée',
    mortality: 'Mortalité de lapereaux non identifiés',
    weaning: `Sevrage (${hasKits ? selected.length : litterCount} lapereaux)`,
  };

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
      <FormGrid>
        <Field label="Date">
          <Input type="date" {...bind('date')} />
        </Field>
        {kind === 'cage' && (
          <>
            <Field label="Cage">
              <Select placeholder="Choisir…" options={cages.options} {...bind('cageId')} />
            </Field>
            <Field label="Raison">
              <Select options={options(MOVEMENT_REASON)} {...bind('reason')} />
            </Field>
          </>
        )}
        {kind === 'adoption' && (
          <>
            <Field label="Portée d’accueil">
              <Select placeholder="Choisir…" options={litters.options.filter((o) => o.value !== litterId)} {...bind('destinationLitterId')} />
            </Field>
            <Field label="Raison">
              <Select options={options(ADOPTION_REASON)} {...bind('adoptionReason')} />
            </Field>
            {!hasKits && (
              <Field label="Nombre de lapereaux">
                <Input type="number" min={1} {...bind('quantity')} />
              </Field>
            )}
          </>
        )}
        {kind === 'mortality' && (
          <>
            <Field label="Nombre de morts">
              <Input type="number" min={1} max={litterCount} {...bind('quantity')} />
            </Field>
            <Field label="Cause">
              <Input placeholder="Écrasement, froid, diarrhée…" {...bind('cause')} />
            </Field>
          </>
        )}
        {kind === 'weaning' && (
          <>
            {!hasKits && (
              <Field label="Nombre sevrés">
                <Input type="number" min={1} placeholder={String(litterCount)} {...bind('quantity')} />
              </Field>
            )}
            <Field label="Poids moyen (kg)">
              <Input inputMode="decimal" {...bind('averageWeight')} />
            </Field>
            <Field label="Poids total (kg)">
              <Input inputMode="decimal" {...bind('totalWeight')} />
            </Field>
            <Field label="Lot d’engraissement" hint="Les lapereaux y sont ajoutés directement">
              <Select placeholder="Aucun" options={lots.options} {...bind('fatteningLotId')} />
            </Field>
          </>
        )}
      </FormGrid>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={mutation.error} />
    </Modal>
  );
}
