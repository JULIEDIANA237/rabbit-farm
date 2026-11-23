'use client';

import { PageHeader } from '@/components/ui/kit';
import { PaymentHistory, PendingPayments } from '@/components/admin/admin-sections';

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Propriétaire" title="Paiements" description="Paiements déclarés à vérifier et paiements encaissés." />
      <PendingPayments />
      <PaymentHistory />
    </div>
  );
}
