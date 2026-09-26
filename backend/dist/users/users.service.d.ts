import { FarmRole } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddMemberInput } from './inputs/add-member.input';
import { UpdateMemberRoleInput } from './inputs/update-member-role.input';
import { CurrentUserType } from '../auth/types/current-user.type';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findFarmMembers(currentUser: CurrentUserType): Promise<({
        user: {
            id: string;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        farmId: string;
        role: FarmRole;
    })[]>;
    addMember(input: AddMemberInput, currentUser: CurrentUserType): Promise<{
        user: {
            id: string;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        farmId: string;
        role: FarmRole;
    }>;
    updateMemberRole(input: UpdateMemberRoleInput, currentUser: CurrentUserType): Promise<{
        user: {
            id: string;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        farmId: string;
        role: FarmRole;
    }>;
    removeMember(membershipId: string, currentUser: CurrentUserType): Promise<{
        user: {
            id: string;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        farmId: string;
        role: FarmRole;
    }>;
}
