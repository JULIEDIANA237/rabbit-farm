'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { FileText, Plus } from 'lucide-react';

import {
  Badge, Button, ErrorBox, Field, FormGrid, Input, Loading, Modal, PageHeader, Select, Table, Tabs, Textarea,
} from '@/components/ui/kit';
import { useLitterOptions, useLotOptions } from '@/graphql/options';
import { toFloat, toInt, useForm, useOpenFromQuery } from '@/hooks/use-form';
import { clean, formatDate, formatNumber, fromDateInput, toDateInput } from '@/lib/format';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';

const WEANINGS = gql`
  query Weanings {
    weanings {
      id
      litterId
      litterCode
      plannedDate
      actualDate
      quantity
      averageWeight
      totalWeight
      observation
      fatteningLotId
      fatteningLotCode
    }
  }
`;
const CREATE = gql`
  mutation CreateWeaning($input: CreateWeaningInput!) { createWeaning(input: $input) { id fatteningLotId fatteningLotCode } }
`;
const UPDATE = gql`
  mutation UpdateWeaning($input: UpdateWeaningInput!) { updateWeaning(input: $input) { id } }
`;
const DELETE = gql`
  mutation DeleteWeaning($id: ID!) { deleteWeaning(id: $id) }
`;
const COMPLETE = gql`
  mutation CompleteWeaning($input: CompleteWeaningInput!) { completeWeaning(input: $input) { id fatteningLotId fatteningLotCode } }
`;

interface Weaning {
  id: string;
  litterId: string;
  litterCode?: string | null;
  plannedDate: string;
  actualDate?: string | null;
  quantity: number;
  averageWeight?: number | null;
  totalWeight?: number | null;
  observation?: string | null;
  fatteningLotId?: string | null;
  fatteningLotCode?: string | null;
}

type WeaningResult = { id: string; fatteningLotId?: string | null; fatteningLotCode?: string | null };

const refetchQueries = ['Weanings', 'Dashboard', 'LitterOptions', 'FatteningLots', 'LotOptions', 'RabbitsPaginated'];

const SEND_TO_FATTENING = gql`
  mutation SendWeaningToFattening($weaningId: ID!) {
    sendWeaningToFattening(weaningId: $weaningId) { id fatteningLotId fatteningLotCode }
  }
`;

const LITTER_DEATHS = gql`
  mutation WeaningLitterDeaths($input: RecordLitterMortalityInput!) { recordLitterMortality(input: $input) { id } }
`;

const NEW_LOT = '__new__';
/** Le poids d'un lapereau se saisit en grammes ; l'API le stocke en kg. */
const gramsToKg = (value: string) => {
  const grams = toFloat(value);
  return grams == null ? undefined : Math.round(grams) / 1000;
};
const AVG_LABEL = 'Poids moyen d’un lapereau (g)';
const TOTAL_LABEL = 'Poids total des lapereaux sevrés (kg)';
const AVG_HINT = 'Poids d’UN lapereau, en grammes (ex. 800). Saisis l’un ou l’autre, l’app calcule le second.';
const TOTAL_HINT = 'Tous les lapereaux sevrés pesés ensemble.';

export default function WeaningPage() {
  const [tab, setTab] = useState<'planned' | 'done'>('planned');
  const [creating, setCreating] = useState(false);
  const [completing, setCompleting] = useState<Weaning | null>(null);
  const [editing, setEditing] = useState<Weaning | null>(null);
  const [lastLot, setLastLot] = useState<{ id: string; code: string } | null>(null);
  // Sevrages réalisés avant la correction : restés sans lot d'engraissement.
  const [sendToFattening] = useMutation<{ sendWeaningToFattening: WeaningResult }>(SEND_TO_FATTENING, { refetchQueries });
  const [sending, setSending] = useState<string | null>(null);
  const [sendError, setSendError] = useState<Error | null>(null);
  const router = useRouter();
  const showLot = (r?: WeaningResult | null) => {
    if (r?.fatteningLotId && r.fatteningLotCode) {
      setLastLot({ id: r.fatteningLotId, code: r.fatteningLotCode });
      setTab('done');
    }
  };
  /** Sevrage réalisé : direction le lot d'engraissement, puis les cages. */
  const goToLot = (r?: WeaningResult | null) => {
    if (r?.fatteningLotId) router.push(`/fattening/${r.fatteningLotId}?weaned=1`);
    else showLot(r);
  };
  const remove = useDeleteAction(DELETE, { refetchQueries: [...refetchQueries, 'Litters', 'Tasks', 'HeaderTasks'] });
  useOpenFromQuery(() => setCreating(true));

  const { data, loading, error, refetch } = useQuery<{ weanings: Weaning[] }>(WEANINGS);
  const rows = (data?.weanings ?? []).filter((w) => (tab === 'planned' ? !w.actualDate : !!w.actualDate));

  return (
    <div>
      <PageHeader
        eyebrow="Sevrage"
        title="Sevrages"
        description="Sevrage à J+35 par défaut. Les lapereaux sevrés peuvent rejoindre un lot d'engraissement."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus size={16} /> Nouveau sevrage
          </Button>
        }
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'planned', label: 'Planifiés' },
          { value: 'done', label: 'Réalisés' },
        ]}
      />
      {lastLot && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="flex-1">
            Les lapereaux sevrés sont dans le lot <strong>{lastLot.code}</strong> (Engraissement).
          </p>
          <Link href={`/print/lot/${lastLot.id}`}>
            <Button>
              <FileText size={16} /> Fiche de suivi
            </Button>
          </Link>
          <Link href={`/fattening/${lastLot.id}`}>
            <Button variant="secondary">Voir le lot</Button>
          </Link>
        </div>
      )}
      <ErrorBox error={error} onRetry={() => refetch()} />
      <ErrorBox error={sendError} />
      {loading && !data ? (
        <Loading />
      ) : (
        <Table
          rows={rows}
          empty={tab === 'planned' ? 'Aucun sevrage planifié' : 'Aucun sevrage réalisé'}
          columns={[
            {
              header: 'Portée',
              cell: (w) => <Link className="font-semibold text-emerald-700" href={`/litters/${w.litterId}`}>{w.litterCode ?? '—'}</Link>,
            },
            { header: 'Prévu le', cell: (w) => formatDate(w.plannedDate) },
            { header: 'Réalisé le', cell: (w) => (w.actualDate ? <Badge tone="green">{formatDate(w.actualDate)}</Badge> : '—') },
            { header: 'Quantité', cell: (w) => w.quantity },
            { header: 'Poids moyen', cell: (w) => (w.averageWeight != null ? `${formatNumber(w.averageWeight * 1000, 0)} g` : '—') },
            {
              header: 'Lot',
              cell: (w) =>
                w.fatteningLotId ? (
                  <span className="flex items-center gap-2">
                    <Link className="font-semibold text-emerald-700" href={`/fattening/${w.fatteningLotId}`}>{w.fatteningLotCode}</Link>
                    <Link href={`/print/lot/${w.fatteningLotId}`} title="Fiche de suivi" aria-label="Fiche de suivi" className="text-slate-500 hover:text-emerald-700">
                      <FileText size={16} />
                    </Link>
                  </span>
                ) : w.actualDate ? (
                  <Button
                    variant="secondary"
                    className="px-3 py-1 text-xs"
                    loading={sending === w.id}
                    onClick={() => {
                      setSending(w.id);
                      sendToFattening({ variables: { weaningId: w.id } })
                        .then((res) => showLot(res.data?.sendWeaningToFattening))
                        .catch((e: Error) => setSendError(e))
                        .finally(() => setSending(null));
                    }}
                  >
                    Mettre en engraissement
                  </Button>
                ) : (
                  '—'
                ),
            },
            {
              header: '',
              cell: (w) => (
                <RowActions
                  onEdit={() => setEditing(w)}
                  onDelete={() =>
                    remove.ask(
                      w.id,
                      `le sevrage de la portée ${w.litterCode ?? ''} (${formatDate(w.actualDate ?? w.plannedDate)})`,
                      w.actualDate ? 'Les lapereaux reviennent dans la portée et sortent du lot où le sevrage les avait placés.' : undefined,
                    )
                  }
                >
                  {!w.actualDate && <Button className="px-3 py-1 text-xs" onClick={() => setCompleting(w)}>Réaliser</Button>}
                </RowActions>
              ),
            },
          ]}
        />
      )}
      <WeaningModal open={creating} onClose={() => setCreating(false)} onSaved={goToLot} />
      {completing && <WeaningModal open weaning={completing} onClose={() => setCompleting(null)} onSaved={goToLot} />}
      {editing && <EditWeaningModal key={editing.id} weaning={editing} onClose={() => setEditing(null)} />}
      {remove.dialog}
    </div>
  );
}

function EditWeaningModal({ weaning, onClose }: { weaning: Weaning; onClose: () => void }) {
  const { bind, values } = useForm({
    plannedDate: toDateInput(weaning.plannedDate),
    actualDate: weaning.actualDate ? toDateInput(weaning.actualDate) : '',
    averageWeight: weaning.averageWeight != null ? String(Math.round(weaning.averageWeight * 1000)) : '',
    totalWeight: weaning.totalWeight != null ? String(weaning.totalWeight) : '',
    observation: weaning.observation ?? '',
  });
  const [save, { loading, error }] = useMutation(UPDATE, { refetchQueries });
  return (
    <Modal
      open
      title={`Modifier le sevrage — portée ${weaning.litterCode ?? ''}`}
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
                    ...clean({
                      id: weaning.id,
                      plannedDate: fromDateInput(values.plannedDate),
                      actualDate: values.actualDate ? fromDateInput(values.actualDate) : undefined,
                      averageWeight: gramsToKg(values.averageWeight),
                      totalWeight: toFloat(values.totalWeight),
                    }),
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
        <Field label="Date prévue">
          <Input type="date" {...bind('plannedDate')} />
        </Field>
        {weaning.actualDate && (
          <Field label="Date réelle">
            <Input type="date" {...bind('actualDate')} />
          </Field>
        )}
        <Field label={AVG_LABEL} hint={AVG_HINT}>
          <Input inputMode="decimal" {...bind('averageWeight')} />
        </Field>
        <Field label={TOTAL_LABEL} hint={TOTAL_HINT}>
          <Input inputMode="decimal" {...bind('totalWeight')} />
        </Field>
      </FormGrid>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={error} />
    </Modal>
  );
}

function WeaningModal({
  open,
  weaning,
  onClose,
  onSaved,
}: {
  open: boolean;
  weaning?: Weaning;
  onClose: () => void;
  onSaved?: (result?: WeaningResult | null) => void;
}) {
  const litters = useLitterOptions();
  const lots = useLotOptions();
  const { bind, values, reset } = useForm({
    litterId: '',
    plannedDate: toDateInput(),
    done: weaning ? 'yes' : 'no',
    actualDate: toDateInput(),
    quantity: weaning ? String(weaning.quantity) : '',
    averageWeight: '',
    totalWeight: '',
    fatteningLotId: NEW_LOT,
    observation: '',
    deaths: '',
    deathCount: '',
    deathCause: '',
  });
  const [create, c] = useMutation<{ createWeaning: WeaningResult }>(CREATE, { refetchQueries });
  const [recordDeaths, d] = useMutation(LITTER_DEATHS, { refetchQueries: ['LitterOptions', 'Litters', 'RabbitsPaginated'] });
  const [complete, k] = useMutation<{ completeWeaning: WeaningResult }>(COMPLETE, { refetchQueries });
  const mutation = weaning ? k : c;
  const deathCount = values.deaths === 'yes' ? toInt(values.deathCount) ?? 0 : 0;
  const deathsSaved = useRef(false);

  const close = () => {
    reset();
    c.reset();
    k.reset();
    d.reset();
    deathsSaved.current = false;
    onClose();
  };

  const selectedLitter = litters.litters.find((l) => l.id === values.litterId);
  const done = weaning || values.done === 'yes';
  const litterCount = weaning ? weaning.quantity : selectedLitter?.currentCount;
  const count = toInt(values.quantity) ?? (litterCount != null ? Math.max(0, litterCount - deathCount) : 0);
  /** Affiche le poids calculé à partir de l'autre champ. */
  const weightHint = (field: 'avg' | 'total') => {
    const avg = toFloat(values.averageWeight);
    const total = toFloat(values.totalWeight);
    if (!count) return null;
    if (field === 'avg' && !avg && total) return `Calculé : ${formatNumber((total / count) * 1000, 0)} g par lapereau`;
    if (field === 'total' && !total && avg) return `Calculé : ${formatNumber((avg / 1000) * count, 2)} kg pour ${count} lapereaux`;
    return null;
  };

  async function submit() {
    // Morts depuis la naissance : enregistrés sur la portée avant le sevrage.
    const litterId = weaning?.litterId ?? values.litterId;
    if (done && deathCount > 0 && litterId && !deathsSaved.current) {
      await recordDeaths({
        variables: {
          input: clean({ litterId, date: fromDateInput(values.actualDate), count: deathCount, cause: values.deathCause }),
        },
      });
      // Pas de double enregistrement si le sevrage échoue et qu'on réessaie.
      deathsSaved.current = true;
    }
    const common = {
      quantity: toInt(values.quantity) ?? (done && deathCount > 0 ? count : undefined),
      averageWeight: gramsToKg(values.averageWeight),
      totalWeight: toFloat(values.totalWeight),
      fatteningLotId: values.fatteningLotId === NEW_LOT ? undefined : values.fatteningLotId,
      createFatteningLot: values.fatteningLotId === NEW_LOT ? true : undefined,
      observation: values.observation,
    };
    if (weaning) {
      const r = await complete({ variables: { input: clean({ id: weaning.id, actualDate: fromDateInput(values.actualDate), ...common }) } });
      onSaved?.(r.data?.completeWeaning);
    } else {
      const r = await create({
        variables: {
          input: clean({
            litterId: values.litterId,
            plannedDate: fromDateInput(values.plannedDate),
            actualDate: done ? fromDateInput(values.actualDate) : undefined,
            ...common,
            quantity: common.quantity ?? (selectedLitter ? Math.max(0, selectedLitter.currentCount - deathCount) : 0),
          }),
        },
      });
      onSaved?.(r.data?.createWeaning);
    }
    close();
  }

  return (
    <Modal
      open={open}
      title={weaning ? `Réaliser le sevrage ${weaning.litterCode ?? ''}` : 'Nouveau sevrage'}
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button loading={mutation.loading} onClick={() => submit().catch(() => undefined)}>Enregistrer</Button>
        </>
      }
    >
      <FormGrid>
        {!weaning && (
          <>
            <Field label="Portée">
              <Select placeholder="Choisir…" options={litters.options} {...bind('litterId')} />
            </Field>
            <Field label="Date prévue">
              <Input type="date" {...bind('plannedDate')} />
            </Field>
            <Field label="Déjà réalisé ?">
              <Select options={[{ value: 'no', label: 'Non, planifier' }, { value: 'yes', label: 'Oui, sevrer maintenant' }]} {...bind('done')} />
            </Field>
          </>
        )}
        {done && (
          <Field label="Date de sevrage">
            <Input type="date" {...bind('actualDate')} />
          </Field>
        )}
        {done && (
          <Field label="Des lapereaux sont-ils morts depuis la naissance ?" hint="Ils sont retirés de la portée avant le sevrage.">
            <Select
              placeholder="Choisir…"
              options={[
                { value: 'no', label: 'Non, aucun mort' },
                { value: 'yes', label: 'Oui' },
              ]}
              {...bind('deaths')}
            />
          </Field>
        )}
        {done && values.deaths === 'yes' && (
          <>
            <Field label="Combien de morts ?">
              <Input type="number" min={1} placeholder="ex. 2" {...bind('deathCount')} />
            </Field>
            <Field label="Cause (si connue)">
              <Input placeholder="ex. écrasés, froid, diarrhée" {...bind('deathCause')} />
            </Field>
          </>
        )}
        <Field label="Nombre de lapereaux sevrés" hint={done && litterCount != null ? `Portée : ${litterCount}${deathCount ? ` − ${deathCount} mort(s) = ${Math.max(0, litterCount - deathCount)}` : ''}` : undefined}>
          <Input type="number" min={1} placeholder={litterCount != null ? String(Math.max(0, litterCount - deathCount)) : ''} {...bind('quantity')} />
        </Field>
        {done && (
          <>
            <Field label={AVG_LABEL} hint={weightHint('avg') ?? AVG_HINT}>
              <Input inputMode="decimal" placeholder="ex. 800" {...bind('averageWeight')} />
            </Field>
            <Field label={TOTAL_LABEL} hint={weightHint('total') ?? TOTAL_HINT}>
              <Input inputMode="decimal" {...bind('totalWeight')} />
            </Field>
            <Field
              label="Engraissement"
              hint={
                values.fatteningLotId === NEW_LOT
                  ? 'Les lapereaux sevrés iront dans un nouveau lot, visible dans Engraissement.'
                  : values.fatteningLotId
                    ? 'Les lapereaux sevrés rejoignent ce lot.'
                    : 'Les lapereaux restent sans lot.'
              }
            >
              <Select
                options={[
                  { value: NEW_LOT, label: 'Créer un nouveau lot (recommandé)' },
                  ...lots.options.map((o) => ({ ...o, label: `Ajouter au lot ${o.label}` })),
                  { value: '', label: 'Ne pas mettre en engraissement' },
                ]}
                {...bind('fatteningLotId')}
              />
            </Field>
          </>
        )}
      </FormGrid>
      <Field label="Observation">
        <Textarea {...bind('observation')} />
      </Field>
      <ErrorBox error={d.error ?? mutation.error} />
    </Modal>
  );
}
