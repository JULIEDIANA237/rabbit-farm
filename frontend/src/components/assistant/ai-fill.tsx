'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Mic, MicOff, Sparkles } from 'lucide-react';

import { Button, ErrorBox } from '@/components/ui/kit';
import { useSpeech } from '@/hooks/use-speech';
import { draftFields, FILL_FORM, useAssistantEnabled, type AssistantDraft, type AssistantForm } from '@/lib/assistant';

const PLACEHOLDERS: Record<AssistantForm, string> = {
  BREEDING: 'Ex. « F12 saillie par M03 ce matin »',
  PALPATION: 'Ex. « Palpée aujourd’hui, elle est pleine »',
  BIRTH: 'Ex. « Elle a fait 8 petits dont 1 mort »',
  HEALTH: 'Ex. « B07 a la diarrhée depuis hier, je lui donne de l’Amprolium 2 jours »',
  EXPENSE: 'Ex. « 2 sacs de granulés à 15 000 payés par Orange Money »',
  TASK: 'Ex. « Penser à nettoyer la section A vendredi »',
  RABBIT_EXIT: 'Ex. « Mort ce matin, ventre gonflé »',
};

/**
 * « Remplir avec l'IA » : l'éleveur dicte ou écrit une phrase, l'IA
 * remplit les champs du formulaire. Rien n'est enregistré : il vérifie
 * puis clique sur Enregistrer comme d'habitude.
 */
export function AiFill({
  form,
  context,
  onFill,
}: {
  form: AssistantForm;
  /** Ce que le formulaire connaît déjà (ex. « Femelle : F12 »). */
  context?: string;
  onFill: (fields: Record<string, string>) => void;
}) {
  const enabled = useAssistantEnabled();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [result, setResult] = useState<AssistantDraft | null>(null);
  const [fill, { loading, error, reset }] = useMutation<{ fillFormWithAi: AssistantDraft }>(FILL_FORM);
  const speech = useSpeech((spoken) => setText((previous) => (previous ? `${previous} ${spoken}` : spoken)));

  if (!enabled) return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-100"
      >
        <Sparkles size={16} /> Remplir avec l&apos;IA
      </button>
    );
  }

  async function submit() {
    if (!text.trim()) return;
    reset();
    const response = await fill({ variables: { input: { form, text, context } } });
    const draft = response.data?.fillFormWithAi;
    if (!draft) return;
    setResult(draft);
    onFill(draftFields(draft));
  }

  const filled = result ? Object.keys(draftFields(result)).length : 0;

  return (
    <div className="space-y-2 rounded-2xl border border-violet-200 bg-violet-50/60 p-3">
      <p className="flex items-center gap-2 text-sm font-medium text-violet-800">
        <Sparkles size={16} /> Décris ce qui s&apos;est passé, l&apos;IA remplit le formulaire
      </p>
      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={2}
          placeholder={PLACEHOLDERS[form]}
          className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        {speech.supported && (
          <button
            type="button"
            onClick={speech.toggle}
            aria-label={speech.listening ? 'Arrêter la dictée' : 'Dicter'}
            className={`shrink-0 self-start rounded-xl p-2.5 ${speech.listening ? 'animate-pulse bg-red-600 text-white' : 'bg-white text-violet-700 ring-1 ring-violet-200'}`}
          >
            {speech.listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button loading={loading} disabled={!text.trim()} onClick={() => submit().catch(() => undefined)} className="bg-violet-600 hover:bg-violet-700">
          Remplir
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Fermer
        </Button>
        {result && !loading && (
          <span className="text-sm text-violet-800">
            {filled > 0 ? `${filled} champ${filled > 1 ? 's' : ''} rempli${filled > 1 ? 's' : ''} : vérifie avant d’enregistrer.` : 'Rien de précis trouvé dans la phrase.'}
          </span>
        )}
      </div>
      {result?.warnings.map((warning) => (
        <p key={warning} className="text-sm text-amber-700">
          ⚠️ {warning}
        </p>
      ))}
      <ErrorBox error={error} />
    </div>
  );
}
