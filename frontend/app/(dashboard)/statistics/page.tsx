'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { Card, ErrorBox, Field, Grid, Input, Loading, PageHeader, Stat, Table } from '@/components/ui/kit';
import { formatMoney, formatNumber, formatPercent, fromDateInput, toDateInput } from '@/lib/format';
import { EXPENSE_CATEGORY, PURPOSE, RABBIT_STATUS, SEX, label } from '@/lib/labels';

const STATS = gql`
  query FarmStatistics($from: DateTime, $to: DateTime) {
    farmStatistics(from: $from, to: $to) {
      from
      to
      technical {
        breedings
        palpations
        positivePalpations
        fertilityRate
        births
        liveBorn
        stillBorn
        averageLitterSize
        stillBirthRate
        preWeaningDeaths
        preWeaningMortalityRate
        weaned
        weaningRate
        averageWeaningWeight
        fatteningDeaths
        totalDeaths
        deathsByCause { label value }
        weightByAge { label sampleCount averageWeight }
      }
      genetic {
        bestMothers { rabbitId rabbitCode litters bornAlive weaned averageLitterSize survivalRate weaningRate }
        bestFathers { rabbitId rabbitCode litters bornAlive weaned averageLitterSize survivalRate weaningRate }
        blockedPairs
        riskyPairs
        breedDistribution { label value }
      }
      finance {
        revenue
        collected
        outstanding
        expenses
        margin
        rabbitsSold
        kgSold
        estimatedCostPerKg
        expensesByCategory { label value }
        monthly { month revenue expenses margin }
      }
      population {
        active
        bySex { label value }
        byPurpose { label value }
        exits { label value }
      }
    }
  }
`;

type LV = { label: string; value: number };
interface Breeder {
  rabbitId: string;
  rabbitCode: string;
  litters: number;
  bornAlive: number;
  weaned: number;
  averageLitterSize?: number | null;
  survivalRate?: number | null;
  weaningRate?: number | null;
}
interface Stats {
  technical: {
    breedings: number;
    palpations: number;
    positivePalpations: number;
    fertilityRate?: number | null;
    births: number;
    liveBorn: number;
    stillBorn: number;
    averageLitterSize?: number | null;
    stillBirthRate?: number | null;
    preWeaningDeaths: number;
    preWeaningMortalityRate?: number | null;
    weaned: number;
    weaningRate?: number | null;
    averageWeaningWeight?: number | null;
    fatteningDeaths: number;
    totalDeaths: number;
    deathsByCause: LV[];
    weightByAge: Array<{ label: string; sampleCount: number; averageWeight?: number | null }>;
  };
  genetic: { bestMothers: Breeder[]; bestFathers: Breeder[]; blockedPairs: number; riskyPairs: number; breedDistribution: LV[] };
  finance: {
    revenue: number;
    collected: number;
    outstanding: number;
    expenses: number;
    margin: number;
    rabbitsSold: number;
    kgSold: number;
    estimatedCostPerKg?: number | null;
    expensesByCategory: LV[];
    monthly: Array<{ month: string; revenue: number; expenses: number; margin: number }>;
  };
  population: { active: number; bySex: LV[]; byPurpose: LV[]; exits: LV[] };
}

function Bars({ items, format = (v: number) => formatNumber(v), labels }: { items: LV[]; format?: (v: number) => string; labels?: Record<string, string> }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (!items.length) return <p className="text-sm text-slate-500">Aucune donnée sur la période.</p>;
  return (
    <div className="space-y-2">
      {items.map((i) => (
        <div key={i.label}>
          <div className="flex justify-between text-sm">
            <span>{labels ? label(labels, i.label) : i.label}</span>
            <span className="font-medium">{format(i.value)}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthlyChart({ months }: { months: Stats['finance']['monthly'] }) {
  const max = Math.max(1, ...months.flatMap((m) => [m.revenue, m.expenses]));
  return (
    <div>
      <div className="flex h-48 items-end gap-1">
        {months.map((m) => (
          <div key={m.month} className="flex flex-1 flex-col items-center gap-1" title={`${m.month} · ventes ${formatMoney(m.revenue)} · dépenses ${formatMoney(m.expenses)}`}>
            <div className="flex h-40 w-full items-end justify-center gap-0.5">
              <div className="w-1/2 rounded-t bg-emerald-500" style={{ height: `${(m.revenue / max) * 100}%` }} />
              <div className="w-1/2 rounded-t bg-amber-400" style={{ height: `${(m.expenses / max) * 100}%` }} />
            </div>
            <span className="text-[10px] text-slate-500">{m.month.slice(5)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500" /> Ventes</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-400" /> Dépenses</span>
      </div>
    </div>
  );
}

const breederColumns = [
  { header: 'Reproducteur', cell: (b: Breeder & { id: string }) => <strong>{b.rabbitCode}</strong> },
  { header: 'Portées', cell: (b: Breeder) => b.litters },
  { header: 'Nés vivants', cell: (b: Breeder) => b.bornAlive },
  { header: 'Taille moy.', cell: (b: Breeder) => formatNumber(b.averageLitterSize) },
  { header: 'Sevrés', cell: (b: Breeder) => b.weaned },
  { header: 'Survie', cell: (b: Breeder) => formatPercent(b.survivalRate) },
];

export default function StatisticsPage() {
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  const [from, setFrom] = useState(toDateInput(yearAgo));
  const [to, setTo] = useState(toDateInput());

  const { data, loading, error, refetch } = useQuery<{ farmStatistics: Stats }>(STATS, {
    variables: { from: fromDateInput(from), to: new Date(`${to}T23:59:59.999Z`).toISOString() },
  });
  const s = data?.farmStatistics;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Statistiques"
        title="Performances de l'élevage"
        description="Indicateurs techniques, génétiques et financiers sur la période choisie."
        actions={
          <div className="flex gap-2">
            <Field label="Du">
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </Field>
            <Field label="Au">
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </Field>
          </div>
        }
      />
      <ErrorBox error={error} onRetry={() => refetch()} />
      {loading && !s && <Loading />}
      {s && (
        <>
          <h2 className="text-lg font-semibold text-slate-900">Reproduction et naissances</h2>
          <Grid>
            <Stat label="Fertilité (palpations +)" value={formatPercent(s.technical.fertilityRate)} hint={`${s.technical.positivePalpations}/${s.technical.palpations} palpations · ${s.technical.breedings} saillies`} tone="success" />
            <Stat label="Taille moyenne de portée" value={formatNumber(s.technical.averageLitterSize)} hint={`${s.technical.births} mises bas · ${s.technical.liveBorn} nés vivants`} />
            <Stat label="Mortinatalité" value={formatPercent(s.technical.stillBirthRate)} hint={`${s.technical.stillBorn} mort-nés`} />
            <Stat label="Mortalité avant sevrage" value={formatPercent(s.technical.preWeaningMortalityRate)} hint={`${s.technical.preWeaningDeaths} morts`} tone={s.technical.preWeaningDeaths ? 'warning' : 'default'} />
            <Stat label="Taux de sevrage" value={formatPercent(s.technical.weaningRate)} hint={`${s.technical.weaned} sevrés`} tone="info" />
            <Stat label="Poids moyen au sevrage" value={s.technical.averageWeaningWeight != null ? `${formatNumber(s.technical.averageWeaningWeight, 3)} kg` : '—'} />
            <Stat label="Morts en engraissement" value={s.technical.fatteningDeaths} />
            <Stat label="Mortalité totale" value={s.technical.totalDeaths} tone={s.technical.totalDeaths ? 'danger' : 'default'} />
          </Grid>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Poids moyen par âge">
              <Table
                rows={s.technical.weightByAge.map((w) => ({ ...w, id: w.label }))}
                columns={[
                  { header: 'Âge', cell: (w) => w.label },
                  { header: 'Animaux pesés', cell: (w) => w.sampleCount },
                  { header: 'Poids moyen', cell: (w) => (w.averageWeight != null ? `${formatNumber(w.averageWeight, 3)} kg` : '—') },
                ]}
              />
            </Card>
            <Card title="Causes de mortalité">
              <Bars items={s.technical.deathsByCause} format={(v) => String(v)} />
            </Card>
          </div>

          <h2 className="text-lg font-semibold text-slate-900">Génétique</h2>
          <Grid cols={2}>
            <Stat label="Couples interdits (reproducteurs actifs)" value={s.genetic.blockedPairs} tone={s.genetic.blockedPairs ? 'danger' : 'default'} />
            <Stat label="Couples à risque" value={s.genetic.riskyPairs} tone={s.genetic.riskyPairs ? 'warning' : 'default'} />
          </Grid>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Meilleures mères">
              <Table rows={s.genetic.bestMothers.map((b) => ({ ...b, id: b.rabbitId }))} columns={breederColumns} empty="Aucune portée sur la période" />
            </Card>
            <Card title="Meilleurs pères">
              <Table rows={s.genetic.bestFathers.map((b) => ({ ...b, id: b.rabbitId }))} columns={breederColumns} empty="Aucune portée sur la période" />
            </Card>
          </div>

          <h2 className="text-lg font-semibold text-slate-900">Finances</h2>
          <Grid>
            <Stat label="Chiffre d'affaires" value={formatMoney(s.finance.revenue)} tone="success" hint={`${s.finance.rabbitsSold} lapins · ${formatNumber(s.finance.kgSold)} kg`} />
            <Stat label="Dépenses" value={formatMoney(s.finance.expenses)} tone="warning" />
            <Stat label="Marge" value={formatMoney(s.finance.margin)} tone={s.finance.margin >= 0 ? 'success' : 'danger'} />
            <Stat label="Coût de revient estimé" value={s.finance.estimatedCostPerKg != null ? `${formatMoney(s.finance.estimatedCostPerKg)}/kg` : '—'} hint={`Encaissé ${formatMoney(s.finance.collected)} · reste ${formatMoney(s.finance.outstanding)}`} />
          </Grid>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Ventes et dépenses (12 mois)">
              <MonthlyChart months={s.finance.monthly} />
            </Card>
            <Card title="Dépenses par catégorie">
              <Bars items={s.finance.expensesByCategory} format={formatMoney} labels={EXPENSE_CATEGORY} />
            </Card>
          </div>

          <h2 className="text-lg font-semibold text-slate-900">Population ({s.population.active} lapins actifs)</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card title="Par sexe"><Bars items={s.population.bySex} format={(v) => String(v)} labels={SEX} /></Card>
            <Card title="Par destination"><Bars items={s.population.byPurpose} format={(v) => String(v)} labels={PURPOSE} /></Card>
            <Card title="Par race"><Bars items={s.genetic.breedDistribution} format={(v) => String(v)} /></Card>
          </div>
          <Card title="Sorties sur la période">
            <Bars items={s.population.exits} format={(v) => String(v)} labels={RABBIT_STATUS} />
          </Card>
        </>
      )}
    </div>
  );
}
