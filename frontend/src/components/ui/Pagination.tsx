'use client';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3">
      <button
        type="button"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={18} />
        <span className="hidden sm:inline">
          Précédent
        </span>
      </button>

      <div className="text-sm font-medium text-slate-600">
        Page {page} / {totalPages}
      </div>

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="hidden sm:inline">
          Suivant
        </span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}