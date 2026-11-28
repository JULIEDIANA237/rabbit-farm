import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { BreedingModel } from '../breeding/models/breeding.model.js';
import { FarmRole } from '../generated/prisma/client.js';
import { PastBreedingService } from './past-breeding.service.js';
import { RecordPastBreedingInput } from './record-past-breeding.input.js';

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PastBreedingResolver {
  constructor(private readonly service: PastBreedingService) {}

  @Mutation(() => BreedingModel, {
    description: "Saillie d'il y a 65 jours ou plus : mise bas, sevrage et lot d'engraissement enregistrés en même temps",
  })
  @Roles(FarmRole.ADMIN, FarmRole.BREEDING_MANAGER)
  recordPastBreeding(@Args('input') input: RecordPastBreedingInput, @CurrentUser() currentUser: CurrentUserType) {
    return this.service.record(input, currentUser);
  }
}
