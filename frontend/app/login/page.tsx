'use client';

import { FormEvent, Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { CheckCircle2 } from 'lucide-react';

import { LOGIN_MUTATION } from '@/graphql/auth/mutations';
import { useAuthStore } from '@/stores/auth-store';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button, ErrorBox, Field, Input, PasswordInput } from '@/components/ui/kit';

interface LoginResponse {
  login: { accessToken: string; userId: string; email: string };
}

function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const justRegistered = params.get('registered') === '1';
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [password, setPassword] = useState('');
  const [loginMutation, { loading, error }] = useMutation<LoginResponse>(LOGIN_MUTATION);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { data } = await loginMutation({ variables: { input: { email: email.trim(), password } } });
      if (!data?.login.accessToken) return;
      login(data.login.accessToken, { userId: data.login.userId, email: data.login.email });
      router.replace(safeNext(params.get('next')));
    } catch {
      // L'erreur exacte (mot de passe, serveur injoignable…) est affichée via `error`.
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {justRegistered && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <p>Ton compte est créé. Connecte-toi pour accéder à ton élevage.</p>
        </div>
      )}
      <Field label="Email">
        <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Field label="Mot de passe">
        <PasswordInput
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Field>
      <p className="-mt-2 text-right text-sm">
        <Link href="/forgot-password" className="font-medium text-emerald-700 hover:underline">
          Mot de passe oublié ?
        </Link>
      </p>
      <ErrorBox error={error} />
      <Button type="submit" loading={loading} className="w-full">
        Se connecter
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout title="Rabbit Farm" subtitle="Connectez-vous à votre élevage">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-slate-500">
        Pas encore de compte ?{' '}
        <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
          Créer mon élevage
        </Link>
      </p>
    </AuthLayout>
  );
}
