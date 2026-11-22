'use client';

import { PageHeader } from '@/components/ui/kit';
import { PriceSettings } from '@/components/admin/admin-sections';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Propriétaire" title="Prix et essai" description="Prix des abonnements, durée d’essai et consignes de paiement." />
      <PriceSettings />
    </div>
  );
}
