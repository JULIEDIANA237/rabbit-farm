'use client';

import { FormEvent, Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client/react';

import { RESET_PASSWORD } from '@/graphql/auth/mutations';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button, ErrorBox, Field, PasswordInput } from '@/components/ui/kit';

function ResetPasswordForm() {
  const token = useSearchParams().get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [mismatch, setMismatch] = useState(false);
  const [done, setDone] = useState(false);
  const [reset, { loading, error }] = useMutation(RESET_PASSWORD);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMismatch(password !== confirm);
    if (password !== confirm) return;
    try {
      await reset({ variables: { input: { token, password } } });
      setDone(true);
    } catch {
      // Affiché via `error`.
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-slate-700">
        Ce lien est incomplet.{' '}
        <Link href="/forgot-password" className="font-semibold text-emerald-700 hover:underline">
          Demander un nouveau lien
        </Link>
      </p>
    );
  }

  if (done) {
    return (
      <div className="space-y-4 text-sm">
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-slate-700">
          Ton mot de passe a été changé. Tu peux te connecter avec le nouveau.
        </p>
        <Link href="/login" className="block text-center font-semibold text-emerald-700 hover:underline">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nouveau mot de passe (8 caractères minimum)">
        <PasswordInput autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>
      <Field label="Confirmer le mot de passe">
        <PasswordInput autoComplete="new-password" minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
      </Field>
      {mismatch && <ErrorBox error="Les deux mots de passe ne sont pas identiques." />}
      <ErrorBox error={error} />
      <Button type="submit" loading={loading} className="w-full">
        Enregistrer le nouveau mot de passe
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Nouveau mot de passe" subtitle="Choisissez votre nouveau mot de passe">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
