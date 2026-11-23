'use client';

import { clearOfflineCache } from '@/lib/offline-cache';
import { resetOfflineRestore } from '@/components/layout/offline-cache-gate';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useApolloClient } from '@apollo/client/react';
import { Bell, CircleHelp, LogOut, Menu, RefreshCw } from 'lucide-react';
import { SHOW_GUIDE_EVENT } from '@/components/onboarding/module-guide';
import { useState } from 'react';

import { ME_QUERY, type Me } from '@/graphql/auth/mutations';
import { OPEN_TASKS_QUERY } from '@/graphql/field-queries';
import { useAuthStore } from '@/stores/auth-store';
import { FARM_ROLE, label } from '@/lib/labels';
import { reloadApp } from '@/components/pwa/update-banner';
import { ThemeToggle } from '@/components/theme/theme-toggle';

interface HeaderProps {
  onMenuClick: () => void;
}


export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const client = useApolloClient();
  const logout = useAuthStore((s) => s.logout);
  const [reloading, setReloading] = useState(false);

  const { data } = useQuery<{ me: Me }>(ME_QUERY);
  const { data: tasks } = useQuery<{ tasks: Array<{ id: string; dueDate: string }> }>(OPEN_TASKS_QUERY, {
    pollInterval: 5 * 60_000,
  });

  const me = data?.me;
  const initials = me ? `${me.firstName[0] ?? ''}${me.lastName[0] ?? ''}`.toUpperCase() : '··';
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const dueCount = (tasks?.tasks ?? []).filter((t) => new Date(t.dueDate) <= endOfToday).length;

  async function handleLogout() {
    await clearOfflineCache();
    resetOfflineRestore();
    logout();
    await client.clearStore();
    router.replace('/login');
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-slate-200 bg-white/95 px-3 backdrop-blur sm:px-4 md:h-20 md:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="hidden text-sm text-slate-500 md:block">
            {me ? `Bonjour ${me.firstName}` : 'Bienvenue dans votre élevage'}
          </p>
          <h1 className="truncate text-base font-semibold text-slate-900 md:text-lg">
            {me?.farm.name ?? 'Rabbit Farm'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Sur téléphone (application installée), pas de bouton « recharger » du navigateur. */}
        <button
          type="button"
          onClick={() => {
            setReloading(true);
            void reloadApp();
          }}
          aria-label="Actualiser l’application"
          className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <RefreshCw size={20} className={reloading ? 'animate-spin' : ''} />
        </button>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(SHOW_GUIDE_EVENT))}
          aria-label="Aide de la page"
          title="Aide de la page"
          className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
        >
          <CircleHelp size={20} />
        </button>
        <Link
          href="/tasks"
          aria-label={`${dueCount} tâche(s) à faire aujourd'hui`}
          className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
        >
          <Bell size={20} />
          {dueCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {dueCount}
            </span>
          )}
        </Link>

        <Link
          href="/settings"
          title={me ? `${me.firstName} ${me.lastName} · ${label(FARM_ROLE, me.role)}` : undefined}
          className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700"
        >
          {initials}
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Se déconnecter"
          className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
