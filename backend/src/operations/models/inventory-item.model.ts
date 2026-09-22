import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

import { InventoryItemType } from '../graphql/inventory-item-type.enum';

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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}