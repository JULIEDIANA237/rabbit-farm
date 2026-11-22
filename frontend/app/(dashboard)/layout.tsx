import type { ReactNode } from 'react';

import { AppShell } from '@/components/layout/app-shell';
import { AuthGuard } from '@/components/auth/auth-guard';
import { FarmerOnly } from '@/components/admin/farmer-only';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <FarmerOnly>
        <AppShell>{children}</AppShell>
      </FarmerOnly>
    </AuthGuard>
  );
}
