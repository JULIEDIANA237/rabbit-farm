import Link from 'next/link';

import type { Rabbit } from '@/types/rabbit';
import { RabbitList } from './RabbitList';

/** Portée d'un lapereau tirée de son code : L003-01 → L003. */
const litterOf = (code: string) => (/^(L\d+)-/i.exec(code)?.[1] ?? null);

/**
 * Lapereaux rangés par mère : une case par mère avec ses petits,
 * pour distinguer d'un coup d'œil les portées (L003-01 avec F02…).
 */
export function KitsByMother({ rabbits }: { rabbits: Rabbit[] }) {
  const groups: Array<{ key: string; motherId?: string | null; motherCode?: string | null; kits: Rabbit[] }> = [];
  for (const rabbit of rabbits) {
    const key = rabbit.motherId ?? 'sans-mere';
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, motherId: rabbit.motherId, motherCode: rabbit.motherCode, kits: [] };
      groups.push(group);
    }
    group.kits.push(rabbit);
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => {
        const litters = [...new Set(group.kits.map((k) => litterOf(k.code)).filter(Boolean))];
        return (
          <section key={group.key} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <header className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {group.motherId ? (
                <Link href={`/rabbits/${group.motherId}`} className="text-base font-bold text-slate-900 hover:text-emerald-700">
                  Mère {group.motherCode ?? '?'}
                </Link>
              ) : (
                <span className="text-base font-bold text-slate-900">Mère inconnue</span>
              )}
              <span className="text-sm text-slate-500">
                {group.kits.length} lapereau{group.kits.length > 1 ? 'x' : ''}
                {litters.length > 0 && ` · portée${litters.length > 1 ? 's' : ''} ${litters.join(', ')}`}
              </span>
            </header>
            <RabbitList rabbits={group.kits} />
          </section>
        );
      })}
    </div>
  );
}
