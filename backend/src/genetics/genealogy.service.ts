import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserType } from '../auth/types/current-user.type';
import {
  RabbitPurpose,
  RabbitSex,
  RabbitStatus,
} from '../generated/prisma/client';

import {
  buildPedigreeMap,
  checkCompatibility,
  collectDescendants,
  wouldCreateCycle,
  type CompatibilityResult,
  type PedigreeMap,
} from './genealogy.utils';
import { CompatibilityLevel } from './graphql/compatibility-level.enum';
import type {
  BreedingCompatibilityModel,
  DescendantModel,
  PedigreeNodeModel,
} from './models/genealogy.models';

type FarmRabbit = {
  id: string;
  code: string;
  sex: RabbitSex;
  status: RabbitStatus;
  purpose: RabbitPurpose;
  birthDate: Date | null;
  fatherId: string | null;
  motherId: string | null;
  breed: { name: string } | null;
  crossBreed: { name: string } | null;
};

export interface FarmPedigree {
  rabbits: Map<string, FarmRabbit>;
  map: PedigreeMap;
}

/**
 * Service de généalogie : charge l'arbre de la ferme
 * et applique les règles pures de `genealogy.utils`.
 *
 * L'arbre complet d'une ferme est chargé en une seule requête
 * (colonnes minimales) : c'est plus simple et plus rapide qu'une
 * remontée récursive requête par requête.
 */
@Injectable()
export class GenealogyService {
  constructor(private readonly prisma: PrismaService) {}

  async loadFarmPedigree(farmId: string): Promise<FarmPedigree> {
    const rabbits = await this.prisma.rabbit.findMany({
      where: { farmId },
      select: {
        id: true,
        code: true,
        sex: true,
        status: true,
        purpose: true,
        birthDate: true,
        fatherId: true,
        motherId: true,
        breed: { select: { name: true } },
        crossBreed: { select: { name: true } },
      },
    });

    return {
      rabbits: new Map(rabbits.map((rabbit) => [rabbit.id, rabbit])),
      map: buildPedigreeMap(rabbits),
    };
  }

  private async farmPolicy(farmId: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id: farmId },
      select: { inbreedingPolicy: true },
    });

    return farm?.inbreedingPolicy ?? 'WARN';
  }

  toModel(
    femaleId: string,
    maleId: string,
    result: CompatibilityResult,
    pedigree: FarmPedigree,
  ): BreedingCompatibilityModel {
    return {
      femaleId,
      maleId,
      femaleCode: pedigree.rabbits.get(femaleId)?.code ?? femaleId,
      maleCode: pedigree.rabbits.get(maleId)?.code ?? maleId,
      level: result.level as CompatibilityLevel,
      reasons: result.reasons.map((reason) => ({
        code: reason.code,
        level: reason.level as CompatibilityLevel,
        message: reason.message,
      })),
      commonAncestors: result.commonAncestorIds
        .map((id) => pedigree.rabbits.get(id))
        .filter((rabbit): rabbit is FarmRabbit => Boolean(rabbit))
        .map((rabbit) => ({
          id: rabbit.id,
          code: rabbit.code,
          sex: rabbit.sex,
          status: rabbit.status,
          birthDate: rabbit.birthDate,
        })),
      inbreedingCoefficient: Number(result.inbreedingCoefficient.toFixed(4)),
    };
  }

  /**
   * Contrôle généalogique complet entre une femelle et un mâle.
   */
  async checkBreedingCompatibility(
    femaleId: string,
    maleId: string,
    currentUser: CurrentUserType,
  ): Promise<BreedingCompatibilityModel> {
    const pedigree = await this.loadFarmPedigree(currentUser.farmId);

    if (!pedigree.rabbits.has(femaleId) || !pedigree.rabbits.has(maleId)) {
      throw new NotFoundException(
        'Impossible de vérifier la généalogie : lapin introuvable dans cette ferme.',
      );
    }

    const policy = await this.farmPolicy(currentUser.farmId);
    const result = checkCompatibility(femaleId, maleId, pedigree.map, policy);

    return this.toModel(femaleId, maleId, result, pedigree);
  }

  /**
   * Lève une erreur métier compréhensible si l'accouplement
   * est bloqué, ou s'il présente un risque non confirmé.
   */
  async assertBreedingAllowed(
    femaleId: string,
    maleId: string,
    currentUser: CurrentUserType,
    acknowledgeWarnings = false,
  ) {
    const compatibility = await this.checkBreedingCompatibility(
      femaleId,
      maleId,
      currentUser,
    );

    const details = compatibility.reasons
      .map((reason) => reason.message)
      .join(' ');

    if (compatibility.level === CompatibilityLevel.BLOCKED) {
      throw new BadRequestException(
        `Impossible d'enregistrer l'accouplement. ${details}`,
      );
    }

    if (
      compatibility.level === CompatibilityLevel.WARNING &&
      !acknowledgeWarnings
    ) {
      throw new BadRequestException(
        `Accouplement à risque. ${details} Confirmez l'accouplement pour l'enregistrer malgré l'avertissement.`,
      );
    }

    return compatibility;
  }

  /**
   * Vérifie qu'une filiation ne crée pas de cycle généalogique.
   */
  async assertNoCycle(
    rabbitId: string,
    parentIds: Array<string | null | undefined>,
    currentUser: CurrentUserType,
  ) {
    const pedigree = await this.loadFarmPedigree(currentUser.farmId);

    if (wouldCreateCycle(rabbitId, parentIds, pedigree.map)) {
      throw new BadRequestException(
        'Cette filiation créerait un cycle généalogique : un lapin ne peut pas être son propre ancêtre.',
      );
    }
  }

  /**
   * Arbre des ascendants sur N générations (§16).
   */
  async pedigree(
    rabbitId: string,
    generations: number,
    currentUser: CurrentUserType,
  ): Promise<PedigreeNodeModel> {
    const pedigree = await this.loadFarmPedigree(currentUser.farmId);

    if (!pedigree.rabbits.has(rabbitId)) {
      throw new NotFoundException('Lapin introuvable.');
    }

    const depthLimit = Math.min(Math.max(generations, 1), 6);

    const build = (
      id: string | null,
      depth: number,
    ): PedigreeNodeModel | null => {
      if (!id) return null;
      const rabbit = pedigree.rabbits.get(id);
      if (!rabbit) return null;

      return {
        id: rabbit.id,
        code: rabbit.code,
        sex: rabbit.sex,
        status: rabbit.status,
        birthDate: rabbit.birthDate,
        breedName: rabbit.crossBreed?.name ?? rabbit.breed?.name ?? null,
        father: depth < depthLimit ? build(rabbit.fatherId, depth + 1) : null,
        mother: depth < depthLimit ? build(rabbit.motherId, depth + 1) : null,
      };
    };

    return build(rabbitId, 0) as PedigreeNodeModel;
  }

  /**
   * Descendants sur N générations (§16).
   */
  async descendants(
    rabbitId: string,
    generations: number,
    currentUser: CurrentUserType,
  ): Promise<DescendantModel[]> {
    const pedigree = await this.loadFarmPedigree(currentUser.farmId);

    if (!pedigree.rabbits.has(rabbitId)) {
      throw new NotFoundException('Lapin introuvable.');
    }

    const descendants = collectDescendants(
      rabbitId,
      [...pedigree.map.values()],
      Math.min(Math.max(generations, 1), 6),
    );

    return [...descendants.entries()]
      .map(([id, generation]) => {
        const rabbit = pedigree.rabbits.get(id) as FarmRabbit;
        return {
          id: rabbit.id,
          code: rabbit.code,
          sex: rabbit.sex,
          status: rabbit.status,
          birthDate: rabbit.birthDate,
          fatherId: rabbit.fatherId,
          motherId: rabbit.motherId,
          generation,
        };
      })
      .sort(
        (a, b) => a.generation - b.generation || a.code.localeCompare(b.code),
      );
  }

  /**
   * Croisements interdits ou à risque entre reproducteurs actifs (§52).
   */
  async riskyPairs(currentUser: CurrentUserType, limit = 50) {
    const pedigree = await this.loadFarmPedigree(currentUser.farmId);
    const policy = await this.farmPolicy(currentUser.farmId);

    const breeders = [...pedigree.rabbits.values()].filter(
      (rabbit) =>
        rabbit.status === RabbitStatus.ACTIVE &&
        (rabbit.purpose === RabbitPurpose.BREEDER ||
          rabbit.purpose === RabbitPurpose.FUTURE_BREEDER),
    );

    const females = breeders.filter((r) => r.sex === RabbitSex.FEMALE);
    const males = breeders.filter((r) => r.sex === RabbitSex.MALE);

    const pairs: BreedingCompatibilityModel[] = [];

    for (const female of females) {
      for (const male of males) {
        const result = checkCompatibility(
          female.id,
          male.id,
          pedigree.map,
          policy,
        );

        if (result.level !== 'COMPATIBLE') {
          pairs.push(this.toModel(female.id, male.id, result, pedigree));
        }
      }
    }

    return pairs
      .sort((a, b) => {
        if (a.level !== b.level) {
          return a.level === CompatibilityLevel.BLOCKED ? -1 : 1;
        }
        return b.inbreedingCoefficient - a.inbreedingCoefficient;
      })
      .slice(0, limit);
  }
}
