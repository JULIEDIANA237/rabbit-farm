import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { HealthService } from './health.service';
import { HealthRecordModel } from './models/health-record.model';
import { CreateHealthRecordInput } from './inputs/create-health-record.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { FarmRole } from '../generated/prisma/client';

@Resolver(() => HealthRecordModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class HealthResolver {
  constructor(private readonly healthService: HealthService) {}

  @Query(() => [HealthRecordModel])
  healthRecords(@CurrentUser() currentUser: CurrentUserType) {
    return this.healthService.findAll(currentUser);
  }

  @Query(() => HealthRecordModel)
  healthRecord(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.healthService.findOne(id, currentUser);
  }

  @Query(() => [HealthRecordModel])
  healthRecordsByRabbit(
    @Args('rabbitId', { type: () => ID }) rabbitId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.healthService.findByRabbit(rabbitId, currentUser);
  }

  @Mutation(() => HealthRecordModel)
  @Roles(
    FarmRole.ADMIN,
    FarmRole.BREEDING_MANAGER,
    FarmRole.EMPLOYEE,
    FarmRole.VETERINARIAN,
  )
  createHealthRecord(
    @Args('input') input: CreateHealthRecordInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.healthService.create(input, currentUser);
  }
}
