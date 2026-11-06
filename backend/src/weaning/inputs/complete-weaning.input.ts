import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CompleteWeaningInput {
  @Field(() => ID)
  id: string;

  @Field()
  actualDate: Date;

  @Field(() => [ID], { nullable: true })
  rabbitIds?: string[];

  @Field(() => Int, { nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  totalWeight?: number;

  @Field({ nullable: true })
  averageWeight?: number;

  @Field(() => ID, {
    nullable: true,
    description:
      "Lot d'engraissement dans lequel placer les lapereaux sevrés (§34 : sevrage → engraissement).",
  })
  fatteningLotId?: string;

  @Field({ nullable: true })
  observation?: string;
}
