'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useApolloClient, useQuery } from '@apollo/client/react';
import { FileSpreadsheet, Printer } from 'lucide-react';

import { Button, Card, ErrorBox, Field, Grid, Input, Loading, PageHeader, Stat, Table } from '@/components/ui/kit';
import { formatMoney, formatNumber, formatPercent, fromDateInput, toDateInput } from '@/lib/format';
import { EXPENSE_CATEGORY, PAYMENT_METHOD, PURPOSE, RABBIT_STATUS, SALE_STATUS, SEX, label } from '@/lib/labels';
import { downloadExcel, excelDate, type ExcelSheet } from '@/lib/export-excel';

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

const LISTS_FOR_EXPORT = gql`
  query ExportLists {
    sales {
      id
      saleDate
      customerName
      status
      totalAmount
      paidAmount
      remainingAmount
      items { description }
    }
    expenses {
      id
      date
      category
      description
      supplier
      paymentMethod
      amount
    }
  }
`;

interface ExportLists {
  sales: Array<{ id: string; saleDate: string; customerName: string | null; status: string; totalAmount: number; paidAmount: number; remainingAmount: number; items: Array<{ description: string }> }>;
  expenses: Array<{ id: string; date: string; category: string; description: string | null; supplier: string | null; paymentMethod: string | null; amount: number }>;
}

const pct = (value?: number | null) => (value == null ? null : Math.round(value * 10) / 10);

function buildSheets(s: Stats, lists: ExportLists, from: string, to: string): ExcelSheet[] {
  const inPeriod = (date: string) => date.slice(0, 10) >= from && date.slice(0, 10) <= to;
  const t = s.technical;
  const f = s.finance;
  const breeders = (rows: Breeder[]) => [
    ['Reproducteur', 'Portées', 'Nés vivants', 'Taille moyenne', 'Sevrés', 'Survie (%)'],
    ...rows.map((b) => [b.rabbitCode, b.litters, b.bornAlive, pct(b.averageLitterSize), b.weaned, pct(b.survivalRate)]),
  ];
  return [
    {
      name: 'Synthèse',
      widths: [38, 18],
      rows: [
        ['Indicateur', 'Valeur'],
        ['Période', `${from} au ${to}`],
        ['Saillies', t.breedings],
        ['Fertilité (%)', pct(t.fertilityRate)],
        ['Mises bas', t.births],
        ['Nés vivants', t.liveBorn],
        ['Mort-nés', t.stillBorn],
        ['Taille moyenne de portée', pct(t.averageLitterSize)],
        ['Mortinatalité (%)', pct(t.stillBirthRate)],
        ['Morts avant sevrage', t.preWeaningDeaths],
        ['Mortalité avant sevrage (%)', pct(t.preWeaningMortalityRate)],
        ['Sevrés', t.weaned],
        ['Taux de sevrage (%)', pct(t.weaningRate)],
        ['Morts en engraissement', t.fatteningDeaths],
        ['Chiffre d’affaires (FCFA)', f.revenue],
        ['Encaissé (FCFA)', f.collected],
        ['Reste à encaisser (FCFA)', f.outstanding],
        ['Dépenses (FCFA)', f.expenses],
        ['Marge (FCFA)', f.margin],
        ['Lapins vendus', f.rabbitsSold],
        ['Kg vendus', f.kgSold],
        ['Coût de revient estimé (FCFA/kg)', f.estimatedCostPerKg ?? null],
        ['Lapins actifs', s.population.active],
      ],
    },
    { name: 'Mensuel', rows: [['Mois', 'Ventes (FCFA)', 'Dépenses (FCFA)', 'Marge (FCFA)'], ...f.monthly.map((m) => [m.month, m.revenue, m.expenses, m.margin])] },
    { name: 'Dépenses par catégorie', widths: [26, 18], rows: [['Catégorie', 'Montant (FCFA)'], ...f.expensesByCategory.map((c) => [label(EXPENSE_CATEGORY, c.label), c.value])] },
    {
      name: 'Ventes',
      widths: [12, 26, 40, 16, 16, 16, 20],
      rows: [
        ['Date', 'Client', 'Articles', 'Total', 'Payé', 'Reste', 'Statut'],
        ...lists.sales
          .filter((sale) => inPeriod(sale.saleDate))
          .map((sale) => [excelDate(sale.saleDate), sale.customerName ?? 'Client de passage', sale.items.map((i) => i.description).join(', '), sale.totalAmount, sale.paidAmount, sale.remainingAmount, label(SALE_STATUS, sale.status)]),
      ],
    },
    {
      name: 'Dépenses',
      widths: [12, 18, 34, 24, 16, 16],
      rows: [
        ['Date', 'Catégorie', 'Description', 'Fournisseur', 'Paiement', 'Montant'],
        ...lists.expenses
          .filter((expense) => inPeriod(expense.date))
          .map((expense) => [excelDate(expense.date), label(EXPENSE_CATEGORY, expense.category), expense.description ?? '', expense.supplier ?? '', expense.paymentMethod ? label(PAYMENT_METHOD, expense.paymentMethod) : '', expense.amount]),
      ],
    },
    { name: 'Meilleures mères', rows: breeders(s.genetic.bestMothers) },
    { name: 'Meilleurs pères', rows: breeders(s.genetic.bestFathers) },
    { name: 'Causes de mortalité', widths: [30, 12], rows: [['Cause', 'Morts'], ...t.deathsByCause.map((c) => [c.label, c.value])] },
  ];
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
  const client = useApolloClient();
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  async function exportExcel() {
    if (!s) return;
    setExporting(true);
    setExportError(null);
    try {
      const { data: lists } = await client.query<ExportLists>({ query: LISTS_FOR_EXPORT, fetchPolicy: 'network-only' });
      if (!lists) throw new Error('Données indisponibles.');
      await downloadExcel(`rabbitfarm-statistiques-${from}-au-${to}.xlsx`, buildSheets(s, lists, from, to));
    } catch (caught) {
      setExportError(caught instanceof Error ? caught.message : 'Export impossible.');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Statistiques"
        title="Performances de l'élevage"
        description="Indicateurs techniques, génétiques et financiers sur la période choisie."
        actions={
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex gap-2 print:hidden">
              <Button variant="secondary" loading={exporting} disabled={!s} onClick={() => void exportExcel()}>
                <FileSpreadsheet size={16} /> Excel
              </Button>
              <Button variant="secondary" disabled={!s} onClick={() => window.print()}>
                <Printer size={16} /> PDF
              </Button>
            </div>
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
      <ErrorBox error={exportError} />
      {loading && !s && <Loading />}
      {s && (
        <>
          <h2 className="text-lg font-semibold text-slate-900">Reproduction et naissances</h2>
          <Grid>
            <Stat label="Fertilité (palpations +)" value={formatPercent(s.technical.fertilityRate)} hint={`${s.technical.positivePalpations}/${s.technical.palpations} palpations · ${s.technical.breedings} saillies`} tone="success" />
            <Stat label="Taille moyenne de portée" value={formatNumber(s.technical.averageLitterSize)} hint={`${s.technical.births} mises bas · ${s.technical.liveBorn} nés vivants`} />
            <Stat label="Mortinatalité" value={formatPercent(s.technical.stillBirthRate)} hint={`${s.technical.stillBorn} mort-né${s.technical.stillBorn > 1 ? 's' : ''} sur ${s.technical.liveBorn + s.technical.stillBorn} naissances`} />
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
