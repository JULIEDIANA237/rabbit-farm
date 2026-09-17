import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type WeighingModel = runtime.Types.Result.DefaultSelection<Prisma.$WeighingPayload>;
export type AggregateWeighing = {
    _count: WeighingCountAggregateOutputType | null;
    _avg: WeighingAvgAggregateOutputType | null;
    _sum: WeighingSumAggregateOutputType | null;
    _min: WeighingMinAggregateOutputType | null;
    _max: WeighingMaxAggregateOutputType | null;
};
export type WeighingAvgAggregateOutputType = {
    totalWeight: number | null;
    animalCount: number | null;
    averageWeight: number | null;
    ageInDays: number | null;
};
export type WeighingSumAggregateOutputType = {
    totalWeight: number | null;
    animalCount: number | null;
    averageWeight: number | null;
    ageInDays: number | null;
};
export type WeighingMinAggregateOutputType = {
    id: string | null;
    rabbitId: string | null;
    lotId: string | null;
    date: Date | null;
    totalWeight: number | null;
    animalCount: number | null;
    averageWeight: number | null;
    ageInDays: number | null;
    observation: string | null;
    createdAt: Date | null;
};
export type WeighingMaxAggregateOutputType = {
    id: string | null;
    rabbitId: string | null;
    lotId: string | null;
    date: Date | null;
    totalWeight: number | null;
    animalCount: number | null;
    averageWeight: number | null;
    ageInDays: number | null;
    observation: string | null;
    createdAt: Date | null;
};
export type WeighingCountAggregateOutputType = {
    id: number;
    rabbitId: number;
    lotId: number;
    date: number;
    totalWeight: number;
    animalCount: number;
    averageWeight: number;
    ageInDays: number;
    observation: number;
    createdAt: number;
    _all: number;
};
export type WeighingAvgAggregateInputType = {
    totalWeight?: true;
    animalCount?: true;
    averageWeight?: true;
    ageInDays?: true;
};
export type WeighingSumAggregateInputType = {
    totalWeight?: true;
    animalCount?: true;
    averageWeight?: true;
    ageInDays?: true;
};
export type WeighingMinAggregateInputType = {
    id?: true;
    rabbitId?: true;
    lotId?: true;
    date?: true;
    totalWeight?: true;
    animalCount?: true;
    averageWeight?: true;
    ageInDays?: true;
    observation?: true;
    createdAt?: true;
};
export type WeighingMaxAggregateInputType = {
    id?: true;
    rabbitId?: true;
    lotId?: true;
    date?: true;
    totalWeight?: true;
    animalCount?: true;
    averageWeight?: true;
    ageInDays?: true;
    observation?: true;
    createdAt?: true;
};
export type WeighingCountAggregateInputType = {
    id?: true;
    rabbitId?: true;
    lotId?: true;
    date?: true;
    totalWeight?: true;
    animalCount?: true;
    averageWeight?: true;
    ageInDays?: true;
    observation?: true;
    createdAt?: true;
    _all?: true;
};
export type WeighingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WeighingWhereInput;
    orderBy?: Prisma.WeighingOrderByWithRelationInput | Prisma.WeighingOrderByWithRelationInput[];
    cursor?: Prisma.WeighingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WeighingCountAggregateInputType;
    _avg?: WeighingAvgAggregateInputType;
    _sum?: WeighingSumAggregateInputType;
    _min?: WeighingMinAggregateInputType;
    _max?: WeighingMaxAggregateInputType;
};
export type GetWeighingAggregateType<T extends WeighingAggregateArgs> = {
    [P in keyof T & keyof AggregateWeighing]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWeighing[P]> : Prisma.GetScalarType<T[P], AggregateWeighing[P]>;
};
export type WeighingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WeighingWhereInput;
    orderBy?: Prisma.WeighingOrderByWithAggregationInput | Prisma.WeighingOrderByWithAggregationInput[];
    by: Prisma.WeighingScalarFieldEnum[] | Prisma.WeighingScalarFieldEnum;
    having?: Prisma.WeighingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WeighingCountAggregateInputType | true;
    _avg?: WeighingAvgAggregateInputType;
    _sum?: WeighingSumAggregateInputType;
    _min?: WeighingMinAggregateInputType;
    _max?: WeighingMaxAggregateInputType;
};
export type WeighingGroupByOutputType = {
    id: string;
    rabbitId: string | null;
    lotId: string | null;
    date: Date;
    totalWeight: number;
    animalCount: number;
    averageWeight: number | null;
    ageInDays: number | null;
    observation: string | null;
    createdAt: Date;
    _count: WeighingCountAggregateOutputType | null;
    _avg: WeighingAvgAggregateOutputType | null;
    _sum: WeighingSumAggregateOutputType | null;
    _min: WeighingMinAggregateOutputType | null;
    _max: WeighingMaxAggregateOutputType | null;
};
export type GetWeighingGroupByPayload<T extends WeighingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WeighingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WeighingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WeighingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WeighingGroupByOutputType[P]>;
}>>;
export type WeighingWhereInput = {
    AND?: Prisma.WeighingWhereInput | Prisma.WeighingWhereInput[];
    OR?: Prisma.WeighingWhereInput[];
    NOT?: Prisma.WeighingWhereInput | Prisma.WeighingWhereInput[];
    id?: Prisma.StringFilter<"Weighing"> | string;
    rabbitId?: Prisma.StringNullableFilter<"Weighing"> | string | null;
    lotId?: Prisma.StringNullableFilter<"Weighing"> | string | null;
    date?: Prisma.DateTimeFilter<"Weighing"> | Date | string;
    totalWeight?: Prisma.FloatFilter<"Weighing"> | number;
    animalCount?: Prisma.IntFilter<"Weighing"> | number;
    averageWeight?: Prisma.FloatNullableFilter<"Weighing"> | number | null;
    ageInDays?: Prisma.IntNullableFilter<"Weighing"> | number | null;
    observation?: Prisma.StringNullableFilter<"Weighing"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Weighing"> | Date | string;
    rabbit?: Prisma.XOR<Prisma.RabbitNullableScalarRelationFilter, Prisma.RabbitWhereInput> | null;
    lot?: Prisma.XOR<Prisma.FatteningLotNullableScalarRelationFilter, Prisma.FatteningLotWhereInput> | null;
};
export type WeighingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrderInput | Prisma.SortOrder;
    lotId?: Prisma.SortOrderInput | Prisma.SortOrder;
    date?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrder;
    animalCount?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrderInput | Prisma.SortOrder;
    ageInDays?: Prisma.SortOrderInput | Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    rabbit?: Prisma.RabbitOrderByWithRelationInput;
    lot?: Prisma.FatteningLotOrderByWithRelationInput;
};
export type WeighingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.WeighingWhereInput | Prisma.WeighingWhereInput[];
    OR?: Prisma.WeighingWhereInput[];
    NOT?: Prisma.WeighingWhereInput | Prisma.WeighingWhereInput[];
    rabbitId?: Prisma.StringNullableFilter<"Weighing"> | string | null;
    lotId?: Prisma.StringNullableFilter<"Weighing"> | string | null;
    date?: Prisma.DateTimeFilter<"Weighing"> | Date | string;
    totalWeight?: Prisma.FloatFilter<"Weighing"> | number;
    animalCount?: Prisma.IntFilter<"Weighing"> | number;
    averageWeight?: Prisma.FloatNullableFilter<"Weighing"> | number | null;
    ageInDays?: Prisma.IntNullableFilter<"Weighing"> | number | null;
    observation?: Prisma.StringNullableFilter<"Weighing"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Weighing"> | Date | string;
    rabbit?: Prisma.XOR<Prisma.RabbitNullableScalarRelationFilter, Prisma.RabbitWhereInput> | null;
    lot?: Prisma.XOR<Prisma.FatteningLotNullableScalarRelationFilter, Prisma.FatteningLotWhereInput> | null;
}, "id">;
export type WeighingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrderInput | Prisma.SortOrder;
    lotId?: Prisma.SortOrderInput | Prisma.SortOrder;
    date?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrder;
    animalCount?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrderInput | Prisma.SortOrder;
    ageInDays?: Prisma.SortOrderInput | Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.WeighingCountOrderByAggregateInput;
    _avg?: Prisma.WeighingAvgOrderByAggregateInput;
    _max?: Prisma.WeighingMaxOrderByAggregateInput;
    _min?: Prisma.WeighingMinOrderByAggregateInput;
    _sum?: Prisma.WeighingSumOrderByAggregateInput;
};
export type WeighingScalarWhereWithAggregatesInput = {
    AND?: Prisma.WeighingScalarWhereWithAggregatesInput | Prisma.WeighingScalarWhereWithAggregatesInput[];
    OR?: Prisma.WeighingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WeighingScalarWhereWithAggregatesInput | Prisma.WeighingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Weighing"> | string;
    rabbitId?: Prisma.StringNullableWithAggregatesFilter<"Weighing"> | string | null;
    lotId?: Prisma.StringNullableWithAggregatesFilter<"Weighing"> | string | null;
    date?: Prisma.DateTimeWithAggregatesFilter<"Weighing"> | Date | string;
    totalWeight?: Prisma.FloatWithAggregatesFilter<"Weighing"> | number;
    animalCount?: Prisma.IntWithAggregatesFilter<"Weighing"> | number;
    averageWeight?: Prisma.FloatNullableWithAggregatesFilter<"Weighing"> | number | null;
    ageInDays?: Prisma.IntNullableWithAggregatesFilter<"Weighing"> | number | null;
    observation?: Prisma.StringNullableWithAggregatesFilter<"Weighing"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Weighing"> | Date | string;
};
export type WeighingCreateInput = {
    id?: string;
    date: Date | string;
    totalWeight: number;
    animalCount: number;
    averageWeight?: number | null;
    ageInDays?: number | null;
    observation?: string | null;
    createdAt?: Date | string;
    rabbit?: Prisma.RabbitCreateNestedOneWithoutWeighingsInput;
    lot?: Prisma.FatteningLotCreateNestedOneWithoutWeighingsInput;
};
export type WeighingUncheckedCreateInput = {
    id?: string;
    rabbitId?: string | null;
    lotId?: string | null;
    date: Date | string;
    totalWeight: number;
    animalCount: number;
    averageWeight?: number | null;
    ageInDays?: number | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type WeighingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalWeight?: Prisma.FloatFieldUpdateOperationsInput | number;
    animalCount?: Prisma.IntFieldUpdateOperationsInput | number;
    averageWeight?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    ageInDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbit?: Prisma.RabbitUpdateOneWithoutWeighingsNestedInput;
    lot?: Prisma.FatteningLotUpdateOneWithoutWeighingsNestedInput;
};
export type WeighingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lotId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalWeight?: Prisma.FloatFieldUpdateOperationsInput | number;
    animalCount?: Prisma.IntFieldUpdateOperationsInput | number;
    averageWeight?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    ageInDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeighingCreateManyInput = {
    id?: string;
    rabbitId?: string | null;
    lotId?: string | null;
    date: Date | string;
    totalWeight: number;
    animalCount: number;
    averageWeight?: number | null;
    ageInDays?: number | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type WeighingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalWeight?: Prisma.FloatFieldUpdateOperationsInput | number;
    animalCount?: Prisma.IntFieldUpdateOperationsInput | number;
    averageWeight?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    ageInDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeighingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    lotId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalWeight?: Prisma.FloatFieldUpdateOperationsInput | number;
    animalCount?: Prisma.IntFieldUpdateOperationsInput | number;
    averageWeight?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    ageInDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeighingListRelationFilter = {
    every?: Prisma.WeighingWhereInput;
    some?: Prisma.WeighingWhereInput;
    none?: Prisma.WeighingWhereInput;
};
export type WeighingOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WeighingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrder;
    animalCount?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrder;
    ageInDays?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WeighingAvgOrderByAggregateInput = {
    totalWeight?: Prisma.SortOrder;
    animalCount?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrder;
    ageInDays?: Prisma.SortOrder;
};
export type WeighingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrder;
    animalCount?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrder;
    ageInDays?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WeighingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    totalWeight?: Prisma.SortOrder;
    animalCount?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrder;
    ageInDays?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WeighingSumOrderByAggregateInput = {
    totalWeight?: Prisma.SortOrder;
    animalCount?: Prisma.SortOrder;
    averageWeight?: Prisma.SortOrder;
    ageInDays?: Prisma.SortOrder;
};
export type WeighingCreateNestedManyWithoutRabbitInput = {
    create?: Prisma.XOR<Prisma.WeighingCreateWithoutRabbitInput, Prisma.WeighingUncheckedCreateWithoutRabbitInput> | Prisma.WeighingCreateWithoutRabbitInput[] | Prisma.WeighingUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.WeighingCreateOrConnectWithoutRabbitInput | Prisma.WeighingCreateOrConnectWithoutRabbitInput[];
    createMany?: Prisma.WeighingCreateManyRabbitInputEnvelope;
    connect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
};
export type WeighingUncheckedCreateNestedManyWithoutRabbitInput = {
    create?: Prisma.XOR<Prisma.WeighingCreateWithoutRabbitInput, Prisma.WeighingUncheckedCreateWithoutRabbitInput> | Prisma.WeighingCreateWithoutRabbitInput[] | Prisma.WeighingUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.WeighingCreateOrConnectWithoutRabbitInput | Prisma.WeighingCreateOrConnectWithoutRabbitInput[];
    createMany?: Prisma.WeighingCreateManyRabbitInputEnvelope;
    connect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
};
export type WeighingUpdateManyWithoutRabbitNestedInput = {
    create?: Prisma.XOR<Prisma.WeighingCreateWithoutRabbitInput, Prisma.WeighingUncheckedCreateWithoutRabbitInput> | Prisma.WeighingCreateWithoutRabbitInput[] | Prisma.WeighingUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.WeighingCreateOrConnectWithoutRabbitInput | Prisma.WeighingCreateOrConnectWithoutRabbitInput[];
    upsert?: Prisma.WeighingUpsertWithWhereUniqueWithoutRabbitInput | Prisma.WeighingUpsertWithWhereUniqueWithoutRabbitInput[];
    createMany?: Prisma.WeighingCreateManyRabbitInputEnvelope;
    set?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    disconnect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    delete?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    connect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    update?: Prisma.WeighingUpdateWithWhereUniqueWithoutRabbitInput | Prisma.WeighingUpdateWithWhereUniqueWithoutRabbitInput[];
    updateMany?: Prisma.WeighingUpdateManyWithWhereWithoutRabbitInput | Prisma.WeighingUpdateManyWithWhereWithoutRabbitInput[];
    deleteMany?: Prisma.WeighingScalarWhereInput | Prisma.WeighingScalarWhereInput[];
};
export type WeighingUncheckedUpdateManyWithoutRabbitNestedInput = {
    create?: Prisma.XOR<Prisma.WeighingCreateWithoutRabbitInput, Prisma.WeighingUncheckedCreateWithoutRabbitInput> | Prisma.WeighingCreateWithoutRabbitInput[] | Prisma.WeighingUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.WeighingCreateOrConnectWithoutRabbitInput | Prisma.WeighingCreateOrConnectWithoutRabbitInput[];
    upsert?: Prisma.WeighingUpsertWithWhereUniqueWithoutRabbitInput | Prisma.WeighingUpsertWithWhereUniqueWithoutRabbitInput[];
    createMany?: Prisma.WeighingCreateManyRabbitInputEnvelope;
    set?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    disconnect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    delete?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    connect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    update?: Prisma.WeighingUpdateWithWhereUniqueWithoutRabbitInput | Prisma.WeighingUpdateWithWhereUniqueWithoutRabbitInput[];
    updateMany?: Prisma.WeighingUpdateManyWithWhereWithoutRabbitInput | Prisma.WeighingUpdateManyWithWhereWithoutRabbitInput[];
    deleteMany?: Prisma.WeighingScalarWhereInput | Prisma.WeighingScalarWhereInput[];
};
export type WeighingCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.WeighingCreateWithoutLotInput, Prisma.WeighingUncheckedCreateWithoutLotInput> | Prisma.WeighingCreateWithoutLotInput[] | Prisma.WeighingUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.WeighingCreateOrConnectWithoutLotInput | Prisma.WeighingCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.WeighingCreateManyLotInputEnvelope;
    connect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
};
export type WeighingUncheckedCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.WeighingCreateWithoutLotInput, Prisma.WeighingUncheckedCreateWithoutLotInput> | Prisma.WeighingCreateWithoutLotInput[] | Prisma.WeighingUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.WeighingCreateOrConnectWithoutLotInput | Prisma.WeighingCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.WeighingCreateManyLotInputEnvelope;
    connect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
};
export type WeighingUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.WeighingCreateWithoutLotInput, Prisma.WeighingUncheckedCreateWithoutLotInput> | Prisma.WeighingCreateWithoutLotInput[] | Prisma.WeighingUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.WeighingCreateOrConnectWithoutLotInput | Prisma.WeighingCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.WeighingUpsertWithWhereUniqueWithoutLotInput | Prisma.WeighingUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.WeighingCreateManyLotInputEnvelope;
    set?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    disconnect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    delete?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    connect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    update?: Prisma.WeighingUpdateWithWhereUniqueWithoutLotInput | Prisma.WeighingUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.WeighingUpdateManyWithWhereWithoutLotInput | Prisma.WeighingUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.WeighingScalarWhereInput | Prisma.WeighingScalarWhereInput[];
};
export type WeighingUncheckedUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.WeighingCreateWithoutLotInput, Prisma.WeighingUncheckedCreateWithoutLotInput> | Prisma.WeighingCreateWithoutLotInput[] | Prisma.WeighingUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.WeighingCreateOrConnectWithoutLotInput | Prisma.WeighingCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.WeighingUpsertWithWhereUniqueWithoutLotInput | Prisma.WeighingUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.WeighingCreateManyLotInputEnvelope;
    set?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    disconnect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    delete?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    connect?: Prisma.WeighingWhereUniqueInput | Prisma.WeighingWhereUniqueInput[];
    update?: Prisma.WeighingUpdateWithWhereUniqueWithoutLotInput | Prisma.WeighingUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.WeighingUpdateManyWithWhereWithoutLotInput | Prisma.WeighingUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.WeighingScalarWhereInput | Prisma.WeighingScalarWhereInput[];
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type WeighingCreateWithoutRabbitInput = {
    id?: string;
    date: Date | string;
    totalWeight: number;
    animalCount: number;
    averageWeight?: number | null;
    ageInDays?: number | null;
    observation?: string | null;
    createdAt?: Date | string;
    lot?: Prisma.FatteningLotCreateNestedOneWithoutWeighingsInput;
};
export type WeighingUncheckedCreateWithoutRabbitInput = {
    id?: string;
    lotId?: string | null;
    date: Date | string;
    totalWeight: number;
    animalCount: number;
    averageWeight?: number | null;
    ageInDays?: number | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type WeighingCreateOrConnectWithoutRabbitInput = {
    where: Prisma.WeighingWhereUniqueInput;
    create: Prisma.XOR<Prisma.WeighingCreateWithoutRabbitInput, Prisma.WeighingUncheckedCreateWithoutRabbitInput>;
};
export type WeighingCreateManyRabbitInputEnvelope = {
    data: Prisma.WeighingCreateManyRabbitInput | Prisma.WeighingCreateManyRabbitInput[];
    skipDuplicates?: boolean;
};
export type WeighingUpsertWithWhereUniqueWithoutRabbitInput = {
    where: Prisma.WeighingWhereUniqueInput;
    update: Prisma.XOR<Prisma.WeighingUpdateWithoutRabbitInput, Prisma.WeighingUncheckedUpdateWithoutRabbitInput>;
    create: Prisma.XOR<Prisma.WeighingCreateWithoutRabbitInput, Prisma.WeighingUncheckedCreateWithoutRabbitInput>;
};
export type WeighingUpdateWithWhereUniqueWithoutRabbitInput = {
    where: Prisma.WeighingWhereUniqueInput;
    data: Prisma.XOR<Prisma.WeighingUpdateWithoutRabbitInput, Prisma.WeighingUncheckedUpdateWithoutRabbitInput>;
};
export type WeighingUpdateManyWithWhereWithoutRabbitInput = {
    where: Prisma.WeighingScalarWhereInput;
    data: Prisma.XOR<Prisma.WeighingUpdateManyMutationInput, Prisma.WeighingUncheckedUpdateManyWithoutRabbitInput>;
};
export type WeighingScalarWhereInput = {
    AND?: Prisma.WeighingScalarWhereInput | Prisma.WeighingScalarWhereInput[];
    OR?: Prisma.WeighingScalarWhereInput[];
    NOT?: Prisma.WeighingScalarWhereInput | Prisma.WeighingScalarWhereInput[];
    id?: Prisma.StringFilter<"Weighing"> | string;
    rabbitId?: Prisma.StringNullableFilter<"Weighing"> | string | null;
    lotId?: Prisma.StringNullableFilter<"Weighing"> | string | null;
    date?: Prisma.DateTimeFilter<"Weighing"> | Date | string;
    totalWeight?: Prisma.FloatFilter<"Weighing"> | number;
    animalCount?: Prisma.IntFilter<"Weighing"> | number;
    averageWeight?: Prisma.FloatNullableFilter<"Weighing"> | number | null;
    ageInDays?: Prisma.IntNullableFilter<"Weighing"> | number | null;
    observation?: Prisma.StringNullableFilter<"Weighing"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Weighing"> | Date | string;
};
export type WeighingCreateWithoutLotInput = {
    id?: string;
    date: Date | string;
    totalWeight: number;
    animalCount: number;
    averageWeight?: number | null;
    ageInDays?: number | null;
    observation?: string | null;
    createdAt?: Date | string;
    rabbit?: Prisma.RabbitCreateNestedOneWithoutWeighingsInput;
};
export type WeighingUncheckedCreateWithoutLotInput = {
    id?: string;
    rabbitId?: string | null;
    date: Date | string;
    totalWeight: number;
    animalCount: number;
    averageWeight?: number | null;
    ageInDays?: number | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type WeighingCreateOrConnectWithoutLotInput = {
    where: Prisma.WeighingWhereUniqueInput;
    create: Prisma.XOR<Prisma.WeighingCreateWithoutLotInput, Prisma.WeighingUncheckedCreateWithoutLotInput>;
};
export type WeighingCreateManyLotInputEnvelope = {
    data: Prisma.WeighingCreateManyLotInput | Prisma.WeighingCreateManyLotInput[];
    skipDuplicates?: boolean;
};
export type WeighingUpsertWithWhereUniqueWithoutLotInput = {
    where: Prisma.WeighingWhereUniqueInput;
    update: Prisma.XOR<Prisma.WeighingUpdateWithoutLotInput, Prisma.WeighingUncheckedUpdateWithoutLotInput>;
    create: Prisma.XOR<Prisma.WeighingCreateWithoutLotInput, Prisma.WeighingUncheckedCreateWithoutLotInput>;
};
export type WeighingUpdateWithWhereUniqueWithoutLotInput = {
    where: Prisma.WeighingWhereUniqueInput;
    data: Prisma.XOR<Prisma.WeighingUpdateWithoutLotInput, Prisma.WeighingUncheckedUpdateWithoutLotInput>;
};
export type WeighingUpdateManyWithWhereWithoutLotInput = {
    where: Prisma.WeighingScalarWhereInput;
    data: Prisma.XOR<Prisma.WeighingUpdateManyMutationInput, Prisma.WeighingUncheckedUpdateManyWithoutLotInput>;
};
export type WeighingCreateManyRabbitInput = {
    id?: string;
    lotId?: string | null;
    date: Date | string;
    totalWeight: number;
    animalCount: number;
    averageWeight?: number | null;
    ageInDays?: number | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type WeighingUpdateWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalWeight?: Prisma.FloatFieldUpdateOperationsInput | number;
    animalCount?: Prisma.IntFieldUpdateOperationsInput | number;
    averageWeight?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    ageInDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lot?: Prisma.FatteningLotUpdateOneWithoutWeighingsNestedInput;
};
export type WeighingUncheckedUpdateWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalWeight?: Prisma.FloatFieldUpdateOperationsInput | number;
    animalCount?: Prisma.IntFieldUpdateOperationsInput | number;
    averageWeight?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    ageInDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeighingUncheckedUpdateManyWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalWeight?: Prisma.FloatFieldUpdateOperationsInput | number;
    animalCount?: Prisma.IntFieldUpdateOperationsInput | number;
    averageWeight?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    ageInDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeighingCreateManyLotInput = {
    id?: string;
    rabbitId?: string | null;
    date: Date | string;
    totalWeight: number;
    animalCount: number;
    averageWeight?: number | null;
    ageInDays?: number | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type WeighingUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalWeight?: Prisma.FloatFieldUpdateOperationsInput | number;
    animalCount?: Prisma.IntFieldUpdateOperationsInput | number;
    averageWeight?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    ageInDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbit?: Prisma.RabbitUpdateOneWithoutWeighingsNestedInput;
};
export type WeighingUncheckedUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalWeight?: Prisma.FloatFieldUpdateOperationsInput | number;
    animalCount?: Prisma.IntFieldUpdateOperationsInput | number;
    averageWeight?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    ageInDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeighingUncheckedUpdateManyWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalWeight?: Prisma.FloatFieldUpdateOperationsInput | number;
    animalCount?: Prisma.IntFieldUpdateOperationsInput | number;
    averageWeight?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    ageInDays?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WeighingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rabbitId?: boolean;
    lotId?: boolean;
    date?: boolean;
    totalWeight?: boolean;
    animalCount?: boolean;
    averageWeight?: boolean;
    ageInDays?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    rabbit?: boolean | Prisma.Weighing$rabbitArgs<ExtArgs>;
    lot?: boolean | Prisma.Weighing$lotArgs<ExtArgs>;
}, ExtArgs["result"]["weighing"]>;
export type WeighingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rabbitId?: boolean;
    lotId?: boolean;
    date?: boolean;
    totalWeight?: boolean;
    animalCount?: boolean;
    averageWeight?: boolean;
    ageInDays?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    rabbit?: boolean | Prisma.Weighing$rabbitArgs<ExtArgs>;
    lot?: boolean | Prisma.Weighing$lotArgs<ExtArgs>;
}, ExtArgs["result"]["weighing"]>;
export type WeighingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rabbitId?: boolean;
    lotId?: boolean;
    date?: boolean;
    totalWeight?: boolean;
    animalCount?: boolean;
    averageWeight?: boolean;
    ageInDays?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    rabbit?: boolean | Prisma.Weighing$rabbitArgs<ExtArgs>;
    lot?: boolean | Prisma.Weighing$lotArgs<ExtArgs>;
}, ExtArgs["result"]["weighing"]>;
export type WeighingSelectScalar = {
    id?: boolean;
    rabbitId?: boolean;
    lotId?: boolean;
    date?: boolean;
    totalWeight?: boolean;
    animalCount?: boolean;
    averageWeight?: boolean;
    ageInDays?: boolean;
    observation?: boolean;
    createdAt?: boolean;
};
export type WeighingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "rabbitId" | "lotId" | "date" | "totalWeight" | "animalCount" | "averageWeight" | "ageInDays" | "observation" | "createdAt", ExtArgs["result"]["weighing"]>;
export type WeighingInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbit?: boolean | Prisma.Weighing$rabbitArgs<ExtArgs>;
    lot?: boolean | Prisma.Weighing$lotArgs<ExtArgs>;
};
export type WeighingIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbit?: boolean | Prisma.Weighing$rabbitArgs<ExtArgs>;
    lot?: boolean | Prisma.Weighing$lotArgs<ExtArgs>;
};
export type WeighingIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbit?: boolean | Prisma.Weighing$rabbitArgs<ExtArgs>;
    lot?: boolean | Prisma.Weighing$lotArgs<ExtArgs>;
};
export type $WeighingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Weighing";
    objects: {
        rabbit: Prisma.$RabbitPayload<ExtArgs> | null;
        lot: Prisma.$FatteningLotPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        rabbitId: string | null;
        lotId: string | null;
        date: Date;
        totalWeight: number;
        animalCount: number;
        averageWeight: number | null;
        ageInDays: number | null;
        observation: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["weighing"]>;
    composites: {};
};
export type WeighingGetPayload<S extends boolean | null | undefined | WeighingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WeighingPayload, S>;
export type WeighingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WeighingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WeighingCountAggregateInputType | true;
};
export interface WeighingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Weighing'];
        meta: {
            name: 'Weighing';
        };
    };
    findUnique<T extends WeighingFindUniqueArgs>(args: Prisma.SelectSubset<T, WeighingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WeighingClient<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WeighingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WeighingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WeighingClient<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WeighingFindFirstArgs>(args?: Prisma.SelectSubset<T, WeighingFindFirstArgs<ExtArgs>>): Prisma.Prisma__WeighingClient<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WeighingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WeighingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WeighingClient<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WeighingFindManyArgs>(args?: Prisma.SelectSubset<T, WeighingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WeighingCreateArgs>(args: Prisma.SelectSubset<T, WeighingCreateArgs<ExtArgs>>): Prisma.Prisma__WeighingClient<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WeighingCreateManyArgs>(args?: Prisma.SelectSubset<T, WeighingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WeighingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WeighingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WeighingDeleteArgs>(args: Prisma.SelectSubset<T, WeighingDeleteArgs<ExtArgs>>): Prisma.Prisma__WeighingClient<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WeighingUpdateArgs>(args: Prisma.SelectSubset<T, WeighingUpdateArgs<ExtArgs>>): Prisma.Prisma__WeighingClient<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WeighingDeleteManyArgs>(args?: Prisma.SelectSubset<T, WeighingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WeighingUpdateManyArgs>(args: Prisma.SelectSubset<T, WeighingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WeighingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WeighingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WeighingUpsertArgs>(args: Prisma.SelectSubset<T, WeighingUpsertArgs<ExtArgs>>): Prisma.Prisma__WeighingClient<runtime.Types.Result.GetResult<Prisma.$WeighingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WeighingCountArgs>(args?: Prisma.Subset<T, WeighingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WeighingCountAggregateOutputType> : number>;
    aggregate<T extends WeighingAggregateArgs>(args: Prisma.Subset<T, WeighingAggregateArgs>): Prisma.PrismaPromise<GetWeighingAggregateType<T>>;
    groupBy<T extends WeighingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WeighingGroupByArgs['orderBy'];
    } : {
        orderBy?: WeighingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WeighingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWeighingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WeighingFieldRefs;
}
export interface Prisma__WeighingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    rabbit<T extends Prisma.Weighing$rabbitArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Weighing$rabbitArgs<ExtArgs>>): Prisma.Prisma__RabbitClient<runtime.Types.Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    lot<T extends Prisma.Weighing$lotArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Weighing$lotArgs<ExtArgs>>): Prisma.Prisma__FatteningLotClient<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WeighingFieldRefs {
    readonly id: Prisma.FieldRef<"Weighing", 'String'>;
    readonly rabbitId: Prisma.FieldRef<"Weighing", 'String'>;
    readonly lotId: Prisma.FieldRef<"Weighing", 'String'>;
    readonly date: Prisma.FieldRef<"Weighing", 'DateTime'>;
    readonly totalWeight: Prisma.FieldRef<"Weighing", 'Float'>;
    readonly animalCount: Prisma.FieldRef<"Weighing", 'Int'>;
    readonly averageWeight: Prisma.FieldRef<"Weighing", 'Float'>;
    readonly ageInDays: Prisma.FieldRef<"Weighing", 'Int'>;
    readonly observation: Prisma.FieldRef<"Weighing", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Weighing", 'DateTime'>;
}
export type WeighingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeighingSelect<ExtArgs> | null;
    omit?: Prisma.WeighingOmit<ExtArgs> | null;
    include?: Prisma.WeighingInclude<ExtArgs> | null;
    where: Prisma.WeighingWhereUniqueInput;
};
export type WeighingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeighingSelect<ExtArgs> | null;
    omit?: Prisma.WeighingOmit<ExtArgs> | null;
    include?: Prisma.WeighingInclude<ExtArgs> | null;
    where: Prisma.WeighingWhereUniqueInput;
};
export type WeighingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type WeighingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type WeighingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type WeighingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeighingSelect<ExtArgs> | null;
    omit?: Prisma.WeighingOmit<ExtArgs> | null;
    include?: Prisma.WeighingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WeighingCreateInput, Prisma.WeighingUncheckedCreateInput>;
};
export type WeighingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WeighingCreateManyInput | Prisma.WeighingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WeighingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeighingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WeighingOmit<ExtArgs> | null;
    data: Prisma.WeighingCreateManyInput | Prisma.WeighingCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WeighingIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WeighingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeighingSelect<ExtArgs> | null;
    omit?: Prisma.WeighingOmit<ExtArgs> | null;
    include?: Prisma.WeighingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WeighingUpdateInput, Prisma.WeighingUncheckedUpdateInput>;
    where: Prisma.WeighingWhereUniqueInput;
};
export type WeighingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WeighingUpdateManyMutationInput, Prisma.WeighingUncheckedUpdateManyInput>;
    where?: Prisma.WeighingWhereInput;
    limit?: number;
};
export type WeighingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeighingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WeighingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WeighingUpdateManyMutationInput, Prisma.WeighingUncheckedUpdateManyInput>;
    where?: Prisma.WeighingWhereInput;
    limit?: number;
    include?: Prisma.WeighingIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WeighingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeighingSelect<ExtArgs> | null;
    omit?: Prisma.WeighingOmit<ExtArgs> | null;
    include?: Prisma.WeighingInclude<ExtArgs> | null;
    where: Prisma.WeighingWhereUniqueInput;
    create: Prisma.XOR<Prisma.WeighingCreateInput, Prisma.WeighingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WeighingUpdateInput, Prisma.WeighingUncheckedUpdateInput>;
};
export type WeighingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeighingSelect<ExtArgs> | null;
    omit?: Prisma.WeighingOmit<ExtArgs> | null;
    include?: Prisma.WeighingInclude<ExtArgs> | null;
    where: Prisma.WeighingWhereUniqueInput;
};
export type WeighingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WeighingWhereInput;
    limit?: number;
};
export type Weighing$rabbitArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitSelect<ExtArgs> | null;
    omit?: Prisma.RabbitOmit<ExtArgs> | null;
    include?: Prisma.RabbitInclude<ExtArgs> | null;
    where?: Prisma.RabbitWhereInput;
};
export type Weighing$lotArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FatteningLotSelect<ExtArgs> | null;
    omit?: Prisma.FatteningLotOmit<ExtArgs> | null;
    include?: Prisma.FatteningLotInclude<ExtArgs> | null;
    where?: Prisma.FatteningLotWhereInput;
};
export type WeighingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WeighingSelect<ExtArgs> | null;
    omit?: Prisma.WeighingOmit<ExtArgs> | null;
    include?: Prisma.WeighingInclude<ExtArgs> | null;
};
