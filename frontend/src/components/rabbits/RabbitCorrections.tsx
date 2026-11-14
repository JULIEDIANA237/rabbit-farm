'use client';

import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/kit';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';

const DELETE_RABBIT = gql`
  mutation DeleteRabbit($id: ID!) { deleteRabbit(id: $id) }
`;
const CANCEL_EXIT = gql`
  mutation CancelRabbitExit($rabbitId: ID!) { cancelRabbitExit(rabbitId: $rabbitId) { id status } }
`;

const EXIT_STATUSES = ['DEAD', 'CULLED', 'TRANSFERRED'];

/**
 * Corrections d'une fiche : annuler une sortie saisie par erreur,
 * ou supprimer un lapin créé par erreur (sans historique).
 */
export function RabbitCorrections({
  rabbit,
}: {
  rabbit: { id: string; code: string; status?: string | null; birthLitterId?: string | null; purpose?: string | null };
}) {
  const router = useRouter();
  const isKit = Boolean(rabbit.birthLitterId) && rabbit.purpose === 'FATTENING';
  const remove = useDeleteAction(DELETE_RABBIT, {
    refetchQueries: ['Rabbits', 'RabbitsPaginated', 'RabbitOptions', 'Dashboard'],
    onDone: () => router.push(isKit ? '/kits' : '/rabbits'),
  });
  const [cancelExit, { loading }] = useMutation(CANCEL_EXIT, {
    refetchQueries: ['Rabbit', 'RabbitsPaginated', 'Dashboard', 'LitterDetail'],
  });

  return (
    <>
      {EXIT_STATUSES.includes(rabbit.status ?? '') && (
        <Button
          variant="secondary"
          loading={loading}
          onClick={() => {
            if (!window.confirm(`Annuler la sortie de ${rabbit.code} ? Il redeviendra actif.`)) return;
            cancelExit({ variables: { rabbitId: rabbit.id } }).catch((e: Error) => window.alert(e.message));
          }}
        >
          <RotateCcw size={16} /> Annuler la sortie
        </Button>
      )}
      <RowActions
        onDelete={() =>
          remove.ask(
            rabbit.id,
            `le lapin ${rabbit.code}`,
            'Réservé aux lapins créés par erreur. Un lapin qui a un historique (portées, soins, pesées, vente…) ne peut pas être supprimé : enregistre plutôt sa sortie.',
          )
        }
      />
      {remove.dialog}
    </>
  );
}
