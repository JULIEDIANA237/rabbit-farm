'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import { AlertTriangle, BookOpen, CheckCircle2, ChevronRight, Info, MessageCircleQuestion, RefreshCw, X } from 'lucide-react';

import { Badge, Button, Card, Empty, ErrorBox, Input, Loading, Select, type BadgeTone } from '@/components/ui/kit';
import { errorMessage } from '@/lib/format';

/* ---------------------------------------------------------------- Données */

const QUESTION_FIELDS = `id kind severity title detail adviceKey href askAt status answer answerLabel answeredAt createdAt
  options { value label tone href adviceKey snooze }`;

export const COMPANION_QUESTIONS = gql`
  query CompanionQuestions { companionQuestions { ${QUESTION_FIELDS} } }
`;
const COMPANION_HISTORY = gql`
  query CompanionHistory { companionHistory { ${QUESTION_FIELDS} } }
`;
const ANSWER = gql`
  mutation AnswerCompanionQuestion($id: ID!, $value: String!) {
    answerCompanionQuestion(id: $id, value: $value) { ${QUESTION_FIELDS} }
  }
`;
const DISMISS = gql`
  mutation DismissCompanionQuestion($id: ID!) { dismissCompanionQuestion(id: $id) { id status } }
`;
const TOUR_NOW = gql`
  mutation CompanionTourNow { companionTourNow { id } }
`;
const SETTINGS = gql`
  query CompanionSettings { companionSettings { enabled maxPerDay location weatherReady } }
`;
const UPDATE_SETTINGS = gql`
  mutation UpdateCompanionSettings($input: UpdateCompanionSettingsInput!) {
    updateCompanionSettings(input: $input) { enabled maxPerDay location weatherReady }
  }
`;
export const ADVICE_SHEETS = gql`
  query AdviceSheets { adviceSheets { key title topic summary signs actions vet } }
`;

interface Option {
  value: string;
  label: string;
  tone?: 'good' | 'bad' | 'neutral' | null;
  href?: string | null;
  adviceKey?: string | null;
  snooze: boolean;
}

export interface CompanionQuestion {
  id: string;
  kind: string;
  severity: 'danger' | 'warning' | 'info';
  title: string;
  detail?: string | null;
  adviceKey?: string | null;
  href?: string | null;
  askAt: string;
  status: string;
  answer?: string | null;
  answerLabel?: string | null;
  answeredAt?: string | null;
  options: Option[];
}

export interface AdviceSheet {
  key: string;
  title: string;
  topic: string;
  summary: string;
  signs: string[];
  actions: string[];
  vet?: string | null;
}

const refetch = { refetchQueries: ['CompanionQuestions', 'CompanionHistory'] };

const SEVERITY: Record<CompanionQuestion['severity'], { tone: BadgeTone; label: string; box: string }> = {
  danger: { tone: 'red', label: 'Alerte', box: 'border-red-200 bg-red-50/60' },
  warning: { tone: 'amber', label: 'À vérifier', box: 'border-amber-200 bg-amber-50/50' },
  info: { tone: 'blue', label: 'Info', box: 'border-slate-200 bg-white' },
};

const OPTION_STYLE: Record<string, string> = {
  good: 'bg-emerald-600 text-white hover:bg-emerald-700',
  bad: 'bg-red-600 text-white hover:bg-red-700',
  neutral: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
};

export function useCompanionQuestions() {
  return useQuery<{ companionQuestions: CompanionQuestion[] }>(COMPANION_QUESTIONS, { fetchPolicy: 'cache-and-network' });
}

/* ---------------------------------------------------------------- Une question */

function QuestionCard({ question: q }: { question: CompanionQuestion }) {
  const client = useApolloClient();
  // Pas de rechargement immédiat de la liste : la carte reste affichée avec la suite à donner.
  const [answer, a] = useMutation<{ answerCompanionQuestion: CompanionQuestion }>(ANSWER);
  const [dismiss, d] = useMutation(DISMISS, refetch);
  const [done, setDone] = useState<CompanionQuestion | null>(null);
  const style = SEVERITY[q.severity] ?? SEVERITY.info;

  async function choose(option: Option) {
    const res = await answer({ variables: { id: q.id, value: option.value } }).catch(() => undefined);
    const result = res?.data?.answerCompanionQuestion;
    if (!result) return;
    if (result.status === 'ANSWERED') {
      setDone(result);
      void client.refetchQueries({ include: ['CompanionHistory'] });
    } else {
      void client.refetchQueries({ include: ['CompanionQuestions'] });
    }
  }

  if (done) {
    return (
      <li className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
        <p className="flex items-start gap-2 font-medium text-emerald-900">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span>
            Noté : {done.answerLabel}.
            {done.answer === 'bad' && ' Une observation et une tâche de contrôle pour demain sont ajoutées.'}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {done.href && (
            <Link href={done.href} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
              Continuer la saisie
            </Link>
          )}
          {done.adviceKey && (
            <Link href={`/advice#${done.adviceKey}`} className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <BookOpen size={14} /> Lire la fiche conseil
            </Link>
          )}
        </div>
      </li>
    );
  }

  return (
    <li className={`rounded-2xl border p-4 ${style.box}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Badge tone={style.tone}>{style.label}</Badge>
          <p className="mt-2 font-semibold text-slate-900">{q.title}</p>
          {q.detail && <p className="mt-1 text-sm text-slate-600">{q.detail}</p>}
        </div>
        <button
          type="button"
          aria-label="Masquer cette question"
          disabled={d.loading}
          onClick={() => void dismiss({ variables: { id: q.id } }).catch(() => undefined)}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={16} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {q.options.map((o) => (
          <button
            key={o.value}
            type="button"
            disabled={a.loading}
            onClick={() => void choose(o)}
            className={`rounded-xl px-3 py-2 text-sm font-semibold shadow-sm disabled:opacity-60 ${OPTION_STYLE[o.tone ?? 'neutral']}`}
          >
            {o.label}
          </button>
        ))}
        {q.adviceKey && (
          <Link href={`/advice#${q.adviceKey}`} className="inline-flex items-center gap-1 px-2 py-2 text-xs font-semibold text-emerald-700 hover:underline">
            <BookOpen size={14} /> Fiche conseil
          </Link>
        )}
      </div>
      {(a.error || d.error) && <p className="mt-2 text-xs text-red-700">{errorMessage(a.error ?? d.error)}</p>}
    </li>
  );
}

/* ---------------------------------------------------------------- Listes */

export function CompanionList({ limit }: { limit?: number }) {
  const { data, loading, error, refetch: reload } = useCompanionQuestions();
  if (error && !data) return <ErrorBox error={error} onRetry={() => reload()} />;
  if (!data) return loading ? <Loading /> : null;
  const list = limit ? data.companionQuestions.slice(0, limit) : data.companionQuestions;
  if (list.length === 0) {
    return <p className="text-sm text-slate-500">Rien à vérifier pour l’instant. L’assistant repasse à 6 h, 13 h et 18 h.</p>;
  }
  return (
    <ul className="space-y-3">
      {list.map((q) => (
        <QuestionCard key={q.id} question={q} />
      ))}
    </ul>
  );
}

/** En tête du tableau de bord : n'apparaît que s'il y a des questions. */
export function CompanionCard() {
  const { data } = useCompanionQuestions();
  const count = data?.companionQuestions.length ?? 0;
  if (count === 0) return null;
  const urgent = data?.companionQuestions.some((q) => q.severity === 'danger');
  return (
    <Card
      title={
        <span className="inline-flex items-center gap-2">
          {urgent ? <AlertTriangle size={18} className="text-red-600" /> : <MessageCircleQuestion size={18} className="text-emerald-600" />}
          Ton assistant a {count} question{count > 1 ? 's' : ''}
        </span>
      }
      subtitle="Réponds en un geste : il s’occupe du reste."
      actions={
        count > 2 ? (
          <Link href="/questions" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline">
            Tout voir <ChevronRight size={16} />
          </Link>
        ) : undefined
      }
    >
      <CompanionList limit={2} />
    </Card>
  );
}

export function TourNowButton() {
  const [tour, { loading, error }] = useMutation(TOUR_NOW, { refetchQueries: ['CompanionQuestions'], awaitRefetchQueries: true });
  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="secondary" loading={loading} onClick={() => void tour().catch(() => undefined)}>
        {!loading && <RefreshCw size={16} />} Faire le tour maintenant
      </Button>
      {error && <p className="text-xs text-red-700">{errorMessage(error)}</p>}
    </div>
  );
}

export function CompanionHistory() {
  const { data, loading, error, refetch: reload } = useQuery<{ companionHistory: CompanionQuestion[] }>(COMPANION_HISTORY, {
    fetchPolicy: 'cache-and-network',
  });
  if (error && !data) return <ErrorBox error={error} onRetry={() => reload()} />;
  if (!data) return loading ? <Loading /> : null;
  if (data.companionHistory.length === 0) return <Empty title="Pas encore de réponse" description="Tes réponses à l’assistant apparaîtront ici." />;
  return (
    <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
      {data.companionHistory.map((q) => (
        <li key={q.id} className="p-3 text-sm">
          <p className="text-slate-900">{q.title}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {q.status === 'DISMISSED' ? 'Masquée' : `Réponse : ${q.answerLabel ?? q.answer}`}
            {q.answeredAt && ` · ${new Date(q.answeredAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- Réglages */

interface Settings {
  enabled: boolean;
  maxPerDay: number;
  location?: string | null;
  weatherReady: boolean;
}

export function CompanionSettings() {
  const { data, loading, error } = useQuery<{ companionSettings: Settings }>(SETTINGS);
  if (error && !data) return <ErrorBox error={error} />;
  if (!data) return loading ? <Loading /> : null;
  return <SettingsForm key={JSON.stringify(data.companionSettings)} initial={data.companionSettings} />;
}

function SettingsForm({ initial }: { initial: Settings }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [maxPerDay, setMaxPerDay] = useState(String(initial.maxPerDay));
  const [location, setLocation] = useState(initial.location ?? '');
  const [save, { loading, error, data }] = useMutation<{ updateCompanionSettings: Settings }>(UPDATE_SETTINGS, { refetchQueries: ['CompanionSettings'] });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void save({ variables: { input: { enabled, maxPerDay: Number(maxPerDay), location } } }).catch(() => undefined);
  }

  return (
    <Card title="Réglages de l’assistant" subtitle="Tournées à 6 h, 13 h et 18 h. Rien entre 21 h et 6 h.">
      <form onSubmit={onSubmit} className="space-y-4 text-sm">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-5 w-5 accent-emerald-600" />
          <span className="font-medium text-slate-800">L’assistant pose des questions et envoie des alertes</span>
        </label>
        <label className="block">
          <span className="mb-1 block font-medium text-slate-700">Notifications de l’assistant par jour</span>
          <Select
            value={maxPerDay}
            onChange={(e) => setMaxPerDay(e.target.value)}
            options={[
              { value: '3', label: '3 au plus (une par tournée)' },
              { value: '2', label: '2 au plus' },
              { value: '1', label: '1 au plus' },
              { value: '0', label: 'Aucune (seulement les alertes graves)' },
            ]}
          />
          <span className="mt-1 block text-xs text-slate-500">En plus du rappel des tâches à 6 h. Les alertes graves (morts en série, forte chaleur) passent toujours.</span>
        </label>
        <label className="block">
          <span className="mb-1 block font-medium text-slate-700">Ville de la ferme (pour la météo)</span>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex. Douala, Yaoundé, Bafoussam" maxLength={120} />
          <span className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <Info size={12} />
            {initial.weatherReady ? 'Alertes de chaleur actives.' : 'Les alertes de chaleur démarrent à la prochaine tournée après avoir indiqué la ville.'}
          </span>
        </label>
        <div className="flex items-center gap-3">
          <Button type="submit" loading={loading}>Enregistrer</Button>
          {data && !loading && <span className="text-emerald-700">Enregistré.</span>}
        </div>
        <ErrorBox error={error} />
      </form>
    </Card>
  );
}
