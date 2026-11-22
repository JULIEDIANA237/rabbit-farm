'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import { BarChart3, Bot, CreditCard, Home, Loader2, LogOut, Mail, Settings, Star } from 'lucide-react';

import { useAuthStore } from '@/stores/auth-store';
import { usePlatformAdmin } from '@/lib/platform-admin';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { useUnreadContactCount } from '@/components/admin/contact-messages';
import { usePendingAgentCount } from '@/components/admin/agent';

const NAV = [
  { href: '/admin', label: 'Vue d’ensemble', icon: BarChart3 },
  { href: '/admin/agent', label: 'Agent', icon: Bot },
  { href: '/admin/payments', label: 'Paiements', icon: CreditCard },
  { href: '/admin/farms', label: 'Élevages', icon: Home },
  { href: '/admin/reviews', label: 'Avis', icon: Star },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/settings', label: 'Prix et essai', icon: Settings },
];

/** Espace de la propriétaire de l'app, séparé de l'app des éleveurs. */
export function AdminShell({ children }: { children: ReactNode }) {
  const admin = usePlatformAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const client = useApolloClient();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (admin === false) router.replace('/dashboard');
  }, [admin, router]);

  async function handleLogout() {
    logout();
    await client.clearStore();
    router.replace('/login');
  }

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-semibold text-slate-900">Rabbit Farm</p>
            <p className="text-xs text-violet-700">Espace propriétaire</p>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              <LogOut size={18} /> <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${
                  active ? 'bg-violet-50 text-violet-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={16} /> {label}
                {href === '/admin/messages' && <UnreadBadge />}
                {href === '/admin/agent' && <AgentBadge />}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

/** Nombre de messages de contact à traiter (affiché seulement pour la propriétaire). */
function UnreadBadge() {
  const unread = useUnreadContactCount();
  if (unread === 0) return null;
  return <span className="rounded-full bg-violet-600 px-1.5 text-xs font-bold text-white">{unread}</span>;
}

/** Nombre de propositions de l'agent à valider. */
function AgentBadge() {
  const pending = usePendingAgentCount();
  if (pending === 0) return null;
  return <span className="rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">{pending}</span>;
}
