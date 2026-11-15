import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateRabbitHistoryInput {
  @Field(() => ID)
  rabbitId: string;

  @Field({ description: 'CAGE, LOT ou EXIT' })
  type: string;

  @Field(() => ID, { description: 'recordId de l’événement' })
  recordId: string;

  @Field()
  date: Date;

  @Field(() => String, { nullable: true, description: 'Observation (cage) ou cause (sortie)' })
  note?: string | null;
}
