'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { CheckCircle2, Clock, Crown, Infinity as InfinityIcon, Lock } from 'lucide-react';

import { Button, Card, ErrorBox, Field, Input, Loading, PageHeader } from '@/components/ui/kit';
import { formatDate, formatMoney } from '@/lib/format';
import { PLAN_LABEL, SUBSCRIPTION_STATUS, days, useSubscription, type Plan, type SubscriptionStatus } from '@/lib/subscription';

const DECLARE_PAYMENT = gql`
  mutation DeclareSubscriptionPayment($plan: SubscriptionPlan!, $reference: String) {
    declareSubscriptionPayment(plan: $plan, reference: $reference) { id status }
  }
`;

export default function SubscriptionPage() {
  const { subscription: s, loading } = useSubscription();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Compte" title="Abonnement" description="Ton essai gratuit, ton abonnement et comment payer." />
      {!s && loading && <Loading />}
      {s && (
        <>
          <StatusCard s={s} />
          {s.status !== 'EXEMPT' && <Plans s={s} />}
        </>
      )}
    </div>
  );
}

function StatusCard({ s }: { s: SubscriptionStatus }) {
  const view = {
    TRIAL: { icon: <Clock size={22} />, cls: 'border-emerald-200 bg-emerald-50 text-emerald-900', title: `Essai gratuit : encore ${days(s.daysLeft)}`, text: `Jusqu’au ${formatDate(s.trialEndsAt)}. Ensuite, l’app passe en lecture seule sans abonnement.` },
    ACTIVE: { icon: <Crown size={22} />, cls: 'border-emerald-200 bg-emerald-50 text-emerald-900', title: 'Abonnement actif', text: `Payé jusqu’au ${formatDate(s.paidUntil)} (encore ${days(s.daysLeft)}). Tu peux le prolonger à tout moment.` },
    EXPIRED: { icon: <Lock size={22} />, cls: 'border-red-200 bg-red-50 text-red-900', title: 'Lecture seule', text: 'Ton essai est terminé : tu peux consulter tes données, mais plus en ajouter. Choisis une offre ci-dessous.' },
    EXEMPT: { icon: <InfinityIcon size={22} />, cls: 'border-violet-200 bg-violet-50 text-violet-900', title: 'Accès gratuit à vie', text: 'Cet élevage n’a rien à payer.' },
  }[s.status];
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-5 ${view.cls}`}>
      <span className="mt-0.5 shrink-0">{view.icon}</span>
      <div>
        <p className="text-lg font-semibold">{view.title}</p>
        <p className="mt-1 text-sm">{view.text}</p>
      </div>
    </div>
  );
}

function Plans({ s }: { s: SubscriptionStatus }) {
  const [plan, setPlan] = useState<Plan>('YEARLY');
  const [reference, setReference] = useState('');
  const [declare, state] = useMutation(DECLARE_PAYMENT, { refetchQueries: [{ query: SUBSCRIPTION_STATUS }] });
  const { monthlyPrice, yearlyPrice, paymentInstructions } = s.settings;
  const saved = monthlyPrice * 12 - yearlyPrice;
  const amount = plan === 'YEARLY' ? yearlyPrice : monthlyPrice;

  const offers: { plan: Plan; price: number; per: string; note?: string }[] = [
    { plan: 'MONTHLY', price: monthlyPrice, per: 'par mois' },
    { plan: 'YEARLY', price: yearlyPrice, per: 'par an', note: saved > 0 ? `Tu économises ${formatMoney(saved)}` : undefined },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Choisis ton offre">
        <div className="grid gap-3 sm:grid-cols-2">
          {offers.map((o) => (
            <button
              key={o.plan}
              type="button"
              onClick={() => setPlan(o.plan)}
              className={`rounded-2xl border-2 p-4 text-left transition ${
                plan === o.plan ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-200'
              }`}
            >
              <p className="text-sm font-medium text-slate-600">{PLAN_LABEL[o.plan]}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatMoney(o.price)}</p>
              <p className="text-sm text-slate-500">{o.per}</p>
              {o.note && <p className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">{o.note}</p>}
            </button>
          ))}
        </div>
        <ul className="mt-4 space-y-1 text-sm text-slate-600">
          {['Toutes les fonctions, sans limite de lapins', 'Toute l’équipe de l’élevage incluse', 'Tes données gardées même sans abonnement'].map((t) => (
            <li key={t} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> {t}</li>
          ))}
        </ul>
      </Card>

      <Card title="Payer" subtitle={`${PLAN_LABEL[plan]} : ${formatMoney(amount)}`}>
        {s.pendingPayment ? (
          <p className="rounded-xl bg-sky-50 p-3 text-sm text-sky-900">
            Paiement {PLAN_LABEL[s.pendingPayment.plan].toLowerCase()} de {formatMoney(s.pendingPayment.amount)} déclaré le{' '}
            {formatDate(s.pendingPayment.createdAt)}
            {s.pendingPayment.reference ? ` (réf. ${s.pendingPayment.reference})` : ''}. Il sera activé dès sa vérification.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
              {paymentInstructions || 'Les informations de paiement Mobile Money seront bientôt affichées ici.'}
            </div>
            <Field label="Référence de la transaction (facultatif)">
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Ex. : MP261122.1530.A12345" />
            </Field>
            <ErrorBox error={state.error} />
            <Button loading={state.loading} onClick={() => declare({ variables: { plan, reference: reference.trim() || null } })}>
              J’ai payé {formatMoney(amount)}
            </Button>
            <p className="text-xs text-slate-500">Ton abonnement est activé dès que le paiement est vérifié.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
