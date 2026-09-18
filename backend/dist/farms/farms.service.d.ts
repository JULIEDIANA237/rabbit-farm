import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmInput } from './dto/create-farm.input';
import { CurrentUserType } from '../auth/types/current-user.type';
export declare class FarmsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: CreateFarmInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        location: string | null;
    }>;
    findAll(user: CurrentUserType): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        location: string | null;
    }[]>;
    findOne(id: string, user: CurrentUserType): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        location: string | null;
    } | null>;
}
