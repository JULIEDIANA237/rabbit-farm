import { Field, InputType } from '@nestjs/graphql';

import { FarmRole } from '../../auth/graphql/farm-role.enum.js';

@InputType()
export class AddMemberInput {
  @Field()
  email: string;

  @Field(() => FarmRole)
  role: FarmRole;
}