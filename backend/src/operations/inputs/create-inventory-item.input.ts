import { Field, Float, InputType } from '@nestjs/graphql';

import { InventoryItemType } from '../graphql/inventory-item-type.enum.js';

@InputType()
export class CreateInventoryItemInput {
  @Field()
  name: string;

  @Field(() => InventoryItemType)
  type: InventoryItemType;

  @Field()
  unit: string;

  @Field(() => Float, { nullable: true })
  minimumStock?: number;

  @Field(() => Float, { nullable: true, description: 'Prix unitaire de référence' })
  unitPrice?: number;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true, description: 'Stock de départ (mouvement « stock initial »)' })
  initialStock?: number;

  @Field({ nullable: true, description: 'Date du stock de départ (par défaut : aujourd’hui)' })
  initialStockDate?: Date;
}