'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

import { PageHeader, Tabs } from '@/components/ui/kit';
import { CompanionHistory, CompanionList, CompanionSettings, TourNowButton } from '@/components/companion/companion';
import { NotificationsCard } from '@/components/settings/notifications-card';
import { useUrlCommand } from '@/hooks/use-form';

type Tab = 'pending' | 'history' | 'settings';

export default function QuestionsPage() {
  const [tab, setTab] = useState<Tab>('pending');
  // « ?tab=settings » : lien direct vers les réglages (parcours de démarrage).
  useUrlCommand((params) => {
    const wanted = params.get('tab');
    if (wanted !== 'settings' && wanted !== 'history') return false;
    setTab(wanted);
    return true;
  });
  return (
    <div>
      <PageHeader
        eyebrow="Mon assistant"
        title="Questions de l’assistant"
        description="Ton bras droit fait le tour de la ferme à 6 h, 13 h et 18 h. Il te pose une question quand un lapin mérite un suivi."
        actions={
          <>
            <Link href="/advice" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
              <BookOpen size={16} /> Fiches conseils
            </Link>
            <TourNowButton />
          </>
        }
      />
      <Tabs<Tab>
        tabs={[
          { value: 'pending', label: 'À répondre' },
          { value: 'history', label: 'Déjà répondu' },
          { value: 'settings', label: 'Réglages' },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'pending' && <CompanionList />}
      {tab === 'history' && <CompanionHistory />}
      {tab === 'settings' && (
        <div className="space-y-4">
          <CompanionSettings />
          <NotificationsCard />
        </div>
      )}
    </div>
  );
}
