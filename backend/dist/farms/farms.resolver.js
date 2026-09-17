"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const farms_service_1 = require("./farms.service");
const farm_model_1 = require("./models/farm.model");
const create_farm_input_1 = require("./dto/create-farm.input");
let FarmsResolver = class FarmsResolver {
    farmsService;
    constructor(farmsService) {
        this.farmsService = farmsService;
    }
    async createFarm(input) {
        return this.farmsService.create(input);
    }
    async farms() {
        return this.farmsService.findAll();
    }
    async farm(id) {
        return this.farmsService.findOne(id);
    }
};
exports.FarmsResolver = FarmsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => farm_model_1.FarmModel),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_farm_input_1.CreateFarmInput]),
    __metadata("design:returntype", Promise)
], FarmsResolver.prototype, "createFarm", null);
__decorate([
    (0, graphql_1.Query)(() => [farm_model_1.FarmModel]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FarmsResolver.prototype, "farms", null);
__decorate([
    (0, graphql_1.Query)(() => farm_model_1.FarmModel, { nullable: true }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FarmsResolver.prototype, "farm", null);
exports.FarmsResolver = FarmsResolver = __decorate([
    (0, graphql_1.Resolver)(() => farm_model_1.FarmModel),
    __metadata("design:paramtypes", [farms_service_1.FarmsService])
], FarmsResolver);
//# sourceMappingURL=farms.resolver.js.map