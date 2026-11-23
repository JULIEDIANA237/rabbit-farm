import type { ReactNode } from 'react';

import { AppShell } from '@/components/layout/app-shell';
import { AuthGuard } from '@/components/auth/auth-guard';
import { FarmerOnly } from '@/components/admin/farmer-only';
import { OfflineCacheGate } from '@/components/layout/offline-cache-gate';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <OfflineCacheGate>
        <FarmerOnly>
          <AppShell>{children}</AppShell>
        </FarmerOnly>
      </OfflineCacheGate>
    </AuthGuard>
  );
}
