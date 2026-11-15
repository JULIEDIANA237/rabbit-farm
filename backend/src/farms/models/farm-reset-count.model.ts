import { Field, Int, ObjectType } from '@nestjs/graphql';

/** Une ligne de ce que la réinitialisation efface (ou a effacé). */
@ObjectType()
export class FarmResetCountModel {
  @Field()
  label: string;

  @Field(() => Int)
  count: number;
}
