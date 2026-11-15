import {
  Field,
  ID,
  InputType,
  Int,
} from '@nestjs/graphql';

import { RabbitStatus } from '../graphql/rabbit-status.enum.js';
import { RabbitPurpose } from '../graphql/rabbit-purpose.enum.js';
import { RabbitSex } from '../graphql/rabbit-sex.enum.js';

@InputType()
export class UpdateRabbitInput {
  @Field(() => ID)
  id: string;

  @Field({
    nullable: true,
  })
  code?: string;

  @Field(() => RabbitSex, {
    nullable: true,
  })
  sex?: RabbitSex;

  @Field(() => RabbitStatus, {
    nullable: true,
  })
  status?: RabbitStatus;

  @Field(() => RabbitPurpose, {
    nullable: true,
  })
  purpose?: RabbitPurpose;

  @Field(() => ID, {
    nullable: true,
  })
  breedId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  crossBreedId?: string;

  @Field({
    nullable: true,
  })
  color?: string;

  @Field({
    nullable: true,
  })
  weight?: number;

  @Field({
    nullable: true,
  })
  observations?: string;

  @Field(() => ID, { nullable: true })
  fatherId?: string;

  @Field(() => ID, { nullable: true })
  motherId?: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field(() => String, { nullable: true, description: 'Provenance : née ici, achetée…' })
  origin?: string | null;

  @Field(() => Int, { nullable: true, description: 'Mises bas faites avant son arrivée' })
  previousLitters?: number | null;

  @Field(() => Int, { nullable: true, description: 'Lapereaux nés vivants avant son arrivée' })
  previousKitsBorn?: number | null;

  @Field(() => Date, { nullable: true, description: 'Date de sa dernière mise bas avant son arrivée' })
  lastBirthDate?: Date | null;

  @Field(() => String, { nullable: true, description: 'Comportement de mère : GOOD, AVERAGE, POOR' })
  maternalBehavior?: string | null;

  @Field(() => Int, { nullable: true, description: 'Saillies faites avant son arrivée (mâle)' })
  previousMatings?: number | null;

  @Field(() => String, { nullable: true, description: 'Maladies et problèmes de santé passés' })
  healthHistory?: string | null;

  @Field(() => Int, { nullable: true, description: 'Lapereaux perdus avant son arrivée (femelle)' })
  previousKitsLost?: number | null;

  @Field(() => Int, { nullable: true, description: 'Cas de cannibalisme avant son arrivée (femelle)' })
  cannibalismCases?: number | null;

  @Field(() => Int, { nullable: true, description: 'Femelles déjà saillies avant son arrivée (mâle)' })
  previousFemales?: number | null;
}