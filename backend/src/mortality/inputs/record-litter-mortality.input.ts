import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RecordLitterMortalityInput {
  @Field(() => ID)
  litterId: string;

  @Field()
  date: Date;

  @Field(() => Int, { description: 'Nombre de lapereaux non identifiés morts' })
  count: number;

  @Field({ nullable: true })
  cause?: string;

  @Field({ nullable: true })
  observation?: string;
}
