import { Field, Float, InputType } from '@nestjs/graphql';

import { ExpenseCategory } from '../graphql/expense-category.enum';
import { PaymentMethod } from '../../sales/graphql/payment-method.enum';

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

  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: PaymentMethod;

  @Field({ nullable: true })
  observation?: string;
}