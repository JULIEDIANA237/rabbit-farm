'use client';

import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/kit';
import { RowActions, useDeleteAction } from '@/components/ui/row-actions';

const DELETE_RABBIT = gql`
  mutation DeleteRabbit($id: ID!) { deleteRabbit(id: $id) }
`;
const DELETION_IMPACT = gql`
  query RabbitDeletionImpact($id: ID!) { rabbitDeletionImpact(id: $id) }
`;
const CANCEL_EXIT = gql`
  mutation CancelRabbitExit($rabbitId: ID!) { cancelRabbitExit(rabbitId: $rabbitId) { id status } }
`;

const EXIT_STATUSES = ['DEAD', 'CULLED', 'TRANSFERRED'];

/**
 * Corrections d'une fiche : annuler une sortie saisie par erreur,
 * ou supprimer un lapin avec tout ce qui lui est lié.
 */
export function RabbitCorrections({
  rabbit,
}: {
  rabbit: { id: string; code: string; status?: string | null; birthLitterId?: string | null; purpose?: string | null };
}) {
  const router = useRouter();
  const client = useApolloClient();
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
        onDelete={async () => {
          let impact: string[] = [];
          try {
            const { data } = await client.query<{ rabbitDeletionImpact: string[] }>({
              query: DELETION_IMPACT,
              variables: { id: rabbit.id },
              fetchPolicy: 'network-only',
            });
            impact = data?.rabbitDeletionImpact ?? [];
          } catch {
            // L'aperçu est un confort : la suppression reste possible.
          }
          remove.ask(rabbit.id, `le lapin ${rabbit.code}`, deletionWarning(impact));
        }}
      />
      {remove.dialog}
    </>
  );
}

/** Ce qui part avec le lapin, et ce qui reste. */
function deletionWarning(impact: string[]) {
  const lines = [
    impact.length
      ? `Seront aussi effacés : ${impact.filter((i) => i !== 'des descendants' && i !== 'une vente').join(', ') || 'son historique'}, ainsi que ses cages, tâches et photos.`
      : 'Ses cages, tâches et photos seront aussi effacées.',
  ];
  if (impact.includes('des accouplements ou portées')) {
    lines.push('Pour une femelle, ses mises bas et ses portées sont effacées ; pour un mâle, ses saillies.');
  }
  if (impact.includes('des descendants')) lines.push('Ses petits restent dans l’élevage, sans lien vers ce parent.');
  if (impact.includes('une vente')) lines.push('Ses ventes restent enregistrées avec leur montant.');
  lines.push('Pour un lapin mort, vendu ou réformé, enregistre plutôt sa sortie : son historique est gardé.');
  return lines.join(' ');
}
