import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { WeaningRabbitModel } from './weaning-rabbit.model';

@ObjectType()
export class WeaningModel {
	@Field(() => ID)
	id: string;

	@Field(() => ID)
	farmId: string;

	@Field(() => ID)
	litterId: string;

	@Field()
	plannedDate: Date;

	@Field({ nullable: true })
	actualDate?: Date;

	@Field(() => Int)
	quantity: number;

	@Field({ nullable: true })
	totalWeight?: number;

	@Field({ nullable: true })
	averageWeight?: number;

	@Field({ nullable: true })
	observation?: string;

	@Field()
	createdAt: Date;

	@Field()
	updatedAt: Date;

	@Field(() => [WeaningRabbitModel])
	rabbits: WeaningRabbitModel[];
}
