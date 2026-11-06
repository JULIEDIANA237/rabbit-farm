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

function Branch({ node, depth, role }: { node?: PedigreeNode | null; depth: number; role: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-28 shrink-0">
        <NodeBox node={node} role={role} />
      </div>
      {depth > 1 && (
        <div className="flex flex-col gap-2 border-l border-slate-200 pl-2">
          <Branch node={node?.father} depth={depth - 1} role="Père" />
          <Branch node={node?.mother} depth={depth - 1} role="Mère" />
        </div>
      )}
    </div>
  );
}

export function PedigreeTree({ rabbitId, generations = 3 }: { rabbitId: string; generations?: number }) {
  const { data, loading, error } = useQuery<{ rabbitPedigree: PedigreeNode }>(PEDIGREE, {
    variables: { rabbitId, generations },
  });
  if (loading && !data) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  if (!data) return null;
  return (
    <div className="overflow-x-auto pb-2">
      <Branch node={data.rabbitPedigree} depth={generations + 1} role="Lapin" />
    </div>
  );
}
