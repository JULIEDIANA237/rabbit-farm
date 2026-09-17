import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type FatteningLotModel = runtime.Types.Result.DefaultSelection<Prisma.$FatteningLotPayload>;
export type AggregateFatteningLot = {
    _count: FatteningLotCountAggregateOutputType | null;
    _min: FatteningLotMinAggregateOutputType | null;
    _max: FatteningLotMaxAggregateOutputType | null;
};
export type FatteningLotMinAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    code: string | null;
    entryDate: Date | null;
    exitDate: Date | null;
    status: $Enums.FatteningLotStatus | null;
    observation: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type FatteningLotMaxAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    code: string | null;
    entryDate: Date | null;
    exitDate: Date | null;
    status: $Enums.FatteningLotStatus | null;
    observation: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type FatteningLotCountAggregateOutputType = {
    id: number;
    farmId: number;
    code: number;
    entryDate: number;
    exitDate: number;
    status: number;
    observation: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type FatteningLotMinAggregateInputType = {
    id?: true;
    farmId?: true;
    code?: true;
    entryDate?: true;
    exitDate?: true;
    status?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type FatteningLotMaxAggregateInputType = {
    id?: true;
    farmId?: true;
    code?: true;
    entryDate?: true;
    exitDate?: true;
    status?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type FatteningLotCountAggregateInputType = {
    id?: true;
    farmId?: true;
    code?: true;
    entryDate?: true;
    exitDate?: true;
    status?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type FatteningLotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FatteningLotWhereInput;
    orderBy?: Prisma.FatteningLotOrderByWithRelationInput | Prisma.FatteningLotOrderByWithRelationInput[];
    cursor?: Prisma.FatteningLotWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | FatteningLotCountAggregateInputType;
    _min?: FatteningLotMinAggregateInputType;
    _max?: FatteningLotMaxAggregateInputType;
};
export type GetFatteningLotAggregateType<T extends FatteningLotAggregateArgs> = {
    [P in keyof T & keyof AggregateFatteningLot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFatteningLot[P]> : Prisma.GetScalarType<T[P], AggregateFatteningLot[P]>;
};
export type FatteningLotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FatteningLotWhereInput;
    orderBy?: Prisma.FatteningLotOrderByWithAggregationInput | Prisma.FatteningLotOrderByWithAggregationInput[];
    by: Prisma.FatteningLotScalarFieldEnum[] | Prisma.FatteningLotScalarFieldEnum;
    having?: Prisma.FatteningLotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FatteningLotCountAggregateInputType | true;
    _min?: FatteningLotMinAggregateInputType;
    _max?: FatteningLotMaxAggregateInputType;
};
export type FatteningLotGroupByOutputType = {
    id: string;
    farmId: string;
    code: string;
    entryDate: Date;
    exitDate: Date | null;
    status: $Enums.FatteningLotStatus;
    observation: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: FatteningLotCountAggregateOutputType | null;
    _min: FatteningLotMinAggregateOutputType | null;
    _max: FatteningLotMaxAggregateOutputType | null;
};
export type GetFatteningLotGroupByPayload<T extends FatteningLotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FatteningLotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FatteningLotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FatteningLotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FatteningLotGroupByOutputType[P]>;
}>>;
export type FatteningLotWhereInput = {
    AND?: Prisma.FatteningLotWhereInput | Prisma.FatteningLotWhereInput[];
    OR?: Prisma.FatteningLotWhereInput[];
    NOT?: Prisma.FatteningLotWhereInput | Prisma.FatteningLotWhereInput[];
    id?: Prisma.StringFilter<"FatteningLot"> | string;
    farmId?: Prisma.StringFilter<"FatteningLot"> | string;
    code?: Prisma.StringFilter<"FatteningLot"> | string;
    entryDate?: Prisma.DateTimeFilter<"FatteningLot"> | Date | string;
    exitDate?: Prisma.DateTimeNullableFilter<"FatteningLot"> | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFilter<"FatteningLot"> | $Enums.FatteningLotStatus;
    observation?: Prisma.StringNullableFilter<"FatteningLot"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"FatteningLot"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FatteningLot"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    memberships?: Prisma.LotMembershipListRelationFilter;
    weighings?: Prisma.WeighingListRelationFilter;
};
export type FatteningLotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    entryDate?: Prisma.SortOrder;
    exitDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    farm?: Prisma.FarmOrderByWithRelationInput;
    memberships?: Prisma.LotMembershipOrderByRelationAggregateInput;
    weighings?: Prisma.WeighingOrderByRelationAggregateInput;
};
export type FatteningLotWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    farmId_code?: Prisma.FatteningLotFarmIdCodeCompoundUniqueInput;
    AND?: Prisma.FatteningLotWhereInput | Prisma.FatteningLotWhereInput[];
    OR?: Prisma.FatteningLotWhereInput[];
    NOT?: Prisma.FatteningLotWhereInput | Prisma.FatteningLotWhereInput[];
    farmId?: Prisma.StringFilter<"FatteningLot"> | string;
    code?: Prisma.StringFilter<"FatteningLot"> | string;
    entryDate?: Prisma.DateTimeFilter<"FatteningLot"> | Date | string;
    exitDate?: Prisma.DateTimeNullableFilter<"FatteningLot"> | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFilter<"FatteningLot"> | $Enums.FatteningLotStatus;
    observation?: Prisma.StringNullableFilter<"FatteningLot"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"FatteningLot"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FatteningLot"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    memberships?: Prisma.LotMembershipListRelationFilter;
    weighings?: Prisma.WeighingListRelationFilter;
}, "id" | "farmId_code">;
export type FatteningLotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    entryDate?: Prisma.SortOrder;
    exitDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.FatteningLotCountOrderByAggregateInput;
    _max?: Prisma.FatteningLotMaxOrderByAggregateInput;
    _min?: Prisma.FatteningLotMinOrderByAggregateInput;
};
export type FatteningLotScalarWhereWithAggregatesInput = {
    AND?: Prisma.FatteningLotScalarWhereWithAggregatesInput | Prisma.FatteningLotScalarWhereWithAggregatesInput[];
    OR?: Prisma.FatteningLotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FatteningLotScalarWhereWithAggregatesInput | Prisma.FatteningLotScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"FatteningLot"> | string;
    farmId?: Prisma.StringWithAggregatesFilter<"FatteningLot"> | string;
    code?: Prisma.StringWithAggregatesFilter<"FatteningLot"> | string;
    entryDate?: Prisma.DateTimeWithAggregatesFilter<"FatteningLot"> | Date | string;
    exitDate?: Prisma.DateTimeNullableWithAggregatesFilter<"FatteningLot"> | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusWithAggregatesFilter<"FatteningLot"> | $Enums.FatteningLotStatus;
    observation?: Prisma.StringNullableWithAggregatesFilter<"FatteningLot"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"FatteningLot"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"FatteningLot"> | Date | string;
};
export type FatteningLotCreateInput = {
    id?: string;
    code: string;
    entryDate: Date | string;
    exitDate?: Date | string | null;
    status?: $Enums.FatteningLotStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutFatteningLotsInput;
    memberships?: Prisma.LotMembershipCreateNestedManyWithoutLotInput;
    weighings?: Prisma.WeighingCreateNestedManyWithoutLotInput;
};
export type FatteningLotUncheckedCreateInput = {
    id?: string;
    farmId: string;
    code: string;
    entryDate: Date | string;
    exitDate?: Date | string | null;
    status?: $Enums.FatteningLotStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    memberships?: Prisma.LotMembershipUncheckedCreateNestedManyWithoutLotInput;
    weighings?: Prisma.WeighingUncheckedCreateNestedManyWithoutLotInput;
};
export type FatteningLotUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    entryDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exitDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFieldUpdateOperationsInput | $Enums.FatteningLotStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutFatteningLotsNestedInput;
    memberships?: Prisma.LotMembershipUpdateManyWithoutLotNestedInput;
    weighings?: Prisma.WeighingUpdateManyWithoutLotNestedInput;
};
export type FatteningLotUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    entryDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exitDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFieldUpdateOperationsInput | $Enums.FatteningLotStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    memberships?: Prisma.LotMembershipUncheckedUpdateManyWithoutLotNestedInput;
    weighings?: Prisma.WeighingUncheckedUpdateManyWithoutLotNestedInput;
};
export type FatteningLotCreateManyInput = {
    id?: string;
    farmId: string;
    code: string;
    entryDate: Date | string;
    exitDate?: Date | string | null;
    status?: $Enums.FatteningLotStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FatteningLotUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    entryDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exitDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFieldUpdateOperationsInput | $Enums.FatteningLotStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FatteningLotUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    entryDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exitDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFieldUpdateOperationsInput | $Enums.FatteningLotStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FatteningLotListRelationFilter = {
    every?: Prisma.FatteningLotWhereInput;
    some?: Prisma.FatteningLotWhereInput;
    none?: Prisma.FatteningLotWhereInput;
};
export type FatteningLotOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type FatteningLotFarmIdCodeCompoundUniqueInput = {
    farmId: string;
    code: string;
};
export type FatteningLotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    entryDate?: Prisma.SortOrder;
    exitDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FatteningLotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    entryDate?: Prisma.SortOrder;
    exitDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FatteningLotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    entryDate?: Prisma.SortOrder;
    exitDate?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type FatteningLotScalarRelationFilter = {
    is?: Prisma.FatteningLotWhereInput;
    isNot?: Prisma.FatteningLotWhereInput;
};
export type FatteningLotNullableScalarRelationFilter = {
    is?: Prisma.FatteningLotWhereInput | null;
    isNot?: Prisma.FatteningLotWhereInput | null;
};
export type FatteningLotCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.FatteningLotCreateWithoutFarmInput, Prisma.FatteningLotUncheckedCreateWithoutFarmInput> | Prisma.FatteningLotCreateWithoutFarmInput[] | Prisma.FatteningLotUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.FatteningLotCreateOrConnectWithoutFarmInput | Prisma.FatteningLotCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.FatteningLotCreateManyFarmInputEnvelope;
    connect?: Prisma.FatteningLotWhereUniqueInput | Prisma.FatteningLotWhereUniqueInput[];
};
export type FatteningLotUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.FatteningLotCreateWithoutFarmInput, Prisma.FatteningLotUncheckedCreateWithoutFarmInput> | Prisma.FatteningLotCreateWithoutFarmInput[] | Prisma.FatteningLotUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.FatteningLotCreateOrConnectWithoutFarmInput | Prisma.FatteningLotCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.FatteningLotCreateManyFarmInputEnvelope;
    connect?: Prisma.FatteningLotWhereUniqueInput | Prisma.FatteningLotWhereUniqueInput[];
};
export type FatteningLotUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.FatteningLotCreateWithoutFarmInput, Prisma.FatteningLotUncheckedCreateWithoutFarmInput> | Prisma.FatteningLotCreateWithoutFarmInput[] | Prisma.FatteningLotUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.FatteningLotCreateOrConnectWithoutFarmInput | Prisma.FatteningLotCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.FatteningLotUpsertWithWhereUniqueWithoutFarmInput | Prisma.FatteningLotUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.FatteningLotCreateManyFarmInputEnvelope;
    set?: Prisma.FatteningLotWhereUniqueInput | Prisma.FatteningLotWhereUniqueInput[];
    disconnect?: Prisma.FatteningLotWhereUniqueInput | Prisma.FatteningLotWhereUniqueInput[];
    delete?: Prisma.FatteningLotWhereUniqueInput | Prisma.FatteningLotWhereUniqueInput[];
    connect?: Prisma.FatteningLotWhereUniqueInput | Prisma.FatteningLotWhereUniqueInput[];
    update?: Prisma.FatteningLotUpdateWithWhereUniqueWithoutFarmInput | Prisma.FatteningLotUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.FatteningLotUpdateManyWithWhereWithoutFarmInput | Prisma.FatteningLotUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.FatteningLotScalarWhereInput | Prisma.FatteningLotScalarWhereInput[];
};
export type FatteningLotUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.FatteningLotCreateWithoutFarmInput, Prisma.FatteningLotUncheckedCreateWithoutFarmInput> | Prisma.FatteningLotCreateWithoutFarmInput[] | Prisma.FatteningLotUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.FatteningLotCreateOrConnectWithoutFarmInput | Prisma.FatteningLotCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.FatteningLotUpsertWithWhereUniqueWithoutFarmInput | Prisma.FatteningLotUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.FatteningLotCreateManyFarmInputEnvelope;
    set?: Prisma.FatteningLotWhereUniqueInput | Prisma.FatteningLotWhereUniqueInput[];
    disconnect?: Prisma.FatteningLotWhereUniqueInput | Prisma.FatteningLotWhereUniqueInput[];
    delete?: Prisma.FatteningLotWhereUniqueInput | Prisma.FatteningLotWhereUniqueInput[];
    connect?: Prisma.FatteningLotWhereUniqueInput | Prisma.FatteningLotWhereUniqueInput[];
    update?: Prisma.FatteningLotUpdateWithWhereUniqueWithoutFarmInput | Prisma.FatteningLotUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.FatteningLotUpdateManyWithWhereWithoutFarmInput | Prisma.FatteningLotUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.FatteningLotScalarWhereInput | Prisma.FatteningLotScalarWhereInput[];
};
export type EnumFatteningLotStatusFieldUpdateOperationsInput = {
    set?: $Enums.FatteningLotStatus;
};
export type FatteningLotCreateNestedOneWithoutMembershipsInput = {
    create?: Prisma.XOR<Prisma.FatteningLotCreateWithoutMembershipsInput, Prisma.FatteningLotUncheckedCreateWithoutMembershipsInput>;
    connectOrCreate?: Prisma.FatteningLotCreateOrConnectWithoutMembershipsInput;
    connect?: Prisma.FatteningLotWhereUniqueInput;
};
export type FatteningLotUpdateOneRequiredWithoutMembershipsNestedInput = {
    create?: Prisma.XOR<Prisma.FatteningLotCreateWithoutMembershipsInput, Prisma.FatteningLotUncheckedCreateWithoutMembershipsInput>;
    connectOrCreate?: Prisma.FatteningLotCreateOrConnectWithoutMembershipsInput;
    upsert?: Prisma.FatteningLotUpsertWithoutMembershipsInput;
    connect?: Prisma.FatteningLotWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.FatteningLotUpdateToOneWithWhereWithoutMembershipsInput, Prisma.FatteningLotUpdateWithoutMembershipsInput>, Prisma.FatteningLotUncheckedUpdateWithoutMembershipsInput>;
};
export type FatteningLotCreateNestedOneWithoutWeighingsInput = {
    create?: Prisma.XOR<Prisma.FatteningLotCreateWithoutWeighingsInput, Prisma.FatteningLotUncheckedCreateWithoutWeighingsInput>;
    connectOrCreate?: Prisma.FatteningLotCreateOrConnectWithoutWeighingsInput;
    connect?: Prisma.FatteningLotWhereUniqueInput;
};
export type FatteningLotUpdateOneWithoutWeighingsNestedInput = {
    create?: Prisma.XOR<Prisma.FatteningLotCreateWithoutWeighingsInput, Prisma.FatteningLotUncheckedCreateWithoutWeighingsInput>;
    connectOrCreate?: Prisma.FatteningLotCreateOrConnectWithoutWeighingsInput;
    upsert?: Prisma.FatteningLotUpsertWithoutWeighingsInput;
    disconnect?: Prisma.FatteningLotWhereInput | boolean;
    delete?: Prisma.FatteningLotWhereInput | boolean;
    connect?: Prisma.FatteningLotWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.FatteningLotUpdateToOneWithWhereWithoutWeighingsInput, Prisma.FatteningLotUpdateWithoutWeighingsInput>, Prisma.FatteningLotUncheckedUpdateWithoutWeighingsInput>;
};
export type FatteningLotCreateWithoutFarmInput = {
    id?: string;
    code: string;
    entryDate: Date | string;
    exitDate?: Date | string | null;
    status?: $Enums.FatteningLotStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    memberships?: Prisma.LotMembershipCreateNestedManyWithoutLotInput;
    weighings?: Prisma.WeighingCreateNestedManyWithoutLotInput;
};
export type FatteningLotUncheckedCreateWithoutFarmInput = {
    id?: string;
    code: string;
    entryDate: Date | string;
    exitDate?: Date | string | null;
    status?: $Enums.FatteningLotStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    memberships?: Prisma.LotMembershipUncheckedCreateNestedManyWithoutLotInput;
    weighings?: Prisma.WeighingUncheckedCreateNestedManyWithoutLotInput;
};
export type FatteningLotCreateOrConnectWithoutFarmInput = {
    where: Prisma.FatteningLotWhereUniqueInput;
    create: Prisma.XOR<Prisma.FatteningLotCreateWithoutFarmInput, Prisma.FatteningLotUncheckedCreateWithoutFarmInput>;
};
export type FatteningLotCreateManyFarmInputEnvelope = {
    data: Prisma.FatteningLotCreateManyFarmInput | Prisma.FatteningLotCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type FatteningLotUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.FatteningLotWhereUniqueInput;
    update: Prisma.XOR<Prisma.FatteningLotUpdateWithoutFarmInput, Prisma.FatteningLotUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.FatteningLotCreateWithoutFarmInput, Prisma.FatteningLotUncheckedCreateWithoutFarmInput>;
};
export type FatteningLotUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.FatteningLotWhereUniqueInput;
    data: Prisma.XOR<Prisma.FatteningLotUpdateWithoutFarmInput, Prisma.FatteningLotUncheckedUpdateWithoutFarmInput>;
};
export type FatteningLotUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.FatteningLotScalarWhereInput;
    data: Prisma.XOR<Prisma.FatteningLotUpdateManyMutationInput, Prisma.FatteningLotUncheckedUpdateManyWithoutFarmInput>;
};
export type FatteningLotScalarWhereInput = {
    AND?: Prisma.FatteningLotScalarWhereInput | Prisma.FatteningLotScalarWhereInput[];
    OR?: Prisma.FatteningLotScalarWhereInput[];
    NOT?: Prisma.FatteningLotScalarWhereInput | Prisma.FatteningLotScalarWhereInput[];
    id?: Prisma.StringFilter<"FatteningLot"> | string;
    farmId?: Prisma.StringFilter<"FatteningLot"> | string;
    code?: Prisma.StringFilter<"FatteningLot"> | string;
    entryDate?: Prisma.DateTimeFilter<"FatteningLot"> | Date | string;
    exitDate?: Prisma.DateTimeNullableFilter<"FatteningLot"> | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFilter<"FatteningLot"> | $Enums.FatteningLotStatus;
    observation?: Prisma.StringNullableFilter<"FatteningLot"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"FatteningLot"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"FatteningLot"> | Date | string;
};
export type FatteningLotCreateWithoutMembershipsInput = {
    id?: string;
    code: string;
    entryDate: Date | string;
    exitDate?: Date | string | null;
    status?: $Enums.FatteningLotStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutFatteningLotsInput;
    weighings?: Prisma.WeighingCreateNestedManyWithoutLotInput;
};
export type FatteningLotUncheckedCreateWithoutMembershipsInput = {
    id?: string;
    farmId: string;
    code: string;
    entryDate: Date | string;
    exitDate?: Date | string | null;
    status?: $Enums.FatteningLotStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    weighings?: Prisma.WeighingUncheckedCreateNestedManyWithoutLotInput;
};
export type FatteningLotCreateOrConnectWithoutMembershipsInput = {
    where: Prisma.FatteningLotWhereUniqueInput;
    create: Prisma.XOR<Prisma.FatteningLotCreateWithoutMembershipsInput, Prisma.FatteningLotUncheckedCreateWithoutMembershipsInput>;
};
export type FatteningLotUpsertWithoutMembershipsInput = {
    update: Prisma.XOR<Prisma.FatteningLotUpdateWithoutMembershipsInput, Prisma.FatteningLotUncheckedUpdateWithoutMembershipsInput>;
    create: Prisma.XOR<Prisma.FatteningLotCreateWithoutMembershipsInput, Prisma.FatteningLotUncheckedCreateWithoutMembershipsInput>;
    where?: Prisma.FatteningLotWhereInput;
};
export type FatteningLotUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: Prisma.FatteningLotWhereInput;
    data: Prisma.XOR<Prisma.FatteningLotUpdateWithoutMembershipsInput, Prisma.FatteningLotUncheckedUpdateWithoutMembershipsInput>;
};
export type FatteningLotUpdateWithoutMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    entryDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exitDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFieldUpdateOperationsInput | $Enums.FatteningLotStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutFatteningLotsNestedInput;
    weighings?: Prisma.WeighingUpdateManyWithoutLotNestedInput;
};
export type FatteningLotUncheckedUpdateWithoutMembershipsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    entryDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exitDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFieldUpdateOperationsInput | $Enums.FatteningLotStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    weighings?: Prisma.WeighingUncheckedUpdateManyWithoutLotNestedInput;
};
export type FatteningLotCreateWithoutWeighingsInput = {
    id?: string;
    code: string;
    entryDate: Date | string;
    exitDate?: Date | string | null;
    status?: $Enums.FatteningLotStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutFatteningLotsInput;
    memberships?: Prisma.LotMembershipCreateNestedManyWithoutLotInput;
};
export type FatteningLotUncheckedCreateWithoutWeighingsInput = {
    id?: string;
    farmId: string;
    code: string;
    entryDate: Date | string;
    exitDate?: Date | string | null;
    status?: $Enums.FatteningLotStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    memberships?: Prisma.LotMembershipUncheckedCreateNestedManyWithoutLotInput;
};
export type FatteningLotCreateOrConnectWithoutWeighingsInput = {
    where: Prisma.FatteningLotWhereUniqueInput;
    create: Prisma.XOR<Prisma.FatteningLotCreateWithoutWeighingsInput, Prisma.FatteningLotUncheckedCreateWithoutWeighingsInput>;
};
export type FatteningLotUpsertWithoutWeighingsInput = {
    update: Prisma.XOR<Prisma.FatteningLotUpdateWithoutWeighingsInput, Prisma.FatteningLotUncheckedUpdateWithoutWeighingsInput>;
    create: Prisma.XOR<Prisma.FatteningLotCreateWithoutWeighingsInput, Prisma.FatteningLotUncheckedCreateWithoutWeighingsInput>;
    where?: Prisma.FatteningLotWhereInput;
};
export type FatteningLotUpdateToOneWithWhereWithoutWeighingsInput = {
    where?: Prisma.FatteningLotWhereInput;
    data: Prisma.XOR<Prisma.FatteningLotUpdateWithoutWeighingsInput, Prisma.FatteningLotUncheckedUpdateWithoutWeighingsInput>;
};
export type FatteningLotUpdateWithoutWeighingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    entryDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exitDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFieldUpdateOperationsInput | $Enums.FatteningLotStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutFatteningLotsNestedInput;
    memberships?: Prisma.LotMembershipUpdateManyWithoutLotNestedInput;
};
export type FatteningLotUncheckedUpdateWithoutWeighingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    entryDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exitDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFieldUpdateOperationsInput | $Enums.FatteningLotStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    memberships?: Prisma.LotMembershipUncheckedUpdateManyWithoutLotNestedInput;
};
export type FatteningLotCreateManyFarmInput = {
    id?: string;
    code: string;
    entryDate: Date | string;
    exitDate?: Date | string | null;
    status?: $Enums.FatteningLotStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type FatteningLotUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    entryDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exitDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFieldUpdateOperationsInput | $Enums.FatteningLotStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    memberships?: Prisma.LotMembershipUpdateManyWithoutLotNestedInput;
    weighings?: Prisma.WeighingUpdateManyWithoutLotNestedInput;
};
export type FatteningLotUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    entryDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exitDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFieldUpdateOperationsInput | $Enums.FatteningLotStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    memberships?: Prisma.LotMembershipUncheckedUpdateManyWithoutLotNestedInput;
    weighings?: Prisma.WeighingUncheckedUpdateManyWithoutLotNestedInput;
};
export type FatteningLotUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    entryDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exitDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumFatteningLotStatusFieldUpdateOperationsInput | $Enums.FatteningLotStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FatteningLotCountOutputType = {
    memberships: number;
    weighings: number;
};
export type FatteningLotCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    memberships?: boolean | FatteningLotCountOutputTypeCountMembershipsArgs;
    weighings?: boolean | FatteningLotCountOutputTypeCountWeighingsArgs;
};
export type FatteningLotCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotCountOutputTypeSelect<ExtArgs> | null;
};
export type FatteningLotCountOutputTypeCountMembershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LotMembershipWhereInput;
};
export type FatteningLotCountOutputTypeCountWeighingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WeighingWhereInput;
};
export type FatteningLotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    code?: boolean;
    entryDate?: boolean;
    exitDate?: boolean;
    status?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    memberships?: boolean | Prisma.FatteningLot$membershipsArgs<ExtArgs>;
    weighings?: boolean | Prisma.FatteningLot$weighingsArgs<ExtArgs>;
    _count?: boolean | Prisma.FatteningLotCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fatteningLot"]>;
export type FatteningLotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    code?: boolean;
    entryDate?: boolean;
    exitDate?: boolean;
    status?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fatteningLot"]>;
export type FatteningLotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    code?: boolean;
    entryDate?: boolean;
    exitDate?: boolean;
    status?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fatteningLot"]>;
export type FatteningLotSelectScalar = {
    id?: boolean;
    farmId?: boolean;
    code?: boolean;
    entryDate?: boolean;
    exitDate?: boolean;
    status?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type FatteningLotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farmId" | "code" | "entryDate" | "exitDate" | "status" | "observation" | "createdAt" | "updatedAt", ExtArgs["result"]["fatteningLot"]>;
export type FatteningLotInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    memberships?: boolean | Prisma.FatteningLot$membershipsArgs<ExtArgs>;
    weighings?: boolean | Prisma.FatteningLot$weighingsArgs<ExtArgs>;
    _count?: boolean | Prisma.FatteningLotCountOutputTypeDefaultArgs<ExtArgs>;
};
export type FatteningLotIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
};
export type FatteningLotIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
};
export type $FatteningLotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FatteningLot";
    objects: {
        farm: Prisma.$FarmPayload<ExtArgs>;
        memberships: Prisma.$LotMembershipPayload<ExtArgs>[];
        weighings: Prisma.$WeighingPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farmId: string;
        code: string;
        entryDate: Date;
        exitDate: Date | null;
        status: $Enums.FatteningLotStatus;
        observation: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["fatteningLot"]>;
    composites: {};
};
export type FatteningLotGetPayload<S extends boolean | null | undefined | FatteningLotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload, S>;
export type FatteningLotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FatteningLotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FatteningLotCountAggregateInputType | true;
};
export interface FatteningLotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FatteningLot'];
        meta: {
            name: 'FatteningLot';
        };
    };
    findUnique<T extends FatteningLotFindUniqueArgs>(args: Prisma.SelectSubset<T, FatteningLotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FatteningLotClient<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends FatteningLotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FatteningLotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FatteningLotClient<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends FatteningLotFindFirstArgs>(args?: Prisma.SelectSubset<T, FatteningLotFindFirstArgs<ExtArgs>>): Prisma.Prisma__FatteningLotClient<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends FatteningLotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FatteningLotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FatteningLotClient<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends FatteningLotFindManyArgs>(args?: Prisma.SelectSubset<T, FatteningLotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends FatteningLotCreateArgs>(args: Prisma.SelectSubset<T, FatteningLotCreateArgs<ExtArgs>>): Prisma.Prisma__FatteningLotClient<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends FatteningLotCreateManyArgs>(args?: Prisma.SelectSubset<T, FatteningLotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends FatteningLotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FatteningLotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends FatteningLotDeleteArgs>(args: Prisma.SelectSubset<T, FatteningLotDeleteArgs<ExtArgs>>): Prisma.Prisma__FatteningLotClient<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends FatteningLotUpdateArgs>(args: Prisma.SelectSubset<T, FatteningLotUpdateArgs<ExtArgs>>): Prisma.Prisma__FatteningLotClient<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends FatteningLotDeleteManyArgs>(args?: Prisma.SelectSubset<T, FatteningLotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends FatteningLotUpdateManyArgs>(args: Prisma.SelectSubset<T, FatteningLotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends FatteningLotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FatteningLotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends FatteningLotUpsertArgs>(args: Prisma.SelectSubset<T, FatteningLotUpsertArgs<ExtArgs>>): Prisma.Prisma__FatteningLotClient<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends FatteningLotCountArgs>(args?: Prisma.Subset<T, FatteningLotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FatteningLotCountAggregateOutputType> : number>;
    aggregate<T extends FatteningLotAggregateArgs>(args: Prisma.Subset<T, FatteningLotAggregateArgs>): Prisma.PrismaPromise<GetFatteningLotAggregateType<T>>;
    groupBy<T extends FatteningLotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FatteningLotGroupByArgs['orderBy'];
    } : {
        orderBy?: FatteningLotGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FatteningLotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFatteningLotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: FatteningLotFieldRefs;
}
export interface Prisma__FatteningLotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farm<T extends Prisma.FarmDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FarmDefaultArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    memberships<T extends Prisma.FatteningLot$membershipsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FatteningLot$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    weighings<T extends Prisma.FatteningLot$weighingsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FatteningLot$weighingsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface FatteningLotFieldRefs {
    readonly id: Prisma.FieldRef<"FatteningLot", 'String'>;
    readonly farmId: Prisma.FieldRef<"FatteningLot", 'String'>;
    readonly code: Prisma.FieldRef<"FatteningLot", 'String'>;
    readonly entryDate: Prisma.FieldRef<"FatteningLot", 'DateTime'>;
    readonly exitDate: Prisma.FieldRef<"FatteningLot", 'DateTime'>;
    readonly status: Prisma.FieldRef<"FatteningLot", 'FatteningLotStatus'>;
    readonly observation: Prisma.FieldRef<"FatteningLot", 'String'>;
    readonly createdAt: Prisma.FieldRef<"FatteningLot", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"FatteningLot", 'DateTime'>;
}
export type FatteningLotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelect<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    include?: Prisma.FatteningLotInclude<ExtArgs> | null;
    where: Prisma.FatteningLotWhereUniqueInput;
};
export type FatteningLotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelect<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    include?: Prisma.FatteningLotInclude<ExtArgs> | null;
    where: Prisma.FatteningLotWhereUniqueInput;
};
export type FatteningLotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelect<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    include?: Prisma.FatteningLotInclude<ExtArgs> | null;
    where?: Prisma.FatteningLotWhereInput;
    orderBy?: Prisma.FatteningLotOrderByWithRelationInput | Prisma.FatteningLotOrderByWithRelationInput[];
    cursor?: Prisma.FatteningLotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FatteningLotScalarFieldEnum | Prisma.FatteningLotScalarFieldEnum[];
};
export type FatteningLotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelect<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    include?: Prisma.FatteningLotInclude<ExtArgs> | null;
    where?: Prisma.FatteningLotWhereInput;
    orderBy?: Prisma.FatteningLotOrderByWithRelationInput | Prisma.FatteningLotOrderByWithRelationInput[];
    cursor?: Prisma.FatteningLotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FatteningLotScalarFieldEnum | Prisma.FatteningLotScalarFieldEnum[];
};
export type FatteningLotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelect<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    include?: Prisma.FatteningLotInclude<ExtArgs> | null;
    where?: Prisma.FatteningLotWhereInput;
    orderBy?: Prisma.FatteningLotOrderByWithRelationInput | Prisma.FatteningLotOrderByWithRelationInput[];
    cursor?: Prisma.FatteningLotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FatteningLotScalarFieldEnum | Prisma.FatteningLotScalarFieldEnum[];
};
export type FatteningLotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelect<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    include?: Prisma.FatteningLotInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FatteningLotCreateInput, Prisma.FatteningLotUncheckedCreateInput>;
};
export type FatteningLotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.FatteningLotCreateManyInput | Prisma.FatteningLotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FatteningLotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    data: Prisma.FatteningLotCreateManyInput | Prisma.FatteningLotCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.FatteningLotIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type FatteningLotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelect<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    include?: Prisma.FatteningLotInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FatteningLotUpdateInput, Prisma.FatteningLotUncheckedUpdateInput>;
    where: Prisma.FatteningLotWhereUniqueInput;
};
export type FatteningLotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.FatteningLotUpdateManyMutationInput, Prisma.FatteningLotUncheckedUpdateManyInput>;
    where?: Prisma.FatteningLotWhereInput;
    limit?: number;
};
export type FatteningLotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FatteningLotUpdateManyMutationInput, Prisma.FatteningLotUncheckedUpdateManyInput>;
    where?: Prisma.FatteningLotWhereInput;
    limit?: number;
    include?: Prisma.FatteningLotIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type FatteningLotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelect<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    include?: Prisma.FatteningLotInclude<ExtArgs> | null;
    where: Prisma.FatteningLotWhereUniqueInput;
    create: Prisma.XOR<Prisma.FatteningLotCreateInput, Prisma.FatteningLotUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.FatteningLotUpdateInput, Prisma.FatteningLotUncheckedUpdateInput>;
};
export type FatteningLotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelect<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    include?: Prisma.FatteningLotInclude<ExtArgs> | null;
    where: Prisma.FatteningLotWhereUniqueInput;
};
export type FatteningLotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FatteningLotWhereInput;
    limit?: number;
};
export type FatteningLot$membershipsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelect<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    include?: Prisma.LotMembershipInclude<ExtArgs> | null;
    where?: Prisma.LotMembershipWhereInput;
    orderBy?: Prisma.LotMembershipOrderByWithRelationInput | Prisma.LotMembershipOrderByWithRelationInput[];
    cursor?: Prisma.LotMembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LotMembershipScalarFieldEnum | Prisma.LotMembershipScalarFieldEnum[];
};
export type FatteningLot$weighingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeighingSelect<ExtArgs> | null;
    omit?: Prisma.WeighingOmit<ExtArgs> | null;
    include?: Prisma.WeighingInclude<ExtArgs> | null;
    where?: Prisma.WeighingWhereInput;
    orderBy?: Prisma.WeighingOrderByWithRelationInput | Prisma.WeighingOrderByWithRelationInput[];
    cursor?: Prisma.WeighingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WeighingScalarFieldEnum | Prisma.WeighingScalarFieldEnum[];
};
export type FatteningLotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelect<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    include?: Prisma.FatteningLotInclude<ExtArgs> | null;
};
