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
  availableFemales: Array<{ id: string; code: string; ageDays: number | null; daysSinceBirth: number | null; lastPalpationNegative: boolean; rematingCheck?: 'DUE' | 'LATER' | null }>;
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
  /** Palpations à faire (fenêtre ouverte ou dans 2 jours). */
  palpationsDue?: Array<{ breedingId: string; femaleCode: string; start: Date; end: Date }>;
  /** Boîtes à nid à installer (gestantes, nid prévu sous 3 jours). */
  nestsDue?: Array<{ breedingId: string; femaleCode: string; date: Date }>;
  overdueTasks?: number;
}

/** Conseils d'expert, un par jour, quand il n'y a rien d'urgent. */
export const DAILY_TIPS: Array<{ title: string; detail: string; href: string; actionLabel: string }> = [
  { title: 'Eau propre et fraîche à volonté', detail: 'Un lapin boit 2 fois plus qu’il ne mange ; une femelle qui allaite peut boire plus d’un litre par jour.', href: '/rabbits', actionLabel: 'Voir les lapins' },
  { title: 'Fortes chaleurs : protège tes mâles', detail: 'Au-dessus de 30 °C, la fertilité des mâles chute pour plusieurs semaines. Ombre, ventilation, saillies tôt le matin.', href: '/breeding', actionLabel: 'Voir les saillies' },
  { title: 'Quarantaine des nouveaux lapins', detail: 'Garde tout lapin acheté 2 à 3 semaines à part avant de le mettre avec les autres.', href: '/health', actionLabel: 'Voir la santé' },
  { title: 'Pèse les lots chaque semaine', detail: 'Une croissance qui ralentit est souvent le premier signe d’une maladie ou d’un aliment mal adapté.', href: '/fattening', actionLabel: 'Voir les lots' },
  { title: 'Nettoie et sèche les cages', detail: 'L’humidité et les crottes accumulées favorisent coccidiose et diarrhées, surtout au sevrage.', href: '/farm', actionLabel: 'Voir les cages' },
  { title: 'Réforme les femelles peu productives', detail: 'Trois saillies ratées de suite, des portées très petites ou du cannibalisme répété : pense à la remplacer.', href: '/statistics', actionLabel: 'Voir les statistiques' },
  { title: 'Adoption des lapereaux', detail: 'Une portée trop grande ? Confie quelques lapereaux à une autre femelle dans les 3 premiers jours, écart d’âge de 2 jours au plus.', href: '/kits', actionLabel: 'Voir les lapereaux' },
];

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
  // Après une mise bas, le questionnaire de ressaillie passe avant la saillie.
  for (const female of f.availableFemales.filter((x) => x.rematingCheck === 'DUE')) {
    out.push({
      key: `REMATING_${female.id}`,
      kind: 'TODO',
      title: `${female.code} peut-elle être ressaillie ?`,
      detail: `${female.daysSinceBirth != null ? `Mise bas il y a ${female.daysSinceBirth} jours. ` : ''}Réponds à 6 questions (poids, état) : l'app te dit si elle est prête.`,
      href: `/remating?femaleId=${female.id}`,
      actionLabel: 'Répondre',
      tone: 'warning',
    });
  }
  const ready = f.availableFemales.filter(
    (x) =>
      !x.rematingCheck &&
      (x.ageDays == null || x.ageDays >= FIRST_MATING_AGE_DAYS) &&
      (x.daysSinceBirth == null || x.daysSinceBirth >= REST_AFTER_BIRTH_DAYS),
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

  if (f.overdueTasks) {
    out.push({
      key: 'TASKS_OVERDUE',
      kind: 'TODO',
      title: `${f.overdueTasks} ${plural(f.overdueTasks, 'tâche en retard', 'tâches en retard')}`,
      detail: 'Fais-les ou annule celles qui ne sont plus utiles pour garder un planning fiable.',
      href: '/tasks',
      actionLabel: 'Voir les tâches',
      tone: 'warning',
    });
  }

  for (const p of f.palpationsDue ?? []) {
    const open = p.start <= f.now;
    out.push({
      key: `PALPATION_${p.breedingId}`,
      kind: 'TODO',
      title: open ? `Palper ${p.femaleCode}` : `Palpation de ${p.femaleCode} bientôt`,
      detail: `À faire entre le ${fmt(p.start)} et le ${fmt(p.end)} pour savoir si elle est gestante.`,
      href: `/breeding?action=palpation&breedingId=${p.breedingId}`,
      actionLabel: 'Enregistrer la palpation',
      tone: open && p.end < f.now ? 'warning' : 'info',
    });
  }

  for (const n of f.nestsDue ?? []) {
    out.push({
      key: `NEST_${n.breedingId}`,
      kind: 'TODO',
      title: `Installer la boîte à nid de ${n.femaleCode}`,
      detail: `Prévue le ${fmt(n.date)}, quelques jours avant la mise bas, avec de la paille ou du foin propre.`,
      href: `/breeding?action=nest&breedingId=${n.breedingId}`,
      actionLabel: 'Noter le nid',
      tone: n.date < f.now ? 'warning' : 'info',
    });
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
        href: '/operations/inventory',
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

  // Toujours au moins un conseil : l'assistant n'est jamais muet.
  if (!out.some((x) => x.kind === 'IDEA')) {
    const dayIndex = Math.floor(f.now.getTime() / 86_400_000);
    const tip = DAILY_TIPS[dayIndex % DAILY_TIPS.length];
    out.push({ key: 'TIP_OF_DAY', kind: 'IDEA', ...tip, tone: 'info' });
  }

  return out;
}
