import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PregnancyModel = runtime.Types.Result.DefaultSelection<Prisma.$PregnancyPayload>;
export type AggregatePregnancy = {
    _count: PregnancyCountAggregateOutputType | null;
    _min: PregnancyMinAggregateOutputType | null;
    _max: PregnancyMaxAggregateOutputType | null;
};
export type PregnancyMinAggregateOutputType = {
    id: string | null;
    breedingId: string | null;
    checkDate: Date | null;
    result: $Enums.PregnancyResult | null;
    observation: string | null;
    createdAt: Date | null;
    farmId: string | null;
};
export type PregnancyMaxAggregateOutputType = {
    id: string | null;
    breedingId: string | null;
    checkDate: Date | null;
    result: $Enums.PregnancyResult | null;
    observation: string | null;
    createdAt: Date | null;
    farmId: string | null;
};
export type PregnancyCountAggregateOutputType = {
    id: number;
    breedingId: number;
    checkDate: number;
    result: number;
    observation: number;
    createdAt: number;
    farmId: number;
    _all: number;
};
export type PregnancyMinAggregateInputType = {
    id?: true;
    breedingId?: true;
    checkDate?: true;
    result?: true;
    observation?: true;
    createdAt?: true;
    farmId?: true;
};
export type PregnancyMaxAggregateInputType = {
    id?: true;
    breedingId?: true;
    checkDate?: true;
    result?: true;
    observation?: true;
    createdAt?: true;
    farmId?: true;
};
export type PregnancyCountAggregateInputType = {
    id?: true;
    breedingId?: true;
    checkDate?: true;
    result?: true;
    observation?: true;
    createdAt?: true;
    farmId?: true;
    _all?: true;
};
export type PregnancyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PregnancyWhereInput;
    orderBy?: Prisma.PregnancyOrderByWithRelationInput | Prisma.PregnancyOrderByWithRelationInput[];
    cursor?: Prisma.PregnancyWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PregnancyCountAggregateInputType;
    _min?: PregnancyMinAggregateInputType;
    _max?: PregnancyMaxAggregateInputType;
};
export type GetPregnancyAggregateType<T extends PregnancyAggregateArgs> = {
    [P in keyof T & keyof AggregatePregnancy]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePregnancy[P]> : Prisma.GetScalarType<T[P], AggregatePregnancy[P]>;
};
export type PregnancyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PregnancyWhereInput;
    orderBy?: Prisma.PregnancyOrderByWithAggregationInput | Prisma.PregnancyOrderByWithAggregationInput[];
    by: Prisma.PregnancyScalarFieldEnum[] | Prisma.PregnancyScalarFieldEnum;
    having?: Prisma.PregnancyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PregnancyCountAggregateInputType | true;
    _min?: PregnancyMinAggregateInputType;
    _max?: PregnancyMaxAggregateInputType;
};
export type PregnancyGroupByOutputType = {
    id: string;
    breedingId: string;
    checkDate: Date;
    result: $Enums.PregnancyResult;
    observation: string | null;
    createdAt: Date;
    farmId: string | null;
    _count: PregnancyCountAggregateOutputType | null;
    _min: PregnancyMinAggregateOutputType | null;
    _max: PregnancyMaxAggregateOutputType | null;
};
export type GetPregnancyGroupByPayload<T extends PregnancyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PregnancyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PregnancyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PregnancyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PregnancyGroupByOutputType[P]>;
}>>;
export type PregnancyWhereInput = {
    AND?: Prisma.PregnancyWhereInput | Prisma.PregnancyWhereInput[];
    OR?: Prisma.PregnancyWhereInput[];
    NOT?: Prisma.PregnancyWhereInput | Prisma.PregnancyWhereInput[];
    id?: Prisma.StringFilter<"Pregnancy"> | string;
    breedingId?: Prisma.StringFilter<"Pregnancy"> | string;
    checkDate?: Prisma.DateTimeFilter<"Pregnancy"> | Date | string;
    result?: Prisma.EnumPregnancyResultFilter<"Pregnancy"> | $Enums.PregnancyResult;
    observation?: Prisma.StringNullableFilter<"Pregnancy"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Pregnancy"> | Date | string;
    farmId?: Prisma.StringNullableFilter<"Pregnancy"> | string | null;
    breeding?: Prisma.XOR<Prisma.BreedingScalarRelationFilter, Prisma.BreedingWhereInput>;
    farm?: Prisma.XOR<Prisma.FarmNullableScalarRelationFilter, Prisma.FarmWhereInput> | null;
};
export type PregnancyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    breedingId?: Prisma.SortOrder;
    checkDate?: Prisma.SortOrder;
    result?: Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    farmId?: Prisma.SortOrderInput | Prisma.SortOrder;
    breeding?: Prisma.BreedingOrderByWithRelationInput;
    farm?: Prisma.FarmOrderByWithRelationInput;
};
export type PregnancyWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    breedingId?: string;
    AND?: Prisma.PregnancyWhereInput | Prisma.PregnancyWhereInput[];
    OR?: Prisma.PregnancyWhereInput[];
    NOT?: Prisma.PregnancyWhereInput | Prisma.PregnancyWhereInput[];
    checkDate?: Prisma.DateTimeFilter<"Pregnancy"> | Date | string;
    result?: Prisma.EnumPregnancyResultFilter<"Pregnancy"> | $Enums.PregnancyResult;
    observation?: Prisma.StringNullableFilter<"Pregnancy"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Pregnancy"> | Date | string;
    farmId?: Prisma.StringNullableFilter<"Pregnancy"> | string | null;
    breeding?: Prisma.XOR<Prisma.BreedingScalarRelationFilter, Prisma.BreedingWhereInput>;
    farm?: Prisma.XOR<Prisma.FarmNullableScalarRelationFilter, Prisma.FarmWhereInput> | null;
}, "id" | "breedingId">;
export type PregnancyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    breedingId?: Prisma.SortOrder;
    checkDate?: Prisma.SortOrder;
    result?: Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    farmId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.PregnancyCountOrderByAggregateInput;
    _max?: Prisma.PregnancyMaxOrderByAggregateInput;
    _min?: Prisma.PregnancyMinOrderByAggregateInput;
};
export type PregnancyScalarWhereWithAggregatesInput = {
    AND?: Prisma.PregnancyScalarWhereWithAggregatesInput | Prisma.PregnancyScalarWhereWithAggregatesInput[];
    OR?: Prisma.PregnancyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PregnancyScalarWhereWithAggregatesInput | Prisma.PregnancyScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Pregnancy"> | string;
    breedingId?: Prisma.StringWithAggregatesFilter<"Pregnancy"> | string;
    checkDate?: Prisma.DateTimeWithAggregatesFilter<"Pregnancy"> | Date | string;
    result?: Prisma.EnumPregnancyResultWithAggregatesFilter<"Pregnancy"> | $Enums.PregnancyResult;
    observation?: Prisma.StringNullableWithAggregatesFilter<"Pregnancy"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Pregnancy"> | Date | string;
    farmId?: Prisma.StringNullableWithAggregatesFilter<"Pregnancy"> | string | null;
};
export type PregnancyCreateInput = {
    id?: string;
    checkDate: Date | string;
    result: $Enums.PregnancyResult;
    observation?: string | null;
    createdAt?: Date | string;
    breeding: Prisma.BreedingCreateNestedOneWithoutPregnanciesInput;
    farm?: Prisma.FarmCreateNestedOneWithoutPregnanciesInput;
};
export type PregnancyUncheckedCreateInput = {
    id?: string;
    breedingId: string;
    checkDate: Date | string;
    result: $Enums.PregnancyResult;
    observation?: string | null;
    createdAt?: Date | string;
    farmId?: string | null;
};
export type PregnancyUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    checkDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    result?: Prisma.EnumPregnancyResultFieldUpdateOperationsInput | $Enums.PregnancyResult;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    breeding?: Prisma.BreedingUpdateOneRequiredWithoutPregnanciesNestedInput;
    farm?: Prisma.FarmUpdateOneWithoutPregnanciesNestedInput;
};
export type PregnancyUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    breedingId?: Prisma.StringFieldUpdateOperationsInput | string;
    checkDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    result?: Prisma.EnumPregnancyResultFieldUpdateOperationsInput | $Enums.PregnancyResult;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farmId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PregnancyCreateManyInput = {
    id?: string;
    breedingId: string;
    checkDate: Date | string;
    result: $Enums.PregnancyResult;
    observation?: string | null;
    createdAt?: Date | string;
    farmId?: string | null;
};
export type PregnancyUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    checkDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    result?: Prisma.EnumPregnancyResultFieldUpdateOperationsInput | $Enums.PregnancyResult;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PregnancyUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    breedingId?: Prisma.StringFieldUpdateOperationsInput | string;
    checkDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    result?: Prisma.EnumPregnancyResultFieldUpdateOperationsInput | $Enums.PregnancyResult;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farmId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PregnancyListRelationFilter = {
    every?: Prisma.PregnancyWhereInput;
    some?: Prisma.PregnancyWhereInput;
    none?: Prisma.PregnancyWhereInput;
};
export type PregnancyOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PregnancyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    breedingId?: Prisma.SortOrder;
    checkDate?: Prisma.SortOrder;
    result?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
};
export type PregnancyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    breedingId?: Prisma.SortOrder;
    checkDate?: Prisma.SortOrder;
    result?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
};
export type PregnancyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    breedingId?: Prisma.SortOrder;
    checkDate?: Prisma.SortOrder;
    result?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
};
export type PregnancyCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.PregnancyCreateWithoutFarmInput, Prisma.PregnancyUncheckedCreateWithoutFarmInput> | Prisma.PregnancyCreateWithoutFarmInput[] | Prisma.PregnancyUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.PregnancyCreateOrConnectWithoutFarmInput | Prisma.PregnancyCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.PregnancyCreateManyFarmInputEnvelope;
    connect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
};
export type PregnancyUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.PregnancyCreateWithoutFarmInput, Prisma.PregnancyUncheckedCreateWithoutFarmInput> | Prisma.PregnancyCreateWithoutFarmInput[] | Prisma.PregnancyUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.PregnancyCreateOrConnectWithoutFarmInput | Prisma.PregnancyCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.PregnancyCreateManyFarmInputEnvelope;
    connect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
};
export type PregnancyUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.PregnancyCreateWithoutFarmInput, Prisma.PregnancyUncheckedCreateWithoutFarmInput> | Prisma.PregnancyCreateWithoutFarmInput[] | Prisma.PregnancyUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.PregnancyCreateOrConnectWithoutFarmInput | Prisma.PregnancyCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.PregnancyUpsertWithWhereUniqueWithoutFarmInput | Prisma.PregnancyUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.PregnancyCreateManyFarmInputEnvelope;
    set?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    disconnect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    delete?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    connect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    update?: Prisma.PregnancyUpdateWithWhereUniqueWithoutFarmInput | Prisma.PregnancyUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.PregnancyUpdateManyWithWhereWithoutFarmInput | Prisma.PregnancyUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.PregnancyScalarWhereInput | Prisma.PregnancyScalarWhereInput[];
};
export type PregnancyUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.PregnancyCreateWithoutFarmInput, Prisma.PregnancyUncheckedCreateWithoutFarmInput> | Prisma.PregnancyCreateWithoutFarmInput[] | Prisma.PregnancyUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.PregnancyCreateOrConnectWithoutFarmInput | Prisma.PregnancyCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.PregnancyUpsertWithWhereUniqueWithoutFarmInput | Prisma.PregnancyUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.PregnancyCreateManyFarmInputEnvelope;
    set?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    disconnect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    delete?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    connect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    update?: Prisma.PregnancyUpdateWithWhereUniqueWithoutFarmInput | Prisma.PregnancyUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.PregnancyUpdateManyWithWhereWithoutFarmInput | Prisma.PregnancyUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.PregnancyScalarWhereInput | Prisma.PregnancyScalarWhereInput[];
};
export type PregnancyCreateNestedManyWithoutBreedingInput = {
    create?: Prisma.XOR<Prisma.PregnancyCreateWithoutBreedingInput, Prisma.PregnancyUncheckedCreateWithoutBreedingInput> | Prisma.PregnancyCreateWithoutBreedingInput[] | Prisma.PregnancyUncheckedCreateWithoutBreedingInput[];
    connectOrCreate?: Prisma.PregnancyCreateOrConnectWithoutBreedingInput | Prisma.PregnancyCreateOrConnectWithoutBreedingInput[];
    createMany?: Prisma.PregnancyCreateManyBreedingInputEnvelope;
    connect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
};
export type PregnancyUncheckedCreateNestedManyWithoutBreedingInput = {
    create?: Prisma.XOR<Prisma.PregnancyCreateWithoutBreedingInput, Prisma.PregnancyUncheckedCreateWithoutBreedingInput> | Prisma.PregnancyCreateWithoutBreedingInput[] | Prisma.PregnancyUncheckedCreateWithoutBreedingInput[];
    connectOrCreate?: Prisma.PregnancyCreateOrConnectWithoutBreedingInput | Prisma.PregnancyCreateOrConnectWithoutBreedingInput[];
    createMany?: Prisma.PregnancyCreateManyBreedingInputEnvelope;
    connect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
};
export type PregnancyUpdateManyWithoutBreedingNestedInput = {
    create?: Prisma.XOR<Prisma.PregnancyCreateWithoutBreedingInput, Prisma.PregnancyUncheckedCreateWithoutBreedingInput> | Prisma.PregnancyCreateWithoutBreedingInput[] | Prisma.PregnancyUncheckedCreateWithoutBreedingInput[];
    connectOrCreate?: Prisma.PregnancyCreateOrConnectWithoutBreedingInput | Prisma.PregnancyCreateOrConnectWithoutBreedingInput[];
    upsert?: Prisma.PregnancyUpsertWithWhereUniqueWithoutBreedingInput | Prisma.PregnancyUpsertWithWhereUniqueWithoutBreedingInput[];
    createMany?: Prisma.PregnancyCreateManyBreedingInputEnvelope;
    set?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    disconnect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    delete?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    connect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    update?: Prisma.PregnancyUpdateWithWhereUniqueWithoutBreedingInput | Prisma.PregnancyUpdateWithWhereUniqueWithoutBreedingInput[];
    updateMany?: Prisma.PregnancyUpdateManyWithWhereWithoutBreedingInput | Prisma.PregnancyUpdateManyWithWhereWithoutBreedingInput[];
    deleteMany?: Prisma.PregnancyScalarWhereInput | Prisma.PregnancyScalarWhereInput[];
};
export type PregnancyUncheckedUpdateManyWithoutBreedingNestedInput = {
    create?: Prisma.XOR<Prisma.PregnancyCreateWithoutBreedingInput, Prisma.PregnancyUncheckedCreateWithoutBreedingInput> | Prisma.PregnancyCreateWithoutBreedingInput[] | Prisma.PregnancyUncheckedCreateWithoutBreedingInput[];
    connectOrCreate?: Prisma.PregnancyCreateOrConnectWithoutBreedingInput | Prisma.PregnancyCreateOrConnectWithoutBreedingInput[];
    upsert?: Prisma.PregnancyUpsertWithWhereUniqueWithoutBreedingInput | Prisma.PregnancyUpsertWithWhereUniqueWithoutBreedingInput[];
    createMany?: Prisma.PregnancyCreateManyBreedingInputEnvelope;
    set?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    disconnect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    delete?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    connect?: Prisma.PregnancyWhereUniqueInput | Prisma.PregnancyWhereUniqueInput[];
    update?: Prisma.PregnancyUpdateWithWhereUniqueWithoutBreedingInput | Prisma.PregnancyUpdateWithWhereUniqueWithoutBreedingInput[];
    updateMany?: Prisma.PregnancyUpdateManyWithWhereWithoutBreedingInput | Prisma.PregnancyUpdateManyWithWhereWithoutBreedingInput[];
    deleteMany?: Prisma.PregnancyScalarWhereInput | Prisma.PregnancyScalarWhereInput[];
};
export type EnumPregnancyResultFieldUpdateOperationsInput = {
    set?: $Enums.PregnancyResult;
};
export type PregnancyCreateWithoutFarmInput = {
    id?: string;
    checkDate: Date | string;
    result: $Enums.PregnancyResult;
    observation?: string | null;
    createdAt?: Date | string;
    breeding: Prisma.BreedingCreateNestedOneWithoutPregnanciesInput;
};
export type PregnancyUncheckedCreateWithoutFarmInput = {
    id?: string;
    breedingId: string;
    checkDate: Date | string;
    result: $Enums.PregnancyResult;
    observation?: string | null;
    createdAt?: Date | string;
};
export type PregnancyCreateOrConnectWithoutFarmInput = {
    where: Prisma.PregnancyWhereUniqueInput;
    create: Prisma.XOR<Prisma.PregnancyCreateWithoutFarmInput, Prisma.PregnancyUncheckedCreateWithoutFarmInput>;
};
export type PregnancyCreateManyFarmInputEnvelope = {
    data: Prisma.PregnancyCreateManyFarmInput | Prisma.PregnancyCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type PregnancyUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.PregnancyWhereUniqueInput;
    update: Prisma.XOR<Prisma.PregnancyUpdateWithoutFarmInput, Prisma.PregnancyUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.PregnancyCreateWithoutFarmInput, Prisma.PregnancyUncheckedCreateWithoutFarmInput>;
};
export type PregnancyUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.PregnancyWhereUniqueInput;
    data: Prisma.XOR<Prisma.PregnancyUpdateWithoutFarmInput, Prisma.PregnancyUncheckedUpdateWithoutFarmInput>;
};
export type PregnancyUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.PregnancyScalarWhereInput;
    data: Prisma.XOR<Prisma.PregnancyUpdateManyMutationInput, Prisma.PregnancyUncheckedUpdateManyWithoutFarmInput>;
};
export type PregnancyScalarWhereInput = {
    AND?: Prisma.PregnancyScalarWhereInput | Prisma.PregnancyScalarWhereInput[];
    OR?: Prisma.PregnancyScalarWhereInput[];
    NOT?: Prisma.PregnancyScalarWhereInput | Prisma.PregnancyScalarWhereInput[];
    id?: Prisma.StringFilter<"Pregnancy"> | string;
    breedingId?: Prisma.StringFilter<"Pregnancy"> | string;
    checkDate?: Prisma.DateTimeFilter<"Pregnancy"> | Date | string;
    result?: Prisma.EnumPregnancyResultFilter<"Pregnancy"> | $Enums.PregnancyResult;
    observation?: Prisma.StringNullableFilter<"Pregnancy"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Pregnancy"> | Date | string;
    farmId?: Prisma.StringNullableFilter<"Pregnancy"> | string | null;
};
export type PregnancyCreateWithoutBreedingInput = {
    id?: string;
    checkDate: Date | string;
    result: $Enums.PregnancyResult;
    observation?: string | null;
    createdAt?: Date | string;
    farm?: Prisma.FarmCreateNestedOneWithoutPregnanciesInput;
};
export type PregnancyUncheckedCreateWithoutBreedingInput = {
    id?: string;
    checkDate: Date | string;
    result: $Enums.PregnancyResult;
    observation?: string | null;
    createdAt?: Date | string;
    farmId?: string | null;
};
export type PregnancyCreateOrConnectWithoutBreedingInput = {
    where: Prisma.PregnancyWhereUniqueInput;
    create: Prisma.XOR<Prisma.PregnancyCreateWithoutBreedingInput, Prisma.PregnancyUncheckedCreateWithoutBreedingInput>;
};
export type PregnancyCreateManyBreedingInputEnvelope = {
    data: Prisma.PregnancyCreateManyBreedingInput | Prisma.PregnancyCreateManyBreedingInput[];
    skipDuplicates?: boolean;
};
export type PregnancyUpsertWithWhereUniqueWithoutBreedingInput = {
    where: Prisma.PregnancyWhereUniqueInput;
    update: Prisma.XOR<Prisma.PregnancyUpdateWithoutBreedingInput, Prisma.PregnancyUncheckedUpdateWithoutBreedingInput>;
    create: Prisma.XOR<Prisma.PregnancyCreateWithoutBreedingInput, Prisma.PregnancyUncheckedCreateWithoutBreedingInput>;
};
export type PregnancyUpdateWithWhereUniqueWithoutBreedingInput = {
    where: Prisma.PregnancyWhereUniqueInput;
    data: Prisma.XOR<Prisma.PregnancyUpdateWithoutBreedingInput, Prisma.PregnancyUncheckedUpdateWithoutBreedingInput>;
};
export type PregnancyUpdateManyWithWhereWithoutBreedingInput = {
    where: Prisma.PregnancyScalarWhereInput;
    data: Prisma.XOR<Prisma.PregnancyUpdateManyMutationInput, Prisma.PregnancyUncheckedUpdateManyWithoutBreedingInput>;
};
export type PregnancyCreateManyFarmInput = {
    id?: string;
    breedingId: string;
    checkDate: Date | string;
    result: $Enums.PregnancyResult;
    observation?: string | null;
    createdAt?: Date | string;
};
export type PregnancyUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    checkDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    result?: Prisma.EnumPregnancyResultFieldUpdateOperationsInput | $Enums.PregnancyResult;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    breeding?: Prisma.BreedingUpdateOneRequiredWithoutPregnanciesNestedInput;
};
export type PregnancyUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    breedingId?: Prisma.StringFieldUpdateOperationsInput | string;
    checkDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    result?: Prisma.EnumPregnancyResultFieldUpdateOperationsInput | $Enums.PregnancyResult;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PregnancyUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    breedingId?: Prisma.StringFieldUpdateOperationsInput | string;
    checkDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    result?: Prisma.EnumPregnancyResultFieldUpdateOperationsInput | $Enums.PregnancyResult;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PregnancyCreateManyBreedingInput = {
    id?: string;
    checkDate: Date | string;
    result: $Enums.PregnancyResult;
    observation?: string | null;
    createdAt?: Date | string;
    farmId?: string | null;
};
export type PregnancyUpdateWithoutBreedingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    checkDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    result?: Prisma.EnumPregnancyResultFieldUpdateOperationsInput | $Enums.PregnancyResult;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneWithoutPregnanciesNestedInput;
};
export type PregnancyUncheckedUpdateWithoutBreedingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    checkDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    result?: Prisma.EnumPregnancyResultFieldUpdateOperationsInput | $Enums.PregnancyResult;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farmId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PregnancyUncheckedUpdateManyWithoutBreedingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    checkDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    result?: Prisma.EnumPregnancyResultFieldUpdateOperationsInput | $Enums.PregnancyResult;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farmId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type PregnancySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    breedingId?: boolean;
    checkDate?: boolean;
    result?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    farmId?: boolean;
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.Pregnancy$farmArgs<ExtArgs>;
}, ExtArgs["result"]["pregnancy"]>;
export type PregnancySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    breedingId?: boolean;
    checkDate?: boolean;
    result?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    farmId?: boolean;
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.Pregnancy$farmArgs<ExtArgs>;
}, ExtArgs["result"]["pregnancy"]>;
export type PregnancySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    breedingId?: boolean;
    checkDate?: boolean;
    result?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    farmId?: boolean;
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.Pregnancy$farmArgs<ExtArgs>;
}, ExtArgs["result"]["pregnancy"]>;
export type PregnancySelectScalar = {
    id?: boolean;
    breedingId?: boolean;
    checkDate?: boolean;
    result?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    farmId?: boolean;
};
export type PregnancyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "breedingId" | "checkDate" | "result" | "observation" | "createdAt" | "farmId", ExtArgs["result"]["pregnancy"]>;
export type PregnancyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.Pregnancy$farmArgs<ExtArgs>;
};
export type PregnancyIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.Pregnancy$farmArgs<ExtArgs>;
};
export type PregnancyIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.Pregnancy$farmArgs<ExtArgs>;
};
export type $PregnancyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Pregnancy";
    objects: {
        breeding: Prisma.$BreedingPayload<ExtArgs>;
        farm: Prisma.$FarmPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        breedingId: string;
        checkDate: Date;
        result: $Enums.PregnancyResult;
        observation: string | null;
        createdAt: Date;
        farmId: string | null;
    }, ExtArgs["result"]["pregnancy"]>;
    composites: {};
};
export type PregnancyGetPayload<S extends boolean | null | undefined | PregnancyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PregnancyPayload, S>;
export type PregnancyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PregnancyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PregnancyCountAggregateInputType | true;
};
export interface PregnancyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Pregnancy'];
        meta: {
            name: 'Pregnancy';
        };
    };
    findUnique<T extends PregnancyFindUniqueArgs>(args: Prisma.SelectSubset<T, PregnancyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PregnancyClient<runtime.Types.Result.GetResult<Prisma.$PregnancyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PregnancyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PregnancyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PregnancyClient<runtime.Types.Result.GetResult<Prisma.$PregnancyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PregnancyFindFirstArgs>(args?: Prisma.SelectSubset<T, PregnancyFindFirstArgs<ExtArgs>>): Prisma.Prisma__PregnancyClient<runtime.Types.Result.GetResult<Prisma.$PregnancyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PregnancyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PregnancyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PregnancyClient<runtime.Types.Result.GetResult<Prisma.$PregnancyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PregnancyFindManyArgs>(args?: Prisma.SelectSubset<T, PregnancyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PregnancyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PregnancyCreateArgs>(args: Prisma.SelectSubset<T, PregnancyCreateArgs<ExtArgs>>): Prisma.Prisma__PregnancyClient<runtime.Types.Result.GetResult<Prisma.$PregnancyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PregnancyCreateManyArgs>(args?: Prisma.SelectSubset<T, PregnancyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PregnancyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PregnancyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PregnancyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PregnancyDeleteArgs>(args: Prisma.SelectSubset<T, PregnancyDeleteArgs<ExtArgs>>): Prisma.Prisma__PregnancyClient<runtime.Types.Result.GetResult<Prisma.$PregnancyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PregnancyUpdateArgs>(args: Prisma.SelectSubset<T, PregnancyUpdateArgs<ExtArgs>>): Prisma.Prisma__PregnancyClient<runtime.Types.Result.GetResult<Prisma.$PregnancyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PregnancyDeleteManyArgs>(args?: Prisma.SelectSubset<T, PregnancyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PregnancyUpdateManyArgs>(args: Prisma.SelectSubset<T, PregnancyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PregnancyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PregnancyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PregnancyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PregnancyUpsertArgs>(args: Prisma.SelectSubset<T, PregnancyUpsertArgs<ExtArgs>>): Prisma.Prisma__PregnancyClient<runtime.Types.Result.GetResult<Prisma.$PregnancyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PregnancyCountArgs>(args?: Prisma.Subset<T, PregnancyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PregnancyCountAggregateOutputType> : number>;
    aggregate<T extends PregnancyAggregateArgs>(args: Prisma.Subset<T, PregnancyAggregateArgs>): Prisma.PrismaPromise<GetPregnancyAggregateType<T>>;
    groupBy<T extends PregnancyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PregnancyGroupByArgs['orderBy'];
    } : {
        orderBy?: PregnancyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PregnancyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPregnancyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PregnancyFieldRefs;
}
export interface Prisma__PregnancyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    breeding<T extends Prisma.BreedingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BreedingDefaultArgs<ExtArgs>>): Prisma.Prisma__BreedingClient<runtime.Types.Result.GetResult<Prisma.$BreedingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    farm<T extends Prisma.Pregnancy$farmArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Pregnancy$farmArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PregnancyFieldRefs {
    readonly id: Prisma.FieldRef<"Pregnancy", 'String'>;
    readonly breedingId: Prisma.FieldRef<"Pregnancy", 'String'>;
    readonly checkDate: Prisma.FieldRef<"Pregnancy", 'DateTime'>;
    readonly result: Prisma.FieldRef<"Pregnancy", 'PregnancyResult'>;
    readonly observation: Prisma.FieldRef<"Pregnancy", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Pregnancy", 'DateTime'>;
    readonly farmId: Prisma.FieldRef<"Pregnancy", 'String'>;
}
export type PregnancyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelect<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    include?: Prisma.PregnancyInclude<ExtArgs> | null;
    where: Prisma.PregnancyWhereUniqueInput;
};
export type PregnancyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelect<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    include?: Prisma.PregnancyInclude<ExtArgs> | null;
    where: Prisma.PregnancyWhereUniqueInput;
};
export type PregnancyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelect<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    include?: Prisma.PregnancyInclude<ExtArgs> | null;
    where?: Prisma.PregnancyWhereInput;
    orderBy?: Prisma.PregnancyOrderByWithRelationInput | Prisma.PregnancyOrderByWithRelationInput[];
    cursor?: Prisma.PregnancyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PregnancyScalarFieldEnum | Prisma.PregnancyScalarFieldEnum[];
};
export type PregnancyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelect<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    include?: Prisma.PregnancyInclude<ExtArgs> | null;
    where?: Prisma.PregnancyWhereInput;
    orderBy?: Prisma.PregnancyOrderByWithRelationInput | Prisma.PregnancyOrderByWithRelationInput[];
    cursor?: Prisma.PregnancyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PregnancyScalarFieldEnum | Prisma.PregnancyScalarFieldEnum[];
};
export type PregnancyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelect<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    include?: Prisma.PregnancyInclude<ExtArgs> | null;
    where?: Prisma.PregnancyWhereInput;
    orderBy?: Prisma.PregnancyOrderByWithRelationInput | Prisma.PregnancyOrderByWithRelationInput[];
    cursor?: Prisma.PregnancyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PregnancyScalarFieldEnum | Prisma.PregnancyScalarFieldEnum[];
};
export type PregnancyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelect<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    include?: Prisma.PregnancyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PregnancyCreateInput, Prisma.PregnancyUncheckedCreateInput>;
};
export type PregnancyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PregnancyCreateManyInput | Prisma.PregnancyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PregnancyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    data: Prisma.PregnancyCreateManyInput | Prisma.PregnancyCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PregnancyIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PregnancyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelect<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    include?: Prisma.PregnancyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PregnancyUpdateInput, Prisma.PregnancyUncheckedUpdateInput>;
    where: Prisma.PregnancyWhereUniqueInput;
};
export type PregnancyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PregnancyUpdateManyMutationInput, Prisma.PregnancyUncheckedUpdateManyInput>;
    where?: Prisma.PregnancyWhereInput;
    limit?: number;
};
export type PregnancyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PregnancyUpdateManyMutationInput, Prisma.PregnancyUncheckedUpdateManyInput>;
    where?: Prisma.PregnancyWhereInput;
    limit?: number;
    include?: Prisma.PregnancyIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PregnancyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelect<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    include?: Prisma.PregnancyInclude<ExtArgs> | null;
    where: Prisma.PregnancyWhereUniqueInput;
    create: Prisma.XOR<Prisma.PregnancyCreateInput, Prisma.PregnancyUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PregnancyUpdateInput, Prisma.PregnancyUncheckedUpdateInput>;
};
export type PregnancyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelect<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    include?: Prisma.PregnancyInclude<ExtArgs> | null;
    where: Prisma.PregnancyWhereUniqueInput;
};
export type PregnancyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PregnancyWhereInput;
    limit?: number;
};
export type Pregnancy$farmArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmSelect<ExtArgs> | null;
    omit?: Prisma.FarmOmit<ExtArgs> | null;
    include?: Prisma.FarmInclude<ExtArgs> | null;
    where?: Prisma.FarmWhereInput;
};
export type PregnancyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PregnancySelect<ExtArgs> | null;
    omit?: Prisma.PregnancyOmit<ExtArgs> | null;
    include?: Prisma.PregnancyInclude<ExtArgs> | null;
};
