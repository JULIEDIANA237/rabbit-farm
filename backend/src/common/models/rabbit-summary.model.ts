import { Field, ID, ObjectType } from '@nestjs/graphql';

import { RabbitSex } from '../../rabbits/graphql/rabbit-sex.enum';
import { RabbitStatus } from '../../rabbits/graphql/rabbit-status.enum';

/**
 * Représentation légère d'un lapin, réutilisée par les vues
 * de traçabilité, de généalogie et de statistiques.
 */
@ObjectType()
export class RabbitSummaryModel {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field(() => RabbitSex)
  sex: RabbitSex;

  @Field(() => RabbitStatus)
  status: RabbitStatus;

  @Field(() => Date, { nullable: true })
  birthDate?: Date | null;
}
