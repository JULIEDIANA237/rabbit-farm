import { Field, ID, ObjectType } from '@nestjs/graphql';
import { AdoptionReason } from '../graphql/adoption-reason.enum';

@ObjectType()
export class AdoptionModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  sourceLitterId: string;

  @Field(() => ID)
  destinationLitterId: string;

  @Field()
  quantity: number;

  @Field({ nullable: true })
  reason: AdoptionReason;

  @Field()
  date: Date;

  @Field({ nullable: true })
  observation?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}