import { Field, ID, ObjectType } from '@nestjs/graphql';

import { HealthRecordType } from '../../health/graphql/health-record-type.enum.js';

@ObjectType()
export class DashboardHealthActionModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  rabbitId: string;

  @Field()
  rabbitCode: string;

  @Field(() => HealthRecordType)
  type: HealthRecordType;

  @Field()
  dueDate: Date;

  @Field()
  label: string;

  @Field()
  overdue: boolean;
}
