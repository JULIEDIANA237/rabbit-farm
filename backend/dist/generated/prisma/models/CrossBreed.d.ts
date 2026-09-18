import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CrossBreedModel = runtime.Types.Result.DefaultSelection<Prisma.$CrossBreedPayload>;
export type AggregateCrossBreed = {
    _count: CrossBreedCountAggregateOutputType | null;
    _min: CrossBreedMinAggregateOutputType | null;
    _max: CrossBreedMaxAggregateOutputType | null;
};
export type CrossBreedMinAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    name: string | null;
    description: string | null;
    parentBreedAId: string | null;
    parentBreedBId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CrossBreedMaxAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    name: string | null;
    description: string | null;
    parentBreedAId: string | null;
    parentBreedBId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CrossBreedCountAggregateOutputType = {
    id: number;
    farmId: number;
    name: number;
    description: number;
    parentBreedAId: number;
    parentBreedBId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CrossBreedMinAggregateInputType = {
    id?: true;
    farmId?: true;
    name?: true;
    description?: true;
    parentBreedAId?: true;
    parentBreedBId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CrossBreedMaxAggregateInputType = {
    id?: true;
    farmId?: true;
    name?: true;
    description?: true;
    parentBreedAId?: true;
    parentBreedBId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CrossBreedCountAggregateInputType = {
    id?: true;
    farmId?: true;
    name?: true;
    description?: true;
    parentBreedAId?: true;
    parentBreedBId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CrossBreedAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CrossBreedWhereInput;
    orderBy?: Prisma.CrossBreedOrderByWithRelationInput | Prisma.CrossBreedOrderByWithRelationInput[];
    cursor?: Prisma.CrossBreedWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CrossBreedCountAggregateInputType;
    _min?: CrossBreedMinAggregateInputType;
    _max?: CrossBreedMaxAggregateInputType;
};
export type GetCrossBreedAggregateType<T extends CrossBreedAggregateArgs> = {
    [P in keyof T & keyof AggregateCrossBreed]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCrossBreed[P]> : Prisma.GetScalarType<T[P], AggregateCrossBreed[P]>;
};
export type CrossBreedGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CrossBreedWhereInput;
    orderBy?: Prisma.CrossBreedOrderByWithAggregationInput | Prisma.CrossBreedOrderByWithAggregationInput[];
    by: Prisma.CrossBreedScalarFieldEnum[] | Prisma.CrossBreedScalarFieldEnum;
    having?: Prisma.CrossBreedScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CrossBreedCountAggregateInputType | true;
    _min?: CrossBreedMinAggregateInputType;
    _max?: CrossBreedMaxAggregateInputType;
};
export type CrossBreedGroupByOutputType = {
    id: string;
    farmId: string;
    name: string;
    description: string | null;
    parentBreedAId: string;
    parentBreedBId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: CrossBreedCountAggregateOutputType | null;
    _min: CrossBreedMinAggregateOutputType | null;
    _max: CrossBreedMaxAggregateOutputType | null;
};
export type GetCrossBreedGroupByPayload<T extends CrossBreedGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CrossBreedGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CrossBreedGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CrossBreedGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CrossBreedGroupByOutputType[P]>;
}>>;
export type CrossBreedWhereInput = {
    AND?: Prisma.CrossBreedWhereInput | Prisma.CrossBreedWhereInput[];
    OR?: Prisma.CrossBreedWhereInput[];
    NOT?: Prisma.CrossBreedWhereInput | Prisma.CrossBreedWhereInput[];
    id?: Prisma.StringFilter<"CrossBreed"> | string;
    farmId?: Prisma.StringFilter<"CrossBreed"> | string;
    name?: Prisma.StringFilter<"CrossBreed"> | string;
    description?: Prisma.StringNullableFilter<"CrossBreed"> | string | null;
    parentBreedAId?: Prisma.StringFilter<"CrossBreed"> | string;
    parentBreedBId?: Prisma.StringFilter<"CrossBreed"> | string;
    createdAt?: Prisma.DateTimeFilter<"CrossBreed"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CrossBreed"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    parentBreedA?: Prisma.XOR<Prisma.BreedScalarRelationFilter, Prisma.BreedWhereInput>;
    parentBreedB?: Prisma.XOR<Prisma.BreedScalarRelationFilter, Prisma.BreedWhereInput>;
    rabbits?: Prisma.RabbitListRelationFilter;
};
export type CrossBreedOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    parentBreedAId?: Prisma.SortOrder;
    parentBreedBId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    farm?: Prisma.FarmOrderByWithRelationInput;
    parentBreedA?: Prisma.BreedOrderByWithRelationInput;
    parentBreedB?: Prisma.BreedOrderByWithRelationInput;
    rabbits?: Prisma.RabbitOrderByRelationAggregateInput;
};
export type CrossBreedWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    farmId_name?: Prisma.CrossBreedFarmIdNameCompoundUniqueInput;
    AND?: Prisma.CrossBreedWhereInput | Prisma.CrossBreedWhereInput[];
    OR?: Prisma.CrossBreedWhereInput[];
    NOT?: Prisma.CrossBreedWhereInput | Prisma.CrossBreedWhereInput[];
    farmId?: Prisma.StringFilter<"CrossBreed"> | string;
    name?: Prisma.StringFilter<"CrossBreed"> | string;
    description?: Prisma.StringNullableFilter<"CrossBreed"> | string | null;
    parentBreedAId?: Prisma.StringFilter<"CrossBreed"> | string;
    parentBreedBId?: Prisma.StringFilter<"CrossBreed"> | string;
    createdAt?: Prisma.DateTimeFilter<"CrossBreed"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CrossBreed"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    parentBreedA?: Prisma.XOR<Prisma.BreedScalarRelationFilter, Prisma.BreedWhereInput>;
    parentBreedB?: Prisma.XOR<Prisma.BreedScalarRelationFilter, Prisma.BreedWhereInput>;
    rabbits?: Prisma.RabbitListRelationFilter;
}, "id" | "farmId_name">;
export type CrossBreedOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    parentBreedAId?: Prisma.SortOrder;
    parentBreedBId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CrossBreedCountOrderByAggregateInput;
    _max?: Prisma.CrossBreedMaxOrderByAggregateInput;
    _min?: Prisma.CrossBreedMinOrderByAggregateInput;
};
export type CrossBreedScalarWhereWithAggregatesInput = {
    AND?: Prisma.CrossBreedScalarWhereWithAggregatesInput | Prisma.CrossBreedScalarWhereWithAggregatesInput[];
    OR?: Prisma.CrossBreedScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CrossBreedScalarWhereWithAggregatesInput | Prisma.CrossBreedScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"CrossBreed"> | string;
    farmId?: Prisma.StringWithAggregatesFilter<"CrossBreed"> | string;
    name?: Prisma.StringWithAggregatesFilter<"CrossBreed"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"CrossBreed"> | string | null;
    parentBreedAId?: Prisma.StringWithAggregatesFilter<"CrossBreed"> | string;
    parentBreedBId?: Prisma.StringWithAggregatesFilter<"CrossBreed"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CrossBreed"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"CrossBreed"> | Date | string;
};
export type CrossBreedCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutCrossBreedsInput;
    parentBreedA: Prisma.BreedCreateNestedOneWithoutCrossBreedsAsParentAInput;
    parentBreedB: Prisma.BreedCreateNestedOneWithoutCrossBreedsAsParentBInput;
    rabbits?: Prisma.RabbitCreateNestedManyWithoutCrossBreedInput;
};
export type CrossBreedUncheckedCreateInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    parentBreedAId: string;
    parentBreedBId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.RabbitUncheckedCreateNestedManyWithoutCrossBreedInput;
};
export type CrossBreedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutCrossBreedsNestedInput;
    parentBreedA?: Prisma.BreedUpdateOneRequiredWithoutCrossBreedsAsParentANestedInput;
    parentBreedB?: Prisma.BreedUpdateOneRequiredWithoutCrossBreedsAsParentBNestedInput;
    rabbits?: Prisma.RabbitUpdateManyWithoutCrossBreedNestedInput;
};
export type CrossBreedUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parentBreedAId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentBreedBId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.RabbitUncheckedUpdateManyWithoutCrossBreedNestedInput;
};
export type CrossBreedCreateManyInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    parentBreedAId: string;
    parentBreedBId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CrossBreedUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CrossBreedUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parentBreedAId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentBreedBId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CrossBreedListRelationFilter = {
    every?: Prisma.CrossBreedWhereInput;
    some?: Prisma.CrossBreedWhereInput;
    none?: Prisma.CrossBreedWhereInput;
};
export type CrossBreedOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CrossBreedFarmIdNameCompoundUniqueInput = {
    farmId: string;
    name: string;
};
export type CrossBreedCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    parentBreedAId?: Prisma.SortOrder;
    parentBreedBId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CrossBreedMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    parentBreedAId?: Prisma.SortOrder;
    parentBreedBId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CrossBreedMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    parentBreedAId?: Prisma.SortOrder;
    parentBreedBId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CrossBreedNullableScalarRelationFilter = {
    is?: Prisma.CrossBreedWhereInput | null;
    isNot?: Prisma.CrossBreedWhereInput | null;
};
export type CrossBreedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutFarmInput, Prisma.CrossBreedUncheckedCreateWithoutFarmInput> | Prisma.CrossBreedCreateWithoutFarmInput[] | Prisma.CrossBreedUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutFarmInput | Prisma.CrossBreedCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.CrossBreedCreateManyFarmInputEnvelope;
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
};
export type CrossBreedUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutFarmInput, Prisma.CrossBreedUncheckedCreateWithoutFarmInput> | Prisma.CrossBreedCreateWithoutFarmInput[] | Prisma.CrossBreedUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutFarmInput | Prisma.CrossBreedCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.CrossBreedCreateManyFarmInputEnvelope;
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
};
export type CrossBreedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutFarmInput, Prisma.CrossBreedUncheckedCreateWithoutFarmInput> | Prisma.CrossBreedCreateWithoutFarmInput[] | Prisma.CrossBreedUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutFarmInput | Prisma.CrossBreedCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.CrossBreedUpsertWithWhereUniqueWithoutFarmInput | Prisma.CrossBreedUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.CrossBreedCreateManyFarmInputEnvelope;
    set?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    disconnect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    delete?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    update?: Prisma.CrossBreedUpdateWithWhereUniqueWithoutFarmInput | Prisma.CrossBreedUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.CrossBreedUpdateManyWithWhereWithoutFarmInput | Prisma.CrossBreedUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.CrossBreedScalarWhereInput | Prisma.CrossBreedScalarWhereInput[];
};
export type CrossBreedUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutFarmInput, Prisma.CrossBreedUncheckedCreateWithoutFarmInput> | Prisma.CrossBreedCreateWithoutFarmInput[] | Prisma.CrossBreedUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutFarmInput | Prisma.CrossBreedCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.CrossBreedUpsertWithWhereUniqueWithoutFarmInput | Prisma.CrossBreedUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.CrossBreedCreateManyFarmInputEnvelope;
    set?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    disconnect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    delete?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    update?: Prisma.CrossBreedUpdateWithWhereUniqueWithoutFarmInput | Prisma.CrossBreedUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.CrossBreedUpdateManyWithWhereWithoutFarmInput | Prisma.CrossBreedUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.CrossBreedScalarWhereInput | Prisma.CrossBreedScalarWhereInput[];
};
export type CrossBreedCreateNestedManyWithoutParentBreedAInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedAInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedAInput> | Prisma.CrossBreedCreateWithoutParentBreedAInput[] | Prisma.CrossBreedUncheckedCreateWithoutParentBreedAInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutParentBreedAInput | Prisma.CrossBreedCreateOrConnectWithoutParentBreedAInput[];
    createMany?: Prisma.CrossBreedCreateManyParentBreedAInputEnvelope;
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
};
export type CrossBreedCreateNestedManyWithoutParentBreedBInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedBInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedBInput> | Prisma.CrossBreedCreateWithoutParentBreedBInput[] | Prisma.CrossBreedUncheckedCreateWithoutParentBreedBInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutParentBreedBInput | Prisma.CrossBreedCreateOrConnectWithoutParentBreedBInput[];
    createMany?: Prisma.CrossBreedCreateManyParentBreedBInputEnvelope;
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
};
export type CrossBreedUncheckedCreateNestedManyWithoutParentBreedAInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedAInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedAInput> | Prisma.CrossBreedCreateWithoutParentBreedAInput[] | Prisma.CrossBreedUncheckedCreateWithoutParentBreedAInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutParentBreedAInput | Prisma.CrossBreedCreateOrConnectWithoutParentBreedAInput[];
    createMany?: Prisma.CrossBreedCreateManyParentBreedAInputEnvelope;
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
};
export type CrossBreedUncheckedCreateNestedManyWithoutParentBreedBInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedBInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedBInput> | Prisma.CrossBreedCreateWithoutParentBreedBInput[] | Prisma.CrossBreedUncheckedCreateWithoutParentBreedBInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutParentBreedBInput | Prisma.CrossBreedCreateOrConnectWithoutParentBreedBInput[];
    createMany?: Prisma.CrossBreedCreateManyParentBreedBInputEnvelope;
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
};
export type CrossBreedUpdateManyWithoutParentBreedANestedInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedAInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedAInput> | Prisma.CrossBreedCreateWithoutParentBreedAInput[] | Prisma.CrossBreedUncheckedCreateWithoutParentBreedAInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutParentBreedAInput | Prisma.CrossBreedCreateOrConnectWithoutParentBreedAInput[];
    upsert?: Prisma.CrossBreedUpsertWithWhereUniqueWithoutParentBreedAInput | Prisma.CrossBreedUpsertWithWhereUniqueWithoutParentBreedAInput[];
    createMany?: Prisma.CrossBreedCreateManyParentBreedAInputEnvelope;
    set?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    disconnect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    delete?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    update?: Prisma.CrossBreedUpdateWithWhereUniqueWithoutParentBreedAInput | Prisma.CrossBreedUpdateWithWhereUniqueWithoutParentBreedAInput[];
    updateMany?: Prisma.CrossBreedUpdateManyWithWhereWithoutParentBreedAInput | Prisma.CrossBreedUpdateManyWithWhereWithoutParentBreedAInput[];
    deleteMany?: Prisma.CrossBreedScalarWhereInput | Prisma.CrossBreedScalarWhereInput[];
};
export type CrossBreedUpdateManyWithoutParentBreedBNestedInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedBInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedBInput> | Prisma.CrossBreedCreateWithoutParentBreedBInput[] | Prisma.CrossBreedUncheckedCreateWithoutParentBreedBInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutParentBreedBInput | Prisma.CrossBreedCreateOrConnectWithoutParentBreedBInput[];
    upsert?: Prisma.CrossBreedUpsertWithWhereUniqueWithoutParentBreedBInput | Prisma.CrossBreedUpsertWithWhereUniqueWithoutParentBreedBInput[];
    createMany?: Prisma.CrossBreedCreateManyParentBreedBInputEnvelope;
    set?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    disconnect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    delete?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    update?: Prisma.CrossBreedUpdateWithWhereUniqueWithoutParentBreedBInput | Prisma.CrossBreedUpdateWithWhereUniqueWithoutParentBreedBInput[];
    updateMany?: Prisma.CrossBreedUpdateManyWithWhereWithoutParentBreedBInput | Prisma.CrossBreedUpdateManyWithWhereWithoutParentBreedBInput[];
    deleteMany?: Prisma.CrossBreedScalarWhereInput | Prisma.CrossBreedScalarWhereInput[];
};
export type CrossBreedUncheckedUpdateManyWithoutParentBreedANestedInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedAInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedAInput> | Prisma.CrossBreedCreateWithoutParentBreedAInput[] | Prisma.CrossBreedUncheckedCreateWithoutParentBreedAInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutParentBreedAInput | Prisma.CrossBreedCreateOrConnectWithoutParentBreedAInput[];
    upsert?: Prisma.CrossBreedUpsertWithWhereUniqueWithoutParentBreedAInput | Prisma.CrossBreedUpsertWithWhereUniqueWithoutParentBreedAInput[];
    createMany?: Prisma.CrossBreedCreateManyParentBreedAInputEnvelope;
    set?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    disconnect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    delete?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    update?: Prisma.CrossBreedUpdateWithWhereUniqueWithoutParentBreedAInput | Prisma.CrossBreedUpdateWithWhereUniqueWithoutParentBreedAInput[];
    updateMany?: Prisma.CrossBreedUpdateManyWithWhereWithoutParentBreedAInput | Prisma.CrossBreedUpdateManyWithWhereWithoutParentBreedAInput[];
    deleteMany?: Prisma.CrossBreedScalarWhereInput | Prisma.CrossBreedScalarWhereInput[];
};
export type CrossBreedUncheckedUpdateManyWithoutParentBreedBNestedInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedBInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedBInput> | Prisma.CrossBreedCreateWithoutParentBreedBInput[] | Prisma.CrossBreedUncheckedCreateWithoutParentBreedBInput[];
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutParentBreedBInput | Prisma.CrossBreedCreateOrConnectWithoutParentBreedBInput[];
    upsert?: Prisma.CrossBreedUpsertWithWhereUniqueWithoutParentBreedBInput | Prisma.CrossBreedUpsertWithWhereUniqueWithoutParentBreedBInput[];
    createMany?: Prisma.CrossBreedCreateManyParentBreedBInputEnvelope;
    set?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    disconnect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    delete?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    connect?: Prisma.CrossBreedWhereUniqueInput | Prisma.CrossBreedWhereUniqueInput[];
    update?: Prisma.CrossBreedUpdateWithWhereUniqueWithoutParentBreedBInput | Prisma.CrossBreedUpdateWithWhereUniqueWithoutParentBreedBInput[];
    updateMany?: Prisma.CrossBreedUpdateManyWithWhereWithoutParentBreedBInput | Prisma.CrossBreedUpdateManyWithWhereWithoutParentBreedBInput[];
    deleteMany?: Prisma.CrossBreedScalarWhereInput | Prisma.CrossBreedScalarWhereInput[];
};
export type CrossBreedCreateNestedOneWithoutRabbitsInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutRabbitsInput, Prisma.CrossBreedUncheckedCreateWithoutRabbitsInput>;
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutRabbitsInput;
    connect?: Prisma.CrossBreedWhereUniqueInput;
};
export type CrossBreedUpdateOneWithoutRabbitsNestedInput = {
    create?: Prisma.XOR<Prisma.CrossBreedCreateWithoutRabbitsInput, Prisma.CrossBreedUncheckedCreateWithoutRabbitsInput>;
    connectOrCreate?: Prisma.CrossBreedCreateOrConnectWithoutRabbitsInput;
    upsert?: Prisma.CrossBreedUpsertWithoutRabbitsInput;
    disconnect?: Prisma.CrossBreedWhereInput | boolean;
    delete?: Prisma.CrossBreedWhereInput | boolean;
    connect?: Prisma.CrossBreedWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CrossBreedUpdateToOneWithWhereWithoutRabbitsInput, Prisma.CrossBreedUpdateWithoutRabbitsInput>, Prisma.CrossBreedUncheckedUpdateWithoutRabbitsInput>;
};
export type CrossBreedCreateWithoutFarmInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    parentBreedA: Prisma.BreedCreateNestedOneWithoutCrossBreedsAsParentAInput;
    parentBreedB: Prisma.BreedCreateNestedOneWithoutCrossBreedsAsParentBInput;
    rabbits?: Prisma.RabbitCreateNestedManyWithoutCrossBreedInput;
};
export type CrossBreedUncheckedCreateWithoutFarmInput = {
    id?: string;
    name: string;
    description?: string | null;
    parentBreedAId: string;
    parentBreedBId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.RabbitUncheckedCreateNestedManyWithoutCrossBreedInput;
};
export type CrossBreedCreateOrConnectWithoutFarmInput = {
    where: Prisma.CrossBreedWhereUniqueInput;
    create: Prisma.XOR<Prisma.CrossBreedCreateWithoutFarmInput, Prisma.CrossBreedUncheckedCreateWithoutFarmInput>;
};
export type CrossBreedCreateManyFarmInputEnvelope = {
    data: Prisma.CrossBreedCreateManyFarmInput | Prisma.CrossBreedCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type CrossBreedUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.CrossBreedWhereUniqueInput;
    update: Prisma.XOR<Prisma.CrossBreedUpdateWithoutFarmInput, Prisma.CrossBreedUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.CrossBreedCreateWithoutFarmInput, Prisma.CrossBreedUncheckedCreateWithoutFarmInput>;
};
export type CrossBreedUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.CrossBreedWhereUniqueInput;
    data: Prisma.XOR<Prisma.CrossBreedUpdateWithoutFarmInput, Prisma.CrossBreedUncheckedUpdateWithoutFarmInput>;
};
export type CrossBreedUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.CrossBreedScalarWhereInput;
    data: Prisma.XOR<Prisma.CrossBreedUpdateManyMutationInput, Prisma.CrossBreedUncheckedUpdateManyWithoutFarmInput>;
};
export type CrossBreedScalarWhereInput = {
    AND?: Prisma.CrossBreedScalarWhereInput | Prisma.CrossBreedScalarWhereInput[];
    OR?: Prisma.CrossBreedScalarWhereInput[];
    NOT?: Prisma.CrossBreedScalarWhereInput | Prisma.CrossBreedScalarWhereInput[];
    id?: Prisma.StringFilter<"CrossBreed"> | string;
    farmId?: Prisma.StringFilter<"CrossBreed"> | string;
    name?: Prisma.StringFilter<"CrossBreed"> | string;
    description?: Prisma.StringNullableFilter<"CrossBreed"> | string | null;
    parentBreedAId?: Prisma.StringFilter<"CrossBreed"> | string;
    parentBreedBId?: Prisma.StringFilter<"CrossBreed"> | string;
    createdAt?: Prisma.DateTimeFilter<"CrossBreed"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CrossBreed"> | Date | string;
};
export type CrossBreedCreateWithoutParentBreedAInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutCrossBreedsInput;
    parentBreedB: Prisma.BreedCreateNestedOneWithoutCrossBreedsAsParentBInput;
    rabbits?: Prisma.RabbitCreateNestedManyWithoutCrossBreedInput;
};
export type CrossBreedUncheckedCreateWithoutParentBreedAInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    parentBreedBId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.RabbitUncheckedCreateNestedManyWithoutCrossBreedInput;
};
export type CrossBreedCreateOrConnectWithoutParentBreedAInput = {
    where: Prisma.CrossBreedWhereUniqueInput;
    create: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedAInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedAInput>;
};
export type CrossBreedCreateManyParentBreedAInputEnvelope = {
    data: Prisma.CrossBreedCreateManyParentBreedAInput | Prisma.CrossBreedCreateManyParentBreedAInput[];
    skipDuplicates?: boolean;
};
export type CrossBreedCreateWithoutParentBreedBInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutCrossBreedsInput;
    parentBreedA: Prisma.BreedCreateNestedOneWithoutCrossBreedsAsParentAInput;
    rabbits?: Prisma.RabbitCreateNestedManyWithoutCrossBreedInput;
};
export type CrossBreedUncheckedCreateWithoutParentBreedBInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    parentBreedAId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.RabbitUncheckedCreateNestedManyWithoutCrossBreedInput;
};
export type CrossBreedCreateOrConnectWithoutParentBreedBInput = {
    where: Prisma.CrossBreedWhereUniqueInput;
    create: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedBInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedBInput>;
};
export type CrossBreedCreateManyParentBreedBInputEnvelope = {
    data: Prisma.CrossBreedCreateManyParentBreedBInput | Prisma.CrossBreedCreateManyParentBreedBInput[];
    skipDuplicates?: boolean;
};
export type CrossBreedUpsertWithWhereUniqueWithoutParentBreedAInput = {
    where: Prisma.CrossBreedWhereUniqueInput;
    update: Prisma.XOR<Prisma.CrossBreedUpdateWithoutParentBreedAInput, Prisma.CrossBreedUncheckedUpdateWithoutParentBreedAInput>;
    create: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedAInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedAInput>;
};
export type CrossBreedUpdateWithWhereUniqueWithoutParentBreedAInput = {
    where: Prisma.CrossBreedWhereUniqueInput;
    data: Prisma.XOR<Prisma.CrossBreedUpdateWithoutParentBreedAInput, Prisma.CrossBreedUncheckedUpdateWithoutParentBreedAInput>;
};
export type CrossBreedUpdateManyWithWhereWithoutParentBreedAInput = {
    where: Prisma.CrossBreedScalarWhereInput;
    data: Prisma.XOR<Prisma.CrossBreedUpdateManyMutationInput, Prisma.CrossBreedUncheckedUpdateManyWithoutParentBreedAInput>;
};
export type CrossBreedUpsertWithWhereUniqueWithoutParentBreedBInput = {
    where: Prisma.CrossBreedWhereUniqueInput;
    update: Prisma.XOR<Prisma.CrossBreedUpdateWithoutParentBreedBInput, Prisma.CrossBreedUncheckedUpdateWithoutParentBreedBInput>;
    create: Prisma.XOR<Prisma.CrossBreedCreateWithoutParentBreedBInput, Prisma.CrossBreedUncheckedCreateWithoutParentBreedBInput>;
};
export type CrossBreedUpdateWithWhereUniqueWithoutParentBreedBInput = {
    where: Prisma.CrossBreedWhereUniqueInput;
    data: Prisma.XOR<Prisma.CrossBreedUpdateWithoutParentBreedBInput, Prisma.CrossBreedUncheckedUpdateWithoutParentBreedBInput>;
};
export type CrossBreedUpdateManyWithWhereWithoutParentBreedBInput = {
    where: Prisma.CrossBreedScalarWhereInput;
    data: Prisma.XOR<Prisma.CrossBreedUpdateManyMutationInput, Prisma.CrossBreedUncheckedUpdateManyWithoutParentBreedBInput>;
};
export type CrossBreedCreateWithoutRabbitsInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutCrossBreedsInput;
    parentBreedA: Prisma.BreedCreateNestedOneWithoutCrossBreedsAsParentAInput;
    parentBreedB: Prisma.BreedCreateNestedOneWithoutCrossBreedsAsParentBInput;
};
export type CrossBreedUncheckedCreateWithoutRabbitsInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    parentBreedAId: string;
    parentBreedBId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CrossBreedCreateOrConnectWithoutRabbitsInput = {
    where: Prisma.CrossBreedWhereUniqueInput;
    create: Prisma.XOR<Prisma.CrossBreedCreateWithoutRabbitsInput, Prisma.CrossBreedUncheckedCreateWithoutRabbitsInput>;
};
export type CrossBreedUpsertWithoutRabbitsInput = {
    update: Prisma.XOR<Prisma.CrossBreedUpdateWithoutRabbitsInput, Prisma.CrossBreedUncheckedUpdateWithoutRabbitsInput>;
    create: Prisma.XOR<Prisma.CrossBreedCreateWithoutRabbitsInput, Prisma.CrossBreedUncheckedCreateWithoutRabbitsInput>;
    where?: Prisma.CrossBreedWhereInput;
};
export type CrossBreedUpdateToOneWithWhereWithoutRabbitsInput = {
    where?: Prisma.CrossBreedWhereInput;
    data: Prisma.XOR<Prisma.CrossBreedUpdateWithoutRabbitsInput, Prisma.CrossBreedUncheckedUpdateWithoutRabbitsInput>;
};
export type CrossBreedUpdateWithoutRabbitsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutCrossBreedsNestedInput;
    parentBreedA?: Prisma.BreedUpdateOneRequiredWithoutCrossBreedsAsParentANestedInput;
    parentBreedB?: Prisma.BreedUpdateOneRequiredWithoutCrossBreedsAsParentBNestedInput;
};
export type CrossBreedUncheckedUpdateWithoutRabbitsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parentBreedAId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentBreedBId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CrossBreedCreateManyFarmInput = {
    id?: string;
    name: string;
    description?: string | null;
    parentBreedAId: string;
    parentBreedBId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CrossBreedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    parentBreedA?: Prisma.BreedUpdateOneRequiredWithoutCrossBreedsAsParentANestedInput;
    parentBreedB?: Prisma.BreedUpdateOneRequiredWithoutCrossBreedsAsParentBNestedInput;
    rabbits?: Prisma.RabbitUpdateManyWithoutCrossBreedNestedInput;
};
export type CrossBreedUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parentBreedAId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentBreedBId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.RabbitUncheckedUpdateManyWithoutCrossBreedNestedInput;
};
export type CrossBreedUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parentBreedAId?: Prisma.StringFieldUpdateOperationsInput | string;
    parentBreedBId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CrossBreedCreateManyParentBreedAInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    parentBreedBId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CrossBreedCreateManyParentBreedBInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    parentBreedAId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CrossBreedUpdateWithoutParentBreedAInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutCrossBreedsNestedInput;
    parentBreedB?: Prisma.BreedUpdateOneRequiredWithoutCrossBreedsAsParentBNestedInput;
    rabbits?: Prisma.RabbitUpdateManyWithoutCrossBreedNestedInput;
};
export type CrossBreedUncheckedUpdateWithoutParentBreedAInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parentBreedBId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.RabbitUncheckedUpdateManyWithoutCrossBreedNestedInput;
};
export type CrossBreedUncheckedUpdateManyWithoutParentBreedAInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parentBreedBId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CrossBreedUpdateWithoutParentBreedBInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutCrossBreedsNestedInput;
    parentBreedA?: Prisma.BreedUpdateOneRequiredWithoutCrossBreedsAsParentANestedInput;
    rabbits?: Prisma.RabbitUpdateManyWithoutCrossBreedNestedInput;
};
export type CrossBreedUncheckedUpdateWithoutParentBreedBInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parentBreedAId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.RabbitUncheckedUpdateManyWithoutCrossBreedNestedInput;
};
export type CrossBreedUncheckedUpdateManyWithoutParentBreedBInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    parentBreedAId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CrossBreedCountOutputType = {
    rabbits: number;
};
export type CrossBreedCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbits?: boolean | CrossBreedCountOutputTypeCountRabbitsArgs;
};
export type CrossBreedCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedCountOutputTypeSelect<ExtArgs> | null;
};
export type CrossBreedCountOutputTypeCountRabbitsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RabbitWhereInput;
};
export type CrossBreedSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    description?: boolean;
    parentBreedAId?: boolean;
    parentBreedBId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    parentBreedA?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
    parentBreedB?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
    rabbits?: boolean | Prisma.CrossBreed$rabbitsArgs<ExtArgs>;
    _count?: boolean | Prisma.CrossBreedCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["crossBreed"]>;
export type CrossBreedSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    description?: boolean;
    parentBreedAId?: boolean;
    parentBreedBId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    parentBreedA?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
    parentBreedB?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["crossBreed"]>;
export type CrossBreedSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    description?: boolean;
    parentBreedAId?: boolean;
    parentBreedBId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    parentBreedA?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
    parentBreedB?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["crossBreed"]>;
export type CrossBreedSelectScalar = {
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    description?: boolean;
    parentBreedAId?: boolean;
    parentBreedBId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CrossBreedOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farmId" | "name" | "description" | "parentBreedAId" | "parentBreedBId" | "createdAt" | "updatedAt", ExtArgs["result"]["crossBreed"]>;
export type CrossBreedInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    parentBreedA?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
    parentBreedB?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
    rabbits?: boolean | Prisma.CrossBreed$rabbitsArgs<ExtArgs>;
    _count?: boolean | Prisma.CrossBreedCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CrossBreedIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    parentBreedA?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
    parentBreedB?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
};
export type CrossBreedIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    parentBreedA?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
    parentBreedB?: boolean | Prisma.BreedDefaultArgs<ExtArgs>;
};
export type $CrossBreedPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CrossBreed";
    objects: {
        farm: Prisma.$FarmPayload<ExtArgs>;
        parentBreedA: Prisma.$BreedPayload<ExtArgs>;
        parentBreedB: Prisma.$BreedPayload<ExtArgs>;
        rabbits: Prisma.$RabbitPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farmId: string;
        name: string;
        description: string | null;
        parentBreedAId: string;
        parentBreedBId: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["crossBreed"]>;
    composites: {};
};
export type CrossBreedGetPayload<S extends boolean | null | undefined | CrossBreedDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload, S>;
export type CrossBreedCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CrossBreedFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CrossBreedCountAggregateInputType | true;
};
export interface CrossBreedDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CrossBreed'];
        meta: {
            name: 'CrossBreed';
        };
    };
    findUnique<T extends CrossBreedFindUniqueArgs>(args: Prisma.SelectSubset<T, CrossBreedFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CrossBreedClient<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CrossBreedFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CrossBreedFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CrossBreedClient<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CrossBreedFindFirstArgs>(args?: Prisma.SelectSubset<T, CrossBreedFindFirstArgs<ExtArgs>>): Prisma.Prisma__CrossBreedClient<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CrossBreedFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CrossBreedFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CrossBreedClient<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CrossBreedFindManyArgs>(args?: Prisma.SelectSubset<T, CrossBreedFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CrossBreedCreateArgs>(args: Prisma.SelectSubset<T, CrossBreedCreateArgs<ExtArgs>>): Prisma.Prisma__CrossBreedClient<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CrossBreedCreateManyArgs>(args?: Prisma.SelectSubset<T, CrossBreedCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CrossBreedCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CrossBreedCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CrossBreedDeleteArgs>(args: Prisma.SelectSubset<T, CrossBreedDeleteArgs<ExtArgs>>): Prisma.Prisma__CrossBreedClient<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CrossBreedUpdateArgs>(args: Prisma.SelectSubset<T, CrossBreedUpdateArgs<ExtArgs>>): Prisma.Prisma__CrossBreedClient<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CrossBreedDeleteManyArgs>(args?: Prisma.SelectSubset<T, CrossBreedDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CrossBreedUpdateManyArgs>(args: Prisma.SelectSubset<T, CrossBreedUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CrossBreedUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CrossBreedUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CrossBreedUpsertArgs>(args: Prisma.SelectSubset<T, CrossBreedUpsertArgs<ExtArgs>>): Prisma.Prisma__CrossBreedClient<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CrossBreedCountArgs>(args?: Prisma.Subset<T, CrossBreedCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CrossBreedCountAggregateOutputType> : number>;
    aggregate<T extends CrossBreedAggregateArgs>(args: Prisma.Subset<T, CrossBreedAggregateArgs>): Prisma.PrismaPromise<GetCrossBreedAggregateType<T>>;
    groupBy<T extends CrossBreedGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CrossBreedGroupByArgs['orderBy'];
    } : {
        orderBy?: CrossBreedGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CrossBreedGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCrossBreedGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CrossBreedFieldRefs;
}
export interface Prisma__CrossBreedClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farm<T extends Prisma.FarmDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FarmDefaultArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    parentBreedA<T extends Prisma.BreedDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BreedDefaultArgs<ExtArgs>>): Prisma.Prisma__BreedClient<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    parentBreedB<T extends Prisma.BreedDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BreedDefaultArgs<ExtArgs>>): Prisma.Prisma__BreedClient<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    rabbits<T extends Prisma.CrossBreed$rabbitsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CrossBreed$rabbitsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CrossBreedFieldRefs {
    readonly id: Prisma.FieldRef<"CrossBreed", 'String'>;
    readonly farmId: Prisma.FieldRef<"CrossBreed", 'String'>;
    readonly name: Prisma.FieldRef<"CrossBreed", 'String'>;
    readonly description: Prisma.FieldRef<"CrossBreed", 'String'>;
    readonly parentBreedAId: Prisma.FieldRef<"CrossBreed", 'String'>;
    readonly parentBreedBId: Prisma.FieldRef<"CrossBreed", 'String'>;
    readonly createdAt: Prisma.FieldRef<"CrossBreed", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"CrossBreed", 'DateTime'>;
}
export type CrossBreedFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelect<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    include?: Prisma.CrossBreedInclude<ExtArgs> | null;
    where: Prisma.CrossBreedWhereUniqueInput;
};
export type CrossBreedFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelect<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    include?: Prisma.CrossBreedInclude<ExtArgs> | null;
    where: Prisma.CrossBreedWhereUniqueInput;
};
export type CrossBreedFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelect<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    include?: Prisma.CrossBreedInclude<ExtArgs> | null;
    where?: Prisma.CrossBreedWhereInput;
    orderBy?: Prisma.CrossBreedOrderByWithRelationInput | Prisma.CrossBreedOrderByWithRelationInput[];
    cursor?: Prisma.CrossBreedWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CrossBreedScalarFieldEnum | Prisma.CrossBreedScalarFieldEnum[];
};
export type CrossBreedFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelect<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    include?: Prisma.CrossBreedInclude<ExtArgs> | null;
    where?: Prisma.CrossBreedWhereInput;
    orderBy?: Prisma.CrossBreedOrderByWithRelationInput | Prisma.CrossBreedOrderByWithRelationInput[];
    cursor?: Prisma.CrossBreedWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CrossBreedScalarFieldEnum | Prisma.CrossBreedScalarFieldEnum[];
};
export type CrossBreedFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelect<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    include?: Prisma.CrossBreedInclude<ExtArgs> | null;
    where?: Prisma.CrossBreedWhereInput;
    orderBy?: Prisma.CrossBreedOrderByWithRelationInput | Prisma.CrossBreedOrderByWithRelationInput[];
    cursor?: Prisma.CrossBreedWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CrossBreedScalarFieldEnum | Prisma.CrossBreedScalarFieldEnum[];
};
export type CrossBreedCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelect<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    include?: Prisma.CrossBreedInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CrossBreedCreateInput, Prisma.CrossBreedUncheckedCreateInput>;
};
export type CrossBreedCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CrossBreedCreateManyInput | Prisma.CrossBreedCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CrossBreedCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    data: Prisma.CrossBreedCreateManyInput | Prisma.CrossBreedCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CrossBreedIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CrossBreedUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelect<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    include?: Prisma.CrossBreedInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CrossBreedUpdateInput, Prisma.CrossBreedUncheckedUpdateInput>;
    where: Prisma.CrossBreedWhereUniqueInput;
};
export type CrossBreedUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CrossBreedUpdateManyMutationInput, Prisma.CrossBreedUncheckedUpdateManyInput>;
    where?: Prisma.CrossBreedWhereInput;
    limit?: number;
};
export type CrossBreedUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CrossBreedUpdateManyMutationInput, Prisma.CrossBreedUncheckedUpdateManyInput>;
    where?: Prisma.CrossBreedWhereInput;
    limit?: number;
    include?: Prisma.CrossBreedIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CrossBreedUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelect<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    include?: Prisma.CrossBreedInclude<ExtArgs> | null;
    where: Prisma.CrossBreedWhereUniqueInput;
    create: Prisma.XOR<Prisma.CrossBreedCreateInput, Prisma.CrossBreedUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CrossBreedUpdateInput, Prisma.CrossBreedUncheckedUpdateInput>;
};
export type CrossBreedDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelect<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    include?: Prisma.CrossBreedInclude<ExtArgs> | null;
    where: Prisma.CrossBreedWhereUniqueInput;
};
export type CrossBreedDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CrossBreedWhereInput;
    limit?: number;
};
export type CrossBreed$rabbitsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitSelect<ExtArgs> | null;
    omit?: Prisma.RabbitOmit<ExtArgs> | null;
    include?: Prisma.RabbitInclude<ExtArgs> | null;
    where?: Prisma.RabbitWhereInput;
    orderBy?: Prisma.RabbitOrderByWithRelationInput | Prisma.RabbitOrderByWithRelationInput[];
    cursor?: Prisma.RabbitWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RabbitScalarFieldEnum | Prisma.RabbitScalarFieldEnum[];
};
export type CrossBreedDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrossBreedSelect<ExtArgs> | null;
    omit?: Prisma.CrossBreedOmit<ExtArgs> | null;
    include?: Prisma.CrossBreedInclude<ExtArgs> | null;
};
