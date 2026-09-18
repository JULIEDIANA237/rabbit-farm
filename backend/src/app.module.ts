import { Module } from '@nestjs/common';
import type { Request } from 'express';
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

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,

      context: ({ req }: { req: Request }) => ({
        req,
      }),
    }),

    PrismaModule,
    AuthModule,
    FarmsModule,
    UsersModule,
    SectionsModule,
    CagesModule,
  ],
})
export class AppModule {}