import {
  Field,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { FarmRole } from '../../generated/prisma/client';

import { UserModel } from './user.model';

registerEnumType(FarmRole, {
  name: 'FarmRole',
});

@ObjectType()
export class FarmMembershipModel {
  @Field(() => ID)
  id: string;

  @Field(() => FarmRole)
  role: FarmRole;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => UserModel)
  user: UserModel;
}