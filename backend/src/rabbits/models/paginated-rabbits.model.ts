import { Field, Int, ObjectType } from '@nestjs/graphql';

import { RabbitModel } from './rabbit.model';

@ObjectType()
export class RabbitPageModel {
  @Field(() => [RabbitModel])
  items: RabbitModel[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  totalPages: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}