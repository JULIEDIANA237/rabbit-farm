import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class DashboardWeaningModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  litterId: string;

  @Field()
  plannedDate: Date;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float, { nullable: true })
  averageWeight?: number | null;
}