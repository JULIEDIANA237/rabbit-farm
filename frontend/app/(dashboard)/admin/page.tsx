'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Activity, Home, Rabbit, Star, Users } from 'lucide-react';

import { Card, ErrorBox, Loading, PageHeader } from '@/components/ui/kit';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { SubscriptionAdmin } from '@/components/admin/subscription-admin';

const PLATFORM_STATS = gql`
  query PlatformStats {
    platformStats {
      farms users newUsers30d activeUsers7d activeUsers30d rabbits
      ratingsCount averageRating ratingDistribution
      latestRatings { id stars comment farmName updatedAt }
    }
  }
`;

type Stats = {
  farms: number;
  users: number;
  newUsers30d: number;
  activeUsers7d: number;
  activeUsers30d: number;
  rabbits: number;
  ratingsCount: number;
  averageRating?: number | null;
  ratingDistribution: number[];
  latestRatings: { id: string; stars: number; comment?: string | null; farmName?: string | null; updatedAt: string }[];
};

/** Chiffres de l'application, réservés à la propriétaire (PLATFORM_ADMIN_EMAILS). */
export default function AdminPage() {
  const { data, loading, error } = useQuery<{ platformStats: Stats }>(PLATFORM_STATS, { fetchPolicy: 'network-only' });
  const s = data?.platformStats;
  const max = Math.max(1, ...(s?.ratingDistribution ?? [0]));

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Propriétaire" title="Chiffres de l’application" description="Utilisateurs, élevages, notes et abonnements de toutes les fermes." />
      {loading && !s && <Loading />}
      <ErrorBox error={error} />
      {s && (
        <>
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard title="Utilisateurs" icon={<Users size={20} />} variant="success" value={s.users} description={`+${s.newUsers30d} en 30 jours`} />
            <KpiCard title="Actifs 7 jours" icon={<Activity size={20} />} value={s.activeUsers7d} description={`${s.activeUsers30d} sur 30 jours`} />
            <KpiCard title="Élevages" icon={<Home size={20} />} value={s.farms} />
            <KpiCard title="Lapins suivis" icon={<Rabbit size={20} />} value={s.rabbits} />
          </section>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Notes" subtitle={`${s.ratingsCount} note(s)${s.averageRating != null ? ` · moyenne ${s.averageRating.toFixed(1)} / 5` : ''}`}>
              <ul className="space-y-2">
                {[5, 4, 3, 2, 1].map((n) => (
                  <li key={n} className="flex items-center gap-2 text-sm">
                    <span className="flex w-10 items-center gap-0.5 text-slate-600">{n} <Star size={14} className="fill-amber-400 text-amber-400" /></span>
                    <div className="h-2.5 flex-1 rounded-full bg-slate-100">
                      <div className="h-2.5 rounded-full bg-amber-400" style={{ width: `${(s.ratingDistribution[n - 1] / max) * 100}%` }} />
                    </div>
                    <span className="w-8 text-right text-slate-700">{s.ratingDistribution[n - 1]}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Derniers avis">
              {s.latestRatings.length === 0 ? (
                <p className="text-sm text-slate-500">Aucun avis pour l’instant.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {s.latestRatings.map((r) => (
                    <li key={r.id} className="py-2 text-sm">
                      <span className="text-amber-500">{'★'.repeat(r.stars)}<span className="text-slate-300">{'★'.repeat(5 - r.stars)}</span></span>
                      <span className="ml-2 text-xs text-slate-500">{r.farmName ? `${r.farmName} · ` : ''}{new Date(r.updatedAt).toLocaleDateString('fr-FR')}</span>
                      {r.comment && <p className="mt-0.5 text-slate-700">{r.comment}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
          <h2 className="pt-2 text-lg font-semibold text-slate-900">Abonnements</h2>
          <SubscriptionAdmin />
        </>
      )}
    </div>
  );
}
