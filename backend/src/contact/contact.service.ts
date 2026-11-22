import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import { PlatformService, platformAdmins } from '../platform/platform.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';

import type { ContactMessageInput } from './contact.models.js';

@Injectable()
export class ContactService {
  private readonly logger = new Logger('Contact');

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly platform: PlatformService,
  ) {}

  /** Message de la page d'accueil : enregistré, puis signalé par e-mail à la propriétaire. */
  async send(input: ContactMessageInput) {
    // Un robot a rempli le champ invisible : on fait comme si tout allait bien.
    if (input.website?.trim()) return true;
    const name = input.name.trim();
    const contact = input.contact.trim();
    const message = input.message.trim();
    if (name.length < 2 || contact.length < 5 || message.length < 10) {
      throw new BadRequestException('Indique ton nom, un moyen de te joindre et ton message (10 caractères au moins).');
    }
    await this.prisma.contactMessage.create({ data: { name, contact, message } });
    for (const to of platformAdmins()) {
      await this.mail
        .send({ to, subject: `RabbitFarm : nouveau message de ${name}`, text: `${name} (${contact}) a écrit :\n\n${message}` })
        .catch((e: unknown) => this.logger.warn(`E-mail de contact non envoyé : ${String(e)}`));
    }
    return true;
  }

  list(user: CurrentUserType) {
    this.assertAdmin(user);
    return this.prisma.contactMessage.findMany({ orderBy: [{ handled: 'asc' }, { createdAt: 'desc' }], take: 200 });
  }

  async setHandled(user: CurrentUserType, id: string, handled: boolean) {
    this.assertAdmin(user);
    const found = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Message introuvable.');
    return this.prisma.contactMessage.update({ where: { id }, data: { handled } });
  }

  private assertAdmin(user: CurrentUserType) {
    if (!this.platform.isAdmin(user)) throw new ForbiddenException('Réservé à la propriétaire de l’application.');
  }
}
