import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { MailModule } from '../mail/mail.module.js';

import { ContactResolver } from './contact.resolver.js';
import { ContactService } from './contact.service.js';

@Module({
  imports: [AuthModule, MailModule],
  providers: [ContactService, ContactResolver],
})
export class ContactModule {}
