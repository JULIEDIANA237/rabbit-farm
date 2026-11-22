
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import {
  BarChart3,
  Baby,
  Boxes,
  CalendarHeart,
  CircleDollarSign,
  ClipboardList,
  Home,
  PawPrint,
  Rabbit,
  Settings,
  Sprout,
  Syringe,
  Users,
  X,
  ListChecks,
  Warehouse,
  Stethoscope,
  HandCoins,
  Wrench,
  CreditCard,
  MessageCircleQuestion,
  BookOpen,
  Camera,
} from 'lucide-react';

import { readMenuChoice, saveMenuChoice, subscribeMenuChoice, unlockedInSimpleMenu, useFarmSetup } from '@/lib/setup';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navigation: Array<{ label: string; href: string; icon: typeof Home; onlyWhileSettingUp?: boolean }> = [
  {
    label: 'Vue générale',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Mon assistant',
    href: '/questions',
    icon: MessageCircleQuestion,
  },
  {
    label: 'Fiches conseils',
    href: '/advice',
    icon: BookOpen,
  },

  {
    label: 'Lapins',
    href: '/rabbits',
    icon: Rabbit,
  },
  {
    label: 'Photo du cahier',
    href: '/import',
    icon: Camera,
    onlyWhileSettingUp: true,
  },
  {
    label: 'Lapereaux',
    href: '/kits',
    icon: PawPrint,
  },
  {
    label: 'Génétique',
    href: '/genetics',
    icon: Users,
  },
  {
    label: 'Reproduction',
    href: '/breeding',
    icon: CalendarHeart,
  },
  {
    label: 'Naissances',
    href: '/births',
    icon: Baby,
  },
  {
    label: 'Sevrage',
    href: '/weaning',
    icon: Sprout,
  },
  {
    label: 'Engraissement',
    href: '/fattening',
    icon: Rabbit,
  },
  {
    label: 'Santé',
    href: '/health',
    icon: Syringe,
  },
  {
    label: 'Soins',
    href: '/care',
    icon: Stethoscope,
  },
  {
    label: 'Ventes',
    href: '/sales',
    icon: CircleDollarSign,
  },
  {
    label: 'Prêts pour la vente',
    href: '/sales/ready',
    icon: HandCoins,
  },
  {
    label: 'Opérations',
    href: '/operations',
    icon: ClipboardList,
  },
  {
    label: 'Stock',
    href: '/operations/inventory',
    icon: Boxes,
  },
  {
    label: 'Tâches',
    href: '/tasks',
    icon: ListChecks,
  },
  {
    label: 'Cages',
    href: '/farm',
    icon: Warehouse,
  },
  {
    label: 'Statistiques',
    href: '/statistics',
    icon: BarChart3,
  },
  {
    label: 'Boîte à outils',
    href: '/tools',
    icon: Wrench,
  },
];

export function Sidebar({
  open = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { setup } = useFarmSetup();
  const choice = useSyncExternalStore(subscribeMenuChoice, readMenuChoice, () => null);
  // Menu simplifié : proposé aux fermes qui démarrent, l'éleveur peut toujours tout afficher.
  const simple = Boolean(setup) && (choice === 'simple' || (choice !== 'full' && Boolean(setup?.beginner)));
  const items = navigation.filter((item) => {
    if (item.onlyWhileSettingUp && !(setup && setup.percent < 100)) return false;
    return !simple || !setup || unlockedInSimpleMenu(item.href, setup);
  });
  const hidden = navigation.length - items.length;

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-300
          lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Rabbit size={25} strokeWidth={2.2} />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                Rabbit Farm
              </p>
              <p className="text-xs text-slate-500">
                Gestion d&apos;élevage
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </p>

          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (pathname.startsWith(`${item.href}/`) &&
                  !navigation.some((other) => other.href !== item.href && other.href.startsWith(item.href) && pathname.startsWith(other.href)));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 rounded-xl px-3 py-3
                    text-sm font-medium transition
                    ${
                      active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon size={19} />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {simple && hidden > 0 && (
            <div className="mt-4 rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-500">
              <p>Menu simplifié : les autres écrans apparaissent au fil de ton élevage.</p>
              <button type="button" onClick={() => saveMenuChoice('full')} className="mt-1 font-semibold text-emerald-700 hover:underline">
                Afficher tout le menu
              </button>
            </div>
          )}
          {!simple && choice === 'full' && setup && setup.percent < 100 && (
            <button type="button" onClick={() => saveMenuChoice('simple')} className="mt-4 px-3 text-xs font-semibold text-slate-500 hover:text-emerald-700 hover:underline">
              Revenir au menu simplifié
            </button>
          )}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <Link
            href="/subscription"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <CreditCard size={19} />
            <span>Abonnement</span>
          </Link>
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Settings size={19} />
            <span>Paramètres</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

