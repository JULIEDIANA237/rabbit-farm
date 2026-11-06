import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NestInstallationModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  breedingId: string;

  @Field()
  installedAt: Date;

  @Field(() => String, { nullable: true })
  nestType?: string | null;

  @Field(() => String, { nullable: true })
  material?: string | null;

  @Field(() => String, { nullable: true })
  observation?: string | null;
}
