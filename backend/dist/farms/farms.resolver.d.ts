import { FarmsService } from './farms.service';
import { FarmModel } from './models/farm.model';
import { CreateFarmInput } from './dto/create-farm.input';
export declare class FarmsResolver {
    private readonly farmsService;
    constructor(farmsService: FarmsService);
    createFarm(input: CreateFarmInput): Promise<FarmModel>;
    farms(): Promise<FarmModel[]>;
    farm(id: string): Promise<FarmModel | null>;
}
