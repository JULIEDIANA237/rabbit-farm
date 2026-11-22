/**
 * Une femelle peut-elle être ressaillie après sa mise bas ?
 * Règles d'un rythme semi-intensif (saillie vers J+10 à J+12),
 * appliquées aux réponses du questionnaire de l'éleveur.
 */

export type BodyCondition = 'THIN' | 'GOOD' | 'FAT';
export type VulvaColor = 'PALE' | 'PINK' | 'RED' | 'UNKNOWN';
export type RematingVerdict = 'READY' | 'WAIT' | 'NOT_READY';

export interface RematingAnswers {
  /** Poids du jour (kg). */
  weightKg?: number | null;
  bodyCondition: BodyCondition;
  /** Mamelles dures, chaudes, rouges ou avec abcès. */
  mastitis: boolean;
  /** Diarrhée, écoulement nasal, gale, abcès, blessure… */
  sick: boolean;
  /** Mange-t-elle bien ? */
  goodAppetite: boolean;
  vulva: VulvaColor;
}

export interface RematingFacts {
  daysSinceBirth: number;
  /** Lapereaux encore allaités. */
  kitsNursing: number;
  /** Dernier poids connu avant aujourd'hui (kg). */
  previousWeightKg?: number | null;
}

export interface RematingResult {
  verdict: RematingVerdict;
  title: string;
  /** Jours à attendre avant de réévaluer (0 si prête). */
  waitDays: number;
  reasons: string[];
  advice: string[];
}

export const MIN_DAYS_AFTER_BIRTH = 10;
const HEAVY_LITTER = 9;

const round1 = (n: number) => Math.round(n * 10) / 10;

export function assessRemating(answers: RematingAnswers, facts: RematingFacts): RematingResult {
  const blocking: { reason: string; wait: number; advice: string }[] = [];
  const caution: { reason: string; wait: number; advice: string }[] = [];

  if (facts.daysSinceBirth < MIN_DAYS_AFTER_BIRTH) {
    const wait = MIN_DAYS_AFTER_BIRTH - facts.daysSinceBirth;
    blocking.push({
      reason: `La mise bas date de ${facts.daysSinceBirth} jour(s) : trop tôt pour un rythme semi-intensif.`,
      wait,
      advice: `Réessaie dans ${wait} jour(s), vers J+${MIN_DAYS_AFTER_BIRTH}.`,
    });
  }
  if (answers.mastitis) {
    blocking.push({
      reason: 'Mamelles abîmées (mammite possible).',
      wait: 14,
      advice: 'Ne la saillis pas : isole-la si besoin, montre-la au vétérinaire et surveille les lapereaux (adoption possible).',
    });
  }
  if (answers.sick) {
    blocking.push({
      reason: 'Signes de maladie.',
      wait: 7,
      advice: 'Soigne-la d’abord (vétérinaire en cas de doute) ; une femelle malade donne de petites portées ou avorte.',
    });
  }
  if (answers.bodyCondition === 'THIN') {
    blocking.push({
      reason: 'Elle est maigre : l’allaitement l’a épuisée.',
      wait: 7,
      advice: 'Donne-lui des granulés à volonté, du fourrage de qualité et de l’eau propre, puis réévalue dans une semaine (ou après le sevrage).',
    });
  }

  const loss =
    answers.weightKg && facts.previousWeightKg && facts.previousWeightKg > 0
      ? (facts.previousWeightKg - answers.weightKg) / facts.previousWeightKg
      : null;
  if (loss != null && loss >= 0.15) {
    blocking.push({
      reason: `Elle a perdu ${Math.round(loss * 100)} % de son poids (${round1(facts.previousWeightKg!)} → ${round1(answers.weightKg!)} kg).`,
      wait: 7,
      advice: 'Laisse-la reprendre du poids avant de la saillir.',
    });
  } else if (loss != null && loss >= 0.1) {
    caution.push({
      reason: `Elle a perdu ${Math.round(loss * 100)} % de son poids.`,
      wait: 3,
      advice: 'Renforce sa ration ; la saillie reste possible si elle est en bon état.',
    });
  }

  if (!answers.goodAppetite) {
    caution.push({ reason: 'Elle mange peu.', wait: 3, advice: 'Vérifie l’eau, la fraîcheur des aliments et sa santé avant de la saillir.' });
  }
  if (facts.kitsNursing >= HEAVY_LITTER) {
    caution.push({
      reason: `Elle allaite ${facts.kitsNursing} lapereaux : la lactation est lourde.`,
      wait: 4,
      advice: 'Attends quelques jours ou confie 1 à 2 lapereaux à une autre femelle (adoption).',
    });
  }
  if (answers.vulva === 'PALE') {
    caution.push({
      reason: 'Vulve pâle : elle n’est sans doute pas en chaleur.',
      wait: 2,
      advice: 'Présente-la au mâle dans 1 à 2 jours, quand la vulve est rouge ou violacée.',
    });
  }

  const advice: string[] = [];
  if (answers.bodyCondition === 'FAT') {
    advice.push('Elle est grasse : la fertilité baisse. Limite un peu les granulés et vérifie qu’elle accepte bien le mâle.');
  }

  if (blocking.length > 0) {
    return {
      verdict: 'NOT_READY',
      title: 'Pas encore prête pour une nouvelle saillie',
      waitDays: Math.max(...blocking.map((b) => b.wait)),
      reasons: [...blocking, ...caution].map((b) => b.reason),
      advice: [...blocking, ...caution].map((b) => b.advice).concat(advice),
    };
  }
  if (caution.length > 0) {
    return {
      verdict: 'WAIT',
      title: 'Prête bientôt : mieux vaut attendre un peu',
      waitDays: Math.max(...caution.map((c) => c.wait)),
      reasons: caution.map((c) => c.reason),
      advice: caution.map((c) => c.advice).concat(advice),
    };
  }
  return {
    verdict: 'READY',
    title: 'Prête pour une nouvelle saillie',
    waitDays: 0,
    reasons: [
      `${facts.daysSinceBirth} jours après la mise bas, en bon état${answers.vulva === 'RED' || answers.vulva === 'PINK' ? ', vulve colorée (en chaleur)' : ''}.`,
    ],
    advice: [
      'Porte-la dans la cage du mâle, le matin ou le soir à la fraîche, et reste à côté.',
      'Si elle refuse, réessaie le lendemain ou avec un autre mâle.',
      ...advice,
    ],
  };
}
