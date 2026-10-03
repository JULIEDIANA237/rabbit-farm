
'use client';

import { ReactNode, useState } from 'react';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { MobileNavigation } from './mobile-navigation';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({
  children,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="flex-1 pb-20 lg:pb-0">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-5 md:px-6 md:py-7 xl:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      <MobileNavigation />
      
    </div>
  );
}

