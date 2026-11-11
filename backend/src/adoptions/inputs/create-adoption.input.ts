import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { AdoptionReason } from '../graphql/adoption-reason.enum.js';

@InputType()
export class CreateAdoptionInput {
  @Field(() => ID)
  sourceLitterId: string;

  @Field(() => ID)
  destinationLitterId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => AdoptionReason)
  reason: AdoptionReason;

  @Field()
  date: Date;

  @Field({ nullable: true })
  observation?: string;

  @Field(() => [ID], {
    nullable: true,
    description:
      'Lapereaux identifiés transférés (la quantité doit alors correspondre).',
  })
  rabbitIds?: string[];
}
