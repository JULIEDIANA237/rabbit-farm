'use client';

import Link from 'next/link';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import { ErrorBox, Loading } from '@/components/ui/kit';
import { SEX, label } from '@/lib/labels';

const NODE = `id code sex status breedName birthDate`;

export const PEDIGREE = gql`
  query Pedigree($rabbitId: ID!, $generations: Int!) {
    rabbitPedigree(rabbitId: $rabbitId, generations: $generations) {
      ${NODE}
      father { ${NODE} father { ${NODE} father { ${NODE} } mother { ${NODE} } } mother { ${NODE} father { ${NODE} } mother { ${NODE} } } }
      mother { ${NODE} father { ${NODE} father { ${NODE} } mother { ${NODE} } } mother { ${NODE} father { ${NODE} } mother { ${NODE} } } }
    }
  }
`;

export interface PedigreeNode {
  id: string;
  code: string;
  sex: string;
  status: string;
  breedName?: string | null;
  father?: PedigreeNode | null;
  mother?: PedigreeNode | null;
}

function NodeBox({ node, role }: { node?: PedigreeNode | null; role: string }) {
  if (!node) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-2 text-center text-xs text-slate-400">
        {role} inconnu(e)
      </div>
    );
  }
  return (
    <Link
      href={`/rabbits/${node.id}`}
      className={`block rounded-xl border p-2 text-center text-xs shadow-sm ${
        node.sex === 'MALE' ? 'border-blue-200 bg-blue-50' : node.sex === 'FEMALE' ? 'border-pink-200 bg-pink-50' : 'border-slate-200 bg-white'
      }`}
    >
      <p className="font-semibold text-slate-900">{node.code}</p>
      <p className="text-slate-500">{node.breedName ?? label(SEX, node.sex)}</p>
    </Link>
  );
}

const LEVEL_TITLES = ['Lapin', 'Parents', 'Grands-parents', 'Arrière-grands-parents'];

/** Les ascendants par génération : [lapin], [père, mère], [4 grands-parents]… */
function levels(root: PedigreeNode, generations: number) {
  const result: Array<Array<PedigreeNode | null>> = [[root]];
  for (let g = 1; g <= generations; g += 1) {
    result.push(result[g - 1].flatMap((node) => [node?.father ?? null, node?.mother ?? null]));
  }
  // Les générations entièrement inconnues ne sont pas affichées.
  while (result.length > 1 && result[result.length - 1].every((node) => !node)) result.pop();
  return result;
}

/**
 * Arbre généalogique lu de haut en bas : les ancêtres les plus anciens
 * en haut, puis le père et la mère, et enfin le lapin.
 */
export function PedigreeTree({ rabbitId, generations = 3 }: { rabbitId: string; generations?: number }) {
  const { data, loading, error } = useQuery<{ rabbitPedigree: PedigreeNode }>(PEDIGREE, {
    variables: { rabbitId, generations },
  });
  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  if (!data) return null;

  const rows = levels(data.rabbitPedigree, generations);
  const columns = 2 ** (rows.length - 1);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="space-y-3" style={{ minWidth: `${Math.min(columns, 8) * 7}rem` }}>
        {[...rows].reverse().map((row, reversedIndex) => {
          const level = rows.length - 1 - reversedIndex;
          return (
            <div key={level}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{LEVEL_TITLES[level] ?? `Génération ${level}`}</p>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                {row.map((node, index) => (
                  <div key={index} style={{ gridColumn: `span ${columns / row.length}` }} className="flex justify-center">
                    <div className={level === 0 ? 'w-40' : 'w-full max-w-[10rem]'}>
                      <NodeBox node={node} role={level === 0 ? 'Lapin' : index % 2 === 0 ? 'Père' : 'Mère'} />
                    </div>
                  </div>
                ))}
              </div>
              {level > 0 && <div className="mx-auto mt-2 h-3 w-px bg-slate-300" aria-hidden />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
