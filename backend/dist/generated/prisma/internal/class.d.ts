import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace.js";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.PrismaClientConstructorArgs<Options>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = Prisma.PrismaClientOptions['omit'], in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    $connect(): runtime.Types.Utils.JsPromise<void>;
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get farm(): Prisma.FarmDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get farmMembership(): Prisma.FarmMembershipDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get section(): Prisma.SectionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get cage(): Prisma.CageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get breed(): Prisma.BreedDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get crossBreed(): Prisma.CrossBreedDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rabbit(): Prisma.RabbitDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rabbitIdentification(): Prisma.RabbitIdentificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rabbitCageMovement(): Prisma.RabbitCageMovementDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get breeding(): Prisma.BreedingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get pregnancy(): Prisma.PregnancyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get birth(): Prisma.BirthDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get litter(): Prisma.LitterDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get litterAdoption(): Prisma.LitterAdoptionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get weaning(): Prisma.WeaningDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get fatteningLot(): Prisma.FatteningLotDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get lotMembership(): Prisma.LotMembershipDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get weighing(): Prisma.WeighingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get healthRecord(): Prisma.HealthRecordDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get customer(): Prisma.CustomerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get sale(): Prisma.SaleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get saleItem(): Prisma.SaleItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get payment(): Prisma.PaymentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get expense(): Prisma.ExpenseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get inventoryItem(): Prisma.InventoryItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stockMovement(): Prisma.StockMovementDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get task(): Prisma.TaskDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
