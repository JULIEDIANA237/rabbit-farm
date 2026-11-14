import { registerEnumType } from '@nestjs/graphql';

/**
 * Catégorie d'affichage : les lapereaux sont les lapins nés à la ferme
 * (rattachés à une portée) et destinés à l'engraissement ; tous les
 * autres sont des lapins (reproducteurs, futurs reproducteurs, achats…).
 */
export enum RabbitCategory {
  ADULT = 'ADULT',
  KIT = 'KIT',
}

registerEnumType(RabbitCategory, { name: 'RabbitCategory' });
