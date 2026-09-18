import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BreedModel } from './breed.model';

@ObjectType()
export class CrossBreedModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID)
  parentBreedAId: string;

  @Field(() => ID)
  parentBreedBId: string;

  @Field(() => BreedModel)
  parentBreedA: BreedModel;

  @Field(() => BreedModel)
  parentBreedB: BreedModel;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}