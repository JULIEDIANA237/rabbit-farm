'use client';

import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';

import {
  Badge, Button, ErrorBox, Field, FormGrid, Input, Loading, Modal, PageHeader, Select, Table, Tabs, Textarea,
  type BadgeTone,
} from '@/components/ui/kit';
import { useRabbitOptions } from '@/graphql/options';
import { parsePrefill, toInt, useCreateModal, useForm, useUrlCommand, type Prefill } from '@/hooks/use-form';
import { AiFill } from '@/components/assistant/ai-fill';
import { clean, formatDate, fromDateInput, toDateInput } from '@/lib/format';
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
      female { id code }
      male { id code }
      nestInstallation { id installedAt }
    }
  }
`;

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

const CREATE = gql`
  mutation CreateBreeding($input: CreateBreedingInput!) { createBreeding(input: $input) { id } }
`;
const CANCEL = gql`
  mutation CancelBreeding($input: CancelBreedingInput!) { cancelBreeding(input: $input) { id } }
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
            { header: 'Mâle', cell: (b) => b.male?.code },
            { header: 'Saillie', cell: (b) => formatDate(b.breedingDate) },
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
              cell: (b) => <RowActions breeding={b} onAction={setAction} />,
            },
          ]}
        />
      )}

      <CreateBreedingModal key={creating.key} open={creating.open} prefill={creating.prefill} onClose={creating.close} />
      <ActionModal key={actionKey} action={action} onClose={() => setAction(null)} />
    </div>
  );
}

function RowActions({ breeding, onAction }: { breeding: Breeding; onAction: (a: Action) => void }) {
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
    observation: '',
    ...prefill,
  });
  const [acknowledge, setAcknowledge] = useState(false);

  const [check, { data: compat, loading: checking }] = useLazyQuery<{
    breedingCompatibility: {
      level: string;
      inbreedingCoefficient: number;
      reasons: Array<{ code: string; level: string; message: string }>;
      commonAncestors: Array<{ id: string; code: string }>;
    };
  }>(COMPATIBILITY_QUERY, { fetchPolicy: 'network-only' });

  const [create, { loading, error, reset: resetMutation }] = useMutation(CREATE, { refetchQueries });

  const result = compat?.breedingCompatibility;

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
    await create({
      variables: {
        input: clean({
          femaleId: values.femaleId,
          maleId: values.maleId,
          breedingDate: fromDateInput(values.breedingDate),
          observation: values.observation,
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
            disabled={!values.femaleId || !values.maleId || blocked || needsAck}
          >
            Enregistrer
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
      </FormGrid>

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

      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={error} />
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
    [p, n, b, c].forEach((m) => m.reset());
    onClose();
  };

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
