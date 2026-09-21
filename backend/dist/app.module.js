"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const apollo_1 = require("@nestjs/apollo");
const graphql_1 = require("@nestjs/graphql");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const farms_module_1 = require("./farms/farms.module");
const users_module_1 = require("./users/users.module");
const sections_module_1 = require("./sections/sections.module");
const cages_module_1 = require("./cages/cages.module");
const rabbits_module_1 = require("./rabbits/rabbits.module");
const genetics_module_1 = require("./genetics/genetics.module");
const breeding_module_1 = require("./breeding/breeding.module");
const pregnancy_module_1 = require("./pregnancy/pregnancy.module");
const births_module_1 = require("./births/births.module");
const litters_module_1 = require("./litters/litters.module");
const adoptions_module_1 = require("./adoptions/adoptions.module");
const weaning_module_1 = require("./weaning/weaning.module");
const fattening_module_1 = require("./fattening/fattening.module");
const health_module_1 = require("./health/health.module");
const sales_module_1 = require("./sales/sales.module");
const operations_module_1 = require("./operations/operations.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: true,
                context: ({ req }) => ({
                    req,
                }),
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            farms_module_1.FarmsModule,
            users_module_1.UsersModule,
            sections_module_1.SectionsModule,
            cages_module_1.CagesModule,
            rabbits_module_1.RabbitsModule,
            genetics_module_1.GeneticsModule,
            breeding_module_1.BreedingModule,
            pregnancy_module_1.PregnancyModule,
            births_module_1.BirthsModule,
            litters_module_1.LittersModule,
            adoptions_module_1.AdoptionsModule,
            weaning_module_1.WeaningModule,
            fattening_module_1.FatteningModule,
            health_module_1.HealthModule,
            sales_module_1.SalesModule,
            operations_module_1.OperationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map