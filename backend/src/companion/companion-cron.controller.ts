import { Controller, Get, Headers } from '@nestjs/common';

import { assertCronSecret } from '../notifications/cron.controller.js';

import { CompanionService } from './companion.service.js';

/**
 * Tournées de l'assistant à 6 h, 13 h et 18 h (Douala), appelées par la tâche planifiée
 * GitHub Actions (.github/workflows/farm-assistant.yml) avec « Authorization: Bearer <CRON_SECRET> ».
 */
@Controller('cron')
export class CompanionCronController {
  constructor(private readonly companion: CompanionService) {}

  @Get('farm-assistant')
  farmAssistant(@Headers('authorization') authorization?: string) {
    assertCronSecret(authorization);
    return this.companion.tour();
  }
}
