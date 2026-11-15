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

import { useQuery } from '@apollo/client/react';

import { KitsByMother } from '@/components/rabbits/KitsByMother';
import { BREEDERS_PAST, needsPast, type BreederPast } from '@/components/rabbits/breeders-past';

const COPY = {
  ADULT: {
    title: 'Lapins',
    unit: 'lapin',
    plural: 'lapins',
    hint: 'Reproducteurs, futurs reproducteurs, réformes et lapins achetés.',
    search: 'Rechercher un lapin...',
    other: { href: '/kits', label: 'Voir les lapereaux' },
  },
  KIT: {
    title: 'Lapereaux',
    unit: 'lapereau',
    plural: 'lapereaux',
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
    // Lapereaux : une page assez grande pour garder chaque portée ensemble.
    category === 'KIT' ? 60 : 10,
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
            {total} {total > 1 ? copy.plural : copy.unit} ·{' '}
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

      {category === 'ADULT' && <PastReminder />}

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

      {category === 'KIT' && !loading && rabbits.length > 0 ? (
        <KitsByMother rabbits={rabbits} />
      ) : (
        <RabbitList
          rabbits={rabbits}
          loading={loading}
        />
      )}

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
/** Rappel : des reproducteurs n'ont pas encore leur passé renseigné. */
function PastReminder() {
  const { data } = useQuery<{ rabbitsPaginated: { items: BreederPast[] } }>(BREEDERS_PAST);
  const count = (data?.rabbitsPaginated.items ?? []).filter(needsPast).length;
  if (!count) return null;
  return (
    <Link
      href="/rabbits/past"
      className="mb-5 block rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 hover:bg-amber-100"
    >
      <strong>{count} reproducteur(s)</strong> sans passé renseigné (mises bas, pertes, cannibalisme, femelles couvertes…).{' '}
      <span className="font-semibold underline">Répondre aux questions</span>
    </Link>
  );
}
