import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type FarmMembershipModel = runtime.Types.Result.DefaultSelection<Prisma.$FarmMembershipPayload>;
export type AggregateFarmMembership = {
    _count: FarmMembershipCountAggregateOutputType | null;
    _min: FarmMembershipMinAggregateOutputType | null;
    _max: FarmMembershipMaxAggregateOutputType | null;
};
export type FarmMembershipMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    farmId: string | null;
    role: $Enums.FarmRole | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type FarmMembershipMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    farmId: string | null;
    role: $Enums.FarmRole | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type FarmMembershipCountAggregateOutputType = {
    id: number;
    userId: number;
    farmId: number;
    role: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type FarmMembershipMinAggregateInputType = {
    id?: true;
    userId?: true;
    farmId?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type FarmMembershipMaxAggregateInputType = {
    id?: true;
    userId?: true;
    farmId?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type FarmMembershipCountAggregateInputType = {
    id?: true;
    userId?: true;
    farmId?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type FarmMembershipAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FarmMembershipWhereInput;
    orderBy?: Prisma.FarmMembershipOrderByWithRelationInput | Prisma.FarmMembershipOrderByWithRelationInput[];
    cursor?: Prisma.FarmMembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | FarmMembershipCountAggregateInputType;
    _min?: FarmMembershipMinAggregateInputType;
    _max?: FarmMembershipMaxAggregateInputType;
};
export type GetFarmMembershipAggregateType<T extends FarmMembershipAggregateArgs> = {
    [P in keyof T & keyof AggregateFarmMembership]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFarmMembership[P]> : Prisma.GetScalarType<T[P], AggregateFarmMembership[P]>;
};
export type FarmMembershipGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FarmMembershipWhereInput;
    orderBy?: Prisma.FarmMembershipOrderByWithAggregationInput | Prisma.FarmMembershipOrderByWithAggregationInput[];
    by: Prisma.FarmMembershipScalarFieldEnum[] | Prisma.FarmMembershipScalarFieldEnum;
    having?: Prisma.FarmMembershipScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FarmMembershipCountAggregateInputType | true;
    _min?: FarmMembershipMinAggregateInputType;
    _max?: FarmMembershipMaxAggregateInputType;
};
export type FarmMembershipGroupByOutputType = {
    id: string;
    userId: string;
    farmId: string;
    role: $Enums.FarmRole;
    createdAt: Date;
    updatedAt: Date;
    _count: FarmMembershipCountAggregateOutputType | null;
    _min: FarmMembershipMinAggregateOutputType | null;
    _max: FarmMembershipMaxAggregateOutputType | null;
};
export type GetFarmMembershipGroupByPayload<T extends FarmMembershipGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FarmMembershipGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FarmMembershipGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FarmMembershipGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FarmMembershipGroupByOutputType[P]>;
}>>;
export type FarmMembershipWhereInput = {
    AND?: Prisma.FarmMembershipWhereInput | Prisma.FarmMembershipWhereInput[];
    OR?: Prisma.FarmMembershipWhereInput[];
    NOT?: Prisma.FarmMembershipWhereInput | Prisma.FarmMembershipWhereInput[];
    id?: Prisma.StringFilter<"FarmMembership"> | string;
    userId?: Prisma.StringFilter<"FarmMembership"> | string;
    farmId?: Prisma.StringFilter<"FarmMembership"> | string;
    role?: Prisma.EnumFarmRoleFilter<"FarmMembership"> | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFilter<"FarmMembership"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FarmMembership"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
};
export type FarmMembershipOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    farm?: Prisma.FarmOrderByWithRelationInput;
};
export type FarmMembershipWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_farmId?: Prisma.FarmMembershipUserIdFarmIdCompoundUniqueInput;
    AND?: Prisma.FarmMembershipWhereInput | Prisma.FarmMembershipWhereInput[];
    OR?: Prisma.FarmMembershipWhereInput[];
    NOT?: Prisma.FarmMembershipWhereInput | Prisma.FarmMembershipWhereInput[];
    userId?: Prisma.StringFilter<"FarmMembership"> | string;
    farmId?: Prisma.StringFilter<"FarmMembership"> | string;
    role?: Prisma.EnumFarmRoleFilter<"FarmMembership"> | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFilter<"FarmMembership"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FarmMembership"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
}, "id" | "userId_farmId">;
export type FarmMembershipOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.FarmMembershipCountOrderByAggregateInput;
    _max?: Prisma.FarmMembershipMaxOrderByAggregateInput;
    _min?: Prisma.FarmMembershipMinOrderByAggregateInput;
};
export type FarmMembershipScalarWhereWithAggregatesInput = {
    AND?: Prisma.FarmMembershipScalarWhereWithAggregatesInput | Prisma.FarmMembershipScalarWhereWithAggregatesInput[];
    OR?: Prisma.FarmMembershipScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FarmMembershipScalarWhereWithAggregatesInput | Prisma.FarmMembershipScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"FarmMembership"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"FarmMembership"> | string;
    farmId?: Prisma.StringWithAggregatesFilter<"FarmMembership"> | string;
    role?: Prisma.EnumFarmRoleWithAggregatesFilter<"FarmMembership"> | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"FarmMembership"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"FarmMembership"> | Date | string;
};
export type FarmMembershipCreateInput = {
    id?: string;
    role: $Enums.FarmRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutMembershipsInput;
    farm: Prisma.FarmCreateNestedOneWithoutMembershipsInput;
};
export type FarmMembershipUncheckedCreateInput = {
    id?: string;
    userId: string;
    farmId: string;
    role: $Enums.FarmRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FarmMembershipUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumFarmRoleFieldUpdateOperationsInput | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutMembershipsNestedInput;
    farm?: Prisma.FarmUpdateOneRequiredWithoutMembershipsNestedInput;
};
export type FarmMembershipUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumFarmRoleFieldUpdateOperationsInput | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FarmMembershipCreateManyInput = {
    id?: string;
    userId: string;
    farmId: string;
    role: $Enums.FarmRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FarmMembershipUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumFarmRoleFieldUpdateOperationsInput | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FarmMembershipUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumFarmRoleFieldUpdateOperationsInput | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FarmMembershipListRelationFilter = {
    every?: Prisma.FarmMembershipWhereInput;
    some?: Prisma.FarmMembershipWhereInput;
    none?: Prisma.FarmMembershipWhereInput;
};
export type FarmMembershipOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type FarmMembershipUserIdFarmIdCompoundUniqueInput = {
    userId: string;
    farmId: string;
};
export type FarmMembershipCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FarmMembershipMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FarmMembershipMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FarmMembershipCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.FarmMembershipCreateWithoutUserInput, Prisma.FarmMembershipUncheckedCreateWithoutUserInput> | Prisma.FarmMembershipCreateWithoutUserInput[] | Prisma.FarmMembershipUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FarmMembershipCreateOrConnectWithoutUserInput | Prisma.FarmMembershipCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.FarmMembershipCreateManyUserInputEnvelope;
    connect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
};
export type FarmMembershipUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.FarmMembershipCreateWithoutUserInput, Prisma.FarmMembershipUncheckedCreateWithoutUserInput> | Prisma.FarmMembershipCreateWithoutUserInput[] | Prisma.FarmMembershipUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FarmMembershipCreateOrConnectWithoutUserInput | Prisma.FarmMembershipCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.FarmMembershipCreateManyUserInputEnvelope;
    connect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
};
export type FarmMembershipUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.FarmMembershipCreateWithoutUserInput, Prisma.FarmMembershipUncheckedCreateWithoutUserInput> | Prisma.FarmMembershipCreateWithoutUserInput[] | Prisma.FarmMembershipUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FarmMembershipCreateOrConnectWithoutUserInput | Prisma.FarmMembershipCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.FarmMembershipUpsertWithWhereUniqueWithoutUserInput | Prisma.FarmMembershipUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.FarmMembershipCreateManyUserInputEnvelope;
    set?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    disconnect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    delete?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    connect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    update?: Prisma.FarmMembershipUpdateWithWhereUniqueWithoutUserInput | Prisma.FarmMembershipUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.FarmMembershipUpdateManyWithWhereWithoutUserInput | Prisma.FarmMembershipUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.FarmMembershipScalarWhereInput | Prisma.FarmMembershipScalarWhereInput[];
};
export type FarmMembershipUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.FarmMembershipCreateWithoutUserInput, Prisma.FarmMembershipUncheckedCreateWithoutUserInput> | Prisma.FarmMembershipCreateWithoutUserInput[] | Prisma.FarmMembershipUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FarmMembershipCreateOrConnectWithoutUserInput | Prisma.FarmMembershipCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.FarmMembershipUpsertWithWhereUniqueWithoutUserInput | Prisma.FarmMembershipUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.FarmMembershipCreateManyUserInputEnvelope;
    set?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    disconnect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    delete?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    connect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    update?: Prisma.FarmMembershipUpdateWithWhereUniqueWithoutUserInput | Prisma.FarmMembershipUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.FarmMembershipUpdateManyWithWhereWithoutUserInput | Prisma.FarmMembershipUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.FarmMembershipScalarWhereInput | Prisma.FarmMembershipScalarWhereInput[];
};
export type FarmMembershipCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.FarmMembershipCreateWithoutFarmInput, Prisma.FarmMembershipUncheckedCreateWithoutFarmInput> | Prisma.FarmMembershipCreateWithoutFarmInput[] | Prisma.FarmMembershipUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.FarmMembershipCreateOrConnectWithoutFarmInput | Prisma.FarmMembershipCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.FarmMembershipCreateManyFarmInputEnvelope;
    connect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
};
export type FarmMembershipUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.FarmMembershipCreateWithoutFarmInput, Prisma.FarmMembershipUncheckedCreateWithoutFarmInput> | Prisma.FarmMembershipCreateWithoutFarmInput[] | Prisma.FarmMembershipUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.FarmMembershipCreateOrConnectWithoutFarmInput | Prisma.FarmMembershipCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.FarmMembershipCreateManyFarmInputEnvelope;
    connect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
};
export type FarmMembershipUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.FarmMembershipCreateWithoutFarmInput, Prisma.FarmMembershipUncheckedCreateWithoutFarmInput> | Prisma.FarmMembershipCreateWithoutFarmInput[] | Prisma.FarmMembershipUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.FarmMembershipCreateOrConnectWithoutFarmInput | Prisma.FarmMembershipCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.FarmMembershipUpsertWithWhereUniqueWithoutFarmInput | Prisma.FarmMembershipUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.FarmMembershipCreateManyFarmInputEnvelope;
    set?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    disconnect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    delete?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    connect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    update?: Prisma.FarmMembershipUpdateWithWhereUniqueWithoutFarmInput | Prisma.FarmMembershipUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.FarmMembershipUpdateManyWithWhereWithoutFarmInput | Prisma.FarmMembershipUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.FarmMembershipScalarWhereInput | Prisma.FarmMembershipScalarWhereInput[];
};
export type FarmMembershipUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.FarmMembershipCreateWithoutFarmInput, Prisma.FarmMembershipUncheckedCreateWithoutFarmInput> | Prisma.FarmMembershipCreateWithoutFarmInput[] | Prisma.FarmMembershipUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.FarmMembershipCreateOrConnectWithoutFarmInput | Prisma.FarmMembershipCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.FarmMembershipUpsertWithWhereUniqueWithoutFarmInput | Prisma.FarmMembershipUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.FarmMembershipCreateManyFarmInputEnvelope;
    set?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    disconnect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    delete?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    connect?: Prisma.FarmMembershipWhereUniqueInput | Prisma.FarmMembershipWhereUniqueInput[];
    update?: Prisma.FarmMembershipUpdateWithWhereUniqueWithoutFarmInput | Prisma.FarmMembershipUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.FarmMembershipUpdateManyWithWhereWithoutFarmInput | Prisma.FarmMembershipUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.FarmMembershipScalarWhereInput | Prisma.FarmMembershipScalarWhereInput[];
};
export type EnumFarmRoleFieldUpdateOperationsInput = {
    set?: $Enums.FarmRole;
};
export type FarmMembershipCreateWithoutUserInput = {
    id?: string;
    role: $Enums.FarmRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutMembershipsInput;
};
export type FarmMembershipUncheckedCreateWithoutUserInput = {
    id?: string;
    farmId: string;
    role: $Enums.FarmRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FarmMembershipCreateOrConnectWithoutUserInput = {
    where: Prisma.FarmMembershipWhereUniqueInput;
    create: Prisma.XOR<Prisma.FarmMembershipCreateWithoutUserInput, Prisma.FarmMembershipUncheckedCreateWithoutUserInput>;
};
export type FarmMembershipCreateManyUserInputEnvelope = {
    data: Prisma.FarmMembershipCreateManyUserInput | Prisma.FarmMembershipCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type FarmMembershipUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.FarmMembershipWhereUniqueInput;
    update: Prisma.XOR<Prisma.FarmMembershipUpdateWithoutUserInput, Prisma.FarmMembershipUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.FarmMembershipCreateWithoutUserInput, Prisma.FarmMembershipUncheckedCreateWithoutUserInput>;
};
export type FarmMembershipUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.FarmMembershipWhereUniqueInput;
    data: Prisma.XOR<Prisma.FarmMembershipUpdateWithoutUserInput, Prisma.FarmMembershipUncheckedUpdateWithoutUserInput>;
};
export type FarmMembershipUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.FarmMembershipScalarWhereInput;
    data: Prisma.XOR<Prisma.FarmMembershipUpdateManyMutationInput, Prisma.FarmMembershipUncheckedUpdateManyWithoutUserInput>;
};
export type FarmMembershipScalarWhereInput = {
    AND?: Prisma.FarmMembershipScalarWhereInput | Prisma.FarmMembershipScalarWhereInput[];
    OR?: Prisma.FarmMembershipScalarWhereInput[];
    NOT?: Prisma.FarmMembershipScalarWhereInput | Prisma.FarmMembershipScalarWhereInput[];
    id?: Prisma.StringFilter<"FarmMembership"> | string;
    userId?: Prisma.StringFilter<"FarmMembership"> | string;
    farmId?: Prisma.StringFilter<"FarmMembership"> | string;
    role?: Prisma.EnumFarmRoleFilter<"FarmMembership"> | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFilter<"FarmMembership"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FarmMembership"> | Date | string;
};
export type FarmMembershipCreateWithoutFarmInput = {
    id?: string;
    role: $Enums.FarmRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutMembershipsInput;
};
export type FarmMembershipUncheckedCreateWithoutFarmInput = {
    id?: string;
    userId: string;
    role: $Enums.FarmRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FarmMembershipCreateOrConnectWithoutFarmInput = {
    where: Prisma.FarmMembershipWhereUniqueInput;
    create: Prisma.XOR<Prisma.FarmMembershipCreateWithoutFarmInput, Prisma.FarmMembershipUncheckedCreateWithoutFarmInput>;
};
export type FarmMembershipCreateManyFarmInputEnvelope = {
    data: Prisma.FarmMembershipCreateManyFarmInput | Prisma.FarmMembershipCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type FarmMembershipUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.FarmMembershipWhereUniqueInput;
    update: Prisma.XOR<Prisma.FarmMembershipUpdateWithoutFarmInput, Prisma.FarmMembershipUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.FarmMembershipCreateWithoutFarmInput, Prisma.FarmMembershipUncheckedCreateWithoutFarmInput>;
};
export type FarmMembershipUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.FarmMembershipWhereUniqueInput;
    data: Prisma.XOR<Prisma.FarmMembershipUpdateWithoutFarmInput, Prisma.FarmMembershipUncheckedUpdateWithoutFarmInput>;
};
export type FarmMembershipUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.FarmMembershipScalarWhereInput;
    data: Prisma.XOR<Prisma.FarmMembershipUpdateManyMutationInput, Prisma.FarmMembershipUncheckedUpdateManyWithoutFarmInput>;
};
export type FarmMembershipCreateManyUserInput = {
    id?: string;
    farmId: string;
    role: $Enums.FarmRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FarmMembershipUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumFarmRoleFieldUpdateOperationsInput | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutMembershipsNestedInput;
};
export type FarmMembershipUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumFarmRoleFieldUpdateOperationsInput | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FarmMembershipUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumFarmRoleFieldUpdateOperationsInput | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FarmMembershipCreateManyFarmInput = {
    id?: string;
    userId: string;
    role: $Enums.FarmRole;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FarmMembershipUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumFarmRoleFieldUpdateOperationsInput | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutMembershipsNestedInput;
};
export type FarmMembershipUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumFarmRoleFieldUpdateOperationsInput | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FarmMembershipUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumFarmRoleFieldUpdateOperationsInput | $Enums.FarmRole;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FarmMembershipSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    farmId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["farmMembership"]>;
export type FarmMembershipSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    farmId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["farmMembership"]>;
export type FarmMembershipSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    farmId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["farmMembership"]>;
export type FarmMembershipSelectScalar = {
    id?: boolean;
    userId?: boolean;
    farmId?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type FarmMembershipOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "farmId" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["farmMembership"]>;
export type FarmMembershipInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
};
export type FarmMembershipIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
};
export type FarmMembershipIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
};
export type $FarmMembershipPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FarmMembership";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        farm: Prisma.$FarmPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        farmId: string;
        role: $Enums.FarmRole;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["farmMembership"]>;
    composites: {};
};
export type FarmMembershipGetPayload<S extends boolean | null | undefined | FarmMembershipDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload, S>;
export type FarmMembershipCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FarmMembershipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FarmMembershipCountAggregateInputType | true;
};
export interface FarmMembershipDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FarmMembership'];
        meta: {
            name: 'FarmMembership';
        };
    };
    findUnique<T extends FarmMembershipFindUniqueArgs>(args: Prisma.SelectSubset<T, FarmMembershipFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FarmMembershipClient<runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends FarmMembershipFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FarmMembershipFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FarmMembershipClient<runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends FarmMembershipFindFirstArgs>(args?: Prisma.SelectSubset<T, FarmMembershipFindFirstArgs<ExtArgs>>): Prisma.Prisma__FarmMembershipClient<runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends FarmMembershipFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FarmMembershipFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FarmMembershipClient<runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends FarmMembershipFindManyArgs>(args?: Prisma.SelectSubset<T, FarmMembershipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends FarmMembershipCreateArgs>(args: Prisma.SelectSubset<T, FarmMembershipCreateArgs<ExtArgs>>): Prisma.Prisma__FarmMembershipClient<runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends FarmMembershipCreateManyArgs>(args?: Prisma.SelectSubset<T, FarmMembershipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends FarmMembershipCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FarmMembershipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends FarmMembershipDeleteArgs>(args: Prisma.SelectSubset<T, FarmMembershipDeleteArgs<ExtArgs>>): Prisma.Prisma__FarmMembershipClient<runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends FarmMembershipUpdateArgs>(args: Prisma.SelectSubset<T, FarmMembershipUpdateArgs<ExtArgs>>): Prisma.Prisma__FarmMembershipClient<runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends FarmMembershipDeleteManyArgs>(args?: Prisma.SelectSubset<T, FarmMembershipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends FarmMembershipUpdateManyArgs>(args: Prisma.SelectSubset<T, FarmMembershipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends FarmMembershipUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FarmMembershipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends FarmMembershipUpsertArgs>(args: Prisma.SelectSubset<T, FarmMembershipUpsertArgs<ExtArgs>>): Prisma.Prisma__FarmMembershipClient<runtime.Types.Result.GetResult<Prisma.$FarmMembershipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends FarmMembershipCountArgs>(args?: Prisma.Subset<T, FarmMembershipCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FarmMembershipCountAggregateOutputType> : number>;
    aggregate<T extends FarmMembershipAggregateArgs>(args: Prisma.Subset<T, FarmMembershipAggregateArgs>): Prisma.PrismaPromise<GetFarmMembershipAggregateType<T>>;
    groupBy<T extends FarmMembershipGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FarmMembershipGroupByArgs['orderBy'];
    } : {
        orderBy?: FarmMembershipGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FarmMembershipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFarmMembershipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: FarmMembershipFieldRefs;
}
export interface Prisma__FarmMembershipClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    farm<T extends Prisma.FarmDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FarmDefaultArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface FarmMembershipFieldRefs {
    readonly id: Prisma.FieldRef<"FarmMembership", 'String'>;
    readonly userId: Prisma.FieldRef<"FarmMembership", 'String'>;
    readonly farmId: Prisma.FieldRef<"FarmMembership", 'String'>;
    readonly role: Prisma.FieldRef<"FarmMembership", 'FarmRole'>;
    readonly createdAt: Prisma.FieldRef<"FarmMembership", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"FarmMembership", 'DateTime'>;
}
export type FarmMembershipFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelect<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    include?: Prisma.FarmMembershipInclude<ExtArgs> | null;
    where: Prisma.FarmMembershipWhereUniqueInput;
};
export type FarmMembershipFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelect<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    include?: Prisma.FarmMembershipInclude<ExtArgs> | null;
    where: Prisma.FarmMembershipWhereUniqueInput;
};
export type FarmMembershipFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelect<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    include?: Prisma.FarmMembershipInclude<ExtArgs> | null;
    where?: Prisma.FarmMembershipWhereInput;
    orderBy?: Prisma.FarmMembershipOrderByWithRelationInput | Prisma.FarmMembershipOrderByWithRelationInput[];
    cursor?: Prisma.FarmMembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FarmMembershipScalarFieldEnum | Prisma.FarmMembershipScalarFieldEnum[];
};
export type FarmMembershipFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelect<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    include?: Prisma.FarmMembershipInclude<ExtArgs> | null;
    where?: Prisma.FarmMembershipWhereInput;
    orderBy?: Prisma.FarmMembershipOrderByWithRelationInput | Prisma.FarmMembershipOrderByWithRelationInput[];
    cursor?: Prisma.FarmMembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FarmMembershipScalarFieldEnum | Prisma.FarmMembershipScalarFieldEnum[];
};
export type FarmMembershipFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelect<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    include?: Prisma.FarmMembershipInclude<ExtArgs> | null;
    where?: Prisma.FarmMembershipWhereInput;
    orderBy?: Prisma.FarmMembershipOrderByWithRelationInput | Prisma.FarmMembershipOrderByWithRelationInput[];
    cursor?: Prisma.FarmMembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FarmMembershipScalarFieldEnum | Prisma.FarmMembershipScalarFieldEnum[];
};
export type FarmMembershipCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelect<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    include?: Prisma.FarmMembershipInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FarmMembershipCreateInput, Prisma.FarmMembershipUncheckedCreateInput>;
};
export type FarmMembershipCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.FarmMembershipCreateManyInput | Prisma.FarmMembershipCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FarmMembershipCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    data: Prisma.FarmMembershipCreateManyInput | Prisma.FarmMembershipCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.FarmMembershipIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type FarmMembershipUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelect<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    include?: Prisma.FarmMembershipInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FarmMembershipUpdateInput, Prisma.FarmMembershipUncheckedUpdateInput>;
    where: Prisma.FarmMembershipWhereUniqueInput;
};
export type FarmMembershipUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.FarmMembershipUpdateManyMutationInput, Prisma.FarmMembershipUncheckedUpdateManyInput>;
    where?: Prisma.FarmMembershipWhereInput;
    limit?: number;
};
export type FarmMembershipUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FarmMembershipUpdateManyMutationInput, Prisma.FarmMembershipUncheckedUpdateManyInput>;
    where?: Prisma.FarmMembershipWhereInput;
    limit?: number;
    include?: Prisma.FarmMembershipIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type FarmMembershipUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelect<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    include?: Prisma.FarmMembershipInclude<ExtArgs> | null;
    where: Prisma.FarmMembershipWhereUniqueInput;
    create: Prisma.XOR<Prisma.FarmMembershipCreateInput, Prisma.FarmMembershipUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.FarmMembershipUpdateInput, Prisma.FarmMembershipUncheckedUpdateInput>;
};
export type FarmMembershipDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelect<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    include?: Prisma.FarmMembershipInclude<ExtArgs> | null;
    where: Prisma.FarmMembershipWhereUniqueInput;
};
export type FarmMembershipDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FarmMembershipWhereInput;
    limit?: number;
};
export type FarmMembershipDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmMembershipSelect<ExtArgs> | null;
    omit?: Prisma.FarmMembershipOmit<ExtArgs> | null;
    include?: Prisma.FarmMembershipInclude<ExtArgs> | null;
};
