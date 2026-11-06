import { Field, ID, ObjectType } from '@nestjs/graphql';

import { FarmModel } from '../../farms/models/farm.model';
import { FarmRole } from '../graphql/farm-role.enum';

@ObjectType()
export class MeModel {
  @Field(() => ID)
  userId: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => FarmRole)
  role: FarmRole;

  @Field(() => FarmModel)
  farm: FarmModel;
}
