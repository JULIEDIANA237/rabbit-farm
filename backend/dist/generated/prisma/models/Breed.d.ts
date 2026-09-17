import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type BreedModel = runtime.Types.Result.DefaultSelection<Prisma.$BreedPayload>;
export type AggregateBreed = {
    _count: BreedCountAggregateOutputType | null;
    _min: BreedMinAggregateOutputType | null;
    _max: BreedMaxAggregateOutputType | null;
};
export type BreedMinAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    name: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BreedMaxAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    name: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BreedCountAggregateOutputType = {
    id: number;
    farmId: number;
    name: number;
    description: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BreedMinAggregateInputType = {
    id?: true;
    farmId?: true;
    name?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BreedMaxAggregateInputType = {
    id?: true;
    farmId?: true;
    name?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BreedCountAggregateInputType = {
    id?: true;
    farmId?: true;
    name?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BreedAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BreedWhereInput;
    orderBy?: Prisma.BreedOrderByWithRelationInput | Prisma.BreedOrderByWithRelationInput[];
    cursor?: Prisma.BreedWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BreedCountAggregateInputType;
    _min?: BreedMinAggregateInputType;
    _max?: BreedMaxAggregateInputType;
};
export type GetBreedAggregateType<T extends BreedAggregateArgs> = {
    [P in keyof T & keyof AggregateBreed]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBreed[P]> : Prisma.GetScalarType<T[P], AggregateBreed[P]>;
};
export type BreedGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BreedWhereInput;
    orderBy?: Prisma.BreedOrderByWithAggregationInput | Prisma.BreedOrderByWithAggregationInput[];
    by: Prisma.BreedScalarFieldEnum[] | Prisma.BreedScalarFieldEnum;
    having?: Prisma.BreedScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BreedCountAggregateInputType | true;
    _min?: BreedMinAggregateInputType;
    _max?: BreedMaxAggregateInputType;
};
export type BreedGroupByOutputType = {
    id: string;
    farmId: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: BreedCountAggregateOutputType | null;
    _min: BreedMinAggregateOutputType | null;
    _max: BreedMaxAggregateOutputType | null;
};
export type GetBreedGroupByPayload<T extends BreedGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BreedGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BreedGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BreedGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BreedGroupByOutputType[P]>;
}>>;
export type BreedWhereInput = {
    AND?: Prisma.BreedWhereInput | Prisma.BreedWhereInput[];
    OR?: Prisma.BreedWhereInput[];
    NOT?: Prisma.BreedWhereInput | Prisma.BreedWhereInput[];
    id?: Prisma.StringFilter<"Breed"> | string;
    farmId?: Prisma.StringFilter<"Breed"> | string;
    name?: Prisma.StringFilter<"Breed"> | string;
    description?: Prisma.StringNullableFilter<"Breed"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Breed"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Breed"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    rabbits?: Prisma.RabbitListRelationFilter;
    crossBreedA?: Prisma.CrossBreedListRelationFilter;
    crossBreedB?: Prisma.CrossBreedListRelationFilter;
};
export type BreedOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    farm?: Prisma.FarmOrderByWithRelationInput;
    rabbits?: Prisma.RabbitOrderByRelationAggregateInput;
    crossBreedA?: Prisma.CrossBreedOrderByRelationAggregateInput;
    crossBreedB?: Prisma.CrossBreedOrderByRelationAggregateInput;
};
export type BreedWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    farmId_name?: Prisma.BreedFarmIdNameCompoundUniqueInput;
    AND?: Prisma.BreedWhereInput | Prisma.BreedWhereInput[];
    OR?: Prisma.BreedWhereInput[];
    NOT?: Prisma.BreedWhereInput | Prisma.BreedWhereInput[];
    farmId?: Prisma.StringFilter<"Breed"> | string;
    name?: Prisma.StringFilter<"Breed"> | string;
    description?: Prisma.StringNullableFilter<"Breed"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Breed"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Breed"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    rabbits?: Prisma.RabbitListRelationFilter;
    crossBreedA?: Prisma.CrossBreedListRelationFilter;
    crossBreedB?: Prisma.CrossBreedListRelationFilter;
}, "id" | "farmId_name">;
export type BreedOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BreedCountOrderByAggregateInput;
    _max?: Prisma.BreedMaxOrderByAggregateInput;
    _min?: Prisma.BreedMinOrderByAggregateInput;
};
export type BreedScalarWhereWithAggregatesInput = {
    AND?: Prisma.BreedScalarWhereWithAggregatesInput | Prisma.BreedScalarWhereWithAggregatesInput[];
    OR?: Prisma.BreedScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BreedScalarWhereWithAggregatesInput | Prisma.BreedScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Breed"> | string;
    farmId?: Prisma.StringWithAggregatesFilter<"Breed"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Breed"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Breed"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Breed"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Breed"> | Date | string;
};
export type BreedCreateInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutBreedsInput;
    rabbits?: Prisma.RabbitCreateNestedManyWithoutBreedInput;
    crossBreedA?: Prisma.CrossBreedCreateNestedManyWithoutBreedAInput;
    crossBreedB?: Prisma.CrossBreedCreateNestedManyWithoutBreedBInput;
};
export type BreedUncheckedCreateInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.RabbitUncheckedCreateNestedManyWithoutBreedInput;
    crossBreedA?: Prisma.CrossBreedUncheckedCreateNestedManyWithoutBreedAInput;
    crossBreedB?: Prisma.CrossBreedUncheckedCreateNestedManyWithoutBreedBInput;
};
export type BreedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutBreedsNestedInput;
    rabbits?: Prisma.RabbitUpdateManyWithoutBreedNestedInput;
    crossBreedA?: Prisma.CrossBreedUpdateManyWithoutBreedANestedInput;
    crossBreedB?: Prisma.CrossBreedUpdateManyWithoutBreedBNestedInput;
};
export type BreedUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.RabbitUncheckedUpdateManyWithoutBreedNestedInput;
    crossBreedA?: Prisma.CrossBreedUncheckedUpdateManyWithoutBreedANestedInput;
    crossBreedB?: Prisma.CrossBreedUncheckedUpdateManyWithoutBreedBNestedInput;
};
export type BreedCreateManyInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BreedUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BreedUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BreedListRelationFilter = {
    every?: Prisma.BreedWhereInput;
    some?: Prisma.BreedWhereInput;
    none?: Prisma.BreedWhereInput;
};
export type BreedOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BreedFarmIdNameCompoundUniqueInput = {
    farmId: string;
    name: string;
};
export type BreedCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BreedMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BreedMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BreedScalarRelationFilter = {
    is?: Prisma.BreedWhereInput;
    isNot?: Prisma.BreedWhereInput;
};
export type BreedNullableScalarRelationFilter = {
    is?: Prisma.BreedWhereInput | null;
    isNot?: Prisma.BreedWhereInput | null;
};
export type BreedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.BreedCreateWithoutFarmInput, Prisma.BreedUncheckedCreateWithoutFarmInput> | Prisma.BreedCreateWithoutFarmInput[] | Prisma.BreedUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.BreedCreateOrConnectWithoutFarmInput | Prisma.BreedCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.BreedCreateManyFarmInputEnvelope;
    connect?: Prisma.BreedWhereUniqueInput | Prisma.BreedWhereUniqueInput[];
};
export type BreedUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.BreedCreateWithoutFarmInput, Prisma.BreedUncheckedCreateWithoutFarmInput> | Prisma.BreedCreateWithoutFarmInput[] | Prisma.BreedUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.BreedCreateOrConnectWithoutFarmInput | Prisma.BreedCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.BreedCreateManyFarmInputEnvelope;
    connect?: Prisma.BreedWhereUniqueInput | Prisma.BreedWhereUniqueInput[];
};
export type BreedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.BreedCreateWithoutFarmInput, Prisma.BreedUncheckedCreateWithoutFarmInput> | Prisma.BreedCreateWithoutFarmInput[] | Prisma.BreedUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.BreedCreateOrConnectWithoutFarmInput | Prisma.BreedCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.BreedUpsertWithWhereUniqueWithoutFarmInput | Prisma.BreedUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.BreedCreateManyFarmInputEnvelope;
    set?: Prisma.BreedWhereUniqueInput | Prisma.BreedWhereUniqueInput[];
    disconnect?: Prisma.BreedWhereUniqueInput | Prisma.BreedWhereUniqueInput[];
    delete?: Prisma.BreedWhereUniqueInput | Prisma.BreedWhereUniqueInput[];
    connect?: Prisma.BreedWhereUniqueInput | Prisma.BreedWhereUniqueInput[];
    update?: Prisma.BreedUpdateWithWhereUniqueWithoutFarmInput | Prisma.BreedUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.BreedUpdateManyWithWhereWithoutFarmInput | Prisma.BreedUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.BreedScalarWhereInput | Prisma.BreedScalarWhereInput[];
};
export type BreedUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.BreedCreateWithoutFarmInput, Prisma.BreedUncheckedCreateWithoutFarmInput> | Prisma.BreedCreateWithoutFarmInput[] | Prisma.BreedUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.BreedCreateOrConnectWithoutFarmInput | Prisma.BreedCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.BreedUpsertWithWhereUniqueWithoutFarmInput | Prisma.BreedUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.BreedCreateManyFarmInputEnvelope;
    set?: Prisma.BreedWhereUniqueInput | Prisma.BreedWhereUniqueInput[];
    disconnect?: Prisma.BreedWhereUniqueInput | Prisma.BreedWhereUniqueInput[];
    delete?: Prisma.BreedWhereUniqueInput | Prisma.BreedWhereUniqueInput[];
    connect?: Prisma.BreedWhereUniqueInput | Prisma.BreedWhereUniqueInput[];
    update?: Prisma.BreedUpdateWithWhereUniqueWithoutFarmInput | Prisma.BreedUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.BreedUpdateManyWithWhereWithoutFarmInput | Prisma.BreedUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.BreedScalarWhereInput | Prisma.BreedScalarWhereInput[];
};
export type BreedCreateNestedOneWithoutCrossBreedAInput = {
    create?: Prisma.XOR<Prisma.BreedCreateWithoutCrossBreedAInput, Prisma.BreedUncheckedCreateWithoutCrossBreedAInput>;
    connectOrCreate?: Prisma.BreedCreateOrConnectWithoutCrossBreedAInput;
    connect?: Prisma.BreedWhereUniqueInput;
};
export type BreedCreateNestedOneWithoutCrossBreedBInput = {
    create?: Prisma.XOR<Prisma.BreedCreateWithoutCrossBreedBInput, Prisma.BreedUncheckedCreateWithoutCrossBreedBInput>;
    connectOrCreate?: Prisma.BreedCreateOrConnectWithoutCrossBreedBInput;
    connect?: Prisma.BreedWhereUniqueInput;
};
export type BreedUpdateOneRequiredWithoutCrossBreedANestedInput = {
    create?: Prisma.XOR<Prisma.BreedCreateWithoutCrossBreedAInput, Prisma.BreedUncheckedCreateWithoutCrossBreedAInput>;
    connectOrCreate?: Prisma.BreedCreateOrConnectWithoutCrossBreedAInput;
    upsert?: Prisma.BreedUpsertWithoutCrossBreedAInput;
    connect?: Prisma.BreedWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BreedUpdateToOneWithWhereWithoutCrossBreedAInput, Prisma.BreedUpdateWithoutCrossBreedAInput>, Prisma.BreedUncheckedUpdateWithoutCrossBreedAInput>;
};
export type BreedUpdateOneRequiredWithoutCrossBreedBNestedInput = {
    create?: Prisma.XOR<Prisma.BreedCreateWithoutCrossBreedBInput, Prisma.BreedUncheckedCreateWithoutCrossBreedBInput>;
    connectOrCreate?: Prisma.BreedCreateOrConnectWithoutCrossBreedBInput;
    upsert?: Prisma.BreedUpsertWithoutCrossBreedBInput;
    connect?: Prisma.BreedWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BreedUpdateToOneWithWhereWithoutCrossBreedBInput, Prisma.BreedUpdateWithoutCrossBreedBInput>, Prisma.BreedUncheckedUpdateWithoutCrossBreedBInput>;
};
export type BreedCreateNestedOneWithoutRabbitsInput = {
    create?: Prisma.XOR<Prisma.BreedCreateWithoutRabbitsInput, Prisma.BreedUncheckedCreateWithoutRabbitsInput>;
    connectOrCreate?: Prisma.BreedCreateOrConnectWithoutRabbitsInput;
    connect?: Prisma.BreedWhereUniqueInput;
};
export type BreedUpdateOneWithoutRabbitsNestedInput = {
    create?: Prisma.XOR<Prisma.BreedCreateWithoutRabbitsInput, Prisma.BreedUncheckedCreateWithoutRabbitsInput>;
    connectOrCreate?: Prisma.BreedCreateOrConnectWithoutRabbitsInput;
    upsert?: Prisma.BreedUpsertWithoutRabbitsInput;
    disconnect?: Prisma.BreedWhereInput | boolean;
    delete?: Prisma.BreedWhereInput | boolean;
    connect?: Prisma.BreedWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BreedUpdateToOneWithWhereWithoutRabbitsInput, Prisma.BreedUpdateWithoutRabbitsInput>, Prisma.BreedUncheckedUpdateWithoutRabbitsInput>;
};
export type BreedCreateWithoutFarmInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.RabbitCreateNestedManyWithoutBreedInput;
    crossBreedA?: Prisma.CrossBreedCreateNestedManyWithoutBreedAInput;
    crossBreedB?: Prisma.CrossBreedCreateNestedManyWithoutBreedBInput;
};
export type BreedUncheckedCreateWithoutFarmInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.RabbitUncheckedCreateNestedManyWithoutBreedInput;
    crossBreedA?: Prisma.CrossBreedUncheckedCreateNestedManyWithoutBreedAInput;
    crossBreedB?: Prisma.CrossBreedUncheckedCreateNestedManyWithoutBreedBInput;
};
export type BreedCreateOrConnectWithoutFarmInput = {
    where: Prisma.BreedWhereUniqueInput;
    create: Prisma.XOR<Prisma.BreedCreateWithoutFarmInput, Prisma.BreedUncheckedCreateWithoutFarmInput>;
};
export type BreedCreateManyFarmInputEnvelope = {
    data: Prisma.BreedCreateManyFarmInput | Prisma.BreedCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type BreedUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.BreedWhereUniqueInput;
    update: Prisma.XOR<Prisma.BreedUpdateWithoutFarmInput, Prisma.BreedUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.BreedCreateWithoutFarmInput, Prisma.BreedUncheckedCreateWithoutFarmInput>;
};
export type BreedUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.BreedWhereUniqueInput;
    data: Prisma.XOR<Prisma.BreedUpdateWithoutFarmInput, Prisma.BreedUncheckedUpdateWithoutFarmInput>;
};
export type BreedUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.BreedScalarWhereInput;
    data: Prisma.XOR<Prisma.BreedUpdateManyMutationInput, Prisma.BreedUncheckedUpdateManyWithoutFarmInput>;
};
export type BreedScalarWhereInput = {
    AND?: Prisma.BreedScalarWhereInput | Prisma.BreedScalarWhereInput[];
    OR?: Prisma.BreedScalarWhereInput[];
    NOT?: Prisma.BreedScalarWhereInput | Prisma.BreedScalarWhereInput[];
    id?: Prisma.StringFilter<"Breed"> | string;
    farmId?: Prisma.StringFilter<"Breed"> | string;
    name?: Prisma.StringFilter<"Breed"> | string;
    description?: Prisma.StringNullableFilter<"Breed"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Breed"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Breed"> | Date | string;
};
export type BreedCreateWithoutCrossBreedAInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutBreedsInput;
    rabbits?: Prisma.RabbitCreateNestedManyWithoutBreedInput;
    crossBreedB?: Prisma.CrossBreedCreateNestedManyWithoutBreedBInput;
};
export type BreedUncheckedCreateWithoutCrossBreedAInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.RabbitUncheckedCreateNestedManyWithoutBreedInput;
    crossBreedB?: Prisma.CrossBreedUncheckedCreateNestedManyWithoutBreedBInput;
};
export type BreedCreateOrConnectWithoutCrossBreedAInput = {
    where: Prisma.BreedWhereUniqueInput;
    create: Prisma.XOR<Prisma.BreedCreateWithoutCrossBreedAInput, Prisma.BreedUncheckedCreateWithoutCrossBreedAInput>;
};
export type BreedCreateWithoutCrossBreedBInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutBreedsInput;
    rabbits?: Prisma.RabbitCreateNestedManyWithoutBreedInput;
    crossBreedA?: Prisma.CrossBreedCreateNestedManyWithoutBreedAInput;
};
export type BreedUncheckedCreateWithoutCrossBreedBInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.RabbitUncheckedCreateNestedManyWithoutBreedInput;
    crossBreedA?: Prisma.CrossBreedUncheckedCreateNestedManyWithoutBreedAInput;
};
export type BreedCreateOrConnectWithoutCrossBreedBInput = {
    where: Prisma.BreedWhereUniqueInput;
    create: Prisma.XOR<Prisma.BreedCreateWithoutCrossBreedBInput, Prisma.BreedUncheckedCreateWithoutCrossBreedBInput>;
};
export type BreedUpsertWithoutCrossBreedAInput = {
    update: Prisma.XOR<Prisma.BreedUpdateWithoutCrossBreedAInput, Prisma.BreedUncheckedUpdateWithoutCrossBreedAInput>;
    create: Prisma.XOR<Prisma.BreedCreateWithoutCrossBreedAInput, Prisma.BreedUncheckedCreateWithoutCrossBreedAInput>;
    where?: Prisma.BreedWhereInput;
};
export type BreedUpdateToOneWithWhereWithoutCrossBreedAInput = {
    where?: Prisma.BreedWhereInput;
    data: Prisma.XOR<Prisma.BreedUpdateWithoutCrossBreedAInput, Prisma.BreedUncheckedUpdateWithoutCrossBreedAInput>;
};
export type BreedUpdateWithoutCrossBreedAInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutBreedsNestedInput;
    rabbits?: Prisma.RabbitUpdateManyWithoutBreedNestedInput;
    crossBreedB?: Prisma.CrossBreedUpdateManyWithoutBreedBNestedInput;
};
export type BreedUncheckedUpdateWithoutCrossBreedAInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.RabbitUncheckedUpdateManyWithoutBreedNestedInput;
    crossBreedB?: Prisma.CrossBreedUncheckedUpdateManyWithoutBreedBNestedInput;
};
export type BreedUpsertWithoutCrossBreedBInput = {
    update: Prisma.XOR<Prisma.BreedUpdateWithoutCrossBreedBInput, Prisma.BreedUncheckedUpdateWithoutCrossBreedBInput>;
    create: Prisma.XOR<Prisma.BreedCreateWithoutCrossBreedBInput, Prisma.BreedUncheckedCreateWithoutCrossBreedBInput>;
    where?: Prisma.BreedWhereInput;
};
export type BreedUpdateToOneWithWhereWithoutCrossBreedBInput = {
    where?: Prisma.BreedWhereInput;
    data: Prisma.XOR<Prisma.BreedUpdateWithoutCrossBreedBInput, Prisma.BreedUncheckedUpdateWithoutCrossBreedBInput>;
};
export type BreedUpdateWithoutCrossBreedBInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutBreedsNestedInput;
    rabbits?: Prisma.RabbitUpdateManyWithoutBreedNestedInput;
    crossBreedA?: Prisma.CrossBreedUpdateManyWithoutBreedANestedInput;
};
export type BreedUncheckedUpdateWithoutCrossBreedBInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.RabbitUncheckedUpdateManyWithoutBreedNestedInput;
    crossBreedA?: Prisma.CrossBreedUncheckedUpdateManyWithoutBreedANestedInput;
};
export type BreedCreateWithoutRabbitsInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutBreedsInput;
    crossBreedA?: Prisma.CrossBreedCreateNestedManyWithoutBreedAInput;
    crossBreedB?: Prisma.CrossBreedCreateNestedManyWithoutBreedBInput;
};
export type BreedUncheckedCreateWithoutRabbitsInput = {
    id?: string;
    farmId: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    crossBreedA?: Prisma.CrossBreedUncheckedCreateNestedManyWithoutBreedAInput;
    crossBreedB?: Prisma.CrossBreedUncheckedCreateNestedManyWithoutBreedBInput;
};
export type BreedCreateOrConnectWithoutRabbitsInput = {
    where: Prisma.BreedWhereUniqueInput;
    create: Prisma.XOR<Prisma.BreedCreateWithoutRabbitsInput, Prisma.BreedUncheckedCreateWithoutRabbitsInput>;
};
export type BreedUpsertWithoutRabbitsInput = {
    update: Prisma.XOR<Prisma.BreedUpdateWithoutRabbitsInput, Prisma.BreedUncheckedUpdateWithoutRabbitsInput>;
    create: Prisma.XOR<Prisma.BreedCreateWithoutRabbitsInput, Prisma.BreedUncheckedCreateWithoutRabbitsInput>;
    where?: Prisma.BreedWhereInput;
};
export type BreedUpdateToOneWithWhereWithoutRabbitsInput = {
    where?: Prisma.BreedWhereInput;
    data: Prisma.XOR<Prisma.BreedUpdateWithoutRabbitsInput, Prisma.BreedUncheckedUpdateWithoutRabbitsInput>;
};
export type BreedUpdateWithoutRabbitsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutBreedsNestedInput;
    crossBreedA?: Prisma.CrossBreedUpdateManyWithoutBreedANestedInput;
    crossBreedB?: Prisma.CrossBreedUpdateManyWithoutBreedBNestedInput;
};
export type BreedUncheckedUpdateWithoutRabbitsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    crossBreedA?: Prisma.CrossBreedUncheckedUpdateManyWithoutBreedANestedInput;
    crossBreedB?: Prisma.CrossBreedUncheckedUpdateManyWithoutBreedBNestedInput;
};
export type BreedCreateManyFarmInput = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BreedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.RabbitUpdateManyWithoutBreedNestedInput;
    crossBreedA?: Prisma.CrossBreedUpdateManyWithoutBreedANestedInput;
    crossBreedB?: Prisma.CrossBreedUpdateManyWithoutBreedBNestedInput;
};
export type BreedUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.RabbitUncheckedUpdateManyWithoutBreedNestedInput;
    crossBreedA?: Prisma.CrossBreedUncheckedUpdateManyWithoutBreedANestedInput;
    crossBreedB?: Prisma.CrossBreedUncheckedUpdateManyWithoutBreedBNestedInput;
};
export type BreedUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BreedCountOutputType = {
    rabbits: number;
    crossBreedA: number;
    crossBreedB: number;
};
export type BreedCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbits?: boolean | BreedCountOutputTypeCountRabbitsArgs;
    crossBreedA?: boolean | BreedCountOutputTypeCountCrossBreedAArgs;
    crossBreedB?: boolean | BreedCountOutputTypeCountCrossBreedBArgs;
};
export type BreedCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedCountOutputTypeSelect<ExtArgs> | null;
};
export type BreedCountOutputTypeCountRabbitsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RabbitWhereInput;
};
export type BreedCountOutputTypeCountCrossBreedAArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CrossBreedWhereInput;
};
export type BreedCountOutputTypeCountCrossBreedBArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CrossBreedWhereInput;
};
export type BreedSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    rabbits?: boolean | Prisma.Breed$rabbitsArgs<ExtArgs>;
    crossBreedA?: boolean | Prisma.Breed$crossBreedAArgs<ExtArgs>;
    crossBreedB?: boolean | Prisma.Breed$crossBreedBArgs<ExtArgs>;
    _count?: boolean | Prisma.BreedCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["breed"]>;
export type BreedSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["breed"]>;
export type BreedSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["breed"]>;
export type BreedSelectScalar = {
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BreedOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farmId" | "name" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["breed"]>;
export type BreedInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    rabbits?: boolean | Prisma.Breed$rabbitsArgs<ExtArgs>;
    crossBreedA?: boolean | Prisma.Breed$crossBreedAArgs<ExtArgs>;
    crossBreedB?: boolean | Prisma.Breed$crossBreedBArgs<ExtArgs>;
    _count?: boolean | Prisma.BreedCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BreedIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
};
export type BreedIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
};
export type $BreedPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Breed";
    objects: {
        farm: Prisma.$FarmPayload<ExtArgs>;
        rabbits: Prisma.$RabbitPayload<ExtArgs>[];
        crossBreedA: Prisma.$CrossBreedPayload<ExtArgs>[];
        crossBreedB: Prisma.$CrossBreedPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farmId: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["breed"]>;
    composites: {};
};
export type BreedGetPayload<S extends boolean | null | undefined | BreedDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BreedPayload, S>;
export type BreedCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BreedFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BreedCountAggregateInputType | true;
};
export interface BreedDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Breed'];
        meta: {
            name: 'Breed';
        };
    };
    findUnique<T extends BreedFindUniqueArgs>(args: Prisma.SelectSubset<T, BreedFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BreedClient<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BreedFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BreedFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BreedClient<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BreedFindFirstArgs>(args?: Prisma.SelectSubset<T, BreedFindFirstArgs<ExtArgs>>): Prisma.Prisma__BreedClient<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BreedFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BreedFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BreedClient<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BreedFindManyArgs>(args?: Prisma.SelectSubset<T, BreedFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BreedCreateArgs>(args: Prisma.SelectSubset<T, BreedCreateArgs<ExtArgs>>): Prisma.Prisma__BreedClient<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BreedCreateManyArgs>(args?: Prisma.SelectSubset<T, BreedCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BreedCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BreedCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BreedDeleteArgs>(args: Prisma.SelectSubset<T, BreedDeleteArgs<ExtArgs>>): Prisma.Prisma__BreedClient<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BreedUpdateArgs>(args: Prisma.SelectSubset<T, BreedUpdateArgs<ExtArgs>>): Prisma.Prisma__BreedClient<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BreedDeleteManyArgs>(args?: Prisma.SelectSubset<T, BreedDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BreedUpdateManyArgs>(args: Prisma.SelectSubset<T, BreedUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BreedUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BreedUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BreedUpsertArgs>(args: Prisma.SelectSubset<T, BreedUpsertArgs<ExtArgs>>): Prisma.Prisma__BreedClient<runtime.Types.Result.GetResult<Prisma.$BreedPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BreedCountArgs>(args?: Prisma.Subset<T, BreedCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BreedCountAggregateOutputType> : number>;
    aggregate<T extends BreedAggregateArgs>(args: Prisma.Subset<T, BreedAggregateArgs>): Prisma.PrismaPromise<GetBreedAggregateType<T>>;
    groupBy<T extends BreedGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BreedGroupByArgs['orderBy'];
    } : {
        orderBy?: BreedGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BreedGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBreedGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BreedFieldRefs;
}
export interface Prisma__BreedClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farm<T extends Prisma.FarmDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FarmDefaultArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    rabbits<T extends Prisma.Breed$rabbitsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Breed$rabbitsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    crossBreedA<T extends Prisma.Breed$crossBreedAArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Breed$crossBreedAArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    crossBreedB<T extends Prisma.Breed$crossBreedBArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Breed$crossBreedBArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CrossBreedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BreedFieldRefs {
    readonly id: Prisma.FieldRef<"Breed", 'String'>;
    readonly farmId: Prisma.FieldRef<"Breed", 'String'>;
    readonly name: Prisma.FieldRef<"Breed", 'String'>;
    readonly description: Prisma.FieldRef<"Breed", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Breed", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Breed", 'DateTime'>;
}
export type BreedFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelect<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    include?: Prisma.BreedInclude<ExtArgs> | null;
    where: Prisma.BreedWhereUniqueInput;
};
export type BreedFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelect<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    include?: Prisma.BreedInclude<ExtArgs> | null;
    where: Prisma.BreedWhereUniqueInput;
};
export type BreedFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelect<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    include?: Prisma.BreedInclude<ExtArgs> | null;
    where?: Prisma.BreedWhereInput;
    orderBy?: Prisma.BreedOrderByWithRelationInput | Prisma.BreedOrderByWithRelationInput[];
    cursor?: Prisma.BreedWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BreedScalarFieldEnum | Prisma.BreedScalarFieldEnum[];
};
export type BreedFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelect<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    include?: Prisma.BreedInclude<ExtArgs> | null;
    where?: Prisma.BreedWhereInput;
    orderBy?: Prisma.BreedOrderByWithRelationInput | Prisma.BreedOrderByWithRelationInput[];
    cursor?: Prisma.BreedWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BreedScalarFieldEnum | Prisma.BreedScalarFieldEnum[];
};
export type BreedFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelect<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    include?: Prisma.BreedInclude<ExtArgs> | null;
    where?: Prisma.BreedWhereInput;
    orderBy?: Prisma.BreedOrderByWithRelationInput | Prisma.BreedOrderByWithRelationInput[];
    cursor?: Prisma.BreedWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BreedScalarFieldEnum | Prisma.BreedScalarFieldEnum[];
};
export type BreedCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelect<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    include?: Prisma.BreedInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BreedCreateInput, Prisma.BreedUncheckedCreateInput>;
};
export type BreedCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BreedCreateManyInput | Prisma.BreedCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BreedCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    data: Prisma.BreedCreateManyInput | Prisma.BreedCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BreedIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BreedUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelect<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    include?: Prisma.BreedInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BreedUpdateInput, Prisma.BreedUncheckedUpdateInput>;
    where: Prisma.BreedWhereUniqueInput;
};
export type BreedUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BreedUpdateManyMutationInput, Prisma.BreedUncheckedUpdateManyInput>;
    where?: Prisma.BreedWhereInput;
    limit?: number;
};
export type BreedUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BreedUpdateManyMutationInput, Prisma.BreedUncheckedUpdateManyInput>;
    where?: Prisma.BreedWhereInput;
    limit?: number;
    include?: Prisma.BreedIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BreedUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelect<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    include?: Prisma.BreedInclude<ExtArgs> | null;
    where: Prisma.BreedWhereUniqueInput;
    create: Prisma.XOR<Prisma.BreedCreateInput, Prisma.BreedUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BreedUpdateInput, Prisma.BreedUncheckedUpdateInput>;
};
export type BreedDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelect<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    include?: Prisma.BreedInclude<ExtArgs> | null;
    where: Prisma.BreedWhereUniqueInput;
};
export type BreedDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BreedWhereInput;
    limit?: number;
};
export type Breed$rabbitsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Breed$crossBreedAArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Breed$crossBreedBArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BreedDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BreedSelect<ExtArgs> | null;
    omit?: Prisma.BreedOmit<ExtArgs> | null;
    include?: Prisma.BreedInclude<ExtArgs> | null;
};
