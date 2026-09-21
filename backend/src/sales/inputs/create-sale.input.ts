import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateSaleItemInput {
  @Field({ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  rabbitId?: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  unitPrice: number;
}

@InputType()
export class CreateSaleInput {
  @Field(() => ID, { nullable: true })
  customerId?: string;

  @Field()
  saleDate: Date;

  @Field(() => [CreateSaleItemInput])
  items: CreateSaleItemInput[];

  @Field({ nullable: true })
  observation?: string;
}
