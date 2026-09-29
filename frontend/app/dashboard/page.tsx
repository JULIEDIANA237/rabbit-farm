
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/stores/auth-store';

export default function DashboardPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const hydrate = useAuthStore((state) => state.hydrate);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Bienvenue {user?.email}
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="rounded-lg border px-4 py-2"
          >
            Déconnexion
          </button>
        </div>

        <div className="rounded-xl border p-6">
          <p>
            Ferme : {user?.farmId}
          </p>

          <p>
            Rôle : {user?.role}
          </p>
        </div>
      </div>
    </main>
  );
}

