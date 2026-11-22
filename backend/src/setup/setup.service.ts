import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { BreedingService } from '../breeding/breeding.service.js';
import { RabbitsService } from '../rabbits/rabbits.service.js';
import type { CurrentUserType } from '../auth/types/current-user.type.js';
import { RabbitSex } from '../rabbits/graphql/rabbit-sex.enum.js';
import { RabbitPurpose } from '../rabbits/graphql/rabbit-purpose.enum.js';

import { BEGINNER_DAYS, setupProgress, type SetupCounts } from './setup-steps.js';
import type { ImportNotebookInput } from './setup.models.js';

const DAY = 86_400_000;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const MAX_ROWS = 200;

const describe = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 160);

@Injectable()
export class SetupService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbits: RabbitsService,
    private readonly breedings: BreedingService,
  ) {}

  async counts(farmId: string): Promise<SetupCounts & { rabbits: number; litters: number; lots: number }> {
    const active = { farmId, status: 'ACTIVE' as const };
    const [farm, cages, females, males, breedings, stockItems, pushSubscriptions, rabbits, litters, lots] = await Promise.all([
      this.prisma.farm.findUnique({ where: { id: farmId }, select: { location: true } }),
      this.prisma.cage.count({ where: { farmId } }),
      this.prisma.rabbit.count({ where: { ...active, sex: 'FEMALE', purpose: { in: ['BREEDER', 'FUTURE_BREEDER'] } } }),
      this.prisma.rabbit.count({ where: { ...active, sex: 'MALE', purpose: { in: ['BREEDER', 'FUTURE_BREEDER'] } } }),
      this.prisma.breeding.count({ where: { farmId } }),
      this.prisma.inventoryItem.count({ where: { farmId } }),
      this.prisma.pushSubscription.count({ where: { farmId } }),
      this.prisma.rabbit.count({ where: active }),
      this.prisma.litter.count({ where: { farmId } }),
      this.prisma.fatteningLot.count({ where: { farmId } }),
    ]);
    return {
      hasLocation: Boolean(farm?.location?.trim()), cages, females, males, breedings, stockItems, pushSubscriptions,
      rabbits, litters, lots,
    };
  }

  async status(user: CurrentUserType, now = new Date()) {
    if (!user.farmId) throw new BadRequestException('Aucune ferme associée à ce compte.');
    const [farm, counts] = await Promise.all([
      this.prisma.farm.findUniqueOrThrow({ where: { id: user.farmId }, select: { createdAt: true } }),
      this.counts(user.farmId),
    ]);
    const progress = setupProgress(counts);
    const farmAgeDays = Math.max(0, Math.floor((now.getTime() - farm.createdAt.getTime()) / DAY));
    return {
      ...progress,
      farmAgeDays,
      beginner: progress.percent < 100 && farmAgeDays <= BEGINNER_DAYS,
      rabbits: counts.rabbits,
      breedings: counts.breedings,
      litters: counts.litters,
      lots: counts.lots,
    };
  }

  /**
   * Enregistre ce que l'éleveur a validé après la lecture de son cahier :
   * d'abord les lapins (les codes déjà connus sont ignorés), puis les saillies.
   * Chaque ligne passe par les contrôles habituels ; une ligne refusée n'empêche pas les autres.
   */
  async importNotebook(user: CurrentUserType, input: ImportNotebookInput) {
    if (input.rabbits.length > MAX_ROWS || input.breedings.length > MAX_ROWS) {
      throw new BadRequestException(`Au plus ${MAX_ROWS} lignes par import.`);
    }
    const errors: string[] = [];
    const breeds = await this.prisma.breed.findMany({ where: { farmId: user.farmId }, select: { id: true, name: true } });
    const breedId = (name?: string | null) => {
      const wanted = name?.trim().toLowerCase();
      return wanted ? breeds.find((b) => b.name.trim().toLowerCase() === wanted)?.id : undefined;
    };

    let rabbits = 0;
    for (const r of input.rabbits) {
      const code = r.code.trim();
      if (!code) continue;
      const sex = r.sex === 'MALE' ? RabbitSex.MALE : r.sex === 'FEMALE' ? RabbitSex.FEMALE : RabbitSex.UNKNOWN;
      const known = breedId(r.breed);
      const notes = [r.note?.trim(), r.breed && !known ? `Race notée : ${r.breed.trim()}` : null].filter(Boolean).join(' · ');
      try {
        await this.rabbits.create(
          {
            code,
            sex,
            purpose: sex === RabbitSex.UNKNOWN ? RabbitPurpose.FATTENING : RabbitPurpose.BREEDER,
            breedId: known,
            birthDate: r.birthDate && ISO_DAY.test(r.birthDate) ? new Date(`${r.birthDate}T12:00:00Z`) : undefined,
            color: r.color?.trim() || undefined,
            observations: notes || undefined,
            origin: 'Cahier de la ferme',
          },
          user,
        );
        rabbits += 1;
      } catch (e) {
        errors.push(`Lapin ${code} : ${describe(e)}`);
      }
    }

    const codes = [...new Set(input.breedings.flatMap((b) => [b.femaleCode.trim(), b.maleCode.trim()]))];
    const found = await this.prisma.rabbit.findMany({
      where: { farmId: user.farmId, code: { in: codes, mode: 'insensitive' } },
      select: { id: true, code: true },
    });
    const idOf = (code: string) => found.find((f) => f.code.toLowerCase() === code.trim().toLowerCase())?.id;

    let breedings = 0;
    for (const b of input.breedings) {
      const label = `Saillie ${b.femaleCode} × ${b.maleCode}`;
      const femaleId = idOf(b.femaleCode);
      const maleId = idOf(b.maleCode);
      if (!femaleId || !maleId) {
        errors.push(`${label} : lapin introuvable (${!femaleId ? b.femaleCode : b.maleCode}).`);
        continue;
      }
      if (!ISO_DAY.test(b.date)) {
        errors.push(`${label} : date manquante.`);
        continue;
      }
      try {
        await this.breedings.create(
          { femaleId, maleId, breedingDate: new Date(`${b.date}T08:00:00Z`), observation: b.note?.trim() || 'Repris du cahier' },
          user,
        );
        breedings += 1;
      } catch (e) {
        errors.push(`${label} : ${describe(e)}`);
      }
    }
    return { rabbits, breedings, errors };
  }
}
