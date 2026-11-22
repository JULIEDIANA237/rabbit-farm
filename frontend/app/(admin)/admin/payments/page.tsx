'use client';

import { PageHeader } from '@/components/ui/kit';
import { PendingPayments } from '@/components/admin/admin-sections';

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Propriétaire" title="Paiements" description="Paiements Mobile Money déclarés par les éleveurs." />
      <PendingPayments />
    </div>
  );
}
