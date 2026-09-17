import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FarmsService } from './farms.service';
import { FarmModel } from './models/farm.model';
import { CreateFarmInput } from './dto/create-farm.input';

@Resolver(() => FarmModel)
export class FarmsResolver {
  constructor(private readonly farmsService: FarmsService) {}

  @Mutation(() => FarmModel)
  async createFarm(
    @Args('input') input: CreateFarmInput,
  ): Promise<FarmModel> {
    return this.farmsService.create(input);
  }

  @Query(() => [FarmModel])
  async farms(): Promise<FarmModel[]> {
    return this.farmsService.findAll();
  }

  @Query(() => FarmModel, { nullable: true })
  async farm(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<FarmModel | null> {
    return this.farmsService.findOne(id);
  }
}