import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { MortalityScope } from '../graphql/mortality-scope.enum';

@ObjectType()
export class MortalityModel {
  @Field(() => ID)
  id: string;

  @Field(() => MortalityScope)
  scope: MortalityScope;

  @Field(() => ID, { nullable: true })
  rabbitId?: string | null;

  @Field(() => String, { nullable: true })
  rabbitCode?: string | null;

  @Field(() => ID, { nullable: true })
  litterId?: string | null;

  @Field(() => String, { nullable: true })
  litterCode?: string | null;

  @Field(() => ID, { nullable: true })
  lotId?: string | null;

  @Field(() => String, { nullable: true })
  lotCode?: string | null;

  @Field()
  date: Date;

  @Field(() => Int)
  count: number;

  @Field(() => String, { nullable: true })
  cause?: string | null;

  @Field(() => String, { nullable: true })
  observation?: string | null;

  @Field()
  createdAt: Date;
}
