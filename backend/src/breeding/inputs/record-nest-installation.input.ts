import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class RecordNestInstallationInput {
  @Field(() => ID)
  breedingId: string;

  @Field()
  installedAt: Date;

  @Field({ nullable: true })
  nestType?: string;

  @Field({ nullable: true })
  material?: string;

  @Field({ nullable: true })
  observation?: string;
}
