import { Field, Float, InputType } from '@nestjs/graphql';

import { InventoryItemType } from '../graphql/inventory-item-type.enum';

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

  @Field({ nullable: true })
  description?: string;
}
