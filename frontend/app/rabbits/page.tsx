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

export default function RabbitsPage() {
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
            Lapins
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {total} lapin{total > 1 ? 's' : ''}
          </p>
        </div>

        <Link
          href="/rabbits/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus size={18} />

          <span className="hidden sm:inline">
            Nouveau lapin
          </span>
        </Link>
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
            placeholder="Rechercher un lapin..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Impossible de charger les lapins.
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