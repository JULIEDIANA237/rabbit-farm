'use client';

import Link from 'next/link';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { BarChart3, ChevronRight } from 'lucide-react';

import { Card } from '@/components/ui/kit';

const IS_PLATFORM_ADMIN = gql`
  query IsPlatformAdmin { isPlatformAdmin }
`;

/** Lien vers les chiffres de l'app, visible seulement pour la propriétaire. */
export function AdminLinkCard() {
  const { data } = useQuery<{ isPlatformAdmin: boolean }>(IS_PLATFORM_ADMIN);
  if (!data?.isPlatformAdmin) return null;
  return (
    <Card title="Propriétaire de l’application">
      <Link href="/admin" className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-100">
        <span className="flex items-center gap-2"><BarChart3 size={18} /> Nombre d’utilisateurs, élevages et notes</span>
        <ChevronRight size={16} />
      </Link>
    </Card>
  );
}
