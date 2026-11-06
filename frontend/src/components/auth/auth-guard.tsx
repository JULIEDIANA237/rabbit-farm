'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Loader2 } from 'lucide-react';

import { useAuthStore } from '@/stores/auth-store';
import { getAccessToken } from '@/lib/auth-storage';

function hasValidToken() {
  const token = getAccessToken();
  if (!token) return false;
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    return exp == null || exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
};

/**
 * Protège les pages de l'application : sans jeton valide,
 * l'utilisateur est renvoyé vers /login.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrate = useAuthStore((s) => s.hydrate);
  const logout = useAuthStore((s) => s.logout);

  // null côté serveur : on attend le client pour lire le jeton.
  const authenticated = useSyncExternalStore(subscribe, hasValidToken, () => null);

  useEffect(() => {
    if (authenticated === false) {
      logout();
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (authenticated) {
      hydrate();
    }
  }, [authenticated, hydrate, logout, pathname, router]);

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
