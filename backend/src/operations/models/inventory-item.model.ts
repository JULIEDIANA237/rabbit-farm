import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

import { InventoryItemType } from '../graphql/inventory-item-type.enum.js';
import { StockMovementModel } from './stock-movement.model.js';

@ObjectType()
export class InventoryItemModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  farmId: string;

  @Field()
  name: string;

  @Field(() => InventoryItemType)
  type: InventoryItemType;

  @Field()
  unit: string;

  @Field(() => Float, { nullable: true })
  minimumStock?: number;

  @Field(() => Float)
  currentStock: number;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Boolean)
  isBelowMinimum: boolean;

  @Field(() => Float, {
    nullable: true,
    description: 'Consommation quotidienne moyenne sur 30 jours (§46)',
  })
  averageDailyConsumption?: number | null;

  @Field(() => Float, {
    nullable: true,
    description: 'Nombre de jours d’autonomie estimé (§46)',
  })
  autonomyDays?: number | null;

  @Field(() => [StockMovementModel])
  movements: StockMovementModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}