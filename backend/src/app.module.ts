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
  ],
})
export class AppModule {}