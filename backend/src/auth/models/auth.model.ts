import { Field, ObjectType } from '@nestjs/graphql';
import { FarmModel } from '../../farms/models/farm.model.js';

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

  @Field(() => FarmModel, { nullable: true, description: 'Absent pour la propriétaire de l’app (espace propriétaire).' })
  farm: FarmModel | null;
}