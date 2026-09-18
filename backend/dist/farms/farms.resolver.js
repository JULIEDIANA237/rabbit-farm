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
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const farm_model_1 = require("./models/farm.model");
const create_farm_input_1 = require("./dto/create-farm.input");
const farms_service_1 = require("./farms.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let FarmsResolver = class FarmsResolver {
    farmsService;
    constructor(farmsService) {
        this.farmsService = farmsService;
    }
    async createFarm(input) {
        return this.farmsService.create(input);
    }
    async farms(user) {
        return this.farmsService.findAll(user);
    }
    async farm(id, user) {
        return this.farmsService.findOne(id, user);
    }
};
exports.FarmsResolver = FarmsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => farm_model_1.FarmModel),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.FarmRole.ADMIN),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_farm_input_1.CreateFarmInput]),
    __metadata("design:returntype", Promise)
], FarmsResolver.prototype, "createFarm", null);
__decorate([
    (0, graphql_1.Query)(() => [farm_model_1.FarmModel]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FarmsResolver.prototype, "farms", null);
__decorate([
    (0, graphql_1.Query)(() => farm_model_1.FarmModel, {
        nullable: true,
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', {
        type: () => graphql_1.ID,
    })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FarmsResolver.prototype, "farm", null);
exports.FarmsResolver = FarmsResolver = __decorate([
    (0, graphql_1.Resolver)(() => farm_model_1.FarmModel),
    __metadata("design:paramtypes", [farms_service_1.FarmsService])
], FarmsResolver);
//# sourceMappingURL=farms.resolver.js.map