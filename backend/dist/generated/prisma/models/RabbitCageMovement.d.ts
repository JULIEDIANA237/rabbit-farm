import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RabbitCageMovementModel = runtime.Types.Result.DefaultSelection<Prisma.$RabbitCageMovementPayload>;
export type AggregateRabbitCageMovement = {
    _count: RabbitCageMovementCountAggregateOutputType | null;
    _min: RabbitCageMovementMinAggregateOutputType | null;
    _max: RabbitCageMovementMaxAggregateOutputType | null;
};
export type RabbitCageMovementMinAggregateOutputType = {
    id: string | null;
    rabbitId: string | null;
    cageId: string | null;
    startedAt: Date | null;
    endedAt: Date | null;
    reason: string | null;
    observation: string | null;
    createdAt: Date | null;
};
export type RabbitCageMovementMaxAggregateOutputType = {
    id: string | null;
    rabbitId: string | null;
    cageId: string | null;
    startedAt: Date | null;
    endedAt: Date | null;
    reason: string | null;
    observation: string | null;
    createdAt: Date | null;
};
export type RabbitCageMovementCountAggregateOutputType = {
    id: number;
    rabbitId: number;
    cageId: number;
    startedAt: number;
    endedAt: number;
    reason: number;
    observation: number;
    createdAt: number;
    _all: number;
};
export type RabbitCageMovementMinAggregateInputType = {
    id?: true;
    rabbitId?: true;
    cageId?: true;
    startedAt?: true;
    endedAt?: true;
    reason?: true;
    observation?: true;
    createdAt?: true;
};
export type RabbitCageMovementMaxAggregateInputType = {
    id?: true;
    rabbitId?: true;
    cageId?: true;
    startedAt?: true;
    endedAt?: true;
    reason?: true;
    observation?: true;
    createdAt?: true;
};
export type RabbitCageMovementCountAggregateInputType = {
    id?: true;
    rabbitId?: true;
    cageId?: true;
    startedAt?: true;
    endedAt?: true;
    reason?: true;
    observation?: true;
    createdAt?: true;
    _all?: true;
};
export type RabbitCageMovementAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RabbitCageMovementWhereInput;
    orderBy?: Prisma.RabbitCageMovementOrderByWithRelationInput | Prisma.RabbitCageMovementOrderByWithRelationInput[];
    cursor?: Prisma.RabbitCageMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RabbitCageMovementCountAggregateInputType;
    _min?: RabbitCageMovementMinAggregateInputType;
    _max?: RabbitCageMovementMaxAggregateInputType;
};
export type GetRabbitCageMovementAggregateType<T extends RabbitCageMovementAggregateArgs> = {
    [P in keyof T & keyof AggregateRabbitCageMovement]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRabbitCageMovement[P]> : Prisma.GetScalarType<T[P], AggregateRabbitCageMovement[P]>;
};
export type RabbitCageMovementGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RabbitCageMovementWhereInput;
    orderBy?: Prisma.RabbitCageMovementOrderByWithAggregationInput | Prisma.RabbitCageMovementOrderByWithAggregationInput[];
    by: Prisma.RabbitCageMovementScalarFieldEnum[] | Prisma.RabbitCageMovementScalarFieldEnum;
    having?: Prisma.RabbitCageMovementScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RabbitCageMovementCountAggregateInputType | true;
    _min?: RabbitCageMovementMinAggregateInputType;
    _max?: RabbitCageMovementMaxAggregateInputType;
};
export type RabbitCageMovementGroupByOutputType = {
    id: string;
    rabbitId: string;
    cageId: string;
    startedAt: Date;
    endedAt: Date | null;
    reason: string | null;
    observation: string | null;
    createdAt: Date;
    _count: RabbitCageMovementCountAggregateOutputType | null;
    _min: RabbitCageMovementMinAggregateOutputType | null;
    _max: RabbitCageMovementMaxAggregateOutputType | null;
};
export type GetRabbitCageMovementGroupByPayload<T extends RabbitCageMovementGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RabbitCageMovementGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RabbitCageMovementGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RabbitCageMovementGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RabbitCageMovementGroupByOutputType[P]>;
}>>;
export type RabbitCageMovementWhereInput = {
    AND?: Prisma.RabbitCageMovementWhereInput | Prisma.RabbitCageMovementWhereInput[];
    OR?: Prisma.RabbitCageMovementWhereInput[];
    NOT?: Prisma.RabbitCageMovementWhereInput | Prisma.RabbitCageMovementWhereInput[];
    id?: Prisma.StringFilter<"RabbitCageMovement"> | string;
    rabbitId?: Prisma.StringFilter<"RabbitCageMovement"> | string;
    cageId?: Prisma.StringFilter<"RabbitCageMovement"> | string;
    startedAt?: Prisma.DateTimeFilter<"RabbitCageMovement"> | Date | string;
    endedAt?: Prisma.DateTimeNullableFilter<"RabbitCageMovement"> | Date | string | null;
    reason?: Prisma.StringNullableFilter<"RabbitCageMovement"> | string | null;
    observation?: Prisma.StringNullableFilter<"RabbitCageMovement"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RabbitCageMovement"> | Date | string;
    rabbit?: Prisma.XOR<Prisma.RabbitScalarRelationFilter, Prisma.RabbitWhereInput>;
    cage?: Prisma.XOR<Prisma.CageScalarRelationFilter, Prisma.CageWhereInput>;
};
export type RabbitCageMovementOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    cageId?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    endedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    rabbit?: Prisma.RabbitOrderByWithRelationInput;
    cage?: Prisma.CageOrderByWithRelationInput;
};
export type RabbitCageMovementWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RabbitCageMovementWhereInput | Prisma.RabbitCageMovementWhereInput[];
    OR?: Prisma.RabbitCageMovementWhereInput[];
    NOT?: Prisma.RabbitCageMovementWhereInput | Prisma.RabbitCageMovementWhereInput[];
    rabbitId?: Prisma.StringFilter<"RabbitCageMovement"> | string;
    cageId?: Prisma.StringFilter<"RabbitCageMovement"> | string;
    startedAt?: Prisma.DateTimeFilter<"RabbitCageMovement"> | Date | string;
    endedAt?: Prisma.DateTimeNullableFilter<"RabbitCageMovement"> | Date | string | null;
    reason?: Prisma.StringNullableFilter<"RabbitCageMovement"> | string | null;
    observation?: Prisma.StringNullableFilter<"RabbitCageMovement"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RabbitCageMovement"> | Date | string;
    rabbit?: Prisma.XOR<Prisma.RabbitScalarRelationFilter, Prisma.RabbitWhereInput>;
    cage?: Prisma.XOR<Prisma.CageScalarRelationFilter, Prisma.CageWhereInput>;
}, "id">;
export type RabbitCageMovementOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    cageId?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    endedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RabbitCageMovementCountOrderByAggregateInput;
    _max?: Prisma.RabbitCageMovementMaxOrderByAggregateInput;
    _min?: Prisma.RabbitCageMovementMinOrderByAggregateInput;
};
export type RabbitCageMovementScalarWhereWithAggregatesInput = {
    AND?: Prisma.RabbitCageMovementScalarWhereWithAggregatesInput | Prisma.RabbitCageMovementScalarWhereWithAggregatesInput[];
    OR?: Prisma.RabbitCageMovementScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RabbitCageMovementScalarWhereWithAggregatesInput | Prisma.RabbitCageMovementScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RabbitCageMovement"> | string;
    rabbitId?: Prisma.StringWithAggregatesFilter<"RabbitCageMovement"> | string;
    cageId?: Prisma.StringWithAggregatesFilter<"RabbitCageMovement"> | string;
    startedAt?: Prisma.DateTimeWithAggregatesFilter<"RabbitCageMovement"> | Date | string;
    endedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"RabbitCageMovement"> | Date | string | null;
    reason?: Prisma.StringNullableWithAggregatesFilter<"RabbitCageMovement"> | string | null;
    observation?: Prisma.StringNullableWithAggregatesFilter<"RabbitCageMovement"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RabbitCageMovement"> | Date | string;
};
export type RabbitCageMovementCreateInput = {
    id?: string;
    startedAt: Date | string;
    endedAt?: Date | string | null;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    rabbit: Prisma.RabbitCreateNestedOneWithoutCageMovementsInput;
    cage: Prisma.CageCreateNestedOneWithoutRabbitMovementsInput;
};
export type RabbitCageMovementUncheckedCreateInput = {
    id?: string;
    rabbitId: string;
    cageId: string;
    startedAt: Date | string;
    endedAt?: Date | string | null;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type RabbitCageMovementUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbit?: Prisma.RabbitUpdateOneRequiredWithoutCageMovementsNestedInput;
    cage?: Prisma.CageUpdateOneRequiredWithoutRabbitMovementsNestedInput;
};
export type RabbitCageMovementUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    cageId?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitCageMovementCreateManyInput = {
    id?: string;
    rabbitId: string;
    cageId: string;
    startedAt: Date | string;
    endedAt?: Date | string | null;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type RabbitCageMovementUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitCageMovementUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    cageId?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitCageMovementListRelationFilter = {
    every?: Prisma.RabbitCageMovementWhereInput;
    some?: Prisma.RabbitCageMovementWhereInput;
    none?: Prisma.RabbitCageMovementWhereInput;
};
export type RabbitCageMovementOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RabbitCageMovementCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    cageId?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    endedAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RabbitCageMovementMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    cageId?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    endedAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RabbitCageMovementMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    cageId?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    endedAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RabbitCageMovementCreateNestedManyWithoutCageInput = {
    create?: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutCageInput, Prisma.RabbitCageMovementUncheckedCreateWithoutCageInput> | Prisma.RabbitCageMovementCreateWithoutCageInput[] | Prisma.RabbitCageMovementUncheckedCreateWithoutCageInput[];
    connectOrCreate?: Prisma.RabbitCageMovementCreateOrConnectWithoutCageInput | Prisma.RabbitCageMovementCreateOrConnectWithoutCageInput[];
    createMany?: Prisma.RabbitCageMovementCreateManyCageInputEnvelope;
    connect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
};
export type RabbitCageMovementUncheckedCreateNestedManyWithoutCageInput = {
    create?: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutCageInput, Prisma.RabbitCageMovementUncheckedCreateWithoutCageInput> | Prisma.RabbitCageMovementCreateWithoutCageInput[] | Prisma.RabbitCageMovementUncheckedCreateWithoutCageInput[];
    connectOrCreate?: Prisma.RabbitCageMovementCreateOrConnectWithoutCageInput | Prisma.RabbitCageMovementCreateOrConnectWithoutCageInput[];
    createMany?: Prisma.RabbitCageMovementCreateManyCageInputEnvelope;
    connect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
};
export type RabbitCageMovementUpdateManyWithoutCageNestedInput = {
    create?: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutCageInput, Prisma.RabbitCageMovementUncheckedCreateWithoutCageInput> | Prisma.RabbitCageMovementCreateWithoutCageInput[] | Prisma.RabbitCageMovementUncheckedCreateWithoutCageInput[];
    connectOrCreate?: Prisma.RabbitCageMovementCreateOrConnectWithoutCageInput | Prisma.RabbitCageMovementCreateOrConnectWithoutCageInput[];
    upsert?: Prisma.RabbitCageMovementUpsertWithWhereUniqueWithoutCageInput | Prisma.RabbitCageMovementUpsertWithWhereUniqueWithoutCageInput[];
    createMany?: Prisma.RabbitCageMovementCreateManyCageInputEnvelope;
    set?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    disconnect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    delete?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    connect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    update?: Prisma.RabbitCageMovementUpdateWithWhereUniqueWithoutCageInput | Prisma.RabbitCageMovementUpdateWithWhereUniqueWithoutCageInput[];
    updateMany?: Prisma.RabbitCageMovementUpdateManyWithWhereWithoutCageInput | Prisma.RabbitCageMovementUpdateManyWithWhereWithoutCageInput[];
    deleteMany?: Prisma.RabbitCageMovementScalarWhereInput | Prisma.RabbitCageMovementScalarWhereInput[];
};
export type RabbitCageMovementUncheckedUpdateManyWithoutCageNestedInput = {
    create?: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutCageInput, Prisma.RabbitCageMovementUncheckedCreateWithoutCageInput> | Prisma.RabbitCageMovementCreateWithoutCageInput[] | Prisma.RabbitCageMovementUncheckedCreateWithoutCageInput[];
    connectOrCreate?: Prisma.RabbitCageMovementCreateOrConnectWithoutCageInput | Prisma.RabbitCageMovementCreateOrConnectWithoutCageInput[];
    upsert?: Prisma.RabbitCageMovementUpsertWithWhereUniqueWithoutCageInput | Prisma.RabbitCageMovementUpsertWithWhereUniqueWithoutCageInput[];
    createMany?: Prisma.RabbitCageMovementCreateManyCageInputEnvelope;
    set?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    disconnect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    delete?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    connect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    update?: Prisma.RabbitCageMovementUpdateWithWhereUniqueWithoutCageInput | Prisma.RabbitCageMovementUpdateWithWhereUniqueWithoutCageInput[];
    updateMany?: Prisma.RabbitCageMovementUpdateManyWithWhereWithoutCageInput | Prisma.RabbitCageMovementUpdateManyWithWhereWithoutCageInput[];
    deleteMany?: Prisma.RabbitCageMovementScalarWhereInput | Prisma.RabbitCageMovementScalarWhereInput[];
};
export type RabbitCageMovementCreateNestedManyWithoutRabbitInput = {
    create?: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutRabbitInput, Prisma.RabbitCageMovementUncheckedCreateWithoutRabbitInput> | Prisma.RabbitCageMovementCreateWithoutRabbitInput[] | Prisma.RabbitCageMovementUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.RabbitCageMovementCreateOrConnectWithoutRabbitInput | Prisma.RabbitCageMovementCreateOrConnectWithoutRabbitInput[];
    createMany?: Prisma.RabbitCageMovementCreateManyRabbitInputEnvelope;
    connect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
};
export type RabbitCageMovementUncheckedCreateNestedManyWithoutRabbitInput = {
    create?: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutRabbitInput, Prisma.RabbitCageMovementUncheckedCreateWithoutRabbitInput> | Prisma.RabbitCageMovementCreateWithoutRabbitInput[] | Prisma.RabbitCageMovementUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.RabbitCageMovementCreateOrConnectWithoutRabbitInput | Prisma.RabbitCageMovementCreateOrConnectWithoutRabbitInput[];
    createMany?: Prisma.RabbitCageMovementCreateManyRabbitInputEnvelope;
    connect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
};
export type RabbitCageMovementUpdateManyWithoutRabbitNestedInput = {
    create?: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutRabbitInput, Prisma.RabbitCageMovementUncheckedCreateWithoutRabbitInput> | Prisma.RabbitCageMovementCreateWithoutRabbitInput[] | Prisma.RabbitCageMovementUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.RabbitCageMovementCreateOrConnectWithoutRabbitInput | Prisma.RabbitCageMovementCreateOrConnectWithoutRabbitInput[];
    upsert?: Prisma.RabbitCageMovementUpsertWithWhereUniqueWithoutRabbitInput | Prisma.RabbitCageMovementUpsertWithWhereUniqueWithoutRabbitInput[];
    createMany?: Prisma.RabbitCageMovementCreateManyRabbitInputEnvelope;
    set?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    disconnect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    delete?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    connect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    update?: Prisma.RabbitCageMovementUpdateWithWhereUniqueWithoutRabbitInput | Prisma.RabbitCageMovementUpdateWithWhereUniqueWithoutRabbitInput[];
    updateMany?: Prisma.RabbitCageMovementUpdateManyWithWhereWithoutRabbitInput | Prisma.RabbitCageMovementUpdateManyWithWhereWithoutRabbitInput[];
    deleteMany?: Prisma.RabbitCageMovementScalarWhereInput | Prisma.RabbitCageMovementScalarWhereInput[];
};
export type RabbitCageMovementUncheckedUpdateManyWithoutRabbitNestedInput = {
    create?: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutRabbitInput, Prisma.RabbitCageMovementUncheckedCreateWithoutRabbitInput> | Prisma.RabbitCageMovementCreateWithoutRabbitInput[] | Prisma.RabbitCageMovementUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.RabbitCageMovementCreateOrConnectWithoutRabbitInput | Prisma.RabbitCageMovementCreateOrConnectWithoutRabbitInput[];
    upsert?: Prisma.RabbitCageMovementUpsertWithWhereUniqueWithoutRabbitInput | Prisma.RabbitCageMovementUpsertWithWhereUniqueWithoutRabbitInput[];
    createMany?: Prisma.RabbitCageMovementCreateManyRabbitInputEnvelope;
    set?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    disconnect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    delete?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    connect?: Prisma.RabbitCageMovementWhereUniqueInput | Prisma.RabbitCageMovementWhereUniqueInput[];
    update?: Prisma.RabbitCageMovementUpdateWithWhereUniqueWithoutRabbitInput | Prisma.RabbitCageMovementUpdateWithWhereUniqueWithoutRabbitInput[];
    updateMany?: Prisma.RabbitCageMovementUpdateManyWithWhereWithoutRabbitInput | Prisma.RabbitCageMovementUpdateManyWithWhereWithoutRabbitInput[];
    deleteMany?: Prisma.RabbitCageMovementScalarWhereInput | Prisma.RabbitCageMovementScalarWhereInput[];
};
export type RabbitCageMovementCreateWithoutCageInput = {
    id?: string;
    startedAt: Date | string;
    endedAt?: Date | string | null;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    rabbit: Prisma.RabbitCreateNestedOneWithoutCageMovementsInput;
};
export type RabbitCageMovementUncheckedCreateWithoutCageInput = {
    id?: string;
    rabbitId: string;
    startedAt: Date | string;
    endedAt?: Date | string | null;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type RabbitCageMovementCreateOrConnectWithoutCageInput = {
    where: Prisma.RabbitCageMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutCageInput, Prisma.RabbitCageMovementUncheckedCreateWithoutCageInput>;
};
export type RabbitCageMovementCreateManyCageInputEnvelope = {
    data: Prisma.RabbitCageMovementCreateManyCageInput | Prisma.RabbitCageMovementCreateManyCageInput[];
    skipDuplicates?: boolean;
};
export type RabbitCageMovementUpsertWithWhereUniqueWithoutCageInput = {
    where: Prisma.RabbitCageMovementWhereUniqueInput;
    update: Prisma.XOR<Prisma.RabbitCageMovementUpdateWithoutCageInput, Prisma.RabbitCageMovementUncheckedUpdateWithoutCageInput>;
    create: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutCageInput, Prisma.RabbitCageMovementUncheckedCreateWithoutCageInput>;
};
export type RabbitCageMovementUpdateWithWhereUniqueWithoutCageInput = {
    where: Prisma.RabbitCageMovementWhereUniqueInput;
    data: Prisma.XOR<Prisma.RabbitCageMovementUpdateWithoutCageInput, Prisma.RabbitCageMovementUncheckedUpdateWithoutCageInput>;
};
export type RabbitCageMovementUpdateManyWithWhereWithoutCageInput = {
    where: Prisma.RabbitCageMovementScalarWhereInput;
    data: Prisma.XOR<Prisma.RabbitCageMovementUpdateManyMutationInput, Prisma.RabbitCageMovementUncheckedUpdateManyWithoutCageInput>;
};
export type RabbitCageMovementScalarWhereInput = {
    AND?: Prisma.RabbitCageMovementScalarWhereInput | Prisma.RabbitCageMovementScalarWhereInput[];
    OR?: Prisma.RabbitCageMovementScalarWhereInput[];
    NOT?: Prisma.RabbitCageMovementScalarWhereInput | Prisma.RabbitCageMovementScalarWhereInput[];
    id?: Prisma.StringFilter<"RabbitCageMovement"> | string;
    rabbitId?: Prisma.StringFilter<"RabbitCageMovement"> | string;
    cageId?: Prisma.StringFilter<"RabbitCageMovement"> | string;
    startedAt?: Prisma.DateTimeFilter<"RabbitCageMovement"> | Date | string;
    endedAt?: Prisma.DateTimeNullableFilter<"RabbitCageMovement"> | Date | string | null;
    reason?: Prisma.StringNullableFilter<"RabbitCageMovement"> | string | null;
    observation?: Prisma.StringNullableFilter<"RabbitCageMovement"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RabbitCageMovement"> | Date | string;
};
export type RabbitCageMovementCreateWithoutRabbitInput = {
    id?: string;
    startedAt: Date | string;
    endedAt?: Date | string | null;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
    cage: Prisma.CageCreateNestedOneWithoutRabbitMovementsInput;
};
export type RabbitCageMovementUncheckedCreateWithoutRabbitInput = {
    id?: string;
    cageId: string;
    startedAt: Date | string;
    endedAt?: Date | string | null;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type RabbitCageMovementCreateOrConnectWithoutRabbitInput = {
    where: Prisma.RabbitCageMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutRabbitInput, Prisma.RabbitCageMovementUncheckedCreateWithoutRabbitInput>;
};
export type RabbitCageMovementCreateManyRabbitInputEnvelope = {
    data: Prisma.RabbitCageMovementCreateManyRabbitInput | Prisma.RabbitCageMovementCreateManyRabbitInput[];
    skipDuplicates?: boolean;
};
export type RabbitCageMovementUpsertWithWhereUniqueWithoutRabbitInput = {
    where: Prisma.RabbitCageMovementWhereUniqueInput;
    update: Prisma.XOR<Prisma.RabbitCageMovementUpdateWithoutRabbitInput, Prisma.RabbitCageMovementUncheckedUpdateWithoutRabbitInput>;
    create: Prisma.XOR<Prisma.RabbitCageMovementCreateWithoutRabbitInput, Prisma.RabbitCageMovementUncheckedCreateWithoutRabbitInput>;
};
export type RabbitCageMovementUpdateWithWhereUniqueWithoutRabbitInput = {
    where: Prisma.RabbitCageMovementWhereUniqueInput;
    data: Prisma.XOR<Prisma.RabbitCageMovementUpdateWithoutRabbitInput, Prisma.RabbitCageMovementUncheckedUpdateWithoutRabbitInput>;
};
export type RabbitCageMovementUpdateManyWithWhereWithoutRabbitInput = {
    where: Prisma.RabbitCageMovementScalarWhereInput;
    data: Prisma.XOR<Prisma.RabbitCageMovementUpdateManyMutationInput, Prisma.RabbitCageMovementUncheckedUpdateManyWithoutRabbitInput>;
};
export type RabbitCageMovementCreateManyCageInput = {
    id?: string;
    rabbitId: string;
    startedAt: Date | string;
    endedAt?: Date | string | null;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type RabbitCageMovementUpdateWithoutCageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbit?: Prisma.RabbitUpdateOneRequiredWithoutCageMovementsNestedInput;
};
export type RabbitCageMovementUncheckedUpdateWithoutCageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitCageMovementUncheckedUpdateManyWithoutCageInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitCageMovementCreateManyRabbitInput = {
    id?: string;
    cageId: string;
    startedAt: Date | string;
    endedAt?: Date | string | null;
    reason?: string | null;
    observation?: string | null;
    createdAt?: Date | string;
};
export type RabbitCageMovementUpdateWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cage?: Prisma.CageUpdateOneRequiredWithoutRabbitMovementsNestedInput;
};
export type RabbitCageMovementUncheckedUpdateWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cageId?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitCageMovementUncheckedUpdateManyWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    cageId?: Prisma.StringFieldUpdateOperationsInput | string;
    startedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitCageMovementSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rabbitId?: boolean;
    cageId?: boolean;
    startedAt?: boolean;
    endedAt?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    cage?: boolean | Prisma.CageDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rabbitCageMovement"]>;
export type RabbitCageMovementSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rabbitId?: boolean;
    cageId?: boolean;
    startedAt?: boolean;
    endedAt?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    cage?: boolean | Prisma.CageDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rabbitCageMovement"]>;
export type RabbitCageMovementSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rabbitId?: boolean;
    cageId?: boolean;
    startedAt?: boolean;
    endedAt?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    cage?: boolean | Prisma.CageDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rabbitCageMovement"]>;
export type RabbitCageMovementSelectScalar = {
    id?: boolean;
    rabbitId?: boolean;
    cageId?: boolean;
    startedAt?: boolean;
    endedAt?: boolean;
    reason?: boolean;
    observation?: boolean;
    createdAt?: boolean;
};
export type RabbitCageMovementOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "rabbitId" | "cageId" | "startedAt" | "endedAt" | "reason" | "observation" | "createdAt", ExtArgs["result"]["rabbitCageMovement"]>;
export type RabbitCageMovementInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    cage?: boolean | Prisma.CageDefaultArgs<ExtArgs>;
};
export type RabbitCageMovementIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    cage?: boolean | Prisma.CageDefaultArgs<ExtArgs>;
};
export type RabbitCageMovementIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    cage?: boolean | Prisma.CageDefaultArgs<ExtArgs>;
};
export type $RabbitCageMovementPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RabbitCageMovement";
    objects: {
        rabbit: Prisma.$RabbitPayload<ExtArgs>;
        cage: Prisma.$CagePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        rabbitId: string;
        cageId: string;
        startedAt: Date;
        endedAt: Date | null;
        reason: string | null;
        observation: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["rabbitCageMovement"]>;
    composites: {};
};
export type RabbitCageMovementGetPayload<S extends boolean | null | undefined | RabbitCageMovementDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload, S>;
export type RabbitCageMovementCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RabbitCageMovementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RabbitCageMovementCountAggregateInputType | true;
};
export interface RabbitCageMovementDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RabbitCageMovement'];
        meta: {
            name: 'RabbitCageMovement';
        };
    };
    findUnique<T extends RabbitCageMovementFindUniqueArgs>(args: Prisma.SelectSubset<T, RabbitCageMovementFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RabbitCageMovementClient<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RabbitCageMovementFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RabbitCageMovementFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RabbitCageMovementClient<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RabbitCageMovementFindFirstArgs>(args?: Prisma.SelectSubset<T, RabbitCageMovementFindFirstArgs<ExtArgs>>): Prisma.Prisma__RabbitCageMovementClient<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RabbitCageMovementFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RabbitCageMovementFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RabbitCageMovementClient<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RabbitCageMovementFindManyArgs>(args?: Prisma.SelectSubset<T, RabbitCageMovementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RabbitCageMovementCreateArgs>(args: Prisma.SelectSubset<T, RabbitCageMovementCreateArgs<ExtArgs>>): Prisma.Prisma__RabbitCageMovementClient<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RabbitCageMovementCreateManyArgs>(args?: Prisma.SelectSubset<T, RabbitCageMovementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RabbitCageMovementCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RabbitCageMovementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RabbitCageMovementDeleteArgs>(args: Prisma.SelectSubset<T, RabbitCageMovementDeleteArgs<ExtArgs>>): Prisma.Prisma__RabbitCageMovementClient<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RabbitCageMovementUpdateArgs>(args: Prisma.SelectSubset<T, RabbitCageMovementUpdateArgs<ExtArgs>>): Prisma.Prisma__RabbitCageMovementClient<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RabbitCageMovementDeleteManyArgs>(args?: Prisma.SelectSubset<T, RabbitCageMovementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RabbitCageMovementUpdateManyArgs>(args: Prisma.SelectSubset<T, RabbitCageMovementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RabbitCageMovementUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RabbitCageMovementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RabbitCageMovementUpsertArgs>(args: Prisma.SelectSubset<T, RabbitCageMovementUpsertArgs<ExtArgs>>): Prisma.Prisma__RabbitCageMovementClient<runtime.Types.Result.GetResult<Prisma.$RabbitCageMovementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RabbitCageMovementCountArgs>(args?: Prisma.Subset<T, RabbitCageMovementCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RabbitCageMovementCountAggregateOutputType> : number>;
    aggregate<T extends RabbitCageMovementAggregateArgs>(args: Prisma.Subset<T, RabbitCageMovementAggregateArgs>): Prisma.PrismaPromise<GetRabbitCageMovementAggregateType<T>>;
    groupBy<T extends RabbitCageMovementGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RabbitCageMovementGroupByArgs['orderBy'];
    } : {
        orderBy?: RabbitCageMovementGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RabbitCageMovementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRabbitCageMovementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RabbitCageMovementFieldRefs;
}
export interface Prisma__RabbitCageMovementClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    rabbit<T extends Prisma.RabbitDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RabbitDefaultArgs<ExtArgs>>): Prisma.Prisma__RabbitClient<runtime.Types.Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    cage<T extends Prisma.CageDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CageDefaultArgs<ExtArgs>>): Prisma.Prisma__CageClient<runtime.Types.Result.GetResult<Prisma.$CagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RabbitCageMovementFieldRefs {
    readonly id: Prisma.FieldRef<"RabbitCageMovement", 'String'>;
    readonly rabbitId: Prisma.FieldRef<"RabbitCageMovement", 'String'>;
    readonly cageId: Prisma.FieldRef<"RabbitCageMovement", 'String'>;
    readonly startedAt: Prisma.FieldRef<"RabbitCageMovement", 'DateTime'>;
    readonly endedAt: Prisma.FieldRef<"RabbitCageMovement", 'DateTime'>;
    readonly reason: Prisma.FieldRef<"RabbitCageMovement", 'String'>;
    readonly observation: Prisma.FieldRef<"RabbitCageMovement", 'String'>;
    readonly createdAt: Prisma.FieldRef<"RabbitCageMovement", 'DateTime'>;
}
export type RabbitCageMovementFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitCageMovementSelect<ExtArgs> | null;
    omit?: Prisma.RabbitCageMovementOmit<ExtArgs> | null;
    include?: Prisma.RabbitCageMovementInclude<ExtArgs> | null;
    where: Prisma.RabbitCageMovementWhereUniqueInput;
};
export type RabbitCageMovementFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitCageMovementSelect<ExtArgs> | null;
    omit?: Prisma.RabbitCageMovementOmit<ExtArgs> | null;
    include?: Prisma.RabbitCageMovementInclude<ExtArgs> | null;
    where: Prisma.RabbitCageMovementWhereUniqueInput;
};
export type RabbitCageMovementFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RabbitCageMovementFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RabbitCageMovementFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RabbitCageMovementCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitCageMovementSelect<ExtArgs> | null;
    omit?: Prisma.RabbitCageMovementOmit<ExtArgs> | null;
    include?: Prisma.RabbitCageMovementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RabbitCageMovementCreateInput, Prisma.RabbitCageMovementUncheckedCreateInput>;
};
export type RabbitCageMovementCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RabbitCageMovementCreateManyInput | Prisma.RabbitCageMovementCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RabbitCageMovementCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitCageMovementSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RabbitCageMovementOmit<ExtArgs> | null;
    data: Prisma.RabbitCageMovementCreateManyInput | Prisma.RabbitCageMovementCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RabbitCageMovementIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RabbitCageMovementUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitCageMovementSelect<ExtArgs> | null;
    omit?: Prisma.RabbitCageMovementOmit<ExtArgs> | null;
    include?: Prisma.RabbitCageMovementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RabbitCageMovementUpdateInput, Prisma.RabbitCageMovementUncheckedUpdateInput>;
    where: Prisma.RabbitCageMovementWhereUniqueInput;
};
export type RabbitCageMovementUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RabbitCageMovementUpdateManyMutationInput, Prisma.RabbitCageMovementUncheckedUpdateManyInput>;
    where?: Prisma.RabbitCageMovementWhereInput;
    limit?: number;
};
export type RabbitCageMovementUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitCageMovementSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RabbitCageMovementOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RabbitCageMovementUpdateManyMutationInput, Prisma.RabbitCageMovementUncheckedUpdateManyInput>;
    where?: Prisma.RabbitCageMovementWhereInput;
    limit?: number;
    include?: Prisma.RabbitCageMovementIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RabbitCageMovementUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitCageMovementSelect<ExtArgs> | null;
    omit?: Prisma.RabbitCageMovementOmit<ExtArgs> | null;
    include?: Prisma.RabbitCageMovementInclude<ExtArgs> | null;
    where: Prisma.RabbitCageMovementWhereUniqueInput;
    create: Prisma.XOR<Prisma.RabbitCageMovementCreateInput, Prisma.RabbitCageMovementUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RabbitCageMovementUpdateInput, Prisma.RabbitCageMovementUncheckedUpdateInput>;
};
export type RabbitCageMovementDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitCageMovementSelect<ExtArgs> | null;
    omit?: Prisma.RabbitCageMovementOmit<ExtArgs> | null;
    include?: Prisma.RabbitCageMovementInclude<ExtArgs> | null;
    where: Prisma.RabbitCageMovementWhereUniqueInput;
};
export type RabbitCageMovementDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RabbitCageMovementWhereInput;
    limit?: number;
};
export type RabbitCageMovementDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitCageMovementSelect<ExtArgs> | null;
    omit?: Prisma.RabbitCageMovementOmit<ExtArgs> | null;
    include?: Prisma.RabbitCageMovementInclude<ExtArgs> | null;
};
