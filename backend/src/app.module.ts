import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { ThrottlerModule } from '@nestjs/throttler';

import type { Request, Response } from 'express';



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
import { MortalityModule } from './mortality/mortality.module';
import { StatisticsModule } from './statistics/statistics.module';
import { AssistantModule } from './assistant/assistant.module';
import { StorageModule } from './storage/storage.module';
import { MailModule } from './mail/mail.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './notifications/notifications.module';

import { GqlThrottlerGuard } from './auth/guards/gql-throttler.guard';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';

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