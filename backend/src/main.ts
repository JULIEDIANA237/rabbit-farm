import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  join,
} from 'path';

import * as express from 'express';

import { AppModule } from './app.module';
import { trustSystemCertificates } from './common/utils/system-ca';

async function bootstrap() {
  trustSystemCertificates();

  const app = await NestFactory.create(AppModule);

  /**
   * Autorise le frontend (origin distincte)
   * à consommer l'API GraphQL.
   * En production, CORS_ORIGINS liste les adresses autorisées
   * séparées par des virgules (ex. https://rabbit-farm.vercel.app).
   */
  const corsOrigins = [
    'http://localhost:3000',
    ...(process.env.CORS_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim().replace(/\/$/, ''))
      .filter(Boolean),
  ];

  app.enableCors({
  origin: corsOrigins,

  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
  ],
});
  /**
   * Validation globale des inputs (class-validator).
   *
   * `transform` convertit les payloads en instances
   * des DTO. Pas de `whitelist` : seuls les inputs
   * dotés de decorators class-validator sont filtrés,
   * les autres ne sont pas impactés.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.use(
    '/uploads',
    express.static(
      join(
        process.cwd(),
        'uploads',
      ),
    ),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
