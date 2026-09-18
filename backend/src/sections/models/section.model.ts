import {
  Field,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { SectionType } from '../graphql/section-type.enum';

@ObjectType()
export class SectionModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => SectionType)
  type: SectionType;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  cageCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}