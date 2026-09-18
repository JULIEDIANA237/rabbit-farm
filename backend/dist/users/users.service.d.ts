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
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            passwordHash: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        role: FarmRole;
        userId: string;
    })[]>;
    addMember(input: AddMemberInput, currentUser: CurrentUserType): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            passwordHash: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        role: FarmRole;
        userId: string;
    }>;
    updateMemberRole(input: UpdateMemberRoleInput, currentUser: CurrentUserType): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            passwordHash: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        role: FarmRole;
        userId: string;
    }>;
    removeMember(membershipId: string, currentUser: CurrentUserType): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            passwordHash: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        role: FarmRole;
        userId: string;
    }>;
}
