
'use client';

import { ReactNode, useState } from 'react';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNavigation } from './mobile-navigation';
import { AssistantPanel } from '@/components/assistant/assistant-panel';
import { OfflineBanner } from './offline-banner';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({
  children,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">
      <div className="flex min-h-screen">
        <div className="contents print:hidden">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="contents print:hidden">
            <Header
              onMenuClick={() => setSidebarOpen(true)}
            />

            <OfflineBanner />
          </div>

          <main className="flex-1 pb-20 lg:pb-0">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-5 md:px-6 md:py-7 xl:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      <div className="contents print:hidden">
        <MobileNavigation />
        <AssistantPanel />
      </div>
    </div>
  );
}

