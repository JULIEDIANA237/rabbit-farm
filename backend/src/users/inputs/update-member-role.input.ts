import { Field, ID, InputType } from '@nestjs/graphql';

import { FarmRole } from '../../auth/graphql/farm-role.enum';

@InputType()
export class UpdateMemberRoleInput {
  @Field(() => ID)
  membershipId: string;

  @Field(() => FarmRole)
  role: FarmRole;
}