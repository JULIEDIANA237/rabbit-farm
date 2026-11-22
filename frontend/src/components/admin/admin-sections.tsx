'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Home, Rabbit, Star, Users } from 'lucide-react';

import { Button, Card, ErrorBox, Field, FormGrid, Input, Loading, Textarea } from '@/components/ui/kit';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { formatDate, formatMoney } from '@/lib/format';
import { PLAN_LABEL, days, type AccessStatus } from '@/lib/subscription';

import { useAdminActions, usePlatformStats, useSubscriptionAdmin, type Settings } from './admin-data';

const STATUS: Record<AccessStatus, { label: string; cls: string }> = {
  TRIAL: { label: 'Essai', cls: 'bg-sky-100 text-sky-800' },
  ACTIVE: { label: 'Abonné', cls: 'bg-emerald-100 text-emerald-800' },
  EXPIRED: { label: 'Lecture seule', cls: 'bg-red-100 text-red-800' },
  EXEMPT: { label: 'Gratuit à vie', cls: 'bg-violet-100 text-violet-800' },
};

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

/** Utilisateurs, élevages et activité. */
export function PlatformKpis() {
  const { stats: s, error, loading } = usePlatformStats();
  if (error) return <ErrorBox error={error} />;
  if (!s) return loading ? <Loading /> : null;
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiCard title="Utilisateurs" icon={<Users size={20} />} variant="success" value={s.users} description={`+${s.newUsers30d} en 30 jours`} />
      <KpiCard title="Actifs 7 jours" icon={<Activity size={20} />} value={s.activeUsers7d} description={`${s.activeUsers30d} sur 30 jours`} />
      <KpiCard title="Élevages" icon={<Home size={20} />} value={s.farms} />
      <KpiCard title="Lapins suivis" icon={<Rabbit size={20} />} value={s.rabbits} />
    </section>
  );
}

/** Argent encaissé et répartition des élevages. */
export function RevenueStats() {
  const { admin: a, error } = useSubscriptionAdmin();
  if (error) return <ErrorBox error={error} />;
  if (!a) return null;
  return (
    <section className="space-y-3">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Encaissé sur 30 jours" value={formatMoney(a.revenue30d)} />
        <Stat label="Encaissé au total" value={formatMoney(a.revenueTotal)} />
        <Stat label="Élevages abonnés" value={a.payingFarms} />
        <Stat label="En essai" value={a.trialFarms} />
        <Stat label="En lecture seule" value={a.expiredFarms} />
      </section>
      {a.pendingPayments.length > 0 && (
        <Link href="/admin/payments" className="block rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
          {a.pendingPayments.length} paiement{a.pendingPayments.length > 1 ? 's' : ''} à vérifier →
        </Link>
      )}
    </section>
  );
}

/** Paiements Mobile Money déclarés par les éleveurs. */
export function PendingPayments() {
  const { admin: a, error, loading } = useSubscriptionAdmin();
  const { confirm, reject } = useAdminActions();
  if (error) return <ErrorBox error={error} />;
  if (!a) return loading ? <Loading /> : null;
  return (
    <Card title={`Paiements à vérifier (${a.pendingPayments.length})`} subtitle="Vérifie la réception sur ton compte Mobile Money avant de confirmer.">
      {a.pendingPayments.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun paiement en attente.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {a.pendingPayments.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{p.farmName} · {PLAN_LABEL[p.plan]} · {formatMoney(p.amount)}</p>
                <p className="text-slate-500">Déclaré le {formatDate(p.createdAt)}{p.reference ? ` · réf. ${p.reference}` : ' · sans référence'}</p>
              </div>
              <Button onClick={() => confirm({ variables: { id: p.id } })}>Confirmer</Button>
              <Button variant="secondary" onClick={() => reject({ variables: { id: p.id } })}>Refuser</Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** Tous les élevages : accès gratuit, jours offerts, paiement reçu. */
export function FarmsList() {
  const { admin: a, error, loading } = useSubscriptionAdmin();
  const { activate, extend, setFree } = useAdminActions();
  const [search, setSearch] = useState('');
  if (error) return <ErrorBox error={error} />;
  if (!a) return loading ? <Loading /> : null;
  const q = search.trim().toLowerCase();
  const farms = q
    ? a.farms.filter((f) => f.farmName.toLowerCase().includes(q) || f.memberEmails.some((e) => e.toLowerCase().includes(q)))
    : a.farms;

  return (
    <Card title={`Élevages (${a.farms.length})`} subtitle="Accorde un accès gratuit à vie, offre des jours ou enregistre un paiement reçu.">
      <Input className="mb-3" placeholder="Chercher un élevage ou un e-mail…" value={search} onChange={(e) => setSearch(e.target.value)} />
      <ul className="divide-y divide-slate-100">
        {farms.map((f) => (
          <li key={f.farmId} className="space-y-2 py-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-slate-900">{f.farmName}</p>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS[f.status].cls}`}>{STATUS[f.status].label}</span>
              <span className="text-slate-500">
                {f.status === 'TRIAL' && `encore ${days(f.daysLeft)}`}
                {f.status === 'ACTIVE' && `jusqu’au ${formatDate(f.paidUntil)}`}
                {f.status === 'EXPIRED' && `essai fini le ${formatDate(f.trialEndsAt)}`}
              </span>
            </div>
            <p className="break-all text-slate-500">{f.memberEmails.join(', ') || 'Aucun membre'} · inscrit le {formatDate(f.createdAt)}</p>
            {f.status === 'EXEMPT' && !f.freeAccess ? (
              <p className="text-xs text-violet-700">Élevage dont tu es membre : toujours gratuit.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => setFree({ variables: { farmId: f.farmId, free: !f.freeAccess } })}>
                  {f.freeAccess ? 'Retirer l’accès gratuit' : 'Accès gratuit à vie'}
                </Button>
                {!f.freeAccess && (
                  <>
                    <Button variant="secondary" onClick={() => extend({ variables: { farmId: f.farmId, days: 7 } })}>+7 jours d’essai</Button>
                    <Button variant="secondary" onClick={() => activate({ variables: { farmId: f.farmId, plan: 'MONTHLY' } })}>Payé : 1 mois</Button>
                    <Button variant="secondary" onClick={() => activate({ variables: { farmId: f.farmId, plan: 'YEARLY' } })}>Payé : 1 an</Button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Notes et avis laissés par les utilisateurs. */
export function Reviews() {
  const { stats: s, error, loading } = usePlatformStats();
  if (error) return <ErrorBox error={error} />;
  if (!s) return loading ? <Loading /> : null;
  const max = Math.max(1, ...s.ratingDistribution);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Notes" subtitle={`${s.ratingsCount} note(s)${s.averageRating != null ? ` · moyenne ${s.averageRating.toFixed(1)} / 5` : ''}`}>
        <ul className="space-y-2">
          {[5, 4, 3, 2, 1].map((n) => (
            <li key={n} className="flex items-center gap-2 text-sm">
              <span className="flex w-10 items-center gap-0.5 text-slate-600">{n} <Star size={14} className="fill-amber-400 text-amber-400" /></span>
              <div className="h-2.5 flex-1 rounded-full bg-slate-100">
                <div className="h-2.5 rounded-full bg-amber-400" style={{ width: `${(s.ratingDistribution[n - 1] / max) * 100}%` }} />
              </div>
              <span className="w-8 text-right text-slate-700">{s.ratingDistribution[n - 1]}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Derniers avis">
        {s.latestRatings.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun avis pour l’instant.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {s.latestRatings.map((r) => (
              <li key={r.id} className="py-2 text-sm">
                <span className="text-amber-500">{'★'.repeat(r.stars)}<span className="text-slate-300">{'★'.repeat(5 - r.stars)}</span></span>
                <span className="ml-2 text-xs text-slate-500">{r.farmName ? `${r.farmName} · ` : ''}{formatDate(r.updatedAt)}</span>
                {r.comment && <p className="mt-0.5 text-slate-700">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

/** Prix, durée d'essai et consignes de paiement. */
export function PriceSettings() {
  const { admin: a, error, loading } = useSubscriptionAdmin();
  if (error) return <ErrorBox error={error} />;
  if (!a) return loading ? <Loading /> : null;
  return <SettingsForm key={JSON.stringify(a.settings)} settings={a.settings} />;
}

function SettingsForm({ settings }: { settings: Settings }) {
  const { saveSettings, saveState } = useAdminActions();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    trialDays: String(settings.trialDays),
    monthlyPrice: String(settings.monthlyPrice),
    yearlyPrice: String(settings.yearlyPrice),
    paymentInstructions: settings.paymentInstructions ?? '',
  });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setSaved(false);
    setForm({ ...form, [k]: e.target.value });
  };
  const save = async () => {
    await saveSettings({
      variables: {
        input: {
          trialDays: Number(form.trialDays),
          monthlyPrice: Number(form.monthlyPrice),
          yearlyPrice: Number(form.yearlyPrice),
          paymentInstructions: form.paymentInstructions,
        },
      },
    });
    setSaved(true);
  };

  return (
    <Card title="Prix et essai" subtitle="Les nouveaux prix s’appliquent aux prochains paiements ; la durée d’essai aux nouveaux élevages.">
      <FormGrid>
        <Field label="Essai gratuit (jours)"><Input type="number" min={0} value={form.trialDays} onChange={set('trialDays')} /></Field>
        <Field label="Prix mensuel (FCFA)"><Input type="number" min={0} value={form.monthlyPrice} onChange={set('monthlyPrice')} /></Field>
        <Field label="Prix annuel (FCFA)"><Input type="number" min={0} value={form.yearlyPrice} onChange={set('yearlyPrice')} /></Field>
      </FormGrid>
      <Field label="Comment payer (affiché aux éleveurs)" className="mt-3">
        <Textarea
          rows={3}
          value={form.paymentInstructions}
          onChange={set('paymentInstructions')}
          placeholder="Ex. : Envoie le montant par Orange Money ou MTN MoMo au numéro …, au nom de …"
        />
      </Field>
      <ErrorBox error={saveState.error} />
      <div className="mt-3 flex items-center gap-3">
        <Button loading={saveState.loading} onClick={() => save().catch(() => undefined)}>Enregistrer</Button>
        {saved && <span className="text-sm text-emerald-700">Enregistré.</span>}
      </div>
    </Card>
  );
}
