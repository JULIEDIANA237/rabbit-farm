import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { FarmRole } from '../generated/prisma/client.js';

import { MortalityService } from './mortality.service.js';
import { MortalityModel } from './models/mortality.model.js';
import { RecordRabbitExitInput } from './inputs/record-rabbit-exit.input.js';
import { RecordLitterMortalityInput } from './inputs/record-litter-mortality.input.js';
import { RabbitModel } from '../rabbits/models/rabbit.model.js';

@Resolver(() => MortalityModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class MortalityResolver {
  constructor(private readonly mortalityService: MortalityService) {}

  @Query(() => [MortalityModel])
  mortalities(
    @Args('from', { type: () => Date, nullable: true }) from: Date | undefined,
    @Args('to', { type: () => Date, nullable: true }) to: Date | undefined,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.mortalityService.findAll(currentUser, from, to);
  }

  @Mutation(() => RabbitModel, {
    description: 'Décès, réforme ou transfert d’un lapin (§37, §58).',
  })
  @Roles(
    FarmRole.ADMIN,
    FarmRole.BREEDING_MANAGER,
    FarmRole.EMPLOYEE,
    FarmRole.VETERINARIAN,
  )
  recordRabbitExit(
    @Args('input') input: RecordRabbitExitInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.mortalityService.recordRabbitExit(input, currentUser);
  }

  @Mutation(() => MortalityModel)
  @Roles(
    FarmRole.ADMIN,
    FarmRole.BREEDING_MANAGER,
    FarmRole.EMPLOYEE,
    FarmRole.VETERINARIAN,
  )
  recordLitterMortality(
    @Args('input') input: RecordLitterMortalityInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.mortalityService.recordLitterMortality(input, currentUser);
  }
}
