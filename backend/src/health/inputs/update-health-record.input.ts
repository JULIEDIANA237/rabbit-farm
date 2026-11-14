import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';

import { CreateHealthRecordInput } from './create-health-record.input.js';

@InputType()
export class UpdateHealthRecordInput extends PartialType(
  OmitType(CreateHealthRecordInput, ['rabbitId'] as const),
) {
  @Field(() => ID)
  id: string;
}
