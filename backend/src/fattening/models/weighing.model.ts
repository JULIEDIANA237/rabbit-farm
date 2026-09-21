import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WeighingModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  rabbitId?: string;

  @Field(() => ID, { nullable: true })
  lotId?: string;

  @Field()
  date: Date;

  @Field(() => Float)
  totalWeight: number;

  @Field(() => Int)
  animalCount: number;

  @Field(() => Float, { nullable: true })
  averageWeight?: number;

  @Field(() => Int, { nullable: true })
  ageInDays?: number;

  @Field({ nullable: true })
  observation?: string;

  @Field()
  createdAt: Date;
}
