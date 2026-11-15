import {
  Field,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { RabbitSex } from '../graphql/rabbit-sex.enum.js';
import { RabbitStatus } from '../graphql/rabbit-status.enum.js';
import { RabbitPurpose } from '../graphql/rabbit-purpose.enum.js';

import { RabbitIdentificationModel } from './rabbit-identification.model.js';
import { RabbitPhotoModel } from './rabbit-photo.model.js';

@ObjectType()
export class RabbitModel {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field(() => RabbitSex)
  sex: RabbitSex;

  @Field(() => RabbitStatus)
  status: RabbitStatus;

  @Field(() => RabbitPurpose)
  purpose: RabbitPurpose;

  @Field({ nullable: true })
  breedId?: string;

  @Field({ nullable: true })
  crossBreedId?: string;

  @Field({ nullable: true })
  fatherId?: string;

  @Field({ nullable: true })
  motherId?: string;

  @Field({ nullable: true })
  birthDate?: Date;

  @Field(() => ID, {
    nullable: true,
  })
  birthLitterId?: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  observations?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Code temporaire d’origine (ex. L001-07)',
  })
  originalCode?: string | null;

  @Field(() => Date, { nullable: true })
  exitDate?: Date | null;

  @Field(() => String, { nullable: true })
  exitCause?: string | null;

  @Field(() => ID, { nullable: true })
  currentCageId?: string | null;

  @Field(() => String, { nullable: true })
  currentCageCode?: string | null;

  @Field(() => String, { nullable: true })
  breedName?: string | null;

  @Field(() => [RabbitIdentificationModel])
  identifications: RabbitIdentificationModel[];

  @Field(() => [RabbitPhotoModel])
  photos: RabbitPhotoModel[];

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

  @Field(() => Boolean, { description: 'Choisi à la main pour la vente' })
  readyForSale: boolean;

  @Field(() => Date, { nullable: true })
  readyForSaleAt?: Date | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}