import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardStockAlertModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  unit: string;

  @Field(() => Float)
  currentStock: number;

  @Field(() => Float, { nullable: true })
  minimumStock?: number;
}