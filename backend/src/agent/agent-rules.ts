/**
 * Règles de l'agent de la propriétaire : à partir des faits de la plateforme,
 * elles disent ce qui demande son attention et préparent l'action à valider.
 * Aucune IA ici : la détection est déterministe et testée.
 */

export const HOUR = 3_600_000;
export const DAY = 24 * HOUR;

export type AgentAction = 'NONE' | 'CONFIRM_PAYMENT' | 'EXTEND_TRIAL' | 'SEND_EMAIL' | 'REPLY_CONTACT';
export type Severity = 'danger' | 'warning' | 'info';

export interface Finding {
  key: string;
  kind: string;
  severity: Severity;
  title: string;
  detail?: string;
  href?: string;
  action: AgentAction;
  targetId?: string;
  recipient?: string;
  subject?: string;
  draft?: string;
}

export interface FarmFacts {
  id: string;
  name: string;
  createdAt: Date;
  /** TRIAL | ACTIVE | EXPIRED | EXEMPT */
  status: string;
  daysLeft: number;
  trialEndsAt: Date;
  paidUntil: Date | null;
  ownerEmail: string | null;
  ownerFirstName: string | null;
  rabbits: number;
  lastSeenAt: Date | null;
}

export interface AgentFacts {
  now: Date;
  monthlyPrice: number;
  yearlyPrice: number;
  appUrl: string;
  pendingPayments: Array<{ id: string; farmName: string; amount: number; plan: string; reference: string | null; createdAt: Date }>;
  farms: FarmFacts[];
  newUsers24h: number;
  newFarms24h: number;
  contacts: Array<{ id: string; name: string; contact: string; message: string; createdAt: Date }>;
  lowRatings: Array<{ id: string; stars: number; comment: string | null; farmName: string | null; updatedAt: Date }>;
  errors24h: number;
  lastError: string | null;
  dbSizeMb: number | null;
  dbLimitMb: number;
  /** Nombre total de comptes utilisateurs. */
  totalUsers: number;
  /** Offre d'hébergement Vercel déclarée (variable HOSTING_PLAN) : « hobby » tant qu'elle n'est pas « pro ». */
  hostingPlan: string;
}

/** Seuils proposés à Diana (réglables plus tard). */
export const THRESHOLDS = {
  paymentLateHours: 24,
  trialEndingDays: 3,
  renewalDays: 7,
  expiredLookbackDays: 14,
  setupStuckDays: 3,
  dormantDays: 14,
  activeRabbits: 5,
  recentlyActiveDays: 7,
  extendDays: 7,
  ratingLookbackDays: 7,
  errorsPerDay: 5,
  dbWarnShare: 0.8,
  maxDormant: 5,
  /** Rappel de passer à Vercel Pro à partir de ce nombre d'utilisateurs (ou dès le premier abonné payant). */
  vercelProUsers: 20,
};

export const fcfa = (n: number) => `${n.toLocaleString('fr-FR').replace(/ | /g, ' ')} FCFA`;
export const ymd = (d: Date) => d.toISOString().slice(0, 10);
const frDate = (d: Date) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', timeZone: 'Africa/Douala' });

function ago(from: Date, now: Date) {
  const hours = Math.max(0, Math.floor((now.getTime() - from.getTime()) / HOUR));
  if (hours < 1) return 'moins d’une heure';
  if (hours < 48) return `${hours} h`;
  return `${Math.floor(hours / 24)} jours`;
}

const hello = (f: FarmFacts) => `Bonjour${f.ownerFirstName ? ` ${f.ownerFirstName}` : ''},`;
const SIGNATURE = '\n\nÀ bientôt,\nL’équipe RabbitFarm';

/** Brouillons des messages aux éleveurs (modifiables avant envoi). */
export const drafts = {
  trialEnding: (f: FarmFacts, facts: AgentFacts) =>
    `${hello(f)}\n\nTon essai gratuit de RabbitFarm pour « ${f.name} » se termine le ${frDate(f.trialEndsAt)}. ` +
    `Pour continuer à suivre tes saillies, mises bas et ventes sans interruption, tu peux t’abonner pour ${fcfa(facts.monthlyPrice)} par mois ` +
    `ou ${fcfa(facts.yearlyPrice)} par an, par Mobile Money, depuis la page Abonnement de l’app : ${facts.appUrl}/subscription\n\n` +
    `Tes données restent à toi : sans abonnement, l’app passe simplement en lecture seule.${SIGNATURE}`,
  expired: (f: FarmFacts, facts: AgentFacts) =>
    `${hello(f)}\n\nTon accès à RabbitFarm pour « ${f.name} » est maintenant en lecture seule : tu vois toutes tes données, mais tu ne peux plus en ajouter. ` +
    `Pour reprendre tes saisies, abonne-toi depuis la page Abonnement : ${facts.appUrl}/subscription (${fcfa(facts.monthlyPrice)} par mois ou ${fcfa(facts.yearlyPrice)} par an).\n\n` +
    `Une question ? Réponds simplement à ce message.${SIGNATURE}`,
  renewal: (f: FarmFacts, facts: AgentFacts) =>
    `${hello(f)}\n\nMerci d’utiliser RabbitFarm ! Ton abonnement pour « ${f.name} » se termine le ${frDate(f.paidUntil ?? facts.now)}. ` +
    `Pour le renouveler, rends-toi sur la page Abonnement : ${facts.appUrl}/subscription${SIGNATURE}`,
  setup: (f: FarmFacts, facts: AgentFacts) =>
    `${hello(f)}\n\nTu as créé « ${f.name} » sur RabbitFarm il y a quelques jours. Pour bien démarrer :\n` +
    `1. crée tes cages (menu Cages) ;\n2. enregistre tes lapins reproducteurs ;\n3. note ta prochaine saillie : l’app calculera la suite.\n\n` +
    `Si tu bloques quelque part, réponds à ce message, nous t’aidons volontiers. L’app : ${facts.appUrl}/dashboard${SIGNATURE}`,
  dormant: (f: FarmFacts, facts: AgentFacts) =>
    `${hello(f)}\n\nCela fait un moment que tu ne t’es pas connecté à RabbitFarm. Tes rappels du jour (palpations, nids, sevrages) t’attendent : ${facts.appUrl}/tasks\n\n` +
    `Quelque chose ne te convient pas dans l’app ? Dis-le-nous en répondant à ce message.${SIGNATURE}`,
  contact: (c: AgentFacts['contacts'][number]) =>
    `Bonjour ${c.name},\n\nMerci pour ton message sur RabbitFarm. ` +
    `[Réponse à compléter]\n\nÀ bientôt,\nL’équipe RabbitFarm`,
};

/** Ce qui demande l'attention de la propriétaire, le plus urgent d'abord. */
export function detect(facts: AgentFacts, t = THRESHOLDS): Finding[] {
  const { now } = facts;
  const out: Finding[] = [];

  for (const p of facts.pendingPayments) {
    const late = now.getTime() - p.createdAt.getTime() > t.paymentLateHours * HOUR;
    out.push({
      key: `PAYMENT:${p.id}`,
      kind: 'PAYMENT',
      severity: late ? 'danger' : 'warning',
      title: `Paiement de ${fcfa(p.amount)} à confirmer : ${p.farmName}`,
      detail: `Formule ${p.plan === 'YEARLY' ? 'annuelle' : 'mensuelle'}, déclaré il y a ${ago(p.createdAt, now)}. Référence : ${p.reference ?? 'aucune'}. Vérifie-la sur ton relevé Mobile Money avant de valider.`,
      href: '/admin/payments',
      action: 'CONFIRM_PAYMENT',
      targetId: p.id,
    });
  }

  for (const c of facts.contacts) {
    out.push({
      key: `CONTACT:${c.id}`,
      kind: 'CONTACT',
      severity: 'warning',
      title: `Message de ${c.name} à traiter`,
      detail: `« ${c.message.length > 160 ? `${c.message.slice(0, 157)}…` : c.message} » (${c.contact}, il y a ${ago(c.createdAt, now)})`,
      href: '/admin/messages',
      action: 'REPLY_CONTACT',
      targetId: c.id,
      recipient: c.contact,
      subject: 'Réponse à ton message sur RabbitFarm',
      draft: drafts.contact(c),
    });
  }

  if (facts.errors24h >= t.errorsPerDay) {
    out.push({
      key: `ERRORS:${ymd(now)}`,
      kind: 'ERRORS',
      severity: 'danger',
      title: `${facts.errors24h} erreurs du serveur en 24 h`,
      detail: facts.lastError ? `Dernière : ${facts.lastError.slice(0, 200)}` : undefined,
      action: 'NONE',
    });
  }

  if (facts.dbSizeMb != null && facts.dbSizeMb >= facts.dbLimitMb * t.dbWarnShare) {
    out.push({
      key: `DB:${ymd(now).slice(0, 7)}`,
      kind: 'DATABASE',
      severity: 'warning',
      title: `Base de données à ${Math.round((facts.dbSizeMb / facts.dbLimitMb) * 100)} % de sa limite`,
      detail: `${Math.round(facts.dbSizeMb)} Mo sur ${facts.dbLimitMb} Mo (offre gratuite Neon). Prévois de passer à l’offre payante.`,
      action: 'NONE',
    });
  }

  const paying = facts.farms.filter((f) => f.status === 'ACTIVE').length;
  if (facts.hostingPlan !== 'pro' && (facts.totalUsers >= t.vercelProUsers || paying > 0)) {
    out.push({
      key: `HOSTING:${ymd(now).slice(0, 7)}`,
      kind: 'HOSTING',
      severity: 'warning',
      title: 'Passe l’hébergement à Vercel Pro',
      detail:
        `${facts.totalUsers} utilisateurs, ${paying} élevage${paying > 1 ? 's' : ''} abonné${paying > 1 ? 's' : ''}. ` +
        'L’offre gratuite de Vercel (Hobby) est réservée à un usage non commercial : passe les projets farm_backend et rabbit-farm à Pro (~20 $ par mois). ' +
        'Ensuite, ajoute HOSTING_PLAN=pro dans les variables de farm_backend pour arrêter ce rappel.',
      action: 'NONE',
    });
  }

  for (const r of facts.lowRatings) {
    if (now.getTime() - r.updatedAt.getTime() > t.ratingLookbackDays * DAY) continue;
    out.push({
      key: `RATING:${r.id}:${ymd(r.updatedAt)}`,
      kind: 'RATING',
      severity: 'warning',
      title: `Avis à ${r.stars} étoile${r.stars > 1 ? 's' : ''}${r.farmName ? ` : ${r.farmName}` : ''}`,
      detail: r.comment ? `« ${r.comment.slice(0, 200)} »` : 'Sans commentaire.',
      href: '/admin/reviews',
      action: 'NONE',
    });
  }

  let dormant = 0;
  for (const f of facts.farms) {
    if (f.status === 'EXEMPT') continue;
    const email = f.ownerEmail ?? undefined;
    const mail = (key: string, kind: string, severity: Severity, title: string, detail: string, subject: string, draft: string) => {
      if (!email) return;
      out.push({ key, kind, severity, title, detail, href: '/admin/farms', action: 'SEND_EMAIL', targetId: f.id, recipient: email, subject, draft });
    };

    if (f.status === 'TRIAL' && f.daysLeft <= t.trialEndingDays) {
      mail(
        `TRIAL_END:${f.id}:${ymd(f.trialEndsAt)}`, 'TRIAL_ENDING', 'warning',
        `Essai de ${f.name} : fin dans ${f.daysLeft} jour${f.daysLeft > 1 ? 's' : ''}`,
        `${f.rabbits} lapin(s) enregistré(s). Je propose un rappel pour l’inviter à s’abonner.`,
        'Ton essai RabbitFarm se termine bientôt', drafts.trialEnding(f, facts),
      );
    }

    if (f.status === 'EXPIRED') {
      const end = f.paidUntil && f.paidUntil > f.trialEndsAt ? f.paidUntil : f.trialEndsAt;
      if (now.getTime() - end.getTime() <= t.expiredLookbackDays * DAY) {
        const active = f.rabbits >= t.activeRabbits && !!f.lastSeenAt && now.getTime() - f.lastSeenAt.getTime() <= t.recentlyActiveDays * DAY;
        if (active && !f.paidUntil) {
          out.push({
            key: `EXTEND:${f.id}:${ymd(end)}`,
            kind: 'EXTEND_TRIAL',
            severity: 'info',
            title: `Offrir ${t.extendDays} jours d’essai à ${f.name} ?`,
            detail: `Élevage actif (${f.rabbits} lapins, connecté récemment) mais en lecture seule depuis le ${frDate(end)}. Quelques jours de plus peuvent le décider à s’abonner.`,
            href: '/admin/farms',
            action: 'EXTEND_TRIAL',
            targetId: f.id,
          });
        }
        mail(
          `EXPIRED:${f.id}:${ymd(end)}`, 'EXPIRED', 'info',
          `${f.name} est en lecture seule`,
          `Depuis le ${frDate(end)}. Je propose un message pour l’inviter à s’abonner.`,
          'Ton accès RabbitFarm est en lecture seule', drafts.expired(f, facts),
        );
      }
    }

    if (f.status === 'ACTIVE' && f.paidUntil && f.daysLeft <= t.renewalDays) {
      mail(
        `RENEW:${f.id}:${ymd(f.paidUntil)}`, 'RENEWAL', 'info',
        `Abonnement de ${f.name} : fin dans ${f.daysLeft} jour${f.daysLeft > 1 ? 's' : ''}`,
        'Je propose un rappel de renouvellement.',
        'Ton abonnement RabbitFarm arrive à échéance', drafts.renewal(f, facts),
      );
    }

    if (f.status === 'TRIAL' && f.rabbits === 0 && now.getTime() - f.createdAt.getTime() >= t.setupStuckDays * DAY) {
      mail(
        `SETUP:${f.id}`, 'SETUP_STUCK', 'info',
        `${f.name} n’a encore aucun lapin`,
        `Inscrit depuis ${ago(f.createdAt, now)}. Je propose un message d’aide pour démarrer.`,
        'Besoin d’aide pour démarrer sur RabbitFarm ?', drafts.setup(f, facts),
      );
    }

    if (
      (f.status === 'TRIAL' || f.status === 'ACTIVE') && f.rabbits > 0 && f.lastSeenAt &&
      now.getTime() - f.lastSeenAt.getTime() > t.dormantDays * DAY && dormant < t.maxDormant
    ) {
      dormant += 1;
      mail(
        `DORMANT:${f.id}:${ymd(f.lastSeenAt)}`, 'DORMANT', 'info',
        `${f.name} ne s’est pas connecté depuis ${ago(f.lastSeenAt, now)}`,
        'Je propose un message pour prendre de ses nouvelles.',
        'Tes rappels RabbitFarm t’attendent', drafts.dormant(f, facts),
      );
    }
  }

  const rank: Record<Severity, number> = { danger: 0, warning: 1, info: 2 };
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

/** Point du matin sans IA : quelques phrases simples, la plus urgente d'abord. */
export function plainBrief(facts: AgentFacts, findings: Finding[]) {
  const count = (kind: string) => findings.filter((f) => f.kind === kind).length;
  const lines: string[] = [];
  const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;
  if (count('ERRORS')) lines.push(`Le serveur a eu ${facts.errors24h} erreurs en 24 h : à regarder en premier.`);
  if (count('PAYMENT')) lines.push(`${plural(count('PAYMENT'), 'paiement attend', 'paiements attendent')} ta confirmation.`);
  if (count('CONTACT')) lines.push(`${plural(count('CONTACT'), 'message de contact', 'messages de contact')} à traiter.`);
  if (count('TRIAL_ENDING')) lines.push(`${plural(count('TRIAL_ENDING'), 'essai se termine', 'essais se terminent')} dans les 3 jours.`);
  if (count('EXPIRED') || count('EXTEND_TRIAL')) lines.push(`${plural(count('EXPIRED'), 'élevage est passé', 'élevages sont passés')} en lecture seule récemment.`);
  if (count('RENEWAL')) lines.push(`${plural(count('RENEWAL'), 'abonnement arrive', 'abonnements arrivent')} à échéance cette semaine.`);
  if (count('RATING')) lines.push(`${plural(count('RATING'), 'avis négatif', 'avis négatifs')} cette semaine.`);
  if (count('SETUP_STUCK') || count('DORMANT')) lines.push(`${count('SETUP_STUCK') + count('DORMANT')} élevage(s) à relancer (pas démarré ou inactif).`);
  if (count('DATABASE')) lines.push('La base de données approche de sa limite gratuite.');
  if (facts.newUsers24h || facts.newFarms24h) {
    lines.push(`Depuis hier : ${plural(facts.newUsers24h, 'nouveau compte', 'nouveaux comptes')}, ${plural(facts.newFarms24h, 'nouvel élevage', 'nouveaux élevages')}.`);
  }
  if (lines.length === 0) lines.push('Rien d’urgent ce matin : aucun paiement, message ou essai à traiter.');
  return lines.join('\n');
}
