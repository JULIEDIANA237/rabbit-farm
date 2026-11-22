'use client';

import { useState } from 'react';

import { PageHeader, Tabs } from '@/components/ui/kit';
import { AgentChat, AgentHistory, AgentPending } from '@/components/admin/agent';

type Tab = 'pending' | 'history' | 'ask';

export default function AdminAgentPage() {
  const [tab, setTab] = useState<Tab>('pending');
  return (
    <div className="space-y-2">
      <PageHeader
        eyebrow="Propriétaire"
        title="Agent"
        description="Chaque matin à 6 h, l’agent fait le tour de l’app et te propose des actions. Rien n’est envoyé ni modifié sans ta validation."
      />
      <Tabs<Tab>
        tabs={[
          { value: 'pending', label: 'À valider' },
          { value: 'history', label: 'Historique et journal' },
          { value: 'ask', label: 'Poser une question' },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'pending' && <AgentPending />}
      {tab === 'history' && <AgentHistory />}
      {tab === 'ask' && <AgentChat />}
    </div>
  );
}
