/**
 * Assistant d'élevage : règles simples (sans IA) qui proposent quoi faire,
 * quoi prévoir et quelques idées, à partir de l'état de la ferme.
 */

export type SuggestionKind = 'TODO' | 'PLAN' | 'IDEA';
export type SuggestionTone = 'info' | 'warning' | 'danger' | 'success';

export interface Suggestion {
  key: string;
  kind: SuggestionKind;
  title: string;
  detail?: string;
  href: string;
  actionLabel: string;
  tone: SuggestionTone;
}

export interface AdvisorFacts {
  now: Date;
  /** Femelles reproductrices libres (pas d'accouplement en cours). */
  availableFemales: Array<{ id: string; code: string; ageDays: number | null; daysSinceBirth: number | null; lastPalpationNegative: boolean }>;
  /** Mâles reproducteurs actifs avec leurs femelles des dernières 24 h. */
  males: Array<{ id: string; code: string; femalesLast24h: number; matingsLast7d: number }>;
  birthsNext7Days: Array<{ femaleCode: string; start: Date; end: Date; nestInstalled: boolean }>;
  freeMaternityCages: number;
  /** Portées encore sous la mère avec leur âge. */
  litters: Array<{ code: string; ageDays: number; count: number }>;
  freeFatteningPlaces: number;
  lots: Array<{ id: string; code: string; ageDays: number; members: number; lastWeighingDays: number | null; averageWeight: number | null }>;
  feeds: Array<{ name: string; autonomyDays: number | null; unit: string; dailyNeed: number }>;
  breedersWithoutPast: number;
}

/** Âge minimal d'une femelle pour sa première saillie (environ 4 mois et demi). */
export const FIRST_MATING_AGE_DAYS = 135;
/** Repos conseillé après une mise bas avant de la remettre au mâle. */
export const REST_AFTER_BIRTH_DAYS = 11;
const WEANING_AGE = 35;

const fmt = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', timeZone: 'Africa/Douala' });
const plural = (n: number, one: string, many = one + 's') => (n > 1 ? many : one);

export function buildSuggestions(f: AdvisorFacts): Suggestion[] {
  const out: Suggestion[] = [];

  // --- À FAIRE ---------------------------------------------------------
  const ready = f.availableFemales.filter(
    (x) => (x.ageDays == null || x.ageDays >= FIRST_MATING_AGE_DAYS) && (x.daysSinceBirth == null || x.daysSinceBirth >= REST_AFTER_BIRTH_DAYS),
  );
  const freeMales = [...f.males].filter((m) => m.femalesLast24h < 2).sort((a, b) => a.matingsLast7d - b.matingsLast7d);
  ready.slice(0, 3).forEach((female, i) => {
    const male = freeMales.length ? freeMales[i % freeMales.length] : null;
    const why = female.lastPalpationNegative
      ? 'palpation négative, elle peut être remise au mâle'
      : female.daysSinceBirth != null
        ? `mise bas il y a ${female.daysSinceBirth} jours`
        : 'aucun accouplement en cours';
    const prefill = encodeURIComponent(JSON.stringify(male ? { femaleId: female.id, maleId: male.id } : { femaleId: female.id }));
    out.push({
      key: `MATE_${female.id}`,
      kind: 'TODO',
      title: male ? `Saillir ${female.code} avec ${male.code}` : `${female.code} peut être saillie`,
      detail: male ? `${why[0].toUpperCase()}${why.slice(1)}. ${male.code} est le mâle le moins sollicité cette semaine.` : `${why[0].toUpperCase()}${why.slice(1)}, mais aucun mâle n'est disponible aujourd'hui (2 femelles max en 24 h).`,
      href: `/breeding?new=1&prefill=${prefill}`,
      actionLabel: 'Préparer la saillie',
      tone: 'info',
    });
  });
  if (ready.length > 3) {
    out.push({
      key: 'MATE_MORE',
      kind: 'TODO',
      title: `${ready.length - 3} autre${ready.length - 3 > 1 ? 's' : ''} femelle${ready.length - 3 > 1 ? 's' : ''} prête${ready.length - 3 > 1 ? 's' : ''} pour la saillie`,
      href: '/breeding',
      actionLabel: 'Voir la reproduction',
      tone: 'info',
    });
  }

  for (const lot of f.lots) {
    if (lot.members > 0 && (lot.lastWeighingDays == null || lot.lastWeighingDays >= 14)) {
      out.push({
        key: `WEIGH_${lot.id}`,
        kind: 'TODO',
        title: `Peser le lot ${lot.code}`,
        detail: lot.lastWeighingDays == null ? 'Aucune pesée enregistrée : la croissance du lot n’est pas suivie.' : `Dernière pesée il y a ${lot.lastWeighingDays} jours.`,
        href: `/fattening/${lot.id}`,
        actionLabel: 'Ouvrir le lot',
        tone: 'warning',
      });
    }
  }

  // --- À PRÉVOIR -------------------------------------------------------
  if (f.birthsNext7Days.length) {
    const withoutNest = f.birthsNext7Days.filter((b) => !b.nestInstalled);
    const list = f.birthsNext7Days.map((b) => `${b.femaleCode} (${fmt(b.start)} – ${fmt(b.end)})`).join(', ');
    const cagesShort = f.birthsNext7Days.length > f.freeMaternityCages;
    out.push({
      key: 'BIRTHS_WEEK',
      kind: 'PLAN',
      title: `${f.birthsNext7Days.length} ${plural(f.birthsNext7Days.length, 'mise bas prévue', 'mises bas prévues')} cette semaine`,
      detail:
        `${list}.` +
        (withoutNest.length ? ` Installe la boîte à nid de ${withoutNest.map((b) => b.femaleCode).join(', ')}.` : '') +
        (cagesShort ? ` Il ne reste que ${f.freeMaternityCages} ${plural(f.freeMaternityCages, 'cage')} de maternité libre${f.freeMaternityCages > 1 ? 's' : ''}.` : ''),
      href: '/breeding',
      actionLabel: 'Voir les accouplements',
      tone: cagesShort || withoutNest.length ? 'warning' : 'info',
    });
  }

  const weaningSoon = f.litters.filter((l) => l.ageDays >= WEANING_AGE - 10 && l.count > 0);
  if (weaningSoon.length) {
    const kits = weaningSoon.reduce((s, l) => s + l.count, 0);
    const missing = kits - f.freeFatteningPlaces;
    const due = weaningSoon.filter((l) => l.ageDays >= WEANING_AGE);
    out.push({
      key: 'WEANING_PLACES',
      kind: 'PLAN',
      title: due.length
        ? `Sevrer ${due.map((l) => l.code).join(', ')}`
        : `Sevrage dans ${Math.max(1, WEANING_AGE - Math.max(...weaningSoon.map((l) => l.ageDays)))} jours (${weaningSoon.map((l) => l.code).join(', ')})`,
      detail:
        `${kits} ${plural(kits, 'lapereau')} à loger en engraissement, ${f.freeFatteningPlaces} ${plural(f.freeFatteningPlaces, 'place libre', 'places libres')}.` +
        (missing > 0 ? ` Prévois ${missing} ${plural(missing, 'place')} de plus (nouvelle cage d’engraissement).` : ''),
      href: missing > 0 ? '/farm' : '/weaning',
      actionLabel: missing > 0 ? 'Ajouter une cage' : 'Aller au sevrage',
      tone: missing > 0 || due.length ? 'warning' : 'info',
    });
  }

  for (const feed of f.feeds) {
    if (feed.autonomyDays != null && feed.autonomyDays < 10) {
      const when = new Date(f.now.getTime() + Math.max(0, Math.floor(feed.autonomyDays) - 2) * 86_400_000);
      out.push({
        key: `FEED_${feed.name}`,
        kind: 'PLAN',
        title: `${feed.name} : environ ${Math.max(0, Math.floor(feed.autonomyDays))} jours de stock`,
        detail: `Les lapins en mangent ${feed.dailyNeed.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${feed.unit} par jour. Commande avant le ${fmt(when)}.`,
        href: '/inventory',
        actionLabel: 'Voir le stock',
        tone: feed.autonomyDays < 4 ? 'danger' : 'warning',
      });
    }
  }

  // --- SUGGESTIONS -----------------------------------------------------
  for (const lot of f.lots) {
    if (lot.members > 0 && (lot.ageDays >= 50 || (lot.averageWeight ?? 0) >= 2.2)) {
      out.push({
        key: `SALE_${lot.id}`,
        kind: 'IDEA',
        title: `Le lot ${lot.code} approche de la vente`,
        detail: `${lot.members} ${plural(lot.members, 'lapin')}` + (lot.averageWeight ? `, ${lot.averageWeight.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kg en moyenne` : '') + '. Préviens tes clients dès maintenant.',
        href: '/sales/ready',
        actionLabel: 'Préparer la vente',
        tone: 'success',
      });
    }
  }

  if (!f.males.length && f.availableFemales.length) {
    out.push({ key: 'NO_MALE', kind: 'IDEA', title: 'Aucun mâle reproducteur actif', detail: 'Achète ou désigne un mâle pour continuer les saillies.', href: '/rabbits', actionLabel: 'Voir les lapins', tone: 'warning' });
  }

  if (f.breedersWithoutPast > 0) {
    out.push({
      key: 'BREEDER_PAST',
      kind: 'IDEA',
      title: `Renseigne le passé de ${f.breedersWithoutPast} ${plural(f.breedersWithoutPast, 'reproducteur')}`,
      detail: 'Mises bas, pertes et cannibalisme passés rendent mes conseils plus justes.',
      href: '/rabbits/past',
      actionLabel: 'Répondre',
      tone: 'info',
    });
  }

  return out;
}
