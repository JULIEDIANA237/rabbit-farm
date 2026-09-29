
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';

import { LOGIN_MUTATION } from '@/graphql/auth/mutations';
import { useAuthStore } from '@/stores/auth-store';

interface LoginResponse {
  login: {
    accessToken: string;
    userId: string;
    email: string;
  };
}

interface LoginVariables {
  input: {
    email: string;
    password: string;
  };
}

export default function LoginPage() {
  const router = useRouter();

  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginMutation, { loading, error }] = useMutation<
    LoginResponse,
    LoginVariables
  >(LOGIN_MUTATION);

  
async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  console.group('[LOGIN] Tentative de connexion');

  console.log('[LOGIN] Email:', email);
  console.log('[LOGIN] Début de la requête GraphQL...');

  try {
    const result = await loginMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
    });

    console.log('[LOGIN] Réponse GraphQL complète:', result);

    const data = result.data;

    if (!data?.login) {
      console.error(
        '[LOGIN] La réponse GraphQL ne contient pas "login".',
      );

      console.groupEnd();
      return;
    }

    console.log('[LOGIN] User ID:', data.login.userId);
    console.log('[LOGIN] Email retourné:', data.login.email);
    console.log(
      '[LOGIN] AccessToken reçu:',
      Boolean(data.login.accessToken),
    );

    if (!data.login.accessToken) {
      console.error('[LOGIN] Aucun accessToken reçu.');

      console.groupEnd();
      return;
    }

    console.log('[LOGIN] Décodage et stockage du JWT...');

    login(data.login.accessToken, {
      userId: data.login.userId,
      email: data.login.email,
    });

    console.log('[LOGIN] Authentification réussie.');
    console.log('[LOGIN] Redirection vers /dashboard');

    console.groupEnd();

    router.push('/dashboard');
  } catch (error: unknown) {
    console.error('[LOGIN] ERREUR DE CONNEXION:', error);

    if (error instanceof Error) {
      console.error('[LOGIN] Message:', error.message);
      console.error('[LOGIN] Stack:', error.stack);
    }

    console.groupEnd();
  }
}



  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">
          Rabbit Farm
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2"
              placeholder="admin@rabbitfarm.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              Identifiants invalides ou erreur de connexion.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border px-4 py-2 font-medium"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </main>
  );
}

