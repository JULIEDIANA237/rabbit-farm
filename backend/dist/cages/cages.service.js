"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CagesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let CagesService = class CagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toCageModel(cage) {
        const { rabbitMovements, ...cageData } = cage;
        return {
            ...cageData,
            rabbitCount: rabbitMovements.length,
        };
    }
    async getSectionForFarm(sectionId, farmId) {
        const section = await this.prisma.section.findFirst({
            where: {
                id: sectionId,
                farmId,
            },
        });
        if (!section) {
            throw new common_1.NotFoundException('Section introuvable dans cette ferme.');
        }
        return section;
    }
    async create(input, currentUser) {
        const code = input.code.trim();
        if (!code) {
            throw new common_1.BadRequestException('Le nom de la cage est obligatoire.');
        }
        if (input.capacity <= 0) {
            throw new common_1.BadRequestException('La capacité de la cage doit être supérieure à zéro.');
        }
        await this.getSectionForFarm(input.sectionId, currentUser.farmId);
        const existing = await this.prisma.cage.findUnique({
            where: {
                farmId_code: {
                    farmId: currentUser.farmId,
                    code,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Une cage portant ce nom existe déjà dans cette ferme.');
        }
        const cage = await this.prisma.cage.create({
            data: {
                farmId: currentUser.farmId,
                sectionId: input.sectionId,
                code,
                capacity: input.capacity,
                status: input.status ?? client_1.CageStatus.ACTIVE,
                type: input.type,
            },
            include: {
                rabbitMovements: {
                    where: {
                        endedAt: null,
                    },
                },
            },
        });
        return this.toCageModel(cage);
    }
    async findAll(currentUser) {
        const cages = await this.prisma.cage.findMany({
            where: {
                farmId: currentUser.farmId,
            },
            include: {
                rabbitMovements: {
                    where: {
                        endedAt: null,
                    },
                    select: {
                        rabbitId: true,
                    },
                },
            },
            orderBy: {
                code: 'asc',
            },
        });
        return cages.map((cage) => ({
            ...cage,
            rabbitCount: cage.rabbitMovements.length,
        }));
    }
    async findOne(id, currentUser) {
        const cage = await this.prisma.cage.findFirst({
            where: {
                id,
                farmId: currentUser.farmId,
            },
            include: {
                rabbitMovements: {
                    where: {
                        endedAt: null,
                    },
                    select: {
                        rabbitId: true,
                    },
                },
            },
        });
        if (!cage) {
            throw new common_1.NotFoundException('Cage introuvable.');
        }
        return {
            ...cage,
            rabbitCount: cage.rabbitMovements.length,
        };
    }
    async update(input, currentUser) {
        const cage = await this.prisma.cage.findFirst({
            where: {
                id: input.id,
                farmId: currentUser.farmId,
            },
            include: {
                rabbitMovements: {
                    where: {
                        endedAt: null,
                    },
                },
            },
        });
        if (!cage) {
            throw new common_1.NotFoundException('Cage introuvable.');
        }
        if (input.code !== undefined) {
            const code = input.code.trim();
            if (!code) {
                throw new common_1.BadRequestException('Le nom de la cage est obligatoire.');
            }
            const existing = await this.prisma.cage.findFirst({
                where: {
                    farmId: currentUser.farmId,
                    code,
                    NOT: {
                        id: input.id,
                    },
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Une autre cage porte déjà ce nom.');
            }
        }
        if (input.sectionId !== undefined) {
            await this.getSectionForFarm(input.sectionId, currentUser.farmId);
        }
        if (input.capacity !== undefined &&
            input.capacity <
                cage.rabbitMovements.length) {
            throw new common_1.ConflictException(`La capacité ne peut pas être inférieure au nombre actuel de lapins (${cage.rabbitMovements.length}).`);
        }
        const updatedCage = await this.prisma.cage.update({
            where: {
                id: cage.id,
            },
            data: {
                code: input.code !== undefined
                    ? input.code.trim()
                    : undefined,
                sectionId: input.sectionId,
                capacity: input.capacity,
                status: input.status,
                type: input.type,
            },
            include: {
                rabbitMovements: {
                    where: {
                        endedAt: null,
                    },
                },
            },
        });
        return this.toCageModel(updatedCage);
    }
    async remove(id, currentUser) {
        const cage = await this.prisma.cage.findFirst({
            where: {
                id,
                farmId: currentUser.farmId,
            },
            include: {
                rabbitMovements: {
                    where: {
                        endedAt: null,
                    },
                },
            },
        });
        if (!cage) {
            throw new common_1.NotFoundException('Cage introuvable.');
        }
        if (cage.rabbitMovements.length > 0) {
            throw new common_1.ConflictException('Impossible de supprimer une cage contenant encore des lapins.');
        }
        const deletedCage = await this.prisma.cage.delete({
            where: {
                id: cage.id,
            },
        });
        return {
            ...deletedCage,
            rabbitCount: 0,
        };
    }
};
exports.CagesService = CagesService;
exports.CagesService = CagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CagesService);
//# sourceMappingURL=cages.service.js.map