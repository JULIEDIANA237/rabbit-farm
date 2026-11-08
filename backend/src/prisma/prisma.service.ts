import 'dotenv/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString:
        process.env.DATABASE_URL_UNPOOLED ??
        process.env.DATABASE_URL,
      // Neon (us-east-2) est loin et peut être en veille : laisser le temps de se connecter
      connectionTimeoutMillis: 30_000,
      idleTimeoutMillis: 60_000,
      keepAlive: true,
    });

    // Par défaut Prisma n'attend que 2 s pour démarrer une transaction (P2028)
    super({
      adapter,
      transactionOptions: { maxWait: 20_000, timeout: 30_000 },
    });
  }

  async onModuleInit(): Promise<void> {
  await this.$connect();

  console.log('✅ PostgreSQL connecté via Prisma');
}

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}