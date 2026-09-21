import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateWeaningInput {
	@Field(() => ID)
	litterId: string;

	@Field()
	plannedDate: Date;

	@Field(() => Int)
	quantity: number;

	@Field({ nullable: true })
	actualDate?: Date;

	@Field({ nullable: true })
	totalWeight?: number;

	@Field({ nullable: true })
	averageWeight?: number;

	@Field({ nullable: true })
	observation?: string;

	@Field(() => [ID], { nullable: true })
	rabbitIds?: string[];
}
