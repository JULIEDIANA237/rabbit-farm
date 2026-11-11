'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';

import { LOGIN_MUTATION } from '@/graphql/auth/mutations';
import { useAuthStore } from '@/stores/auth-store';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button, ErrorBox, Field, Input } from '@/components/ui/kit';

interface LoginResponse {
  login: { accessToken: string; userId: string; email: string };
}

function nextPath() {
  if (typeof window === 'undefined') return '/dashboard';
  const next = new URLSearchParams(window.location.search).get('next');
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
}

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMutation, { loading, error }] = useMutation<LoginResponse>(LOGIN_MUTATION);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { data } = await loginMutation({ variables: { input: { email, password } } });
      if (!data?.login.accessToken) return;
      login(data.login.accessToken, { userId: data.login.userId, email: data.login.email });
      router.replace(nextPath());
    } catch {
      // L'erreur est affichée via `error`.
    }
  }

  return (
    <AuthLayout title="Rabbit Farm" subtitle="Connectez-vous à votre élevage">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Mot de passe">
          <Input
            type="password"
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
        {error && <ErrorBox error="Identifiants invalides ou serveur injoignable." />}
        <Button type="submit" loading={loading} className="w-full">
          Se connecter
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Pas encore de compte ?{' '}
        <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
          Créer mon élevage
        </Link>
      </p>
    </AuthLayout>
  );
}
