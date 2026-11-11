'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client/react';

import { REQUEST_PASSWORD_RESET } from '@/graphql/auth/mutations';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button, ErrorBox, Field, Input } from '@/components/ui/kit';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [request, { loading, error }] = useMutation(REQUEST_PASSWORD_RESET);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await request({ variables: { input: { email } } });
      setSent(true);
    } catch {
      // Affiché via `error`.
    }
  }

  return (
    <AuthLayout title="Mot de passe oublié" subtitle="Recevez un lien pour en choisir un nouveau">
      {sent ? (
        <div className="space-y-4 text-sm text-slate-700">
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            Si un compte existe pour <strong>{email}</strong>, un e-mail vient d’être envoyé avec un lien valable
            1 heure. Pense à regarder dans les courriers indésirables.
          </p>
          <Link href="/login" className="block text-center font-semibold text-emerald-700 hover:underline">
            Retour à la connexion
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email du compte">
            <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <ErrorBox error={error} />
          <Button type="submit" loading={loading} className="w-full">
            Envoyer le lien
          </Button>
          <p className="text-center text-sm">
            <Link href="/login" className="font-medium text-emerald-700 hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
