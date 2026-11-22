'use client';

import { PageHeader } from '@/components/ui/kit';
import { PriceSettings } from '@/components/admin/admin-sections';
import { NotificationsCard } from '@/components/settings/notifications-card';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Propriétaire" title="Prix et essai" description="Prix des abonnements, durée d’essai et consignes de paiement." />
      <PriceSettings />
      <div>
        <NotificationsCard />
        <p className="mt-2 text-xs text-slate-500">Active-les sur ton téléphone pour recevoir aussi le point du matin de l’agent.</p>
      </div>
    </div>
  );
}
