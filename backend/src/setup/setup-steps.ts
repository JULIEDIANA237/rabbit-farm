/**
 * Démarrage d'une ferme : les étapes qui rendent l'app utile dès la première semaine.
 * Fonctions pures, testées ; l'assistant « bras droit » s'en sert pour guider l'éleveur.
 */

export interface SetupCounts {
  hasLocation: boolean;
  cages: number;
  females: number;
  males: number;
  breedings: number;
  stockItems: number;
  pushSubscriptions: number;
}

export interface SetupStep {
  key: string;
  title: string;
  detail: string;
  href: string;
  /** Autre façon de faire (ex. photo du cahier). */
  altLabel?: string;
  altHref?: string;
  done: boolean;
}

/** Durée pendant laquelle l'assistant propose une étape de démarrage à chaque tournée. */
export const SETUP_GUIDE_DAYS = 7;
/** Au-delà, le menu simplifié n'est plus proposé par défaut. */
export const BEGINNER_DAYS = 30;

const IMPORT = { altLabel: 'Avec une photo de mon cahier', altHref: '/import' };

export function setupSteps(c: SetupCounts): SetupStep[] {
  return [
    {
      key: 'FEMALES',
      title: 'Ajoute tes femelles reproductrices',
      detail: 'Un code par lapine (ex. F01). Le plus rapide : photographier ton cahier.',
      href: '/rabbits/new',
      ...IMPORT,
      done: c.females > 0,
    },
    {
      key: 'MALES',
      title: 'Ajoute tes mâles',
      detail: 'L’app vérifiera ensuite qu’un mâle ne fait pas plus de 2 saillies par jour.',
      href: '/rabbits/new',
      ...IMPORT,
      done: c.males > 0,
    },
    {
      key: 'CAGES',
      title: 'Crée tes cages',
      detail: 'Tu sauras toujours où se trouve chaque lapin.',
      href: '/farm?new=1',
      done: c.cages > 0,
    },
    {
      key: 'BREEDING',
      title: 'Note ta dernière saillie',
      detail: 'Même ancienne : l’app calcule la palpation, le nid et la mise bas, et te les rappelle.',
      href: '/breeding?new=1',
      ...IMPORT,
      done: c.breedings > 0,
    },
    {
      key: 'STOCK',
      title: 'Note ton stock d’aliment',
      detail: 'L’app te prévient avant que les granulés manquent.',
      href: '/operations/inventory?new=1',
      done: c.stockItems > 0,
    },
    {
      key: 'LOCATION',
      title: 'Indique la ville de ta ferme',
      detail: 'Pour t’alerter les jours de forte chaleur.',
      href: '/questions?tab=settings',
      done: c.hasLocation,
    },
    {
      key: 'NOTIFICATIONS',
      title: 'Active les notifications',
      detail: 'L’assistant te parle à 6 h, 13 h et 18 h, même app fermée.',
      href: '/questions?tab=settings',
      done: c.pushSubscriptions > 0,
    },
  ];
}

export function setupProgress(c: SetupCounts) {
  const steps = setupSteps(c);
  const done = steps.filter((s) => s.done).length;
  return {
    steps,
    done,
    total: steps.length,
    percent: Math.round((done / steps.length) * 100),
    next: steps.find((s) => !s.done) ?? null,
  };
}
