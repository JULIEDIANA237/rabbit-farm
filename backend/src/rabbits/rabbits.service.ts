import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import type { CurrentUserType } from '../auth/types/current-user.type.js';

import { AddRabbitIdentificationInput } from './inputs/add-rabbit-identification.input.js';
import { CreateRabbitInput } from './inputs/create-rabbit.input.js';
import { MoveRabbitInput } from './inputs/move-rabbit.input.js';
import { UpdateRabbitInput } from './inputs/update-rabbit.input.js';
import { RabbitsPaginationInput } from './inputs/rabbits-pagination.input.js';
import { normalizeMovementReason } from '../common/constants/movement-reasons.js';

type RabbitWithRelations = {
  photos?: unknown[] | null;
  identifications?: unknown[] | null;
  cageMovements?: Array<{ cage: { id: string; code: string } }>;
  breed?: { name: string } | null;
  crossBreed?: { name: string } | null;
  weight?: { toString(): string } | number | null;
  [key: string]: unknown;
};

/**
 * Convertit un lapin Prisma en RabbitModel GraphQL
 * (localisation actuelle, race lisible, poids numérique).
 */
export function mapRabbit<T extends RabbitWithRelations>(rabbit: T) {
  const { cageMovements, breed, crossBreed, ...rest } = rabbit;
  const currentCage = cageMovements?.[0]?.cage ?? null;

  return {
    ...rest,
    weight: rabbit.weight != null ? Number(rabbit.weight) : null,
    photos: rabbit.photos ?? [],
    identifications: rabbit.identifications ?? [],
    currentCageId: currentCage?.id ?? null,
    currentCageCode: currentCage?.code ?? null,
    breedName: crossBreed?.name ?? breed?.name ?? null,
  };
}

@Injectable()
export class RabbitsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Relations communes utilisées lorsque nous retournons un lapin.
   *
   * Centraliser les includes évite d'avoir :
   * - photos sur certaines requêtes ;
   * - photos absentes sur d'autres ;
   * - identifications absentes sur certaines requêtes.
   *
   * Important :
   * photos est une relation de type tableau.
   * Prisma retourne donc normalement [] lorsqu'il n'y a aucune photo.
   */
  private readonly rabbitInclude = {
    identifications: true,
    photos: true,
    breed: { select: { name: true } },
    crossBreed: { select: { name: true } },
    cageMovements: {
      where: { endedAt: null },
      include: { cage: { select: { id: true, code: true } } },
      take: 1,
    },
  } as const;

  /**
   * Recherche un lapin appartenant à la ferme de l'utilisateur.
   */
  private async findRabbitOrFail(
    id: string,
    farmId: string,
  ) {
    const rabbit = await this.prisma.rabbit.findFirst({
      where: {
        id,
        farmId,
      },
      include: this.rabbitInclude,
    });

    if (!rabbit) {
      throw new NotFoundException(
        'Lapin introuvable.',
      );
    }

    return mapRabbit(rabbit);
  }

  /**
   * Vérifie que les parents appartiennent à la même ferme.
   */
  private async validateParents(
    parentIds: Array<string | undefined>,
    farmId: string,
  ) {
    const ids = parentIds.filter(
      (id): id is string => Boolean(id),
    );

    if (ids.length === 0) {
      return;
    }

    const parents = await this.prisma.rabbit.findMany({
      where: {
        id: {
          in: ids,
        },
        farmId,
      },
      select: {
        id: true,
      },
    });

    const existingIds = new Set(
      parents.map((parent) => parent.id),
    );

    const missingId = ids.find(
      (id) => !existingIds.has(id),
    );

    if (missingId) {
      throw new NotFoundException(
        `Le lapin parent ${missingId} est introuvable dans cette ferme.`,
      );
    }
  }

  /**
   * Vérifie si un lapin est descendant d'un autre.
   *
   * Utilisé pour empêcher la création de cycles généalogiques.
   */
  private async isDescendant(
    possibleDescendantId: string,
    ancestorId: string,
    currentUser: CurrentUserType,
    visited = new Set<string>(),
  ): Promise<boolean> {
    if (possibleDescendantId === ancestorId) {
      return true;
    }

    if (visited.has(possibleDescendantId)) {
      return false;
    }

    visited.add(possibleDescendantId);

    const rabbit = await this.prisma.rabbit.findFirst({
      where: {
        id: possibleDescendantId,
        farmId: currentUser.farmId,
      },
      select: {
        fatherId: true,
        motherId: true,
      },
    });

    if (!rabbit) {
      return false;
    }

    if (
      rabbit.fatherId &&
      (await this.isDescendant(
        rabbit.fatherId,
        ancestorId,
        currentUser,
        visited,
      ))
    ) {
      return true;
    }

    if (
      rabbit.motherId &&
      (await this.isDescendant(
        rabbit.motherId,
        ancestorId,
        currentUser,
        visited,
      ))
    ) {
      return true;
    }

    return false;
  }

  /**
   * Collecte tous les ancêtres d'un lapin.
   */
  private async collectAncestors(
    rabbitId: string,
    currentUser: CurrentUserType,
    visited = new Set<string>(),
  ): Promise<Set<string>> {
    if (visited.has(rabbitId)) {
      return visited;
    }

    visited.add(rabbitId);

    const rabbit = await this.prisma.rabbit.findFirst({
      where: {
        id: rabbitId,
        farmId: currentUser.farmId,
      },
      select: {
        fatherId: true,
        motherId: true,
      },
    });

    if (!rabbit) {
      return visited;
    }

    if (rabbit.fatherId) {
      await this.collectAncestors(
        rabbit.fatherId,
        currentUser,
        visited,
      );
    }

    if (rabbit.motherId) {
      await this.collectAncestors(
        rabbit.motherId,
        currentUser,
        visited,
      );
    }

    return visited;
  }

  /**
   * Validation complète de la généalogie.
   */
  private async validateGenealogy(
    rabbitId: string | undefined,
    fatherId: string | undefined,
    motherId: string | undefined,
    currentUser: CurrentUserType,
  ) {
    if (!fatherId && !motherId) {
      return;
    }

    if (!fatherId || !motherId) {
      throw new BadRequestException(
        'Le père et la mère doivent être renseignés ensemble.',
      );
    }

    if (fatherId === motherId) {
      throw new BadRequestException(
        'Le père et la mère doivent être deux lapins différents.',
      );
    }

    if (
      rabbitId &&
      (rabbitId === fatherId ||
        rabbitId === motherId)
    ) {
      throw new BadRequestException(
        'Un lapin ne peut pas être son propre parent.',
      );
    }

    if (rabbitId) {
      const fatherWouldBecomeDescendant =
        await this.isDescendant(
          fatherId,
          rabbitId,
          currentUser,
        );

      const motherWouldBecomeDescendant =
        await this.isDescendant(
          motherId,
          rabbitId,
          currentUser,
        );

      if (
        fatherWouldBecomeDescendant ||
        motherWouldBecomeDescendant
      ) {
        throw new BadRequestException(
          'Cette filiation créerait un cycle généalogique interdit.',
        );
      }
    }

    const parents =
      await this.prisma.rabbit.findMany({
        where: {
          farmId: currentUser.farmId,
          id: {
            in: [fatherId, motherId],
          },
        },
      });

    if (parents.length !== 2) {
      throw new BadRequestException(
        "Le père ou la mère n'appartient pas à cette ferme.",
      );
    }

    const father = parents.find(
      (parent) => parent.id === fatherId,
    );

    const mother = parents.find(
      (parent) => parent.id === motherId,
    );

    if (!father || !mother) {
      throw new BadRequestException(
        'Impossible de retrouver les deux parents.',
      );
    }

    if (father.sex !== 'MALE') {
      throw new BadRequestException(
        'Le parent déclaré comme père doit être un mâle.',
      );
    }

    if (mother.sex !== 'FEMALE') {
      throw new BadRequestException(
        'Le parent déclaré comme mère doit être une femelle.',
      );
    }

    // Un parent décédé ou vendu reste un parent : on ne bloque pas
    // l'enregistrement d'une filiation historique.
  }

  /**
   * Détecte les ancêtres communs entre deux lapins.
   */
  async detectCommonAncestors(
    rabbitAId: string,
    rabbitBId: string,
    currentUser: CurrentUserType,
  ) {
    const ancestorsA =
      await this.collectAncestors(
        rabbitAId,
        currentUser,
      );

    const ancestorsB =
      await this.collectAncestors(
        rabbitBId,
        currentUser,
      );

    return [...ancestorsA].filter(
      (id) => ancestorsB.has(id),
    );
  }

  /**
   * Liste paginée des lapins.
   *
   * Utilisée notamment par l'ancienne query rabbits.
   */
  async findAll(
    currentUser: CurrentUserType,
    page = 1,
    limit = 10,
    search?: string,
  ) {
    const safePage = Math.max(1, page);

    const safeLimit = Math.min(
      Math.max(1, limit),
      100,
    );

    const normalizedSearch =
      search?.trim();

    const where = {
      farmId: currentUser.farmId,

      ...(normalizedSearch
        ? {
            OR: [
              {
                code: {
                  contains:
                    normalizedSearch,
                  mode: 'insensitive' as const,
                },
              },
              {
                color: {
                  contains:
                    normalizedSearch,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    };

    const [
      rabbits,
      total,
    ] = await this.prisma.$transaction([
      this.prisma.rabbit.findMany({
        where,

        include: this.rabbitInclude,

        orderBy: {
          code: 'asc',
        },

        skip:
          (safePage - 1) *
          safeLimit,

        take: safeLimit,
      }),

      this.prisma.rabbit.count({
        where,
      }),
    ]);

    const totalPages =
      Math.ceil(
        total / safeLimit,
      );

    return {
      items: rabbits.map(
        (rabbit) => (mapRabbit(rabbit)),
      ),

      total,

      page: safePage,

      limit: safeLimit,

      totalPages,

      hasNextPage:
        safePage < totalPages,

      hasPreviousPage:
        safePage > 1,
    };
  }

  /**
   * Détail d'un lapin.
   */
  async findOne(
    id: string,
    currentUser: CurrentUserType,
  ) {
    return this.findRabbitOrFail(
      id,
      currentUser.farmId,
    );
  }

  /**
   * Création d'un lapin.
   */
  async create(
    input: CreateRabbitInput,
    currentUser: CurrentUserType,
  ) {
    const code =
      input.code.trim();

    if (!code) {
      throw new BadRequestException(
        'Le code du lapin est obligatoire.',
      );
    }

    const existing =
      await this.prisma.rabbit.findUnique({
        where: {
          farmId_code: {
            farmId:
              currentUser.farmId,
            code,
          },
        },
      });

    if (existing) {
      throw new ConflictException(
        'Un lapin portant ce code existe déjà dans cette ferme.',
      );
    }

    await this.validateGenealogy(
      undefined,
      input.fatherId,
      input.motherId,
      currentUser,
    );

    const rabbit =
      await this.prisma.rabbit.create({
        data: {
          farmId:
            currentUser.farmId,

          code,

          sex: input.sex,

          breedId:
            input.breedId,

          crossBreedId:
            input.crossBreedId,

          fatherId:
            input.fatherId,

          motherId:
            input.motherId,

          birthDate:
            input.birthDate,

          purpose:
            input.purpose ??
            'FATTENING',

          color:
            input.color,

          weight:
            input.weight,

          observations:
            input.observations,
        },

        include:
          this.rabbitInclude,
      });

    return mapRabbit(rabbit);
  }

  /**
   * Modification d'un lapin.
   */
  async update(
    input: UpdateRabbitInput,
    currentUser: CurrentUserType,
  ) {
    const current = await this.findRabbitOrFail(
      input.id,
      currentUser.farmId,
    );

    if (input.code !== undefined) {
      const code =
        input.code.trim();

      if (!code) {
        throw new BadRequestException(
          'Le code du lapin est obligatoire.',
        );
      }

      const existing =
        await this.prisma.rabbit.findFirst({
          where: {
            farmId:
              currentUser.farmId,

            code,

            NOT: {
              id: input.id,
            },
          },
        });

      if (existing) {
        throw new ConflictException(
          'Un lapin portant ce code existe déjà dans cette ferme.',
        );
      }
    }

    /*
     * Si la modification concerne la généalogie,
     * on revalide les parents.
     */
    

    const genealogyChanged =
      (input.fatherId !== undefined &&
        input.fatherId !== current.fatherId) ||
      (input.motherId !== undefined &&
        input.motherId !== current.motherId);

    if (genealogyChanged) {
      await this.validateGenealogy(
        input.id,
        input.fatherId ?? current.fatherId ?? undefined,
        input.motherId ?? current.motherId ?? undefined,
        currentUser,
      );
    }

    const newCode = input.code?.trim();
    const codeChanged =
      newCode !== undefined && newCode !== current.code;

    const rabbit =
      await this.prisma.rabbit.update({
        where: {
          id: input.id,
        },
        data: {
          code: newCode,
          // L001-07 → R034 : on conserve le code d'origine (§12).
          ...(codeChanged && !current.originalCode
            ? { originalCode: current.code }
            : {}),
          fatherId: input.fatherId,
          motherId: input.motherId,
          birthDate: input.birthDate,
          // Le statut n'est modifié que s'il est fourni
          // (auparavant toute modification réactivait le lapin).
          status: input.status,

          breedId:
            input.breedId,

          purpose:
            input.purpose,

          sex:
            input.sex,

          crossBreedId:
            input.crossBreedId,

          color:
            input.color,

          weight:
            input.weight,

          observations:
            input.observations,
        },

        include:
          this.rabbitInclude,
      });

    return mapRabbit(rabbit);
  }

  /**
   * Ajoute une identification physique.
   */
  async addIdentification(
    rabbitId: string,
    input: AddRabbitIdentificationInput,
    currentUser: CurrentUserType,
  ) {
    await this.findRabbitOrFail(
      rabbitId,
      currentUser.farmId,
    );

    const value =
      input.value.trim();

    if (!value) {
      throw new BadRequestException(
        "La valeur de l'identification est obligatoire.",
      );
    }

    try {
      return await this.prisma.rabbitIdentification.create(
        {
          data: {
            rabbitId,

            type: input.type,

            value,
          },
        },
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.constructor.name ===
          'PrismaClientKnownRequestError'
      ) {
        throw new ConflictException(
          'Cette identification existe déjà.',
        );
      }

      throw error;
    }
  }

  /**
   * Récupère les identifications d'un lapin.
   */
  async getIdentifications(
    rabbitId: string,
    currentUser: CurrentUserType,
  ) {
    await this.findRabbitOrFail(
      rabbitId,
      currentUser.farmId,
    );

    return this.prisma.rabbitIdentification.findMany(
      {
        where: {
          rabbitId,
        },

        orderBy: {
          createdAt: 'asc',
        },
      },
    );
  }

  /**
   * Déplace un lapin vers une cage.
   */
  async moveRabbit(
    input: MoveRabbitInput,
    currentUser: CurrentUserType,
  ) {
    const now = input.movedAt ? new Date(input.movedAt) : new Date();

    if (Number.isNaN(now.getTime())) {
      throw new BadRequestException('La date de déplacement est invalide.');
    }

    let reason: string | null;
    try {
      reason = normalizeMovementReason(input.reason);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    return this.prisma.$transaction(
      async (tx) => {
        // 1. Vérifier le lapin
        const rabbit =
          await tx.rabbit.findFirst({
            where: {
              id: input.rabbitId,
              farmId:
                currentUser.farmId,
            },
          });

        if (!rabbit) {
          throw new NotFoundException(
            'Lapin introuvable.',
          );
        }

        if (
          rabbit.status !== 'ACTIVE'
        ) {
          throw new BadRequestException(
            'Seul un lapin actif peut être déplacé.',
          );
        }

        // 2. Vérifier la cage
        const cage =
          await tx.cage.findFirst({
            where: {
              id: input.cageId,
              farmId:
                currentUser.farmId,
            },
          });

        if (!cage) {
          throw new NotFoundException(
            'Cage introuvable.',
          );
        }

        if (
          cage.status !== 'ACTIVE'
        ) {
          throw new BadRequestException(
            'Le lapin ne peut pas être placé dans une cage inactive ou en maintenance.',
          );
        }

        // 3. Mouvement actuel
        const currentMovement =
          await tx.rabbitCageMovement.findFirst(
            {
              where: {
                rabbitId:
                  rabbit.id,

                endedAt: null,
              },

              orderBy: {
                startedAt: 'desc',
              },
            },
          );

        // 4. Même cage
        if (
          currentMovement?.cageId ===
          cage.id
        ) {
          throw new BadRequestException(
            'Le lapin se trouve déjà dans cette cage.',
          );
        }

        if (currentMovement && now < currentMovement.startedAt) {
          throw new BadRequestException(
            'La date du déplacement est antérieure au dernier emplacement connu.',
          );
        }

        // 5. Capacité
        const rabbitCount =
          await tx.rabbitCageMovement.count(
            {
              where: {
                cageId:
                  cage.id,

                endedAt: null,
              },
            },
          );

        if (
          rabbitCount >=
          cage.capacity
        ) {
          throw new BadRequestException(
            `La cage ${cage.code} est pleine (${rabbitCount}/${cage.capacity}).`,
          );
        }

        // 6. Fermer l'ancien mouvement
        if (currentMovement) {
          await tx.rabbitCageMovement.update(
            {
              where: {
                id:
                  currentMovement.id,
              },

              data: {
                endedAt: now,
              },
            },
          );
        }

        // 7. Nouveau mouvement
        const movement = await tx.rabbitCageMovement.create(
          {
            data: {
              rabbitId:
                rabbit.id,
              cageId:
                cage.id,
              startedAt:
                now,
              reason:
                reason ??
                (currentMovement ? 'OTHER' : 'INITIAL_ASSIGNMENT'),

              observation:
                input.observation?.trim() ||
                null,
            },
          },
        );

        return { ...movement, cageCode: cage.code };
      },
      {
        maxWait: 10_000,
        timeout: 20_000,
      },
    );
  }

  /**
   * Historique des déplacements d'un lapin.
   */
  async getRabbitCageMovements(
    rabbitId: string,
    currentUser: CurrentUserType,
  ) {
    const rabbit =
      await this.prisma.rabbit.findFirst(
        {
          where: {
            id: rabbitId,
            farmId:
              currentUser.farmId,
          },

          select: {
            id: true,
          },
        },
      );

    if (!rabbit) {
      throw new NotFoundException(
        'Lapin introuvable.',
      );
    }

    const movements = await this.prisma.rabbitCageMovement.findMany(
      {
        where: {
          rabbitId,
        },
        include: {
          cage: { select: { code: true } },
        },
        orderBy: {
          startedAt: 'desc',
        },
      },
    );

    return movements.map(({ cage, ...movement }) => ({
      ...movement,
      cageCode: cage.code,
    }));
  }

  /**
   * Pagination moderne utilisée par le frontend.
   */
  async findPaginated(
    currentUser: CurrentUserType,
    input: RabbitsPaginationInput,
  ) {
    const page =
      Math.max(
        1,
        input.page ?? 1,
      );

    const pageSize =
      Math.min(
        200,
        Math.max(
          1,
          input.pageSize ?? 10,
        ),
      );

    const search =
      input.search?.trim();
    const where = {
      farmId:
        currentUser.farmId,
      ...(input.sex ? { sex: input.sex } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.purpose ? { purpose: input.purpose } : {}),
      ...(input.litterId ? { birthLitterId: input.litterId } : {}),
      ...(input.cageId
        ? {
            cageMovements: {
              some: { cageId: input.cageId, endedAt: null },
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                code: {
                  contains:
                    search,

                  mode:
                    'insensitive' as const,
                },
              },

              {
                color: {
                  contains:
                    search,

                  mode:
                    'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    };

    const [
      items,
      total,
    ] = await Promise.all([
      this.prisma.rabbit.findMany({
        where,

        include:
          this.rabbitInclude,

        skip:
          (page - 1) *
          pageSize,

        take:
          pageSize,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.rabbit.count({
        where,
      }),
    ]);

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(
            total / pageSize,
          );

    return {
      items: items.map(
        (rabbit) => (mapRabbit(rabbit)),
      ),

      total,

      page,

      pageSize,

      totalPages,

      hasNextPage:
        page < totalPages,

      hasPreviousPage:
        page > 1,
    };
  }
}