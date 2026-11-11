import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';


import type { Request, Response } from 'express';



import {
  ApolloDriver,
  ApolloDriverConfig,
} from '@nestjs/apollo';

import { GraphQLModule } from '@nestjs/graphql';

import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';

import { FarmsModule } from './farms/farms.module.js';
import { UsersModule } from './users/users.module.js';
import { SectionsModule } from './sections/sections.module.js';
import { CagesModule } from './cages/cages.module.js';
import { RabbitsModule } from './rabbits/rabbits.module.js';
import { GeneticsModule } from './genetics/genetics.module.js';
import { BreedingModule } from './breeding/breeding.module.js';
import { PregnancyModule } from './pregnancy/pregnancy.module.js';
import { BirthsModule } from './births/births.module.js';
import { LittersModule } from './litters/litters.module.js';
import { AdoptionsModule } from './adoptions/adoptions.module.js';
import { WeaningModule } from './weaning/weaning.module.js';
import { FatteningModule } from './fattening/fattening.module.js';
import { HealthModule } from './health/health.module.js';
import { SalesModule } from './sales/sales.module.js';
import { OperationsModule } from './operations/operations.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { MortalityModule } from './mortality/mortality.module.js';
import { StatisticsModule } from './statistics/statistics.module.js';
import { AssistantModule } from './assistant/assistant.module.js';
import { StorageModule } from './storage/storage.module.js';
import { MailModule } from './mail/mail.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { NotificationsModule } from './notifications/notifications.module.js';

import { GqlThrottlerGuard } from './auth/guards/gql-throttler.guard.js';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor.js';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      // Sur Vercel le disque est en lecture seule : schéma gardé en mémoire.
      autoSchemaFile: process.env.VERCEL
        ? true
        : join(process.cwd(), 'src/schema.gql'),

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
    MortalityModule,
    StatisticsModule,
    AssistantModule,
    StorageModule,
    MailModule,
    NotificationsModule,
  ],

  // GET / répond « Hello World! » : sert à vérifier que l'API est en ligne.
  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}