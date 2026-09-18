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
exports.SectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SectionsService = class SectionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toSectionModel(section) {
        const { _count, ...sectionData } = section;
        return {
            ...sectionData,
            cageCount: _count.cages,
        };
    }
    async create(input, currentUser) {
        const name = input.name.trim();
        if (!name) {
            throw new common_1.ConflictException('Le nom de la section est obligatoire.');
        }
        const existing = await this.prisma.section.findUnique({
            where: {
                farmId_name: {
                    farmId: currentUser.farmId,
                    name,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Une section portant ce nom existe déjà dans cette ferme.');
        }
        const section = await this.prisma.section.create({
            data: {
                farmId: currentUser.farmId,
                name,
                type: input.type,
                description: input.description,
            },
            include: {
                _count: {
                    select: {
                        cages: true,
                    },
                },
            },
        });
        return this.toSectionModel(section);
    }
    async findAll(currentUser) {
        const sections = await this.prisma.section.findMany({
            where: {
                farmId: currentUser.farmId,
            },
            include: {
                _count: {
                    select: {
                        cages: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return sections.map((section) => this.toSectionModel(section));
    }
    async findOne(id, currentUser) {
        const section = await this.prisma.section.findFirst({
            where: {
                id,
                farmId: currentUser.farmId,
            },
            include: {
                _count: {
                    select: {
                        cages: true,
                    },
                },
            },
        });
        if (!section) {
            throw new common_1.NotFoundException('Section introuvable.');
        }
        return this.toSectionModel(section);
    }
    async update(input, currentUser) {
        const section = await this.prisma.section.findFirst({
            where: {
                id: input.id,
                farmId: currentUser.farmId,
            },
        });
        if (!section) {
            throw new common_1.NotFoundException('Section introuvable.');
        }
        if (input.name !== undefined) {
            const name = input.name.trim();
            if (!name) {
                throw new common_1.ConflictException('Le nom de la section est obligatoire.');
            }
            const existing = await this.prisma.section.findFirst({
                where: {
                    farmId: currentUser.farmId,
                    name,
                    NOT: {
                        id: input.id,
                    },
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Une autre section porte déjà ce nom.');
            }
        }
        const updatedSection = await this.prisma.section.update({
            where: {
                id: section.id,
            },
            data: {
                name: input.name !== undefined
                    ? input.name.trim()
                    : undefined,
                type: input.type,
                description: input.description,
            },
            include: {
                _count: {
                    select: {
                        cages: true,
                    },
                },
            },
        });
        return this.toSectionModel(updatedSection);
    }
    async remove(id, currentUser) {
        const section = await this.prisma.section.findFirst({
            where: {
                id,
                farmId: currentUser.farmId,
            },
            include: {
                _count: {
                    select: {
                        cages: true,
                    },
                },
            },
        });
        if (!section) {
            throw new common_1.NotFoundException('Section introuvable.');
        }
        if (section._count.cages > 0) {
            throw new common_1.ConflictException('Impossible de supprimer une section contenant encore des cages.');
        }
        const deletedSection = await this.prisma.section.delete({
            where: {
                id: section.id,
            },
            include: {
                _count: {
                    select: {
                        cages: true,
                    },
                },
            },
        });
        return this.toSectionModel(deletedSection);
    }
};
exports.SectionsService = SectionsService;
exports.SectionsService = SectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SectionsService);
//# sourceMappingURL=sections.service.js.map