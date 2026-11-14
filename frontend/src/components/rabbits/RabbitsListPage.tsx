'use client';

import {
  useState,
} from 'react';

import Link from 'next/link';

import {
  Plus,
  Search,
} from 'lucide-react';

import {
  useRabbits,
} from '@/hooks/rabbits/useRabbits';

import {
  RabbitList,
} from '@/components/rabbits/RabbitList';

import {
  Pagination,
} from '@/components/ui/Pagination';

const COPY = {
  ADULT: {
    title: 'Lapins',
    unit: 'lapin',
    hint: 'Reproducteurs, futurs reproducteurs, réformes et lapins achetés.',
    search: 'Rechercher un lapin...',
    other: { href: '/kits', label: 'Voir les lapereaux' },
  },
  KIT: {
    title: 'Lapereaux',
    unit: 'lapereau',
    hint: 'Lapins nés à la ferme et destinés à l’engraissement. Choisis « futur reproducteur » sur une fiche pour le passer dans Lapins.',
    search: 'Rechercher un lapereau (ex. L002-03)...',
    other: { href: '/rabbits', label: 'Voir les lapins' },
  },
} as const;

/** Liste paginée des lapins (ADULT) ou des lapereaux (KIT). */
export function RabbitsListPage({ category }: { category: 'ADULT' | 'KIT' }) {
  const copy = COPY[category];
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const {
    rabbits,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
  } = useRabbits(
    page,
    10,
    search,
    category,
  );

  function handleSearch(
    value: string,
  ) {
    setSearch(value);
    setPage(1);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-28">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {copy.title}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {total} {copy.unit}{total > 1 ? 's' : ''} ·{' '}
            <Link href={copy.other.href} className="font-medium text-emerald-700 hover:underline">
              {copy.other.label}
            </Link>
          </p>
          <p className="mt-1 text-xs text-slate-400">{copy.hint}</p>
        </div>

        {category === 'ADULT' && (
        <Link
          href="/rabbits/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus size={18} />

          <span className="hidden sm:inline">
            Nouveau lapin
          </span>
        </Link>
        )}
      </header>

      <div className="mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) =>
              handleSearch(event.target.value)
            }
            placeholder={copy.search}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Impossible de charger la liste.
          <br />
          {error.message}
        </div>
      )}

      <RabbitList
        rabbits={rabbits}
        loading={loading}
      />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={setPage}
      />
    </main>
  );
}