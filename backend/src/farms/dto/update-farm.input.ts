import { Field, InputType } from '@nestjs/graphql';

import { InbreedingPolicy } from '../../genetics/graphql/inbreeding-policy.enum.js';

@InputType()
export class UpdateFarmInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  location?: string;

  @Field(() => InbreedingPolicy, { nullable: true })
  inbreedingPolicy?: InbreedingPolicy;
}
