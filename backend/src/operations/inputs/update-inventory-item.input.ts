import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';

import { CreateInventoryItemInput } from './create-inventory-item.input.js';

@InputType()
export class UpdateInventoryItemInput extends PartialType(
  OmitType(CreateInventoryItemInput, ['initialStock', 'initialStockDate'] as const),
) {
  @Field(() => ID)
  id: string;
}
