/**
 * Mode d'emploi de RabbitFarm pour l'assistant IA : il explique comment faire
 * et propose un bouton vers la bonne page (formulaire ouvert quand c'est possible).
 */
export interface AppPage {
  path: string;
  label: string;
  how: string;
}

export const APP_PAGES: AppPage[] = [
  { path: '/import', label: 'Photo du cahier', how: 'Photographier une page du cahier : l’IA lit les lapins et les saillies, l’éleveur corrige puis enregistre tout d’un coup. Le plus rapide pour démarrer.' },
  { path: '/rabbits/new', label: 'Ajouter un lapin', how: 'Code (ex. F01), sexe, destination (reproducteur ou engraissement), race, date de naissance, cage. Son passé (mises bas, saillies) peut être noté.' },
  { path: '/rabbits', label: 'Lapins', how: 'Liste et fiche de chaque lapin : historique, photos, déplacement de cage, sortie (mort, vente, réforme, transfert).' },
  { path: '/farm?new=1', label: 'Créer une cage', how: 'Cages rangées par bâtiment ou bloc ; le code est proposé automatiquement.' },
  { path: '/breeding?new=1', label: 'Nouvelle saillie', how: 'Femelle, mâle et date : l’app calcule palpation (J+10 à 14), pose du nid (J+28) et mise bas (J+31), et crée les tâches. La palpation se note ensuite depuis la saillie.' },
  { path: '/births?new=1', label: 'Nouvelle mise bas', how: 'Mère, date, nés vivants et mort-nés : la portée est créée avec son code.' },
  { path: '/kits', label: 'Lapereaux', how: 'Portées sous la mère, morts de lapereaux, adoptions.' },
  { path: '/weaning?new=1', label: 'Nouveau sevrage', how: 'Vers 28 à 35 jours : les lapereaux passent dans un lot d’engraissement.' },
  { path: '/fattening', label: 'Engraissement', how: 'Lots, pesées et croissance ; un lot peut être logé dans une cage.' },
  { path: '/sales/ready', label: 'Prêts pour la vente', how: 'Lapins qui ont atteint le poids ou l’âge de vente.' },
  { path: '/sales?new=1', label: 'Nouvelle vente', how: 'Client, lapins vendus, prix et paiement (avance possible, reste à encaisser suivi).' },
  { path: '/health?new=1', label: 'Santé d’un lapin', how: 'Symptômes, traitement, vaccin, prochaine échéance (rappel automatique).' },
  { path: '/care?new=1', label: 'Soin de la ferme', how: 'Vermifuge, vitamines, désinfection pour toute la ferme ou un groupe.' },
  { path: '/operations?new=1', label: 'Nouvelle dépense', how: 'Aliment, médicaments, matériel… pour suivre la rentabilité.' },
  { path: '/operations/inventory?new=1', label: 'Article de stock', how: 'Aliment au sac ou au kg ; l’app calcule les jours d’autonomie et alerte avant la rupture.' },
  { path: '/tasks', label: 'Tâches', how: 'Tâches du jour et en retard, créées automatiquement par les saillies, mises bas et soins.' },
  { path: '/questions', label: 'Mon assistant', how: 'Questions de suivi posées à 6 h, 13 h et 18 h ; onglet Réglages pour la ville de la ferme et les notifications.' },
  { path: '/advice', label: 'Fiches conseils', how: 'Fiches pratiques : maladies, chaleur, mise bas, sevrage, vente.' },
  { path: '/statistics', label: 'Statistiques', how: 'Fertilité, prolificité, mortalité, finances.' },
  { path: '/tools', label: 'Boîte à outils', how: 'Calculs de rations, de dates et de rentabilité.' },
  { path: '/settings', label: 'Paramètres', how: 'Nom et ville de la ferme, équipe (ajouter un employé avec son rôle), réinitialisation.' },
  { path: '/subscription', label: 'Abonnement', how: 'Essai, prix et paiement Mobile Money.' },
];

const basePath = (href: string) => href.split(/[?#]/)[0];
const KNOWN = new Set(APP_PAGES.map((p) => basePath(p.path)));

/** Vrai si le lien mène à une page de l'app (on refuse tout le reste). */
export function isAppPath(href: string) {
  return href.startsWith('/') && !href.startsWith('//') && KNOWN.has(basePath(href));
}

export function appGuideDigest() {
  return APP_PAGES.map((p) => `- ${p.label} (${p.path}) : ${p.how}`).join('\n');
}
