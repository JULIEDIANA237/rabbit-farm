import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateWeighingInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => Float, { nullable: true })
  totalWeight?: number;

  @Field(() => Int, { nullable: true })
  animalCount?: number;

  @Field(() => Float, { nullable: true })
  averageWeight?: number;

  @Field({ nullable: true })
  observation?: string;
}
