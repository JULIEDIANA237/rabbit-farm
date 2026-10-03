import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RabbitsPaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  pageSize?: number;

  @Field({ nullable: true })
  search?: string;
}