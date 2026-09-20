import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type LitterAdoptionModel = runtime.Types.Result.DefaultSelection<Prisma.$LitterAdoptionPayload>;
export type AggregateLitterAdoption = {
    _count: LitterAdoptionCountAggregateOutputType | null;
    _avg: LitterAdoptionAvgAggregateOutputType | null;
    _sum: LitterAdoptionSumAggregateOutputType | null;
    _min: LitterAdoptionMinAggregateOutputType | null;
    _max: LitterAdoptionMaxAggregateOutputType | null;
};
export type LitterAdoptionAvgAggregateOutputType = {
    quantity: number | null;
};
export type LitterAdoptionSumAggregateOutputType = {
    quantity: number | null;
};
export type LitterAdoptionMinAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    sourceLitterId: string | null;
    destinationLitterId: string | null;
    adoptedAt: Date | null;
    quantity: number | null;
    reason: string | null;
    observation: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LitterAdoptionMaxAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    sourceLitterId: string | null;
    destinationLitterId: string | null;
    adoptedAt: Date | null;
    quantity: number | null;
    reason: string | null;
    observation: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type LitterAdoptionCountAggregateOutputType = {
    id: number;
    farmId: number;
    sourceLitterId: number;
    destinationLitterId: number;
    adoptedAt: number;
    quantity: number;
    reason: number;
    observation: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type LitterAdoptionAvgAggregateInputType = {
    quantity?: true;
};
export type LitterAdoptionSumAggregateInputType = {
    quantity?: true;
};
export type LitterAdoptionMinAggregateInputType = {
    id?: true;
    farmId?: true;
    sourceLitterId?: true;
    destinationLitterId?: true;
    adoptedAt?: true;
    quantity?: true;
    reason?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LitterAdoptionMaxAggregateInputType = {
    id?: true;
    farmId?: true;
    sourceLitterId?: true;
    destinationLitterId?: true;
    adoptedAt?: true;
    quantity?: true;
    reason?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type LitterAdoptionCountAggregateInputType = {
    id?: true;
    farmId?: true;
    sourceLitterId?: true;
    destinationLitterId?: true;
    adoptedAt?: true;
    quantity?: true;
    reason?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type LitterAdoptionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LitterAdoptionWhereInput;
    orderBy?: Prisma.LitterAdoptionOrderByWithRelationInput | Prisma.LitterAdoptionOrderByWithRelationInput[];
    cursor?: Prisma.LitterAdoptionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LitterAdoptionCountAggregateInputType;
    _avg?: LitterAdoptionAvgAggregateInputType;
    _sum?: LitterAdoptionSumAggregateInputType;
    _min?: LitterAdoptionMinAggregateInputType;
    _max?: LitterAdoptionMaxAggregateInputType;
};
export type GetLitterAdoptionAggregateType<T extends LitterAdoptionAggregateArgs> = {
    [P in keyof T & keyof AggregateLitterAdoption]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLitterAdoption[P]> : Prisma.GetScalarType<T[P], AggregateLitterAdoption[P]>;
};
export type LitterAdoptionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LitterAdoptionWhereInput;
    orderBy?: Prisma.LitterAdoptionOrderByWithAggregationInput | Prisma.LitterAdoptionOrderByWithAggregationInput[];
    by: Prisma.LitterAdoptionScalarFieldEnum[] | Prisma.LitterAdoptionScalarFieldEnum;
    having?: Prisma.LitterAdoptionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LitterAdoptionCountAggregateInputType | true;
    _avg?: LitterAdoptionAvgAggregateInputType;
    _sum?: LitterAdoptionSumAggregateInputType;
    _min?: LitterAdoptionMinAggregateInputType;
    _max?: LitterAdoptionMaxAggregateInputType;
};
export type LitterAdoptionGroupByOutputType = {
    id: string;
    farmId: string;
    sourceLitterId: string;
    destinationLitterId: string;
    adoptedAt: Date;
    quantity: number;
    reason: string | null;
    observation: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: LitterAdoptionCountAggregateOutputType | null;
    _avg: LitterAdoptionAvgAggregateOutputType | null;
    _sum: LitterAdoptionSumAggregateOutputType | null;
    _min: LitterAdoptionMinAggregateOutputType | null;
    _max: LitterAdoptionMaxAggregateOutputType | null;
};
export type GetLitterAdoptionGroupByPayload<T extends LitterAdoptionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LitterAdoptionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LitterAdoptionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LitterAdoptionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LitterAdoptionGroupByOutputType[P]>;
}>>;
export type LitterAdoptionWhereInput = {
    AND?: Prisma.LitterAdoptionWhereInput | Prisma.LitterAdoptionWhereInput[];
    OR?: Prisma.LitterAdoptionWhereInput[];
    NOT?: Prisma.LitterAdoptionWhereInput | Prisma.LitterAdoptionWhereInput[];
    id?: Prisma.StringFilter<"LitterAdoption"> | string;
    farmId?: Prisma.StringFilter<"LitterAdoption"> | string;
    sourceLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    destinationLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    adoptedAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    quantity?: Prisma.IntFilter<"LitterAdoption"> | number;
    reason?: Prisma.StringNullableFilter<"LitterAdoption"> | string | null;
    observation?: Prisma.StringNullableFilter<"LitterAdoption"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    sourceLitter?: Prisma.XOR<Prisma.LitterScalarRelationFilter, Prisma.LitterWhereInput>;
    destinationLitter?: Prisma.XOR<Prisma.LitterScalarRelationFilter, Prisma.LitterWhereInput>;
    rabbits?: Prisma.AdoptionRabbitListRelationFilter;
};
export type LitterAdoptionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    sourceLitterId?: Prisma.SortOrder;
    destinationLitterId?: Prisma.SortOrder;
    adoptedAt?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    farm?: Prisma.FarmOrderByWithRelationInput;
    sourceLitter?: Prisma.LitterOrderByWithRelationInput;
    destinationLitter?: Prisma.LitterOrderByWithRelationInput;
    rabbits?: Prisma.AdoptionRabbitOrderByRelationAggregateInput;
};
export type LitterAdoptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.LitterAdoptionWhereInput | Prisma.LitterAdoptionWhereInput[];
    OR?: Prisma.LitterAdoptionWhereInput[];
    NOT?: Prisma.LitterAdoptionWhereInput | Prisma.LitterAdoptionWhereInput[];
    farmId?: Prisma.StringFilter<"LitterAdoption"> | string;
    sourceLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    destinationLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    adoptedAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    quantity?: Prisma.IntFilter<"LitterAdoption"> | number;
    reason?: Prisma.StringNullableFilter<"LitterAdoption"> | string | null;
    observation?: Prisma.StringNullableFilter<"LitterAdoption"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    sourceLitter?: Prisma.XOR<Prisma.LitterScalarRelationFilter, Prisma.LitterWhereInput>;
    destinationLitter?: Prisma.XOR<Prisma.LitterScalarRelationFilter, Prisma.LitterWhereInput>;
    rabbits?: Prisma.AdoptionRabbitListRelationFilter;
}, "id">;
export type LitterAdoptionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    sourceLitterId?: Prisma.SortOrder;
    destinationLitterId?: Prisma.SortOrder;
    adoptedAt?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.LitterAdoptionCountOrderByAggregateInput;
    _avg?: Prisma.LitterAdoptionAvgOrderByAggregateInput;
    _max?: Prisma.LitterAdoptionMaxOrderByAggregateInput;
    _min?: Prisma.LitterAdoptionMinOrderByAggregateInput;
    _sum?: Prisma.LitterAdoptionSumOrderByAggregateInput;
};
export type LitterAdoptionScalarWhereWithAggregatesInput = {
    AND?: Prisma.LitterAdoptionScalarWhereWithAggregatesInput | Prisma.LitterAdoptionScalarWhereWithAggregatesInput[];
    OR?: Prisma.LitterAdoptionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LitterAdoptionScalarWhereWithAggregatesInput | Prisma.LitterAdoptionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"LitterAdoption"> | string;
    farmId?: Prisma.StringWithAggregatesFilter<"LitterAdoption"> | string;
    sourceLitterId?: Prisma.StringWithAggregatesFilter<"LitterAdoption"> | string;
    destinationLitterId?: Prisma.StringWithAggregatesFilter<"LitterAdoption"> | string;
    adoptedAt?: Prisma.DateTimeWithAggregatesFilter<"LitterAdoption"> | Date | string;
    quantity?: Prisma.IntWithAggregatesFilter<"LitterAdoption"> | number;
    reason?: Prisma.StringNullableWithAggregatesFilter<"LitterAdoption"> | string | null;
    observation?: Prisma.StringNullableWithAggregatesFilter<"LitterAdoption"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LitterAdoption"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"LitterAdoption"> | Date | string;
};
export type LitterAdoptionCreateInput = {
    id?: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutAdoptionsInput;
    sourceLitter: Prisma.LitterCreateNestedOneWithoutSourceAdoptionsInput;
    destinationLitter: Prisma.LitterCreateNestedOneWithoutDestinationAdoptionsInput;
    rabbits?: Prisma.AdoptionRabbitCreateNestedManyWithoutAdoptionInput;
};
export type LitterAdoptionUncheckedCreateInput = {
    id?: string;
    farmId: string;
    sourceLitterId: string;
    destinationLitterId: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.AdoptionRabbitUncheckedCreateNestedManyWithoutAdoptionInput;
};
export type LitterAdoptionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutAdoptionsNestedInput;
    sourceLitter?: Prisma.LitterUpdateOneRequiredWithoutSourceAdoptionsNestedInput;
    destinationLitter?: Prisma.LitterUpdateOneRequiredWithoutDestinationAdoptionsNestedInput;
    rabbits?: Prisma.AdoptionRabbitUpdateManyWithoutAdoptionNestedInput;
};
export type LitterAdoptionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    destinationLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.AdoptionRabbitUncheckedUpdateManyWithoutAdoptionNestedInput;
};
export type LitterAdoptionCreateManyInput = {
    id?: string;
    farmId: string;
    sourceLitterId: string;
    destinationLitterId: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LitterAdoptionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    destinationLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionListRelationFilter = {
    every?: Prisma.LitterAdoptionWhereInput;
    some?: Prisma.LitterAdoptionWhereInput;
    none?: Prisma.LitterAdoptionWhereInput;
};
export type LitterAdoptionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LitterAdoptionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    sourceLitterId?: Prisma.SortOrder;
    destinationLitterId?: Prisma.SortOrder;
    adoptedAt?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LitterAdoptionAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type LitterAdoptionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    sourceLitterId?: Prisma.SortOrder;
    destinationLitterId?: Prisma.SortOrder;
    adoptedAt?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LitterAdoptionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    sourceLitterId?: Prisma.SortOrder;
    destinationLitterId?: Prisma.SortOrder;
    adoptedAt?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type LitterAdoptionSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type LitterAdoptionScalarRelationFilter = {
    is?: Prisma.LitterAdoptionWhereInput;
    isNot?: Prisma.LitterAdoptionWhereInput;
};
export type LitterAdoptionCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutFarmInput, Prisma.LitterAdoptionUncheckedCreateWithoutFarmInput> | Prisma.LitterAdoptionCreateWithoutFarmInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutFarmInput | Prisma.LitterAdoptionCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.LitterAdoptionCreateManyFarmInputEnvelope;
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
};
export type LitterAdoptionUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutFarmInput, Prisma.LitterAdoptionUncheckedCreateWithoutFarmInput> | Prisma.LitterAdoptionCreateWithoutFarmInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutFarmInput | Prisma.LitterAdoptionCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.LitterAdoptionCreateManyFarmInputEnvelope;
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
};
export type LitterAdoptionUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutFarmInput, Prisma.LitterAdoptionUncheckedCreateWithoutFarmInput> | Prisma.LitterAdoptionCreateWithoutFarmInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutFarmInput | Prisma.LitterAdoptionCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutFarmInput | Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.LitterAdoptionCreateManyFarmInputEnvelope;
    set?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    disconnect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    delete?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    update?: Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutFarmInput | Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.LitterAdoptionUpdateManyWithWhereWithoutFarmInput | Prisma.LitterAdoptionUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.LitterAdoptionScalarWhereInput | Prisma.LitterAdoptionScalarWhereInput[];
};
export type LitterAdoptionUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutFarmInput, Prisma.LitterAdoptionUncheckedCreateWithoutFarmInput> | Prisma.LitterAdoptionCreateWithoutFarmInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutFarmInput | Prisma.LitterAdoptionCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutFarmInput | Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.LitterAdoptionCreateManyFarmInputEnvelope;
    set?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    disconnect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    delete?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    update?: Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutFarmInput | Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.LitterAdoptionUpdateManyWithWhereWithoutFarmInput | Prisma.LitterAdoptionUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.LitterAdoptionScalarWhereInput | Prisma.LitterAdoptionScalarWhereInput[];
};
export type LitterAdoptionCreateNestedManyWithoutSourceLitterInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutSourceLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutSourceLitterInput> | Prisma.LitterAdoptionCreateWithoutSourceLitterInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutSourceLitterInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutSourceLitterInput | Prisma.LitterAdoptionCreateOrConnectWithoutSourceLitterInput[];
    createMany?: Prisma.LitterAdoptionCreateManySourceLitterInputEnvelope;
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
};
export type LitterAdoptionCreateNestedManyWithoutDestinationLitterInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutDestinationLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutDestinationLitterInput> | Prisma.LitterAdoptionCreateWithoutDestinationLitterInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutDestinationLitterInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutDestinationLitterInput | Prisma.LitterAdoptionCreateOrConnectWithoutDestinationLitterInput[];
    createMany?: Prisma.LitterAdoptionCreateManyDestinationLitterInputEnvelope;
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
};
export type LitterAdoptionUncheckedCreateNestedManyWithoutSourceLitterInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutSourceLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutSourceLitterInput> | Prisma.LitterAdoptionCreateWithoutSourceLitterInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutSourceLitterInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutSourceLitterInput | Prisma.LitterAdoptionCreateOrConnectWithoutSourceLitterInput[];
    createMany?: Prisma.LitterAdoptionCreateManySourceLitterInputEnvelope;
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
};
export type LitterAdoptionUncheckedCreateNestedManyWithoutDestinationLitterInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutDestinationLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutDestinationLitterInput> | Prisma.LitterAdoptionCreateWithoutDestinationLitterInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutDestinationLitterInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutDestinationLitterInput | Prisma.LitterAdoptionCreateOrConnectWithoutDestinationLitterInput[];
    createMany?: Prisma.LitterAdoptionCreateManyDestinationLitterInputEnvelope;
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
};
export type LitterAdoptionUpdateManyWithoutSourceLitterNestedInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutSourceLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutSourceLitterInput> | Prisma.LitterAdoptionCreateWithoutSourceLitterInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutSourceLitterInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutSourceLitterInput | Prisma.LitterAdoptionCreateOrConnectWithoutSourceLitterInput[];
    upsert?: Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutSourceLitterInput | Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutSourceLitterInput[];
    createMany?: Prisma.LitterAdoptionCreateManySourceLitterInputEnvelope;
    set?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    disconnect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    delete?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    update?: Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutSourceLitterInput | Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutSourceLitterInput[];
    updateMany?: Prisma.LitterAdoptionUpdateManyWithWhereWithoutSourceLitterInput | Prisma.LitterAdoptionUpdateManyWithWhereWithoutSourceLitterInput[];
    deleteMany?: Prisma.LitterAdoptionScalarWhereInput | Prisma.LitterAdoptionScalarWhereInput[];
};
export type LitterAdoptionUpdateManyWithoutDestinationLitterNestedInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutDestinationLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutDestinationLitterInput> | Prisma.LitterAdoptionCreateWithoutDestinationLitterInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutDestinationLitterInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutDestinationLitterInput | Prisma.LitterAdoptionCreateOrConnectWithoutDestinationLitterInput[];
    upsert?: Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutDestinationLitterInput | Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutDestinationLitterInput[];
    createMany?: Prisma.LitterAdoptionCreateManyDestinationLitterInputEnvelope;
    set?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    disconnect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    delete?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    update?: Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutDestinationLitterInput | Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutDestinationLitterInput[];
    updateMany?: Prisma.LitterAdoptionUpdateManyWithWhereWithoutDestinationLitterInput | Prisma.LitterAdoptionUpdateManyWithWhereWithoutDestinationLitterInput[];
    deleteMany?: Prisma.LitterAdoptionScalarWhereInput | Prisma.LitterAdoptionScalarWhereInput[];
};
export type LitterAdoptionUncheckedUpdateManyWithoutSourceLitterNestedInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutSourceLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutSourceLitterInput> | Prisma.LitterAdoptionCreateWithoutSourceLitterInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutSourceLitterInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutSourceLitterInput | Prisma.LitterAdoptionCreateOrConnectWithoutSourceLitterInput[];
    upsert?: Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutSourceLitterInput | Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutSourceLitterInput[];
    createMany?: Prisma.LitterAdoptionCreateManySourceLitterInputEnvelope;
    set?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    disconnect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    delete?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    update?: Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutSourceLitterInput | Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutSourceLitterInput[];
    updateMany?: Prisma.LitterAdoptionUpdateManyWithWhereWithoutSourceLitterInput | Prisma.LitterAdoptionUpdateManyWithWhereWithoutSourceLitterInput[];
    deleteMany?: Prisma.LitterAdoptionScalarWhereInput | Prisma.LitterAdoptionScalarWhereInput[];
};
export type LitterAdoptionUncheckedUpdateManyWithoutDestinationLitterNestedInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutDestinationLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutDestinationLitterInput> | Prisma.LitterAdoptionCreateWithoutDestinationLitterInput[] | Prisma.LitterAdoptionUncheckedCreateWithoutDestinationLitterInput[];
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutDestinationLitterInput | Prisma.LitterAdoptionCreateOrConnectWithoutDestinationLitterInput[];
    upsert?: Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutDestinationLitterInput | Prisma.LitterAdoptionUpsertWithWhereUniqueWithoutDestinationLitterInput[];
    createMany?: Prisma.LitterAdoptionCreateManyDestinationLitterInputEnvelope;
    set?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    disconnect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    delete?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    connect?: Prisma.LitterAdoptionWhereUniqueInput | Prisma.LitterAdoptionWhereUniqueInput[];
    update?: Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutDestinationLitterInput | Prisma.LitterAdoptionUpdateWithWhereUniqueWithoutDestinationLitterInput[];
    updateMany?: Prisma.LitterAdoptionUpdateManyWithWhereWithoutDestinationLitterInput | Prisma.LitterAdoptionUpdateManyWithWhereWithoutDestinationLitterInput[];
    deleteMany?: Prisma.LitterAdoptionScalarWhereInput | Prisma.LitterAdoptionScalarWhereInput[];
};
export type LitterAdoptionCreateNestedOneWithoutRabbitsInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutRabbitsInput, Prisma.LitterAdoptionUncheckedCreateWithoutRabbitsInput>;
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutRabbitsInput;
    connect?: Prisma.LitterAdoptionWhereUniqueInput;
};
export type LitterAdoptionUpdateOneRequiredWithoutRabbitsNestedInput = {
    create?: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutRabbitsInput, Prisma.LitterAdoptionUncheckedCreateWithoutRabbitsInput>;
    connectOrCreate?: Prisma.LitterAdoptionCreateOrConnectWithoutRabbitsInput;
    upsert?: Prisma.LitterAdoptionUpsertWithoutRabbitsInput;
    connect?: Prisma.LitterAdoptionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LitterAdoptionUpdateToOneWithWhereWithoutRabbitsInput, Prisma.LitterAdoptionUpdateWithoutRabbitsInput>, Prisma.LitterAdoptionUncheckedUpdateWithoutRabbitsInput>;
};
export type LitterAdoptionCreateWithoutFarmInput = {
    id?: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    sourceLitter: Prisma.LitterCreateNestedOneWithoutSourceAdoptionsInput;
    destinationLitter: Prisma.LitterCreateNestedOneWithoutDestinationAdoptionsInput;
    rabbits?: Prisma.AdoptionRabbitCreateNestedManyWithoutAdoptionInput;
};
export type LitterAdoptionUncheckedCreateWithoutFarmInput = {
    id?: string;
    sourceLitterId: string;
    destinationLitterId: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.AdoptionRabbitUncheckedCreateNestedManyWithoutAdoptionInput;
};
export type LitterAdoptionCreateOrConnectWithoutFarmInput = {
    where: Prisma.LitterAdoptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutFarmInput, Prisma.LitterAdoptionUncheckedCreateWithoutFarmInput>;
};
export type LitterAdoptionCreateManyFarmInputEnvelope = {
    data: Prisma.LitterAdoptionCreateManyFarmInput | Prisma.LitterAdoptionCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type LitterAdoptionUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.LitterAdoptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.LitterAdoptionUpdateWithoutFarmInput, Prisma.LitterAdoptionUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutFarmInput, Prisma.LitterAdoptionUncheckedCreateWithoutFarmInput>;
};
export type LitterAdoptionUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.LitterAdoptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.LitterAdoptionUpdateWithoutFarmInput, Prisma.LitterAdoptionUncheckedUpdateWithoutFarmInput>;
};
export type LitterAdoptionUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.LitterAdoptionScalarWhereInput;
    data: Prisma.XOR<Prisma.LitterAdoptionUpdateManyMutationInput, Prisma.LitterAdoptionUncheckedUpdateManyWithoutFarmInput>;
};
export type LitterAdoptionScalarWhereInput = {
    AND?: Prisma.LitterAdoptionScalarWhereInput | Prisma.LitterAdoptionScalarWhereInput[];
    OR?: Prisma.LitterAdoptionScalarWhereInput[];
    NOT?: Prisma.LitterAdoptionScalarWhereInput | Prisma.LitterAdoptionScalarWhereInput[];
    id?: Prisma.StringFilter<"LitterAdoption"> | string;
    farmId?: Prisma.StringFilter<"LitterAdoption"> | string;
    sourceLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    destinationLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    adoptedAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    quantity?: Prisma.IntFilter<"LitterAdoption"> | number;
    reason?: Prisma.StringNullableFilter<"LitterAdoption"> | string | null;
    observation?: Prisma.StringNullableFilter<"LitterAdoption"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
};
export type LitterAdoptionCreateWithoutSourceLitterInput = {
    id?: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutAdoptionsInput;
    destinationLitter: Prisma.LitterCreateNestedOneWithoutDestinationAdoptionsInput;
    rabbits?: Prisma.AdoptionRabbitCreateNestedManyWithoutAdoptionInput;
};
export type LitterAdoptionUncheckedCreateWithoutSourceLitterInput = {
    id?: string;
    farmId: string;
    destinationLitterId: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.AdoptionRabbitUncheckedCreateNestedManyWithoutAdoptionInput;
};
export type LitterAdoptionCreateOrConnectWithoutSourceLitterInput = {
    where: Prisma.LitterAdoptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutSourceLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutSourceLitterInput>;
};
export type LitterAdoptionCreateManySourceLitterInputEnvelope = {
    data: Prisma.LitterAdoptionCreateManySourceLitterInput | Prisma.LitterAdoptionCreateManySourceLitterInput[];
    skipDuplicates?: boolean;
};
export type LitterAdoptionCreateWithoutDestinationLitterInput = {
    id?: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutAdoptionsInput;
    sourceLitter: Prisma.LitterCreateNestedOneWithoutSourceAdoptionsInput;
    rabbits?: Prisma.AdoptionRabbitCreateNestedManyWithoutAdoptionInput;
};
export type LitterAdoptionUncheckedCreateWithoutDestinationLitterInput = {
    id?: string;
    farmId: string;
    sourceLitterId: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.AdoptionRabbitUncheckedCreateNestedManyWithoutAdoptionInput;
};
export type LitterAdoptionCreateOrConnectWithoutDestinationLitterInput = {
    where: Prisma.LitterAdoptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutDestinationLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutDestinationLitterInput>;
};
export type LitterAdoptionCreateManyDestinationLitterInputEnvelope = {
    data: Prisma.LitterAdoptionCreateManyDestinationLitterInput | Prisma.LitterAdoptionCreateManyDestinationLitterInput[];
    skipDuplicates?: boolean;
};
export type LitterAdoptionUpsertWithWhereUniqueWithoutSourceLitterInput = {
    where: Prisma.LitterAdoptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.LitterAdoptionUpdateWithoutSourceLitterInput, Prisma.LitterAdoptionUncheckedUpdateWithoutSourceLitterInput>;
    create: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutSourceLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutSourceLitterInput>;
};
export type LitterAdoptionUpdateWithWhereUniqueWithoutSourceLitterInput = {
    where: Prisma.LitterAdoptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.LitterAdoptionUpdateWithoutSourceLitterInput, Prisma.LitterAdoptionUncheckedUpdateWithoutSourceLitterInput>;
};
export type LitterAdoptionUpdateManyWithWhereWithoutSourceLitterInput = {
    where: Prisma.LitterAdoptionScalarWhereInput;
    data: Prisma.XOR<Prisma.LitterAdoptionUpdateManyMutationInput, Prisma.LitterAdoptionUncheckedUpdateManyWithoutSourceLitterInput>;
};
export type LitterAdoptionUpsertWithWhereUniqueWithoutDestinationLitterInput = {
    where: Prisma.LitterAdoptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.LitterAdoptionUpdateWithoutDestinationLitterInput, Prisma.LitterAdoptionUncheckedUpdateWithoutDestinationLitterInput>;
    create: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutDestinationLitterInput, Prisma.LitterAdoptionUncheckedCreateWithoutDestinationLitterInput>;
};
export type LitterAdoptionUpdateWithWhereUniqueWithoutDestinationLitterInput = {
    where: Prisma.LitterAdoptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.LitterAdoptionUpdateWithoutDestinationLitterInput, Prisma.LitterAdoptionUncheckedUpdateWithoutDestinationLitterInput>;
};
export type LitterAdoptionUpdateManyWithWhereWithoutDestinationLitterInput = {
    where: Prisma.LitterAdoptionScalarWhereInput;
    data: Prisma.XOR<Prisma.LitterAdoptionUpdateManyMutationInput, Prisma.LitterAdoptionUncheckedUpdateManyWithoutDestinationLitterInput>;
};
export type LitterAdoptionCreateWithoutRabbitsInput = {
    id?: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutAdoptionsInput;
    sourceLitter: Prisma.LitterCreateNestedOneWithoutSourceAdoptionsInput;
    destinationLitter: Prisma.LitterCreateNestedOneWithoutDestinationAdoptionsInput;
};
export type LitterAdoptionUncheckedCreateWithoutRabbitsInput = {
    id?: string;
    farmId: string;
    sourceLitterId: string;
    destinationLitterId: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LitterAdoptionCreateOrConnectWithoutRabbitsInput = {
    where: Prisma.LitterAdoptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutRabbitsInput, Prisma.LitterAdoptionUncheckedCreateWithoutRabbitsInput>;
};
export type LitterAdoptionUpsertWithoutRabbitsInput = {
    update: Prisma.XOR<Prisma.LitterAdoptionUpdateWithoutRabbitsInput, Prisma.LitterAdoptionUncheckedUpdateWithoutRabbitsInput>;
    create: Prisma.XOR<Prisma.LitterAdoptionCreateWithoutRabbitsInput, Prisma.LitterAdoptionUncheckedCreateWithoutRabbitsInput>;
    where?: Prisma.LitterAdoptionWhereInput;
};
export type LitterAdoptionUpdateToOneWithWhereWithoutRabbitsInput = {
    where?: Prisma.LitterAdoptionWhereInput;
    data: Prisma.XOR<Prisma.LitterAdoptionUpdateWithoutRabbitsInput, Prisma.LitterAdoptionUncheckedUpdateWithoutRabbitsInput>;
};
export type LitterAdoptionUpdateWithoutRabbitsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutAdoptionsNestedInput;
    sourceLitter?: Prisma.LitterUpdateOneRequiredWithoutSourceAdoptionsNestedInput;
    destinationLitter?: Prisma.LitterUpdateOneRequiredWithoutDestinationAdoptionsNestedInput;
};
export type LitterAdoptionUncheckedUpdateWithoutRabbitsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    destinationLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionCreateManyFarmInput = {
    id?: string;
    sourceLitterId: string;
    destinationLitterId: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LitterAdoptionUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sourceLitter?: Prisma.LitterUpdateOneRequiredWithoutSourceAdoptionsNestedInput;
    destinationLitter?: Prisma.LitterUpdateOneRequiredWithoutDestinationAdoptionsNestedInput;
    rabbits?: Prisma.AdoptionRabbitUpdateManyWithoutAdoptionNestedInput;
};
export type LitterAdoptionUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    destinationLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.AdoptionRabbitUncheckedUpdateManyWithoutAdoptionNestedInput;
};
export type LitterAdoptionUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    destinationLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionCreateManySourceLitterInput = {
    id?: string;
    farmId: string;
    destinationLitterId: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LitterAdoptionCreateManyDestinationLitterInput = {
    id?: string;
    farmId: string;
    sourceLitterId: string;
    adoptedAt: Date | string;
    quantity: number;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type LitterAdoptionUpdateWithoutSourceLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutAdoptionsNestedInput;
    destinationLitter?: Prisma.LitterUpdateOneRequiredWithoutDestinationAdoptionsNestedInput;
    rabbits?: Prisma.AdoptionRabbitUpdateManyWithoutAdoptionNestedInput;
};
export type LitterAdoptionUncheckedUpdateWithoutSourceLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    destinationLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.AdoptionRabbitUncheckedUpdateManyWithoutAdoptionNestedInput;
};
export type LitterAdoptionUncheckedUpdateManyWithoutSourceLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    destinationLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionUpdateWithoutDestinationLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutAdoptionsNestedInput;
    sourceLitter?: Prisma.LitterUpdateOneRequiredWithoutSourceAdoptionsNestedInput;
    rabbits?: Prisma.AdoptionRabbitUpdateManyWithoutAdoptionNestedInput;
};
export type LitterAdoptionUncheckedUpdateWithoutDestinationLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.AdoptionRabbitUncheckedUpdateManyWithoutAdoptionNestedInput;
};
export type LitterAdoptionUncheckedUpdateManyWithoutDestinationLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    adoptedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionCountOutputType = {
    rabbits: number;
};
export type LitterAdoptionCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbits?: boolean | LitterAdoptionCountOutputTypeCountRabbitsArgs;
};
export type LitterAdoptionCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionCountOutputTypeSelect<ExtArgs> | null;
};
export type LitterAdoptionCountOutputTypeCountRabbitsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AdoptionRabbitWhereInput;
};
export type LitterAdoptionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    sourceLitterId?: boolean;
    destinationLitterId?: boolean;
    adoptedAt?: boolean;
    quantity?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    rabbits?: boolean | Prisma.LitterAdoption$rabbitsArgs<ExtArgs>;
    _count?: boolean | Prisma.LitterAdoptionCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["litterAdoption"]>;
export type LitterAdoptionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    sourceLitterId?: boolean;
    destinationLitterId?: boolean;
    adoptedAt?: boolean;
    quantity?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["litterAdoption"]>;
export type LitterAdoptionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    sourceLitterId?: boolean;
    destinationLitterId?: boolean;
    adoptedAt?: boolean;
    quantity?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["litterAdoption"]>;
export type LitterAdoptionSelectScalar = {
    id?: boolean;
    farmId?: boolean;
    sourceLitterId?: boolean;
    destinationLitterId?: boolean;
    adoptedAt?: boolean;
    quantity?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type LitterAdoptionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farmId" | "sourceLitterId" | "destinationLitterId" | "adoptedAt" | "quantity" | "reason" | "observation" | "createdAt" | "updatedAt", ExtArgs["result"]["litterAdoption"]>;
export type LitterAdoptionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    rabbits?: boolean | Prisma.LitterAdoption$rabbitsArgs<ExtArgs>;
    _count?: boolean | Prisma.LitterAdoptionCountOutputTypeDefaultArgs<ExtArgs>;
};
export type LitterAdoptionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
};
export type LitterAdoptionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
};
export type $LitterAdoptionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LitterAdoption";
    objects: {
        farm: Prisma.$FarmPayload<ExtArgs>;
        sourceLitter: Prisma.$LitterPayload<ExtArgs>;
        destinationLitter: Prisma.$LitterPayload<ExtArgs>;
        rabbits: Prisma.$AdoptionRabbitPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farmId: string;
        sourceLitterId: string;
        destinationLitterId: string;
        adoptedAt: Date;
        quantity: number;
        reason: string | null;
        observation: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["litterAdoption"]>;
    composites: {};
};
export type LitterAdoptionGetPayload<S extends boolean | null | undefined | LitterAdoptionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload, S>;
export type LitterAdoptionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LitterAdoptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LitterAdoptionCountAggregateInputType | true;
};
export interface LitterAdoptionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LitterAdoption'];
        meta: {
            name: 'LitterAdoption';
        };
    };
    findUnique<T extends LitterAdoptionFindUniqueArgs>(args: Prisma.SelectSubset<T, LitterAdoptionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LitterAdoptionClient<runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LitterAdoptionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LitterAdoptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LitterAdoptionClient<runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LitterAdoptionFindFirstArgs>(args?: Prisma.SelectSubset<T, LitterAdoptionFindFirstArgs<ExtArgs>>): Prisma.Prisma__LitterAdoptionClient<runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LitterAdoptionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LitterAdoptionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LitterAdoptionClient<runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LitterAdoptionFindManyArgs>(args?: Prisma.SelectSubset<T, LitterAdoptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LitterAdoptionCreateArgs>(args: Prisma.SelectSubset<T, LitterAdoptionCreateArgs<ExtArgs>>): Prisma.Prisma__LitterAdoptionClient<runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LitterAdoptionCreateManyArgs>(args?: Prisma.SelectSubset<T, LitterAdoptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LitterAdoptionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LitterAdoptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LitterAdoptionDeleteArgs>(args: Prisma.SelectSubset<T, LitterAdoptionDeleteArgs<ExtArgs>>): Prisma.Prisma__LitterAdoptionClient<runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LitterAdoptionUpdateArgs>(args: Prisma.SelectSubset<T, LitterAdoptionUpdateArgs<ExtArgs>>): Prisma.Prisma__LitterAdoptionClient<runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LitterAdoptionDeleteManyArgs>(args?: Prisma.SelectSubset<T, LitterAdoptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LitterAdoptionUpdateManyArgs>(args: Prisma.SelectSubset<T, LitterAdoptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LitterAdoptionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LitterAdoptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LitterAdoptionUpsertArgs>(args: Prisma.SelectSubset<T, LitterAdoptionUpsertArgs<ExtArgs>>): Prisma.Prisma__LitterAdoptionClient<runtime.Types.Result.GetResult<Prisma.$LitterAdoptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LitterAdoptionCountArgs>(args?: Prisma.Subset<T, LitterAdoptionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LitterAdoptionCountAggregateOutputType> : number>;
    aggregate<T extends LitterAdoptionAggregateArgs>(args: Prisma.Subset<T, LitterAdoptionAggregateArgs>): Prisma.PrismaPromise<GetLitterAdoptionAggregateType<T>>;
    groupBy<T extends LitterAdoptionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LitterAdoptionGroupByArgs['orderBy'];
    } : {
        orderBy?: LitterAdoptionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LitterAdoptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLitterAdoptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LitterAdoptionFieldRefs;
}
export interface Prisma__LitterAdoptionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farm<T extends Prisma.FarmDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FarmDefaultArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    sourceLitter<T extends Prisma.LitterDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LitterDefaultArgs<ExtArgs>>): Prisma.Prisma__LitterClient<runtime.Types.Result.GetResult<Prisma.$LitterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    destinationLitter<T extends Prisma.LitterDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LitterDefaultArgs<ExtArgs>>): Prisma.Prisma__LitterClient<runtime.Types.Result.GetResult<Prisma.$LitterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    rabbits<T extends Prisma.LitterAdoption$rabbitsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LitterAdoption$rabbitsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AdoptionRabbitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LitterAdoptionFieldRefs {
    readonly id: Prisma.FieldRef<"LitterAdoption", 'String'>;
    readonly farmId: Prisma.FieldRef<"LitterAdoption", 'String'>;
    readonly sourceLitterId: Prisma.FieldRef<"LitterAdoption", 'String'>;
    readonly destinationLitterId: Prisma.FieldRef<"LitterAdoption", 'String'>;
    readonly adoptedAt: Prisma.FieldRef<"LitterAdoption", 'DateTime'>;
    readonly quantity: Prisma.FieldRef<"LitterAdoption", 'Int'>;
    readonly reason: Prisma.FieldRef<"LitterAdoption", 'String'>;
    readonly observation: Prisma.FieldRef<"LitterAdoption", 'String'>;
    readonly createdAt: Prisma.FieldRef<"LitterAdoption", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"LitterAdoption", 'DateTime'>;
}
export type LitterAdoptionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelect<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    include?: Prisma.LitterAdoptionInclude<ExtArgs> | null;
    where: Prisma.LitterAdoptionWhereUniqueInput;
};
export type LitterAdoptionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelect<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    include?: Prisma.LitterAdoptionInclude<ExtArgs> | null;
    where: Prisma.LitterAdoptionWhereUniqueInput;
};
export type LitterAdoptionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelect<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    include?: Prisma.LitterAdoptionInclude<ExtArgs> | null;
    where?: Prisma.LitterAdoptionWhereInput;
    orderBy?: Prisma.LitterAdoptionOrderByWithRelationInput | Prisma.LitterAdoptionOrderByWithRelationInput[];
    cursor?: Prisma.LitterAdoptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LitterAdoptionScalarFieldEnum | Prisma.LitterAdoptionScalarFieldEnum[];
};
export type LitterAdoptionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelect<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    include?: Prisma.LitterAdoptionInclude<ExtArgs> | null;
    where?: Prisma.LitterAdoptionWhereInput;
    orderBy?: Prisma.LitterAdoptionOrderByWithRelationInput | Prisma.LitterAdoptionOrderByWithRelationInput[];
    cursor?: Prisma.LitterAdoptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LitterAdoptionScalarFieldEnum | Prisma.LitterAdoptionScalarFieldEnum[];
};
export type LitterAdoptionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelect<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    include?: Prisma.LitterAdoptionInclude<ExtArgs> | null;
    where?: Prisma.LitterAdoptionWhereInput;
    orderBy?: Prisma.LitterAdoptionOrderByWithRelationInput | Prisma.LitterAdoptionOrderByWithRelationInput[];
    cursor?: Prisma.LitterAdoptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LitterAdoptionScalarFieldEnum | Prisma.LitterAdoptionScalarFieldEnum[];
};
export type LitterAdoptionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelect<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    include?: Prisma.LitterAdoptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LitterAdoptionCreateInput, Prisma.LitterAdoptionUncheckedCreateInput>;
};
export type LitterAdoptionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LitterAdoptionCreateManyInput | Prisma.LitterAdoptionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LitterAdoptionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    data: Prisma.LitterAdoptionCreateManyInput | Prisma.LitterAdoptionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LitterAdoptionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LitterAdoptionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelect<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    include?: Prisma.LitterAdoptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LitterAdoptionUpdateInput, Prisma.LitterAdoptionUncheckedUpdateInput>;
    where: Prisma.LitterAdoptionWhereUniqueInput;
};
export type LitterAdoptionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LitterAdoptionUpdateManyMutationInput, Prisma.LitterAdoptionUncheckedUpdateManyInput>;
    where?: Prisma.LitterAdoptionWhereInput;
    limit?: number;
};
export type LitterAdoptionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LitterAdoptionUpdateManyMutationInput, Prisma.LitterAdoptionUncheckedUpdateManyInput>;
    where?: Prisma.LitterAdoptionWhereInput;
    limit?: number;
    include?: Prisma.LitterAdoptionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LitterAdoptionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelect<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    include?: Prisma.LitterAdoptionInclude<ExtArgs> | null;
    where: Prisma.LitterAdoptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.LitterAdoptionCreateInput, Prisma.LitterAdoptionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LitterAdoptionUpdateInput, Prisma.LitterAdoptionUncheckedUpdateInput>;
};
export type LitterAdoptionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelect<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    include?: Prisma.LitterAdoptionInclude<ExtArgs> | null;
    where: Prisma.LitterAdoptionWhereUniqueInput;
};
export type LitterAdoptionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LitterAdoptionWhereInput;
    limit?: number;
};
export type LitterAdoption$rabbitsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AdoptionRabbitSelect<ExtArgs> | null;
    omit?: Prisma.AdoptionRabbitOmit<ExtArgs> | null;
    include?: Prisma.AdoptionRabbitInclude<ExtArgs> | null;
    where?: Prisma.AdoptionRabbitWhereInput;
    orderBy?: Prisma.AdoptionRabbitOrderByWithRelationInput | Prisma.AdoptionRabbitOrderByWithRelationInput[];
    cursor?: Prisma.AdoptionRabbitWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AdoptionRabbitScalarFieldEnum | Prisma.AdoptionRabbitScalarFieldEnum[];
};
export type LitterAdoptionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelect<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    include?: Prisma.LitterAdoptionInclude<ExtArgs> | null;
};
