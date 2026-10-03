
'use client';

import { Bell, Menu, Search } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="hidden md:block">
          <p className="text-sm text-slate-500">
            Bienvenue dans votre élevage
          </p>
          <h1 className="text-lg font-semibold text-slate-900">
            Rabbit Farm
          </h1>
        </div>

        <div className="md:hidden">
          <p className="text-base font-bold text-slate-900">
            Rabbit Farm
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Rechercher"
          className="hidden rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 sm:block"
        >
          <Search size={20} />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          AD
        </div>
      </div>
    </header>
  );
}

