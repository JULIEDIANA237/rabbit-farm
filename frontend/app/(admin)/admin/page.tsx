'use client';

import { PageHeader } from '@/components/ui/kit';
import { PlatformKpis, RevenueStats } from '@/components/admin/admin-sections';
import { AgentBriefCard } from '@/components/admin/agent';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Propriétaire" title="Vue d’ensemble" description="Utilisateurs, élevages et abonnements de toute l’application." />
      <AgentBriefCard />
      <PlatformKpis />
      <h2 className="text-lg font-semibold text-slate-900">Abonnements</h2>
      <RevenueStats />
    </div>
  );
}
