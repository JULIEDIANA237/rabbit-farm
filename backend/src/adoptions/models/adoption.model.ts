import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { AdoptionReason } from '../graphql/adoption-reason.enum.js';

@ObjectType()
export class AdoptionModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  sourceLitterId: string;

  @Field(() => ID)
  destinationLitterId: string;

  @Field(() => String, { nullable: true })
  sourceLitterCode?: string | null;

  @Field(() => String, { nullable: true })
  destinationLitterCode?: string | null;

  @Field(() => [ID])
  rabbitIds: string[];

  @Field(() => Int)
  quantity: number;

  @Field(() => AdoptionReason, { nullable: true })
  reason: AdoptionReason | null;

  @Field()
  adoptedAt: Date;

  @Field({ nullable: true })
  observation?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}