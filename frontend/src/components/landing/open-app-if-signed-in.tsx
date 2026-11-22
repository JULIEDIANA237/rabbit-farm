'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { getAccessToken } from '@/lib/auth-storage';

/**
 * L'icône installée ouvre « /?app=1 » : la personne connectée file sur son tableau de bord,
 * les autres voient la page d'accueil (et non l'écran de connexion).
 */
export function OpenAppIfSignedIn() {
  const router = useRouter();
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('app') !== '1') return;
    try {
      if (getAccessToken()) router.replace('/dashboard');
    } catch {
      // Stockage indisponible : on reste sur la page d'accueil.
    }
  }, [router]);
  return null;
}
