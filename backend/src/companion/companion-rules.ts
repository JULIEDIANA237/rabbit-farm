/**
 * Règles de l'assistant « bras droit » de l'éleveur.
 * À partir d'un instantané de la ferme, elles disent quelles questions poser et quand.
 * Aucune IA ici : tout est déterministe et testé. Heure locale : Douala (UTC+1, sans heure d'été).
 */

export const HOUR = 3_600_000;
export const DAY = 24 * HOUR;
const TZ_OFFSET = HOUR; // Africa/Douala = UTC+1 toute l'année

/** Heures locales des tournées : 6 h, 13 h, 18 h. */
export const SLOT_HOURS = [6, 13, 18];

export type Severity = 'danger' | 'warning' | 'info';
export type Effect = 'OBSERVE_BAD' | 'SET_CAUSE';

export interface QuestionOption {
  value: string;
  label: string;
  tone?: 'good' | 'bad' | 'neutral';
  /** Page à ouvrir après la réponse (pour saisir le détail). */
  href?: string;
  /** Reposer la question plus tard (en jours, 0.3 ≈ la tournée suivante). */
  snoozeDays?: number;
  effect?: Effect;
  /** Fiche conseil à montrer après cette réponse. */
  adviceKey?: string;
}

export interface QuestionSpec {
  key: string;
  kind: string;
  severity: Severity;
  title: string;
  detail?: string;
  rabbitId?: string;
  refId?: string;
  options: QuestionOption[];
  adviceKey?: string;
  href?: string;
  askAt: Date;
  expiresAt: Date;
}

export interface Snapshot {
  now: Date;
  treatments: Array<{ id: string; rabbitId: string | null; target: string; label: string; createdAt: Date }>;
  dueReminders: Array<{ id: string; source: 'HEALTH' | 'CARE'; label: string; target: string; rabbitId: string | null; dueDate: Date }>;
  breedings: Array<{ id: string; femaleId: string; femaleCode: string; breedingDate: Date; status: string; hasNest: boolean; hasBirth: boolean }>;
  births: Array<{ id: string; motherId: string; motherCode: string; liveBorn: number; createdAt: Date }>;
  litters: Array<{ id: string; motherId: string; motherCode: string; birthDate: Date; currentCount: number }>;
  deaths: Array<{ id: string; date: Date; createdAt: Date; count: number; cause: string | null; label: string }>;
  lots: Array<{ id: string; code: string; weighings: Array<{ date: Date; averageWeight: number }> }>;
  feed: Array<{ id: string; name: string; unit: string; currentStock: number; minimumStock: number | null; dailyUse: number | null }>;
  femalesFailed: Array<{ id: string; code: string; misses: number }>;
  malesToday: Array<{ id: string; code: string; matings: number }>;
  readyCount: number;
  rabbitsActive: number;
  lastActivityAt: Date | null;
  /** Températures maximales prévues (°C), null si la météo est indisponible. */
  heat: { today: number | null; tomorrow: number | null } | null;
  /** Chiffres de la semaine, fournis le dimanche seulement. */
  week: { births: number; deaths: number; sales: number; salesAmount: number; expenses: number } | null;
  /** Démarrage de la ferme : prochaine étape pendant les premiers jours. */
  setup?: {
    farmAgeDays: number;
    next: { key: string; title: string; detail: string; href: string; altLabel?: string; altHref?: string } | null;
  } | null;
}

/** Nombre de jours pendant lesquels l'assistant guide le démarrage. */
export const SETUP_GUIDE_DAYS = 7;

export const THRESHOLDS = {
  palpationFrom: 10,
  palpationTo: 16,
  nestFrom: 26,
  nestTo: 30,
  deathsPerWeek: 3,
  /** g par jour en engraissement. */
  growthMinGrams: 15,
  stockDays: 7,
  heatWarn: 32,
  heatDanger: 35,
  idleDays: 3,
};

// ------------------------------------------------------------------ dates locales

/** Début (instant UTC) du jour local de Douala qui contient `t`. */
export function localDayStart(t: Date) {
  return new Date(Math.floor((t.getTime() + TZ_OFFSET) / DAY) * DAY - TZ_OFFSET);
}
export const localHour = (t: Date) => new Date(t.getTime() + TZ_OFFSET).getUTCHours();
export const localWeekday = (t: Date) => new Date(t.getTime() + TZ_OFFSET).getUTCDay(); // 0 = dimanche
export const ymd = (t: Date) => new Date(t.getTime() + TZ_OFFSET).toISOString().slice(0, 10);
const frDate = (t: Date) => t.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', timeZone: 'Africa/Douala' });
const at = (dayStart: Date, hour: number) => new Date(dayStart.getTime() + hour * HOUR);

/** Première tournée (6 h, 13 h ou 18 h locales) à partir de `from`. */
export function nextSlot(from: Date) {
  for (let d = 0; d < 3; d += 1) {
    const day = new Date(localDayStart(from).getTime() + d * DAY);
    for (const h of SLOT_HOURS) {
      const slot = at(day, h);
      if (slot.getTime() >= from.getTime()) return slot;
    }
  }
  return from;
}

/** Lundi (début de jour local) de la semaine de `t`, pour les clés hebdomadaires. */
export function weekStart(t: Date) {
  const start = localDayStart(t);
  const offset = (localWeekday(t) + 6) % 7;
  return new Date(start.getTime() - offset * DAY);
}

const ageDays = (from: Date, now: Date) => Math.floor((localDayStart(now).getTime() - localDayStart(from).getTime()) / DAY);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n > 1 ? many : one}`;
const fcfa = (n: number) => `${Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ')} FCFA`;

const LATER: QuestionOption = { value: 'later', label: 'Plus tard', tone: 'neutral', snoozeDays: 1 };
const NOT_SEEN: QuestionOption = { value: 'later', label: 'Pas encore vu', tone: 'neutral', snoozeDays: 0.3 };
const OK: QuestionOption = { value: 'ok', label: 'C’est noté', tone: 'good' };

const WEEKLY_TIPS = ['hygiene', 'eau', 'tout-va-bien', 'stock-aliment', 'quarantaine', 'vaccination', 'sevrage', 'repos-male'];

// ------------------------------------------------------------------ détection

export function detectQuestions(s: Snapshot, t = THRESHOLDS): QuestionSpec[] {
  const { now } = s;
  const today = localDayStart(now);
  const out: QuestionSpec[] = [];
  const push = (q: QuestionSpec) => out.push(q);

  // Suivi après un soin ou un traitement : la tournée suivante (au moins 3 h après).
  for (const tr of s.treatments) {
    const askAt = nextSlot(new Date(tr.createdAt.getTime() + 3 * HOUR));
    const sameDay = localDayStart(tr.createdAt).getTime() === localDayStart(askAt).getTime();
    push({
      key: `TREAT:${tr.id}`,
      kind: 'TREATMENT_FOLLOWUP',
      severity: 'warning',
      title: `${tr.target} a reçu ${tr.label} ${sameDay ? 'aujourd’hui' : 'hier'}. Comment va-t-il ?`,
      detail: 'Regarde s’il mange, boit et se déplace normalement.',
      rabbitId: tr.rabbitId ?? undefined,
      refId: tr.id,
      options: [
        { value: 'good', label: 'Il va bien', tone: 'good' },
        { value: 'bad', label: 'Il va mal', tone: 'bad', effect: 'OBSERVE_BAD', adviceKey: 'perte-appetit' },
        NOT_SEEN,
      ],
      adviceKey: 'suivi-traitement',
      askAt,
      expiresAt: new Date(askAt.getTime() + 2 * DAY),
    });
  }

  // Rappels prévus aujourd'hui (vaccin, vermifuge, soin à renouveler).
  for (const r of s.dueReminders) {
    const askAt = nextSlot(at(localDayStart(r.dueDate), SLOT_HOURS[0]));
    push({
      key: `DUE:${r.source}:${r.id}:${ymd(r.dueDate)}`,
      kind: 'REMINDER',
      severity: 'info',
      title: `Prévu aujourd’hui : ${r.label} pour ${r.target}. C’est fait ?`,
      rabbitId: r.rabbitId ?? undefined,
      refId: r.id,
      options: [
        { value: 'done', label: 'Je le note', tone: 'good', href: r.source === 'HEALTH' ? '/health' : '/care' },
        LATER,
      ],
      adviceKey: 'vaccination',
      askAt,
      expiresAt: new Date(askAt.getTime() + 3 * DAY),
    });
  }

  for (const b of s.breedings) {
    const age = ageDays(b.breedingDate, now);
    // Palpation entre J+10 et J+16.
    if ((b.status === 'PLANNED' || b.status === 'AWAITING_PALPATION') && age >= t.palpationFrom && age <= t.palpationTo) {
      push({
        key: `PALP:${b.id}`,
        kind: 'PALPATION',
        severity: 'warning',
        title: `As-tu palpé ${b.femaleCode} ? Saillie du ${frDate(b.breedingDate)}, c’est le moment (J+${age}).`,
        rabbitId: b.femaleId,
        refId: b.id,
        options: [{ value: 'record', label: 'Noter le résultat', tone: 'good', href: '/breeding' }, LATER],
        adviceKey: 'palpation',
        href: '/breeding',
        askAt: nextSlot(at(localDayStart(new Date(b.breedingDate.getTime() + t.palpationFrom * DAY)), SLOT_HOURS[0])),
        expiresAt: new Date(b.breedingDate.getTime() + (t.palpationTo + 1) * DAY),
      });
    }
    // Nid vers J+28 si la lapine est gestante.
    if (b.status === 'PREGNANT' && !b.hasNest && !b.hasBirth && age >= t.nestFrom && age <= t.nestTo) {
      push({
        key: `NEST:${b.id}`,
        kind: 'NEST',
        severity: 'warning',
        title: `Le nid de ${b.femaleCode} est prêt ? Mise bas attendue vers le ${frDate(new Date(b.breedingDate.getTime() + 31 * DAY))}.`,
        rabbitId: b.femaleId,
        refId: b.id,
        options: [{ value: 'record', label: 'Oui, je le note', tone: 'good', href: '/breeding' }, LATER],
        adviceKey: 'nid',
        href: '/breeding',
        askAt: nextSlot(at(localDayStart(new Date(b.breedingDate.getTime() + t.nestFrom * DAY)), SLOT_HOURS[0])),
        expiresAt: new Date(b.breedingDate.getTime() + 32 * DAY),
      });
    }
  }

  // Le lendemain de la mise bas : la mère.
  for (const bi of s.births) {
    const askAt = nextSlot(new Date(bi.createdAt.getTime() + 12 * HOUR));
    push({
      key: `BIRTH:${bi.id}`,
      kind: 'BIRTH_FOLLOWUP',
      severity: 'warning',
      title: `${bi.motherCode} a mis bas (${plural(bi.liveBorn, 'petit vivant', 'petits vivants')}). Elle mange et s’occupe des petits ?`,
      rabbitId: bi.motherId,
      refId: bi.id,
      options: [
        { value: 'good', label: 'Oui, tout va bien', tone: 'good' },
        { value: 'bad', label: 'Non, il y a un souci', tone: 'bad', effect: 'OBSERVE_BAD', adviceKey: 'mere-abandon' },
        NOT_SEEN,
      ],
      adviceKey: 'mise-bas',
      askAt,
      expiresAt: new Date(askAt.getTime() + 2 * DAY),
    });
  }

  // Lapereaux au nid : J+3 et J+7.
  for (const l of s.litters) {
    const age = ageDays(l.birthDate, now);
    for (const day of [3, 7]) {
      if (age < day || age > day + 1 || l.currentCount <= 0) continue;
      push({
        key: `KITS:${l.id}:${day}`,
        kind: 'KITS_FOLLOWUP',
        severity: 'info',
        title: `Les petits de ${l.motherCode} (${l.currentCount}) ont le ventre bien rond ?`,
        detail: 'Un petit qui tète bien a le ventre rond et la peau tendue.',
        rabbitId: l.motherId,
        refId: l.id,
        options: [
          { value: 'good', label: 'Oui', tone: 'good' },
          { value: 'bad', label: 'Non, ils tètent mal', tone: 'bad', effect: 'OBSERVE_BAD', adviceKey: 'lapereaux-lait' },
          NOT_SEEN,
        ],
        adviceKey: 'lapereaux-lait',
        askAt: nextSlot(at(localDayStart(new Date(l.birthDate.getTime() + day * DAY)), SLOT_HOURS[0])),
        expiresAt: new Date(l.birthDate.getTime() + (day + 2) * DAY),
      });
    }
  }

  // Une mort sans cause notée : ce qui a été remarqué avant.
  for (const d of s.deaths) {
    if (d.cause || now.getTime() - d.createdAt.getTime() > 2 * DAY) continue;
    const cause = (value: string, label: string, adviceKey: string): QuestionOption => ({ value, label, tone: 'neutral', effect: 'SET_CAUSE', adviceKey });
    push({
      key: `DEATH:${d.id}`,
      kind: 'DEATH_CAUSE',
      severity: 'warning',
      title: `Mort notée : ${d.label}. Qu’as-tu remarqué avant ?`,
      detail: 'Ta réponse aide à repérer une maladie qui circule.',
      refId: d.id,
      options: [
        cause('Diarrhée', 'Diarrhée', 'diarrhee'),
        cause('Ventre gonflé', 'Ventre gonflé', 'ballonnement'),
        cause('Ne mangeait plus', 'Ne mangeait plus', 'perte-appetit'),
        cause('Nez qui coule ou respiration difficile', 'Nez, respiration', 'coryza'),
        cause('Chaleur', 'Forte chaleur', 'chaleur'),
        cause('Rien remarqué', 'Rien remarqué', 'mortalite-serie'),
      ],
      askAt: nextSlot(new Date(d.createdAt.getTime() + HOUR)),
      expiresAt: new Date(d.createdAt.getTime() + 3 * DAY),
    });
  }

  // Morts en série sur 7 jours : alerte immédiate.
  const recent = s.deaths.filter((d) => now.getTime() - d.date.getTime() <= 7 * DAY);
  const deathCount = recent.reduce((sum, d) => sum + d.count, 0);
  if (deathCount >= t.deathsPerWeek) {
    push({
      key: `DEATHS:${ymd(weekStart(now))}`,
      kind: 'DEATH_CLUSTER',
      severity: 'danger',
      title: `${deathCount} morts en 7 jours : agis maintenant pour protéger les autres lapins`,
      detail: `Concernés : ${[...new Set(recent.map((d) => d.label))].slice(0, 6).join(', ')}. Isole les malades, désinfecte, et appelle un vétérinaire.`,
      options: [{ value: 'ok', label: 'Je m’en occupe', tone: 'good' }],
      adviceKey: 'mortalite-serie',
      askAt: now,
      expiresAt: new Date(now.getTime() + 3 * DAY),
    });
  }

  // Croissance d'un lot d'engraissement.
  for (const lot of s.lots) {
    const [a, b] = lot.weighings.slice(-2);
    if (!a || !b) continue;
    const days = (b.date.getTime() - a.date.getTime()) / DAY;
    if (days < 5) continue;
    const grams = a.averageWeight > 20 && b.averageWeight > 20 ? 1 : 1000; // poids saisis en g ou en kg
    const perDay = Math.round(((b.averageWeight - a.averageWeight) * grams) / days);
    if (perDay >= t.growthMinGrams) continue;
    push({
      key: `GROWTH:${lot.id}:${ymd(b.date)}`,
      kind: 'GROWTH',
      severity: 'warning',
      title: `Le lot ${lot.code} prend ${perDay} g par jour, moins que prévu (25 à 35 g)`,
      detail: 'Vérifie l’aliment, l’eau, la chaleur et les crottes.',
      refId: lot.id,
      options: [{ value: 'check', label: 'Je vérifie', tone: 'good', href: `/fattening/${lot.id}` }, OK],
      adviceKey: 'croissance-lente',
      askAt: nextSlot(now),
      expiresAt: new Date(now.getTime() + 4 * DAY),
    });
  }

  // Forte chaleur : aujourd'hui (tournée de midi) ou demain (la veille au soir).
  if (s.heat) {
    const tomorrow = new Date(today.getTime() + DAY);
    for (const [temp, day, when] of [[s.heat.today, today, 'aujourd’hui'], [s.heat.tomorrow, tomorrow, 'demain']] as const) {
      if (temp == null || temp < t.heatWarn) continue;
      push({
        key: `HEAT:${ymd(day)}`,
        kind: 'HEAT',
        severity: temp >= t.heatDanger ? 'danger' : 'warning',
        title: `${Math.round(temp)} °C prévus ${when} : protège tes lapins de la chaleur`,
        detail: 'Eau fraîche à volonté, ombre, pas de saillie ni de transport aux heures chaudes.',
        options: [OK],
        adviceKey: 'chaleur',
        askAt: now,
        expiresAt: new Date(day.getTime() + DAY),
      });
    }
  }

  // Aliment bientôt épuisé (une fois par semaine au plus).
  for (const f of s.feed) {
    const daysLeft = f.dailyUse && f.dailyUse > 0 ? Math.floor(f.currentStock / f.dailyUse) : null;
    const low = (daysLeft != null && daysLeft < t.stockDays) || (f.minimumStock != null && f.currentStock <= f.minimumStock);
    if (!low) continue;
    push({
      key: `STOCK:${f.id}:${ymd(weekStart(now))}`,
      kind: 'STOCK',
      severity: daysLeft != null && daysLeft <= 2 ? 'danger' : 'warning',
      title: daysLeft != null
        ? `Il reste environ ${plural(daysLeft, 'jour')} de ${f.name}`
        : `${f.name} est sous le stock minimum (${f.currentStock} ${f.unit})`,
      detail: 'Un changement brusque d’aliment provoque des diarrhées : rachète la même marque si possible.',
      refId: f.id,
      options: [{ value: 'buy', label: 'Noter un achat', tone: 'good', href: '/operations/inventory' }, { ...LATER, snoozeDays: 2 }],
      adviceKey: 'stock-aliment',
      askAt: nextSlot(now),
      expiresAt: new Date(now.getTime() + 7 * DAY),
    });
  }

  for (const f of s.femalesFailed) {
    push({
      key: `FAIL:${f.id}:${f.misses}`,
      kind: 'FEMALE_FAILED',
      severity: 'info',
      title: `${f.code} a raté ${f.misses} saillies de suite. Faut-il la réformer ?`,
      rabbitId: f.id,
      options: [
        { value: 'advice', label: 'Voir les conseils', tone: 'neutral', adviceKey: 'reforme-femelle' },
        { value: 'keep', label: 'Je la garde', tone: 'good' },
      ],
      adviceKey: 'reforme-femelle',
      askAt: nextSlot(now),
      expiresAt: new Date(now.getTime() + 14 * DAY),
    });
  }

  for (const m of s.malesToday) {
    if (m.matings < 2) continue;
    push({
      key: `MALE:${m.id}:${ymd(now)}`,
      kind: 'MALE_REST',
      severity: 'info',
      title: `${m.code} a déjà fait ${m.matings} saillies aujourd’hui : laisse-le se reposer demain.`,
      rabbitId: m.id,
      options: [OK],
      adviceKey: 'repos-male',
      askAt: nextSlot(now),
      expiresAt: new Date(today.getTime() + 2 * DAY),
    });
  }

  if (s.readyCount > 0) {
    push({
      key: `READY:${ymd(weekStart(now))}`,
      kind: 'READY_TO_SELL',
      severity: 'info',
      title: `${plural(s.readyCount, 'lapin est prêt', 'lapins sont prêts')} à vendre. Tu as un acheteur ?`,
      detail: 'Chaque jour de plus coûte de l’aliment.',
      options: [{ value: 'see', label: 'Voir les lapins prêts', tone: 'good', href: '/sales/ready' }, { ...LATER, snoozeDays: 3 }],
      adviceKey: 'vente',
      askAt: nextSlot(now),
      expiresAt: new Date(now.getTime() + 7 * DAY),
    });
  }

  // Rien noté depuis quelques jours : un mot le soir.
  if (s.rabbitsActive > 0 && s.lastActivityAt && ageDays(s.lastActivityAt, now) >= t.idleDays) {
    const idle = ageDays(s.lastActivityAt, now);
    push({
      key: `IDLE:${ymd(s.lastActivityAt)}`,
      kind: 'IDLE',
      severity: 'info',
      title: `Tout va bien à la ferme ? Rien n’a été noté depuis ${plural(idle, 'jour')}.`,
      options: [
        { value: 'good', label: 'Oui, tout va bien', tone: 'good' },
        { value: 'issue', label: 'J’ai un souci', tone: 'bad', href: '/health', adviceKey: 'tout-va-bien' },
      ],
      adviceKey: 'tout-va-bien',
      askAt: nextSlot(at(today, SLOT_HOURS[2])),
      expiresAt: new Date(today.getTime() + 2 * DAY),
    });
  }

  // Démarrage : une étape à la fois pendant la première semaine.
  if (s.setup?.next && s.setup.farmAgeDays <= SETUP_GUIDE_DAYS) {
    const step = s.setup.next;
    push({
      key: `SETUP:${step.key}:${ymd(today)}`,
      kind: 'SETUP',
      severity: 'info',
      title: step.title,
      detail: step.detail,
      options: [
        { value: 'go', label: 'On le fait maintenant', tone: 'good', href: step.href },
        ...(step.altHref ? [{ value: 'alt', label: step.altLabel ?? 'Autrement', tone: 'good' as const, href: step.altHref }] : []),
        LATER,
      ],
      href: step.href,
      askAt: now,
      expiresAt: new Date(now.getTime() + 3 * DAY),
    });
  }

  // Bilan du dimanche soir.
  if (s.week && localWeekday(now) === 0) {
    const w = s.week;
    const weekNo = Math.floor(weekStart(now).getTime() / (7 * DAY));
    const tip = w.deaths > 0 ? 'mortalite-serie' : WEEKLY_TIPS[weekNo % WEEKLY_TIPS.length];
    push({
      key: `WEEK:${ymd(today)}`,
      kind: 'WEEKLY',
      severity: 'info',
      title: `Ta semaine : ${plural(w.births, 'naissance')}, ${plural(w.deaths, 'mort')}, ${plural(w.sales, 'vente')} (${fcfa(w.salesAmount)}), ${fcfa(w.expenses)} de dépenses`,
      detail: w.deaths > 0
        ? 'Il y a eu des morts cette semaine : relis la fiche ci-dessous et note la cause de chacune.'
        : 'Bonne semaine ! Un conseil pour la suivante ci-dessous.',
      options: [{ value: 'ok', label: 'Merci', tone: 'good' }],
      adviceKey: tip,
      href: '/statistics',
      askAt: nextSlot(at(today, SLOT_HOURS[2])),
      expiresAt: new Date(today.getTime() + 3 * DAY),
    });
  }

  return out;
}

export const SEVERITY_RANK: Record<string, number> = { danger: 0, warning: 1, info: 2 };
