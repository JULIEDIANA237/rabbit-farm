import { FarmsService } from './farms.service';
import { FarmModel } from './models/farm.model';
import { CreateFarmInput } from './dto/create-farm.input';
import type { CurrentUserType } from '../auth/types/current-user.type';
export declare class FarmsResolver {
    private readonly farmsService;
    constructor(farmsService: FarmsService);
    createFarm(input: CreateFarmInput): Promise<FarmModel>;
    farms(user: CurrentUserType): Promise<FarmModel[]>;
    farm(id: string, user: CurrentUserType): Promise<FarmModel | null>;
}
