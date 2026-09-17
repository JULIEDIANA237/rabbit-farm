import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CageModel = runtime.Types.Result.DefaultSelection<Prisma.$CagePayload>;
export type AggregateCage = {
    _count: CageCountAggregateOutputType | null;
    _avg: CageAvgAggregateOutputType | null;
    _sum: CageSumAggregateOutputType | null;
    _min: CageMinAggregateOutputType | null;
    _max: CageMaxAggregateOutputType | null;
};
export type CageAvgAggregateOutputType = {
    capacity: number | null;
};
export type CageSumAggregateOutputType = {
    capacity: number | null;
};
export type CageMinAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    sectionId: string | null;
    code: string | null;
    type: string | null;
    capacity: number | null;
    status: $Enums.CageStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CageMaxAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    sectionId: string | null;
    code: string | null;
    type: string | null;
    capacity: number | null;
    status: $Enums.CageStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CageCountAggregateOutputType = {
    id: number;
    farmId: number;
    sectionId: number;
    code: number;
    type: number;
    capacity: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CageAvgAggregateInputType = {
    capacity?: true;
};
export type CageSumAggregateInputType = {
    capacity?: true;
};
export type CageMinAggregateInputType = {
    id?: true;
    farmId?: true;
    sectionId?: true;
    code?: true;
    type?: true;
    capacity?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CageMaxAggregateInputType = {
    id?: true;
    farmId?: true;
    sectionId?: true;
    code?: true;
    type?: true;
    capacity?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CageCountAggregateInputType = {
    id?: true;
    farmId?: true;
    sectionId?: true;
    code?: true;
    type?: true;
    capacity?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CageWhereInput;
    orderBy?: Prisma.CageOrderByWithRelationInput | Prisma.CageOrderByWithRelationInput[];
    cursor?: Prisma.CageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CageCountAggregateInputType;
    _avg?: CageAvgAggregateInputType;
    _sum?: CageSumAggregateInputType;
    _min?: CageMinAggregateInputType;
    _max?: CageMaxAggregateInputType;
};
export type GetCageAggregateType<T extends CageAggregateArgs> = {
    [P in keyof T & keyof AggregateCage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCage[P]> : Prisma.GetScalarType<T[P], AggregateCage[P]>;
};
export type CageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CageWhereInput;
    orderBy?: Prisma.CageOrderByWithAggregationInput | Prisma.CageOrderByWithAggregationInput[];
    by: Prisma.CageScalarFieldEnum[] | Prisma.CageScalarFieldEnum;
    having?: Prisma.CageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CageCountAggregateInputType | true;
    _avg?: CageAvgAggregateInputType;
    _sum?: CageSumAggregateInputType;
    _min?: CageMinAggregateInputType;
    _max?: CageMaxAggregateInputType;
};
export type CageGroupByOutputType = {
    id: string;
    farmId: string;
    sectionId: string;
    code: string;
    type: string | null;
    capacity: number;
    status: $Enums.CageStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: CageCountAggregateOutputType | null;
    _avg: CageAvgAggregateOutputType | null;
    _sum: CageSumAggregateOutputType | null;
    _min: CageMinAggregateOutputType | null;
    _max: CageMaxAggregateOutputType | null;
};
export type GetCageGroupByPayload<T extends CageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CageGroupByOutputType[P]>;
}>>;
export type CageWhereInput = {
    AND?: Prisma.CageWhereInput | Prisma.CageWhereInput[];
    OR?: Prisma.CageWhereInput[];
    NOT?: Prisma.CageWhereInput | Prisma.CageWhereInput[];
    id?: Prisma.StringFilter<"Cage"> | string;
    farmId?: Prisma.StringFilter<"Cage"> | string;
    sectionId?: Prisma.StringFilter<"Cage"> | string;
    code?: Prisma.StringFilter<"Cage"> | string;
    type?: Prisma.StringNullableFilter<"Cage"> | string | null;
    capacity?: Prisma.IntFilter<"Cage"> | number;
    status?: Prisma.EnumCageStatusFilter<"Cage"> | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFilter<"Cage"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Cage"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    section?: Prisma.XOR<Prisma.SectionScalarRelationFilter, Prisma.SectionWhereInput>;
    rabbitMovements?: Prisma.RabbitCageMovementListRelationFilter;
};
export type CageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    sectionId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrderInput | Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    farm?: Prisma.FarmOrderByWithRelationInput;
    section?: Prisma.SectionOrderByWithRelationInput;
    rabbitMovements?: Prisma.RabbitCageMovementOrderByRelationAggregateInput;
};
export type CageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    farmId_code?: Prisma.CageFarmIdCodeCompoundUniqueInput;
    AND?: Prisma.CageWhereInput | Prisma.CageWhereInput[];
    OR?: Prisma.CageWhereInput[];
    NOT?: Prisma.CageWhereInput | Prisma.CageWhereInput[];
    farmId?: Prisma.StringFilter<"Cage"> | string;
    sectionId?: Prisma.StringFilter<"Cage"> | string;
    code?: Prisma.StringFilter<"Cage"> | string;
    type?: Prisma.StringNullableFilter<"Cage"> | string | null;
    capacity?: Prisma.IntFilter<"Cage"> | number;
    status?: Prisma.EnumCageStatusFilter<"Cage"> | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFilter<"Cage"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Cage"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    section?: Prisma.XOR<Prisma.SectionScalarRelationFilter, Prisma.SectionWhereInput>;
    rabbitMovements?: Prisma.RabbitCageMovementListRelationFilter;
}, "id" | "farmId_code">;
export type CageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    sectionId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrderInput | Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CageCountOrderByAggregateInput;
    _avg?: Prisma.CageAvgOrderByAggregateInput;
    _max?: Prisma.CageMaxOrderByAggregateInput;
    _min?: Prisma.CageMinOrderByAggregateInput;
    _sum?: Prisma.CageSumOrderByAggregateInput;
};
export type CageScalarWhereWithAggregatesInput = {
    AND?: Prisma.CageScalarWhereWithAggregatesInput | Prisma.CageScalarWhereWithAggregatesInput[];
    OR?: Prisma.CageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CageScalarWhereWithAggregatesInput | Prisma.CageScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Cage"> | string;
    farmId?: Prisma.StringWithAggregatesFilter<"Cage"> | string;
    sectionId?: Prisma.StringWithAggregatesFilter<"Cage"> | string;
    code?: Prisma.StringWithAggregatesFilter<"Cage"> | string;
    type?: Prisma.StringNullableWithAggregatesFilter<"Cage"> | string | null;
    capacity?: Prisma.IntWithAggregatesFilter<"Cage"> | number;
    status?: Prisma.EnumCageStatusWithAggregatesFilter<"Cage"> | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Cage"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Cage"> | Date | string;
};
export type CageCreateInput = {
    id?: string;
    code: string;
    type?: string | null;
    capacity: number;
    status?: $Enums.CageStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutCagesInput;
    section: Prisma.SectionCreateNestedOneWithoutCagesInput;
    rabbitMovements?: Prisma.RabbitCageMovementCreateNestedManyWithoutCageInput;
};
export type CageUncheckedCreateInput = {
    id?: string;
    farmId: string;
    sectionId: string;
    code: string;
    type?: string | null;
    capacity: number;
    status?: $Enums.CageStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbitMovements?: Prisma.RabbitCageMovementUncheckedCreateNestedManyWithoutCageInput;
};
export type CageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutCagesNestedInput;
    section?: Prisma.SectionUpdateOneRequiredWithoutCagesNestedInput;
    rabbitMovements?: Prisma.RabbitCageMovementUpdateManyWithoutCageNestedInput;
};
export type CageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    sectionId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbitMovements?: Prisma.RabbitCageMovementUncheckedUpdateManyWithoutCageNestedInput;
};
export type CageCreateManyInput = {
    id?: string;
    farmId: string;
    sectionId: string;
    code: string;
    type?: string | null;
    capacity: number;
    status?: $Enums.CageStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    sectionId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CageListRelationFilter = {
    every?: Prisma.CageWhereInput;
    some?: Prisma.CageWhereInput;
    none?: Prisma.CageWhereInput;
};
export type CageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CageFarmIdCodeCompoundUniqueInput = {
    farmId: string;
    code: string;
};
export type CageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    sectionId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CageAvgOrderByAggregateInput = {
    capacity?: Prisma.SortOrder;
};
export type CageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    sectionId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    sectionId?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    capacity?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CageSumOrderByAggregateInput = {
    capacity?: Prisma.SortOrder;
};
export type CageScalarRelationFilter = {
    is?: Prisma.CageWhereInput;
    isNot?: Prisma.CageWhereInput;
};
export type CageCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.CageCreateWithoutFarmInput, Prisma.CageUncheckedCreateWithoutFarmInput> | Prisma.CageCreateWithoutFarmInput[] | Prisma.CageUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.CageCreateOrConnectWithoutFarmInput | Prisma.CageCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.CageCreateManyFarmInputEnvelope;
    connect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
};
export type CageUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.CageCreateWithoutFarmInput, Prisma.CageUncheckedCreateWithoutFarmInput> | Prisma.CageCreateWithoutFarmInput[] | Prisma.CageUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.CageCreateOrConnectWithoutFarmInput | Prisma.CageCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.CageCreateManyFarmInputEnvelope;
    connect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
};
export type CageUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.CageCreateWithoutFarmInput, Prisma.CageUncheckedCreateWithoutFarmInput> | Prisma.CageCreateWithoutFarmInput[] | Prisma.CageUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.CageCreateOrConnectWithoutFarmInput | Prisma.CageCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.CageUpsertWithWhereUniqueWithoutFarmInput | Prisma.CageUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.CageCreateManyFarmInputEnvelope;
    set?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    disconnect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    delete?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    connect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    update?: Prisma.CageUpdateWithWhereUniqueWithoutFarmInput | Prisma.CageUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.CageUpdateManyWithWhereWithoutFarmInput | Prisma.CageUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.CageScalarWhereInput | Prisma.CageScalarWhereInput[];
};
export type CageUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.CageCreateWithoutFarmInput, Prisma.CageUncheckedCreateWithoutFarmInput> | Prisma.CageCreateWithoutFarmInput[] | Prisma.CageUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.CageCreateOrConnectWithoutFarmInput | Prisma.CageCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.CageUpsertWithWhereUniqueWithoutFarmInput | Prisma.CageUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.CageCreateManyFarmInputEnvelope;
    set?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    disconnect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    delete?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    connect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    update?: Prisma.CageUpdateWithWhereUniqueWithoutFarmInput | Prisma.CageUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.CageUpdateManyWithWhereWithoutFarmInput | Prisma.CageUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.CageScalarWhereInput | Prisma.CageScalarWhereInput[];
};
export type CageCreateNestedManyWithoutSectionInput = {
    create?: Prisma.XOR<Prisma.CageCreateWithoutSectionInput, Prisma.CageUncheckedCreateWithoutSectionInput> | Prisma.CageCreateWithoutSectionInput[] | Prisma.CageUncheckedCreateWithoutSectionInput[];
    connectOrCreate?: Prisma.CageCreateOrConnectWithoutSectionInput | Prisma.CageCreateOrConnectWithoutSectionInput[];
    createMany?: Prisma.CageCreateManySectionInputEnvelope;
    connect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
};
export type CageUncheckedCreateNestedManyWithoutSectionInput = {
    create?: Prisma.XOR<Prisma.CageCreateWithoutSectionInput, Prisma.CageUncheckedCreateWithoutSectionInput> | Prisma.CageCreateWithoutSectionInput[] | Prisma.CageUncheckedCreateWithoutSectionInput[];
    connectOrCreate?: Prisma.CageCreateOrConnectWithoutSectionInput | Prisma.CageCreateOrConnectWithoutSectionInput[];
    createMany?: Prisma.CageCreateManySectionInputEnvelope;
    connect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
};
export type CageUpdateManyWithoutSectionNestedInput = {
    create?: Prisma.XOR<Prisma.CageCreateWithoutSectionInput, Prisma.CageUncheckedCreateWithoutSectionInput> | Prisma.CageCreateWithoutSectionInput[] | Prisma.CageUncheckedCreateWithoutSectionInput[];
    connectOrCreate?: Prisma.CageCreateOrConnectWithoutSectionInput | Prisma.CageCreateOrConnectWithoutSectionInput[];
    upsert?: Prisma.CageUpsertWithWhereUniqueWithoutSectionInput | Prisma.CageUpsertWithWhereUniqueWithoutSectionInput[];
    createMany?: Prisma.CageCreateManySectionInputEnvelope;
    set?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    disconnect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    delete?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    connect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    update?: Prisma.CageUpdateWithWhereUniqueWithoutSectionInput | Prisma.CageUpdateWithWhereUniqueWithoutSectionInput[];
    updateMany?: Prisma.CageUpdateManyWithWhereWithoutSectionInput | Prisma.CageUpdateManyWithWhereWithoutSectionInput[];
    deleteMany?: Prisma.CageScalarWhereInput | Prisma.CageScalarWhereInput[];
};
export type CageUncheckedUpdateManyWithoutSectionNestedInput = {
    create?: Prisma.XOR<Prisma.CageCreateWithoutSectionInput, Prisma.CageUncheckedCreateWithoutSectionInput> | Prisma.CageCreateWithoutSectionInput[] | Prisma.CageUncheckedCreateWithoutSectionInput[];
    connectOrCreate?: Prisma.CageCreateOrConnectWithoutSectionInput | Prisma.CageCreateOrConnectWithoutSectionInput[];
    upsert?: Prisma.CageUpsertWithWhereUniqueWithoutSectionInput | Prisma.CageUpsertWithWhereUniqueWithoutSectionInput[];
    createMany?: Prisma.CageCreateManySectionInputEnvelope;
    set?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    disconnect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    delete?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    connect?: Prisma.CageWhereUniqueInput | Prisma.CageWhereUniqueInput[];
    update?: Prisma.CageUpdateWithWhereUniqueWithoutSectionInput | Prisma.CageUpdateWithWhereUniqueWithoutSectionInput[];
    updateMany?: Prisma.CageUpdateManyWithWhereWithoutSectionInput | Prisma.CageUpdateManyWithWhereWithoutSectionInput[];
    deleteMany?: Prisma.CageScalarWhereInput | Prisma.CageScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EnumCageStatusFieldUpdateOperationsInput = {
    set?: $Enums.CageStatus;
};
export type CageCreateNestedOneWithoutRabbitMovementsInput = {
    create?: Prisma.XOR<Prisma.CageCreateWithoutRabbitMovementsInput, Prisma.CageUncheckedCreateWithoutRabbitMovementsInput>;
    connectOrCreate?: Prisma.CageCreateOrConnectWithoutRabbitMovementsInput;
    connect?: Prisma.CageWhereUniqueInput;
};
export type CageUpdateOneRequiredWithoutRabbitMovementsNestedInput = {
    create?: Prisma.XOR<Prisma.CageCreateWithoutRabbitMovementsInput, Prisma.CageUncheckedCreateWithoutRabbitMovementsInput>;
    connectOrCreate?: Prisma.CageCreateOrConnectWithoutRabbitMovementsInput;
    upsert?: Prisma.CageUpsertWithoutRabbitMovementsInput;
    connect?: Prisma.CageWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CageUpdateToOneWithWhereWithoutRabbitMovementsInput, Prisma.CageUpdateWithoutRabbitMovementsInput>, Prisma.CageUncheckedUpdateWithoutRabbitMovementsInput>;
};
export type CageCreateWithoutFarmInput = {
    id?: string;
    code: string;
    type?: string | null;
    capacity: number;
    status?: $Enums.CageStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    section: Prisma.SectionCreateNestedOneWithoutCagesInput;
    rabbitMovements?: Prisma.RabbitCageMovementCreateNestedManyWithoutCageInput;
};
export type CageUncheckedCreateWithoutFarmInput = {
    id?: string;
    sectionId: string;
    code: string;
    type?: string | null;
    capacity: number;
    status?: $Enums.CageStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbitMovements?: Prisma.RabbitCageMovementUncheckedCreateNestedManyWithoutCageInput;
};
export type CageCreateOrConnectWithoutFarmInput = {
    where: Prisma.CageWhereUniqueInput;
    create: Prisma.XOR<Prisma.CageCreateWithoutFarmInput, Prisma.CageUncheckedCreateWithoutFarmInput>;
};
export type CageCreateManyFarmInputEnvelope = {
    data: Prisma.CageCreateManyFarmInput | Prisma.CageCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type CageUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.CageWhereUniqueInput;
    update: Prisma.XOR<Prisma.CageUpdateWithoutFarmInput, Prisma.CageUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.CageCreateWithoutFarmInput, Prisma.CageUncheckedCreateWithoutFarmInput>;
};
export type CageUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.CageWhereUniqueInput;
    data: Prisma.XOR<Prisma.CageUpdateWithoutFarmInput, Prisma.CageUncheckedUpdateWithoutFarmInput>;
};
export type CageUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.CageScalarWhereInput;
    data: Prisma.XOR<Prisma.CageUpdateManyMutationInput, Prisma.CageUncheckedUpdateManyWithoutFarmInput>;
};
export type CageScalarWhereInput = {
    AND?: Prisma.CageScalarWhereInput | Prisma.CageScalarWhereInput[];
    OR?: Prisma.CageScalarWhereInput[];
    NOT?: Prisma.CageScalarWhereInput | Prisma.CageScalarWhereInput[];
    id?: Prisma.StringFilter<"Cage"> | string;
    farmId?: Prisma.StringFilter<"Cage"> | string;
    sectionId?: Prisma.StringFilter<"Cage"> | string;
    code?: Prisma.StringFilter<"Cage"> | string;
    type?: Prisma.StringNullableFilter<"Cage"> | string | null;
    capacity?: Prisma.IntFilter<"Cage"> | number;
    status?: Prisma.EnumCageStatusFilter<"Cage"> | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFilter<"Cage"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Cage"> | Date | string;
};
export type CageCreateWithoutSectionInput = {
    id?: string;
    code: string;
    type?: string | null;
    capacity: number;
    status?: $Enums.CageStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutCagesInput;
    rabbitMovements?: Prisma.RabbitCageMovementCreateNestedManyWithoutCageInput;
};
export type CageUncheckedCreateWithoutSectionInput = {
    id?: string;
    farmId: string;
    code: string;
    type?: string | null;
    capacity: number;
    status?: $Enums.CageStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbitMovements?: Prisma.RabbitCageMovementUncheckedCreateNestedManyWithoutCageInput;
};
export type CageCreateOrConnectWithoutSectionInput = {
    where: Prisma.CageWhereUniqueInput;
    create: Prisma.XOR<Prisma.CageCreateWithoutSectionInput, Prisma.CageUncheckedCreateWithoutSectionInput>;
};
export type CageCreateManySectionInputEnvelope = {
    data: Prisma.CageCreateManySectionInput | Prisma.CageCreateManySectionInput[];
    skipDuplicates?: boolean;
};
export type CageUpsertWithWhereUniqueWithoutSectionInput = {
    where: Prisma.CageWhereUniqueInput;
    update: Prisma.XOR<Prisma.CageUpdateWithoutSectionInput, Prisma.CageUncheckedUpdateWithoutSectionInput>;
    create: Prisma.XOR<Prisma.CageCreateWithoutSectionInput, Prisma.CageUncheckedCreateWithoutSectionInput>;
};
export type CageUpdateWithWhereUniqueWithoutSectionInput = {
    where: Prisma.CageWhereUniqueInput;
    data: Prisma.XOR<Prisma.CageUpdateWithoutSectionInput, Prisma.CageUncheckedUpdateWithoutSectionInput>;
};
export type CageUpdateManyWithWhereWithoutSectionInput = {
    where: Prisma.CageScalarWhereInput;
    data: Prisma.XOR<Prisma.CageUpdateManyMutationInput, Prisma.CageUncheckedUpdateManyWithoutSectionInput>;
};
export type CageCreateWithoutRabbitMovementsInput = {
    id?: string;
    code: string;
    type?: string | null;
    capacity: number;
    status?: $Enums.CageStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutCagesInput;
    section: Prisma.SectionCreateNestedOneWithoutCagesInput;
};
export type CageUncheckedCreateWithoutRabbitMovementsInput = {
    id?: string;
    farmId: string;
    sectionId: string;
    code: string;
    type?: string | null;
    capacity: number;
    status?: $Enums.CageStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CageCreateOrConnectWithoutRabbitMovementsInput = {
    where: Prisma.CageWhereUniqueInput;
    create: Prisma.XOR<Prisma.CageCreateWithoutRabbitMovementsInput, Prisma.CageUncheckedCreateWithoutRabbitMovementsInput>;
};
export type CageUpsertWithoutRabbitMovementsInput = {
    update: Prisma.XOR<Prisma.CageUpdateWithoutRabbitMovementsInput, Prisma.CageUncheckedUpdateWithoutRabbitMovementsInput>;
    create: Prisma.XOR<Prisma.CageCreateWithoutRabbitMovementsInput, Prisma.CageUncheckedCreateWithoutRabbitMovementsInput>;
    where?: Prisma.CageWhereInput;
};
export type CageUpdateToOneWithWhereWithoutRabbitMovementsInput = {
    where?: Prisma.CageWhereInput;
    data: Prisma.XOR<Prisma.CageUpdateWithoutRabbitMovementsInput, Prisma.CageUncheckedUpdateWithoutRabbitMovementsInput>;
};
export type CageUpdateWithoutRabbitMovementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutCagesNestedInput;
    section?: Prisma.SectionUpdateOneRequiredWithoutCagesNestedInput;
};
export type CageUncheckedUpdateWithoutRabbitMovementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    sectionId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CageCreateManyFarmInput = {
    id?: string;
    sectionId: string;
    code: string;
    type?: string | null;
    capacity: number;
    status?: $Enums.CageStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CageUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    section?: Prisma.SectionUpdateOneRequiredWithoutCagesNestedInput;
    rabbitMovements?: Prisma.RabbitCageMovementUpdateManyWithoutCageNestedInput;
};
export type CageUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sectionId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbitMovements?: Prisma.RabbitCageMovementUncheckedUpdateManyWithoutCageNestedInput;
};
export type CageUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sectionId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CageCreateManySectionInput = {
    id?: string;
    farmId: string;
    code: string;
    type?: string | null;
    capacity: number;
    status?: $Enums.CageStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CageUpdateWithoutSectionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutCagesNestedInput;
    rabbitMovements?: Prisma.RabbitCageMovementUpdateManyWithoutCageNestedInput;
};
export type CageUncheckedUpdateWithoutSectionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbitMovements?: Prisma.RabbitCageMovementUncheckedUpdateManyWithoutCageNestedInput;
};
export type CageUncheckedUpdateManyWithoutSectionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capacity?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCageStatusFieldUpdateOperationsInput | $Enums.CageStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CageCountOutputType = {
    rabbitMovements: number;
};
export type CageCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbitMovements?: boolean | CageCountOutputTypeCountRabbitMovementsArgs;
};
export type CageCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageCountOutputTypeSelect<ExtArgs> | null;
};
export type CageCountOutputTypeCountRabbitMovementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RabbitCageMovementWhereInput;
};
export type CageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    sectionId?: boolean;
    code?: boolean;
    type?: boolean;
    capacity?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    section?: boolean | Prisma.SectionDefaultArgs<ExtArgs>;
    rabbitMovements?: boolean | Prisma.Cage$rabbitMovementsArgs<ExtArgs>;
    _count?: boolean | Prisma.CageCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cage"]>;
export type CageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    sectionId?: boolean;
    code?: boolean;
    type?: boolean;
    capacity?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    section?: boolean | Prisma.SectionDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cage"]>;
export type CageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    sectionId?: boolean;
    code?: boolean;
    type?: boolean;
    capacity?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    section?: boolean | Prisma.SectionDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cage"]>;
export type CageSelectScalar = {
    id?: boolean;
    farmId?: boolean;
    sectionId?: boolean;
    code?: boolean;
    type?: boolean;
    capacity?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farmId" | "sectionId" | "code" | "type" | "capacity" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["cage"]>;
export type CageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    section?: boolean | Prisma.SectionDefaultArgs<ExtArgs>;
    rabbitMovements?: boolean | Prisma.Cage$rabbitMovementsArgs<ExtArgs>;
    _count?: boolean | Prisma.CageCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    section?: boolean | Prisma.SectionDefaultArgs<ExtArgs>;
};
export type CageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    section?: boolean | Prisma.SectionDefaultArgs<ExtArgs>;
};
export type $CagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Cage";
    objects: {
        farm: Prisma.$FarmPayload<ExtArgs>;
        section: Prisma.$SectionPayload<ExtArgs>;
        rabbitMovements: Prisma.$RabbitCageMovementPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farmId: string;
        sectionId: string;
        code: string;
        type: string | null;
        capacity: number;
        status: $Enums.CageStatus;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["cage"]>;
    composites: {};
};
export type CageGetPayload<S extends boolean | null | undefined | CageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CagePayload, S>;
export type CageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CageCountAggregateInputType | true;
};
export interface CageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Cage'];
        meta: {
            name: 'Cage';
        };
    };
    findUnique<T extends CageFindUniqueArgs>(args: Prisma.SelectSubset<T, CageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CageClient<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CageClient<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CageFindFirstArgs>(args?: Prisma.SelectSubset<T, CageFindFirstArgs<ExtArgs>>): Prisma.Prisma__CageClient<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CageClient<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CageFindManyArgs>(args?: Prisma.SelectSubset<T, CageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CageCreateArgs>(args: Prisma.SelectSubset<T, CageCreateArgs<ExtArgs>>): Prisma.Prisma__CageClient<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CageCreateManyArgs>(args?: Prisma.SelectSubset<T, CageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CageDeleteArgs>(args: Prisma.SelectSubset<T, CageDeleteArgs<ExtArgs>>): Prisma.Prisma__CageClient<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CageUpdateArgs>(args: Prisma.SelectSubset<T, CageUpdateArgs<ExtArgs>>): Prisma.Prisma__CageClient<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CageDeleteManyArgs>(args?: Prisma.SelectSubset<T, CageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CageUpdateManyArgs>(args: Prisma.SelectSubset<T, CageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CageUpsertArgs>(args: Prisma.SelectSubset<T, CageUpsertArgs<ExtArgs>>): Prisma.Prisma__CageClient<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CageCountArgs>(args?: Prisma.Subset<T, CageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CageCountAggregateOutputType> : number>;
    aggregate<T extends CageAggregateArgs>(args: Prisma.Subset<T, CageAggregateArgs>): Prisma.PrismaPromise<GetCageAggregateType<T>>;
    groupBy<T extends CageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CageGroupByArgs['orderBy'];
    } : {
        orderBy?: CageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CageFieldRefs;
}
export interface Prisma__CageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farm<T extends Prisma.FarmDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FarmDefaultArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    section<T extends Prisma.SectionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SectionDefaultArgs<ExtArgs>>): Prisma.Prisma__SectionClient<runtime.Types.Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    rabbitMovements<T extends Prisma.Cage$rabbitMovementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Cage$rabbitMovementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CageFieldRefs {
    readonly id: Prisma.FieldRef<"Cage", 'String'>;
    readonly farmId: Prisma.FieldRef<"Cage", 'String'>;
    readonly sectionId: Prisma.FieldRef<"Cage", 'String'>;
    readonly code: Prisma.FieldRef<"Cage", 'String'>;
    readonly type: Prisma.FieldRef<"Cage", 'String'>;
    readonly capacity: Prisma.FieldRef<"Cage", 'Int'>;
    readonly status: Prisma.FieldRef<"Cage", 'CageStatus'>;
    readonly createdAt: Prisma.FieldRef<"Cage", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Cage", 'DateTime'>;
}
export type CageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelect<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    include?: Prisma.CageInclude<ExtArgs> | null;
    where: Prisma.CageWhereUniqueInput;
};
export type CageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelect<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    include?: Prisma.CageInclude<ExtArgs> | null;
    where: Prisma.CageWhereUniqueInput;
};
export type CageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelect<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    include?: Prisma.CageInclude<ExtArgs> | null;
    where?: Prisma.CageWhereInput;
    orderBy?: Prisma.CageOrderByWithRelationInput | Prisma.CageOrderByWithRelationInput[];
    cursor?: Prisma.CageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CageScalarFieldEnum | Prisma.CageScalarFieldEnum[];
};
export type CageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelect<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    include?: Prisma.CageInclude<ExtArgs> | null;
    where?: Prisma.CageWhereInput;
    orderBy?: Prisma.CageOrderByWithRelationInput | Prisma.CageOrderByWithRelationInput[];
    cursor?: Prisma.CageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CageScalarFieldEnum | Prisma.CageScalarFieldEnum[];
};
export type CageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelect<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    include?: Prisma.CageInclude<ExtArgs> | null;
    where?: Prisma.CageWhereInput;
    orderBy?: Prisma.CageOrderByWithRelationInput | Prisma.CageOrderByWithRelationInput[];
    cursor?: Prisma.CageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CageScalarFieldEnum | Prisma.CageScalarFieldEnum[];
};
export type CageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelect<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    include?: Prisma.CageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CageCreateInput, Prisma.CageUncheckedCreateInput>;
};
export type CageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CageCreateManyInput | Prisma.CageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    data: Prisma.CageCreateManyInput | Prisma.CageCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CageIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelect<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    include?: Prisma.CageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CageUpdateInput, Prisma.CageUncheckedUpdateInput>;
    where: Prisma.CageWhereUniqueInput;
};
export type CageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CageUpdateManyMutationInput, Prisma.CageUncheckedUpdateManyInput>;
    where?: Prisma.CageWhereInput;
    limit?: number;
};
export type CageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CageUpdateManyMutationInput, Prisma.CageUncheckedUpdateManyInput>;
    where?: Prisma.CageWhereInput;
    limit?: number;
    include?: Prisma.CageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelect<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    include?: Prisma.CageInclude<ExtArgs> | null;
    where: Prisma.CageWhereUniqueInput;
    create: Prisma.XOR<Prisma.CageCreateInput, Prisma.CageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CageUpdateInput, Prisma.CageUncheckedUpdateInput>;
};
export type CageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelect<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    include?: Prisma.CageInclude<ExtArgs> | null;
    where: Prisma.CageWhereUniqueInput;
};
export type CageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CageWhereInput;
    limit?: number;
};
export type Cage$rabbitMovementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitCageMovementSelect<ExtArgs> | null;
    omit?: Prisma.RabbitCageMovementOmit<ExtArgs> | null;
    include?: Prisma.RabbitCageMovementInclude<ExtArgs> | null;
    where?: Prisma.RabbitCageMovementWhereInput;
    orderBy?: Prisma.RabbitCageMovementOrderByWithRelationInput | Prisma.RabbitCageMovementOrderByWithRelationInput[];
    cursor?: Prisma.RabbitCageMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RabbitCageMovementScalarFieldEnum | Prisma.RabbitCageMovementScalarFieldEnum[];
};
export type CageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CageSelect<ExtArgs> | null;
    omit?: Prisma.CageOmit<ExtArgs> | null;
    include?: Prisma.CageInclude<ExtArgs> | null;
};
