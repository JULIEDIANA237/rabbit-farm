import { PrismaService } from '../prisma/prisma.service';
import { CreateFarmInput } from './dto/create-farm.input';
export declare class FarmsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: CreateFarmInput): Promise<{
        name: string;
        description: string | null;
        location: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        name: string;
        description: string | null;
        location: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        description: string | null;
        location: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
