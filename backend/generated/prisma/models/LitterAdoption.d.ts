import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
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
    sourceLitterId: string | null;
    destinationLitterId: string | null;
    quantity: number | null;
    date: Date | null;
    reason: $Enums.AdoptionReason | null;
    observation: string | null;
    createdAt: Date | null;
};
export type LitterAdoptionMaxAggregateOutputType = {
    id: string | null;
    sourceLitterId: string | null;
    destinationLitterId: string | null;
    quantity: number | null;
    date: Date | null;
    reason: $Enums.AdoptionReason | null;
    observation: string | null;
    createdAt: Date | null;
};
export type LitterAdoptionCountAggregateOutputType = {
    id: number;
    sourceLitterId: number;
    destinationLitterId: number;
    quantity: number;
    date: number;
    reason: number;
    observation: number;
    createdAt: number;
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
    sourceLitterId?: true;
    destinationLitterId?: true;
    quantity?: true;
    date?: true;
    reason?: true;
    observation?: true;
    createdAt?: true;
};
export type LitterAdoptionMaxAggregateInputType = {
    id?: true;
    sourceLitterId?: true;
    destinationLitterId?: true;
    quantity?: true;
    date?: true;
    reason?: true;
    observation?: true;
    createdAt?: true;
};
export type LitterAdoptionCountAggregateInputType = {
    id?: true;
    sourceLitterId?: true;
    destinationLitterId?: true;
    quantity?: true;
    date?: true;
    reason?: true;
    observation?: true;
    createdAt?: true;
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
    sourceLitterId: string;
    destinationLitterId: string;
    quantity: number;
    date: Date;
    reason: $Enums.AdoptionReason;
    observation: string | null;
    createdAt: Date;
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
    sourceLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    destinationLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    quantity?: Prisma.IntFilter<"LitterAdoption"> | number;
    date?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    reason?: Prisma.EnumAdoptionReasonFilter<"LitterAdoption"> | $Enums.AdoptionReason;
    observation?: Prisma.StringNullableFilter<"LitterAdoption"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    sourceLitter?: Prisma.XOR<Prisma.LitterScalarRelationFilter, Prisma.LitterWhereInput>;
    destinationLitter?: Prisma.XOR<Prisma.LitterScalarRelationFilter, Prisma.LitterWhereInput>;
};
export type LitterAdoptionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    sourceLitterId?: Prisma.SortOrder;
    destinationLitterId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    sourceLitter?: Prisma.LitterOrderByWithRelationInput;
    destinationLitter?: Prisma.LitterOrderByWithRelationInput;
};
export type LitterAdoptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.LitterAdoptionWhereInput | Prisma.LitterAdoptionWhereInput[];
    OR?: Prisma.LitterAdoptionWhereInput[];
    NOT?: Prisma.LitterAdoptionWhereInput | Prisma.LitterAdoptionWhereInput[];
    sourceLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    destinationLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    quantity?: Prisma.IntFilter<"LitterAdoption"> | number;
    date?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    reason?: Prisma.EnumAdoptionReasonFilter<"LitterAdoption"> | $Enums.AdoptionReason;
    observation?: Prisma.StringNullableFilter<"LitterAdoption"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    sourceLitter?: Prisma.XOR<Prisma.LitterScalarRelationFilter, Prisma.LitterWhereInput>;
    destinationLitter?: Prisma.XOR<Prisma.LitterScalarRelationFilter, Prisma.LitterWhereInput>;
}, "id">;
export type LitterAdoptionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    sourceLitterId?: Prisma.SortOrder;
    destinationLitterId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
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
    sourceLitterId?: Prisma.StringWithAggregatesFilter<"LitterAdoption"> | string;
    destinationLitterId?: Prisma.StringWithAggregatesFilter<"LitterAdoption"> | string;
    quantity?: Prisma.IntWithAggregatesFilter<"LitterAdoption"> | number;
    date?: Prisma.DateTimeWithAggregatesFilter<"LitterAdoption"> | Date | string;
    reason?: Prisma.EnumAdoptionReasonWithAggregatesFilter<"LitterAdoption"> | $Enums.AdoptionReason;
    observation?: Prisma.StringNullableWithAggregatesFilter<"LitterAdoption"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LitterAdoption"> | Date | string;
};
export type LitterAdoptionCreateInput = {
    id?: string;
    quantity: number;
    date: Date | string;
    reason: $Enums.AdoptionReason;
    observation?: string | null;
    createdAt?: Date | string;
    sourceLitter: Prisma.LitterCreateNestedOneWithoutSourceAdoptionsInput;
    destinationLitter: Prisma.LitterCreateNestedOneWithoutDestinationAdoptionsInput;
};
export type LitterAdoptionUncheckedCreateInput = {
    id?: string;
    sourceLitterId: string;
    destinationLitterId: string;
    quantity: number;
    date: Date | string;
    reason: $Enums.AdoptionReason;
    observation?: string | null;
    createdAt?: Date | string;
};
export type LitterAdoptionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.EnumAdoptionReasonFieldUpdateOperationsInput | $Enums.AdoptionReason;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sourceLitter?: Prisma.LitterUpdateOneRequiredWithoutSourceAdoptionsNestedInput;
    destinationLitter?: Prisma.LitterUpdateOneRequiredWithoutDestinationAdoptionsNestedInput;
};
export type LitterAdoptionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    destinationLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.EnumAdoptionReasonFieldUpdateOperationsInput | $Enums.AdoptionReason;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionCreateManyInput = {
    id?: string;
    sourceLitterId: string;
    destinationLitterId: string;
    quantity: number;
    date: Date | string;
    reason: $Enums.AdoptionReason;
    observation?: string | null;
    createdAt?: Date | string;
};
export type LitterAdoptionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.EnumAdoptionReasonFieldUpdateOperationsInput | $Enums.AdoptionReason;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    destinationLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.EnumAdoptionReasonFieldUpdateOperationsInput | $Enums.AdoptionReason;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
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
    sourceLitterId?: Prisma.SortOrder;
    destinationLitterId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LitterAdoptionAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type LitterAdoptionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceLitterId?: Prisma.SortOrder;
    destinationLitterId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LitterAdoptionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceLitterId?: Prisma.SortOrder;
    destinationLitterId?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LitterAdoptionSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
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
export type EnumAdoptionReasonFieldUpdateOperationsInput = {
    set?: $Enums.AdoptionReason;
};
export type LitterAdoptionCreateWithoutSourceLitterInput = {
    id?: string;
    quantity: number;
    date: Date | string;
    reason: $Enums.AdoptionReason;
    observation?: string | null;
    createdAt?: Date | string;
    destinationLitter: Prisma.LitterCreateNestedOneWithoutDestinationAdoptionsInput;
};
export type LitterAdoptionUncheckedCreateWithoutSourceLitterInput = {
    id?: string;
    destinationLitterId: string;
    quantity: number;
    date: Date | string;
    reason: $Enums.AdoptionReason;
    observation?: string | null;
    createdAt?: Date | string;
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
    quantity: number;
    date: Date | string;
    reason: $Enums.AdoptionReason;
    observation?: string | null;
    createdAt?: Date | string;
    sourceLitter: Prisma.LitterCreateNestedOneWithoutSourceAdoptionsInput;
};
export type LitterAdoptionUncheckedCreateWithoutDestinationLitterInput = {
    id?: string;
    sourceLitterId: string;
    quantity: number;
    date: Date | string;
    reason: $Enums.AdoptionReason;
    observation?: string | null;
    createdAt?: Date | string;
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
export type LitterAdoptionScalarWhereInput = {
    AND?: Prisma.LitterAdoptionScalarWhereInput | Prisma.LitterAdoptionScalarWhereInput[];
    OR?: Prisma.LitterAdoptionScalarWhereInput[];
    NOT?: Prisma.LitterAdoptionScalarWhereInput | Prisma.LitterAdoptionScalarWhereInput[];
    id?: Prisma.StringFilter<"LitterAdoption"> | string;
    sourceLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    destinationLitterId?: Prisma.StringFilter<"LitterAdoption"> | string;
    quantity?: Prisma.IntFilter<"LitterAdoption"> | number;
    date?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
    reason?: Prisma.EnumAdoptionReasonFilter<"LitterAdoption"> | $Enums.AdoptionReason;
    observation?: Prisma.StringNullableFilter<"LitterAdoption"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LitterAdoption"> | Date | string;
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
export type LitterAdoptionCreateManySourceLitterInput = {
    id?: string;
    destinationLitterId: string;
    quantity: number;
    date: Date | string;
    reason: $Enums.AdoptionReason;
    observation?: string | null;
    createdAt?: Date | string;
};
export type LitterAdoptionCreateManyDestinationLitterInput = {
    id?: string;
    sourceLitterId: string;
    quantity: number;
    date: Date | string;
    reason: $Enums.AdoptionReason;
    observation?: string | null;
    createdAt?: Date | string;
};
export type LitterAdoptionUpdateWithoutSourceLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.EnumAdoptionReasonFieldUpdateOperationsInput | $Enums.AdoptionReason;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    destinationLitter?: Prisma.LitterUpdateOneRequiredWithoutDestinationAdoptionsNestedInput;
};
export type LitterAdoptionUncheckedUpdateWithoutSourceLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    destinationLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.EnumAdoptionReasonFieldUpdateOperationsInput | $Enums.AdoptionReason;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionUncheckedUpdateManyWithoutSourceLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    destinationLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.EnumAdoptionReasonFieldUpdateOperationsInput | $Enums.AdoptionReason;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionUpdateWithoutDestinationLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.EnumAdoptionReasonFieldUpdateOperationsInput | $Enums.AdoptionReason;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    sourceLitter?: Prisma.LitterUpdateOneRequiredWithoutSourceAdoptionsNestedInput;
};
export type LitterAdoptionUncheckedUpdateWithoutDestinationLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.EnumAdoptionReasonFieldUpdateOperationsInput | $Enums.AdoptionReason;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionUncheckedUpdateManyWithoutDestinationLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sourceLitterId?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    reason?: Prisma.EnumAdoptionReasonFieldUpdateOperationsInput | $Enums.AdoptionReason;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LitterAdoptionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceLitterId?: boolean;
    destinationLitterId?: boolean;
    quantity?: boolean;
    date?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["litterAdoption"]>;
export type LitterAdoptionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceLitterId?: boolean;
    destinationLitterId?: boolean;
    quantity?: boolean;
    date?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["litterAdoption"]>;
export type LitterAdoptionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceLitterId?: boolean;
    destinationLitterId?: boolean;
    quantity?: boolean;
    date?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["litterAdoption"]>;
export type LitterAdoptionSelectScalar = {
    id?: boolean;
    sourceLitterId?: boolean;
    destinationLitterId?: boolean;
    quantity?: boolean;
    date?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
};
export type LitterAdoptionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "sourceLitterId" | "destinationLitterId" | "quantity" | "date" | "reason" | "observation" | "createdAt", ExtArgs["result"]["litterAdoption"]>;
export type LitterAdoptionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
};
export type LitterAdoptionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
};
export type LitterAdoptionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    sourceLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    destinationLitter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
};
export type $LitterAdoptionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LitterAdoption";
    objects: {
        sourceLitter: Prisma.$LitterPayload<ExtArgs>;
        destinationLitter: Prisma.$LitterPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        sourceLitterId: string;
        destinationLitterId: string;
        quantity: number;
        date: Date;
        reason: $Enums.AdoptionReason;
        observation: string | null;
        createdAt: Date;
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
    sourceLitter<T extends Prisma.LitterDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LitterDefaultArgs<ExtArgs>>): Prisma.Prisma__LitterClient<runtime.Types.Result.GetResult<Prisma.$LitterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    destinationLitter<T extends Prisma.LitterDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LitterDefaultArgs<ExtArgs>>): Prisma.Prisma__LitterClient<runtime.Types.Result.GetResult<Prisma.$LitterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LitterAdoptionFieldRefs {
    readonly id: Prisma.FieldRef<"LitterAdoption", 'String'>;
    readonly sourceLitterId: Prisma.FieldRef<"LitterAdoption", 'String'>;
    readonly destinationLitterId: Prisma.FieldRef<"LitterAdoption", 'String'>;
    readonly quantity: Prisma.FieldRef<"LitterAdoption", 'Int'>;
    readonly date: Prisma.FieldRef<"LitterAdoption", 'DateTime'>;
    readonly reason: Prisma.FieldRef<"LitterAdoption", 'AdoptionReason'>;
    readonly observation: Prisma.FieldRef<"LitterAdoption", 'String'>;
    readonly createdAt: Prisma.FieldRef<"LitterAdoption", 'DateTime'>;
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
export type LitterAdoptionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LitterAdoptionSelect<ExtArgs> | null;
    omit?: Prisma.LitterAdoptionOmit<ExtArgs> | null;
    include?: Prisma.LitterAdoptionInclude<ExtArgs> | null;
};
