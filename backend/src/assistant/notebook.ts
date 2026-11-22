import { z } from 'zod';

/** Ce que l'IA doit lire sur la photo d'un cahier d'élevage. */
export const NOTEBOOK_SCHEMA = z.object({
  rabbits: z
    .array(
      z.object({
        code: z.string().describe('Code ou nom du lapin tel qu’écrit (ex. F01, B-07, Blanche)'),
        sex: z.enum(['MALE', 'FEMALE', 'UNKNOWN']).describe('FEMALE pour une lapine/femelle/F, MALE pour un mâle/M, sinon UNKNOWN'),
        birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Date de naissance AAAA-MM-JJ si écrite'),
        breed: z.string().optional().describe('Race si écrite'),
        color: z.string().optional().describe('Couleur si écrite'),
        note: z.string().optional().describe('Autre information utile sur ce lapin'),
      }),
    )
    .max(200),
  breedings: z
    .array(
      z.object({
        femaleCode: z.string().describe('Code de la femelle saillie'),
        maleCode: z.string().describe('Code du mâle'),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe('Date de la saillie AAAA-MM-JJ'),
        note: z.string().optional(),
      }),
    )
    .max(200),
  unreadable: z.array(z.string()).max(20).describe('Lignes ou mots illisibles ou incompris, recopiés tels quels'),
});

export type NotebookReading = z.infer<typeof NOTEBOOK_SCHEMA>;

export function notebookPrompt(today: string) {
  return `Voici la photo d'une page du cahier d'un éleveur de lapins (écriture à la main possible).
Relève tous les lapins et toutes les saillies (accouplements, « couverture », « saillie », « F03 x M01 »…).
- Un lapin cité dans une saillie doit aussi figurer dans la liste des lapins : femelle pour la femelle, mâle pour le mâle.
- Dates au format AAAA-MM-JJ. Une date sans année est dans les 12 derniers mois avant le ${today}. Format jour/mois (ex. 12/10 = 12 octobre).
- Ne devine jamais : ce que tu ne lis pas avec certitude va dans « unreadable ».
- Ignore les mises bas, ventes et dépenses : elles ne sont pas importées ici.`;
}

const norm = (code: string) => code.trim().replace(/\s+/g, ' ');

/**
 * Nettoie la lecture : codes sans espaces superflus, doublons fusionnés,
 * lapins des saillies ajoutés s'ils manquent, codes déjà connus marqués.
 */
export function tidyNotebook(reading: NotebookReading, knownCodes: string[]) {
  const known = new Set(knownCodes.map((c) => c.toLowerCase()));
  const rabbits = new Map<string, NotebookReading['rabbits'][number]>();
  const add = (r: NotebookReading['rabbits'][number]) => {
    const code = norm(r.code);
    if (!code) return;
    const key = code.toLowerCase();
    const prev = rabbits.get(key);
    rabbits.set(key, prev ? { ...r, ...prev, sex: prev.sex === 'UNKNOWN' ? r.sex : prev.sex, code: prev.code } : { ...r, code });
  };
  reading.rabbits.forEach(add);

  const breedings = reading.breedings
    .map((b) => ({ ...b, femaleCode: norm(b.femaleCode), maleCode: norm(b.maleCode) }))
    .filter((b) => b.femaleCode && b.maleCode && b.femaleCode.toLowerCase() !== b.maleCode.toLowerCase());
  for (const b of breedings) {
    add({ code: b.femaleCode, sex: 'FEMALE' });
    add({ code: b.maleCode, sex: 'MALE' });
  }

  const warnings = reading.unreadable.filter(Boolean).map((u) => `Illisible : « ${u.slice(0, 80)} »`);
  const missingDates = breedings.filter((b) => !b.date).length;
  if (missingDates) warnings.push(`${missingDates} saillie(s) sans date : ajoute la date avant d’enregistrer.`);

  return {
    rabbits: [...rabbits.values()].map((r) => ({
      code: r.code,
      sex: r.sex,
      birthDate: r.birthDate ?? null,
      breed: r.breed ?? null,
      color: r.color ?? null,
      note: r.note ?? null,
      exists: known.has(r.code.toLowerCase()),
    })),
    breedings: breedings.map((b) => ({ femaleCode: b.femaleCode, maleCode: b.maleCode, date: b.date ?? null, note: b.note ?? null })),
    warnings,
  };
}
