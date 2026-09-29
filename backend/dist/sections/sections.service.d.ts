import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserType } from '../auth/types/current-user.type';
import { CreateSectionInput } from './inputs/create-section.input';
import { UpdateSectionInput } from './inputs/update-section.input';
export declare class SectionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toSectionModel;
    create(input: CreateSectionInput, currentUser: CurrentUserType): Promise<Omit<{
        _count: {
            cages: number;
        };
    } & {
        farmId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("./graphql/section-type.enum").SectionType;
    }, "_count"> & {
        cageCount: number;
    }>;
    findAll(currentUser: CurrentUserType): Promise<(Omit<{
        _count: {
            cages: number;
        };
    } & {
        farmId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("./graphql/section-type.enum").SectionType;
    }, "_count"> & {
        cageCount: number;
    })[]>;
    findOne(id: string, currentUser: CurrentUserType): Promise<Omit<{
        _count: {
            cages: number;
        };
    } & {
        farmId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("./graphql/section-type.enum").SectionType;
    }, "_count"> & {
        cageCount: number;
    }>;
    update(input: UpdateSectionInput, currentUser: CurrentUserType): Promise<Omit<{
        _count: {
            cages: number;
        };
    } & {
        farmId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("./graphql/section-type.enum").SectionType;
    }, "_count"> & {
        cageCount: number;
    }>;
    remove(id: string, currentUser: CurrentUserType): Promise<Omit<{
        _count: {
            cages: number;
        };
    } & {
        farmId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("./graphql/section-type.enum").SectionType;
    }, "_count"> & {
        cageCount: number;
    }>;
}
