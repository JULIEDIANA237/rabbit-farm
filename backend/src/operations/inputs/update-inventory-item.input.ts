import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

import { CreateInventoryItemInput } from './create-inventory-item.input.js';

@InputType()
export class UpdateInventoryItemInput extends PartialType(CreateInventoryItemInput) {
  @Field(() => ID)
  id: string;
}
