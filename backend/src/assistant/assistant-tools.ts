import { tool, type ToolSet } from 'ai';
import { z } from 'zod';

import { ASSISTANT_FORMS, FORM_LABELS, FORM_SCHEMAS, prepareForm, type AssistantForm, type PreparedForm } from './assistant-forms';
import type { FarmReader } from './farm-reader';

/**
 * Outils mis à disposition du modèle.
 *
 * - Les outils `lire…` consultent la base (lecture seule, filtrée sur la ferme).
 * - Les outils `preparer…` ne modifient rien : ils construisent un brouillon
 *   que l'utilisateur ouvre dans le formulaire habituel pour le valider.
 */
export function buildAssistantTools(reader: FarmReader, proposals: PreparedForm[]): ToolSet {
  const readTools: ToolSet = {
    lireVueEnsemble: tool({
      description:
        "Chiffres clés de la ferme : lapins actifs par sexe et destination, portées sous la mère, accouplements en cours, tâches ouvertes et en retard, morts et ventes des 30 derniers jours.",
      inputSchema: z.object({}),
      execute: () => reader.overview(),
    }),
    lireLapins: tool({
      description: 'Liste des lapins (actifs par défaut) avec sexe, âge, race et cage. Filtrable.',
      inputSchema: z.object({
        query: z.string().optional().describe('Texte à chercher dans le code, la couleur ou les observations'),
        sex: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).optional(),
        status: z.enum(['ACTIVE', 'SOLD', 'DEAD', 'TRANSFERRED', 'CULLED']).optional(),
        purpose: z.enum(['BREEDER', 'FATTENING', 'FUTURE_BREEDER', 'REFORM']).optional(),
        limit: z.number().int().min(1).max(100).optional(),
      }),
      execute: (input) => reader.searchRabbits(input),
    }),
    lireFicheLapin: tool({
      description: "Fiche complète d'un lapin : parents, cage, saillies, mises bas, santé, pesées.",
      inputSchema: z.object({ code: z.string().describe('Code du lapin') }),
      execute: ({ code }) => reader.rabbitDetails(code),
    }),
    lireAccouplements: tool({
      description: 'Accouplements avec dates de palpation, de nid et de mise bas prévue.',
      inputSchema: z.object({
        status: z.enum(['OPEN', 'ALL']).optional().describe('OPEN = en cours (défaut), ALL = historique'),
        femaleCode: z.string().optional(),
        limit: z.number().int().min(1).max(100).optional(),
      }),
      execute: (input) => reader.breedings(input),
    }),
    lirePortees: tool({
      description: 'Portées avec mère, père, âge, nés vivants, mort-nés et effectif actuel.',
      inputSchema: z.object({
        status: z.enum(['ACTIVE', 'WEANED', 'CLOSED']).optional(),
        limit: z.number().int().min(1).max(100).optional(),
      }),
      execute: (input) => reader.litters(input),
    }),
    lireTaches: tool({
      description: "Tâches ouvertes : du jour, en retard, à venir ou toutes.",
      inputSchema: z.object({
        scope: z.enum(['TODAY', 'OVERDUE', 'UPCOMING', 'OPEN']).optional(),
        days: z.number().int().min(1).max(60).optional().describe('Horizon pour UPCOMING'),
      }),
      execute: (input) => reader.tasks(input),
    }),
    lireSante: tool({
      description: 'Enregistrements sanitaires récents (symptômes, traitements, échéances).',
      inputSchema: z.object({
        rabbitCode: z.string().optional(),
        days: z.number().int().min(1).max(365).optional(),
      }),
      execute: (input) => reader.health(input),
    }),
    lireMortalite: tool({
      description: 'Morts enregistrées sur une période, avec répartition par cause.',
      inputSchema: z.object({ days: z.number().int().min(1).max(365).optional() }),
      execute: ({ days }) => reader.mortality(days),
    }),
    lireFinances: tool({
      description: 'Ventes, encaissements, reste à encaisser et dépenses par catégorie sur une période (FCFA).',
      inputSchema: z.object({ days: z.number().int().min(1).max(365).optional() }),
      execute: ({ days }) => reader.finances(days),
    }),
    lireStock: tool({
      description: 'Stock (aliment, médicaments…) avec seuil minimum et jours d’autonomie.',
      inputSchema: z.object({}),
      execute: () => reader.stock(),
    }),
  };

  const prepareTools: ToolSet = {};
  for (const form of ASSISTANT_FORMS) {
    prepareTools[PREPARE_TOOL_NAMES[form]] = tool({
      description: `Prépare un brouillon « ${FORM_LABELS[form]} » à partir de ce que dit l'éleveur. Rien n'est enregistré : l'éleveur vérifie puis valide dans l'app. Ne mets que ce qui a été dit.`,
      inputSchema: FORM_SCHEMAS[form],
      execute: async (draft: Record<string, unknown>) => {
        const prepared = await prepareForm(form, draft, reader);
        proposals.push(prepared);
        return {
          prepared: prepared.summary,
          warnings: prepared.warnings,
          canOpen: prepared.href !== null,
        };
      },
    });
  }

  return { ...readTools, ...prepareTools };
}

export const PREPARE_TOOL_NAMES: Record<AssistantForm, string> = {
  BREEDING: 'preparerSaillie',
  PALPATION: 'preparerPalpation',
  BIRTH: 'preparerMiseBas',
  HEALTH: 'preparerSoin',
  EXPENSE: 'preparerDepense',
  TASK: 'preparerTache',
  RABBIT_EXIT: 'preparerSortieLapin',
};
