import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { ThrottlerModule } from '@nestjs/throttler';

import type { Request, Response } from 'express';

import { join } from 'path';

import {
  ApolloDriver,
  ApolloDriverConfig,
} from '@nestjs/apollo';

import { GraphQLModule } from '@nestjs/graphql';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

import { FarmsModule } from './farms/farms.module';
import { UsersModule } from './users/users.module';
import { SectionsModule } from './sections/sections.module';
import { CagesModule } from './cages/cages.module';
import { RabbitsModule } from './rabbits/rabbits.module';
import { GeneticsModule } from './genetics/genetics.module';
import { BreedingModule } from './breeding/breeding.module';
import { PregnancyModule } from './pregnancy/pregnancy.module';
import { BirthsModule } from './births/births.module';
import { LittersModule } from './litters/litters.module';
import { AdoptionsModule } from './adoptions/adoptions.module';
import { WeaningModule } from './weaning/weaning.module';
import { FatteningModule } from './fattening/fattening.module';
import { HealthModule } from './health/health.module';
import { SalesModule } from './sales/sales.module';
import { OperationsModule } from './operations/operations.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { GqlThrottlerGuard } from './auth/guards/gql-throttler.guard';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      autoSchemaFile: join(
        process.cwd(),
        'src/schema.gql',
      ),

      sortSchema: true,

      context: ({
        req,
        res,
      }: {
        req: Request;
        res: Response;
      }) => ({
        req,
        res,
      }),
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 300,
      },
    ]),

    PrismaModule,

    AuthModule,
    FarmsModule,
    UsersModule,
    SectionsModule,
    CagesModule,
    RabbitsModule,
    GeneticsModule,
    BreedingModule,
    PregnancyModule,
    BirthsModule,
    LittersModule,
    AdoptionsModule,
    WeaningModule,
    FatteningModule,
    HealthModule,
    SalesModule,
    OperationsModule,
    DashboardModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}