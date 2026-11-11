'use client';

import { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';

import { REGISTER_MUTATION } from '@/graphql/auth/mutations';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button, ErrorBox, Field, FormGrid, Input, PasswordInput } from '@/components/ui/kit';
import { useForm } from '@/hooks/use-form';
import { clean } from '@/lib/format';

interface RegisterResponse {
  register: { accessToken: string; userId: string; email: string };
}

export default function RegisterPage() {
  const router = useRouter();
  const { bind, values } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    farmName: '',
    farmLocation: '',
  });
  const [register, { loading, error }] = useMutation<RegisterResponse>(REGISTER_MUTATION);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { data } = await register({ variables: { input: clean(values) } });
      if (!data) return;
      // Le compte est créé : on passe par la page de connexion.
      const params = new URLSearchParams({ registered: '1', email: data.register.email });
      router.replace(`/login?${params.toString()}`);
    } catch {
      // affiché via `error`
    }
  }

  return (
    <AuthLayout title="Créer mon élevage" subtitle="Votre compte administrateur et votre ferme">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormGrid>
          <Field label="Prénom">
            <Input required {...bind('firstName')} />
          </Field>
          <Field label="Nom">
            <Input required {...bind('lastName')} />
          </Field>
        </FormGrid>
        <Field label="Email">
          <Input type="email" required autoComplete="email" {...bind('email')} />
        </Field>
        <Field label="Mot de passe" hint="8 caractères minimum">
          <PasswordInput required minLength={8} autoComplete="new-password" {...bind('password')} />
        </Field>
        <Field label="Nom de l'élevage">
          <Input required {...bind('farmName')} />
        </Field>
        <Field label="Localisation">
          <Input placeholder="Ville, quartier…" {...bind('farmLocation')} />
        </Field>
        <ErrorBox error={error} />
        <Button type="submit" loading={loading} className="w-full">
          Créer mon compte
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Déjà inscrit ?{' '}
        <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
