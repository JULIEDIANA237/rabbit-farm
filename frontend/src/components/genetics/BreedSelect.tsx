'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

import { BREED_OPTIONS } from '@/graphql/options';
import { missingSuggestions } from '@/lib/breeds';

const CREATE_BREED = gql`
  mutation CreateBreedFromSelect($input: CreateBreedInput!) { createBreed(input: $input) { id name } }
`;

/**
 * Choix de la race : les races de la ferme, puis les races locales
 * et courantes proposées (ajoutées à la ferme quand on les choisit).
 */
export function BreedSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (breedId: string) => void;
  className?: string;
}) {
  const { data } = useQuery<{ breeds: Array<{ id: string; name: string }> }>(BREED_OPTIONS);
  const [createBreed] = useMutation<{ createBreed: { id: string } }>(CREATE_BREED, {
    refetchQueries: ['BreedOptions', 'Genetics'],
    awaitRefetchQueries: true,
  });
  const [adding, setAdding] = useState(false);
  const breeds = data?.breeds ?? [];
  const suggestions = missingSuggestions(breeds.map((b) => b.name));

  async function handle(next: string) {
    if (!next.startsWith('new:')) {
      onChange(next);
      return;
    }
    setAdding(true);
    try {
      const { data: created } = await createBreed({ variables: { input: { name: next.slice(4) } } });
      if (created) onChange(created.createBreed.id);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Race non ajoutée');
    } finally {
      setAdding(false);
    }
  }

  return (
    <select className={className} value={value} disabled={adding} onChange={(e) => void handle(e.target.value)}>
      <option value="">{adding ? 'Ajout…' : 'Je ne sais pas'}</option>
      {breeds.length > 0 && (
        <optgroup label="Mes races">
          {breeds.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </optgroup>
      )}
      {suggestions.map((g) => (
        <optgroup key={g.group} label={g.group}>
          {g.names.map((name) => (
            <option key={name} value={`new:${name}`}>
              {name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
