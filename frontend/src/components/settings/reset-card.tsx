'use client';

import { useState } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { RotateCcw } from 'lucide-react';

import { Button, Card, ErrorBox, Input, Modal } from '@/components/ui/kit';

type Count = { label: string; count: number };

const RESET_PREVIEW = gql`
  query FarmResetPreview { farmResetPreview { label count } }
`;
const RESET_FARM = gql`
  mutation ResetFarmData($confirmation: String!) { resetFarmData(confirmation: $confirmation) { label count } }
`;

const KEPT = ['Lapins adultes, mâles et femelles reproducteurs', 'Tâches', 'Stock', 'Dépenses', 'Bâtiments, cages et races'];
const WORD = 'RÉINITIALISER';
const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toUpperCase();

/** Bouton « Réinitialiser » : remet l'élevage à zéro (administrateur seulement). */
export function ResetCard() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState<Count[] | null>(null);
  const [loadPreview, preview] = useLazyQuery<{ farmResetPreview: Count[] }>(RESET_PREVIEW, { fetchPolicy: 'network-only' });
  const [reset, mutation] = useMutation<{ resetFarmData: Count[] }>(RESET_FARM);

  const counts = preview.data?.farmResetPreview ?? [];
  const total = counts.reduce((s, c) => s + c.count, 0);

  const start = () => {
    setTyped('');
    setDone(null);
    setOpen(true);
    void loadPreview();
  };

  const confirm = async () => {
    const res = await reset({ variables: { confirmation: typed } });
    // Toutes les pages relisent leurs données après la remise à zéro.
    await mutation.client.resetStore();
    setDone(res.data?.resetFarmData ?? []);
  };

  return (
    <Card title="Réinitialiser l’élevage" subtitle="Remet tous les enregistrements à zéro pour repartir proprement.">
      <p className="text-sm text-slate-600">
        Restent : {KEPT.join(', ').toLowerCase()}. Tout le reste est effacé définitivement.
      </p>
      <Button variant="danger" className="mt-4" onClick={start}>
        <RotateCcw size={16} /> Réinitialiser
      </Button>

      <Modal
        open={open}
        title={done ? 'Élevage réinitialisé' : 'Tout remettre à zéro ?'}
        onClose={() => setOpen(false)}
        footer={
          done ? (
            <Button onClick={() => setOpen(false)}>Fermer</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Annuler</Button>
              <Button
                variant="danger"
                loading={mutation.loading}
                disabled={plain(typed) !== plain(WORD) || preview.loading}
                onClick={() => confirm().catch(() => {})}
              >
                Tout effacer
              </Button>
            </>
          )
        }
      >
        {done ? (
          <p className="text-sm text-slate-700">
            C’est fait : {done.reduce((s, c) => s + c.count, 0)} enregistrements effacés. Tes lapins, tâches, stock et dépenses sont toujours là.
          </p>
        ) : (
          <div className="space-y-4 text-sm">
            <ErrorBox error={preview.error ?? mutation.error} />
            <div>
              <p className="font-semibold text-red-700">Sera effacé{preview.loading ? '…' : ` (${total})`}</p>
              <ul className="mt-1 space-y-0.5 text-slate-700">
                {counts.map((c) => (
                  <li key={c.label} className="flex justify-between gap-3">
                    <span>{c.label}</span>
                    <span className="font-medium tabular-nums">{c.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-emerald-700">Sera gardé</p>
              <ul className="mt-1 list-disc pl-5 text-slate-700">
                {KEPT.map((k) => <li key={k}>{k}</li>)}
              </ul>
            </div>
            <label className="block">
              <span className="font-medium text-slate-800">Pour confirmer, tape {WORD}</span>
              <Input className="mt-1" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={WORD} autoComplete="off" />
            </label>
            <p className="text-xs text-slate-500">Cette action ne peut pas être annulée. Pense à exporter tes données avant si tu veux les garder.</p>
          </div>
        )}
      </Modal>
    </Card>
  );
}
