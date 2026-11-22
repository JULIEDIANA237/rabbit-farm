'use client';

import { PageHeader } from '@/components/ui/kit';
import { FarmsList } from '@/components/admin/admin-sections';

export default function AdminFarmsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Propriétaire" title="Élevages" description="Tous les élevages inscrits et leur accès." />
      <FarmsList />
    </div>
  );
}
