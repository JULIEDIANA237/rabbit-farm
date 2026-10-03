
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  BarChart3,
  Baby,
  ClipboardList,
  DollarSign,
  HeartPulse,
  Home,
  Package,
  Plus,
  Rabbit,
  Sprout,
  X,
} from 'lucide-react';

const mainItems = [
  {
    label: 'Accueil',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Lapins',
    href: '/rabbits',
    icon: Rabbit,
  },
];

const actionItems = [
  {
    label: 'Nouveau lapin',
    href: '/rabbits/new',
    icon: Rabbit,
  },
  {
    label: 'Nouvelle saillie',
    href: '/breeding/new',
    icon: HeartPulse,
  },
  {
    label: 'Nouvelle naissance',
    href: '/births/new',
    icon: Baby,
  },
  {
    label: 'Nouveau sevrage',
    href: '/weaning/new',
    icon: Sprout,
  },
  {
    label: 'Nouvelle vente',
    href: '/sales/new',
    icon: DollarSign,
  },
];

const menuItems = [
  {
    label: 'Reproduction',
    href: '/breeding',
    icon: HeartPulse,
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
    icon: HeartPulse,
  },
  {
    label: 'Ventes',
    href: '/sales',
    icon: DollarSign,
  },
  {
    label: 'Opérations',
    href: '/operations',
    icon: Package,
  },
  {
    label: 'Tâches',
    href: '/tasks',
    icon: ClipboardList,
  },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [actionsOpen, setActionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigationRef = useRef<HTMLElement>(null);

  /*
   * Ferme les menus lorsqu'on change de page.
   */
  useEffect(() => {
    setActionsOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  /*
   * Ferme les menus lorsqu'on clique à l'extérieur.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        navigationRef.current &&
        !navigationRef.current.contains(event.target as Node)
      ) {
        setActionsOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /*
   * Permet de fermer les menus avec Escape.
   */
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActionsOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function toggleActions() {
    setActionsOpen((current) => !current);
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((current) => !current);
    setActionsOpen(false);
  }

  function isActive(href: string) {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  function navigate(href: string) {
    setActionsOpen(false);
    setMenuOpen(false);
    router.push(href);
  }

  return (
    <nav
      ref={navigationRef}
      className="
        fixed inset-x-0 bottom-0 z-50
        border-t border-slate-200
        bg-white/95
        px-2
        pb-[env(safe-area-inset-bottom)]
        backdrop-blur
        lg:hidden
      "
    >
      {/* ========================================================= */}
      {/* MENU ACTIONS RAPIDES                                      */}
      {/* ========================================================= */}

      {actionsOpen && (
        <div
          className="
            absolute
            bottom-20
            left-1/2
            w-[calc(100%-2rem)]
            max-w-sm
            -translate-x-1/2
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-3
            shadow-2xl
          "
        >
          <div className="mb-2 flex items-center justify-between px-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Nouvelle action
              </p>

              <p className="text-xs text-slate-500">
                Ajouter rapidement une donnée
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActionsOpen(false)}
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-full
                text-slate-500
                hover:bg-slate-100
              "
              aria-label="Fermer les actions"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {actionItems.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.href}
                  type="button"
                  onClick={() => navigate(action.href)}
                  className="
                    flex
                    min-h-20
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-2
                    text-center
                    transition
                    hover:bg-emerald-50
                    hover:border-emerald-200
                    active:scale-[0.98]
                  "
                >
                  <span
                    className="
                      flex h-9 w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-100
                      text-emerald-700
                    "
                  >
                    <Icon size={18} />
                  </span>

                  <span className="text-xs font-medium text-slate-700">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MENU PRINCIPAL                                             */}
      {/* ========================================================= */}

      {menuOpen && (
        <div
          className="
            absolute
            bottom-20
            right-2
            w-[calc(100%-1rem)]
            max-w-sm
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-3
            shadow-2xl
          "
        >
          <div className="mb-2 px-2">
            <p className="text-sm font-semibold text-slate-900">
              Navigation
            </p>

            <p className="text-xs text-slate-500">
              Accéder aux modules de l'élevage
            </p>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => navigate(item.href)}
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    transition
                    ${
                      active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }
                  `}
                >
                  <Icon size={18} />

                  <span className="text-xs font-medium">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* BARRE DE NAVIGATION                                       */}
      {/* ========================================================= */}

      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {/* Accueil + Lapins */}

        {mainItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex
                min-w-16
                flex-col
                items-center
                gap-1
                text-[11px]
                font-medium
                ${
                  active
                    ? 'text-emerald-600'
                    : 'text-slate-500'
                }
              `}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}

        {/* ======================================================= */}
        {/* BOUTON +                                                 */}
        {/* ======================================================= */}

        <button
          type="button"
          aria-label={
            actionsOpen
              ? 'Fermer les actions'
              : 'Nouvelle action'
          }
          aria-expanded={actionsOpen}
          onClick={toggleActions}
          className={`
            flex
            h-12
            w-12
            -translate-y-3
            items-center
            justify-center
            rounded-full
            text-white
            shadow-lg
            transition
            active:scale-95
            ${
              actionsOpen
                ? 'rotate-45 bg-slate-800 shadow-slate-800/25'
                : 'bg-emerald-600 shadow-emerald-600/25'
            }
          `}
        >
          <Plus size={25} />
        </button>

        {/* ======================================================= */}
        {/* STATISTIQUES                                             */}
        {/* ======================================================= */}

        <Link
          href="/statistics"
          className={`
            flex
            min-w-16
            flex-col
            items-center
            gap-1
            text-[11px]
            font-medium
            ${
              isActive('/statistics')
                ? 'text-emerald-600'
                : 'text-slate-500'
            }
          `}
        >
          <BarChart3 size={20} />
          Stats
        </Link>

        {/* ======================================================= */}
        {/* MENU                                                     */}
        {/* ======================================================= */}

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          className={`
            flex
            min-w-16
            flex-col
            items-center
            gap-1
            text-[11px]
            font-medium
            ${
              menuOpen
                ? 'text-emerald-600'
                : 'text-slate-500'
            }
          `}
        >
          <span className="flex h-5 items-center text-lg leading-none">
            •••
          </span>

          Menu
        </button>
      </div>
    </nav>
  );
}

