'use client';

import { PageHeader } from '@/components/ui/kit';
import { Reviews } from '@/components/admin/admin-sections';

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Propriétaire" title="Avis" description="Notes et commentaires laissés par les utilisateurs." />
      <Reviews />
    </div>
  );
}
