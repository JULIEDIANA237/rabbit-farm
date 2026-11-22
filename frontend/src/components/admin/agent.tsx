'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Bot, Check, ExternalLink, MessageCircle, RefreshCw, Send, Sparkles, X } from 'lucide-react';

import { Badge, Button, Card, Empty, ErrorBox, Loading, Textarea, type BadgeTone } from '@/components/ui/kit';
import { errorMessage } from '@/lib/format';

/* ---------------------------------------------------------------- Données */

const SUGGESTION_FIELDS = `id kind severity title detail href action recipient subject draft status resolvedBy resolvedAt createdAt`;

export const AGENT_OVERVIEW = gql`
  query AgentOverview {
    agentOverview {
      aiEnabled
      mailEnabled
      brief { id text usedAi pending createdAt }
      pending { ${SUGGESTION_FIELDS} }
    }
  }
`;
const AGENT_HISTORY = gql`
  query AgentHistory {
    agentHistory { ${SUGGESTION_FIELDS} }
    agentLog { id actor actorEmail action summary createdAt }
  }
`;
const REFRESH = gql`
  mutation RefreshAgent { refreshAgent { id } }
`;
const APPROVE = gql`
  mutation ApproveAgentSuggestion($id: ID!, $draft: String) { approveAgentSuggestion(id: $id, draft: $draft) { id status } }
`;
const DISMISS = gql`
  mutation DismissAgentSuggestion($id: ID!) { dismissAgentSuggestion(id: $id) { id status } }
`;
const IMPROVE = gql`
  mutation ImproveAgentDraft($id: ID!, $draft: String) { improveAgentDraft(id: $id, draft: $draft) { id draft } }
`;
const ASK = gql`
  mutation AskAgent($input: AskAgentInput!) { askAgent(input: $input) }
`;

type Action = 'NONE' | 'CONFIRM_PAYMENT' | 'EXTEND_TRIAL' | 'SEND_EMAIL' | 'REPLY_CONTACT';

export interface AgentSuggestion {
  id: string;
  kind: string;
  severity: 'danger' | 'warning' | 'info';
  title: string;
  detail?: string | null;
  href?: string | null;
  action: Action;
  recipient?: string | null;
  subject?: string | null;
  draft?: string | null;
  status: 'PENDING' | 'DONE' | 'DISMISSED' | 'EXPIRED';
  resolvedBy?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
}

interface Overview {
  aiEnabled: boolean;
  mailEnabled: boolean;
  brief?: { id: string; text: string; usedAi: boolean; pending: number; createdAt: string } | null;
  pending: AgentSuggestion[];
}

interface LogEntry {
  id: string;
  actor: string;
  actorEmail?: string | null;
  action: string;
  summary: string;
  createdAt: string;
}

const refetchAll = { refetchQueries: ['AgentOverview', 'AgentHistory', 'ContactMessages'], awaitRefetchQueries: true };

const TONE: Record<AgentSuggestion['severity'], BadgeTone> = { danger: 'red', warning: 'amber', info: 'blue' };
const SEVERITY_LABEL: Record<AgentSuggestion['severity'], string> = { danger: 'Urgent', warning: 'À faire', info: 'Info' };
const STATUS_LABEL: Record<AgentSuggestion['status'], string> = { PENDING: 'À valider', DONE: 'Validé', DISMISSED: 'Ignoré', EXPIRED: 'Plus d’actualité' };
const STATUS_TONE: Record<AgentSuggestion['status'], BadgeTone> = { PENDING: 'amber', DONE: 'green', DISMISSED: 'slate', EXPIRED: 'slate' };

const dateTime = (value: string) =>
  new Date(value).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const PLACEHOLDER = '[Réponse à compléter]';

function useOverview() {
  return useQuery<{ agentOverview: Overview }>(AGENT_OVERVIEW, { fetchPolicy: 'cache-and-network' });
}

/** Nombre de propositions à valider (pastille du menu). */
export function usePendingAgentCount() {
  const { data } = useOverview();
  return data?.agentOverview.pending.length ?? 0;
}

/** Numéro WhatsApp tiré d'un contact, ou null si c'est un e-mail. */
function whatsappNumber(contact?: string | null) {
  if (!contact || contact.includes('@')) return null;
  const digits = contact.replace(/[^\d]/g, '');
  return digits.length >= 8 ? digits : null;
}

/** Libellé du bouton de validation, selon ce que l'action fera vraiment. */
function approveLabel(s: AgentSuggestion) {
  switch (s.action) {
    case 'CONFIRM_PAYMENT':
      return 'Confirmer le paiement';
    case 'EXTEND_TRIAL':
      return 'Prolonger l’essai de 7 jours';
    case 'SEND_EMAIL':
      return 'Envoyer l’e-mail';
    case 'REPLY_CONTACT':
      return whatsappNumber(s.recipient) ? 'Marquer comme répondu' : 'Envoyer la réponse';
    default:
      return 'Vu';
  }
}

/* ---------------------------------------------------------------- Point du matin */

function RefreshButton({ compact = false }: { compact?: boolean }) {
  const [refresh, { loading, error }] = useMutation(REFRESH, refetchAll);
  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="secondary" loading={loading} onClick={() => void refresh().catch(() => undefined)}>
        {!loading && <RefreshCw size={16} />} {compact ? 'Actualiser' : 'Actualiser le point'}
      </Button>
      {error && <p className="text-xs text-red-700">{errorMessage(error)}</p>}
    </div>
  );
}

function BriefText({ brief }: { brief: Overview['brief'] }) {
  if (!brief) {
    return <p className="text-sm text-slate-600">Pas encore de point : il arrive chaque matin à 6 h. Tu peux le lancer maintenant avec « Actualiser ».</p>;
  }
  return (
    <div>
      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">{brief.text}</p>
      <p className="mt-2 text-xs text-slate-500">
        {dateTime(brief.createdAt)} · {brief.usedAi ? 'rédigé par l’IA à partir des chiffres' : 'résumé automatique'}
      </p>
    </div>
  );
}

/** Carte en tête de la vue d'ensemble : le point du matin et les 3 actions les plus urgentes. */
export function AgentBriefCard() {
  const { data, loading, error, refetch } = useOverview();
  if (error && !data) return <ErrorBox error={error} onRetry={() => refetch()} />;
  if (!data) return loading ? <Loading /> : null;
  const { brief, pending } = data.agentOverview;
  const top = pending.slice(0, 3);

  return (
    <Card
      title={<span className="inline-flex items-center gap-2"><Bot size={18} className="text-violet-600" /> Ton point du matin</span>}
      subtitle={`${pending.length} action${pending.length > 1 ? 's' : ''} à valider`}
      actions={<RefreshButton compact />}
    >
      <BriefText brief={brief} />
      {top.length > 0 && (
        <ul className="mt-4 space-y-2">
          {top.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <Badge tone={TONE[s.severity]}>{SEVERITY_LABEL[s.severity]}</Badge>
                <span className="font-medium text-slate-900">{s.title}</span>
              </span>
              <QuickActions suggestion={s} />
            </li>
          ))}
        </ul>
      )}
      <Link href="/admin/agent" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:underline">
        Tout voir dans l’onglet Agent <ExternalLink size={14} />
      </Link>
    </Card>
  );
}

/** Validation rapide sur la vue d'ensemble (sans modifier le brouillon). */
function QuickActions({ suggestion: s }: { suggestion: AgentSuggestion }) {
  const [approve, a] = useMutation(APPROVE, refetchAll);
  const [dismiss, d] = useMutation(DISMISS, refetchAll);
  const needsEdit = s.draft?.includes(PLACEHOLDER) || s.action === 'SEND_EMAIL' || s.action === 'REPLY_CONTACT';
  const failure = a.error ?? d.error;
  return (
    <span className="flex flex-col items-end gap-1">
      <span className="flex gap-2">
        {needsEdit ? (
          <Link href="/admin/agent" className="rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700">
            Relire et envoyer
          </Link>
        ) : (
          <Button className="!px-3 !py-1.5 text-xs" loading={a.loading} onClick={() => void approve({ variables: { id: s.id } }).catch(() => undefined)}>
            {approveLabel(s)}
          </Button>
        )}
        <Button variant="secondary" className="!px-3 !py-1.5 text-xs" loading={d.loading} onClick={() => void dismiss({ variables: { id: s.id } }).catch(() => undefined)}>
          Ignorer
        </Button>
      </span>
      {failure && <span className="text-xs text-red-700">{errorMessage(failure)}</span>}
    </span>
  );
}

/* ---------------------------------------------------------------- À valider */

function SuggestionCard({ suggestion: s, aiEnabled, mailEnabled }: { suggestion: AgentSuggestion; aiEnabled: boolean; mailEnabled: boolean }) {
  const [draft, setDraft] = useState(s.draft ?? '');
  const [approve, a] = useMutation(APPROVE, refetchAll);
  const [dismiss, d] = useMutation(DISMISS, refetchAll);
  const [improve, i] = useMutation<{ improveAgentDraft: { draft: string | null } }>(IMPROVE);
  const failure = a.error ?? d.error ?? i.error;

  const phone = s.action === 'REPLY_CONTACT' ? whatsappNumber(s.recipient) : null;
  const sendsMail = s.action === 'SEND_EMAIL' || (s.action === 'REPLY_CONTACT' && !phone);
  const unfinished = draft.includes(PLACEHOLDER);
  const blocked = (sendsMail && (!mailEnabled || unfinished)) || (!!phone && unfinished);

  async function onImprove() {
    const res = await improve({ variables: { id: s.id, draft } }).catch(() => undefined);
    const text = res?.data?.improveAgentDraft.draft;
    if (text) setDraft(text);
  }

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={TONE[s.severity]}>{SEVERITY_LABEL[s.severity]}</Badge>
            <h3 className="font-semibold text-slate-900">{s.title}</h3>
          </div>
          {s.detail && <p className="mt-1 text-sm text-slate-600">{s.detail}</p>}
        </div>
        {s.href && (
          <Link href={s.href} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-violet-700 hover:underline">
            Ouvrir <ExternalLink size={12} />
          </Link>
        )}
      </div>

      {s.draft !== null && s.draft !== undefined && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-slate-500">
            {phone ? 'Message WhatsApp' : 'E-mail'} à <span className="font-medium text-slate-700">{s.recipient}</span>
            {s.subject && !phone && <> · objet : {s.subject}</>}
          </p>
          <Textarea rows={7} value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="Brouillon du message" />
          {unfinished && <p className="text-xs text-amber-800">Remplace « {PLACEHOLDER} » par ta réponse avant d’envoyer.</p>}
          {sendsMail && !mailEnabled && (
            <p className="text-xs text-amber-800">L’envoi d’e-mails n’est pas configuré sur le serveur (RESEND_API_KEY dans Vercel, projet farm_backend).</p>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {phone && (
          <a
            href={`https://wa.me/${phone}?text=${encodeURIComponent(draft)}`}
            target="_blank"
            rel="noreferrer"
            aria-disabled={unfinished}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm ${unfinished ? 'pointer-events-none bg-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            <MessageCircle size={16} /> Ouvrir WhatsApp
          </a>
        )}
        <Button
          variant={phone ? 'secondary' : 'primary'}
          loading={a.loading}
          disabled={blocked}
          onClick={() => void approve({ variables: { id: s.id, draft: s.draft != null ? draft : null } }).catch(() => undefined)}
        >
          {!a.loading && <Check size={16} />} {approveLabel(s)}
        </Button>
        {s.draft != null && aiEnabled && (
          <Button variant="secondary" loading={i.loading} onClick={() => void onImprove()}>
            {!i.loading && <Sparkles size={16} />} Améliorer avec l’IA
          </Button>
        )}
        <Button variant="ghost" loading={d.loading} onClick={() => void dismiss({ variables: { id: s.id } }).catch(() => undefined)}>
          {!d.loading && <X size={16} />} Ignorer
        </Button>
      </div>
      {failure && <div className="mt-3"><ErrorBox error={failure} /></div>}
    </li>
  );
}

export function AgentPending() {
  const { data, loading, error, refetch } = useOverview();
  if (error && !data) return <ErrorBox error={error} onRetry={() => refetch()} />;
  if (!data) return loading ? <Loading /> : null;
  const { brief, pending, aiEnabled, mailEnabled } = data.agentOverview;

  return (
    <div className="space-y-4">
      <Card
        title={<span className="inline-flex items-center gap-2"><Bot size={18} className="text-violet-600" /> Point du matin</span>}
        actions={<RefreshButton />}
      >
        <BriefText brief={brief} />
      </Card>
      {pending.length === 0 ? (
        <Empty title="Rien à valider" description="L’agent repasse chaque matin à 6 h et t’écrit s’il trouve quelque chose." />
      ) : (
        <ul className="space-y-3">
          {pending.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} aiEnabled={aiEnabled} mailEnabled={mailEnabled} />
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Historique et journal */

export function AgentHistory() {
  const { data, loading, error, refetch } = useQuery<{ agentHistory: AgentSuggestion[]; agentLog: LogEntry[] }>(AGENT_HISTORY, {
    fetchPolicy: 'cache-and-network',
  });
  if (error && !data) return <ErrorBox error={error} onRetry={() => refetch()} />;
  if (!data) return loading ? <Loading /> : null;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Propositions traitées" subtitle="Les 100 dernières">
        {data.agentHistory.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune pour l’instant.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.agentHistory.map((s) => (
              <li key={s.id} className="py-2 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={STATUS_TONE[s.status]}>{STATUS_LABEL[s.status]}</Badge>
                  <span className="text-slate-900">{s.title}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{s.resolvedAt ? dateTime(s.resolvedAt) : dateTime(s.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Journal" subtitle="Tout ce que l’agent et toi avez fait">
        {data.agentLog.length === 0 ? (
          <p className="text-sm text-slate-500">Le journal est vide.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.agentLog.map((l) => (
              <li key={l.id} className="py-2 text-sm">
                <p className="text-slate-900">
                  <span className={`mr-2 text-xs font-semibold ${l.actor === 'AGENT' ? 'text-violet-700' : 'text-emerald-700'}`}>
                    {l.actor === 'AGENT' ? 'Agent' : 'Toi'}
                  </span>
                  {l.summary}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{dateTime(l.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- Questions libres */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const EXAMPLES = ['Combien d’abonnés payants ai-je ?', 'Quels élevages n’ont pas utilisé l’app cette semaine ?', 'Combien ai-je gagné ce mois-ci ?'];

export function AgentChat() {
  const { data } = useOverview();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [ask, { loading, error }] = useMutation<{ askAgent: string }>(ASK);
  const aiEnabled = data?.agentOverview.aiEnabled ?? true;

  async function send(text: string) {
    const q = text.trim();
    if (q.length < 2 || loading) return;
    const history = messages.slice(-10);
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setQuestion('');
    const res = await ask({ variables: { input: { question: q, history } } }).catch(() => undefined);
    const answer = res?.data?.askAgent;
    if (answer) setMessages((m) => [...m, { role: 'assistant', content: answer }]);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(question);
  }

  return (
    <Card title="Poser une question" subtitle="L’agent répond avec les chiffres de la plateforme. Il ne modifie rien.">
      {!aiEnabled && <p className="mb-3 text-sm text-amber-800">L’IA n’est pas configurée sur le serveur : les questions libres sont indisponibles.</p>}
      {messages.length === 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              disabled={!aiEnabled}
              onClick={() => void send(ex)}
              className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-800 hover:bg-violet-100 disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
      ) : (
        <ul className="mb-3 space-y-2">
          {messages.map((m, idx) => (
            <li
              key={idx}
              className={`max-w-[90%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                m.role === 'user' ? 'ml-auto bg-violet-600 text-white' : 'bg-slate-100 text-slate-900'
              }`}
            >
              {m.content}
            </li>
          ))}
          {loading && <li className="text-sm text-slate-500">L’agent réfléchit…</li>}
        </ul>
      )}
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={1000}
          disabled={!aiEnabled}
          placeholder="Ta question…"
          aria-label="Ta question"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 sm:text-sm"
        />
        <Button type="submit" loading={loading} disabled={!aiEnabled || question.trim().length < 2}>
          {!loading && <Send size={16} />} Envoyer
        </Button>
      </form>
      {error && <div className="mt-3"><ErrorBox error={error} /></div>}
    </Card>
  );
}
