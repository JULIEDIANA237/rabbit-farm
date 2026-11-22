'use client';

import { PageHeader } from '@/components/ui/kit';
import { PlatformKpis, RevenueStats } from '@/components/admin/admin-sections';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Propriétaire" title="Vue d’ensemble" description="Utilisateurs, élevages et abonnements de toute l’application." />
      <PlatformKpis />
      <h2 className="text-lg font-semibold text-slate-900">Abonnements</h2>
      <RevenueStats />
    </div>
  );
}
