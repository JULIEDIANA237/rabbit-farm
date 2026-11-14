/**
 * Bulles d'aide affichées à la première visite de chaque module.
 * `question` est envoyée à l'assistant IA quand l'éleveur demande plus d'aide.
 */
export interface ModuleGuide {
  key: string;
  title: string;
  steps: string[];
  question: string;
}

const GUIDES: Array<{ prefix: string; guide: ModuleGuide }> = [
  {
    prefix: '/dashboard',
    guide: {
      key: 'dashboard',
      title: 'Bienvenue sur RabbitFarm',
      steps: [
        'Cette page résume ta ferme : lapins actifs, tâches du jour, alertes de stock et santé.',
        'Commence par créer tes sections et cages (menu Ferme), puis enregistre tes lapins.',
        'Les tâches (palpation, nid, sevrage…) se créent toutes seules à partir de tes saisies.',
        'Le bouton + en bas de l’écran ouvre les saisies rapides sur téléphone.',
      ],
      question: 'Par quoi je commence pour bien configurer ma ferme dans RabbitFarm ?',
    },
  },
  {
    prefix: '/kits',
    guide: {
      key: 'kits',
      title: 'Les lapereaux',
      steps: [
        'Les lapereaux sont créés automatiquement à chaque mise bas, avec un code de portée (ex. L002-03).',
        'Ouvre une fiche pour déterminer le sexe, peser, soigner ou enregistrer un décès.',
        'Un lapereau gardé pour la reproduction passe dans Lapins quand tu choisis « futur reproducteur ».',
      ],
      question: 'Comment suivre mes lapereaux de la naissance à la vente ?',
    },
  },
  {
    prefix: '/rabbits',
    guide: {
      key: 'rabbits',
      title: 'Tes lapins',
      steps: [
        'Ajoute chaque reproducteur avec « Nouveau lapin » : code, sexe, race, parents si tu les connais.',
        'La fiche d’un lapin regroupe ses photos, sa cage, sa santé, ses portées et sa généalogie.',
        'Les lapereaux nés à la ferme ont leur propre page « Lapereaux ».',
        'Une erreur ? « Modifier » corrige la fiche ; la corbeille supprime un lapin créé par erreur.',
      ],
      question: 'Comment bien enregistrer mes lapins reproducteurs ?',
    },
  },
  {
    prefix: '/genetics',
    guide: {
      key: 'genetics',
      title: 'Génétique',
      steps: [
        'Vérifie la compatibilité d’un couple avant la saillie pour éviter la consanguinité.',
        'L’arbre affiche les grands-parents en haut, puis le père et la mère, puis le lapin.',
      ],
      question: 'Comment éviter la consanguinité dans mon élevage ?',
    },
  },
  {
    prefix: '/breeding',
    guide: {
      key: 'breeding',
      title: 'Reproduction',
      steps: [
        '« Nouvelle saillie » : choisis la femelle, le mâle et la date (une date passée est acceptée).',
        'L’app planifie la palpation (J+10 à J+14), le nid (J+28) et la mise bas (J+31).',
        'Enregistre la palpation, puis le nid, puis la mise bas avec les boutons de chaque ligne.',
        'Le crayon corrige la date ou le mâle ; la corbeille supprime une saillie saisie par erreur.',
      ],
      question: 'Explique-moi le cycle de reproduction d’une lapine dans RabbitFarm.',
    },
  },
  {
    prefix: '/births',
    guide: {
      key: 'births',
      title: 'Naissances',
      steps: [
        'Les mises bas s’enregistrent depuis Reproduction, sur un accouplement confirmé gestant.',
        'Chaque portée a sa fiche : affectation en cage, mortalité, adoption et sevrage.',
        'Une mise bas saisie par erreur peut être corrigée ou supprimée tant que les lapereaux n’ont pas d’historique.',
      ],
      question: 'Que dois-je surveiller après une mise bas ?',
    },
  },
  {
    prefix: '/litters',
    guide: {
      key: 'litters',
      title: 'Fiche de portée',
      steps: [
        'Coche des lapereaux pour les mettre en cage, les faire adopter ou les sevrer.',
        'Chaque action a un champ date : tu peux enregistrer un événement passé.',
      ],
      question: 'Comment gérer une portée jusqu’au sevrage ?',
    },
  },
  {
    prefix: '/weaning',
    guide: {
      key: 'weaning',
      title: 'Sevrage',
      steps: [
        'Le sevrage est prévu vers 35 jours ; « Réaliser » l’enregistre avec le poids.',
        'Les lapereaux sevrés peuvent rejoindre directement un lot d’engraissement.',
      ],
      question: 'Quand et comment sevrer mes lapereaux ?',
    },
  },
  {
    prefix: '/fattening',
    guide: {
      key: 'fattening',
      title: 'Engraissement',
      steps: [
        'Crée un lot, ajoute des lapins, puis pèse le lot régulièrement pour suivre le gain quotidien.',
        'Un lot se vend en entier depuis sa fiche (« Vendre le lot »).',
      ],
      question: 'Comment suivre un lot d’engraissement et savoir quand le vendre ?',
    },
  },
  {
    prefix: '/health',
    guide: {
      key: 'health',
      title: 'Santé',
      steps: [
        'Note un symptôme, un traitement ou un vaccin ; une « prochaine échéance » crée un rappel.',
        'Les soins à faire dans les 14 jours apparaissent en haut de la page.',
        'En cas de doute ou de mortalité, demande conseil à un vétérinaire.',
      ],
      question: 'Quels soins de base dois-je prévoir pour mes lapins ?',
    },
  },
  {
    prefix: '/sales',
    guide: {
      key: 'sales',
      title: 'Ventes',
      steps: [
        'Vends à l’unité, au poids ou un lot entier ; les lapins vendus sortent de l’élevage.',
        'Ajoute les paiements au fur et à mesure : le reste à encaisser se met à jour.',
        'Le crayon corrige la date, le client ou supprime un paiement ; la corbeille supprime la vente.',
      ],
      question: 'Comment enregistrer une vente avec un paiement en plusieurs fois ?',
    },
  },
  {
    prefix: '/operations/inventory',
    guide: {
      key: 'inventory',
      title: 'Stock',
      steps: [
        'Crée tes articles (granulés, foin, médicaments) avec leur prix unitaire et leur stock initial.',
        'Dans « Rations journalières », indique la quantité donnée par lapin et par jour : gestantes, allaitantes, engraissement et autres.',
        'L’app calcule le besoin de la ferme, le coût par jour et la date de rupture ; « Déduire » retire les rations du stock.',
        'Sous le stock minimum, une tâche de réapprovisionnement est créée.',
      ],
      question: 'Quelles rations journalières donner à mes lapines gestantes, allaitantes, à l’engraissement et aux autres ?',
    },
  },
  {
    prefix: '/operations',
    guide: {
      key: 'expenses',
      title: 'Dépenses',
      steps: [
        'Note chaque dépense (aliment, soins, matériel…) pour connaître ta rentabilité.',
        'Le crayon corrige une dépense, la corbeille la supprime.',
      ],
      question: 'Comment calculer la rentabilité de mon élevage ?',
    },
  },
  {
    prefix: '/tasks',
    guide: {
      key: 'tasks',
      title: 'Tâches',
      steps: [
        'Les tâches automatiques viennent de tes saisies : « Faire » ouvre le bon formulaire.',
        'Ajoute aussi tes propres tâches (nettoyage, achat…).',
      ],
      question: 'Quelles sont mes tâches les plus urgentes aujourd’hui ?',
    },
  },
  {
    prefix: '/statistics',
    guide: {
      key: 'statistics',
      title: 'Statistiques',
      steps: ['Fertilité, prolificité, mortalité et finances, sur la période choisie.'],
      question: 'Analyse les performances de mon élevage ce mois-ci.',
    },
  },
  {
    prefix: '/farm',
    guide: {
      key: 'farm',
      title: 'Tes cages',
      steps: [
        'Crée tes blocs (maternité, engraissement…) puis tes cages avec leur capacité.',
        'Bouton « Lapins » sur une cage : place des lapins dedans, le compteur se met à jour tout seul.',
        'Les races et croisements servent à décrire tes lapins.',
      ],
      question: 'Comment organiser mes blocs et mes cages ?',
    },
  },
];

export function guideFor(pathname: string): ModuleGuide | null {
  const match = GUIDES.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return match?.guide ?? null;
}
