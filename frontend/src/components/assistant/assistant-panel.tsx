'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { ArrowUpRight, Mic, MicOff, SendHorizontal, Sparkles, Trash2, X } from 'lucide-react';

import { ErrorBox } from '@/components/ui/kit';
import { URL_COMMAND_EVENT } from '@/hooks/use-form';
import { useSpeech } from '@/hooks/use-speech';
import { ASK_ASSISTANT, useAssistantEnabled, type AssistantDraft } from '@/lib/assistant';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  drafts?: AssistantDraft[];
}

const STORAGE_KEY = 'rabbitfarm.assistant.chat';
/** Au-delà, on abandonne côté navigateur (le serveur coupe déjà vers 45 s). */
const CLIENT_TIMEOUT_MS = 90_000;

const SUGGESTIONS = [
  'Que dois-je faire aujourd’hui ?',
  'Quelles lapines mettent bas cette semaine ?',
  'Combien j’ai vendu et dépensé ce mois-ci ?',
  'F12 a mis bas 8 petits dont 1 mort',
];

/** Après ce délai sans échange, l'assistant repart sur une discussion vierge. */
const CHAT_IDLE_MS = 30 * 60_000;

interface StoredChat {
  at: number;
  messages: ChatMessage[];
}

function loadChat(): ChatMessage[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as Partial<StoredChat>) : null;
    if (!stored || !Array.isArray(stored.messages) || typeof stored.at !== 'number') return [];
    return Date.now() - stored.at < CHAT_IDLE_MS ? stored.messages : [];
  } catch {
    return [];
  }
}

function saveChat(messages: ChatMessage[]) {
  try {
    const stored: StoredChat = { at: Date.now(), messages: messages.slice(-30) };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Stockage indisponible (navigation privée) : la discussion n'est pas conservée.
  }
}

/**
 * Assistant IA disponible sur toutes les pages : il répond aux questions
 * sur la ferme et prépare des brouillons que l'éleveur ouvre, vérifie
 * et enregistre lui-même.
 */
export function AssistantPanel() {
  const enabled = useAssistantEnabled();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState('');
  const [timedOut, setTimedOut] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const [ask, { loading, error, reset }] = useMutation<{ askAssistant: { text: string; drafts: AssistantDraft[] } }>(ASK_ASSISTANT);
  const speech = useSpeech((spoken) => setText((previous) => (previous ? `${previous} ${spoken}` : spoken)));

  const lastActivity = useRef(0);

  // Plein écran sur téléphone : la page derrière ne doit pas défiler.
  useEffect(() => {
    if (!open || window.matchMedia('(min-width: 1024px)').matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (open && !loaded) {
    setLoaded(true);
    setMessages(loadChat());
  }

  useEffect(() => {
    if (loaded && messages.length > 0) lastActivity.current = Date.now();
    if (loaded) saveChat(messages);
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loaded]);

  function openPanel() {
    // Une discussion restée inactive trop longtemps est remplacée par une nouvelle.
    if (loaded && Date.now() - lastActivity.current >= CHAT_IDLE_MS) setMessages([]);
    reset();
    setTimedOut(false);
    setOpen(true);
  }

  if (!enabled) return null;

  async function send(message: string) {
    const content = message.trim();
    if (!content || loading) return;
    reset();
    setTimedOut(false);
    const history = messages.map(({ role, content: body }) => ({ role, content: body })).slice(-12);
    setMessages((previous) => [...previous, { role: 'user', content }]);
    setText('');
    try {
      const response = await ask({
        variables: { input: { message: content, history, page: pathname } },
        context: { fetchOptions: { signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS) } },
      });
      const reply = response.data?.askAssistant;
      if (reply) {
        setMessages((previous) => [...previous, { role: 'assistant', content: reply.text, drafts: reply.drafts }]);
      }
    } catch (caught) {
      // L'erreur est affichée sous la discussion ; un délai dépassé a son propre message.
      const name = (caught as { name?: string; cause?: { name?: string } })?.cause?.name ?? (caught as { name?: string })?.name;
      if (name === 'TimeoutError' || name === 'AbortError') setTimedOut(true);
    }
  }

  function openDraft(href: string) {
    router.push(href);
    // Si la page est déjà affichée, elle ne se recharge pas : on la prévient.
    window.setTimeout(() => window.dispatchEvent(new Event(URL_COMMAND_EVENT)), 150);
    if (window.matchMedia('(max-width: 1023px)').matches) setOpen(false);
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openPanel}
          aria-label="Ouvrir l’assistant IA"
          className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-violet-600 p-3.5 text-sm sm:px-4 sm:py-3 font-semibold text-white shadow-lg hover:bg-violet-700 lg:bottom-6 lg:right-6"
        >
          <Sparkles size={18} /> <span className="hidden sm:inline">Assistant</span>
        </button>
      )}

      {open && (
        <section
          aria-label="Assistant IA"
          className="fixed inset-x-0 top-0 z-50 flex h-[100dvh] flex-col bg-white pt-[env(safe-area-inset-top)] shadow-2xl lg:inset-auto lg:bottom-6 lg:right-6 lg:h-[640px] lg:max-h-[calc(100vh-3rem)] lg:w-[420px] lg:pt-0 lg:rounded-3xl lg:border lg:border-slate-200"
        >
          <header className="flex items-start justify-between gap-2 border-b border-slate-100 px-4 py-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-semibold text-slate-900">
                <Sparkles size={18} className="text-violet-600" /> Assistant RabbitFarm
              </p>
              <p className="text-xs leading-snug text-slate-500">Il lit tes données et prépare des fiches. Rien n’est enregistré sans toi.</p>
            </div>
            <div className="flex shrink-0 gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setMessages([]);
                    reset();
                    setTimedOut(false);
                  }}
                  aria-label="Nouvelle discussion"
                  className="flex items-center gap-1 rounded-lg p-2 text-xs font-medium text-slate-600 hover:bg-slate-100 sm:px-2"
                >
                  <Trash2 size={16} /> <span className="hidden sm:inline">Nouvelle discussion</span>
                </button>
              )}
              <button type="button" aria-label="Fermer l’assistant" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">
                  Pose une question sur ta ferme, ou raconte ce qui s’est passé : je prépare la fiche à valider.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => send(suggestion)}
                      className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-left text-sm text-violet-800 hover:bg-violet-100"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[88%] min-w-0 space-y-2 rounded-2xl px-3 py-2 text-sm [overflow-wrap:anywhere] ${
                    message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.drafts?.map((draft, draftIndex) => (
                    <div key={draftIndex} className="space-y-1 rounded-xl border border-violet-200 bg-white p-2 text-slate-800">
                      <p className="font-medium">{draft.summary}</p>
                      {draft.warnings.map((warning) => (
                        <p key={warning} className="text-xs text-amber-700">
                          ⚠️ {warning}
                        </p>
                      ))}
                      {draft.href ? (
                        <button
                          type="button"
                          onClick={() => openDraft(draft.href as string)}
                          className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
                        >
                          Ouvrir et vérifier <ArrowUpRight size={14} />
                        </button>
                      ) : (
                        <p className="text-xs text-slate-500">Complète les informations manquantes pour ouvrir la fiche.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {loading && <p className="text-sm text-slate-500">L’assistant réfléchit…</p>}
            {timedOut ? (
              <ErrorBox error={new Error('Le serveur ne répond pas. Vérifie que le backend tourne et ta connexion internet, puis réessaie.')} />
            ) : (
              <ErrorBox error={error} />
            )}
            <div ref={endRef} />
          </div>

          <form
            className="flex items-end gap-2 border-t border-slate-100 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            onSubmit={(event) => {
              event.preventDefault();
              send(text).catch(() => undefined);
            }}
          >
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  send(text).catch(() => undefined);
                }
              }}
              rows={1}
              placeholder="Écris ou dicte ta question…"
              className="max-h-32 min-w-0 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-base focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 sm:text-sm"
            />
            {speech.supported && (
              <button
                type="button"
                onClick={speech.toggle}
                aria-label={speech.listening ? 'Arrêter la dictée' : 'Dicter'}
                className={`shrink-0 rounded-xl p-2.5 ${speech.listening ? 'animate-pulse bg-red-600 text-white' : 'text-violet-700 ring-1 ring-violet-200'}`}
              >
                {speech.listening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
            <button
              type="submit"
              aria-label="Envoyer"
              disabled={!text.trim() || loading}
              className="shrink-0 rounded-xl bg-violet-600 p-2.5 text-white disabled:opacity-50"
            >
              <SendHorizontal size={18} />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
