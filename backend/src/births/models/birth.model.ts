import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BirthModel {
	@Field(() => ID)
	id: string;

	@Field(() => ID)
	breedingId: string;

	@Field(() => ID)
	motherId: string;

	@Field()
	birthDate: Date;

	@Field(() => Int)
	liveBorn: number;

	@Field(() => Int)
	stillBorn: number;

	@Field({ nullable: true })
	observation?: string;

	@Field()
	createdAt: Date;
}
