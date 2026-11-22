'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';

import { getAccessToken } from '@/lib/auth-storage';

const subscribe = (onChange: () => void) => {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
};

/** « Se connecter », ou « Ouvrir mon élevage » si la personne est déjà connectée sur cet appareil. */
export function AccountLink({ className = '' }: { className?: string }) {
  const signedIn = useSyncExternalStore(subscribe, () => Boolean(getAccessToken()), () => false);
  return (
    <Link href={signedIn ? '/dashboard' : '/login'} className={className}>
      {signedIn ? 'Ouvrir mon élevage' : 'Se connecter'}
    </Link>
  );
}
