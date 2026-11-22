'use client';

import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Check, RotateCcw } from 'lucide-react';

import { Card, ErrorBox, Loading } from '@/components/ui/kit';
import { formatDate } from '@/lib/format';

export const CONTACT_MESSAGES = gql`
  query ContactMessages {
    contactMessages { id name contact message handled createdAt }
  }
`;
const SET_HANDLED = gql`
  mutation SetContactMessageHandled($id: ID!, $handled: Boolean!) {
    setContactMessageHandled(id: $id, handled: $handled) { id handled }
  }
`;

interface ContactMessage {
  id: string;
  name: string;
  contact: string;
  message: string;
  handled: boolean;
  createdAt: string;
}

/** Lien direct pour répondre : e-mail, ou WhatsApp si c'est un numéro. */
function replyHref(contact: string) {
  if (contact.includes('@')) return `mailto:${contact}`;
  const digits = contact.replace(/[^\d]/g, '');
  return digits.length >= 8 ? `https://wa.me/${digits}` : null;
}

export function useUnreadContactCount() {
  const { data } = useQuery<{ contactMessages: ContactMessage[] }>(CONTACT_MESSAGES, { fetchPolicy: 'cache-and-network' });
  return (data?.contactMessages ?? []).filter((m) => !m.handled).length;
}

export function ContactMessages() {
  const { data, loading, error, refetch } = useQuery<{ contactMessages: ContactMessage[] }>(CONTACT_MESSAGES, {
    fetchPolicy: 'cache-and-network',
  });
  const [setHandled, { loading: saving }] = useMutation(SET_HANDLED);
  if (error && !data) return <ErrorBox error={error} onRetry={() => refetch()} />;
  if (!data) return loading ? <Loading /> : null;
  const messages = data.contactMessages;
  const unread = messages.filter((m) => !m.handled).length;

  return (
    <Card title="Messages de la page d’accueil" subtitle={`${unread} à traiter · ${messages.length} au total`}>
      {messages.length === 0 ? (
        <p className="text-sm text-slate-500">Aucun message pour l’instant.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => {
            const href = replyHref(m.contact);
            return (
              <li key={m.id} className={`rounded-xl border p-4 text-sm ${m.handled ? 'border-slate-200 bg-slate-50' : 'border-violet-200 bg-violet-50/60'}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-slate-900">
                    {m.name} <span className="font-normal text-slate-600">· {m.contact}</span>
                  </p>
                  <span className="text-xs text-slate-500">{formatDate(m.createdAt)}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-slate-800">{m.message}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
                    >
                      Répondre {href.startsWith('mailto') ? 'par e-mail' : 'sur WhatsApp'}
                    </a>
                  )}
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void setHandled({ variables: { id: m.id, handled: !m.handled } })}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {m.handled ? <><RotateCcw size={14} /> Remettre à traiter</> : <><Check size={14} /> Marquer comme traité</>}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
