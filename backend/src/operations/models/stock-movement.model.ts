import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

import { StockMovementType } from '../graphql/stock-movement-type.enum';

@ObjectType()
export class StockMovementModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  inventoryItemId: string;

  @Field(() => StockMovementType)
  type: StockMovementType;

  @Field(() => Float)
  quantity: number;

  @Field()
  date: Date;

  @Field(() => Float, { nullable: true })
  unitCost?: number;

  @Field({ nullable: true })
  reference?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;
}
