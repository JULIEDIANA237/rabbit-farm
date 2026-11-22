import { Controller, Get, Headers } from '@nestjs/common';

import { assertCronSecret } from '../notifications/cron.controller.js';

import { AgentService } from './agent.service.js';

/** Tournée du matin (6 h à Douala), appelée par la tâche planifiée de Vercel. */
@Controller('cron')
export class AgentCronController {
  constructor(private readonly agent: AgentService) {}

  @Get('owner-agent')
  async ownerAgent(@Headers('authorization') authorization?: string) {
    assertCronSecret(authorization);
    const brief = await this.agent.run({ notify: true });
    return { ok: true, pending: brief.pending };
  }
}
