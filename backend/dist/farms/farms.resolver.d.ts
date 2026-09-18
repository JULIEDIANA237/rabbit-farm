import { CreateFarmInput } from './dto/create-farm.input';
import { FarmsService } from './farms.service';
import type { CurrentUserType } from '../auth/types/current-user.type';
export declare class FarmsResolver {
    private readonly farmsService;
    constructor(farmsService: FarmsService);
    createFarm(input: CreateFarmInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        location: string | null;
    }>;
    farms(user: CurrentUserType): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        location: string | null;
    }[]>;
    farm(id: string, user: CurrentUserType): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        location: string | null;
    } | null>;
}
