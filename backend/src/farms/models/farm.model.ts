import { Field, ID, ObjectType } from '@nestjs/graphql';

import { InbreedingPolicy } from '../../genetics/graphql/inbreeding-policy.enum.js';

@ObjectType()
export class FarmModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  location: string | null;

  @Field(() => InbreedingPolicy, {
    description: 'Politique de consanguinité appliquée aux accouplements (§18)',
  })
  inbreedingPolicy: InbreedingPolicy;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}