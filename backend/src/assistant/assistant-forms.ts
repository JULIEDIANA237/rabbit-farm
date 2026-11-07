import { z } from 'zod';

/**
 * Formulaires que l'IA sait pré-remplir.
 *
 * Chaque définition décrit :
 * - le schéma que le modèle remplit (codes lisibles, jamais d'identifiants) ;
 * - la conversion vers les champs du formulaire du frontend ;
 * - la page où l'utilisateur vérifie puis valide.
 *
 * L'IA ne crée jamais rien elle-même : elle prépare un brouillon que
 * l'utilisateur relit et enregistre avec le formulaire habituel.
 */

export const ASSISTANT_FORMS = [
  'BREEDING',
  'PALPATION',
  'BIRTH',
  'HEALTH',
  'EXPENSE',
  'TASK',
  'RABBIT_EXIT',
] as const;

export type AssistantForm = (typeof ASSISTANT_FORMS)[number];

const date = (what: string) =>
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .describe(`${what} au format AAAA-MM-JJ`)
    .optional();
const text = (what: string) => z.string().describe(what).optional();
const count = (what: string) => z.number().int().min(0).max(30).describe(what).optional();
const code = (what: string) =>
  z.string().describe(`Code du lapin ${what} tel qu'écrit par l'éleveur (ex. F12, B-07)`).optional();

export const FORM_SCHEMAS = {
  BREEDING: z.object({
    femaleCode: code('femelle'),
    maleCode: code('mâle'),
    date: date('Date de la saillie'),
    observation: text('Remarque libre'),
  }),
  PALPATION: z.object({
    femaleCode: code('femelle palpée'),
    date: date('Date de la palpation'),
    result: z
      .enum(['PREGNANT', 'NOT_PREGNANT', 'INCONCLUSIVE'])
      .describe('PREGNANT = gestante, NOT_PREGNANT = vide, INCONCLUSIVE = douteux')
      .optional(),
    observation: text('Remarque libre'),
  }),
  BIRTH: z.object({
    femaleCode: code('mère'),
    date: date('Date de la mise bas'),
    liveBorn: count('Nombre de lapereaux nés vivants'),
    stillBorn: count('Nombre de mort-nés'),
    litterCode: text('Code de portée si précisé (sinon ne rien mettre)'),
    observation: text('Remarque libre'),
  }),
  HEALTH: z.object({
    rabbitCode: code('concerné'),
    type: z
      .enum(['OBSERVATION', 'TREATMENT', 'VACCINATION', 'ANALYSIS', 'CONTROL'])
      .describe('Nature de l’enregistrement')
      .optional(),
    date: date('Date de l’observation ou du soin'),
    symptoms: text('Symptômes observés'),
    suspicion: text('Maladie suspectée par l’éleveur'),
    diagnosis: text('Diagnostic posé (vétérinaire)'),
    treatment: text('Traitement appliqué'),
    medication: text('Médicament ou vaccin'),
    dosage: text('Dosage'),
    nextDueDate: date('Prochaine échéance (rappel, contrôle, fin de traitement)'),
    observation: text('Remarque libre'),
  }),
  EXPENSE: z.object({
    date: date('Date de la dépense'),
    category: z
      .enum(['FEED', 'MEDICATION', 'ENERGY', 'EQUIPMENT', 'MAINTENANCE', 'TRANSPORT', 'SALARY', 'OTHER'])
      .describe('FEED aliment, MEDICATION soins, ENERGY eau/électricité, EQUIPMENT matériel, MAINTENANCE entretien, TRANSPORT, SALARY main-d’œuvre, OTHER')
      .optional(),
    amount: z.number().min(0).describe('Montant en FCFA').optional(),
    description: text('Ce qui a été acheté'),
    supplier: text('Fournisseur'),
    reference: text('Numéro de facture ou référence'),
    paymentMethod: z
      .enum(['CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'OTHER'])
      .describe('CASH espèces, MOBILE_MONEY (Orange Money, MTN MoMo), BANK_TRANSFER virement')
      .optional(),
    observation: text('Remarque libre'),
  }),
  TASK: z.object({
    title: text('Titre court de la tâche'),
    description: text('Détails'),
    dueDate: date('Échéance'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    rabbitCode: code('concerné, s’il y en a un'),
  }),
  RABBIT_EXIT: z.object({
    rabbitCode: code('qui sort de l’élevage'),
    status: z
      .enum(['DEAD', 'CULLED', 'TRANSFERRED'])
      .describe('DEAD mort, CULLED réformé, TRANSFERRED transféré (les ventes passent par la page Ventes)')
      .optional(),
    date: date('Date de la sortie'),
    cause: text('Cause (maladie, accident, vente…)'),
    observation: text('Remarque libre'),
  }),
} satisfies Record<AssistantForm, z.ZodObject>;

export type FormDraft<F extends AssistantForm> = z.infer<(typeof FORM_SCHEMAS)[F]>;

export const FORM_LABELS: Record<AssistantForm, string> = {
  BREEDING: 'Nouvelle saillie',
  PALPATION: 'Palpation',
  BIRTH: 'Mise bas',
  HEALTH: 'Enregistrement sanitaire',
  EXPENSE: 'Dépense',
  TASK: 'Tâche',
  RABBIT_EXIT: 'Sortie d’un lapin',
};

export interface RabbitRef {
  id: string;
  code: string;
  sex: string;
  status: string;
}

export interface OpenBreedingRef {
  id: string;
  status: string;
}

/**
 * Accès aux données dont la conversion a besoin (injecté pour les tests).
 */
export interface FormLookups {
  findRabbit(code: string): Promise<RabbitRef | null>;
  findOpenBreeding(femaleId: string): Promise<OpenBreedingRef | null>;
}

export interface PreparedForm {
  form: AssistantForm;
  fields: Record<string, string>;
  warnings: string[];
  /** Page où vérifier et enregistrer le brouillon (null si incomplet). */
  href: string | null;
  summary: string;
}

const put = (
  fields: Record<string, string>,
  key: string,
  value: string | number | undefined | null,
) => {
  if (value === undefined || value === null || value === '') return;
  fields[key] = String(value);
};

export function prefillHref(path: string, fields: Record<string, string>, extra: Record<string, string> = {}) {
  const params = new URLSearchParams(extra);
  if (Object.keys(fields).length > 0) params.set('prefill', JSON.stringify(fields));
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

/**
 * Convertit le brouillon produit par l'IA en champs de formulaire :
 * les codes de lapins deviennent des identifiants de la ferme, et tout
 * ce qui ne colle pas est signalé dans `warnings`.
 */
export async function prepareForm(
  form: AssistantForm,
  draft: Record<string, unknown>,
  lookups: FormLookups,
): Promise<PreparedForm> {
  const parsed = FORM_SCHEMAS[form].safeParse(draft);
  const data = (parsed.success ? parsed.data : {}) as Record<string, string | number | undefined>;
  const warnings: string[] = parsed.success ? [] : ['Certaines informations n’ont pas pu être comprises.'];
  const fields: Record<string, string> = {};

  const rabbit = async (key: string, label: string, sex?: 'MALE' | 'FEMALE') => {
    const value = data[key];
    if (typeof value !== 'string' || !value.trim()) return null;
    const found = await lookups.findRabbit(value.trim());
    if (!found) {
      warnings.push(`Aucun lapin « ${value} » trouvé pour ${label}.`);
      return null;
    }
    if (found.status !== 'ACTIVE') warnings.push(`${found.code} n’est plus actif dans l’élevage.`);
    if (sex && found.sex !== sex) {
      warnings.push(`${found.code} n’est pas enregistré comme ${sex === 'FEMALE' ? 'femelle' : 'mâle'}.`);
    }
    return found;
  };

  let href: string | null = null;
  let summary = FORM_LABELS[form];

  switch (form) {
    case 'BREEDING': {
      const female = await rabbit('femaleCode', 'la femelle', 'FEMALE');
      const male = await rabbit('maleCode', 'le mâle', 'MALE');
      put(fields, 'femaleId', female?.id);
      put(fields, 'maleId', male?.id);
      put(fields, 'breedingDate', data.date);
      put(fields, 'observation', data.observation);
      href = prefillHref('/breeding', fields, { new: '1' });
      summary = `Saillie ${female?.code ?? '?'} × ${male?.code ?? '?'}${data.date ? ` le ${data.date}` : ''}`;
      break;
    }
    case 'PALPATION':
    case 'BIRTH': {
      const female = await rabbit('femaleCode', 'la femelle', 'FEMALE');
      put(fields, 'date', data.date);
      put(fields, 'observation', data.observation);
      if (form === 'PALPATION') {
        put(fields, 'result', data.result);
        summary = `Palpation de ${female?.code ?? '?'}${data.result ? ` : ${RESULT_LABELS[String(data.result)] ?? data.result}` : ''}`;
      } else {
        put(fields, 'liveBorn', data.liveBorn);
        put(fields, 'stillBorn', data.stillBorn);
        put(fields, 'litterCode', data.litterCode);
        summary = `Mise bas de ${female?.code ?? '?'} : ${data.liveBorn ?? '?'} vivant(s), ${data.stillBorn ?? 0} mort-né(s)`;
      }
      if (female) {
        const breeding = await lookups.findOpenBreeding(female.id);
        if (breeding) {
          href = prefillHref('/breeding', fields, {
            action: form === 'BIRTH' ? 'birth' : 'palpation',
            breedingId: breeding.id,
          });
        } else {
          warnings.push(`Aucun accouplement en cours pour ${female.code} : enregistre d’abord la saillie.`);
        }
      }
      break;
    }
    case 'HEALTH': {
      const target = await rabbit('rabbitCode', 'le lapin concerné');
      put(fields, 'rabbitId', target?.id);
      for (const key of ['type', 'date', 'symptoms', 'suspicion', 'diagnosis', 'treatment', 'medication', 'dosage', 'nextDueDate', 'observation']) {
        put(fields, key, data[key]);
      }
      href = prefillHref('/health', fields, { new: '1' });
      summary = `Santé de ${target?.code ?? '?'}${data.symptoms ? ` : ${data.symptoms}` : ''}`;
      break;
    }
    case 'EXPENSE': {
      for (const key of ['date', 'category', 'amount', 'description', 'supplier', 'reference', 'paymentMethod', 'observation']) {
        put(fields, key, data[key]);
      }
      href = prefillHref('/operations', fields, { new: '1' });
      summary = `Dépense${data.description ? ` « ${data.description} »` : ''}${data.amount !== undefined ? ` de ${data.amount} FCFA` : ''}`;
      break;
    }
    case 'TASK': {
      const target = await rabbit('rabbitCode', 'le lapin concerné');
      put(fields, 'rabbitId', target?.id);
      for (const key of ['title', 'description', 'dueDate', 'priority']) put(fields, key, data[key]);
      href = prefillHref('/tasks', fields, { new: '1' });
      summary = `Tâche${data.title ? ` « ${data.title} »` : ''}${data.dueDate ? ` pour le ${data.dueDate}` : ''}`;
      break;
    }
    case 'RABBIT_EXIT': {
      const target = await rabbit('rabbitCode', 'le lapin qui sort');
      for (const key of ['status', 'date', 'cause', 'observation']) put(fields, key, data[key]);
      href = target ? prefillHref(`/rabbits/${target.id}`, fields, { exit: '1' }) : null;
      summary = `Sortie de ${target?.code ?? '?'}${data.cause ? ` (${data.cause})` : ''}`;
      break;
    }
  }

  return { form, fields, warnings, href, summary };
}

const RESULT_LABELS: Record<string, string> = {
  PREGNANT: 'gestante',
  NOT_PREGNANT: 'vide',
  INCONCLUSIVE: 'douteuse',
};
