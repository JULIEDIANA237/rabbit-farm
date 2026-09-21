import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

import { ExpenseCategory } from '../graphql/expense-category.enum';

@ObjectType()
export class ExpenseModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  farmId: string;

  @Field(() => ExpenseCategory)
  category: ExpenseCategory;

  @Field(() => Float)
  amount: number;

  @Field()
  date: Date;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  reference?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
