import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> = [
    PrismaClientOptions
] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? ((Without<T, U> & U) | (Without<U, T> & T)) & object : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly User: "User";
    readonly Farm: "Farm";
    readonly FarmMembership: "FarmMembership";
    readonly Section: "Section";
    readonly Cage: "Cage";
    readonly Breed: "Breed";
    readonly CrossBreed: "CrossBreed";
    readonly Rabbit: "Rabbit";
    readonly RabbitIdentification: "RabbitIdentification";
    readonly RabbitCageMovement: "RabbitCageMovement";
    readonly Breeding: "Breeding";
    readonly Pregnancy: "Pregnancy";
    readonly Birth: "Birth";
    readonly Litter: "Litter";
    readonly LitterAdoption: "LitterAdoption";
    readonly AdoptionRabbit: "AdoptionRabbit";
    readonly Weaning: "Weaning";
    readonly WeaningRabbit: "WeaningRabbit";
    readonly FatteningLot: "FatteningLot";
    readonly LotMembership: "LotMembership";
    readonly Weighing: "Weighing";
    readonly HealthRecord: "HealthRecord";
    readonly Customer: "Customer";
    readonly Sale: "Sale";
    readonly SaleItem: "SaleItem";
    readonly Payment: "Payment";
    readonly Expense: "Expense";
    readonly InventoryItem: "InventoryItem";
    readonly StockMovement: "StockMovement";
    readonly Task: "Task";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "farm" | "farmMembership" | "section" | "cage" | "breed" | "crossBreed" | "rabbit" | "rabbitIdentification" | "rabbitCageMovement" | "breeding" | "pregnancy" | "birth" | "litter" | "litterAdoption" | "adoptionRabbit" | "weaning" | "weaningRabbit" | "fatteningLot" | "lotMembership" | "weighing" | "healthRecord" | "customer" | "sale" | "saleItem" | "payment" | "expense" | "inventoryItem" | "stockMovement" | "task";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Farm: {
            payload: Prisma.$FarmPayload<ExtArgs>;
            fields: Prisma.FarmFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FarmFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FarmFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmPayload>;
                };
                findFirst: {
                    args: Prisma.FarmFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FarmFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmPayload>;
                };
                findMany: {
                    args: Prisma.FarmFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmPayload>[];
                };
                create: {
                    args: Prisma.FarmCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmPayload>;
                };
                createMany: {
                    args: Prisma.FarmCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.FarmCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmPayload>[];
                };
                delete: {
                    args: Prisma.FarmDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmPayload>;
                };
                update: {
                    args: Prisma.FarmUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmPayload>;
                };
                deleteMany: {
                    args: Prisma.FarmDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FarmUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.FarmUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmPayload>[];
                };
                upsert: {
                    args: Prisma.FarmUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmPayload>;
                };
                aggregate: {
                    args: Prisma.FarmAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFarm>;
                };
                groupBy: {
                    args: Prisma.FarmGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FarmGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FarmCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FarmCountAggregateOutputType> | number;
                };
            };
        };
        FarmMembership: {
            payload: Prisma.$FarmMembershipPayload<ExtArgs>;
            fields: Prisma.FarmMembershipFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FarmMembershipFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmMembershipPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FarmMembershipFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmMembershipPayload>;
                };
                findFirst: {
                    args: Prisma.FarmMembershipFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmMembershipPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FarmMembershipFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmMembershipPayload>;
                };
                findMany: {
                    args: Prisma.FarmMembershipFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmMembershipPayload>[];
                };
                create: {
                    args: Prisma.FarmMembershipCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmMembershipPayload>;
                };
                createMany: {
                    args: Prisma.FarmMembershipCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.FarmMembershipCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmMembershipPayload>[];
                };
                delete: {
                    args: Prisma.FarmMembershipDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmMembershipPayload>;
                };
                update: {
                    args: Prisma.FarmMembershipUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmMembershipPayload>;
                };
                deleteMany: {
                    args: Prisma.FarmMembershipDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FarmMembershipUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.FarmMembershipUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmMembershipPayload>[];
                };
                upsert: {
                    args: Prisma.FarmMembershipUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FarmMembershipPayload>;
                };
                aggregate: {
                    args: Prisma.FarmMembershipAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFarmMembership>;
                };
                groupBy: {
                    args: Prisma.FarmMembershipGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FarmMembershipGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FarmMembershipCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FarmMembershipCountAggregateOutputType> | number;
                };
            };
        };
        Section: {
            payload: Prisma.$SectionPayload<ExtArgs>;
            fields: Prisma.SectionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SectionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SectionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SectionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SectionPayload>;
                };
                findFirst: {
                    args: Prisma.SectionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SectionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SectionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SectionPayload>;
                };
                findMany: {
                    args: Prisma.SectionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SectionPayload>[];
                };
                create: {
                    args: Prisma.SectionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SectionPayload>;
                };
                createMany: {
                    args: Prisma.SectionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SectionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SectionPayload>[];
                };
                delete: {
                    args: Prisma.SectionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SectionPayload>;
                };
                update: {
                    args: Prisma.SectionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SectionPayload>;
                };
                deleteMany: {
                    args: Prisma.SectionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SectionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SectionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SectionPayload>[];
                };
                upsert: {
                    args: Prisma.SectionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SectionPayload>;
                };
                aggregate: {
                    args: Prisma.SectionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSection>;
                };
                groupBy: {
                    args: Prisma.SectionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SectionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SectionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SectionCountAggregateOutputType> | number;
                };
            };
        };
        Cage: {
            payload: Prisma.$CagePayload<ExtArgs>;
            fields: Prisma.CageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CagePayload>;
                };
                findFirst: {
                    args: Prisma.CageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CagePayload>;
                };
                findMany: {
                    args: Prisma.CageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CagePayload>[];
                };
                create: {
                    args: Prisma.CageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CagePayload>;
                };
                createMany: {
                    args: Prisma.CageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CagePayload>[];
                };
                delete: {
                    args: Prisma.CageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CagePayload>;
                };
                update: {
                    args: Prisma.CageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CagePayload>;
                };
                deleteMany: {
                    args: Prisma.CageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CagePayload>[];
                };
                upsert: {
                    args: Prisma.CageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CagePayload>;
                };
                aggregate: {
                    args: Prisma.CageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCage>;
                };
                groupBy: {
                    args: Prisma.CageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CageCountAggregateOutputType> | number;
                };
            };
        };
        Breed: {
            payload: Prisma.$BreedPayload<ExtArgs>;
            fields: Prisma.BreedFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BreedFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BreedFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedPayload>;
                };
                findFirst: {
                    args: Prisma.BreedFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BreedFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedPayload>;
                };
                findMany: {
                    args: Prisma.BreedFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedPayload>[];
                };
                create: {
                    args: Prisma.BreedCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedPayload>;
                };
                createMany: {
                    args: Prisma.BreedCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BreedCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedPayload>[];
                };
                delete: {
                    args: Prisma.BreedDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedPayload>;
                };
                update: {
                    args: Prisma.BreedUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedPayload>;
                };
                deleteMany: {
                    args: Prisma.BreedDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BreedUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BreedUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedPayload>[];
                };
                upsert: {
                    args: Prisma.BreedUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedPayload>;
                };
                aggregate: {
                    args: Prisma.BreedAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBreed>;
                };
                groupBy: {
                    args: Prisma.BreedGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BreedGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BreedCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BreedCountAggregateOutputType> | number;
                };
            };
        };
        CrossBreed: {
            payload: Prisma.$CrossBreedPayload<ExtArgs>;
            fields: Prisma.CrossBreedFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CrossBreedFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CrossBreedPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CrossBreedFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CrossBreedPayload>;
                };
                findFirst: {
                    args: Prisma.CrossBreedFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CrossBreedPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CrossBreedFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CrossBreedPayload>;
                };
                findMany: {
                    args: Prisma.CrossBreedFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CrossBreedPayload>[];
                };
                create: {
                    args: Prisma.CrossBreedCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CrossBreedPayload>;
                };
                createMany: {
                    args: Prisma.CrossBreedCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CrossBreedCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CrossBreedPayload>[];
                };
                delete: {
                    args: Prisma.CrossBreedDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CrossBreedPayload>;
                };
                update: {
                    args: Prisma.CrossBreedUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CrossBreedPayload>;
                };
                deleteMany: {
                    args: Prisma.CrossBreedDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CrossBreedUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CrossBreedUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CrossBreedPayload>[];
                };
                upsert: {
                    args: Prisma.CrossBreedUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CrossBreedPayload>;
                };
                aggregate: {
                    args: Prisma.CrossBreedAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCrossBreed>;
                };
                groupBy: {
                    args: Prisma.CrossBreedGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CrossBreedGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CrossBreedCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CrossBreedCountAggregateOutputType> | number;
                };
            };
        };
        Rabbit: {
            payload: Prisma.$RabbitPayload<ExtArgs>;
            fields: Prisma.RabbitFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RabbitFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RabbitFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitPayload>;
                };
                findFirst: {
                    args: Prisma.RabbitFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RabbitFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitPayload>;
                };
                findMany: {
                    args: Prisma.RabbitFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitPayload>[];
                };
                create: {
                    args: Prisma.RabbitCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitPayload>;
                };
                createMany: {
                    args: Prisma.RabbitCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RabbitCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitPayload>[];
                };
                delete: {
                    args: Prisma.RabbitDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitPayload>;
                };
                update: {
                    args: Prisma.RabbitUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitPayload>;
                };
                deleteMany: {
                    args: Prisma.RabbitDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RabbitUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RabbitUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitPayload>[];
                };
                upsert: {
                    args: Prisma.RabbitUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitPayload>;
                };
                aggregate: {
                    args: Prisma.RabbitAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRabbit>;
                };
                groupBy: {
                    args: Prisma.RabbitGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RabbitGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RabbitCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RabbitCountAggregateOutputType> | number;
                };
            };
        };
        RabbitIdentification: {
            payload: Prisma.$RabbitIdentificationPayload<ExtArgs>;
            fields: Prisma.RabbitIdentificationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RabbitIdentificationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitIdentificationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RabbitIdentificationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitIdentificationPayload>;
                };
                findFirst: {
                    args: Prisma.RabbitIdentificationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitIdentificationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RabbitIdentificationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitIdentificationPayload>;
                };
                findMany: {
                    args: Prisma.RabbitIdentificationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitIdentificationPayload>[];
                };
                create: {
                    args: Prisma.RabbitIdentificationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitIdentificationPayload>;
                };
                createMany: {
                    args: Prisma.RabbitIdentificationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RabbitIdentificationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitIdentificationPayload>[];
                };
                delete: {
                    args: Prisma.RabbitIdentificationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitIdentificationPayload>;
                };
                update: {
                    args: Prisma.RabbitIdentificationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitIdentificationPayload>;
                };
                deleteMany: {
                    args: Prisma.RabbitIdentificationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RabbitIdentificationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RabbitIdentificationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitIdentificationPayload>[];
                };
                upsert: {
                    args: Prisma.RabbitIdentificationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitIdentificationPayload>;
                };
                aggregate: {
                    args: Prisma.RabbitIdentificationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRabbitIdentification>;
                };
                groupBy: {
                    args: Prisma.RabbitIdentificationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RabbitIdentificationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RabbitIdentificationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RabbitIdentificationCountAggregateOutputType> | number;
                };
            };
        };
        RabbitCageMovement: {
            payload: Prisma.$RabbitCageMovementPayload<ExtArgs>;
            fields: Prisma.RabbitCageMovementFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RabbitCageMovementFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitCageMovementPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RabbitCageMovementFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitCageMovementPayload>;
                };
                findFirst: {
                    args: Prisma.RabbitCageMovementFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitCageMovementPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RabbitCageMovementFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitCageMovementPayload>;
                };
                findMany: {
                    args: Prisma.RabbitCageMovementFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitCageMovementPayload>[];
                };
                create: {
                    args: Prisma.RabbitCageMovementCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitCageMovementPayload>;
                };
                createMany: {
                    args: Prisma.RabbitCageMovementCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RabbitCageMovementCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitCageMovementPayload>[];
                };
                delete: {
                    args: Prisma.RabbitCageMovementDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitCageMovementPayload>;
                };
                update: {
                    args: Prisma.RabbitCageMovementUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitCageMovementPayload>;
                };
                deleteMany: {
                    args: Prisma.RabbitCageMovementDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RabbitCageMovementUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RabbitCageMovementUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitCageMovementPayload>[];
                };
                upsert: {
                    args: Prisma.RabbitCageMovementUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RabbitCageMovementPayload>;
                };
                aggregate: {
                    args: Prisma.RabbitCageMovementAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRabbitCageMovement>;
                };
                groupBy: {
                    args: Prisma.RabbitCageMovementGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RabbitCageMovementGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RabbitCageMovementCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RabbitCageMovementCountAggregateOutputType> | number;
                };
            };
        };
        Breeding: {
            payload: Prisma.$BreedingPayload<ExtArgs>;
            fields: Prisma.BreedingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BreedingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BreedingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedingPayload>;
                };
                findFirst: {
                    args: Prisma.BreedingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BreedingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedingPayload>;
                };
                findMany: {
                    args: Prisma.BreedingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedingPayload>[];
                };
                create: {
                    args: Prisma.BreedingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedingPayload>;
                };
                createMany: {
                    args: Prisma.BreedingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BreedingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedingPayload>[];
                };
                delete: {
                    args: Prisma.BreedingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedingPayload>;
                };
                update: {
                    args: Prisma.BreedingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedingPayload>;
                };
                deleteMany: {
                    args: Prisma.BreedingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BreedingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BreedingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedingPayload>[];
                };
                upsert: {
                    args: Prisma.BreedingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BreedingPayload>;
                };
                aggregate: {
                    args: Prisma.BreedingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBreeding>;
                };
                groupBy: {
                    args: Prisma.BreedingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BreedingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BreedingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BreedingCountAggregateOutputType> | number;
                };
            };
        };
        Pregnancy: {
            payload: Prisma.$PregnancyPayload<ExtArgs>;
            fields: Prisma.PregnancyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PregnancyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PregnancyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PregnancyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PregnancyPayload>;
                };
                findFirst: {
                    args: Prisma.PregnancyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PregnancyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PregnancyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PregnancyPayload>;
                };
                findMany: {
                    args: Prisma.PregnancyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PregnancyPayload>[];
                };
                create: {
                    args: Prisma.PregnancyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PregnancyPayload>;
                };
                createMany: {
                    args: Prisma.PregnancyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PregnancyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PregnancyPayload>[];
                };
                delete: {
                    args: Prisma.PregnancyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PregnancyPayload>;
                };
                update: {
                    args: Prisma.PregnancyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PregnancyPayload>;
                };
                deleteMany: {
                    args: Prisma.PregnancyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PregnancyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PregnancyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PregnancyPayload>[];
                };
                upsert: {
                    args: Prisma.PregnancyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PregnancyPayload>;
                };
                aggregate: {
                    args: Prisma.PregnancyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePregnancy>;
                };
                groupBy: {
                    args: Prisma.PregnancyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PregnancyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PregnancyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PregnancyCountAggregateOutputType> | number;
                };
            };
        };
        Birth: {
            payload: Prisma.$BirthPayload<ExtArgs>;
            fields: Prisma.BirthFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BirthFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BirthPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BirthFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BirthPayload>;
                };
                findFirst: {
                    args: Prisma.BirthFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BirthPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BirthFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BirthPayload>;
                };
                findMany: {
                    args: Prisma.BirthFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BirthPayload>[];
                };
                create: {
                    args: Prisma.BirthCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BirthPayload>;
                };
                createMany: {
                    args: Prisma.BirthCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BirthCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BirthPayload>[];
                };
                delete: {
                    args: Prisma.BirthDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BirthPayload>;
                };
                update: {
                    args: Prisma.BirthUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BirthPayload>;
                };
                deleteMany: {
                    args: Prisma.BirthDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BirthUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BirthUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BirthPayload>[];
                };
                upsert: {
                    args: Prisma.BirthUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BirthPayload>;
                };
                aggregate: {
                    args: Prisma.BirthAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBirth>;
                };
                groupBy: {
                    args: Prisma.BirthGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BirthGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BirthCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BirthCountAggregateOutputType> | number;
                };
            };
        };
        Litter: {
            payload: Prisma.$LitterPayload<ExtArgs>;
            fields: Prisma.LitterFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LitterFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LitterFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterPayload>;
                };
                findFirst: {
                    args: Prisma.LitterFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LitterFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterPayload>;
                };
                findMany: {
                    args: Prisma.LitterFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterPayload>[];
                };
                create: {
                    args: Prisma.LitterCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterPayload>;
                };
                createMany: {
                    args: Prisma.LitterCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LitterCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterPayload>[];
                };
                delete: {
                    args: Prisma.LitterDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterPayload>;
                };
                update: {
                    args: Prisma.LitterUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterPayload>;
                };
                deleteMany: {
                    args: Prisma.LitterDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LitterUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LitterUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterPayload>[];
                };
                upsert: {
                    args: Prisma.LitterUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterPayload>;
                };
                aggregate: {
                    args: Prisma.LitterAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLitter>;
                };
                groupBy: {
                    args: Prisma.LitterGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LitterGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LitterCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LitterCountAggregateOutputType> | number;
                };
            };
        };
        LitterAdoption: {
            payload: Prisma.$LitterAdoptionPayload<ExtArgs>;
            fields: Prisma.LitterAdoptionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LitterAdoptionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterAdoptionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LitterAdoptionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterAdoptionPayload>;
                };
                findFirst: {
                    args: Prisma.LitterAdoptionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterAdoptionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LitterAdoptionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterAdoptionPayload>;
                };
                findMany: {
                    args: Prisma.LitterAdoptionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterAdoptionPayload>[];
                };
                create: {
                    args: Prisma.LitterAdoptionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterAdoptionPayload>;
                };
                createMany: {
                    args: Prisma.LitterAdoptionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LitterAdoptionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterAdoptionPayload>[];
                };
                delete: {
                    args: Prisma.LitterAdoptionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterAdoptionPayload>;
                };
                update: {
                    args: Prisma.LitterAdoptionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterAdoptionPayload>;
                };
                deleteMany: {
                    args: Prisma.LitterAdoptionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LitterAdoptionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LitterAdoptionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterAdoptionPayload>[];
                };
                upsert: {
                    args: Prisma.LitterAdoptionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LitterAdoptionPayload>;
                };
                aggregate: {
                    args: Prisma.LitterAdoptionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLitterAdoption>;
                };
                groupBy: {
                    args: Prisma.LitterAdoptionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LitterAdoptionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LitterAdoptionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LitterAdoptionCountAggregateOutputType> | number;
                };
            };
        };
        AdoptionRabbit: {
            payload: Prisma.$AdoptionRabbitPayload<ExtArgs>;
            fields: Prisma.AdoptionRabbitFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AdoptionRabbitFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdoptionRabbitPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AdoptionRabbitFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdoptionRabbitPayload>;
                };
                findFirst: {
                    args: Prisma.AdoptionRabbitFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdoptionRabbitPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AdoptionRabbitFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdoptionRabbitPayload>;
                };
                findMany: {
                    args: Prisma.AdoptionRabbitFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdoptionRabbitPayload>[];
                };
                create: {
                    args: Prisma.AdoptionRabbitCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdoptionRabbitPayload>;
                };
                createMany: {
                    args: Prisma.AdoptionRabbitCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AdoptionRabbitCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdoptionRabbitPayload>[];
                };
                delete: {
                    args: Prisma.AdoptionRabbitDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdoptionRabbitPayload>;
                };
                update: {
                    args: Prisma.AdoptionRabbitUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdoptionRabbitPayload>;
                };
                deleteMany: {
                    args: Prisma.AdoptionRabbitDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AdoptionRabbitUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AdoptionRabbitUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdoptionRabbitPayload>[];
                };
                upsert: {
                    args: Prisma.AdoptionRabbitUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AdoptionRabbitPayload>;
                };
                aggregate: {
                    args: Prisma.AdoptionRabbitAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAdoptionRabbit>;
                };
                groupBy: {
                    args: Prisma.AdoptionRabbitGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AdoptionRabbitGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AdoptionRabbitCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AdoptionRabbitCountAggregateOutputType> | number;
                };
            };
        };
        Weaning: {
            payload: Prisma.$WeaningPayload<ExtArgs>;
            fields: Prisma.WeaningFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WeaningFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WeaningFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningPayload>;
                };
                findFirst: {
                    args: Prisma.WeaningFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WeaningFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningPayload>;
                };
                findMany: {
                    args: Prisma.WeaningFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningPayload>[];
                };
                create: {
                    args: Prisma.WeaningCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningPayload>;
                };
                createMany: {
                    args: Prisma.WeaningCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WeaningCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningPayload>[];
                };
                delete: {
                    args: Prisma.WeaningDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningPayload>;
                };
                update: {
                    args: Prisma.WeaningUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningPayload>;
                };
                deleteMany: {
                    args: Prisma.WeaningDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WeaningUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WeaningUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningPayload>[];
                };
                upsert: {
                    args: Prisma.WeaningUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningPayload>;
                };
                aggregate: {
                    args: Prisma.WeaningAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWeaning>;
                };
                groupBy: {
                    args: Prisma.WeaningGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WeaningGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WeaningCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WeaningCountAggregateOutputType> | number;
                };
            };
        };
        WeaningRabbit: {
            payload: Prisma.$WeaningRabbitPayload<ExtArgs>;
            fields: Prisma.WeaningRabbitFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WeaningRabbitFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningRabbitPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WeaningRabbitFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningRabbitPayload>;
                };
                findFirst: {
                    args: Prisma.WeaningRabbitFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningRabbitPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WeaningRabbitFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningRabbitPayload>;
                };
                findMany: {
                    args: Prisma.WeaningRabbitFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningRabbitPayload>[];
                };
                create: {
                    args: Prisma.WeaningRabbitCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningRabbitPayload>;
                };
                createMany: {
                    args: Prisma.WeaningRabbitCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WeaningRabbitCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningRabbitPayload>[];
                };
                delete: {
                    args: Prisma.WeaningRabbitDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningRabbitPayload>;
                };
                update: {
                    args: Prisma.WeaningRabbitUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningRabbitPayload>;
                };
                deleteMany: {
                    args: Prisma.WeaningRabbitDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WeaningRabbitUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WeaningRabbitUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningRabbitPayload>[];
                };
                upsert: {
                    args: Prisma.WeaningRabbitUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeaningRabbitPayload>;
                };
                aggregate: {
                    args: Prisma.WeaningRabbitAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWeaningRabbit>;
                };
                groupBy: {
                    args: Prisma.WeaningRabbitGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WeaningRabbitGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WeaningRabbitCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WeaningRabbitCountAggregateOutputType> | number;
                };
            };
        };
        FatteningLot: {
            payload: Prisma.$FatteningLotPayload<ExtArgs>;
            fields: Prisma.FatteningLotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FatteningLotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FatteningLotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FatteningLotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FatteningLotPayload>;
                };
                findFirst: {
                    args: Prisma.FatteningLotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FatteningLotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FatteningLotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FatteningLotPayload>;
                };
                findMany: {
                    args: Prisma.FatteningLotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FatteningLotPayload>[];
                };
                create: {
                    args: Prisma.FatteningLotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FatteningLotPayload>;
                };
                createMany: {
                    args: Prisma.FatteningLotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.FatteningLotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FatteningLotPayload>[];
                };
                delete: {
                    args: Prisma.FatteningLotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FatteningLotPayload>;
                };
                update: {
                    args: Prisma.FatteningLotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FatteningLotPayload>;
                };
                deleteMany: {
                    args: Prisma.FatteningLotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FatteningLotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.FatteningLotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FatteningLotPayload>[];
                };
                upsert: {
                    args: Prisma.FatteningLotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FatteningLotPayload>;
                };
                aggregate: {
                    args: Prisma.FatteningLotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFatteningLot>;
                };
                groupBy: {
                    args: Prisma.FatteningLotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FatteningLotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FatteningLotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FatteningLotCountAggregateOutputType> | number;
                };
            };
        };
        LotMembership: {
            payload: Prisma.$LotMembershipPayload<ExtArgs>;
            fields: Prisma.LotMembershipFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LotMembershipFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LotMembershipPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LotMembershipFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LotMembershipPayload>;
                };
                findFirst: {
                    args: Prisma.LotMembershipFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LotMembershipPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LotMembershipFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LotMembershipPayload>;
                };
                findMany: {
                    args: Prisma.LotMembershipFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LotMembershipPayload>[];
                };
                create: {
                    args: Prisma.LotMembershipCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LotMembershipPayload>;
                };
                createMany: {
                    args: Prisma.LotMembershipCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LotMembershipCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LotMembershipPayload>[];
                };
                delete: {
                    args: Prisma.LotMembershipDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LotMembershipPayload>;
                };
                update: {
                    args: Prisma.LotMembershipUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LotMembershipPayload>;
                };
                deleteMany: {
                    args: Prisma.LotMembershipDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LotMembershipUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LotMembershipUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LotMembershipPayload>[];
                };
                upsert: {
                    args: Prisma.LotMembershipUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LotMembershipPayload>;
                };
                aggregate: {
                    args: Prisma.LotMembershipAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLotMembership>;
                };
                groupBy: {
                    args: Prisma.LotMembershipGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LotMembershipGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LotMembershipCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LotMembershipCountAggregateOutputType> | number;
                };
            };
        };
        Weighing: {
            payload: Prisma.$WeighingPayload<ExtArgs>;
            fields: Prisma.WeighingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WeighingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeighingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WeighingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeighingPayload>;
                };
                findFirst: {
                    args: Prisma.WeighingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeighingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WeighingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeighingPayload>;
                };
                findMany: {
                    args: Prisma.WeighingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeighingPayload>[];
                };
                create: {
                    args: Prisma.WeighingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeighingPayload>;
                };
                createMany: {
                    args: Prisma.WeighingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WeighingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeighingPayload>[];
                };
                delete: {
                    args: Prisma.WeighingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeighingPayload>;
                };
                update: {
                    args: Prisma.WeighingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeighingPayload>;
                };
                deleteMany: {
                    args: Prisma.WeighingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WeighingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WeighingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeighingPayload>[];
                };
                upsert: {
                    args: Prisma.WeighingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WeighingPayload>;
                };
                aggregate: {
                    args: Prisma.WeighingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWeighing>;
                };
                groupBy: {
                    args: Prisma.WeighingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WeighingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WeighingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WeighingCountAggregateOutputType> | number;
                };
            };
        };
        HealthRecord: {
            payload: Prisma.$HealthRecordPayload<ExtArgs>;
            fields: Prisma.HealthRecordFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.HealthRecordFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthRecordPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.HealthRecordFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthRecordPayload>;
                };
                findFirst: {
                    args: Prisma.HealthRecordFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthRecordPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.HealthRecordFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthRecordPayload>;
                };
                findMany: {
                    args: Prisma.HealthRecordFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthRecordPayload>[];
                };
                create: {
                    args: Prisma.HealthRecordCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthRecordPayload>;
                };
                createMany: {
                    args: Prisma.HealthRecordCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.HealthRecordCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthRecordPayload>[];
                };
                delete: {
                    args: Prisma.HealthRecordDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthRecordPayload>;
                };
                update: {
                    args: Prisma.HealthRecordUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthRecordPayload>;
                };
                deleteMany: {
                    args: Prisma.HealthRecordDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.HealthRecordUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.HealthRecordUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthRecordPayload>[];
                };
                upsert: {
                    args: Prisma.HealthRecordUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthRecordPayload>;
                };
                aggregate: {
                    args: Prisma.HealthRecordAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateHealthRecord>;
                };
                groupBy: {
                    args: Prisma.HealthRecordGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HealthRecordGroupByOutputType>[];
                };
                count: {
                    args: Prisma.HealthRecordCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HealthRecordCountAggregateOutputType> | number;
                };
            };
        };
        Customer: {
            payload: Prisma.$CustomerPayload<ExtArgs>;
            fields: Prisma.CustomerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findFirst: {
                    args: Prisma.CustomerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                findMany: {
                    args: Prisma.CustomerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                create: {
                    args: Prisma.CustomerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                createMany: {
                    args: Prisma.CustomerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                delete: {
                    args: Prisma.CustomerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                update: {
                    args: Prisma.CustomerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CustomerUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>[];
                };
                upsert: {
                    args: Prisma.CustomerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerPayload>;
                };
                aggregate: {
                    args: Prisma.CustomerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomer>;
                };
                groupBy: {
                    args: Prisma.CustomerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerCountAggregateOutputType> | number;
                };
            };
        };
        Sale: {
            payload: Prisma.$SalePayload<ExtArgs>;
            fields: Prisma.SaleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SaleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SaleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                findFirst: {
                    args: Prisma.SaleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SaleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                findMany: {
                    args: Prisma.SaleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>[];
                };
                create: {
                    args: Prisma.SaleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                createMany: {
                    args: Prisma.SaleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SaleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>[];
                };
                delete: {
                    args: Prisma.SaleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                update: {
                    args: Prisma.SaleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                deleteMany: {
                    args: Prisma.SaleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SaleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SaleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>[];
                };
                upsert: {
                    args: Prisma.SaleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                aggregate: {
                    args: Prisma.SaleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSale>;
                };
                groupBy: {
                    args: Prisma.SaleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SaleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SaleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SaleCountAggregateOutputType> | number;
                };
            };
        };
        SaleItem: {
            payload: Prisma.$SaleItemPayload<ExtArgs>;
            fields: Prisma.SaleItemFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SaleItemFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleItemPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SaleItemFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleItemPayload>;
                };
                findFirst: {
                    args: Prisma.SaleItemFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleItemPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SaleItemFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleItemPayload>;
                };
                findMany: {
                    args: Prisma.SaleItemFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleItemPayload>[];
                };
                create: {
                    args: Prisma.SaleItemCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleItemPayload>;
                };
                createMany: {
                    args: Prisma.SaleItemCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SaleItemCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleItemPayload>[];
                };
                delete: {
                    args: Prisma.SaleItemDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleItemPayload>;
                };
                update: {
                    args: Prisma.SaleItemUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleItemPayload>;
                };
                deleteMany: {
                    args: Prisma.SaleItemDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SaleItemUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SaleItemUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleItemPayload>[];
                };
                upsert: {
                    args: Prisma.SaleItemUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleItemPayload>;
                };
                aggregate: {
                    args: Prisma.SaleItemAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSaleItem>;
                };
                groupBy: {
                    args: Prisma.SaleItemGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SaleItemGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SaleItemCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SaleItemCountAggregateOutputType> | number;
                };
            };
        };
        Payment: {
            payload: Prisma.$PaymentPayload<ExtArgs>;
            fields: Prisma.PaymentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PaymentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                findFirst: {
                    args: Prisma.PaymentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                findMany: {
                    args: Prisma.PaymentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                create: {
                    args: Prisma.PaymentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                createMany: {
                    args: Prisma.PaymentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                delete: {
                    args: Prisma.PaymentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                update: {
                    args: Prisma.PaymentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                deleteMany: {
                    args: Prisma.PaymentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PaymentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>[];
                };
                upsert: {
                    args: Prisma.PaymentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PaymentPayload>;
                };
                aggregate: {
                    args: Prisma.PaymentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePayment>;
                };
                groupBy: {
                    args: Prisma.PaymentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PaymentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PaymentCountAggregateOutputType> | number;
                };
            };
        };
        Expense: {
            payload: Prisma.$ExpensePayload<ExtArgs>;
            fields: Prisma.ExpenseFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ExpenseFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ExpenseFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                findFirst: {
                    args: Prisma.ExpenseFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ExpenseFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                findMany: {
                    args: Prisma.ExpenseFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>[];
                };
                create: {
                    args: Prisma.ExpenseCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                createMany: {
                    args: Prisma.ExpenseCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ExpenseCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>[];
                };
                delete: {
                    args: Prisma.ExpenseDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                update: {
                    args: Prisma.ExpenseUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                deleteMany: {
                    args: Prisma.ExpenseDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ExpenseUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ExpenseUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>[];
                };
                upsert: {
                    args: Prisma.ExpenseUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                aggregate: {
                    args: Prisma.ExpenseAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateExpense>;
                };
                groupBy: {
                    args: Prisma.ExpenseGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ExpenseGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ExpenseCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ExpenseCountAggregateOutputType> | number;
                };
            };
        };
        InventoryItem: {
            payload: Prisma.$InventoryItemPayload<ExtArgs>;
            fields: Prisma.InventoryItemFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InventoryItemFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InventoryItemFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                findFirst: {
                    args: Prisma.InventoryItemFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InventoryItemFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                findMany: {
                    args: Prisma.InventoryItemFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>[];
                };
                create: {
                    args: Prisma.InventoryItemCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                createMany: {
                    args: Prisma.InventoryItemCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InventoryItemCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>[];
                };
                delete: {
                    args: Prisma.InventoryItemDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                update: {
                    args: Prisma.InventoryItemUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                deleteMany: {
                    args: Prisma.InventoryItemDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InventoryItemUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InventoryItemUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>[];
                };
                upsert: {
                    args: Prisma.InventoryItemUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InventoryItemPayload>;
                };
                aggregate: {
                    args: Prisma.InventoryItemAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInventoryItem>;
                };
                groupBy: {
                    args: Prisma.InventoryItemGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InventoryItemGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InventoryItemCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InventoryItemCountAggregateOutputType> | number;
                };
            };
        };
        StockMovement: {
            payload: Prisma.$StockMovementPayload<ExtArgs>;
            fields: Prisma.StockMovementFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StockMovementFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StockMovementFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                findFirst: {
                    args: Prisma.StockMovementFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StockMovementFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                findMany: {
                    args: Prisma.StockMovementFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>[];
                };
                create: {
                    args: Prisma.StockMovementCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                createMany: {
                    args: Prisma.StockMovementCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StockMovementCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>[];
                };
                delete: {
                    args: Prisma.StockMovementDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                update: {
                    args: Prisma.StockMovementUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                deleteMany: {
                    args: Prisma.StockMovementDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StockMovementUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StockMovementUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>[];
                };
                upsert: {
                    args: Prisma.StockMovementUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                aggregate: {
                    args: Prisma.StockMovementAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStockMovement>;
                };
                groupBy: {
                    args: Prisma.StockMovementGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockMovementGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StockMovementCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockMovementCountAggregateOutputType> | number;
                };
            };
        };
        Task: {
            payload: Prisma.$TaskPayload<ExtArgs>;
            fields: Prisma.TaskFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TaskFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                findFirst: {
                    args: Prisma.TaskFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                findMany: {
                    args: Prisma.TaskFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>[];
                };
                create: {
                    args: Prisma.TaskCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                createMany: {
                    args: Prisma.TaskCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>[];
                };
                delete: {
                    args: Prisma.TaskDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                update: {
                    args: Prisma.TaskUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                deleteMany: {
                    args: Prisma.TaskDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TaskUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TaskUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>[];
                };
                upsert: {
                    args: Prisma.TaskUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TaskPayload>;
                };
                aggregate: {
                    args: Prisma.TaskAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTask>;
                };
                groupBy: {
                    args: Prisma.TaskGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TaskCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaskCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const FarmScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly location: "location";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type FarmScalarFieldEnum = (typeof FarmScalarFieldEnum)[keyof typeof FarmScalarFieldEnum];
export declare const FarmMembershipScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly farmId: "farmId";
    readonly role: "role";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type FarmMembershipScalarFieldEnum = (typeof FarmMembershipScalarFieldEnum)[keyof typeof FarmMembershipScalarFieldEnum];
export declare const SectionScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly name: "name";
    readonly type: "type";
    readonly description: "description";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SectionScalarFieldEnum = (typeof SectionScalarFieldEnum)[keyof typeof SectionScalarFieldEnum];
export declare const CageScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly sectionId: "sectionId";
    readonly code: "code";
    readonly type: "type";
    readonly capacity: "capacity";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CageScalarFieldEnum = (typeof CageScalarFieldEnum)[keyof typeof CageScalarFieldEnum];
export declare const BreedScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly name: "name";
    readonly description: "description";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BreedScalarFieldEnum = (typeof BreedScalarFieldEnum)[keyof typeof BreedScalarFieldEnum];
export declare const CrossBreedScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly name: "name";
    readonly description: "description";
    readonly parentBreedAId: "parentBreedAId";
    readonly parentBreedBId: "parentBreedBId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CrossBreedScalarFieldEnum = (typeof CrossBreedScalarFieldEnum)[keyof typeof CrossBreedScalarFieldEnum];
export declare const RabbitScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly code: "code";
    readonly sex: "sex";
    readonly status: "status";
    readonly breedId: "breedId";
    readonly crossBreedId: "crossBreedId";
    readonly fatherId: "fatherId";
    readonly motherId: "motherId";
    readonly birthDate: "birthDate";
    readonly color: "color";
    readonly weight: "weight";
    readonly observations: "observations";
    readonly birthLitterId: "birthLitterId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type RabbitScalarFieldEnum = (typeof RabbitScalarFieldEnum)[keyof typeof RabbitScalarFieldEnum];
export declare const RabbitIdentificationScalarFieldEnum: {
    readonly id: "id";
    readonly rabbitId: "rabbitId";
    readonly type: "type";
    readonly value: "value";
    readonly isPrimary: "isPrimary";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type RabbitIdentificationScalarFieldEnum = (typeof RabbitIdentificationScalarFieldEnum)[keyof typeof RabbitIdentificationScalarFieldEnum];
export declare const RabbitCageMovementScalarFieldEnum: {
    readonly id: "id";
    readonly rabbitId: "rabbitId";
    readonly cageId: "cageId";
    readonly startedAt: "startedAt";
    readonly endedAt: "endedAt";
    readonly reason: "reason";
    readonly observation: "observation";
    readonly createdAt: "createdAt";
};
export type RabbitCageMovementScalarFieldEnum = (typeof RabbitCageMovementScalarFieldEnum)[keyof typeof RabbitCageMovementScalarFieldEnum];
export declare const BreedingScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly femaleId: "femaleId";
    readonly maleId: "maleId";
    readonly breedingDate: "breedingDate";
    readonly palpationStartDate: "palpationStartDate";
    readonly palpationEndDate: "palpationEndDate";
    readonly nestDate: "nestDate";
    readonly expectedBirthStartDate: "expectedBirthStartDate";
    readonly expectedBirthEndDate: "expectedBirthEndDate";
    readonly status: "status";
    readonly observation: "observation";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BreedingScalarFieldEnum = (typeof BreedingScalarFieldEnum)[keyof typeof BreedingScalarFieldEnum];
export declare const PregnancyScalarFieldEnum: {
    readonly id: "id";
    readonly breedingId: "breedingId";
    readonly checkDate: "checkDate";
    readonly result: "result";
    readonly observation: "observation";
    readonly createdAt: "createdAt";
    readonly farmId: "farmId";
};
export type PregnancyScalarFieldEnum = (typeof PregnancyScalarFieldEnum)[keyof typeof PregnancyScalarFieldEnum];
export declare const BirthScalarFieldEnum: {
    readonly id: "id";
    readonly breedingId: "breedingId";
    readonly motherId: "motherId";
    readonly birthDate: "birthDate";
    readonly liveBorn: "liveBorn";
    readonly stillBorn: "stillBorn";
    readonly observation: "observation";
    readonly createdAt: "createdAt";
    readonly farmId: "farmId";
};
export type BirthScalarFieldEnum = (typeof BirthScalarFieldEnum)[keyof typeof BirthScalarFieldEnum];
export declare const LitterScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly code: "code";
    readonly breedingId: "breedingId";
    readonly birthId: "birthId";
    readonly motherId: "motherId";
    readonly fatherId: "fatherId";
    readonly birthDate: "birthDate";
    readonly liveBorn: "liveBorn";
    readonly stillBorn: "stillBorn";
    readonly currentCount: "currentCount";
    readonly observation: "observation";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type LitterScalarFieldEnum = (typeof LitterScalarFieldEnum)[keyof typeof LitterScalarFieldEnum];
export declare const LitterAdoptionScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly sourceLitterId: "sourceLitterId";
    readonly destinationLitterId: "destinationLitterId";
    readonly adoptedAt: "adoptedAt";
    readonly quantity: "quantity";
    readonly reason: "reason";
    readonly observation: "observation";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type LitterAdoptionScalarFieldEnum = (typeof LitterAdoptionScalarFieldEnum)[keyof typeof LitterAdoptionScalarFieldEnum];
export declare const AdoptionRabbitScalarFieldEnum: {
    readonly id: "id";
    readonly adoptionId: "adoptionId";
    readonly rabbitId: "rabbitId";
    readonly createdAt: "createdAt";
};
export type AdoptionRabbitScalarFieldEnum = (typeof AdoptionRabbitScalarFieldEnum)[keyof typeof AdoptionRabbitScalarFieldEnum];
export declare const WeaningScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly litterId: "litterId";
    readonly plannedDate: "plannedDate";
    readonly actualDate: "actualDate";
    readonly quantity: "quantity";
    readonly totalWeight: "totalWeight";
    readonly averageWeight: "averageWeight";
    readonly observation: "observation";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type WeaningScalarFieldEnum = (typeof WeaningScalarFieldEnum)[keyof typeof WeaningScalarFieldEnum];
export declare const WeaningRabbitScalarFieldEnum: {
    readonly id: "id";
    readonly weaningId: "weaningId";
    readonly rabbitId: "rabbitId";
    readonly weight: "weight";
    readonly createdAt: "createdAt";
};
export type WeaningRabbitScalarFieldEnum = (typeof WeaningRabbitScalarFieldEnum)[keyof typeof WeaningRabbitScalarFieldEnum];
export declare const FatteningLotScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly code: "code";
    readonly entryDate: "entryDate";
    readonly exitDate: "exitDate";
    readonly status: "status";
    readonly observation: "observation";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type FatteningLotScalarFieldEnum = (typeof FatteningLotScalarFieldEnum)[keyof typeof FatteningLotScalarFieldEnum];
export declare const LotMembershipScalarFieldEnum: {
    readonly id: "id";
    readonly lotId: "lotId";
    readonly rabbitId: "rabbitId";
    readonly joinedAt: "joinedAt";
    readonly leftAt: "leftAt";
    readonly reason: "reason";
    readonly createdAt: "createdAt";
};
export type LotMembershipScalarFieldEnum = (typeof LotMembershipScalarFieldEnum)[keyof typeof LotMembershipScalarFieldEnum];
export declare const WeighingScalarFieldEnum: {
    readonly id: "id";
    readonly rabbitId: "rabbitId";
    readonly lotId: "lotId";
    readonly date: "date";
    readonly totalWeight: "totalWeight";
    readonly animalCount: "animalCount";
    readonly averageWeight: "averageWeight";
    readonly ageInDays: "ageInDays";
    readonly observation: "observation";
    readonly createdAt: "createdAt";
};
export type WeighingScalarFieldEnum = (typeof WeighingScalarFieldEnum)[keyof typeof WeighingScalarFieldEnum];
export declare const HealthRecordScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly rabbitId: "rabbitId";
    readonly date: "date";
    readonly symptoms: "symptoms";
    readonly observation: "observation";
    readonly suspicion: "suspicion";
    readonly diagnosis: "diagnosis";
    readonly treatment: "treatment";
    readonly medication: "medication";
    readonly dosage: "dosage";
    readonly nextDueDate: "nextDueDate";
    readonly createdById: "createdById";
    readonly createdAt: "createdAt";
};
export type HealthRecordScalarFieldEnum = (typeof HealthRecordScalarFieldEnum)[keyof typeof HealthRecordScalarFieldEnum];
export declare const CustomerScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly name: "name";
    readonly phone: "phone";
    readonly email: "email";
    readonly address: "address";
    readonly notes: "notes";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];
export declare const SaleScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly customerId: "customerId";
    readonly saleDate: "saleDate";
    readonly totalAmount: "totalAmount";
    readonly status: "status";
    readonly observation: "observation";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SaleScalarFieldEnum = (typeof SaleScalarFieldEnum)[keyof typeof SaleScalarFieldEnum];
export declare const SaleItemScalarFieldEnum: {
    readonly id: "id";
    readonly saleId: "saleId";
    readonly rabbitId: "rabbitId";
    readonly description: "description";
    readonly quantity: "quantity";
    readonly unitPrice: "unitPrice";
    readonly totalPrice: "totalPrice";
    readonly createdAt: "createdAt";
};
export type SaleItemScalarFieldEnum = (typeof SaleItemScalarFieldEnum)[keyof typeof SaleItemScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly saleId: "saleId";
    readonly amount: "amount";
    readonly paymentDate: "paymentDate";
    readonly method: "method";
    readonly reference: "reference";
    readonly observation: "observation";
    readonly createdAt: "createdAt";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const ExpenseScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly category: "category";
    readonly amount: "amount";
    readonly date: "date";
    readonly description: "description";
    readonly reference: "reference";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ExpenseScalarFieldEnum = (typeof ExpenseScalarFieldEnum)[keyof typeof ExpenseScalarFieldEnum];
export declare const InventoryItemScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly name: "name";
    readonly type: "type";
    readonly unit: "unit";
    readonly minimumStock: "minimumStock";
    readonly description: "description";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type InventoryItemScalarFieldEnum = (typeof InventoryItemScalarFieldEnum)[keyof typeof InventoryItemScalarFieldEnum];
export declare const StockMovementScalarFieldEnum: {
    readonly id: "id";
    readonly inventoryItemId: "inventoryItemId";
    readonly type: "type";
    readonly quantity: "quantity";
    readonly date: "date";
    readonly unitCost: "unitCost";
    readonly reference: "reference";
    readonly description: "description";
    readonly createdAt: "createdAt";
};
export type StockMovementScalarFieldEnum = (typeof StockMovementScalarFieldEnum)[keyof typeof StockMovementScalarFieldEnum];
export declare const TaskScalarFieldEnum: {
    readonly id: "id";
    readonly farmId: "farmId";
    readonly title: "title";
    readonly description: "description";
    readonly dueDate: "dueDate";
    readonly priority: "priority";
    readonly status: "status";
    readonly assignedToId: "assignedToId";
    readonly sourceType: "sourceType";
    readonly sourceId: "sourceId";
    readonly completedAt: "completedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumFarmRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FarmRole'>;
export type ListEnumFarmRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FarmRole[]'>;
export type EnumSectionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SectionType'>;
export type ListEnumSectionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SectionType[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type EnumCageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CageStatus'>;
export type ListEnumCageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CageStatus[]'>;
export type EnumRabbitSexFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RabbitSex'>;
export type ListEnumRabbitSexFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RabbitSex[]'>;
export type EnumRabbitStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RabbitStatus'>;
export type ListEnumRabbitStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RabbitStatus[]'>;
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
export type EnumRabbitIdentificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RabbitIdentificationType'>;
export type ListEnumRabbitIdentificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RabbitIdentificationType[]'>;
export type EnumBreedingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BreedingStatus'>;
export type ListEnumBreedingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BreedingStatus[]'>;
export type EnumPregnancyResultFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PregnancyResult'>;
export type ListEnumPregnancyResultFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PregnancyResult[]'>;
export type EnumLitterStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LitterStatus'>;
export type ListEnumLitterStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LitterStatus[]'>;
export type EnumFatteningLotStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FatteningLotStatus'>;
export type ListEnumFatteningLotStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FatteningLotStatus[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type EnumSaleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SaleStatus'>;
export type ListEnumSaleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SaleStatus[]'>;
export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>;
export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>;
export type EnumExpenseCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExpenseCategory'>;
export type ListEnumExpenseCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExpenseCategory[]'>;
export type EnumInventoryItemTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InventoryItemType'>;
export type ListEnumInventoryItemTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InventoryItemType[]'>;
export type EnumStockMovementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockMovementType'>;
export type ListEnumStockMovementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockMovementType[]'>;
export type EnumTaskPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskPriority'>;
export type ListEnumTaskPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskPriority[]'>;
export type EnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus'>;
export type ListEnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface PrismaClientBaseOptions {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
}
export interface PrismaClientOptionsWithAccelerateUrl extends PrismaClientBaseOptions {
    accelerateUrl: string;
    adapter?: never;
}
export interface PrismaClientOptionsWithAdapter extends PrismaClientBaseOptions {
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
}
export type PrismaClientOptions = PrismaClientOptionsWithAccelerateUrl | PrismaClientOptionsWithAdapter;
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    farm?: Prisma.FarmOmit;
    farmMembership?: Prisma.FarmMembershipOmit;
    section?: Prisma.SectionOmit;
    cage?: Prisma.CageOmit;
    breed?: Prisma.BreedOmit;
    crossBreed?: Prisma.CrossBreedOmit;
    rabbit?: Prisma.RabbitOmit;
    rabbitIdentification?: Prisma.RabbitIdentificationOmit;
    rabbitCageMovement?: Prisma.RabbitCageMovementOmit;
    breeding?: Prisma.BreedingOmit;
    pregnancy?: Prisma.PregnancyOmit;
    birth?: Prisma.BirthOmit;
    litter?: Prisma.LitterOmit;
    litterAdoption?: Prisma.LitterAdoptionOmit;
    adoptionRabbit?: Prisma.AdoptionRabbitOmit;
    weaning?: Prisma.WeaningOmit;
    weaningRabbit?: Prisma.WeaningRabbitOmit;
    fatteningLot?: Prisma.FatteningLotOmit;
    lotMembership?: Prisma.LotMembershipOmit;
    weighing?: Prisma.WeighingOmit;
    healthRecord?: Prisma.HealthRecordOmit;
    customer?: Prisma.CustomerOmit;
    sale?: Prisma.SaleOmit;
    saleItem?: Prisma.SaleItemOmit;
    payment?: Prisma.PaymentOmit;
    expense?: Prisma.ExpenseOmit;
    inventoryItem?: Prisma.InventoryItemOmit;
    stockMovement?: Prisma.StockMovementOmit;
    task?: Prisma.TaskOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
