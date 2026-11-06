import { redirect } from 'next/navigation';

/**
 * Racine de l'application : redirige vers le tableau de bord.
 * (Remplace la page d'accueil par défaut de create-next-app.)
 */
export default function Home() {
  redirect('/dashboard');
}
