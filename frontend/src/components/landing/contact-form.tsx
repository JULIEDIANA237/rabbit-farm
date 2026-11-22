'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { CheckCircle2, Send } from 'lucide-react';

const SEND_CONTACT = gql`
  mutation SendContactMessage($input: ContactMessageInput!) {
    sendContactMessage(input: $input)
  }
`;

const field =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 sm:text-sm';

/** Zone contact : le message arrive dans l'espace propriétaire (et par e-mail si configuré). */
export function ContactForm() {
  const [values, setValues] = useState({ name: '', contact: '', message: '', website: '' });
  const [send, { loading, error, data }] = useMutation<{ sendContactMessage: boolean }>(SEND_CONTACT);
  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));
  const ready = values.name.trim().length >= 2 && values.contact.trim().length >= 5 && values.message.trim().length >= 10;

  if (data?.sendContactMessage) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
        <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={22} />
        <div>
          <p className="font-semibold">Message envoyé, merci !</p>
          <p className="mt-1 text-sm">Nous te répondons au plus vite sur le contact que tu as indiqué.</p>
        </div>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) void send({ variables: { input: values } }).catch(() => undefined);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-800">
          Ton nom
          <input className={`${field} mt-1.5`} autoComplete="name" value={values.name} onChange={set('name')} maxLength={100} required />
        </label>
        <label className="block text-sm font-medium text-slate-800">
          Téléphone, WhatsApp ou e-mail
          <input className={`${field} mt-1.5`} value={values.contact} onChange={set('contact')} maxLength={150} required />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-800">
        Ton message
        <textarea
          className={`${field} mt-1.5 resize-none`}
          rows={5}
          placeholder="Une question, une démonstration, un problème…"
          value={values.message}
          onChange={set('message')}
          maxLength={2000}
          required
        />
      </label>
      {/* Champ piège : invisible pour les personnes, rempli par les robots. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        value={values.website}
        onChange={set('website')}
      />
      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
          Le message n’est pas parti : {error.message.includes('Too Many') ? 'trop d’envois, réessaie dans une minute.' : 'vérifie ta connexion et réessaie.'}
        </p>
      )}
      <button
        type="submit"
        disabled={!ready || loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        <Send size={18} /> {loading ? 'Envoi…' : 'Envoyer le message'}
      </button>
    </form>
  );
}
