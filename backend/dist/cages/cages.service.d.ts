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
            rabbitId: string;
            cageId: string;
            startedAt: Date;
            endedAt: Date | null;
            reason: string | null;
            observation: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        type: string | null;
        sectionId: string;
        code: string;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        type: string | null;
        sectionId: string;
        code: string;
        capacity: number;
        status: CageStatus;
    }[]>;
    findOne(id: string, currentUser: CurrentUserType): Promise<{
        rabbitCount: number;
        rabbitMovements: {
            rabbitId: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        type: string | null;
        sectionId: string;
        code: string;
        capacity: number;
        status: CageStatus;
    }>;
    update(input: UpdateCageInput, currentUser: CurrentUserType): Promise<Omit<{
        rabbitMovements: {
            id: string;
            createdAt: Date;
            rabbitId: string;
            cageId: string;
            startedAt: Date;
            endedAt: Date | null;
            reason: string | null;
            observation: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        type: string | null;
        sectionId: string;
        code: string;
        capacity: number;
        status: CageStatus;
    }, "rabbitMovements"> & {
        rabbitCount: number;
    }>;
    remove(id: string, currentUser: CurrentUserType): Promise<{
        rabbitCount: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        farmId: string;
        type: string | null;
        sectionId: string;
        code: string;
        capacity: number;
        status: CageStatus;
    }>;
}
