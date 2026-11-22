import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AppRatingModel {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  stars: number;

  @Field(() => String, { nullable: true })
  comment?: string | null;

  @Field(() => String, { nullable: true, description: 'Ferme de la personne (vue admin)' })
  farmName?: string | null;

  @Field()
  updatedAt: Date;
}

/** Chiffres de toute la plateforme, réservés à la propriétaire de l'app. */
@ObjectType()
export class PlatformStatsModel {
  @Field(() => Int) farms: number;
  @Field(() => Int) users: number;
  @Field(() => Int) newUsers30d: number;
  @Field(() => Int) activeUsers7d: number;
  @Field(() => Int) activeUsers30d: number;
  @Field(() => Int) rabbits: number;
  @Field(() => Int) ratingsCount: number;
  @Field(() => Float, { nullable: true }) averageRating?: number | null;
  @Field(() => [Int], { description: 'Nombre de notes de 1 à 5 étoiles' }) ratingDistribution: number[];
  @Field(() => [AppRatingModel]) latestRatings: AppRatingModel[];
}
