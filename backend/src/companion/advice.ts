/**
 * Fiches conseils de l'assistant « bras droit ».
 * Textes courts, sans dose de médicament : l'assistant oriente, le vétérinaire prescrit.
 * À faire relire par un technicien d'élevage ou un vétérinaire avant le lancement.
 */

export interface AdviceSheet {
  key: string;
  title: string;
  /** Catégorie d'affichage. */
  topic: 'Santé' | 'Reproduction' | 'Lapereaux' | 'Croissance' | 'Ferme';
  /** Une phrase : de quoi il s'agit. */
  summary: string;
  /** Ce qu'on observe. */
  signs: string[];
  /** Les gestes à faire, dans l'ordre. */
  actions: string[];
  /** Quand appeler le vétérinaire. */
  vet?: string;
}

export const ADVICE_SHEETS: AdviceSheet[] = [
  {
    key: 'suivi-traitement',
    title: 'Suivre un lapin après un soin',
    topic: 'Santé',
    summary: 'Les 24 à 48 heures après une injection ou un traitement disent si le lapin se rétablit.',
    signs: ['Il mange et boit', 'Il se déplace normalement', 'Les crottes sont rondes et sèches'],
    actions: [
      'Regarde-le matin et soir : appétit, eau, crottes, respiration.',
      'Laisse-lui de l’eau propre et du foin à volonté.',
      'Termine le traitement jusqu’au bout, même s’il va mieux.',
      'Note ce que tu observes dans sa fiche santé.',
    ],
    vet: 'S’il ne mange plus depuis 24 h, respire mal ou reste couché.',
  },
  {
    key: 'perte-appetit',
    title: 'Lapin qui ne mange plus',
    topic: 'Santé',
    summary: 'Un lapin qui ne mange plus depuis plus de 12 heures est une urgence : son intestin s’arrête vite.',
    signs: ['Gamelle pleine', 'Peu ou pas de crottes', 'Reste prostré, dos rond'],
    actions: [
      'Isole-le dans une cage propre, au calme et à l’ombre.',
      'Propose du foin, des herbes fraîches qu’il connaît et de l’eau propre.',
      'Vérifie les dents, la bouche et le ventre (gonflé ou dur ?).',
      'Note l’heure du dernier repas observé.',
    ],
    vet: 'Après 24 h sans manger, ou si le ventre est gonflé.',
  },
  {
    key: 'diarrhee',
    title: 'Diarrhée',
    topic: 'Santé',
    summary: 'Chez le lapin, la diarrhée tue vite, surtout autour du sevrage. Il faut agir le jour même.',
    signs: ['Crottes molles ou liquides', 'Arrière-train sale', 'Lapin qui maigrit ou se déshydrate'],
    actions: [
      'Isole les malades et nettoie la cage à fond.',
      'Donne du foin sec de bonne qualité, réduis les granulés et les herbes mouillées.',
      'Vérifie la propreté de l’eau et des abreuvoirs.',
      'Garde une trace : âge, nombre de malades, aliment récent.',
    ],
    vet: 'Dès qu’il y a plusieurs malades ou un mort.',
  },
  {
    key: 'ballonnement',
    title: 'Ventre gonflé (ballonnement)',
    topic: 'Santé',
    summary: 'Un ventre gonflé et dur signale souvent une fermentation dans l’intestin, très grave.',
    signs: ['Ventre gonflé, tendu', 'Le lapin ne mange plus', 'Grince des dents, reste immobile'],
    actions: [
      'Retire les herbes fraîches mouillées et les changements d’aliment récents.',
      'Donne du foin sec et de l’eau propre.',
      'Garde le lapin au calme et au chaud, pas au soleil.',
    ],
    vet: 'Tout de suite : le ballonnement peut tuer en quelques heures.',
  },
  {
    key: 'coryza',
    title: 'Nez qui coule, éternuements (coryza)',
    topic: 'Santé',
    summary: 'Infection respiratoire contagieuse, favorisée par les courants d’air, l’ammoniac et la chaleur humide.',
    signs: ['Éternuements', 'Écoulement au nez', 'Pattes avant sales (il s’essuie le nez)'],
    actions: [
      'Isole le lapin malade loin des autres.',
      'Aère le bâtiment sans courants d’air, enlève le fumier pour réduire l’ammoniac.',
      'Désinfecte la cage et l’abreuvoir.',
    ],
    vet: 'Pour le traitement, et si d’autres lapins commencent à éternuer.',
  },
  {
    key: 'gale',
    title: 'Croûtes aux oreilles ou sur la peau (gale)',
    topic: 'Santé',
    summary: 'La gale est causée par des parasites, contagieuse, et fait souffrir le lapin.',
    signs: ['Croûtes dans les oreilles', 'Le lapin se gratte, secoue la tête', 'Perte de poils'],
    actions: [
      'Isole le lapin touché et examine tous ses voisins.',
      'Nettoie et désinfecte la cage.',
      'Ne retire pas les croûtes à vif.',
    ],
    vet: 'Pour le produit adapté : tous les lapins en contact sont souvent traités.',
  },
  {
    key: 'mammite',
    title: 'Mamelles dures ou chaudes (mammite)',
    topic: 'Santé',
    summary: 'Infection des mamelles de la lapine, souvent après la mise bas ou au sevrage.',
    signs: ['Mamelle dure, rouge ou bleutée', 'Lapine qui refuse d’allaiter', 'Lapereaux qui maigrissent'],
    actions: [
      'Vérifie chaque mamelle de la lapine.',
      'Prépare une adoption des petits si elle n’allaite plus.',
      'Nettoie le nid et la cage.',
    ],
    vet: 'Rapidement : la mammite demande un traitement.',
  },
  {
    key: 'chaleur',
    title: 'Forte chaleur',
    topic: 'Ferme',
    summary: 'Au-delà de 30 °C, le lapin souffre ; au-delà de 35 °C, le coup de chaleur peut tuer, surtout les lapines gestantes.',
    signs: ['Respiration rapide, bouche ouverte', 'Oreilles très chaudes', 'Lapin allongé, abattu'],
    actions: [
      'Donne de l’eau fraîche à volonté, renouvelée plusieurs fois.',
      'Mets de l’ombre et aère le bâtiment, sans soleil direct sur les cages.',
      'Mouille le toit ou pose des bouteilles d’eau congelée dans les cages.',
      'Évite de manipuler, transporter ou faire saillir aux heures chaudes.',
      'Distribue l’aliment le soir, quand il fait plus frais.',
    ],
    vet: 'Si un lapin reste couché, respire mal ou meurt de chaleur.',
  },
  {
    key: 'mortalite-serie',
    title: 'Plusieurs morts en peu de temps',
    topic: 'Santé',
    summary: 'Plusieurs morts en une semaine signalent souvent une maladie qui circule ou un problème d’aliment ou d’eau.',
    signs: ['Morts dans la même cage ou la même section', 'Même âge ou mêmes signes avant la mort'],
    actions: [
      'Isole les lapins malades et retire vite les morts.',
      'Nettoie et désinfecte les cages concernées, l’abreuvoir et la mangeoire.',
      'Vérifie l’eau et le dernier sac d’aliment (moisi, changé récemment ?).',
      'N’achète et ne fais pas entrer de nouveaux lapins tant que ça dure.',
      'Note la cause probable de chaque mort.',
    ],
    vet: 'Maintenant : un vétérinaire peut faire une autopsie et trouver la cause.',
  },
  {
    key: 'hygiene',
    title: 'Hygiène du bâtiment',
    topic: 'Ferme',
    summary: 'La plupart des maladies du lapin viennent d’un bâtiment sale ou humide.',
    signs: ['Odeur d’ammoniac', 'Fumier accumulé sous les cages', 'Mouches nombreuses'],
    actions: [
      'Retire le fumier au moins une fois par semaine.',
      'Nettoie les abreuvoirs et les mangeoires chaque semaine.',
      'Désinfecte une cage vide avant d’y mettre un nouveau lapin.',
      'Mets un pédiluve ou change de chaussures à l’entrée.',
    ],
  },
  {
    key: 'quarantaine',
    title: 'Faire entrer de nouveaux lapins',
    topic: 'Ferme',
    summary: 'Un lapin acheté peut apporter une maladie : il reste à part avant de rejoindre l’élevage.',
    signs: [],
    actions: [
      'Garde-le 2 à 3 semaines dans une cage à l’écart.',
      'Surveille appétit, crottes, nez et oreilles.',
      'Occupe-toi de lui en dernier, après les autres lapins.',
    ],
  },
  {
    key: 'eau',
    title: 'Eau propre et suffisante',
    topic: 'Ferme',
    summary: 'Un lapin boit beaucoup, surtout une lapine qui allaite : sans eau, il arrête de manger.',
    signs: ['Abreuvoir vide ou sale', 'Tétine bouchée'],
    actions: [
      'Vérifie chaque abreuvoir matin et soir.',
      'Nettoie-les chaque semaine.',
      'Prévois plus d’eau par temps chaud et pour les lapines qui allaitent.',
    ],
  },
  {
    key: 'palpation',
    title: 'Palper une lapine',
    topic: 'Reproduction',
    summary: 'Entre 10 et 14 jours après la saillie, la palpation dit si la lapine est gestante.',
    signs: ['Petites boules de la taille d’une bille dans le bas du ventre'],
    actions: [
      'Tiens la lapine calmement, tête vers toi, sur une surface stable.',
      'Palpe doucement le bas du ventre entre le pouce et les doigts, sans serrer.',
      'Vide : remets-la à la saillie rapidement.',
      'Note le résultat dans l’app : elle calcule la suite.',
    ],
  },
  {
    key: 'nid',
    title: 'Préparer le nid',
    topic: 'Reproduction',
    summary: 'La boîte à nid se met vers le 28e jour de gestation, 3 jours avant la mise bas.',
    signs: ['La lapine porte de la paille, s’arrache des poils'],
    actions: [
      'Mets une boîte à nid propre et sèche avec de la paille ou des copeaux.',
      'Place-la dans un coin calme de la cage.',
      'Évite de déranger la lapine les jours suivants.',
    ],
  },
  {
    key: 'mise-bas',
    title: 'Le lendemain de la mise bas',
    topic: 'Lapereaux',
    summary: 'Le premier contrôle du nid évite de laisser des petits morts ou froids.',
    signs: [],
    actions: [
      'Éloigne la mère avec une friandise avant d’ouvrir le nid.',
      'Compte les vivants, retire les morts et le poil souillé.',
      'Vérifie que la mère mange et boit.',
      'Note le nombre de vivants et de morts dans l’app.',
    ],
    vet: 'Si la mère ne mange pas 24 h après la mise bas.',
  },
  {
    key: 'mere-abandon',
    title: 'Mère qui ne s’occupe pas des petits',
    topic: 'Lapereaux',
    summary: 'Une lapine allaite seulement une à deux fois par jour, souvent la nuit : ce n’est pas un abandon.',
    signs: ['Petits froids, ventres creux, peau fripée', 'Petits dispersés hors du nid'],
    actions: [
      'Regarde le ventre des petits le matin : rond = ils ont tété.',
      'Remets les petits dans le nid, au chaud.',
      'Si la mère n’allaite pas 24 h : confie les petits à une autre lapine qui a mis bas le même jour (à 2 ou 3 jours près).',
      'Vérifie ses mamelles (voir la fiche mammite).',
    ],
  },
  {
    key: 'lapereaux-lait',
    title: 'Lapereaux qui tètent mal',
    topic: 'Lapereaux',
    summary: 'Un petit bien nourri a le ventre rond et la peau tendue.',
    signs: ['Ventre plat, peau fripée', 'Petits qui crient ou qui sont froids'],
    actions: [
      'Vérifie que la mère a assez d’eau et d’aliment.',
      'Si la portée est grande, confie quelques petits à une autre lapine.',
      'Garde le nid sec et au chaud.',
    ],
  },
  {
    key: 'sevrage',
    title: 'Réussir le sevrage',
    topic: 'Lapereaux',
    summary: 'Le sevrage, vers 35 jours, est la période la plus risquée pour les lapereaux.',
    signs: [],
    actions: [
      'Retire la mère plutôt que les petits : ils restent dans leur cage.',
      'Garde le même aliment pendant 2 semaines autour du sevrage.',
      'Donne du foin à volonté.',
      'Surveille les crottes chaque jour (voir la fiche diarrhée).',
    ],
  },
  {
    key: 'croissance-lente',
    title: 'Lapins qui grossissent lentement',
    topic: 'Croissance',
    summary: 'En engraissement, un lapin prend en général 25 à 35 g par jour. En dessous, il faut chercher la cause.',
    signs: ['Poids moyen du lot qui stagne', 'Lapins inégaux dans le même lot'],
    actions: [
      'Vérifie la quantité et la qualité de l’aliment (sac récent, moisi ?).',
      'Vérifie l’eau : abreuvoirs pleins et propres.',
      'Évite les cages trop chargées et la chaleur.',
      'Regarde les crottes : diarrhée ou parasites ?',
      'Pèse le lot chaque semaine pour suivre la courbe.',
    ],
  },
  {
    key: 'stock-aliment',
    title: 'Ne jamais manquer d’aliment',
    topic: 'Ferme',
    summary: 'Un changement brusque d’aliment ou une rupture de stock provoque des diarrhées.',
    signs: [],
    actions: [
      'Rachète quand il reste une semaine de stock.',
      'Garde la même marque d’aliment quand c’est possible.',
      'Si tu changes d’aliment, mélange l’ancien et le nouveau pendant une semaine.',
      'Stocke les sacs au sec, surélevés, à l’abri des rats.',
    ],
  },
  {
    key: 'reforme-femelle',
    title: 'Quand réformer une lapine',
    topic: 'Reproduction',
    summary: 'Une lapine qui coûte plus qu’elle ne rapporte prend la place d’une meilleure reproductrice.',
    signs: ['3 saillies ratées de suite', 'Portées très petites ou petits souvent morts', 'Cannibalisme répété', 'Plus de 3 ans'],
    actions: [
      'Vérifie d’abord le mâle, l’alimentation et la chaleur.',
      'Remplace-la par une jeune femelle de bonne lignée.',
      'Note la réforme dans l’app pour garder son historique.',
    ],
  },
  {
    key: 'repos-male',
    title: 'Ménager le mâle',
    topic: 'Reproduction',
    summary: 'Un mâle trop utilisé donne des saillies moins fertiles.',
    signs: [],
    actions: [
      'Pas plus de 2 saillies par jour, avec du repos le lendemain.',
      'Amène toujours la femelle dans la cage du mâle.',
      'Évite les saillies aux heures chaudes.',
    ],
  },
  {
    key: 'vente',
    title: 'Vendre au bon moment',
    topic: 'Croissance',
    summary: 'Garder un lapin prêt coûte de l’aliment chaque jour sans lui faire gagner beaucoup de valeur.',
    signs: [],
    actions: [
      'Contacte tes acheteurs dès que le lot approche du poids de vente.',
      'Pèse avant de vendre pour fixer le prix.',
      'Note la vente dans l’app pour suivre ton bénéfice.',
    ],
  },
  {
    key: 'cannibalisme',
    title: 'Mère qui mange ses petits',
    topic: 'Lapereaux',
    summary: 'Souvent lié au stress, au manque d’eau ou à une jeune mère dérangée.',
    signs: ['Petits manquants ou blessés après la mise bas'],
    actions: [
      'Assure de l’eau à volonté avant et après la mise bas.',
      'Évite le bruit et les visites autour du nid.',
      'Si elle recommence, prévois sa réforme.',
    ],
  },
  {
    key: 'vaccination',
    title: 'Vaccins et rappels',
    topic: 'Santé',
    summary: 'Les vaccins protègent de maladies souvent mortelles ; le rappel à la bonne date compte autant que la première dose.',
    signs: [],
    actions: [
      'Demande au vétérinaire le programme adapté à ta région.',
      'Note chaque vaccin dans l’app avec la date du rappel.',
      'Vaccine des lapins en bonne santé uniquement.',
    ],
  },
  {
    key: 'tout-va-bien',
    title: 'Le tour de la ferme en 5 minutes',
    topic: 'Ferme',
    summary: 'Un petit tour chaque matin permet de repérer un problème avant qu’il coûte cher.',
    signs: [],
    actions: [
      'Eau : tous les abreuvoirs coulent.',
      'Aliment : les mangeoires sont vidées normalement.',
      'Crottes : rondes et sèches sous les cages.',
      'Comportement : aucun lapin prostré, aucun nez qui coule.',
      'Nids : les petits ont le ventre rond.',
    ],
  },
];

export const ADVICE_BY_KEY = new Map(ADVICE_SHEETS.map((a) => [a.key, a]));

/** Résumé compact des fiches, à donner à l'IA du chat de l'éleveur. */
export function adviceDigest() {
  return ADVICE_SHEETS.map((a) => `- ${a.title} : ${a.summary} Gestes : ${a.actions.join(' ')}${a.vet ? ` Vétérinaire : ${a.vet}` : ''}`).join('\n');
}
