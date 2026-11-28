'use client';

import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { CalendarClock, Plus, Syringe } from 'lucide-react';

import {
  Badge, Button, ErrorBox, Field, FormGrid, Input, Loading, Modal, PageHeader, Select, Table, Tabs, Textarea,
  type BadgeTone,
} from '@/components/ui/kit';
import { useRabbitOptions } from '@/graphql/options';
import { parsePrefill, toFloat, toInt, useCreateModal, useForm, useUrlCommand, type Prefill } from '@/hooks/use-form';
import { AiFill } from '@/components/assistant/ai-fill';
import {
  PAST_BREEDING_MIN_DAYS, PAST_FIELDS, PastBreedingFields, RECORD_PAST_BREEDING, daysSince, pastBreedingInput, pastBreedingReady,
} from '@/components/breeding/past-breeding';
import { clean, formatDate, formatNumber, fromDateInput, toDateInput } from '@/lib/format';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';
import { BREEDING_STATUS, COMPATIBILITY, PREGNANCY_RESULT, label, options } from '@/lib/labels';

const BREEDINGS = gql`
  query Breedings($status: BreedingStatus) {
    breedings(status: $status) {
      id
      status
      breedingDate
      palpationStartDate
      palpationEndDate
      nestDate
      expectedBirthStartDate
      expectedBirthEndDate
      observation
      birthId
      matingCount
      matings { id date male { id code } }
      female { id code }
      male { id code }
      nestInstallation { id installedAt }
    }
  }
`;

const MATING_CONTEXT = gql`
  query MatingContext($femaleId: ID, $maleId: ID, $date: DateTime!) {
    matingContext(femaleId: $femaleId, maleId: $maleId, date: $date) {
      maleFemalesLast24h
      maleLimitReached
      sameDayBreedingId
      sameDayMatingCount
      femaleHasOtherActiveBreeding
    }
  }
`;

/** Date de saillie : avec l'heure si elle est donnée (heure du Cameroun), sinon midi. */
function matingDate(date: string, time: string) {
  return time ? new Date(`${date}T${time}:00+01:00`).toISOString() : fromDateInput(date);
}

const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Douala' });

const COMPATIBILITY_QUERY = gql`
  query Compatibility($femaleId: ID!, $maleId: ID!) {
    breedingCompatibility(femaleId: $femaleId, maleId: $maleId) {
      level
      inbreedingCoefficient
      reasons { code level message }
      commonAncestors { id code }
    }
  }
`;

const PROFILE = gql`
  query ReproductionProfile($id: ID!) {
    reproductionProfile(rabbitId: $id) {
      id
      code
      sex
      ageDays
      weight
      totalLitters
      kitsBornAlive
      averageLiveBorn
      lastBirthDate
      daysSinceLastBirth
      nursingKits
      maternalBehavior
      healthHistory
      totalMatings
      matingsLast7Days
      lastMatingDate
      successRate
      recentHealth { date text }
      warnings
    }
  }
`;

interface Profile {
  id: string;
  code: string;
  sex: string;
  ageDays: number | null;
  weight: number | null;
  totalLitters: number;
  kitsBornAlive: number;
  averageLiveBorn: number | null;
  lastBirthDate: string | null;
  daysSinceLastBirth: number | null;
  nursingKits: number;
  maternalBehavior: string | null;
  healthHistory: string | null;
  totalMatings: number;
  matingsLast7Days: number;
  lastMatingDate: string | null;
  successRate: number | null;
  recentHealth: Array<{ date: string; text: string }>;
  warnings: string[];
}

const MOTHER = { GOOD: 'bonne mère', AVERAGE: 'mère moyenne', POOR: 'mauvaise mère' } as Record<string, string>;
const age = (days: number | null) =>
  days == null ? 'âge inconnu' : days < 60 ? `${days} jours` : `${Math.floor(days / 30)} mois`;

/** Ce que l'on sait d'un reproducteur, affiché avant la saillie. */
function ProfileCard({ id }: { id: string }) {
  const { data, loading } = useQuery<{ reproductionProfile: Profile }>(PROFILE, { variables: { id }, fetchPolicy: 'cache-and-network' });
  const p = data?.reproductionProfile;
  if (!p) return loading ? <Loading label="Chargement de la fiche…" /> : null;
  const female = p.sex === 'FEMALE';
  const facts = [
    age(p.ageDays),
    p.weight != null ? `${formatNumber(p.weight, 2)} kg` : 'poids inconnu',
    ...(female
      ? [
          `${p.totalLitters} mise(s) bas`,
          p.averageLiveBorn != null ? `${formatNumber(p.averageLiveBorn)} petits vivants en moyenne` : null,
          p.daysSinceLastBirth != null ? `dernière mise bas il y a ${p.daysSinceLastBirth} j` : null,
          p.nursingKits ? `${p.nursingKits} lapereau(x) sous elle` : null,
          p.maternalBehavior ? MOTHER[p.maternalBehavior] : null,
        ]
      : [
          `${p.totalMatings} saillie(s)`,
          p.matingsLast7Days ? `${p.matingsLast7Days} cette semaine` : null,
          p.lastMatingDate ? `dernière le ${formatDate(p.lastMatingDate)}` : null,
        ]),
    p.successRate != null ? `${p.successRate} % de réussite` : null,
  ].filter(Boolean);
  return (
    <div className={`rounded-2xl border p-3 text-sm ${p.warnings.length ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
      <p className="font-semibold text-slate-900">
        {female ? '♀' : '♂'} {p.code}
      </p>
      <p className="mt-1 text-slate-700">{facts.join(' · ')}</p>
      {p.healthHistory && <p className="mt-1 text-slate-600">Antécédents : {p.healthHistory}</p>}
      {p.recentHealth.length > 0 && (
        <p className="mt-1 text-slate-600">
          Santé récente : {p.recentHealth.map((h) => `${formatDate(h.date)} ${h.text}`).join(' ; ')}
        </p>
      )}
      {p.warnings.length > 0 && (
        <ul className="mt-2 list-disc space-y-0.5 pl-5 text-amber-900">
          {p.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const YES_NO = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
  { value: '', label: 'Je ne sais pas' },
];

const CREATE = gql`
  mutation CreateBreeding($input: CreateBreedingInput!) { createBreeding(input: $input) { id } }
`;
const CANCEL = gql`
  mutation CancelBreeding($input: CancelBreedingInput!) { cancelBreeding(input: $input) { id } }
`;
const UPDATE = gql`
  mutation UpdateBreeding($input: UpdateBreedingInput!) { updateBreeding(input: $input) { id } }
`;
const DELETE = gql`
  mutation DeleteBreeding($id: ID!) { deleteBreeding(id: $id) }
`;
const CHECKS = gql`
  query BreedingChecks($breedingId: ID!) {
    pregnancyChecksByBreeding(breedingId: $breedingId) { id checkedDate result observation }
  }
`;
const DELETE_CHECK = gql`
  mutation DeletePregnancyCheck($id: ID!) { deletePregnancyCheck(id: $id) }
`;
const PALPATION = gql`
  mutation Palpation($input: CreatePregnancyCheckInput!) { createPregnancyCheck(input: $input) { id } }
`;
const NEST = gql`
  mutation Nest($input: RecordNestInstallationInput!) { recordNestInstallation(input: $input) { id } }
`;
const BIRTH = gql`
  mutation Birth($input: CreateBirthInput!) { createBirth(input: $input) { id litterCode } }
`;

interface Breeding {
  id: string;
  status: string;
  breedingDate: string;
  palpationStartDate: string;
  palpationEndDate: string;
  nestDate: string;
  expectedBirthStartDate: string;
  expectedBirthEndDate: string;
  observation?: string | null;
  birthId?: string | null;
  matingCount?: number;
  matings?: Array<{ id: string; date: string; male?: { id: string; code: string } | null }>;
  female?: { id: string; code: string } | null;
  male?: { id: string; code: string } | null;
  nestInstallation?: { id: string; installedAt: string } | null;
}

const STATUS_TONE: Record<string, BadgeTone> = {
  AWAITING_PALPATION: 'amber',
  PREGNANT: 'pink',
  INCONCLUSIVE: 'amber',
  NON_PREGNANT: 'slate',
  BIRTH_RECORDED: 'green',
  CANCELLED: 'red',
  PLANNED: 'blue',
};

const LEVEL_TONE: Record<string, BadgeTone> = { COMPATIBLE: 'green', WARNING: 'amber', BLOCKED: 'red' };

type ActionKind = 'palpation' | 'nest' | 'birth' | 'cancel';
type Action = { kind: ActionKind; breeding: Breeding; prefill?: Prefill } | null;
type PendingAction = { kind: ActionKind; breedingId: string; prefill?: Prefill; stamp: number };

const ACTION_KINDS: ActionKind[] = ['palpation', 'nest', 'birth'];

const refetchQueries = ['Breedings', 'Dashboard'];

export default function BreedingPage() {
  const [tab, setTab] = useState<'open' | 'all'>('open');
  const creating = useCreateModal();
  const [editing, setEditing] = useState<Breeding | null>(null);
  const remove = useDeleteAction(DELETE, { refetchQueries: [...refetchQueries, 'Tasks', 'HeaderTasks'] });
  const [selected, setSelected] = useState<Action>(null);
  // Action demandée par l'URL (tâche du jour ou brouillon de l'assistant),
  // ouverte dès que l'accouplement concerné est chargé.
  const [pending, setPending] = useState<PendingAction | null>(null);
  useUrlCommand((params) => {
    const kind = params.get('action') as ActionKind | null;
    const breedingId = params.get('breedingId');
    if (!kind || !breedingId || !ACTION_KINDS.includes(kind)) return false;
    setSelected(null);
    setPending({ kind, breedingId, prefill: parsePrefill(params.get('prefill')), stamp: Date.now() });
    return true;
  });

  const { data, loading, error, refetch } = useQuery<{ breedings: Breeding[] }>(BREEDINGS);
  const all = data?.breedings ?? [];
  const pendingBreeding = pending ? all.find((b) => b.id === pending.breedingId) : undefined;
  const action: Action =
    selected ?? (pending && pendingBreeding ? { kind: pending.kind, breeding: pendingBreeding, prefill: pending.prefill } : null);
  const setAction = (next: Action) => {
    setPending(null);
    setSelected(next);
  };
  const actionKey = action ? `${action.kind}-${action.breeding.id}-${pending?.stamp ?? 0}` : 'none';
  const rows =
    tab === 'open'
      ? all.filter((b) => ['PLANNED', 'AWAITING_PALPATION', 'PREGNANT', 'INCONCLUSIVE'].includes(b.status))
      : all;

  return (
    <div>
      <PageHeader
        eyebrow="Reproduction"
        title="Accouplements"
        description="Saillies, palpations, nids et mises bas (calendrier J+10, J+28, J+30)."
        actions={
          <Button onClick={() => creating.openModal()}>
            <Plus size={16} /> Nouvelle saillie
          </Button>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'open', label: 'En cours' },
          { value: 'all', label: 'Historique' },
        ]}
      />

      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : (
        <Table
          rows={rows}
          empty="Aucun accouplement"
          columns={[
            { header: 'Femelle', cell: (b) => <strong>{b.female?.code}</strong> },
            {
              header: 'Mâle',
              cell: (b) => {
                const others = [...new Set((b.matings ?? []).map((m) => m.male?.code).filter((c) => c && c !== b.male?.code))];
                return [b.male?.code, ...others].join(' + ');
              },
            },
            {
              header: 'Saillie',
              cell: (b) => (
                <span>
                  {formatDate(b.breedingDate)}
                  {(b.matingCount ?? 1) > 1 && (
                    <span className="ml-2 inline-block rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700" title={(b.matings ?? []).map((m) => `${timeOf(m.date)} ${m.male?.code ?? ''}`).join(' · ')}>
                      {b.matingCount} saillies
                    </span>
                  )}
                </span>
              ),
            },
            {
              header: 'Palpation',
              cell: (b) => `${formatDate(b.palpationStartDate)} → ${formatDate(b.palpationEndDate)}`,
            },
            { header: 'Nid', cell: (b) => (b.nestInstallation ? `✓ ${formatDate(b.nestInstallation.installedAt)}` : formatDate(b.nestDate)) },
            {
              header: 'Mise bas prévue',
              cell: (b) => `${formatDate(b.expectedBirthStartDate)} → ${formatDate(b.expectedBirthEndDate)}`,
            },
            {
              header: 'Statut',
              cell: (b) => <Badge tone={STATUS_TONE[b.status]}>{label(BREEDING_STATUS, b.status)}</Badge>,
            },
            {
              header: 'Actions',
              cell: (b) => (
                <RowActions
                  onEdit={() => setEditing(b)}
                  onDelete={() =>
                    remove.ask(
                      b.id,
                      `l'accouplement ${b.female?.code ?? ''} × ${b.male?.code ?? ''} du ${formatDate(b.breedingDate)}`,
                      b.birthId ? undefined : 'Ses palpations, son nid et ses tâches automatiques seront aussi supprimés.',
                    )
                  }
                >
                  <BreedingActions breeding={b} onAction={setAction} />
                </RowActions>
              ),
            },
          ]}
        />
      )}

      <CreateBreedingModal key={creating.key} open={creating.open} prefill={creating.prefill} onClose={creating.close} />
      <ActionModal key={actionKey} action={action} onClose={() => setAction(null)} />
      {editing && <EditBreedingModal key={editing.id} breeding={editing} onClose={() => setEditing(null)} />}
      {remove.dialog}
    </div>
  );
}

function BreedingActions({ breeding, onAction }: { breeding: Breeding; onAction: (a: Action) => void }) {
  const s = breeding.status;
  const btn = (kind: NonNullable<Action>['kind'], text: string, variant: 'secondary' | 'ghost' = 'secondary') => (
    <Button variant={variant} className="px-3 py-1 text-xs" onClick={() => onAction({ kind, breeding })}>
      {text}
    </Button>
  );
  return (
    <div className="flex gap-1">
      {['AWAITING_PALPATION', 'INCONCLUSIVE', 'PLANNED'].includes(s) && btn('palpation', 'Palpation')}
      {s === 'PREGNANT' && !breeding.nestInstallation && btn('nest', 'Nid')}
      {s === 'PREGNANT' && btn('birth', 'Mise bas')}
      {!['BIRTH_RECORDED', 'CANCELLED'].includes(s) && btn('cancel', 'Annuler', 'ghost')}
    </div>
  );
}

function CreateBreedingModal({ open, onClose, prefill }: { open: boolean; onClose: () => void; prefill?: Prefill }) {
  const females = useRabbitOptions({ sex: 'FEMALE' });
  const males = useRabbitOptions({ sex: 'MALE' });
  const { bind, values, reset, setValues } = useForm({
    femaleId: '',
    maleId: '',
    breedingDate: toDateInput(),
    breedingTime: '',
    observation: '',
    femaleWeight: '',
    maleWeight: '',
    femaleHeat: '',
    femaleHealthy: 'oui',
    maleHealthy: 'oui',
    matingSeen: '',
    ...PAST_FIELDS,
    ...prefill,
  });
  // Saillie de 65 jours ou plus : la portée est déjà sevrée, on enregistre toute la suite.
  const past = daysSince(values.breedingDate) >= PAST_BREEDING_MIN_DAYS;
  const [acknowledge, setAcknowledge] = useState(false);
  const answers = [
    values.femaleHeat && `Femelle en chaleur : ${values.femaleHeat}`,
    values.femaleHealthy && `Femelle en bonne santé : ${values.femaleHealthy}`,
    values.maleHealthy && `Mâle en forme : ${values.maleHealthy}`,
    values.matingSeen && `Saillie réussie : ${values.matingSeen}`,
  ].filter(Boolean);
  const unhealthy = values.femaleHealthy === 'non' || values.maleHealthy === 'non';

  const [check, { data: compat, loading: checking }] = useLazyQuery<{
    breedingCompatibility: {
      level: string;
      inbreedingCoefficient: number;
      reasons: Array<{ code: string; level: string; message: string }>;
      commonAncestors: Array<{ id: string; code: string }>;
    };
  }>(COMPATIBILITY_QUERY, { fetchPolicy: 'network-only' });

  const [createNow, now] = useMutation(CREATE, { refetchQueries });
  const [createPast, earlier] = useMutation(RECORD_PAST_BREEDING, {
    refetchQueries: [...refetchQueries, 'Tasks', 'HeaderTasks', 'LotOptions', 'CageOptions', 'LitterOptions'],
  });
  const { loading, error } = past ? earlier : now;
  const resetMutation = () => {
    now.reset();
    earlier.reset();
  };

  const result = compat?.breedingCompatibility;

  // Charge du mâle sur 24 h et saillie déjà faite aujourd'hui pour la femelle.
  const when = values.breedingDate ? matingDate(values.breedingDate, values.breedingTime) : null;
  const { data: ctxData } = useQuery<{
    matingContext: {
      maleFemalesLast24h: string[];
      maleLimitReached: boolean;
      sameDayBreedingId?: string | null;
      sameDayMatingCount: number;
      femaleHasOtherActiveBreeding: boolean;
    };
  }>(MATING_CONTEXT, {
    variables: { femaleId: values.femaleId || null, maleId: values.maleId || null, date: when },
    skip: !when || (!values.femaleId && !values.maleId),
    fetchPolicy: 'network-only',
  });
  const mating = ctxData?.matingContext;
  const maleCode = males.options.find((o) => o.value === values.maleId)?.label ?? 'Ce mâle';

  // Couple pré-rempli (assistant) : on vérifie tout de suite la compatibilité.
  useEffect(() => {
    if (prefill?.femaleId && prefill.maleId) void check({ variables: { femaleId: prefill.femaleId, maleId: prefill.maleId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyAi = (fields: Record<string, string>) => {
    setValues((previous) => ({ ...previous, ...fields }));
    const femaleId = fields.femaleId ?? values.femaleId;
    const maleId = fields.maleId ?? values.maleId;
    setAcknowledge(false);
    if (femaleId && maleId) void check({ variables: { femaleId, maleId } });
  };

  const onPairChange = (key: 'femaleId' | 'maleId', value: string) => {
    bind(key).onChange({ target: { value } });
    const femaleId = key === 'femaleId' ? value : values.femaleId;
    const maleId = key === 'maleId' ? value : values.maleId;
    setAcknowledge(false);
    if (femaleId && maleId) void check({ variables: { femaleId, maleId } });
  };

  const close = () => {
    reset();
    resetMutation();
    setAcknowledge(false);
    onClose();
  };

  async function submit() {
    if (past) {
      await createPast({
        variables: {
          input: clean({
            femaleId: values.femaleId,
            maleId: values.maleId,
            breedingDate: matingDate(values.breedingDate, values.breedingTime),
            observation: values.observation.trim(),
            acknowledgeWarnings: acknowledge,
            ...pastBreedingInput(values.breedingDate, values),
          }),
        },
      });
      close();
      return;
    }
    await createNow({
      variables: {
        input: clean({
          femaleId: values.femaleId,
          maleId: values.maleId,
          breedingDate: matingDate(values.breedingDate, values.breedingTime),
          observation: [answers.join(' · '), values.observation.trim()].filter(Boolean).join('\n'),
          femaleWeight: toFloat(values.femaleWeight),
          maleWeight: toFloat(values.maleWeight),
          acknowledgeWarnings: acknowledge,
        }),
      },
    });
    close();
  }

  const blocked = result?.level === 'BLOCKED';
  const needsAck = result?.level === 'WARNING' && !acknowledge;

  return (
    <Modal
      open={open}
      title="Nouvelle saillie"
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button
            onClick={() => submit().catch(() => undefined)}
            loading={loading}
            disabled={
              !values.femaleId || !values.maleId || blocked || needsAck || mating?.maleLimitReached || (past && !pastBreedingReady(values))
            }
          >
            {past ? 'Enregistrer jusqu’au lot' : mating?.sameDayBreedingId ? 'Ajouter la saillie' : 'Enregistrer'}
          </Button>
        </>
      }
    >
      <AiFill form="BREEDING" onFill={applyAi} />
      <FormGrid>
        <Field label="Femelle">
          <Select
            placeholder="Choisir…"
            options={females.options}
            value={values.femaleId}
            onChange={(e) => onPairChange('femaleId', e.target.value)}
          />
        </Field>
        <Field label="Mâle">
          <Select
            placeholder="Choisir…"
            options={males.options}
            value={values.maleId}
            onChange={(e) => onPairChange('maleId', e.target.value)}
          />
        </Field>
        <Field label="Date de saillie">
          <Input type="date" {...bind('breedingDate')} />
        </Field>
        <Field label="Heure (facultatif)" hint="Utile si la femelle est saillie plusieurs fois dans la journée.">
          <Input type="time" {...bind('breedingTime')} />
        </Field>
      </FormGrid>

      {mating?.maleLimitReached && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <strong>{maleCode} a déjà sailli {mating.maleFemalesLast24h.length} femelles en 24 h</strong> ({mating.maleFemalesLast24h.join(', ')}).
          {' '}Un mâle ne doit pas couvrir plus de 2 femelles par 24 h : choisis un autre mâle ou attends demain.
        </div>
      )}
      {mating && !mating.maleLimitReached && mating.maleFemalesLast24h.length === 1 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {maleCode} a déjà sailli {mating.maleFemalesLast24h[0]} dans les dernières 24 h : ce sera sa dernière femelle avant demain.
        </div>
      )}
      {!past && mating?.sameDayBreedingId && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
          Cette femelle a déjà été saillie ce jour-là : cette saillie s’ajoutera au même accouplement ({mating.sameDayMatingCount + 1}ᵉ saillie), sans en créer un nouveau.
        </div>
      )}
      {!past && mating?.femaleHasOtherActiveBreeding && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Cette femelle a déjà un accouplement en cours (pas le même jour). Enregistre d’abord sa palpation ou annule cet accouplement.
          {' '}Pour noter une saillie plus ancienne, mets sa date : à {PAST_BREEDING_MIN_DAYS} jours ou plus, l’app enregistre toute la suite jusqu’au lot.
        </div>
      )}
      {past && <PastBreedingFields breedingDate={values.breedingDate} values={values} bind={bind} />}

      {checking && <Loading label="Vérification de la généalogie…" />}
      {result && (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            result.level === 'COMPATIBLE'
              ? 'border-emerald-200 bg-emerald-50'
              : result.level === 'WARNING'
                ? 'border-amber-200 bg-amber-50'
                : 'border-red-200 bg-red-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <Badge tone={LEVEL_TONE[result.level]}>{label(COMPATIBILITY, result.level)}</Badge>
            <span className="text-slate-600">
              Consanguinité estimée : {(result.inbreedingCoefficient * 100).toFixed(2)} %
            </span>
          </div>
          {result.reasons.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {result.reasons.map((r) => (
                <li key={r.code}>{r.message}</li>
              ))}
            </ul>
          )}
          {result.commonAncestors.length > 0 && (
            <p className="mt-2 text-slate-600">
              Ancêtres communs : {result.commonAncestors.map((a) => a.code).join(', ')}
            </p>
          )}
          {result.level === 'WARNING' && (
            <label className="mt-3 flex items-center gap-2 font-medium">
              <input type="checkbox" checked={acknowledge} onChange={(e) => setAcknowledge(e.target.checked)} />
              Je confirme cet accouplement malgré le risque
            </label>
          )}
        </div>
      )}

      {(values.femaleId || values.maleId) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {values.femaleId ? <ProfileCard key={values.femaleId} id={values.femaleId} /> : <div />}
          {values.maleId ? <ProfileCard key={values.maleId} id={values.maleId} /> : <div />}
        </div>
      )}

      {!past && values.femaleId && values.maleId && (
        <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-900">Quelques questions avant d’enregistrer</p>
          <FormGrid>
            <Field label="La femelle est-elle en chaleur ?" hint="Vulve rouge ou violacée, elle se laisse monter">
              <Select options={YES_NO} {...bind('femaleHeat')} />
            </Field>
            <Field label="La femelle est-elle en bonne santé ?">
              <Select options={YES_NO} {...bind('femaleHealthy')} />
            </Field>
            <Field label="Poids de la femelle aujourd’hui (kg)" hint="Facultatif : met à jour sa fiche">
              <Input inputMode="decimal" placeholder="ex. 3,8" {...bind('femaleWeight')} />
            </Field>
            <Field label="Le mâle est-il en forme ?" hint="Actif, mange bien, pas malade">
              <Select options={YES_NO} {...bind('maleHealthy')} />
            </Field>
            <Field label="Poids du mâle aujourd’hui (kg)" hint="Facultatif : met à jour sa fiche">
              <Input inputMode="decimal" placeholder="ex. 4,2" {...bind('maleWeight')} />
            </Field>
            <Field label="La saillie a-t-elle réussi ?" hint="Le mâle tombe sur le côté après l’accouplement">
              <Select options={YES_NO} {...bind('matingSeen')} />
            </Field>
          </FormGrid>
          {unhealthy && (
            <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              Un lapin malade donne souvent une saillie ratée ou une portée faible. Mieux vaut le soigner avant.
            </p>
          )}
          {values.matingSeen === 'non' && (
            <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              Si la saillie n’a pas réussi, tu peux la retenter plus tard dans la journée ou le lendemain.
            </p>
          )}
        </div>
      )}

      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}

const REMATING_DELAY_DAYS = 10;

/** Rappels après une mise bas : déparasiter la mère, puis la ressaillie à J+10. */
function AfterBirthModal({ female, birthDate, onClose }: { female: { id: string; code: string }; birthDate: string; onClose: () => void }) {
  const router = useRouter();
  const remate = new Date(`${birthDate}T12:00:00`);
  remate.setDate(remate.getDate() + REMATING_DELAY_DAYS);
  const treatment = `/health?new=1&prefill=${encodeURIComponent(
    JSON.stringify({ rabbitId: female.id, type: 'TREATMENT', treatment: 'Déparasitage après mise bas', medication: 'Pandex 1 %' }),
  )}`;
  return (
    <Modal
      open
      title="Mise bas enregistrée"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Plus tard</Button>
          <Button
            onClick={() => {
              onClose();
              router.push(treatment);
            }}
          >
            Noter le déparasitage
          </Button>
        </>
      }
    >
      <div className="space-y-3 text-sm text-slate-700">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
          <Syringe size={20} className="mt-0.5 shrink-0" />
          <p>
            <strong>Pense à déparasiter {female.code}.</strong> Injecte-lui un déparasitant, par exemple <strong>Pandex 1 %</strong>, à la dose
            indiquée par la notice ou le vétérinaire. Une tâche a été ajoutée pour demain.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sky-900">
          <CalendarClock size={20} className="mt-0.5 shrink-0" />
          <p>
            Le <strong>{remate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</strong> (J+{REMATING_DELAY_DAYS}),
            l’app te demandera le poids et l’état de {female.code} pour te dire si elle peut être ressaillie.
          </p>
        </div>
      </div>
    </Modal>
  );
}

function ActionModal({ action, onClose }: { action: Action; onClose: () => void }) {
  const { bind, values, reset, setValues } = useForm({
    date: toDateInput(),
    result: 'PREGNANT',
    liveBorn: '',
    stillBorn: '0',
    litterCode: '',
    nestType: '',
    material: '',
    observation: '',
    ...action?.prefill,
  });
  const [createKits, setCreateKits] = useState(true);
  const [born, setBorn] = useState<{ birthDate: string } | null>(null);
  const opts = { refetchQueries: [...refetchQueries, 'HeaderTasks'] };
  const [palpate, p] = useMutation(PALPATION, opts);
  const [nest, n] = useMutation(NEST, opts);
  const [birth, b] = useMutation(BIRTH, opts);
  const [cancel, c] = useMutation(CANCEL, opts);

  if (!action) return null;
  const { kind, breeding } = action;
  const date = fromDateInput(values.date);
  const close = () => {
    reset();
    setBorn(null);
    [p, n, b, c].forEach((m) => m.reset());
    onClose();
  };

  // Après la mise bas : rappel du déparasitage et de la ressaillie.
  if (born && breeding.female) return <AfterBirthModal female={breeding.female} birthDate={born.birthDate} onClose={close} />;

  const titles = {
    palpation: `Palpation de ${breeding.female?.code}`,
    nest: `Installation du nid — ${breeding.female?.code}`,
    birth: `Mise bas de ${breeding.female?.code}`,
    cancel: `Annuler l'accouplement ${breeding.female?.code} × ${breeding.male?.code}`,
  };

  async function submit() {
    const observation = values.observation || undefined;
    if (kind === 'palpation') {
      await palpate({ variables: { input: { breedingId: breeding.id, checkedDate: date, result: values.result, observation } } });
    } else if (kind === 'nest') {
      await nest({
        variables: { input: clean({ breedingId: breeding.id, installedAt: date, nestType: values.nestType, material: values.material, observation }) },
      });
    } else if (kind === 'birth') {
      await birth({
        variables: {
          input: clean({
            breedingId: breeding.id,
            birthDate: date,
            liveBorn: toInt(values.liveBorn) ?? 0,
            stillBorn: toInt(values.stillBorn) ?? 0,
            litterCode: values.litterCode,
            createKits,
            observation,
          }),
        },
      });
      if (breeding.female) {
        setBorn({ birthDate: values.date });
        return;
      }
    } else {
      await cancel({ variables: { input: { id: breeding.id, observation } } });
    }
    close();
  }

  const mutation = { palpation: p, nest: n, birth: b, cancel: c }[kind];

  return (
    <Modal
      open
      title={titles[kind]}
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>Fermer</Button>
          <Button
            variant={kind === 'cancel' ? 'danger' : 'primary'}
            loading={mutation.loading}
            onClick={() => submit().catch(() => undefined)}
          >
            {kind === 'cancel' ? "Annuler l'accouplement" : 'Enregistrer'}
          </Button>
        </>
      }
    >
      {(kind === 'palpation' || kind === 'birth') && (
        <AiFill
          form={kind === 'birth' ? 'BIRTH' : 'PALPATION'}
          context={`Femelle : ${breeding.female?.code ?? '?'}, mâle : ${breeding.male?.code ?? '?'}, saillie du ${formatDate(breeding.breedingDate)}`}
          onFill={(fields) => setValues((previous) => ({ ...previous, ...fields }))}
        />
      )}
      {kind !== 'cancel' && (
        <FormGrid>
          <Field label="Date">
            <Input type="date" {...bind('date')} />
          </Field>
          {kind === 'palpation' && (
            <Field label="Résultat">
              <Select options={options(PREGNANCY_RESULT)} {...bind('result')} />
            </Field>
          )}
          {kind === 'nest' && (
            <>
              <Field label="Type de nid">
                <Input placeholder="Boîte à nid, caisse…" {...bind('nestType')} />
              </Field>
              <Field label="Matériau">
                <Input placeholder="Paille, copeaux…" {...bind('material')} />
              </Field>
            </>
          )}
          {kind === 'birth' && (
            <>
              <Field label="Nés vivants">
                <Input type="number" min={0} required {...bind('liveBorn')} />
              </Field>
              <Field label="Mort-nés">
                <Input type="number" min={0} {...bind('stillBorn')} />
              </Field>
              <Field label="Code de portée" hint="Laisser vide pour générer L001, L002…">
                <Input {...bind('litterCode')} />
              </Field>
              <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
                <input type="checkbox" checked={createKits} onChange={(e) => setCreateKits(e.target.checked)} />
                Créer les lapereaux (L001-01, L001-02…)
              </label>
            </>
          )}
        </FormGrid>
      )}
      {kind === 'palpation' && values.result === 'INCONCLUSIVE' && (
        <p className="text-sm text-amber-700">Une nouvelle palpation sera planifiée dans 4 jours.</p>
      )}
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={mutation.error} />
    </Modal>
  );
}

/** Correction d'un accouplement et de ses palpations. */
function EditBreedingModal({ breeding, onClose }: { breeding: Breeding; onClose: () => void }) {
  const males = useRabbitOptions({ sex: 'MALE' });
  const locked = Boolean(breeding.birthId);
  const { bind, values } = useForm({
    maleId: breeding.male?.id ?? '',
    breedingDate: toDateInput(breeding.breedingDate),
    observation: breeding.observation ?? '',
  });
  const [acknowledge, setAcknowledge] = useState(false);
  const [save, { loading, error }] = useMutation(UPDATE, { refetchQueries: [...refetchQueries, 'Tasks', 'HeaderTasks'] });
  const { data: checks } = useQuery<{
    pregnancyChecksByBreeding: Array<{ id: string; checkedDate: string; result: string; observation?: string | null }>;
  }>(CHECKS, { variables: { breedingId: breeding.id }, fetchPolicy: 'cache-and-network' });
  const removeCheck = useDeleteAction(DELETE_CHECK, {
    refetchQueries: [...refetchQueries, 'BreedingChecks', 'Tasks', 'HeaderTasks'],
  });
  const warning = error && /avertissement|confirm/i.test(error.message);

  return (
    <Modal
      open
      title={`Modifier l'accouplement ${breeding.female?.code ?? ''} × ${breeding.male?.code ?? ''}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Fermer</Button>
          <Button
            loading={loading}
            onClick={() =>
              save({
                variables: {
                  input: locked
                    ? { id: breeding.id, observation: values.observation }
                    : {
                        id: breeding.id,
                        maleId: values.maleId || undefined,
                        breedingDate: fromDateInput(values.breedingDate),
                        observation: values.observation,
                        acknowledgeWarnings: acknowledge,
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
      {locked && (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          La mise bas est enregistrée : seule l&apos;observation peut être modifiée. Pour corriger la date ou le mâle, supprime d&apos;abord la mise bas (page Mises bas).
        </p>
      )}
      <FormGrid>
        <Field label="Date de saillie" hint="Le calendrier et les tâches sont recalculés">
          <Input type="date" disabled={locked} {...bind('breedingDate')} />
        </Field>
        <Field label="Mâle">
          <Select disabled={locked} options={males.options} {...bind('maleId')} />
        </Field>
      </FormGrid>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      {warning && (
        <label className="flex items-center gap-2 text-sm text-amber-800">
          <input type="checkbox" checked={acknowledge} onChange={(e) => setAcknowledge(e.target.checked)} />
          Je confirme ce mâle malgré l&apos;avertissement généalogique
        </label>
      )}
      <ErrorBox error={error} />
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-700">Palpations</h3>
        <Table
          rows={checks?.pregnancyChecksByBreeding ?? []}
          empty="Aucune palpation"
          columns={[
            { header: 'Date', cell: (c) => formatDate(c.checkedDate) },
            { header: 'Résultat', cell: (c) => label(PREGNANCY_RESULT, c.result) },
            { header: 'Observation', cell: (c) => c.observation ?? '—' },
            {
              header: '',
              cell: (c) =>
                !locked && (
                  <RowActions
                    onDelete={() =>
                      removeCheck.ask(c.id, `la palpation du ${formatDate(c.checkedDate)}`, 'Le statut de l’accouplement revient à la palpation précédente.')
                    }
                  />
                ),
            },
          ]}
        />
      </div>
      {removeCheck.dialog}
    </Modal>
  );
}
