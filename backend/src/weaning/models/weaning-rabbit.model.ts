import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WeaningRabbitModel {
	@Field(() => ID)
	id: string;

	@Field(() => ID)
	weaningId: string;

	@Field(() => ID)
	rabbitId: string;

	@Field({ nullable: true })
	weight?: number;

	@Field()
	createdAt: Date;
}
