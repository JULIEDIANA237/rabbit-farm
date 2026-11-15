'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Wheat } from 'lucide-react';

import { TOOL_LINKS } from '@/components/layout/tool-links';

import { Card, Field, FormGrid, Input, PageHeader } from '@/components/ui/kit';
import { toFloat, toInt } from '@/hooks/use-form';
import { CURRENCY, formatMoney, formatNumber, toDateInput } from '@/lib/format';

/** Repères du calendrier de reproduction (mêmes valeurs que le serveur). */
const CALENDAR = { palpationStart: 10, palpationEnd: 14, nest: 28, birthStart: 30, birthEnd: 32, weaning: 35 };

const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d;
};
const day = (d: Date) => d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });


export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Outils" title="Boîte à outils" description="Calculs rapides et raccourcis utiles au quotidien." />
      <div className="grid gap-6 lg:grid-cols-2">
        <DatesCalculator />
        <FeedCalculator />
      </div>
      <Card title="Raccourcis">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TOOL_LINKS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 hover:border-emerald-200 hover:bg-emerald-50"
            >
              <t.icon size={18} className="text-emerald-700" /> {t.label}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DatesCalculator() {
  const [date, setDate] = useState(toDateInput());
  const [saleAge, setSaleAge] = useState('90');
  const birth = date ? addDays(date, CALENDAR.birthStart) : null;
  const rows = date
    ? [
        ['Palpation', `${day(addDays(date, CALENDAR.palpationStart))} au ${day(addDays(date, CALENDAR.palpationEnd))}`],
        ['Poser la boîte à nid', day(addDays(date, CALENDAR.nest))],
        ['Mise bas attendue', `${day(addDays(date, CALENDAR.birthStart))} au ${day(addDays(date, CALENDAR.birthEnd))}`],
        ['Sevrage', day(addDays(date, CALENDAR.birthStart + CALENDAR.weaning))],
        ['Lapereaux prêts pour la vente', birth ? day(addDays(date, CALENDAR.birthStart + (toInt(saleAge) ?? 90))) : '—'],
      ]
    : [];
  return (
    <Card title={<span className="flex items-center gap-2"><CalendarDays size={18} /> Dates d’une saillie</span>} subtitle="Entre la date de saillie : je calcule la suite.">
      <FormGrid>
        <Field label="Date de saillie">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Âge de vente (jours)">
          <Input inputMode="numeric" value={saleAge} onChange={(e) => setSaleAge(e.target.value)} />
        </Field>
      </FormGrid>
      <dl className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-wrap justify-between gap-2 px-3 py-2 text-sm">
            <dt className="text-slate-600">{label}</dt>
            <dd className="font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

const CATEGORIES = [
  { key: 'pregnant', label: 'Femelles gestantes', grams: '150' },
  { key: 'nursing', label: 'Femelles qui allaitent', grams: '250' },
  { key: 'fattening', label: 'Lapins à l’engraissement', grams: '100' },
  { key: 'other', label: 'Mâles et femelles au repos', grams: '120' },
] as const;

function FeedCalculator() {
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [grams, setGrams] = useState<Record<string, string>>(Object.fromEntries(CATEGORIES.map((c) => [c.key, c.grams])));
  const [bagKg, setBagKg] = useState('50');
  const [bagPrice, setBagPrice] = useState('');
  const dailyKg = CATEGORIES.reduce((sum, c) => sum + ((toInt(counts[c.key] ?? '') ?? 0) * (toFloat(grams[c.key] ?? '') ?? 0)) / 1000, 0);
  const monthKg = dailyKg * 30;
  const bag = toFloat(bagKg);
  const bags = bag ? monthKg / bag : null;
  const price = toFloat(bagPrice);
  const daysPerBag = bag && dailyKg ? bag / dailyKg : null;
  return (
    <Card title={<span className="flex items-center gap-2"><Wheat size={18} /> Combien de provende ?</span>} subtitle="Nombre de lapins × ration par jour, en grammes.">
      <div className="space-y-2">
        {CATEGORIES.map((c) => (
          <div key={c.key} className="grid grid-cols-[1fr_5rem_5rem] items-center gap-2 text-sm">
            <span className="text-slate-700">{c.label}</span>
            <Input
              inputMode="numeric"
              aria-label={`Nombre : ${c.label}`}
              placeholder="nb"
              value={counts[c.key] ?? ''}
              onChange={(e) => setCounts({ ...counts, [c.key]: e.target.value })}
            />
            <Input
              inputMode="decimal"
              aria-label={`Grammes par jour : ${c.label}`}
              value={grams[c.key]}
              onChange={(e) => setGrams({ ...grams, [c.key]: e.target.value })}
            />
          </div>
        ))}
        <p className="text-right text-xs text-slate-500">nombre · g par jour</p>
      </div>
      <FormGrid>
        <Field label="Poids d’un sac (kg)">
          <Input inputMode="decimal" value={bagKg} onChange={(e) => setBagKg(e.target.value)} />
        </Field>
        <Field label={`Prix d’un sac (${CURRENCY})`}>
          <Input inputMode="decimal" placeholder="ex. 50000" value={bagPrice} onChange={(e) => setBagPrice(e.target.value)} />
        </Field>
      </FormGrid>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Result label="Par jour" value={`${formatNumber(dailyKg, 2)} kg`} />
        <Result label="Par mois (30 j)" value={`${formatNumber(monthKg, 1)} kg`} />
        <Result label="Sacs par mois" value={bags != null ? formatNumber(bags, 1) : '—'} />
        <Result label="Un sac dure" value={daysPerBag != null ? `${formatNumber(daysPerBag, 0)} jours` : '—'} />
        {price != null && bags != null && <Result label="Coût par mois" value={formatMoney(bags * price)} />}
        {price != null && bag ? <Result label="Prix du kg" value={formatMoney(price / bag)} /> : null}
      </div>
    </Card>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-emerald-50 px-3 py-2">
      <p className="text-xs text-slate-600">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}
