import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  join,
} from 'path';

import * as express from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Autorise le frontend (origin distincte)
   * à consommer l'API GraphQL.
   */
  app.enableCors();

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
