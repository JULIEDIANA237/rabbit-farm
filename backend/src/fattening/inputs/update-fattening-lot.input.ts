import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

import { CreateFatteningLotInput } from './create-fattening-lot.input.js';

@InputType()
export class UpdateFatteningLotInput extends PartialType(CreateFatteningLotInput) {
  @Field(() => ID)
  id: string;
}
