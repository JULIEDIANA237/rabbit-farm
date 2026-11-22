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
        'Suis la carte « Ta ferme est prête à … % » : elle te donne l’étape suivante. Le plus rapide pour démarrer : la photo de ton cahier.',
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
    prefix: '/sales/ready',
    guide: {
      key: 'sales-ready',
      title: 'Prêts pour la vente',
      steps: [
        'L’app liste les lapins qui ont l’âge et le poids pour être vendus.',
        'Coche ceux que tu veux vendre, puis crée la vente en une fois.',
        'Pèse tes lapins régulièrement : la liste se base sur la dernière pesée.',
      ],
      question: 'Comment savoir quels lapins sont prêts à être vendus ?',
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
  {
    prefix: '/care',
    guide: {
      key: 'care',
      title: 'Les soins',
      steps: [
        'Note chaque soin donné : nettoyage, vermifuge, vitamines, vaccin…',
        'Un soin peut viser toute la ferme, un bloc, une cage, un lot ou un seul lapin.',
        'Indique la date du prochain soin : une tâche te le rappellera.',
      ],
      question: 'Quels soins réguliers dois-je donner à mes lapins ?',
    },
  },
  {
    prefix: '/remating',
    guide: {
      key: 'remating',
      title: 'Nouvelle saillie après la mise bas',
      steps: [
        'Pèse la femelle et réponds aux questions sur son état.',
        'L’app te dit si elle est prête, ou dans combien de jours la revoir.',
        'Si elle est prête, la tâche se ferme toute seule ; sinon elle est reportée.',
      ],
      question: 'Quand une lapine peut-elle être ressaillie après une mise bas ?',
    },
  },
  {
    prefix: '/import',
    guide: {
      key: 'import',
      title: 'Photo du cahier',
      steps: [
        'Pose la page de ton cahier à plat, à la lumière, et prends-la en photo.',
        'L’assistant lit tes lapins et tes saillies : corrige un code ou une date si besoin, décoche ce que tu ne veux pas.',
        '« Tout enregistrer » crée les lapins puis les saillies, avec leurs palpations et mises bas à venir dans tes tâches.',
      ],
      question: 'Comment bien écrire mon cahier pour que la photo soit lue ?',
    },
  },
  {
    prefix: '/questions',
    guide: {
      key: 'questions',
      title: 'Ton assistant',
      steps: [
        'À 6 h, 13 h et 18 h, l’assistant fait le tour de ta ferme et pose une question quand un lapin mérite un suivi.',
        'Réponds en un geste : « Il va mal » ajoute une observation et une tâche de contrôle pour demain.',
        'Dans Réglages, choisis le nombre de notifications par jour et la ville de ta ferme pour les alertes de chaleur.',
      ],
      question: 'Que dois-je surveiller après une injection ?',
    },
  },
  {
    prefix: '/advice',
    guide: {
      key: 'advice',
      title: 'Fiches conseils',
      steps: [
        'Chaque fiche dit ce qu’on observe, ce qu’il faut faire et quand appeler le vétérinaire.',
        'Cherche par mot : diarrhée, chaleur, nid…',
        'L’assistant te propose la bonne fiche quand il te pose une question.',
      ],
      question: 'Comment protéger mes lapins de la chaleur ?',
    },
  },
  {
    prefix: '/tools',
    guide: {
      key: 'tools',
      title: 'Boîte à outils',
      steps: [
        'Calcule les dates d’une saillie (palpation, nid, mise bas, sevrage).',
        'Calcule la provende nécessaire selon le nombre de lapins.',
        'Les raccourcis mènent directement aux saisies les plus courantes.',
      ],
      question: 'Quelles sont les dates clés après une saillie ?',
    },
  },
  {
    prefix: '/subscription',
    guide: {
      key: 'subscription',
      title: 'Ton abonnement',
      steps: [
        'Le premier mois est gratuit. Ensuite : 1 000 FCFA par mois ou 10 000 FCFA par an.',
        'Paie par Mobile Money en suivant les consignes, puis appuie sur « J’ai payé ».',
        'Ton accès est prolongé dès que le paiement est confirmé.',
      ],
      question: 'Comment fonctionne l’abonnement RabbitFarm ?',
    },
  },
  {
    prefix: '/settings',
    guide: {
      key: 'settings',
      title: 'Paramètres',
      steps: [
        'Modifie le nom et la localisation de ta ferme.',
        'Ajoute les membres de ton équipe avec leur rôle.',
        'Choisis l’apparence (Jour, Nuit, Plein soleil) et active les rappels du jour.',
      ],
      question: 'Comment ajouter un employé à ma ferme ?',
    },
  },
];

/** Aide générale, pour une page qui n'a pas de bulle propre. */
const DEFAULT_GUIDE: ModuleGuide = {
  key: 'general',
  title: 'Besoin d’aide ?',
  steps: [
    'Le menu à gauche (ou le bouton ☰ sur téléphone) mène à chaque partie de la ferme.',
    'Les tâches du jour sont sous la cloche, en haut de l’écran.',
    'Le bouton Assistant répond à tes questions sur l’app et sur l’élevage.',
  ],
  question: 'Comment bien utiliser RabbitFarm au quotidien ?',
};

export function guideFor(pathname: string): ModuleGuide | null {
  const match = GUIDES.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return match?.guide ?? null;
}

/** Bulle à montrer quand l'éleveur appuie sur « ? » : celle de la page, sinon l'aide générale. */
export function helpFor(pathname: string): ModuleGuide {
  return guideFor(pathname) ?? DEFAULT_GUIDE;
}
