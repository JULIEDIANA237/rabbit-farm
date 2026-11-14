'use client';

import { useCallback, useState, type ReactNode } from 'react';
import type { DocumentNode } from 'graphql';
import { useMutation } from '@apollo/client/react';
import { Pencil, Trash2 } from 'lucide-react';

import { Button, ErrorBox, Modal } from '@/components/ui/kit';

/** Boutons « Modifier » et « Supprimer » d'une ligne de liste. */
export function RowActions({
  onEdit,
  onDelete,
  children,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      {children}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label="Modifier"
          title="Modifier"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-emerald-700"
        >
          <Pencil size={16} />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Supprimer"
          title="Supprimer"
          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}

interface Pending {
  id: string;
  label: string;
  warning?: string;
}

/**
 * Suppression avec confirmation. La mutation reçoit `{ id }`.
 *
 *   const remove = useDeleteAction(DELETE_EXPENSE, { refetchQueries: ['Expenses'] });
 *   <RowActions onDelete={() => remove.ask(e.id, 'la dépense du 12/05')} />
 *   {remove.dialog}
 */
export function useDeleteAction(
  mutation: DocumentNode,
  options: { refetchQueries?: string[]; onDone?: () => void } = {},
) {
  const [pending, setPending] = useState<Pending | null>(null);
  const [run, { loading, error, reset }] = useMutation(mutation, {
    refetchQueries: options.refetchQueries,
    awaitRefetchQueries: true,
  });

  const ask = useCallback(
    (id: string, label: string, warning?: string) => {
      reset();
      setPending({ id, label, warning });
    },
    [reset],
  );
  const close = () => setPending(null);

  const dialog = (
    <Modal
      open={pending !== null}
      title="Confirmer la suppression"
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>Annuler</Button>
          <Button
            variant="danger"
            loading={loading}
            onClick={() =>
              pending &&
              run({ variables: { id: pending.id } })
                .then(() => {
                  close();
                  options.onDone?.();
                })
                .catch(() => undefined)
            }
          >
            Supprimer
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-700">
        Supprimer définitivement <strong>{pending?.label}</strong> ? Cette action ne peut pas être annulée.
      </p>
      {pending?.warning && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{pending.warning}</p>}
      <ErrorBox error={error} />
    </Modal>
  );

  return { ask, dialog };
}

