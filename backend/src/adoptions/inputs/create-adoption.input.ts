import { Field, ID, InputType } from '@nestjs/graphql';
import { AdoptionReason } from '../graphql/adoption-reason.enum';

@InputType()
export class CreateAdoptionInput {
  @Field(() => ID)
  sourceLitterId: string;

  @Field(() => ID)
  destinationLitterId: string;

  @Field()
  quantity: number;

  @Field(() => AdoptionReason)
  reason: AdoptionReason;

  @Field()
  date: Date;

  @Field({ nullable: true })
  observation?: string;
}