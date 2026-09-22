import { CageStatus } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserType } from '../auth/types/current-user.type';
import { CreateCageInput } from './inputs/create-cage.input';
import { UpdateCageInput } from './inputs/update-cage.input';
export declare class CagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toCageModel;
    private getSectionForFarm;
    create(input: CreateCageInput, currentUser: CurrentUserType): Promise<Omit<{
        rabbitMovements: {
            id: string;
            createdAt: Date;
            endedAt: Date | null;
            rabbitId: string;
            cageId: string;
            startedAt: Date;
            reason: string | null;
            observation: string | null;
        }[];
    } & {
        farmId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        code: string;
        sectionId: string;
        capacity: number;
        status: CageStatus;
    }, "rabbitMovements"> & {
        rabbitCount: number;
    }>;
    findAll(currentUser: CurrentUserType): Promise<{
        rabbitCount: number;
        rabbitMovements: {
            rabbitId: string;
        }[];
        farmId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        code: string;
        sectionId: string;
        capacity: number;
        status: CageStatus;
    }[]>;
    findOne(id: string, currentUser: CurrentUserType): Promise<{
        rabbitCount: number;
        rabbitMovements: {
            rabbitId: string;
        }[];
        farmId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        code: string;
        sectionId: string;
        capacity: number;
        status: CageStatus;
    }>;
    update(input: UpdateCageInput, currentUser: CurrentUserType): Promise<Omit<{
        rabbitMovements: {
            id: string;
            createdAt: Date;
            endedAt: Date | null;
            rabbitId: string;
            cageId: string;
            startedAt: Date;
            reason: string | null;
            observation: string | null;
        }[];
    } & {
        farmId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        code: string;
        sectionId: string;
        capacity: number;
        status: CageStatus;
    }, "rabbitMovements"> & {
        rabbitCount: number;
    }>;
    remove(id: string, currentUser: CurrentUserType): Promise<{
        rabbitCount: number;
        farmId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string | null;
        code: string;
        sectionId: string;
        capacity: number;
        status: CageStatus;
    }>;
}
