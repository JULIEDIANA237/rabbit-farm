
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Baby,
  Boxes,
  CalendarHeart,
  CircleDollarSign,
  ClipboardList,
  HeartPulse,
  Home,
  Rabbit,
  Settings,
  Sprout,
  Syringe,
  Users,
  X,
} from 'lucide-react';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navigation = [
  {
    label: 'Vue générale',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Lapins',
    href: '/rabbits',
    icon: Rabbit,
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
    label: 'Ventes',
    href: '/sales',
    icon: CircleDollarSign,
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
    label: 'Statistiques',
    href: '/statistics',
    icon: BarChart3,
  },
];

export function Sidebar({
  open = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

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
          lg:static lg:z-auto lg:translate-x-0
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
                Gestion d'élevage
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
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

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
        </nav>

        <div className="border-t border-slate-100 p-4">
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

