/**
 * Libellés français des énumérations GraphQL.
 */
type Labels = Record<string, string>;

export const SEX: Labels = { MALE: 'Mâle', FEMALE: 'Femelle', UNKNOWN: 'Inconnu' };

export const RABBIT_STATUS: Labels = {
  ACTIVE: 'Actif',
  SOLD: 'Vendu',
  DEAD: 'Décédé',
  TRANSFERRED: 'Transféré',
  CULLED: 'Réformé',
};

export const PURPOSE: Labels = {
  BREEDER: 'Reproducteur',
  FUTURE_BREEDER: 'Futur reproducteur',
  FATTENING: 'Engraissement',
  REFORM: 'Réforme',
};

export const BREEDING_STATUS: Labels = {
  PLANNED: 'Planifié',
  AWAITING_PALPATION: 'Palpation à faire',
  PREGNANT: 'Gestante',
  NON_PREGNANT: 'Vide',
  INCONCLUSIVE: 'À repalper',
  BIRTH_RECORDED: 'Mise bas faite',
  CANCELLED: 'Annulé',
};

export const PREGNANCY_RESULT: Labels = {
  PREGNANT: 'Positive (gestante)',
  NOT_PREGNANT: 'Négative (vide)',
  INCONCLUSIVE: 'Douteuse',
};

export const LITTER_STATUS: Labels = { ACTIVE: 'Sous la mère', WEANED: 'Sevrée', CLOSED: 'Clôturée' };

export const LOT_STATUS: Labels = { ACTIVE: 'En cours', COMPLETED: 'Terminé', CANCELLED: 'Annulé' };

export const HEALTH_TYPE: Labels = {
  OBSERVATION: 'Observation',
  TREATMENT: 'Traitement',
  VACCINATION: 'Vaccination',
  ANALYSIS: 'Analyse',
  CONTROL: 'Contrôle',
};

export const SALE_STATUS: Labels = {
  UNPAID: 'Non payée',
  PARTIALLY_PAID: 'Partiellement payée',
  PAID: 'Payée',
  CANCELLED: 'Annulée',
};

export const PAYMENT_METHOD: Labels = {
  CASH: 'Espèces',
  MOBILE_MONEY: 'Mobile Money',
  BANK_TRANSFER: 'Virement',
  OTHER: 'Autre',
};

export const EXPENSE_CATEGORY: Labels = {
  FEED: 'Alimentation',
  MEDICATION: 'Médicaments',
  ENERGY: 'Énergie',
  EQUIPMENT: 'Équipement',
  MAINTENANCE: 'Entretien',
  TRANSPORT: 'Transport',
  SALARY: 'Salaires',
  OTHER: 'Autre',
};

export const INVENTORY_TYPE: Labels = {
  FEED: 'Aliment',
  MEDICATION: 'Médicament',
  EQUIPMENT: 'Équipement',
  OTHER: 'Autre',
};

export const STOCK_MOVEMENT: Labels = {
  INITIAL: 'Stock initial',
  PURCHASE: 'Achat',
  CONSUMPTION: 'Consommation',
  LOSS: 'Perte',
  ADJUSTMENT: 'Ajustement',
  RETURN: 'Retour',
};

export const TASK_PRIORITY: Labels = { LOW: 'Basse', MEDIUM: 'Moyenne', HIGH: 'Haute', URGENT: 'Urgente' };

export const TASK_STATUS: Labels = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
};

export const SECTION_TYPE: Labels = {
  REPRODUCTION: 'Reproduction',
  MATERNITY: 'Maternité',
  FATTENING: 'Engraissement',
  QUARANTINE: 'Quarantaine',
  OTHER: 'Autre',
};

export const CAGE_STATUS: Labels = { ACTIVE: 'Active', INACTIVE: 'Inactive', MAINTENANCE: 'Maintenance' };

export const FARM_ROLE: Labels = {
  ADMIN: 'Administrateur',
  BREEDING_MANAGER: 'Responsable élevage',
  EMPLOYEE: 'Employé',
  VETERINARIAN: 'Vétérinaire',
};

export const ADOPTION_REASON: Labels = {
  EQUALIZATION: 'Égalisation des portées',
  MOTHER_REJECTED: 'Rejet par la mère',
  ORPHAN: 'Orphelin',
  SURPLUS: 'Portée trop nombreuse',
  OTHER: 'Autre',
};

export const MOVEMENT_REASON: Labels = {
  INITIAL_ASSIGNMENT: 'Première affectation',
  BREEDING: 'Reproduction',
  MATERNITY: 'Maternité',
  FATTENING: 'Engraissement',
  QUARANTINE: 'Quarantaine',
  CLEANING: 'Nettoyage',
  HEALTH: 'Santé',
  SALE: 'Vente',
  AGGRESSION: 'Agressivité',
  OVERCROWDING: 'Surpopulation',
  SEX_SEPARATION: 'Séparation des sexes',
  SIZE_DIFFERENCE: 'Différence de taille',
  OTHER: 'Autre',
};

export const COMPATIBILITY: Labels = { COMPATIBLE: 'Compatible', WARNING: 'À risque', BLOCKED: 'Interdit' };

export const INBREEDING_POLICY: Labels = {
  WARN: 'Avertir (confirmation demandée)',
  BLOCK: 'Bloquer les croisements à risque',
};

export const EXIT_STATUS: Labels = { DEAD: 'Décès', CULLED: 'Réforme', TRANSFERRED: 'Transfert' };

export function label(map: Labels, value?: string | null): string {
  if (!value) return '—';
  return map[value] ?? value;
}

export function options(map: Labels) {
  return Object.entries(map).map(([value, text]) => ({ value, label: text }));
}
