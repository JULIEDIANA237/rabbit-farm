'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { HandCoins, Plus, Settings2, X } from 'lucide-react';

import { Badge, Button, ErrorBox, Field, FormGrid, Grid, Input, Loading, Modal, PageHeader, Stat, Table, Tabs } from '@/components/ui/kit';
import { useRabbitOptions } from '@/graphql/options';
import { toFloat, toInt } from '@/hooks/use-form';
import { formatDate, formatNumber } from '@/lib/format';

const READINESS = gql`
  query SaleReadiness {
    saleReadiness {
      criteria { minAgeDays minWeightKg }
      ready { ...Candidate }
      soon { ...Candidate }
    }
  }
  fragment Candidate on SaleCandidateModel {
    rabbitId
    code
    sex
    purpose
    ageDays
    weight
    weightSource
    weighedAt
    lotId
    lotCode
    cageCode
    manual
    reasons
  }
`;
const SET_READY = gql`
  mutation SetRabbitsReadyForSale($rabbitIds: [ID!]!, $ready: Boolean!) {
    setRabbitsReadyForSale(rabbitIds: $rabbitIds, ready: $ready)
  }
`;
const UPDATE_CRITERIA = gql`
  mutation UpdateSaleCriteria($minAgeDays: Int!, $minWeightKg: Float!) {
    updateSaleCriteria(minAgeDays: $minAgeDays, minWeightKg: $minWeightKg) { minAgeDays minWeightKg }
  }
`;

interface Candidate {
  rabbitId: string;
  code: string;
  sex: string;
  purpose: string;
  ageDays: number | null;
  weight: number | null;
  weightSource: string | null;
  weighedAt: string | null;
  lotId: string | null;
  lotCode: string | null;
  cageCode: string | null;
  manual: boolean;
  reasons: string[];
}
interface Criteria {
  minAgeDays: number;
  minWeightKg: number;
}

const refetchQueries = ['SaleReadiness'];
const SEX = { FEMALE: '♀', MALE: '♂' } as Record<string, string>;

export default function ReadyForSalePage() {
  const [tab, setTab] = useState<'ready' | 'soon'>('ready');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [picking, setPicking] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(false);
  const { data, loading, error, refetch } = useQuery<{ saleReadiness: { criteria: Criteria; ready: Candidate[]; soon: Candidate[] } }>(
    READINESS,
    { fetchPolicy: 'cache-and-network' },
  );
  const [setReady, { loading: saving }] = useMutation(SET_READY, { refetchQueries });
  const readiness = data?.saleReadiness;
  const rows = useMemo(
    () => (tab === 'ready' ? readiness?.ready : readiness?.soon)?.map((c) => ({ ...c, id: c.rabbitId })) ?? [],
    [readiness, tab],
  );
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const chosen = [...selected].filter((id) => readiness?.ready.some((r) => r.rabbitId === id));
  const allSelected = !!readiness?.ready.length && chosen.length === readiness.ready.length;

  return (
    <div>
      <PageHeader
        eyebrow="Ventes"
        title="Prêts pour la vente"
        description={
          readiness
            ? `Un lapin d’engraissement est proposé dès ${readiness.criteria.minAgeDays} jours ou ${formatNumber(readiness.criteria.minWeightKg, 2)} kg. Tu peux aussi en choisir toi-même. Les reproducteurs ne sont proposés que si tu les choisis ou les réformes.`
            : undefined
        }
        actions={
          <>
            <Button variant="secondary" onClick={() => setEditingCriteria(true)}>
              <Settings2 size={16} /> Critères
            </Button>
            <Button onClick={() => setPicking(true)}>
              <Plus size={16} /> Choisir des lapins
            </Button>
          </>
        }
      />
      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !data ? (
        <Loading />
      ) : readiness ? (
        <>
          <div className="mb-6">
            <Grid cols={3}>
              <Stat label="Prêts" value={readiness.ready.length} tone={readiness.ready.length ? 'success' : undefined} />
              <Stat label="Bientôt prêts (14 jours)" value={readiness.soon.length} tone={readiness.soon.length ? 'info' : undefined} />
              <Stat label="Choisis par toi" value={readiness.ready.filter((r) => r.manual).length} />
            </Grid>
          </div>
          <Tabs
            tabs={[
              { value: 'ready', label: `Prêts (${readiness.ready.length})` },
              { value: 'soon', label: `Bientôt (${readiness.soon.length})` },
            ]}
            value={tab}
            onChange={setTab}
          />
          {tab === 'ready' && readiness.ready.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm">
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => setSelected(allSelected ? new Set() : new Set(readiness.ready.map((r) => r.rabbitId)))}
                />
                Tout sélectionner
              </label>
              <span className="text-slate-600">{chosen.length} sélectionné(s)</span>
              {/* Navigation complète : la page Ventes lit la sélection dans l'URL au chargement. */}
              <a
                href={chosen.length ? `/sales?new=1&rabbitIds=${chosen.join(',')}` : '#'}
                aria-disabled={!chosen.length}
                className={`ml-auto inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white ${
                  chosen.length ? 'bg-emerald-600 hover:bg-emerald-700' : 'pointer-events-none bg-slate-300'
                }`}
              >
                <HandCoins size={16} /> Vendre la sélection
              </a>
            </div>
          )}
          <Table
            rows={rows}
            empty={tab === 'ready' ? 'Aucun lapin prêt pour la vente pour le moment' : 'Aucun lapin prêt dans les 14 prochains jours'}
            columns={[
              {
                header: 'Lapin',
                cell: (c) => (
                  <span className="flex items-center gap-2">
                    {tab === 'ready' && (
                      <input type="checkbox" checked={selected.has(c.rabbitId)} onChange={() => toggle(c.rabbitId)} aria-label={`Choisir ${c.code}`} />
                    )}
                    <Link href={`/rabbits/${c.rabbitId}`} className="font-semibold text-emerald-700">
                      {SEX[c.sex] ?? ''} {c.code}
                    </Link>
                    {c.manual && <Badge tone="blue">choisi</Badge>}
                  </span>
                ),
              },
              { header: 'Âge', cell: (c) => (c.ageDays != null ? `${c.ageDays} j` : '—') },
              {
                header: 'Poids',
                cell: (c) =>
                  c.weight != null ? (
                    <span>
                      {formatNumber(c.weight, 2)} kg
                      <span className="block text-xs text-slate-500">
                        {c.weightSource}
                        {c.weighedAt ? ` · ${formatDate(c.weighedAt)}` : ''}
                      </span>
                    </span>
                  ) : (
                    <Badge tone="amber">à peser</Badge>
                  ),
              },
              { header: 'Où', cell: (c) => [c.lotCode && `Lot ${c.lotCode}`, c.cageCode && `Cage ${c.cageCode}`].filter(Boolean).join(' · ') || '—' },
              { header: 'Pourquoi', cell: (c) => c.reasons.join(' · ') },
              {
                header: '',
                cell: (c) =>
                  c.manual ? (
                    <Button
                      variant="secondary"
                      className="px-3 py-1 text-xs"
                      loading={saving}
                      onClick={() => setReady({ variables: { rabbitIds: [c.rabbitId], ready: false } }).catch(() => undefined)}
                    >
                      <X size={14} /> Retirer
                    </Button>
                  ) : tab === 'soon' ? (
                    <Button
                      variant="secondary"
                      className="px-3 py-1 text-xs"
                      loading={saving}
                      onClick={() => setReady({ variables: { rabbitIds: [c.rabbitId], ready: true } }).catch(() => undefined)}
                    >
                      Prêt maintenant
                    </Button>
                  ) : null,
              },
            ]}
          />
        </>
      ) : null}

      {picking && <PickModal exclude={new Set(readiness?.ready.map((r) => r.rabbitId))} onClose={() => setPicking(false)} />}
      {editingCriteria && readiness && <CriteriaModal criteria={readiness.criteria} onClose={() => setEditingCriteria(false)} />}
    </div>
  );
}

/** Choix manuel des lapins à vendre. */
function PickModal({ exclude, onClose }: { exclude: Set<string>; onClose: () => void }) {
  const { rabbits, loading } = useRabbitOptions();
  const [search, setSearch] = useState('');
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [save, { loading: saving, error }] = useMutation(SET_READY, { refetchQueries });
  const list = rabbits.filter((r) => !exclude.has(r.id) && r.code.toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <Modal
      open
      title="Choisir des lapins à vendre"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button
            loading={saving}
            disabled={!picked.size}
            onClick={() =>
              save({ variables: { rabbitIds: [...picked], ready: true } })
                .then(onClose)
                .catch(() => undefined)
            }
          >
            Marquer {picked.size || ''} prêt(s)
          </Button>
        </>
      }
    >
      <Input placeholder="Rechercher un code…" value={search} onChange={(e) => setSearch(e.target.value)} />
      {loading ? (
        <Loading />
      ) : (
        <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200">
          {list.map((r) => (
            <li key={r.id}>
              <label className="flex items-center gap-3 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={picked.has(r.id)}
                  onChange={() =>
                    setPicked((prev) => {
                      const next = new Set(prev);
                      if (next.has(r.id)) next.delete(r.id);
                      else next.add(r.id);
                      return next;
                    })
                  }
                />
                <span className="font-medium">{SEX[r.sex] ?? ''} {r.code}</span>
                <span className="text-slate-500">
                  {r.currentCageCode ? `cage ${r.currentCageCode}` : ''}
                  {r.birthDate ? ` · né le ${formatDate(r.birthDate)}` : ''}
                </span>
              </label>
            </li>
          ))}
          {!list.length && <li className="px-3 py-4 text-center text-sm text-slate-500">Aucun lapin</li>}
        </ul>
      )}
      <ErrorBox error={error} />
    </Modal>
  );
}

function CriteriaModal({ criteria, onClose }: { criteria: Criteria; onClose: () => void }) {
  const [age, setAge] = useState(String(criteria.minAgeDays));
  const [weight, setWeight] = useState(String(criteria.minWeightKg).replace('.', ','));
  const [save, { loading, error }] = useMutation(UPDATE_CRITERIA, { refetchQueries });
  const minAgeDays = toInt(age);
  const minWeightKg = toFloat(weight);
  return (
    <Modal
      open
      title="Quand un lapin est-il prêt pour la vente ?"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button
            loading={loading}
            disabled={minAgeDays == null || minWeightKg == null}
            onClick={() =>
              save({ variables: { minAgeDays, minWeightKg } })
                .then(onClose)
                .catch(() => undefined)
            }
          >
            Enregistrer
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">
        Un lapin d’engraissement est proposé dès qu’il atteint l’un des deux, sauf si sa dernière pesée est en dessous du poids.
      </p>
      <FormGrid>
        <Field label="Âge de vente (jours)" hint="Souvent 75 à 100 jours">
          <Input inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
        </Field>
        <Field label="Poids de vente (kg)" hint="Souvent 2,3 à 3 kg">
          <Input inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </Field>
      </FormGrid>
      <ErrorBox error={error} />
    </Modal>
  );
}
