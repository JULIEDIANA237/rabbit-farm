import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type BirthModel = runtime.Types.Result.DefaultSelection<Prisma.$BirthPayload>;
export type AggregateBirth = {
    _count: BirthCountAggregateOutputType | null;
    _avg: BirthAvgAggregateOutputType | null;
    _sum: BirthSumAggregateOutputType | null;
    _min: BirthMinAggregateOutputType | null;
    _max: BirthMaxAggregateOutputType | null;
};
export type BirthAvgAggregateOutputType = {
    liveBorn: number | null;
    stillBorn: number | null;
};
export type BirthSumAggregateOutputType = {
    liveBorn: number | null;
    stillBorn: number | null;
};
export type BirthMinAggregateOutputType = {
    id: string | null;
    breedingId: string | null;
    motherId: string | null;
    birthDate: Date | null;
    liveBorn: number | null;
    stillBorn: number | null;
    observation: string | null;
    createdAt: Date | null;
    farmId: string | null;
};
export type BirthMaxAggregateOutputType = {
    id: string | null;
    breedingId: string | null;
    motherId: string | null;
    birthDate: Date | null;
    liveBorn: number | null;
    stillBorn: number | null;
    observation: string | null;
    createdAt: Date | null;
    farmId: string | null;
};
export type BirthCountAggregateOutputType = {
    id: number;
    breedingId: number;
    motherId: number;
    birthDate: number;
    liveBorn: number;
    stillBorn: number;
    observation: number;
    createdAt: number;
    farmId: number;
    _all: number;
};
export type BirthAvgAggregateInputType = {
    liveBorn?: true;
    stillBorn?: true;
};
export type BirthSumAggregateInputType = {
    liveBorn?: true;
    stillBorn?: true;
};
export type BirthMinAggregateInputType = {
    id?: true;
    breedingId?: true;
    motherId?: true;
    birthDate?: true;
    liveBorn?: true;
    stillBorn?: true;
    observation?: true;
    createdAt?: true;
    farmId?: true;
};
export type BirthMaxAggregateInputType = {
    id?: true;
    breedingId?: true;
    motherId?: true;
    birthDate?: true;
    liveBorn?: true;
    stillBorn?: true;
    observation?: true;
    createdAt?: true;
    farmId?: true;
};
export type BirthCountAggregateInputType = {
    id?: true;
    breedingId?: true;
    motherId?: true;
    birthDate?: true;
    liveBorn?: true;
    stillBorn?: true;
    observation?: true;
    createdAt?: true;
    farmId?: true;
    _all?: true;
};
export type BirthAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BirthWhereInput;
    orderBy?: Prisma.BirthOrderByWithRelationInput | Prisma.BirthOrderByWithRelationInput[];
    cursor?: Prisma.BirthWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BirthCountAggregateInputType;
    _avg?: BirthAvgAggregateInputType;
    _sum?: BirthSumAggregateInputType;
    _min?: BirthMinAggregateInputType;
    _max?: BirthMaxAggregateInputType;
};
export type GetBirthAggregateType<T extends BirthAggregateArgs> = {
    [P in keyof T & keyof AggregateBirth]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBirth[P]> : Prisma.GetScalarType<T[P], AggregateBirth[P]>;
};
export type BirthGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BirthWhereInput;
    orderBy?: Prisma.BirthOrderByWithAggregationInput | Prisma.BirthOrderByWithAggregationInput[];
    by: Prisma.BirthScalarFieldEnum[] | Prisma.BirthScalarFieldEnum;
    having?: Prisma.BirthScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BirthCountAggregateInputType | true;
    _avg?: BirthAvgAggregateInputType;
    _sum?: BirthSumAggregateInputType;
    _min?: BirthMinAggregateInputType;
    _max?: BirthMaxAggregateInputType;
};
export type BirthGroupByOutputType = {
    id: string;
    breedingId: string;
    motherId: string;
    birthDate: Date;
    liveBorn: number;
    stillBorn: number;
    observation: string | null;
    createdAt: Date;
    farmId: string | null;
    _count: BirthCountAggregateOutputType | null;
    _avg: BirthAvgAggregateOutputType | null;
    _sum: BirthSumAggregateOutputType | null;
    _min: BirthMinAggregateOutputType | null;
    _max: BirthMaxAggregateOutputType | null;
};
export type GetBirthGroupByPayload<T extends BirthGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BirthGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BirthGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BirthGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BirthGroupByOutputType[P]>;
}>>;
export type BirthWhereInput = {
    AND?: Prisma.BirthWhereInput | Prisma.BirthWhereInput[];
    OR?: Prisma.BirthWhereInput[];
    NOT?: Prisma.BirthWhereInput | Prisma.BirthWhereInput[];
    id?: Prisma.StringFilter<"Birth"> | string;
    breedingId?: Prisma.StringFilter<"Birth"> | string;
    motherId?: Prisma.StringFilter<"Birth"> | string;
    birthDate?: Prisma.DateTimeFilter<"Birth"> | Date | string;
    liveBorn?: Prisma.IntFilter<"Birth"> | number;
    stillBorn?: Prisma.IntFilter<"Birth"> | number;
    observation?: Prisma.StringNullableFilter<"Birth"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Birth"> | Date | string;
    farmId?: Prisma.StringNullableFilter<"Birth"> | string | null;
    breeding?: Prisma.XOR<Prisma.BreedingScalarRelationFilter, Prisma.BreedingWhereInput>;
    mother?: Prisma.XOR<Prisma.RabbitScalarRelationFilter, Prisma.RabbitWhereInput>;
    litter?: Prisma.XOR<Prisma.LitterNullableScalarRelationFilter, Prisma.LitterWhereInput> | null;
    farm?: Prisma.XOR<Prisma.FarmNullableScalarRelationFilter, Prisma.FarmWhereInput> | null;
};
export type BirthOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    breedingId?: Prisma.SortOrder;
    motherId?: Prisma.SortOrder;
    birthDate?: Prisma.SortOrder;
    liveBorn?: Prisma.SortOrder;
    stillBorn?: Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    farmId?: Prisma.SortOrderInput | Prisma.SortOrder;
    breeding?: Prisma.BreedingOrderByWithRelationInput;
    mother?: Prisma.RabbitOrderByWithRelationInput;
    litter?: Prisma.LitterOrderByWithRelationInput;
    farm?: Prisma.FarmOrderByWithRelationInput;
};
export type BirthWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    breedingId?: string;
    AND?: Prisma.BirthWhereInput | Prisma.BirthWhereInput[];
    OR?: Prisma.BirthWhereInput[];
    NOT?: Prisma.BirthWhereInput | Prisma.BirthWhereInput[];
    motherId?: Prisma.StringFilter<"Birth"> | string;
    birthDate?: Prisma.DateTimeFilter<"Birth"> | Date | string;
    liveBorn?: Prisma.IntFilter<"Birth"> | number;
    stillBorn?: Prisma.IntFilter<"Birth"> | number;
    observation?: Prisma.StringNullableFilter<"Birth"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Birth"> | Date | string;
    farmId?: Prisma.StringNullableFilter<"Birth"> | string | null;
    breeding?: Prisma.XOR<Prisma.BreedingScalarRelationFilter, Prisma.BreedingWhereInput>;
    mother?: Prisma.XOR<Prisma.RabbitScalarRelationFilter, Prisma.RabbitWhereInput>;
    litter?: Prisma.XOR<Prisma.LitterNullableScalarRelationFilter, Prisma.LitterWhereInput> | null;
    farm?: Prisma.XOR<Prisma.FarmNullableScalarRelationFilter, Prisma.FarmWhereInput> | null;
}, "id" | "breedingId">;
export type BirthOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    breedingId?: Prisma.SortOrder;
    motherId?: Prisma.SortOrder;
    birthDate?: Prisma.SortOrder;
    liveBorn?: Prisma.SortOrder;
    stillBorn?: Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    farmId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.BirthCountOrderByAggregateInput;
    _avg?: Prisma.BirthAvgOrderByAggregateInput;
    _max?: Prisma.BirthMaxOrderByAggregateInput;
    _min?: Prisma.BirthMinOrderByAggregateInput;
    _sum?: Prisma.BirthSumOrderByAggregateInput;
};
export type BirthScalarWhereWithAggregatesInput = {
    AND?: Prisma.BirthScalarWhereWithAggregatesInput | Prisma.BirthScalarWhereWithAggregatesInput[];
    OR?: Prisma.BirthScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BirthScalarWhereWithAggregatesInput | Prisma.BirthScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Birth"> | string;
    breedingId?: Prisma.StringWithAggregatesFilter<"Birth"> | string;
    motherId?: Prisma.StringWithAggregatesFilter<"Birth"> | string;
    birthDate?: Prisma.DateTimeWithAggregatesFilter<"Birth"> | Date | string;
    liveBorn?: Prisma.IntWithAggregatesFilter<"Birth"> | number;
    stillBorn?: Prisma.IntWithAggregatesFilter<"Birth"> | number;
    observation?: Prisma.StringNullableWithAggregatesFilter<"Birth"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Birth"> | Date | string;
    farmId?: Prisma.StringNullableWithAggregatesFilter<"Birth"> | string | null;
};
export type BirthCreateInput = {
    id?: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    breeding: Prisma.BreedingCreateNestedOneWithoutBirthInput;
    mother: Prisma.RabbitCreateNestedOneWithoutMotherBirthsInput;
    litter?: Prisma.LitterCreateNestedOneWithoutBirthInput;
    farm?: Prisma.FarmCreateNestedOneWithoutBirthsInput;
};
export type BirthUncheckedCreateInput = {
    id?: string;
    breedingId: string;
    motherId: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    farmId?: string | null;
    litter?: Prisma.LitterUncheckedCreateNestedOneWithoutBirthInput;
};
export type BirthUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    breeding?: Prisma.BreedingUpdateOneRequiredWithoutBirthNestedInput;
    mother?: Prisma.RabbitUpdateOneRequiredWithoutMotherBirthsNestedInput;
    litter?: Prisma.LitterUpdateOneWithoutBirthNestedInput;
    farm?: Prisma.FarmUpdateOneWithoutBirthsNestedInput;
};
export type BirthUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    breedingId?: Prisma.StringFieldUpdateOperationsInput | string;
    motherId?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farmId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    litter?: Prisma.LitterUncheckedUpdateOneWithoutBirthNestedInput;
};
export type BirthCreateManyInput = {
    id?: string;
    breedingId: string;
    motherId: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    farmId?: string | null;
};
export type BirthUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BirthUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    breedingId?: Prisma.StringFieldUpdateOperationsInput | string;
    motherId?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farmId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type BirthListRelationFilter = {
    every?: Prisma.BirthWhereInput;
    some?: Prisma.BirthWhereInput;
    none?: Prisma.BirthWhereInput;
};
export type BirthOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BirthNullableScalarRelationFilter = {
    is?: Prisma.BirthWhereInput | null;
    isNot?: Prisma.BirthWhereInput | null;
};
export type BirthCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    breedingId?: Prisma.SortOrder;
    motherId?: Prisma.SortOrder;
    birthDate?: Prisma.SortOrder;
    liveBorn?: Prisma.SortOrder;
    stillBorn?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
};
export type BirthAvgOrderByAggregateInput = {
    liveBorn?: Prisma.SortOrder;
    stillBorn?: Prisma.SortOrder;
};
export type BirthMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    breedingId?: Prisma.SortOrder;
    motherId?: Prisma.SortOrder;
    birthDate?: Prisma.SortOrder;
    liveBorn?: Prisma.SortOrder;
    stillBorn?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
};
export type BirthMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    breedingId?: Prisma.SortOrder;
    motherId?: Prisma.SortOrder;
    birthDate?: Prisma.SortOrder;
    liveBorn?: Prisma.SortOrder;
    stillBorn?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
};
export type BirthSumOrderByAggregateInput = {
    liveBorn?: Prisma.SortOrder;
    stillBorn?: Prisma.SortOrder;
};
export type BirthCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutFarmInput, Prisma.BirthUncheckedCreateWithoutFarmInput> | Prisma.BirthCreateWithoutFarmInput[] | Prisma.BirthUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutFarmInput | Prisma.BirthCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.BirthCreateManyFarmInputEnvelope;
    connect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
};
export type BirthUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutFarmInput, Prisma.BirthUncheckedCreateWithoutFarmInput> | Prisma.BirthCreateWithoutFarmInput[] | Prisma.BirthUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutFarmInput | Prisma.BirthCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.BirthCreateManyFarmInputEnvelope;
    connect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
};
export type BirthUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutFarmInput, Prisma.BirthUncheckedCreateWithoutFarmInput> | Prisma.BirthCreateWithoutFarmInput[] | Prisma.BirthUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutFarmInput | Prisma.BirthCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.BirthUpsertWithWhereUniqueWithoutFarmInput | Prisma.BirthUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.BirthCreateManyFarmInputEnvelope;
    set?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    disconnect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    delete?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    connect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    update?: Prisma.BirthUpdateWithWhereUniqueWithoutFarmInput | Prisma.BirthUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.BirthUpdateManyWithWhereWithoutFarmInput | Prisma.BirthUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.BirthScalarWhereInput | Prisma.BirthScalarWhereInput[];
};
export type BirthUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutFarmInput, Prisma.BirthUncheckedCreateWithoutFarmInput> | Prisma.BirthCreateWithoutFarmInput[] | Prisma.BirthUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutFarmInput | Prisma.BirthCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.BirthUpsertWithWhereUniqueWithoutFarmInput | Prisma.BirthUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.BirthCreateManyFarmInputEnvelope;
    set?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    disconnect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    delete?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    connect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    update?: Prisma.BirthUpdateWithWhereUniqueWithoutFarmInput | Prisma.BirthUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.BirthUpdateManyWithWhereWithoutFarmInput | Prisma.BirthUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.BirthScalarWhereInput | Prisma.BirthScalarWhereInput[];
};
export type BirthCreateNestedManyWithoutMotherInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutMotherInput, Prisma.BirthUncheckedCreateWithoutMotherInput> | Prisma.BirthCreateWithoutMotherInput[] | Prisma.BirthUncheckedCreateWithoutMotherInput[];
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutMotherInput | Prisma.BirthCreateOrConnectWithoutMotherInput[];
    createMany?: Prisma.BirthCreateManyMotherInputEnvelope;
    connect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
};
export type BirthUncheckedCreateNestedManyWithoutMotherInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutMotherInput, Prisma.BirthUncheckedCreateWithoutMotherInput> | Prisma.BirthCreateWithoutMotherInput[] | Prisma.BirthUncheckedCreateWithoutMotherInput[];
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutMotherInput | Prisma.BirthCreateOrConnectWithoutMotherInput[];
    createMany?: Prisma.BirthCreateManyMotherInputEnvelope;
    connect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
};
export type BirthUpdateManyWithoutMotherNestedInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutMotherInput, Prisma.BirthUncheckedCreateWithoutMotherInput> | Prisma.BirthCreateWithoutMotherInput[] | Prisma.BirthUncheckedCreateWithoutMotherInput[];
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutMotherInput | Prisma.BirthCreateOrConnectWithoutMotherInput[];
    upsert?: Prisma.BirthUpsertWithWhereUniqueWithoutMotherInput | Prisma.BirthUpsertWithWhereUniqueWithoutMotherInput[];
    createMany?: Prisma.BirthCreateManyMotherInputEnvelope;
    set?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    disconnect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    delete?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    connect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    update?: Prisma.BirthUpdateWithWhereUniqueWithoutMotherInput | Prisma.BirthUpdateWithWhereUniqueWithoutMotherInput[];
    updateMany?: Prisma.BirthUpdateManyWithWhereWithoutMotherInput | Prisma.BirthUpdateManyWithWhereWithoutMotherInput[];
    deleteMany?: Prisma.BirthScalarWhereInput | Prisma.BirthScalarWhereInput[];
};
export type BirthUncheckedUpdateManyWithoutMotherNestedInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutMotherInput, Prisma.BirthUncheckedCreateWithoutMotherInput> | Prisma.BirthCreateWithoutMotherInput[] | Prisma.BirthUncheckedCreateWithoutMotherInput[];
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutMotherInput | Prisma.BirthCreateOrConnectWithoutMotherInput[];
    upsert?: Prisma.BirthUpsertWithWhereUniqueWithoutMotherInput | Prisma.BirthUpsertWithWhereUniqueWithoutMotherInput[];
    createMany?: Prisma.BirthCreateManyMotherInputEnvelope;
    set?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    disconnect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    delete?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    connect?: Prisma.BirthWhereUniqueInput | Prisma.BirthWhereUniqueInput[];
    update?: Prisma.BirthUpdateWithWhereUniqueWithoutMotherInput | Prisma.BirthUpdateWithWhereUniqueWithoutMotherInput[];
    updateMany?: Prisma.BirthUpdateManyWithWhereWithoutMotherInput | Prisma.BirthUpdateManyWithWhereWithoutMotherInput[];
    deleteMany?: Prisma.BirthScalarWhereInput | Prisma.BirthScalarWhereInput[];
};
export type BirthCreateNestedOneWithoutBreedingInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutBreedingInput, Prisma.BirthUncheckedCreateWithoutBreedingInput>;
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutBreedingInput;
    connect?: Prisma.BirthWhereUniqueInput;
};
export type BirthUncheckedCreateNestedOneWithoutBreedingInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutBreedingInput, Prisma.BirthUncheckedCreateWithoutBreedingInput>;
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutBreedingInput;
    connect?: Prisma.BirthWhereUniqueInput;
};
export type BirthUpdateOneWithoutBreedingNestedInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutBreedingInput, Prisma.BirthUncheckedCreateWithoutBreedingInput>;
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutBreedingInput;
    upsert?: Prisma.BirthUpsertWithoutBreedingInput;
    disconnect?: Prisma.BirthWhereInput | boolean;
    delete?: Prisma.BirthWhereInput | boolean;
    connect?: Prisma.BirthWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BirthUpdateToOneWithWhereWithoutBreedingInput, Prisma.BirthUpdateWithoutBreedingInput>, Prisma.BirthUncheckedUpdateWithoutBreedingInput>;
};
export type BirthUncheckedUpdateOneWithoutBreedingNestedInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutBreedingInput, Prisma.BirthUncheckedCreateWithoutBreedingInput>;
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutBreedingInput;
    upsert?: Prisma.BirthUpsertWithoutBreedingInput;
    disconnect?: Prisma.BirthWhereInput | boolean;
    delete?: Prisma.BirthWhereInput | boolean;
    connect?: Prisma.BirthWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BirthUpdateToOneWithWhereWithoutBreedingInput, Prisma.BirthUpdateWithoutBreedingInput>, Prisma.BirthUncheckedUpdateWithoutBreedingInput>;
};
export type BirthCreateNestedOneWithoutLitterInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutLitterInput, Prisma.BirthUncheckedCreateWithoutLitterInput>;
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutLitterInput;
    connect?: Prisma.BirthWhereUniqueInput;
};
export type BirthUpdateOneWithoutLitterNestedInput = {
    create?: Prisma.XOR<Prisma.BirthCreateWithoutLitterInput, Prisma.BirthUncheckedCreateWithoutLitterInput>;
    connectOrCreate?: Prisma.BirthCreateOrConnectWithoutLitterInput;
    upsert?: Prisma.BirthUpsertWithoutLitterInput;
    disconnect?: Prisma.BirthWhereInput | boolean;
    delete?: Prisma.BirthWhereInput | boolean;
    connect?: Prisma.BirthWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BirthUpdateToOneWithWhereWithoutLitterInput, Prisma.BirthUpdateWithoutLitterInput>, Prisma.BirthUncheckedUpdateWithoutLitterInput>;
};
export type BirthCreateWithoutFarmInput = {
    id?: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    breeding: Prisma.BreedingCreateNestedOneWithoutBirthInput;
    mother: Prisma.RabbitCreateNestedOneWithoutMotherBirthsInput;
    litter?: Prisma.LitterCreateNestedOneWithoutBirthInput;
};
export type BirthUncheckedCreateWithoutFarmInput = {
    id?: string;
    breedingId: string;
    motherId: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    litter?: Prisma.LitterUncheckedCreateNestedOneWithoutBirthInput;
};
export type BirthCreateOrConnectWithoutFarmInput = {
    where: Prisma.BirthWhereUniqueInput;
    create: Prisma.XOR<Prisma.BirthCreateWithoutFarmInput, Prisma.BirthUncheckedCreateWithoutFarmInput>;
};
export type BirthCreateManyFarmInputEnvelope = {
    data: Prisma.BirthCreateManyFarmInput | Prisma.BirthCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type BirthUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.BirthWhereUniqueInput;
    update: Prisma.XOR<Prisma.BirthUpdateWithoutFarmInput, Prisma.BirthUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.BirthCreateWithoutFarmInput, Prisma.BirthUncheckedCreateWithoutFarmInput>;
};
export type BirthUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.BirthWhereUniqueInput;
    data: Prisma.XOR<Prisma.BirthUpdateWithoutFarmInput, Prisma.BirthUncheckedUpdateWithoutFarmInput>;
};
export type BirthUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.BirthScalarWhereInput;
    data: Prisma.XOR<Prisma.BirthUpdateManyMutationInput, Prisma.BirthUncheckedUpdateManyWithoutFarmInput>;
};
export type BirthScalarWhereInput = {
    AND?: Prisma.BirthScalarWhereInput | Prisma.BirthScalarWhereInput[];
    OR?: Prisma.BirthScalarWhereInput[];
    NOT?: Prisma.BirthScalarWhereInput | Prisma.BirthScalarWhereInput[];
    id?: Prisma.StringFilter<"Birth"> | string;
    breedingId?: Prisma.StringFilter<"Birth"> | string;
    motherId?: Prisma.StringFilter<"Birth"> | string;
    birthDate?: Prisma.DateTimeFilter<"Birth"> | Date | string;
    liveBorn?: Prisma.IntFilter<"Birth"> | number;
    stillBorn?: Prisma.IntFilter<"Birth"> | number;
    observation?: Prisma.StringNullableFilter<"Birth"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Birth"> | Date | string;
    farmId?: Prisma.StringNullableFilter<"Birth"> | string | null;
};
export type BirthCreateWithoutMotherInput = {
    id?: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    breeding: Prisma.BreedingCreateNestedOneWithoutBirthInput;
    litter?: Prisma.LitterCreateNestedOneWithoutBirthInput;
    farm?: Prisma.FarmCreateNestedOneWithoutBirthsInput;
};
export type BirthUncheckedCreateWithoutMotherInput = {
    id?: string;
    breedingId: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    farmId?: string | null;
    litter?: Prisma.LitterUncheckedCreateNestedOneWithoutBirthInput;
};
export type BirthCreateOrConnectWithoutMotherInput = {
    where: Prisma.BirthWhereUniqueInput;
    create: Prisma.XOR<Prisma.BirthCreateWithoutMotherInput, Prisma.BirthUncheckedCreateWithoutMotherInput>;
};
export type BirthCreateManyMotherInputEnvelope = {
    data: Prisma.BirthCreateManyMotherInput | Prisma.BirthCreateManyMotherInput[];
    skipDuplicates?: boolean;
};
export type BirthUpsertWithWhereUniqueWithoutMotherInput = {
    where: Prisma.BirthWhereUniqueInput;
    update: Prisma.XOR<Prisma.BirthUpdateWithoutMotherInput, Prisma.BirthUncheckedUpdateWithoutMotherInput>;
    create: Prisma.XOR<Prisma.BirthCreateWithoutMotherInput, Prisma.BirthUncheckedCreateWithoutMotherInput>;
};
export type BirthUpdateWithWhereUniqueWithoutMotherInput = {
    where: Prisma.BirthWhereUniqueInput;
    data: Prisma.XOR<Prisma.BirthUpdateWithoutMotherInput, Prisma.BirthUncheckedUpdateWithoutMotherInput>;
};
export type BirthUpdateManyWithWhereWithoutMotherInput = {
    where: Prisma.BirthScalarWhereInput;
    data: Prisma.XOR<Prisma.BirthUpdateManyMutationInput, Prisma.BirthUncheckedUpdateManyWithoutMotherInput>;
};
export type BirthCreateWithoutBreedingInput = {
    id?: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    mother: Prisma.RabbitCreateNestedOneWithoutMotherBirthsInput;
    litter?: Prisma.LitterCreateNestedOneWithoutBirthInput;
    farm?: Prisma.FarmCreateNestedOneWithoutBirthsInput;
};
export type BirthUncheckedCreateWithoutBreedingInput = {
    id?: string;
    motherId: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    farmId?: string | null;
    litter?: Prisma.LitterUncheckedCreateNestedOneWithoutBirthInput;
};
export type BirthCreateOrConnectWithoutBreedingInput = {
    where: Prisma.BirthWhereUniqueInput;
    create: Prisma.XOR<Prisma.BirthCreateWithoutBreedingInput, Prisma.BirthUncheckedCreateWithoutBreedingInput>;
};
export type BirthUpsertWithoutBreedingInput = {
    update: Prisma.XOR<Prisma.BirthUpdateWithoutBreedingInput, Prisma.BirthUncheckedUpdateWithoutBreedingInput>;
    create: Prisma.XOR<Prisma.BirthCreateWithoutBreedingInput, Prisma.BirthUncheckedCreateWithoutBreedingInput>;
    where?: Prisma.BirthWhereInput;
};
export type BirthUpdateToOneWithWhereWithoutBreedingInput = {
    where?: Prisma.BirthWhereInput;
    data: Prisma.XOR<Prisma.BirthUpdateWithoutBreedingInput, Prisma.BirthUncheckedUpdateWithoutBreedingInput>;
};
export type BirthUpdateWithoutBreedingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    mother?: Prisma.RabbitUpdateOneRequiredWithoutMotherBirthsNestedInput;
    litter?: Prisma.LitterUpdateOneWithoutBirthNestedInput;
    farm?: Prisma.FarmUpdateOneWithoutBirthsNestedInput;
};
export type BirthUncheckedUpdateWithoutBreedingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    motherId?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farmId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    litter?: Prisma.LitterUncheckedUpdateOneWithoutBirthNestedInput;
};
export type BirthCreateWithoutLitterInput = {
    id?: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    breeding: Prisma.BreedingCreateNestedOneWithoutBirthInput;
    mother: Prisma.RabbitCreateNestedOneWithoutMotherBirthsInput;
    farm?: Prisma.FarmCreateNestedOneWithoutBirthsInput;
};
export type BirthUncheckedCreateWithoutLitterInput = {
    id?: string;
    breedingId: string;
    motherId: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    farmId?: string | null;
};
export type BirthCreateOrConnectWithoutLitterInput = {
    where: Prisma.BirthWhereUniqueInput;
    create: Prisma.XOR<Prisma.BirthCreateWithoutLitterInput, Prisma.BirthUncheckedCreateWithoutLitterInput>;
};
export type BirthUpsertWithoutLitterInput = {
    update: Prisma.XOR<Prisma.BirthUpdateWithoutLitterInput, Prisma.BirthUncheckedUpdateWithoutLitterInput>;
    create: Prisma.XOR<Prisma.BirthCreateWithoutLitterInput, Prisma.BirthUncheckedCreateWithoutLitterInput>;
    where?: Prisma.BirthWhereInput;
};
export type BirthUpdateToOneWithWhereWithoutLitterInput = {
    where?: Prisma.BirthWhereInput;
    data: Prisma.XOR<Prisma.BirthUpdateWithoutLitterInput, Prisma.BirthUncheckedUpdateWithoutLitterInput>;
};
export type BirthUpdateWithoutLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    breeding?: Prisma.BreedingUpdateOneRequiredWithoutBirthNestedInput;
    mother?: Prisma.RabbitUpdateOneRequiredWithoutMotherBirthsNestedInput;
    farm?: Prisma.FarmUpdateOneWithoutBirthsNestedInput;
};
export type BirthUncheckedUpdateWithoutLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    breedingId?: Prisma.StringFieldUpdateOperationsInput | string;
    motherId?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farmId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type BirthCreateManyFarmInput = {
    id?: string;
    breedingId: string;
    motherId: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
};
export type BirthUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    breeding?: Prisma.BreedingUpdateOneRequiredWithoutBirthNestedInput;
    mother?: Prisma.RabbitUpdateOneRequiredWithoutMotherBirthsNestedInput;
    litter?: Prisma.LitterUpdateOneWithoutBirthNestedInput;
};
export type BirthUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    breedingId?: Prisma.StringFieldUpdateOperationsInput | string;
    motherId?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    litter?: Prisma.LitterUncheckedUpdateOneWithoutBirthNestedInput;
};
export type BirthUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    breedingId?: Prisma.StringFieldUpdateOperationsInput | string;
    motherId?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BirthCreateManyMotherInput = {
    id?: string;
    breedingId: string;
    birthDate: Date | string;
    liveBorn: number;
    stillBorn: number;
    observation?: string | null;
    createdAt?: Date | string;
    farmId?: string | null;
};
export type BirthUpdateWithoutMotherInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    breeding?: Prisma.BreedingUpdateOneRequiredWithoutBirthNestedInput;
    litter?: Prisma.LitterUpdateOneWithoutBirthNestedInput;
    farm?: Prisma.FarmUpdateOneWithoutBirthsNestedInput;
};
export type BirthUncheckedUpdateWithoutMotherInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    breedingId?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farmId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    litter?: Prisma.LitterUncheckedUpdateOneWithoutBirthNestedInput;
};
export type BirthUncheckedUpdateManyWithoutMotherInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    breedingId?: Prisma.StringFieldUpdateOperationsInput | string;
    birthDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    liveBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    stillBorn?: Prisma.IntFieldUpdateOperationsInput | number;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farmId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type BirthSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    breedingId?: boolean;
    motherId?: boolean;
    birthDate?: boolean;
    liveBorn?: boolean;
    stillBorn?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    farmId?: boolean;
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    mother?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    litter?: boolean | Prisma.Birth$litterArgs<ExtArgs>;
    farm?: boolean | Prisma.Birth$farmArgs<ExtArgs>;
}, ExtArgs["result"]["birth"]>;
export type BirthSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    breedingId?: boolean;
    motherId?: boolean;
    birthDate?: boolean;
    liveBorn?: boolean;
    stillBorn?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    farmId?: boolean;
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    mother?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.Birth$farmArgs<ExtArgs>;
}, ExtArgs["result"]["birth"]>;
export type BirthSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    breedingId?: boolean;
    motherId?: boolean;
    birthDate?: boolean;
    liveBorn?: boolean;
    stillBorn?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    farmId?: boolean;
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    mother?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.Birth$farmArgs<ExtArgs>;
}, ExtArgs["result"]["birth"]>;
export type BirthSelectScalar = {
    id?: boolean;
    breedingId?: boolean;
    motherId?: boolean;
    birthDate?: boolean;
    liveBorn?: boolean;
    stillBorn?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    farmId?: boolean;
};
export type BirthOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "breedingId" | "motherId" | "birthDate" | "liveBorn" | "stillBorn" | "observation" | "createdAt" | "farmId", ExtArgs["result"]["birth"]>;
export type BirthInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    mother?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    litter?: boolean | Prisma.Birth$litterArgs<ExtArgs>;
    farm?: boolean | Prisma.Birth$farmArgs<ExtArgs>;
};
export type BirthIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    mother?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.Birth$farmArgs<ExtArgs>;
};
export type BirthIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    breeding?: boolean | Prisma.BreedingDefaultArgs<ExtArgs>;
    mother?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    farm?: boolean | Prisma.Birth$farmArgs<ExtArgs>;
};
export type $BirthPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Birth";
    objects: {
        breeding: Prisma.$BreedingPayload<ExtArgs>;
        mother: Prisma.$RabbitPayload<ExtArgs>;
        litter: Prisma.$LitterPayload<ExtArgs> | null;
        farm: Prisma.$FarmPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        breedingId: string;
        motherId: string;
        birthDate: Date;
        liveBorn: number;
        stillBorn: number;
        observation: string | null;
        createdAt: Date;
        farmId: string | null;
    }, ExtArgs["result"]["birth"]>;
    composites: {};
};
export type BirthGetPayload<S extends boolean | null | undefined | BirthDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BirthPayload, S>;
export type BirthCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BirthFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BirthCountAggregateInputType | true;
};
export interface BirthDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Birth'];
        meta: {
            name: 'Birth';
        };
    };
    findUnique<T extends BirthFindUniqueArgs>(args: Prisma.SelectSubset<T, BirthFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BirthClient<runtime.Types.Result.GetResult<Prisma.$BirthPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BirthFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BirthFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BirthClient<runtime.Types.Result.GetResult<Prisma.$BirthPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BirthFindFirstArgs>(args?: Prisma.SelectSubset<T, BirthFindFirstArgs<ExtArgs>>): Prisma.Prisma__BirthClient<runtime.Types.Result.GetResult<Prisma.$BirthPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BirthFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BirthFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BirthClient<runtime.Types.Result.GetResult<Prisma.$BirthPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BirthFindManyArgs>(args?: Prisma.SelectSubset<T, BirthFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BirthPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BirthCreateArgs>(args: Prisma.SelectSubset<T, BirthCreateArgs<ExtArgs>>): Prisma.Prisma__BirthClient<runtime.Types.Result.GetResult<Prisma.$BirthPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BirthCreateManyArgs>(args?: Prisma.SelectSubset<T, BirthCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BirthCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BirthCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BirthPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BirthDeleteArgs>(args: Prisma.SelectSubset<T, BirthDeleteArgs<ExtArgs>>): Prisma.Prisma__BirthClient<runtime.Types.Result.GetResult<Prisma.$BirthPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BirthUpdateArgs>(args: Prisma.SelectSubset<T, BirthUpdateArgs<ExtArgs>>): Prisma.Prisma__BirthClient<runtime.Types.Result.GetResult<Prisma.$BirthPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BirthDeleteManyArgs>(args?: Prisma.SelectSubset<T, BirthDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BirthUpdateManyArgs>(args: Prisma.SelectSubset<T, BirthUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BirthUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BirthUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BirthPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BirthUpsertArgs>(args: Prisma.SelectSubset<T, BirthUpsertArgs<ExtArgs>>): Prisma.Prisma__BirthClient<runtime.Types.Result.GetResult<Prisma.$BirthPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BirthCountArgs>(args?: Prisma.Subset<T, BirthCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BirthCountAggregateOutputType> : number>;
    aggregate<T extends BirthAggregateArgs>(args: Prisma.Subset<T, BirthAggregateArgs>): Prisma.PrismaPromise<GetBirthAggregateType<T>>;
    groupBy<T extends BirthGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BirthGroupByArgs['orderBy'];
    } : {
        orderBy?: BirthGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BirthGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBirthGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BirthFieldRefs;
}
export interface Prisma__BirthClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    breeding<T extends Prisma.BreedingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BreedingDefaultArgs<ExtArgs>>): Prisma.Prisma__BreedingClient<runtime.Types.Result.GetResult<Prisma.$BreedingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    mother<T extends Prisma.RabbitDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RabbitDefaultArgs<ExtArgs>>): Prisma.Prisma__RabbitClient<runtime.Types.Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    litter<T extends Prisma.Birth$litterArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Birth$litterArgs<ExtArgs>>): Prisma.Prisma__LitterClient<runtime.Types.Result.GetResult<Prisma.$LitterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    farm<T extends Prisma.Birth$farmArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Birth$farmArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BirthFieldRefs {
    readonly id: Prisma.FieldRef<"Birth", 'String'>;
    readonly breedingId: Prisma.FieldRef<"Birth", 'String'>;
    readonly motherId: Prisma.FieldRef<"Birth", 'String'>;
    readonly birthDate: Prisma.FieldRef<"Birth", 'DateTime'>;
    readonly liveBorn: Prisma.FieldRef<"Birth", 'Int'>;
    readonly stillBorn: Prisma.FieldRef<"Birth", 'Int'>;
    readonly observation: Prisma.FieldRef<"Birth", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Birth", 'DateTime'>;
    readonly farmId: Prisma.FieldRef<"Birth", 'String'>;
}
export type BirthFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelect<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    include?: Prisma.BirthInclude<ExtArgs> | null;
    where: Prisma.BirthWhereUniqueInput;
};
export type BirthFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelect<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    include?: Prisma.BirthInclude<ExtArgs> | null;
    where: Prisma.BirthWhereUniqueInput;
};
export type BirthFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelect<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    include?: Prisma.BirthInclude<ExtArgs> | null;
    where?: Prisma.BirthWhereInput;
    orderBy?: Prisma.BirthOrderByWithRelationInput | Prisma.BirthOrderByWithRelationInput[];
    cursor?: Prisma.BirthWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BirthScalarFieldEnum | Prisma.BirthScalarFieldEnum[];
};
export type BirthFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelect<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    include?: Prisma.BirthInclude<ExtArgs> | null;
    where?: Prisma.BirthWhereInput;
    orderBy?: Prisma.BirthOrderByWithRelationInput | Prisma.BirthOrderByWithRelationInput[];
    cursor?: Prisma.BirthWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BirthScalarFieldEnum | Prisma.BirthScalarFieldEnum[];
};
export type BirthFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelect<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    include?: Prisma.BirthInclude<ExtArgs> | null;
    where?: Prisma.BirthWhereInput;
    orderBy?: Prisma.BirthOrderByWithRelationInput | Prisma.BirthOrderByWithRelationInput[];
    cursor?: Prisma.BirthWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BirthScalarFieldEnum | Prisma.BirthScalarFieldEnum[];
};
export type BirthCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelect<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    include?: Prisma.BirthInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BirthCreateInput, Prisma.BirthUncheckedCreateInput>;
};
export type BirthCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BirthCreateManyInput | Prisma.BirthCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BirthCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    data: Prisma.BirthCreateManyInput | Prisma.BirthCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BirthIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BirthUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelect<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    include?: Prisma.BirthInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BirthUpdateInput, Prisma.BirthUncheckedUpdateInput>;
    where: Prisma.BirthWhereUniqueInput;
};
export type BirthUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BirthUpdateManyMutationInput, Prisma.BirthUncheckedUpdateManyInput>;
    where?: Prisma.BirthWhereInput;
    limit?: number;
};
export type BirthUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BirthUpdateManyMutationInput, Prisma.BirthUncheckedUpdateManyInput>;
    where?: Prisma.BirthWhereInput;
    limit?: number;
    include?: Prisma.BirthIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BirthUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelect<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    include?: Prisma.BirthInclude<ExtArgs> | null;
    where: Prisma.BirthWhereUniqueInput;
    create: Prisma.XOR<Prisma.BirthCreateInput, Prisma.BirthUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BirthUpdateInput, Prisma.BirthUncheckedUpdateInput>;
};
export type BirthDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelect<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    include?: Prisma.BirthInclude<ExtArgs> | null;
    where: Prisma.BirthWhereUniqueInput;
};
export type BirthDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BirthWhereInput;
    limit?: number;
};
export type Birth$litterArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterSelect<ExtArgs> | null;
    omit?: Prisma.LitterOmit<ExtArgs> | null;
    include?: Prisma.LitterInclude<ExtArgs> | null;
    where?: Prisma.LitterWhereInput;
};
export type Birth$farmArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FarmSelect<ExtArgs> | null;
    omit?: Prisma.FarmOmit<ExtArgs> | null;
    include?: Prisma.FarmInclude<ExtArgs> | null;
    where?: Prisma.FarmWhereInput;
};
export type BirthDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BirthSelect<ExtArgs> | null;
    omit?: Prisma.BirthOmit<ExtArgs> | null;
    include?: Prisma.BirthInclude<ExtArgs> | null;
};
