import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

import { InventoryItemType } from '../graphql/inventory-item-type.enum';
import { StockMovementModel } from './stock-movement.model';

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

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  currentStock: number;

  @Field(() => [StockMovementModel])
  movements: StockMovementModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
