import { Field, Float, InputType } from '@nestjs/graphql';

import { ExpenseCategory } from '../graphql/expense-category.enum';

@InputType()
export class CreateExpenseInput {
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

  @Field({ nullable: true })
  supplier?: string;
}