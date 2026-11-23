'use client';

import { useEffect, useRef, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { CheckCircle2, Clock, Crown, Infinity as InfinityIcon, Loader2, Lock, Smartphone } from 'lucide-react';

import { Button, Card, ErrorBox, Field, Input, Loading, PageHeader } from '@/components/ui/kit';
import { formatDate, formatMoney } from '@/lib/format';
import { PLAN_LABEL, SUBSCRIPTION_STATUS, days, useSubscription, type Plan, type SubscriptionStatus } from '@/lib/subscription';

const DECLARE_PAYMENT = gql`
  mutation DeclareSubscriptionPayment($plan: SubscriptionPlan!, $reference: String) {
    declareSubscriptionPayment(plan: $plan, reference: $reference) { id status }
  }
`;

const START_CHECKOUT = gql`
  mutation StartSubscriptionCheckout($plan: SubscriptionPlan!, $operator: MobileOperator, $phone: String) {
    startSubscriptionCheckout(plan: $plan, operator: $operator, phone: $phone) { paymentId url direct error }
  }
`;

const CHECK_PAYMENT = gql`
  mutation CheckSubscriptionPayment($reference: String!) {
    checkSubscriptionPayment(reference: $reference) { id status periodEnd }
  }
`;

/** Paiement en cours gardé avant d'aller sur NotchPay, au cas où la référence ne revient pas dans l'adresse. */
const LAST_PAYMENT_KEY = 'rabbitfarm:paiement-en-ligne';

function rememberPayment(id: string) {
  try { localStorage.setItem(LAST_PAYMENT_KEY, id); } catch { /* navigation privée */ }
}

function takeReturnReference() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('reference') || params.get('trxref') || params.get('notchpay_trxref');
  let stored: string | null = null;
  try { stored = localStorage.getItem(LAST_PAYMENT_KEY); } catch { /* ignoré */ }
  if (!fromUrl && !stored) return null;
  try { localStorage.removeItem(LAST_PAYMENT_KEY); } catch { /* ignoré */ }
  if (fromUrl) window.history.replaceState(null, '', window.location.pathname);
  return fromUrl || stored;
}

type CheckResult = 'checking' | 'CONFIRMED' | 'PENDING' | 'REJECTED' | 'error';

function PaymentReturn() {
  const [result, setResult] = useState<CheckResult | null>(null);
  const [check] = useMutation<{ checkSubscriptionPayment: { status: 'CONFIRMED' | 'PENDING' | 'REJECTED' } }>(CHECK_PAYMENT, {
    refetchQueries: [{ query: SUBSCRIPTION_STATUS }],
  });
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const reference = takeReturnReference();
    if (!reference) return;
    queueMicrotask(() => setResult('checking'));
    check({ variables: { reference } })
      .then(({ data }) => setResult(data?.checkSubscriptionPayment.status ?? 'error'))
      .catch(() => setResult('error'));
  }, [check]);

  if (!result) return null;
  const view = {
    checking: { cls: 'bg-slate-50 text-slate-700', text: 'Vérification de ton paiement…' },
    CONFIRMED: { cls: 'bg-emerald-50 text-emerald-900', text: 'Paiement reçu, merci ! Ton abonnement est activé.' },
    PENDING: { cls: 'bg-sky-50 text-sky-900', text: 'Ton paiement est en cours de validation. Ton abonnement s’activera tout seul dès qu’il sera confirmé, tu peux fermer cette page.' },
    REJECTED: { cls: 'bg-amber-50 text-amber-900', text: 'Le paiement n’a pas abouti (annulé ou refusé). Aucun montant n’a été validé : tu peux réessayer.' },
    error: { cls: 'bg-amber-50 text-amber-900', text: 'Impossible de vérifier le paiement pour le moment. S’il a réussi, ton abonnement s’activera tout seul dans quelques minutes.' },
  }[result];
  return <p role="status" className={`rounded-2xl p-4 text-sm font-medium ${view.cls}`}>{view.text}</p>;
}

type Operator = 'MTN' | 'ORANGE';
const PHONE_KEY = 'rabbitfarm:numero-mobile-money';
const POLL_MS = 4000;
const WAIT_MS = 3 * 60_000;

const OPERATORS: { value: Operator; label: string; cls: string }[] = [
  { value: 'MTN', label: 'MTN MoMo', cls: 'border-yellow-400 bg-yellow-50 text-yellow-900' },
  { value: 'ORANGE', label: 'Orange Money', cls: 'border-orange-400 bg-orange-50 text-orange-900' },
];

/** Numéro saisi valide : 9 chiffres commençant par 6, avec ou sans 237. */
function validPhone(value: string) {
  const d = value.replace(/\D/g, '').replace(/^(00)?237(?=\d{9}$)/, '');
  return /^6\d{8}$/.test(d);
}

type DirectState = { phase: 'idle' } | { phase: 'refused'; reason: string | null; url: string; paymentId: string } | { phase: 'waiting'; paymentId: string } | { phase: 'done' } | { phase: 'failed' } | { phase: 'late' };

/** Paiement sans quitter l'app : la demande de confirmation arrive sur le téléphone de l'éleveur. */
function MobileMoneyPay({ plan, amount, operators }: { plan: Plan; amount: number; operators: Operator[] }) {
  const available = OPERATORS.filter((o) => operators.includes(o.value));
  const [operator, setOperator] = useState<Operator>(available[0]?.value ?? 'MTN');
  const [phone, setPhone] = useState(() => {
    try { return localStorage.getItem(PHONE_KEY) ?? ''; } catch { return ''; }
  });
  const [state, setState] = useState<DirectState>({ phase: 'idle' });
  const [start, starting] = useMutation<{ startSubscriptionCheckout: { paymentId: string; url: string; direct: boolean; error?: string | null } }>(START_CHECKOUT);
  const [check] = useMutation<{ checkSubscriptionPayment: { status: 'CONFIRMED' | 'PENDING' | 'REJECTED' } }>(CHECK_PAYMENT, {
    refetchQueries: [{ query: SUBSCRIPTION_STATUS }],
  });

  // Suit le paiement toutes les 4 s pendant 3 min (le webhook active aussi l'abonnement de son côté).
  useEffect(() => {
    if (state.phase !== 'waiting') return;
    const startedAt = Date.now();
    let stopped = false;
    const tick = async () => {
      if (stopped) return;
      try {
        const { data } = await check({ variables: { reference: state.paymentId } });
        const status = data?.checkSubscriptionPayment.status;
        if (stopped) return;
        if (status === 'CONFIRMED') return setState({ phase: 'done' });
        if (status === 'REJECTED') return setState({ phase: 'failed' });
      } catch { /* réseau : on réessaie */ }
      if (Date.now() - startedAt > WAIT_MS) return setState({ phase: 'late' });
      timer = setTimeout(tick, POLL_MS);
    };
    let timer = setTimeout(tick, POLL_MS);
    return () => { stopped = true; clearTimeout(timer); };
  }, [state, check]);

  const pay = async () => {
    try { localStorage.setItem(PHONE_KEY, phone.trim()); } catch { /* navigation privée */ }
    const { data } = await start({ variables: { plan, operator, phone: phone.trim() } });
    const r = data?.startSubscriptionCheckout;
    if (!r) return;
    if (r.direct) return setState({ phase: 'waiting', paymentId: r.paymentId });
    // La demande directe n'a pas pu partir : on reste dans l'app et on explique pourquoi.
    setState({ phase: 'refused', reason: r.error ?? null, url: r.url, paymentId: r.paymentId });
  };

  const openNotchPayPage = (url: string, paymentId: string) => {
    rememberPayment(paymentId);
    window.location.assign(url);
  };

  if (state.phase === 'waiting') {
    return (
      <div role="status" className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
        <p className="flex items-center gap-2 font-semibold"><Loader2 size={18} className="animate-spin" /> Confirme le paiement sur ton téléphone</p>
        <p className="text-sm">
          Une demande de {formatMoney(amount)} arrive sur le {phone.trim()}. Valide-la avec ton code secret {operator === 'MTN' ? 'MTN MoMo' : 'Orange Money'}.
          Garde cette page ouverte, elle se met à jour toute seule.
        </p>
        <button type="button" onClick={() => setState({ phase: 'idle' })} className="text-xs font-semibold text-emerald-800 hover:underline">
          Changer de numéro
        </button>
      </div>
    );
  }
  if (state.phase === 'done') {
    return <p role="status" className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-900">Paiement reçu, merci ! Ton abonnement est activé.</p>;
  }

  return (
    <div className="space-y-3">
      {state.phase === 'refused' && (
        <div role="status" className="space-y-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          <p>
            La demande n’a pas pu être envoyée sur ton téléphone avec {operator === 'MTN' ? 'MTN MoMo' : 'Orange Money'}. Vérifie le numéro
            ou réessaie dans un moment.
          </p>
          {state.reason && <p className="text-xs text-amber-800">Réponse de NotchPay : {state.reason}</p>}
          <button type="button" onClick={() => openNotchPayPage(state.url, state.paymentId)} className="text-xs font-semibold text-amber-900 underline">
            Payer plutôt sur la page sécurisée NotchPay
          </button>
        </div>
      )}
      {state.phase === 'failed' && (
        <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Le paiement n’a pas abouti (refusé, annulé ou solde insuffisant). Rien n’a été prélevé : tu peux réessayer.</p>
      )}
      {state.phase === 'late' && (
        <p role="status" className="rounded-xl bg-sky-50 p-3 text-sm text-sky-900">Pas encore de confirmation. Si tu as validé sur ton téléphone, ton abonnement s’activera tout seul dans quelques minutes.</p>
      )}
      {available.length > 1 ? (
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Opérateur">
          {available.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={operator === o.value}
              onClick={() => setOperator(o.value)}
              className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition ${operator === o.value ? o.cls : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : (
        <p className={`rounded-xl border-2 px-3 py-2.5 text-center text-sm font-semibold ${available[0]?.cls ?? ''}`}>{available[0]?.label ?? 'Mobile Money'}</p>
      )}
      <Field label="Numéro Mobile Money">
        <Input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="6XX XX XX XX" />
      </Field>
      <ErrorBox error={starting.error} />
      <Button className="w-full" loading={starting.loading} disabled={!validPhone(phone)} onClick={() => pay().catch(() => undefined)}>
        <Smartphone size={18} /> Payer {formatMoney(amount)}
      </Button>
      <p className="text-xs text-slate-500">Tu restes dans l’app : la demande arrive sur ton téléphone, l’abonnement s’active dès que tu valides. Paiement sécurisé par NotchPay.</p>
    </div>
  );
}

export default function SubscriptionPage() {
  const { subscription: s, loading } = useSubscription();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Compte" title="Abonnement" description="Ton essai gratuit, ton abonnement et comment payer." />
      <PaymentReturn />
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
  const [showManual, setShowManual] = useState(false);
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
        {s.onlinePaymentEnabled && (
          <div className="mb-4 space-y-2">
            <MobileMoneyPay plan={plan} amount={amount} operators={s.onlineOperators} />
            {!showManual && !s.pendingPayment && (
              <button type="button" onClick={() => setShowManual(true)} className="text-xs font-semibold text-slate-500 hover:text-emerald-700 hover:underline">
                J’ai déjà payé autrement
              </button>
            )}
          </div>
        )}
        {s.onlinePaymentEnabled && !showManual && !s.pendingPayment ? null : s.pendingPayment ? (
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
