'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, Lock } from 'lucide-react';

import { days, useSubscription } from '@/lib/subscription';

/** Bandeau d'essai (« Il te reste X jours ») ou de lecture seule, en haut de chaque page. */
export function SubscriptionBanner() {
  const { subscription: s } = useSubscription();
  const path = usePathname();
  if (!s || path === '/subscription') return null;

  if (s.status === 'EXPIRED') {
    return (
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        <Lock size={18} className="shrink-0" />
        <p className="flex-1">
          {s.pendingPayment
            ? 'Ton paiement est en cours de vérification. L’app repassera en mode complet dès sa confirmation.'
            : 'Ton essai gratuit est terminé : tu peux consulter tes données, mais plus en ajouter.'}
        </p>
        {!s.pendingPayment && (
          <Link href="/subscription" className="rounded-xl bg-red-600 px-3 py-2 font-medium text-white hover:bg-red-700">
            M’abonner
          </Link>
        )}
      </div>
    );
  }

  if (s.status === 'TRIAL') {
    const urgent = s.daysLeft <= 7;
    return (
      <div
        className={`mb-4 flex flex-wrap items-center gap-3 rounded-2xl border p-3 text-sm ${
          urgent ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-100 bg-emerald-50/60 text-emerald-900'
        }`}
      >
        <Clock size={16} className="shrink-0" />
        <p className="flex-1">
          Essai gratuit : il te reste <strong>{days(s.daysLeft)}</strong>.
        </p>
        <Link href="/subscription" className="font-medium underline-offset-2 hover:underline">
          Voir les offres
        </Link>
      </div>
    );
  }
  return null;
}
