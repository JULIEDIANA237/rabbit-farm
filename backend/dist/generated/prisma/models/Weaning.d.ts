import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type WeaningModel = runtime.Types.Result.DefaultSelection<Prisma.$WeaningPayload>;
export type AggregateWeaning = {
    _count: WeaningCountAggregateOutputType | null;
    _avg: WeaningAvgAggregateOutputType | null;
    _sum: WeaningSumAggregateOutputType | null;
    _min: WeaningMinAggregateOutputType | null;
    _max: WeaningMaxAggregateOutputType | null;
};
export type WeaningAvgAggregateOutputType = {
    quantity: number | null;
    totalWeight: runtime.Decimal | null;
    averageWeight: runtime.Decimal | null;
};
export type WeaningSumAggregateOutputType = {
    quantity: number | null;
    totalWeight: runtime.Decimal | null;
    averageWeight: runtime.Decimal | null;
};
export type WeaningMinAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    litterId: string | null;
    plannedDate: Date | null;
    actualDate: Date | null;
    quantity: number | null;
    totalWeight: runtime.Decimal | null;
    averageWeight: runtime.Decimal | null;
    observation: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WeaningMaxAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    litterId: string | null;
    plannedDate: Date | null;
    actualDate: Date | null;
    quantity: number | null;
    totalWeight: runtime.Decimal | null;
    averageWeight: runtime.Decimal | null;
    observation: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WeaningCountAggregateOutputType = {
    id: number;
    farmId: number;
    litterId: number;
    plannedDate: number;
    actualDate: number;
    quantity: number;
    totalWeight: number;
    averageWeight: number;
    observation: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type WeaningAvgAggregateInputType = {
    quantity?: true;
    totalWeight?: true;
    averageWeight?: true;
};
export type WeaningSumAggregateInputType = {
    quantity?: true;
    totalWeight?: true;
    averageWeight?: true;
};
export type WeaningMinAggregateInputType = {
    id?: true;
    farmId?: true;
    litterId?: true;
    plannedDate?: true;
    actualDate?: true;
    quantity?: true;
    totalWeight?: true;
    averageWeight?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WeaningMaxAggregateInputType = {
    id?: true;
    farmId?: true;
    litterId?: true;
    plannedDate?: true;
    actualDate?: true;
    quantity?: true;
    totalWeight?: true;
    averageWeight?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WeaningCountAggregateInputType = {
    id?: true;
    farmId?: true;
    litterId?: true;
    plannedDate?: true;
    actualDate?: true;
    quantity?: true;
    totalWeight?: true;
    averageWeight?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type WeaningAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WeaningWhereInput;
    orderBy?: Prisma.WeaningOrderByWithRelationInput | Prisma.WeaningOrderByWithRelationInput[];
    cursor?: Prisma.WeaningWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WeaningCountAggregateInputType;
    _avg?: WeaningAvgAggregateInputType;
    _sum?: WeaningSumAggregateInputType;
    _min?: WeaningMinAggregateInputType;
    _max?: WeaningMaxAggregateInputType;
};
export type GetWeaningAggregateType<T extends WeaningAggregateArgs> = {
    [P in keyof T & keyof AggregateWeaning]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWeaning[P]> : Prisma.GetScalarType<T[P], AggregateWeaning[P]>;
};
export type WeaningGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WeaningWhereInput;
    orderBy?: Prisma.WeaningOrderByWithAggregationInput | Prisma.WeaningOrderByWithAggregationInput[];
    by: Prisma.WeaningScalarFieldEnum[] | Prisma.WeaningScalarFieldEnum;
    having?: Prisma.WeaningScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WeaningCountAggregateInputType | true;
    _avg?: WeaningAvgAggregateInputType;
    _sum?: WeaningSumAggregateInputType;
    _min?: WeaningMinAggregateInputType;
    _max?: WeaningMaxAggregateInputType;
};
export type WeaningGroupByOutputType = {
    id: string;
    farmId: string;
    litterId: string;
    plannedDate: Date;
    actualDate: Date | null;
    quantity: number;
    totalWeight: runtime.Decimal | null;
    averageWeight: runtime.Decimal | null;
    observation: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: WeaningCountAggregateOutputType | null;
    _avg: WeaningAvgAggregateOutputType | null;
    _sum: WeaningSumAggregateOutputType | null;
    _min: WeaningMinAggregateOutputType | null;
    _max: WeaningMaxAggregateOutputType | null;
};
export type GetWeaningGroupByPayload<T extends WeaningGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WeaningGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WeaningGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WeaningGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WeaningGroupByOutputType[P]>;
}>>;
export type WeaningWhereInput = {
    AND?: Prisma.WeaningWhereInput | Prisma.WeaningWhereInput[];
    OR?: Prisma.WeaningWhereInput[];
    NOT?: Prisma.WeaningWhereInput | Prisma.WeaningWhereInput[];
    id?: Prisma.StringFilter<"Weaning"> | string;
    farmId?: Prisma.StringFilter<"Weaning"> | string;
    litterId?: Prisma.StringFilter<"Weaning"> | string;
    plannedDate?: Prisma.DateTimeFilter<"Weaning"> | Date | string;
    actualDate?: Prisma.DateTimeNullableFilter<"Weaning"> | Date | string | null;
    quantity?: Prisma.IntFilter<"Weaning"> | number;
    totalWeight?: Prisma.DecimalNullableFilter<"Weaning"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.DecimalNullableFilter<"Weaning"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.StringNullableFilter<"Weaning"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Weaning"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Weaning"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    litter?: Prisma.XOR<Prisma.LitterScalarRelationFilter, Prisma.LitterWhereInput>;
    rabbits?: Prisma.WeaningRabbitListRelationFilter;
};
export type WeaningOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    litterId?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    actualDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrderInput | Prisma.SortOrder;
    averageWeight?: Prisma.SortOrderInput | Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    farm?: Prisma.FarmOrderByWithRelationInput;
    litter?: Prisma.LitterOrderByWithRelationInput;
    rabbits?: Prisma.WeaningRabbitOrderByRelationAggregateInput;
};
export type WeaningWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.WeaningWhereInput | Prisma.WeaningWhereInput[];
    OR?: Prisma.WeaningWhereInput[];
    NOT?: Prisma.WeaningWhereInput | Prisma.WeaningWhereInput[];
    farmId?: Prisma.StringFilter<"Weaning"> | string;
    litterId?: Prisma.StringFilter<"Weaning"> | string;
    plannedDate?: Prisma.DateTimeFilter<"Weaning"> | Date | string;
    actualDate?: Prisma.DateTimeNullableFilter<"Weaning"> | Date | string | null;
    quantity?: Prisma.IntFilter<"Weaning"> | number;
    totalWeight?: Prisma.DecimalNullableFilter<"Weaning"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.DecimalNullableFilter<"Weaning"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.StringNullableFilter<"Weaning"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Weaning"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Weaning"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    litter?: Prisma.XOR<Prisma.LitterScalarRelationFilter, Prisma.LitterWhereInput>;
    rabbits?: Prisma.WeaningRabbitListRelationFilter;
}, "id">;
export type WeaningOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    litterId?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    actualDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrderInput | Prisma.SortOrder;
    averageWeight?: Prisma.SortOrderInput | Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.WeaningCountOrderByAggregateInput;
    _avg?: Prisma.WeaningAvgOrderByAggregateInput;
    _max?: Prisma.WeaningMaxOrderByAggregateInput;
    _min?: Prisma.WeaningMinOrderByAggregateInput;
    _sum?: Prisma.WeaningSumOrderByAggregateInput;
};
export type WeaningScalarWhereWithAggregatesInput = {
    AND?: Prisma.WeaningScalarWhereWithAggregatesInput | Prisma.WeaningScalarWhereWithAggregatesInput[];
    OR?: Prisma.WeaningScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WeaningScalarWhereWithAggregatesInput | Prisma.WeaningScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Weaning"> | string;
    farmId?: Prisma.StringWithAggregatesFilter<"Weaning"> | string;
    litterId?: Prisma.StringWithAggregatesFilter<"Weaning"> | string;
    plannedDate?: Prisma.DateTimeWithAggregatesFilter<"Weaning"> | Date | string;
    actualDate?: Prisma.DateTimeNullableWithAggregatesFilter<"Weaning"> | Date | string | null;
    quantity?: Prisma.IntWithAggregatesFilter<"Weaning"> | number;
    totalWeight?: Prisma.DecimalNullableWithAggregatesFilter<"Weaning"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.DecimalNullableWithAggregatesFilter<"Weaning"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.StringNullableWithAggregatesFilter<"Weaning"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Weaning"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Weaning"> | Date | string;
};
export type WeaningCreateInput = {
    id?: string;
    plannedDate: Date | string;
    actualDate?: Date | string | null;
    quantity: number;
    totalWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutWeaningsInput;
    litter: Prisma.LitterCreateNestedOneWithoutWeaningsInput;
    rabbits?: Prisma.WeaningRabbitCreateNestedManyWithoutWeaningInput;
};
export type WeaningUncheckedCreateInput = {
    id?: string;
    farmId: string;
    litterId: string;
    plannedDate: Date | string;
    actualDate?: Date | string | null;
    quantity: number;
    totalWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.WeaningRabbitUncheckedCreateNestedManyWithoutWeaningInput;
};
export type WeaningUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutWeaningsNestedInput;
    litter?: Prisma.LitterUpdateOneRequiredWithoutWeaningsNestedInput;
    rabbits?: Prisma.WeaningRabbitUpdateManyWithoutWeaningNestedInput;
};
export type WeaningUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    litterId?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.WeaningRabbitUncheckedUpdateManyWithoutWeaningNestedInput;
};
export type WeaningCreateManyInput = {
    id?: string;
    farmId: string;
    litterId: string;
    plannedDate: Date | string;
    actualDate?: Date | string | null;
    quantity: number;
    totalWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WeaningUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeaningUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    litterId?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeaningListRelationFilter = {
    every?: Prisma.WeaningWhereInput;
    some?: Prisma.WeaningWhereInput;
    none?: Prisma.WeaningWhereInput;
};
export type WeaningOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WeaningCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    litterId?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    actualDate?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WeaningAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrder;
};
export type WeaningMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    litterId?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    actualDate?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WeaningMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    litterId?: Prisma.SortOrder;
    plannedDate?: Prisma.SortOrder;
    actualDate?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WeaningSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrder;
};
export type WeaningScalarRelationFilter = {
    is?: Prisma.WeaningWhereInput;
    isNot?: Prisma.WeaningWhereInput;
};
export type WeaningCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.WeaningCreateWithoutFarmInput, Prisma.WeaningUncheckedCreateWithoutFarmInput> | Prisma.WeaningCreateWithoutFarmInput[] | Prisma.WeaningUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.WeaningCreateOrConnectWithoutFarmInput | Prisma.WeaningCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.WeaningCreateManyFarmInputEnvelope;
    connect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
};
export type WeaningUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.WeaningCreateWithoutFarmInput, Prisma.WeaningUncheckedCreateWithoutFarmInput> | Prisma.WeaningCreateWithoutFarmInput[] | Prisma.WeaningUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.WeaningCreateOrConnectWithoutFarmInput | Prisma.WeaningCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.WeaningCreateManyFarmInputEnvelope;
    connect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
};
export type WeaningUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.WeaningCreateWithoutFarmInput, Prisma.WeaningUncheckedCreateWithoutFarmInput> | Prisma.WeaningCreateWithoutFarmInput[] | Prisma.WeaningUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.WeaningCreateOrConnectWithoutFarmInput | Prisma.WeaningCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.WeaningUpsertWithWhereUniqueWithoutFarmInput | Prisma.WeaningUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.WeaningCreateManyFarmInputEnvelope;
    set?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    disconnect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    delete?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    connect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    update?: Prisma.WeaningUpdateWithWhereUniqueWithoutFarmInput | Prisma.WeaningUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.WeaningUpdateManyWithWhereWithoutFarmInput | Prisma.WeaningUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.WeaningScalarWhereInput | Prisma.WeaningScalarWhereInput[];
};
export type WeaningUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.WeaningCreateWithoutFarmInput, Prisma.WeaningUncheckedCreateWithoutFarmInput> | Prisma.WeaningCreateWithoutFarmInput[] | Prisma.WeaningUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.WeaningCreateOrConnectWithoutFarmInput | Prisma.WeaningCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.WeaningUpsertWithWhereUniqueWithoutFarmInput | Prisma.WeaningUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.WeaningCreateManyFarmInputEnvelope;
    set?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    disconnect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    delete?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    connect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    update?: Prisma.WeaningUpdateWithWhereUniqueWithoutFarmInput | Prisma.WeaningUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.WeaningUpdateManyWithWhereWithoutFarmInput | Prisma.WeaningUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.WeaningScalarWhereInput | Prisma.WeaningScalarWhereInput[];
};
export type WeaningCreateNestedManyWithoutLitterInput = {
    create?: Prisma.XOR<Prisma.WeaningCreateWithoutLitterInput, Prisma.WeaningUncheckedCreateWithoutLitterInput> | Prisma.WeaningCreateWithoutLitterInput[] | Prisma.WeaningUncheckedCreateWithoutLitterInput[];
    connectOrCreate?: Prisma.WeaningCreateOrConnectWithoutLitterInput | Prisma.WeaningCreateOrConnectWithoutLitterInput[];
    createMany?: Prisma.WeaningCreateManyLitterInputEnvelope;
    connect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
};
export type WeaningUncheckedCreateNestedManyWithoutLitterInput = {
    create?: Prisma.XOR<Prisma.WeaningCreateWithoutLitterInput, Prisma.WeaningUncheckedCreateWithoutLitterInput> | Prisma.WeaningCreateWithoutLitterInput[] | Prisma.WeaningUncheckedCreateWithoutLitterInput[];
    connectOrCreate?: Prisma.WeaningCreateOrConnectWithoutLitterInput | Prisma.WeaningCreateOrConnectWithoutLitterInput[];
    createMany?: Prisma.WeaningCreateManyLitterInputEnvelope;
    connect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
};
export type WeaningUpdateManyWithoutLitterNestedInput = {
    create?: Prisma.XOR<Prisma.WeaningCreateWithoutLitterInput, Prisma.WeaningUncheckedCreateWithoutLitterInput> | Prisma.WeaningCreateWithoutLitterInput[] | Prisma.WeaningUncheckedCreateWithoutLitterInput[];
    connectOrCreate?: Prisma.WeaningCreateOrConnectWithoutLitterInput | Prisma.WeaningCreateOrConnectWithoutLitterInput[];
    upsert?: Prisma.WeaningUpsertWithWhereUniqueWithoutLitterInput | Prisma.WeaningUpsertWithWhereUniqueWithoutLitterInput[];
    createMany?: Prisma.WeaningCreateManyLitterInputEnvelope;
    set?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    disconnect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    delete?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    connect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    update?: Prisma.WeaningUpdateWithWhereUniqueWithoutLitterInput | Prisma.WeaningUpdateWithWhereUniqueWithoutLitterInput[];
    updateMany?: Prisma.WeaningUpdateManyWithWhereWithoutLitterInput | Prisma.WeaningUpdateManyWithWhereWithoutLitterInput[];
    deleteMany?: Prisma.WeaningScalarWhereInput | Prisma.WeaningScalarWhereInput[];
};
export type WeaningUncheckedUpdateManyWithoutLitterNestedInput = {
    create?: Prisma.XOR<Prisma.WeaningCreateWithoutLitterInput, Prisma.WeaningUncheckedCreateWithoutLitterInput> | Prisma.WeaningCreateWithoutLitterInput[] | Prisma.WeaningUncheckedCreateWithoutLitterInput[];
    connectOrCreate?: Prisma.WeaningCreateOrConnectWithoutLitterInput | Prisma.WeaningCreateOrConnectWithoutLitterInput[];
    upsert?: Prisma.WeaningUpsertWithWhereUniqueWithoutLitterInput | Prisma.WeaningUpsertWithWhereUniqueWithoutLitterInput[];
    createMany?: Prisma.WeaningCreateManyLitterInputEnvelope;
    set?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    disconnect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    delete?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    connect?: Prisma.WeaningWhereUniqueInput | Prisma.WeaningWhereUniqueInput[];
    update?: Prisma.WeaningUpdateWithWhereUniqueWithoutLitterInput | Prisma.WeaningUpdateWithWhereUniqueWithoutLitterInput[];
    updateMany?: Prisma.WeaningUpdateManyWithWhereWithoutLitterInput | Prisma.WeaningUpdateManyWithWhereWithoutLitterInput[];
    deleteMany?: Prisma.WeaningScalarWhereInput | Prisma.WeaningScalarWhereInput[];
};
export type WeaningCreateNestedOneWithoutRabbitsInput = {
    create?: Prisma.XOR<Prisma.WeaningCreateWithoutRabbitsInput, Prisma.WeaningUncheckedCreateWithoutRabbitsInput>;
    connectOrCreate?: Prisma.WeaningCreateOrConnectWithoutRabbitsInput;
    connect?: Prisma.WeaningWhereUniqueInput;
};
export type WeaningUpdateOneRequiredWithoutRabbitsNestedInput = {
    create?: Prisma.XOR<Prisma.WeaningCreateWithoutRabbitsInput, Prisma.WeaningUncheckedCreateWithoutRabbitsInput>;
    connectOrCreate?: Prisma.WeaningCreateOrConnectWithoutRabbitsInput;
    upsert?: Prisma.WeaningUpsertWithoutRabbitsInput;
    connect?: Prisma.WeaningWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.WeaningUpdateToOneWithWhereWithoutRabbitsInput, Prisma.WeaningUpdateWithoutRabbitsInput>, Prisma.WeaningUncheckedUpdateWithoutRabbitsInput>;
};
export type WeaningCreateWithoutFarmInput = {
    id?: string;
    plannedDate: Date | string;
    actualDate?: Date | string | null;
    quantity: number;
    totalWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    litter: Prisma.LitterCreateNestedOneWithoutWeaningsInput;
    rabbits?: Prisma.WeaningRabbitCreateNestedManyWithoutWeaningInput;
};
export type WeaningUncheckedCreateWithoutFarmInput = {
    id?: string;
    litterId: string;
    plannedDate: Date | string;
    actualDate?: Date | string | null;
    quantity: number;
    totalWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.WeaningRabbitUncheckedCreateNestedManyWithoutWeaningInput;
};
export type WeaningCreateOrConnectWithoutFarmInput = {
    where: Prisma.WeaningWhereUniqueInput;
    create: Prisma.XOR<Prisma.WeaningCreateWithoutFarmInput, Prisma.WeaningUncheckedCreateWithoutFarmInput>;
};
export type WeaningCreateManyFarmInputEnvelope = {
    data: Prisma.WeaningCreateManyFarmInput | Prisma.WeaningCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type WeaningUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.WeaningWhereUniqueInput;
    update: Prisma.XOR<Prisma.WeaningUpdateWithoutFarmInput, Prisma.WeaningUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.WeaningCreateWithoutFarmInput, Prisma.WeaningUncheckedCreateWithoutFarmInput>;
};
export type WeaningUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.WeaningWhereUniqueInput;
    data: Prisma.XOR<Prisma.WeaningUpdateWithoutFarmInput, Prisma.WeaningUncheckedUpdateWithoutFarmInput>;
};
export type WeaningUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.WeaningScalarWhereInput;
    data: Prisma.XOR<Prisma.WeaningUpdateManyMutationInput, Prisma.WeaningUncheckedUpdateManyWithoutFarmInput>;
};
export type WeaningScalarWhereInput = {
    AND?: Prisma.WeaningScalarWhereInput | Prisma.WeaningScalarWhereInput[];
    OR?: Prisma.WeaningScalarWhereInput[];
    NOT?: Prisma.WeaningScalarWhereInput | Prisma.WeaningScalarWhereInput[];
    id?: Prisma.StringFilter<"Weaning"> | string;
    farmId?: Prisma.StringFilter<"Weaning"> | string;
    litterId?: Prisma.StringFilter<"Weaning"> | string;
    plannedDate?: Prisma.DateTimeFilter<"Weaning"> | Date | string;
    actualDate?: Prisma.DateTimeNullableFilter<"Weaning"> | Date | string | null;
    quantity?: Prisma.IntFilter<"Weaning"> | number;
    totalWeight?: Prisma.DecimalNullableFilter<"Weaning"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.DecimalNullableFilter<"Weaning"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.StringNullableFilter<"Weaning"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Weaning"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Weaning"> | Date | string;
};
export type WeaningCreateWithoutLitterInput = {
    id?: string;
    plannedDate: Date | string;
    actualDate?: Date | string | null;
    quantity: number;
    totalWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutWeaningsInput;
    rabbits?: Prisma.WeaningRabbitCreateNestedManyWithoutWeaningInput;
};
export type WeaningUncheckedCreateWithoutLitterInput = {
    id?: string;
    farmId: string;
    plannedDate: Date | string;
    actualDate?: Date | string | null;
    quantity: number;
    totalWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbits?: Prisma.WeaningRabbitUncheckedCreateNestedManyWithoutWeaningInput;
};
export type WeaningCreateOrConnectWithoutLitterInput = {
    where: Prisma.WeaningWhereUniqueInput;
    create: Prisma.XOR<Prisma.WeaningCreateWithoutLitterInput, Prisma.WeaningUncheckedCreateWithoutLitterInput>;
};
export type WeaningCreateManyLitterInputEnvelope = {
    data: Prisma.WeaningCreateManyLitterInput | Prisma.WeaningCreateManyLitterInput[];
    skipDuplicates?: boolean;
};
export type WeaningUpsertWithWhereUniqueWithoutLitterInput = {
    where: Prisma.WeaningWhereUniqueInput;
    update: Prisma.XOR<Prisma.WeaningUpdateWithoutLitterInput, Prisma.WeaningUncheckedUpdateWithoutLitterInput>;
    create: Prisma.XOR<Prisma.WeaningCreateWithoutLitterInput, Prisma.WeaningUncheckedCreateWithoutLitterInput>;
};
export type WeaningUpdateWithWhereUniqueWithoutLitterInput = {
    where: Prisma.WeaningWhereUniqueInput;
    data: Prisma.XOR<Prisma.WeaningUpdateWithoutLitterInput, Prisma.WeaningUncheckedUpdateWithoutLitterInput>;
};
export type WeaningUpdateManyWithWhereWithoutLitterInput = {
    where: Prisma.WeaningScalarWhereInput;
    data: Prisma.XOR<Prisma.WeaningUpdateManyMutationInput, Prisma.WeaningUncheckedUpdateManyWithoutLitterInput>;
};
export type WeaningCreateWithoutRabbitsInput = {
    id?: string;
    plannedDate: Date | string;
    actualDate?: Date | string | null;
    quantity: number;
    totalWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutWeaningsInput;
    litter: Prisma.LitterCreateNestedOneWithoutWeaningsInput;
};
export type WeaningUncheckedCreateWithoutRabbitsInput = {
    id?: string;
    farmId: string;
    litterId: string;
    plannedDate: Date | string;
    actualDate?: Date | string | null;
    quantity: number;
    totalWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WeaningCreateOrConnectWithoutRabbitsInput = {
    where: Prisma.WeaningWhereUniqueInput;
    create: Prisma.XOR<Prisma.WeaningCreateWithoutRabbitsInput, Prisma.WeaningUncheckedCreateWithoutRabbitsInput>;
};
export type WeaningUpsertWithoutRabbitsInput = {
    update: Prisma.XOR<Prisma.WeaningUpdateWithoutRabbitsInput, Prisma.WeaningUncheckedUpdateWithoutRabbitsInput>;
    create: Prisma.XOR<Prisma.WeaningCreateWithoutRabbitsInput, Prisma.WeaningUncheckedCreateWithoutRabbitsInput>;
    where?: Prisma.WeaningWhereInput;
};
export type WeaningUpdateToOneWithWhereWithoutRabbitsInput = {
    where?: Prisma.WeaningWhereInput;
    data: Prisma.XOR<Prisma.WeaningUpdateWithoutRabbitsInput, Prisma.WeaningUncheckedUpdateWithoutRabbitsInput>;
};
export type WeaningUpdateWithoutRabbitsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutWeaningsNestedInput;
    litter?: Prisma.LitterUpdateOneRequiredWithoutWeaningsNestedInput;
};
export type WeaningUncheckedUpdateWithoutRabbitsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    litterId?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeaningCreateManyFarmInput = {
    id?: string;
    litterId: string;
    plannedDate: Date | string;
    actualDate?: Date | string | null;
    quantity: number;
    totalWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WeaningUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    litter?: Prisma.LitterUpdateOneRequiredWithoutWeaningsNestedInput;
    rabbits?: Prisma.WeaningRabbitUpdateManyWithoutWeaningNestedInput;
};
export type WeaningUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    litterId?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.WeaningRabbitUncheckedUpdateManyWithoutWeaningNestedInput;
};
export type WeaningUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    litterId?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeaningCreateManyLitterInput = {
    id?: string;
    farmId: string;
    plannedDate: Date | string;
    actualDate?: Date | string | null;
    quantity: number;
    totalWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WeaningUpdateWithoutLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutWeaningsNestedInput;
    rabbits?: Prisma.WeaningRabbitUpdateManyWithoutWeaningNestedInput;
};
export type WeaningUncheckedUpdateWithoutLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbits?: Prisma.WeaningRabbitUncheckedUpdateManyWithoutWeaningNestedInput;
};
export type WeaningUncheckedUpdateManyWithoutLitterInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    plannedDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actualDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    quantity?: Prisma.IntFieldUpdateOperationsInput | number;
    totalWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    averageWeight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeaningCountOutputType = {
    rabbits: number;
};
export type WeaningCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbits?: boolean | WeaningCountOutputTypeCountRabbitsArgs;
};
export type WeaningCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningCountOutputTypeSelect<ExtArgs> | null;
};
export type WeaningCountOutputTypeCountRabbitsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WeaningRabbitWhereInput;
};
export type WeaningSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    litterId?: boolean;
    plannedDate?: boolean;
    actualDate?: boolean;
    quantity?: boolean;
    totalWeight?: boolean;
    averageWeight?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    litter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    rabbits?: boolean | Prisma.Weaning$rabbitsArgs<ExtArgs>;
    _count?: boolean | Prisma.WeaningCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["weaning"]>;
export type WeaningSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    litterId?: boolean;
    plannedDate?: boolean;
    actualDate?: boolean;
    quantity?: boolean;
    totalWeight?: boolean;
    averageWeight?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    litter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["weaning"]>;
export type WeaningSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    litterId?: boolean;
    plannedDate?: boolean;
    actualDate?: boolean;
    quantity?: boolean;
    totalWeight?: boolean;
    averageWeight?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    litter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["weaning"]>;
export type WeaningSelectScalar = {
    id?: boolean;
    farmId?: boolean;
    litterId?: boolean;
    plannedDate?: boolean;
    actualDate?: boolean;
    quantity?: boolean;
    totalWeight?: boolean;
    averageWeight?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type WeaningOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farmId" | "litterId" | "plannedDate" | "actualDate" | "quantity" | "totalWeight" | "averageWeight" | "observation" | "createdAt" | "updatedAt", ExtArgs["result"]["weaning"]>;
export type WeaningInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    litter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
    rabbits?: boolean | Prisma.Weaning$rabbitsArgs<ExtArgs>;
    _count?: boolean | Prisma.WeaningCountOutputTypeDefaultArgs<ExtArgs>;
};
export type WeaningIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    litter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
};
export type WeaningIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    litter?: boolean | Prisma.LitterDefaultArgs<ExtArgs>;
};
export type $WeaningPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Weaning";
    objects: {
        farm: Prisma.$FarmPayload<ExtArgs>;
        litter: Prisma.$LitterPayload<ExtArgs>;
        rabbits: Prisma.$WeaningRabbitPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farmId: string;
        litterId: string;
        plannedDate: Date;
        actualDate: Date | null;
        quantity: number;
        totalWeight: runtime.Decimal | null;
        averageWeight: runtime.Decimal | null;
        observation: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["weaning"]>;
    composites: {};
};
export type WeaningGetPayload<S extends boolean | null | undefined | WeaningDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WeaningPayload, S>;
export type WeaningCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WeaningFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WeaningCountAggregateInputType | true;
};
export interface WeaningDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Weaning'];
        meta: {
            name: 'Weaning';
        };
    };
    findUnique<T extends WeaningFindUniqueArgs>(args: Prisma.SelectSubset<T, WeaningFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WeaningClient<runtime.Types.Result.GetResult<Prisma.$WeaningPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WeaningFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WeaningFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WeaningClient<runtime.Types.Result.GetResult<Prisma.$WeaningPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WeaningFindFirstArgs>(args?: Prisma.SelectSubset<T, WeaningFindFirstArgs<ExtArgs>>): Prisma.Prisma__WeaningClient<runtime.Types.Result.GetResult<Prisma.$WeaningPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WeaningFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WeaningFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WeaningClient<runtime.Types.Result.GetResult<Prisma.$WeaningPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WeaningFindManyArgs>(args?: Prisma.SelectSubset<T, WeaningFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WeaningPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WeaningCreateArgs>(args: Prisma.SelectSubset<T, WeaningCreateArgs<ExtArgs>>): Prisma.Prisma__WeaningClient<runtime.Types.Result.GetResult<Prisma.$WeaningPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WeaningCreateManyArgs>(args?: Prisma.SelectSubset<T, WeaningCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WeaningCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WeaningCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WeaningPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WeaningDeleteArgs>(args: Prisma.SelectSubset<T, WeaningDeleteArgs<ExtArgs>>): Prisma.Prisma__WeaningClient<runtime.Types.Result.GetResult<Prisma.$WeaningPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WeaningUpdateArgs>(args: Prisma.SelectSubset<T, WeaningUpdateArgs<ExtArgs>>): Prisma.Prisma__WeaningClient<runtime.Types.Result.GetResult<Prisma.$WeaningPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WeaningDeleteManyArgs>(args?: Prisma.SelectSubset<T, WeaningDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WeaningUpdateManyArgs>(args: Prisma.SelectSubset<T, WeaningUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WeaningUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WeaningUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WeaningPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WeaningUpsertArgs>(args: Prisma.SelectSubset<T, WeaningUpsertArgs<ExtArgs>>): Prisma.Prisma__WeaningClient<runtime.Types.Result.GetResult<Prisma.$WeaningPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WeaningCountArgs>(args?: Prisma.Subset<T, WeaningCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WeaningCountAggregateOutputType> : number>;
    aggregate<T extends WeaningAggregateArgs>(args: Prisma.Subset<T, WeaningAggregateArgs>): Prisma.PrismaPromise<GetWeaningAggregateType<T>>;
    groupBy<T extends WeaningGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WeaningGroupByArgs['orderBy'];
    } : {
        orderBy?: WeaningGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WeaningGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeaningGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WeaningFieldRefs;
}
export interface Prisma__WeaningClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farm<T extends Prisma.FarmDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FarmDefaultArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    litter<T extends Prisma.LitterDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LitterDefaultArgs<ExtArgs>>): Prisma.Prisma__LitterClient<runtime.Types.Result.GetResult<Prisma.$LitterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    rabbits<T extends Prisma.Weaning$rabbitsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Weaning$rabbitsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WeaningRabbitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WeaningFieldRefs {
    readonly id: Prisma.FieldRef<"Weaning", 'String'>;
    readonly farmId: Prisma.FieldRef<"Weaning", 'String'>;
    readonly litterId: Prisma.FieldRef<"Weaning", 'String'>;
    readonly plannedDate: Prisma.FieldRef<"Weaning", 'DateTime'>;
    readonly actualDate: Prisma.FieldRef<"Weaning", 'DateTime'>;
    readonly quantity: Prisma.FieldRef<"Weaning", 'Int'>;
    readonly totalWeight: Prisma.FieldRef<"Weaning", 'Decimal'>;
    readonly averageWeight: Prisma.FieldRef<"Weaning", 'Decimal'>;
    readonly observation: Prisma.FieldRef<"Weaning", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Weaning", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Weaning", 'DateTime'>;
}
export type WeaningFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelect<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    include?: Prisma.WeaningInclude<ExtArgs> | null;
    where: Prisma.WeaningWhereUniqueInput;
};
export type WeaningFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelect<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    include?: Prisma.WeaningInclude<ExtArgs> | null;
    where: Prisma.WeaningWhereUniqueInput;
};
export type WeaningFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelect<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    include?: Prisma.WeaningInclude<ExtArgs> | null;
    where?: Prisma.WeaningWhereInput;
    orderBy?: Prisma.WeaningOrderByWithRelationInput | Prisma.WeaningOrderByWithRelationInput[];
    cursor?: Prisma.WeaningWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WeaningScalarFieldEnum | Prisma.WeaningScalarFieldEnum[];
};
export type WeaningFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelect<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    include?: Prisma.WeaningInclude<ExtArgs> | null;
    where?: Prisma.WeaningWhereInput;
    orderBy?: Prisma.WeaningOrderByWithRelationInput | Prisma.WeaningOrderByWithRelationInput[];
    cursor?: Prisma.WeaningWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WeaningScalarFieldEnum | Prisma.WeaningScalarFieldEnum[];
};
export type WeaningFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelect<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    include?: Prisma.WeaningInclude<ExtArgs> | null;
    where?: Prisma.WeaningWhereInput;
    orderBy?: Prisma.WeaningOrderByWithRelationInput | Prisma.WeaningOrderByWithRelationInput[];
    cursor?: Prisma.WeaningWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WeaningScalarFieldEnum | Prisma.WeaningScalarFieldEnum[];
};
export type WeaningCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelect<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    include?: Prisma.WeaningInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WeaningCreateInput, Prisma.WeaningUncheckedCreateInput>;
};
export type WeaningCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WeaningCreateManyInput | Prisma.WeaningCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WeaningCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    data: Prisma.WeaningCreateManyInput | Prisma.WeaningCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WeaningIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WeaningUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelect<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    include?: Prisma.WeaningInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WeaningUpdateInput, Prisma.WeaningUncheckedUpdateInput>;
    where: Prisma.WeaningWhereUniqueInput;
};
export type WeaningUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WeaningUpdateManyMutationInput, Prisma.WeaningUncheckedUpdateManyInput>;
    where?: Prisma.WeaningWhereInput;
    limit?: number;
};
export type WeaningUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WeaningUpdateManyMutationInput, Prisma.WeaningUncheckedUpdateManyInput>;
    where?: Prisma.WeaningWhereInput;
    limit?: number;
    include?: Prisma.WeaningIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WeaningUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelect<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    include?: Prisma.WeaningInclude<ExtArgs> | null;
    where: Prisma.WeaningWhereUniqueInput;
    create: Prisma.XOR<Prisma.WeaningCreateInput, Prisma.WeaningUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WeaningUpdateInput, Prisma.WeaningUncheckedUpdateInput>;
};
export type WeaningDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelect<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    include?: Prisma.WeaningInclude<ExtArgs> | null;
    where: Prisma.WeaningWhereUniqueInput;
};
export type WeaningDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WeaningWhereInput;
    limit?: number;
};
export type Weaning$rabbitsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningRabbitSelect<ExtArgs> | null;
    omit?: Prisma.WeaningRabbitOmit<ExtArgs> | null;
    include?: Prisma.WeaningRabbitInclude<ExtArgs> | null;
    where?: Prisma.WeaningRabbitWhereInput;
    orderBy?: Prisma.WeaningRabbitOrderByWithRelationInput | Prisma.WeaningRabbitOrderByWithRelationInput[];
    cursor?: Prisma.WeaningRabbitWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WeaningRabbitScalarFieldEnum | Prisma.WeaningRabbitScalarFieldEnum[];
};
export type WeaningDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeaningSelect<ExtArgs> | null;
    omit?: Prisma.WeaningOmit<ExtArgs> | null;
    include?: Prisma.WeaningInclude<ExtArgs> | null;
};
