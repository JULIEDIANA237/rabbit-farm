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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findFarmMembers(currentUser) {
        return this.prisma.farmMembership.findMany({
            where: {
                farmId: currentUser.farmId,
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async addMember(input, currentUser) {
        const email = input.email
            .trim()
            .toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Aucun utilisateur ne possède cette adresse e-mail. ' +
                'L’utilisateur doit d’abord créer son compte.');
        }
        if (!user.isActive) {
            throw new common_1.ConflictException('Cet utilisateur est désactivé.');
        }
        const existingMembership = await this.prisma.farmMembership.findUnique({
            where: {
                userId_farmId: {
                    userId: user.id,
                    farmId: currentUser.farmId,
                },
            },
        });
        if (existingMembership) {
            throw new common_1.ConflictException('Cet utilisateur est déjà membre de cette ferme.');
        }
        return this.prisma.farmMembership.create({
            data: {
                userId: user.id,
                farmId: currentUser.farmId,
                role: input.role,
            },
            include: {
                user: true,
            },
        });
    }
    async updateMemberRole(input, currentUser) {
        const membership = await this.prisma.farmMembership.findFirst({
            where: {
                id: input.membershipId,
                farmId: currentUser.farmId,
            },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membre introuvable dans cette ferme.');
        }
        if (membership.role === client_1.FarmRole.ADMIN &&
            input.role !== client_1.FarmRole.ADMIN) {
            const adminCount = await this.prisma.farmMembership.count({
                where: {
                    farmId: currentUser.farmId,
                    role: client_1.FarmRole.ADMIN,
                },
            });
            if (adminCount <= 1) {
                throw new common_1.ForbiddenException('Impossible de retirer le rôle ADMIN au dernier administrateur de la ferme.');
            }
        }
        return this.prisma.farmMembership.update({
            where: {
                id: membership.id,
            },
            data: {
                role: input.role,
            },
            include: {
                user: true,
            },
        });
    }
    async removeMember(membershipId, currentUser) {
        const membership = await this.prisma.farmMembership.findFirst({
            where: {
                id: membershipId,
                farmId: currentUser.farmId,
            },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membre introuvable dans cette ferme.');
        }
        if (membership.role === client_1.FarmRole.ADMIN) {
            const adminCount = await this.prisma.farmMembership.count({
                where: {
                    farmId: currentUser.farmId,
                    role: client_1.FarmRole.ADMIN,
                },
            });
            if (adminCount <= 1) {
                throw new common_1.ForbiddenException('Impossible de supprimer le dernier administrateur de la ferme.');
            }
        }
        return this.prisma.farmMembership.delete({
            where: {
                id: membership.id,
            },
            include: {
                user: true,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map