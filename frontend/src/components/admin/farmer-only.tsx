'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { usePlatformAdmin } from '@/lib/platform-admin';

/** L'app de l'éleveur : la propriétaire de l'app est renvoyée vers son espace. */
export function FarmerOnly({ children }: { children: ReactNode }) {
  const admin = usePlatformAdmin();
  const router = useRouter();
  useEffect(() => {
    if (admin) router.replace('/admin');
  }, [admin, router]);
  if (admin !== false) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}
