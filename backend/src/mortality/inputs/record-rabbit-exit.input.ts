import { Field, ID, InputType } from '@nestjs/graphql';

import { RabbitStatus } from '../../rabbits/graphql/rabbit-status.enum.js';

@InputType()
export class RecordRabbitExitInput {
  @Field(() => ID)
  rabbitId: string;

  @Field(() => RabbitStatus, {
    description: 'DEAD (décès), CULLED (réforme) ou TRANSFERRED (transfert)',
  })
  status: RabbitStatus;

  @Field()
  date: Date;

  @Field({ nullable: true })
  cause?: string;

  @Field({ nullable: true })
  observation?: string;
}
