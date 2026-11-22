'use client';

import { PageHeader } from '@/components/ui/kit';
import { ContactMessages } from '@/components/admin/contact-messages';

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Propriétaire" title="Messages" description="Ce que les visiteurs t’écrivent depuis la zone contact de la page d’accueil." />
      <ContactMessages />
    </div>
  );
}
