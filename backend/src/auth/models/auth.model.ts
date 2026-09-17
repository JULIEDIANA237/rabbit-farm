import { Field, ObjectType } from '@nestjs/graphql';
import { FarmModel } from '../../farms/models/farm.model';

@ObjectType()
export class AuthModel {
  @Field()
  accessToken: string;

  @Field()
  userId: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => FarmModel)
  farm: FarmModel;
}