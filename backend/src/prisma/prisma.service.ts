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
      // Laisse à Neon le temps de sortir de veille et garde les connexions
      // actives pour limiter les reconnexions depuis une liaison lente.
      connectionTimeoutMillis: Number(
        process.env.DB_CONNECT_TIMEOUT_MS ?? 30000,
      ),
      idleTimeoutMillis: 60_000,
      keepAlive: true,
    });

    // Neon (us-east-2) est loin et peut sortir de veille : les délais
    // par défaut de Prisma (2 s pour démarrer, 5 s pour exécuter une
    // transaction) déclenchent l'erreur P2028.
    super({
      adapter,
      transactionOptions: {
        maxWait: Number(process.env.PRISMA_TX_MAX_WAIT_MS ?? 15000),
        timeout: Number(process.env.PRISMA_TX_TIMEOUT_MS ?? 30000),
      },
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