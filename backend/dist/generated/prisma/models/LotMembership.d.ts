import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type LotMembershipModel = runtime.Types.Result.DefaultSelection<Prisma.$LotMembershipPayload>;
export type AggregateLotMembership = {
    _count: LotMembershipCountAggregateOutputType | null;
    _min: LotMembershipMinAggregateOutputType | null;
    _max: LotMembershipMaxAggregateOutputType | null;
};
export type LotMembershipMinAggregateOutputType = {
    id: string | null;
    lotId: string | null;
    rabbitId: string | null;
    joinedAt: Date | null;
    leftAt: Date | null;
    reason: string | null;
    createdAt: Date | null;
};
export type LotMembershipMaxAggregateOutputType = {
    id: string | null;
    lotId: string | null;
    rabbitId: string | null;
    joinedAt: Date | null;
    leftAt: Date | null;
    reason: string | null;
    createdAt: Date | null;
};
export type LotMembershipCountAggregateOutputType = {
    id: number;
    lotId: number;
    rabbitId: number;
    joinedAt: number;
    leftAt: number;
    reason: number;
    createdAt: number;
    _all: number;
};
export type LotMembershipMinAggregateInputType = {
    id?: true;
    lotId?: true;
    rabbitId?: true;
    joinedAt?: true;
    leftAt?: true;
    reason?: true;
    createdAt?: true;
};
export type LotMembershipMaxAggregateInputType = {
    id?: true;
    lotId?: true;
    rabbitId?: true;
    joinedAt?: true;
    leftAt?: true;
    reason?: true;
    createdAt?: true;
};
export type LotMembershipCountAggregateInputType = {
    id?: true;
    lotId?: true;
    rabbitId?: true;
    joinedAt?: true;
    leftAt?: true;
    reason?: true;
    createdAt?: true;
    _all?: true;
};
export type LotMembershipAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LotMembershipWhereInput;
    orderBy?: Prisma.LotMembershipOrderByWithRelationInput | Prisma.LotMembershipOrderByWithRelationInput[];
    cursor?: Prisma.LotMembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LotMembershipCountAggregateInputType;
    _min?: LotMembershipMinAggregateInputType;
    _max?: LotMembershipMaxAggregateInputType;
};
export type GetLotMembershipAggregateType<T extends LotMembershipAggregateArgs> = {
    [P in keyof T & keyof AggregateLotMembership]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLotMembership[P]> : Prisma.GetScalarType<T[P], AggregateLotMembership[P]>;
};
export type LotMembershipGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LotMembershipWhereInput;
    orderBy?: Prisma.LotMembershipOrderByWithAggregationInput | Prisma.LotMembershipOrderByWithAggregationInput[];
    by: Prisma.LotMembershipScalarFieldEnum[] | Prisma.LotMembershipScalarFieldEnum;
    having?: Prisma.LotMembershipScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LotMembershipCountAggregateInputType | true;
    _min?: LotMembershipMinAggregateInputType;
    _max?: LotMembershipMaxAggregateInputType;
};
export type LotMembershipGroupByOutputType = {
    id: string;
    lotId: string;
    rabbitId: string;
    joinedAt: Date;
    leftAt: Date | null;
    reason: string | null;
    createdAt: Date;
    _count: LotMembershipCountAggregateOutputType | null;
    _min: LotMembershipMinAggregateOutputType | null;
    _max: LotMembershipMaxAggregateOutputType | null;
};
export type GetLotMembershipGroupByPayload<T extends LotMembershipGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LotMembershipGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LotMembershipGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LotMembershipGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LotMembershipGroupByOutputType[P]>;
}>>;
export type LotMembershipWhereInput = {
    AND?: Prisma.LotMembershipWhereInput | Prisma.LotMembershipWhereInput[];
    OR?: Prisma.LotMembershipWhereInput[];
    NOT?: Prisma.LotMembershipWhereInput | Prisma.LotMembershipWhereInput[];
    id?: Prisma.StringFilter<"LotMembership"> | string;
    lotId?: Prisma.StringFilter<"LotMembership"> | string;
    rabbitId?: Prisma.StringFilter<"LotMembership"> | string;
    joinedAt?: Prisma.DateTimeFilter<"LotMembership"> | Date | string;
    leftAt?: Prisma.DateTimeNullableFilter<"LotMembership"> | Date | string | null;
    reason?: Prisma.StringNullableFilter<"LotMembership"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LotMembership"> | Date | string;
    lot?: Prisma.XOR<Prisma.FatteningLotScalarRelationFilter, Prisma.FatteningLotWhereInput>;
    rabbit?: Prisma.XOR<Prisma.RabbitScalarRelationFilter, Prisma.RabbitWhereInput>;
};
export type LotMembershipOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    joinedAt?: Prisma.SortOrder;
    leftAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    lot?: Prisma.FatteningLotOrderByWithRelationInput;
    rabbit?: Prisma.RabbitOrderByWithRelationInput;
};
export type LotMembershipWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.LotMembershipWhereInput | Prisma.LotMembershipWhereInput[];
    OR?: Prisma.LotMembershipWhereInput[];
    NOT?: Prisma.LotMembershipWhereInput | Prisma.LotMembershipWhereInput[];
    lotId?: Prisma.StringFilter<"LotMembership"> | string;
    rabbitId?: Prisma.StringFilter<"LotMembership"> | string;
    joinedAt?: Prisma.DateTimeFilter<"LotMembership"> | Date | string;
    leftAt?: Prisma.DateTimeNullableFilter<"LotMembership"> | Date | string | null;
    reason?: Prisma.StringNullableFilter<"LotMembership"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LotMembership"> | Date | string;
    lot?: Prisma.XOR<Prisma.FatteningLotScalarRelationFilter, Prisma.FatteningLotWhereInput>;
    rabbit?: Prisma.XOR<Prisma.RabbitScalarRelationFilter, Prisma.RabbitWhereInput>;
}, "id">;
export type LotMembershipOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    joinedAt?: Prisma.SortOrder;
    leftAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.LotMembershipCountOrderByAggregateInput;
    _max?: Prisma.LotMembershipMaxOrderByAggregateInput;
    _min?: Prisma.LotMembershipMinOrderByAggregateInput;
};
export type LotMembershipScalarWhereWithAggregatesInput = {
    AND?: Prisma.LotMembershipScalarWhereWithAggregatesInput | Prisma.LotMembershipScalarWhereWithAggregatesInput[];
    OR?: Prisma.LotMembershipScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LotMembershipScalarWhereWithAggregatesInput | Prisma.LotMembershipScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"LotMembership"> | string;
    lotId?: Prisma.StringWithAggregatesFilter<"LotMembership"> | string;
    rabbitId?: Prisma.StringWithAggregatesFilter<"LotMembership"> | string;
    joinedAt?: Prisma.DateTimeWithAggregatesFilter<"LotMembership"> | Date | string;
    leftAt?: Prisma.DateTimeNullableWithAggregatesFilter<"LotMembership"> | Date | string | null;
    reason?: Prisma.StringNullableWithAggregatesFilter<"LotMembership"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LotMembership"> | Date | string;
};
export type LotMembershipCreateInput = {
    id?: string;
    joinedAt: Date | string;
    leftAt?: Date | string | null;
    reason?: string | null;
    createdAt?: Date | string;
    lot: Prisma.FatteningLotCreateNestedOneWithoutMembershipsInput;
    rabbit: Prisma.RabbitCreateNestedOneWithoutLotMembershipsInput;
};
export type LotMembershipUncheckedCreateInput = {
    id?: string;
    lotId: string;
    rabbitId: string;
    joinedAt: Date | string;
    leftAt?: Date | string | null;
    reason?: string | null;
    createdAt?: Date | string;
};
export type LotMembershipUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    leftAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lot?: Prisma.FatteningLotUpdateOneRequiredWithoutMembershipsNestedInput;
    rabbit?: Prisma.RabbitUpdateOneRequiredWithoutLotMembershipsNestedInput;
};
export type LotMembershipUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    leftAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LotMembershipCreateManyInput = {
    id?: string;
    lotId: string;
    rabbitId: string;
    joinedAt: Date | string;
    leftAt?: Date | string | null;
    reason?: string | null;
    createdAt?: Date | string;
};
export type LotMembershipUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    leftAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LotMembershipUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    leftAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LotMembershipListRelationFilter = {
    every?: Prisma.LotMembershipWhereInput;
    some?: Prisma.LotMembershipWhereInput;
    none?: Prisma.LotMembershipWhereInput;
};
export type LotMembershipOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LotMembershipCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    joinedAt?: Prisma.SortOrder;
    leftAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LotMembershipMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    joinedAt?: Prisma.SortOrder;
    leftAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LotMembershipMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lotId?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    joinedAt?: Prisma.SortOrder;
    leftAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LotMembershipCreateNestedManyWithoutRabbitInput = {
    create?: Prisma.XOR<Prisma.LotMembershipCreateWithoutRabbitInput, Prisma.LotMembershipUncheckedCreateWithoutRabbitInput> | Prisma.LotMembershipCreateWithoutRabbitInput[] | Prisma.LotMembershipUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.LotMembershipCreateOrConnectWithoutRabbitInput | Prisma.LotMembershipCreateOrConnectWithoutRabbitInput[];
    createMany?: Prisma.LotMembershipCreateManyRabbitInputEnvelope;
    connect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
};
export type LotMembershipUncheckedCreateNestedManyWithoutRabbitInput = {
    create?: Prisma.XOR<Prisma.LotMembershipCreateWithoutRabbitInput, Prisma.LotMembershipUncheckedCreateWithoutRabbitInput> | Prisma.LotMembershipCreateWithoutRabbitInput[] | Prisma.LotMembershipUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.LotMembershipCreateOrConnectWithoutRabbitInput | Prisma.LotMembershipCreateOrConnectWithoutRabbitInput[];
    createMany?: Prisma.LotMembershipCreateManyRabbitInputEnvelope;
    connect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
};
export type LotMembershipUpdateManyWithoutRabbitNestedInput = {
    create?: Prisma.XOR<Prisma.LotMembershipCreateWithoutRabbitInput, Prisma.LotMembershipUncheckedCreateWithoutRabbitInput> | Prisma.LotMembershipCreateWithoutRabbitInput[] | Prisma.LotMembershipUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.LotMembershipCreateOrConnectWithoutRabbitInput | Prisma.LotMembershipCreateOrConnectWithoutRabbitInput[];
    upsert?: Prisma.LotMembershipUpsertWithWhereUniqueWithoutRabbitInput | Prisma.LotMembershipUpsertWithWhereUniqueWithoutRabbitInput[];
    createMany?: Prisma.LotMembershipCreateManyRabbitInputEnvelope;
    set?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    disconnect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    delete?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    connect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    update?: Prisma.LotMembershipUpdateWithWhereUniqueWithoutRabbitInput | Prisma.LotMembershipUpdateWithWhereUniqueWithoutRabbitInput[];
    updateMany?: Prisma.LotMembershipUpdateManyWithWhereWithoutRabbitInput | Prisma.LotMembershipUpdateManyWithWhereWithoutRabbitInput[];
    deleteMany?: Prisma.LotMembershipScalarWhereInput | Prisma.LotMembershipScalarWhereInput[];
};
export type LotMembershipUncheckedUpdateManyWithoutRabbitNestedInput = {
    create?: Prisma.XOR<Prisma.LotMembershipCreateWithoutRabbitInput, Prisma.LotMembershipUncheckedCreateWithoutRabbitInput> | Prisma.LotMembershipCreateWithoutRabbitInput[] | Prisma.LotMembershipUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.LotMembershipCreateOrConnectWithoutRabbitInput | Prisma.LotMembershipCreateOrConnectWithoutRabbitInput[];
    upsert?: Prisma.LotMembershipUpsertWithWhereUniqueWithoutRabbitInput | Prisma.LotMembershipUpsertWithWhereUniqueWithoutRabbitInput[];
    createMany?: Prisma.LotMembershipCreateManyRabbitInputEnvelope;
    set?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    disconnect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    delete?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    connect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    update?: Prisma.LotMembershipUpdateWithWhereUniqueWithoutRabbitInput | Prisma.LotMembershipUpdateWithWhereUniqueWithoutRabbitInput[];
    updateMany?: Prisma.LotMembershipUpdateManyWithWhereWithoutRabbitInput | Prisma.LotMembershipUpdateManyWithWhereWithoutRabbitInput[];
    deleteMany?: Prisma.LotMembershipScalarWhereInput | Prisma.LotMembershipScalarWhereInput[];
};
export type LotMembershipCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.LotMembershipCreateWithoutLotInput, Prisma.LotMembershipUncheckedCreateWithoutLotInput> | Prisma.LotMembershipCreateWithoutLotInput[] | Prisma.LotMembershipUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.LotMembershipCreateOrConnectWithoutLotInput | Prisma.LotMembershipCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.LotMembershipCreateManyLotInputEnvelope;
    connect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
};
export type LotMembershipUncheckedCreateNestedManyWithoutLotInput = {
    create?: Prisma.XOR<Prisma.LotMembershipCreateWithoutLotInput, Prisma.LotMembershipUncheckedCreateWithoutLotInput> | Prisma.LotMembershipCreateWithoutLotInput[] | Prisma.LotMembershipUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.LotMembershipCreateOrConnectWithoutLotInput | Prisma.LotMembershipCreateOrConnectWithoutLotInput[];
    createMany?: Prisma.LotMembershipCreateManyLotInputEnvelope;
    connect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
};
export type LotMembershipUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.LotMembershipCreateWithoutLotInput, Prisma.LotMembershipUncheckedCreateWithoutLotInput> | Prisma.LotMembershipCreateWithoutLotInput[] | Prisma.LotMembershipUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.LotMembershipCreateOrConnectWithoutLotInput | Prisma.LotMembershipCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.LotMembershipUpsertWithWhereUniqueWithoutLotInput | Prisma.LotMembershipUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.LotMembershipCreateManyLotInputEnvelope;
    set?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    disconnect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    delete?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    connect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    update?: Prisma.LotMembershipUpdateWithWhereUniqueWithoutLotInput | Prisma.LotMembershipUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.LotMembershipUpdateManyWithWhereWithoutLotInput | Prisma.LotMembershipUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.LotMembershipScalarWhereInput | Prisma.LotMembershipScalarWhereInput[];
};
export type LotMembershipUncheckedUpdateManyWithoutLotNestedInput = {
    create?: Prisma.XOR<Prisma.LotMembershipCreateWithoutLotInput, Prisma.LotMembershipUncheckedCreateWithoutLotInput> | Prisma.LotMembershipCreateWithoutLotInput[] | Prisma.LotMembershipUncheckedCreateWithoutLotInput[];
    connectOrCreate?: Prisma.LotMembershipCreateOrConnectWithoutLotInput | Prisma.LotMembershipCreateOrConnectWithoutLotInput[];
    upsert?: Prisma.LotMembershipUpsertWithWhereUniqueWithoutLotInput | Prisma.LotMembershipUpsertWithWhereUniqueWithoutLotInput[];
    createMany?: Prisma.LotMembershipCreateManyLotInputEnvelope;
    set?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    disconnect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    delete?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    connect?: Prisma.LotMembershipWhereUniqueInput | Prisma.LotMembershipWhereUniqueInput[];
    update?: Prisma.LotMembershipUpdateWithWhereUniqueWithoutLotInput | Prisma.LotMembershipUpdateWithWhereUniqueWithoutLotInput[];
    updateMany?: Prisma.LotMembershipUpdateManyWithWhereWithoutLotInput | Prisma.LotMembershipUpdateManyWithWhereWithoutLotInput[];
    deleteMany?: Prisma.LotMembershipScalarWhereInput | Prisma.LotMembershipScalarWhereInput[];
};
export type LotMembershipCreateWithoutRabbitInput = {
    id?: string;
    joinedAt: Date | string;
    leftAt?: Date | string | null;
    reason?: string | null;
    createdAt?: Date | string;
    lot: Prisma.FatteningLotCreateNestedOneWithoutMembershipsInput;
};
export type LotMembershipUncheckedCreateWithoutRabbitInput = {
    id?: string;
    lotId: string;
    joinedAt: Date | string;
    leftAt?: Date | string | null;
    reason?: string | null;
    createdAt?: Date | string;
};
export type LotMembershipCreateOrConnectWithoutRabbitInput = {
    where: Prisma.LotMembershipWhereUniqueInput;
    create: Prisma.XOR<Prisma.LotMembershipCreateWithoutRabbitInput, Prisma.LotMembershipUncheckedCreateWithoutRabbitInput>;
};
export type LotMembershipCreateManyRabbitInputEnvelope = {
    data: Prisma.LotMembershipCreateManyRabbitInput | Prisma.LotMembershipCreateManyRabbitInput[];
    skipDuplicates?: boolean;
};
export type LotMembershipUpsertWithWhereUniqueWithoutRabbitInput = {
    where: Prisma.LotMembershipWhereUniqueInput;
    update: Prisma.XOR<Prisma.LotMembershipUpdateWithoutRabbitInput, Prisma.LotMembershipUncheckedUpdateWithoutRabbitInput>;
    create: Prisma.XOR<Prisma.LotMembershipCreateWithoutRabbitInput, Prisma.LotMembershipUncheckedCreateWithoutRabbitInput>;
};
export type LotMembershipUpdateWithWhereUniqueWithoutRabbitInput = {
    where: Prisma.LotMembershipWhereUniqueInput;
    data: Prisma.XOR<Prisma.LotMembershipUpdateWithoutRabbitInput, Prisma.LotMembershipUncheckedUpdateWithoutRabbitInput>;
};
export type LotMembershipUpdateManyWithWhereWithoutRabbitInput = {
    where: Prisma.LotMembershipScalarWhereInput;
    data: Prisma.XOR<Prisma.LotMembershipUpdateManyMutationInput, Prisma.LotMembershipUncheckedUpdateManyWithoutRabbitInput>;
};
export type LotMembershipScalarWhereInput = {
    AND?: Prisma.LotMembershipScalarWhereInput | Prisma.LotMembershipScalarWhereInput[];
    OR?: Prisma.LotMembershipScalarWhereInput[];
    NOT?: Prisma.LotMembershipScalarWhereInput | Prisma.LotMembershipScalarWhereInput[];
    id?: Prisma.StringFilter<"LotMembership"> | string;
    lotId?: Prisma.StringFilter<"LotMembership"> | string;
    rabbitId?: Prisma.StringFilter<"LotMembership"> | string;
    joinedAt?: Prisma.DateTimeFilter<"LotMembership"> | Date | string;
    leftAt?: Prisma.DateTimeNullableFilter<"LotMembership"> | Date | string | null;
    reason?: Prisma.StringNullableFilter<"LotMembership"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"LotMembership"> | Date | string;
};
export type LotMembershipCreateWithoutLotInput = {
    id?: string;
    joinedAt: Date | string;
    leftAt?: Date | string | null;
    reason?: string | null;
    createdAt?: Date | string;
    rabbit: Prisma.RabbitCreateNestedOneWithoutLotMembershipsInput;
};
export type LotMembershipUncheckedCreateWithoutLotInput = {
    id?: string;
    rabbitId: string;
    joinedAt: Date | string;
    leftAt?: Date | string | null;
    reason?: string | null;
    createdAt?: Date | string;
};
export type LotMembershipCreateOrConnectWithoutLotInput = {
    where: Prisma.LotMembershipWhereUniqueInput;
    create: Prisma.XOR<Prisma.LotMembershipCreateWithoutLotInput, Prisma.LotMembershipUncheckedCreateWithoutLotInput>;
};
export type LotMembershipCreateManyLotInputEnvelope = {
    data: Prisma.LotMembershipCreateManyLotInput | Prisma.LotMembershipCreateManyLotInput[];
    skipDuplicates?: boolean;
};
export type LotMembershipUpsertWithWhereUniqueWithoutLotInput = {
    where: Prisma.LotMembershipWhereUniqueInput;
    update: Prisma.XOR<Prisma.LotMembershipUpdateWithoutLotInput, Prisma.LotMembershipUncheckedUpdateWithoutLotInput>;
    create: Prisma.XOR<Prisma.LotMembershipCreateWithoutLotInput, Prisma.LotMembershipUncheckedCreateWithoutLotInput>;
};
export type LotMembershipUpdateWithWhereUniqueWithoutLotInput = {
    where: Prisma.LotMembershipWhereUniqueInput;
    data: Prisma.XOR<Prisma.LotMembershipUpdateWithoutLotInput, Prisma.LotMembershipUncheckedUpdateWithoutLotInput>;
};
export type LotMembershipUpdateManyWithWhereWithoutLotInput = {
    where: Prisma.LotMembershipScalarWhereInput;
    data: Prisma.XOR<Prisma.LotMembershipUpdateManyMutationInput, Prisma.LotMembershipUncheckedUpdateManyWithoutLotInput>;
};
export type LotMembershipCreateManyRabbitInput = {
    id?: string;
    lotId: string;
    joinedAt: Date | string;
    leftAt?: Date | string | null;
    reason?: string | null;
    createdAt?: Date | string;
};
export type LotMembershipUpdateWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    leftAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    lot?: Prisma.FatteningLotUpdateOneRequiredWithoutMembershipsNestedInput;
};
export type LotMembershipUncheckedUpdateWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    leftAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LotMembershipUncheckedUpdateManyWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    lotId?: Prisma.StringFieldUpdateOperationsInput | string;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    leftAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LotMembershipCreateManyLotInput = {
    id?: string;
    rabbitId: string;
    joinedAt: Date | string;
    leftAt?: Date | string | null;
    reason?: string | null;
    createdAt?: Date | string;
};
export type LotMembershipUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    leftAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbit?: Prisma.RabbitUpdateOneRequiredWithoutLotMembershipsNestedInput;
};
export type LotMembershipUncheckedUpdateWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    leftAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LotMembershipUncheckedUpdateManyWithoutLotInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    joinedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    leftAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LotMembershipSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lotId?: boolean;
    rabbitId?: boolean;
    joinedAt?: boolean;
    leftAt?: boolean;
    reason?: boolean;
    createdAt?: boolean;
    lot?: boolean | Prisma.FatteningLotDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["lotMembership"]>;
export type LotMembershipSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lotId?: boolean;
    rabbitId?: boolean;
    joinedAt?: boolean;
    leftAt?: boolean;
    reason?: boolean;
    createdAt?: boolean;
    lot?: boolean | Prisma.FatteningLotDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["lotMembership"]>;
export type LotMembershipSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    lotId?: boolean;
    rabbitId?: boolean;
    joinedAt?: boolean;
    leftAt?: boolean;
    reason?: boolean;
    createdAt?: boolean;
    lot?: boolean | Prisma.FatteningLotDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["lotMembership"]>;
export type LotMembershipSelectScalar = {
    id?: boolean;
    lotId?: boolean;
    rabbitId?: boolean;
    joinedAt?: boolean;
    leftAt?: boolean;
    reason?: boolean;
    createdAt?: boolean;
};
export type LotMembershipOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "lotId" | "rabbitId" | "joinedAt" | "leftAt" | "reason" | "createdAt", ExtArgs["result"]["lotMembership"]>;
export type LotMembershipInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.FatteningLotDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
};
export type LotMembershipIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.FatteningLotDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
};
export type LotMembershipIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    lot?: boolean | Prisma.FatteningLotDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
};
export type $LotMembershipPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LotMembership";
    objects: {
        lot: Prisma.$FatteningLotPayload<ExtArgs>;
        rabbit: Prisma.$RabbitPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        lotId: string;
        rabbitId: string;
        joinedAt: Date;
        leftAt: Date | null;
        reason: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["lotMembership"]>;
    composites: {};
};
export type LotMembershipGetPayload<S extends boolean | null | undefined | LotMembershipDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload, S>;
export type LotMembershipCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LotMembershipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LotMembershipCountAggregateInputType | true;
};
export interface LotMembershipDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LotMembership'];
        meta: {
            name: 'LotMembership';
        };
    };
    findUnique<T extends LotMembershipFindUniqueArgs>(args: Prisma.SelectSubset<T, LotMembershipFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LotMembershipClient<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LotMembershipFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LotMembershipFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LotMembershipClient<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LotMembershipFindFirstArgs>(args?: Prisma.SelectSubset<T, LotMembershipFindFirstArgs<ExtArgs>>): Prisma.Prisma__LotMembershipClient<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LotMembershipFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LotMembershipFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LotMembershipClient<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LotMembershipFindManyArgs>(args?: Prisma.SelectSubset<T, LotMembershipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LotMembershipCreateArgs>(args: Prisma.SelectSubset<T, LotMembershipCreateArgs<ExtArgs>>): Prisma.Prisma__LotMembershipClient<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LotMembershipCreateManyArgs>(args?: Prisma.SelectSubset<T, LotMembershipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LotMembershipCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LotMembershipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LotMembershipDeleteArgs>(args: Prisma.SelectSubset<T, LotMembershipDeleteArgs<ExtArgs>>): Prisma.Prisma__LotMembershipClient<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LotMembershipUpdateArgs>(args: Prisma.SelectSubset<T, LotMembershipUpdateArgs<ExtArgs>>): Prisma.Prisma__LotMembershipClient<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LotMembershipDeleteManyArgs>(args?: Prisma.SelectSubset<T, LotMembershipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LotMembershipUpdateManyArgs>(args: Prisma.SelectSubset<T, LotMembershipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LotMembershipUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LotMembershipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LotMembershipUpsertArgs>(args: Prisma.SelectSubset<T, LotMembershipUpsertArgs<ExtArgs>>): Prisma.Prisma__LotMembershipClient<runtime.Types.Result.GetResult<Prisma.$LotMembershipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LotMembershipCountArgs>(args?: Prisma.Subset<T, LotMembershipCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LotMembershipCountAggregateOutputType> : number>;
    aggregate<T extends LotMembershipAggregateArgs>(args: Prisma.Subset<T, LotMembershipAggregateArgs>): Prisma.PrismaPromise<GetLotMembershipAggregateType<T>>;
    groupBy<T extends LotMembershipGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LotMembershipGroupByArgs['orderBy'];
    } : {
        orderBy?: LotMembershipGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LotMembershipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLotMembershipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LotMembershipFieldRefs;
}
export interface Prisma__LotMembershipClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    lot<T extends Prisma.FatteningLotDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FatteningLotDefaultArgs<ExtArgs>>): Prisma.Prisma__FatteningLotClient<runtime.Types.Result.GetResult<Prisma.$FatteningLotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    rabbit<T extends Prisma.RabbitDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RabbitDefaultArgs<ExtArgs>>): Prisma.Prisma__RabbitClient<runtime.Types.Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LotMembershipFieldRefs {
    readonly id: Prisma.FieldRef<"LotMembership", 'String'>;
    readonly lotId: Prisma.FieldRef<"LotMembership", 'String'>;
    readonly rabbitId: Prisma.FieldRef<"LotMembership", 'String'>;
    readonly joinedAt: Prisma.FieldRef<"LotMembership", 'DateTime'>;
    readonly leftAt: Prisma.FieldRef<"LotMembership", 'DateTime'>;
    readonly reason: Prisma.FieldRef<"LotMembership", 'String'>;
    readonly createdAt: Prisma.FieldRef<"LotMembership", 'DateTime'>;
}
export type LotMembershipFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelect<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    include?: Prisma.LotMembershipInclude<ExtArgs> | null;
    where: Prisma.LotMembershipWhereUniqueInput;
};
export type LotMembershipFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelect<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    include?: Prisma.LotMembershipInclude<ExtArgs> | null;
    where: Prisma.LotMembershipWhereUniqueInput;
};
export type LotMembershipFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelect<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    include?: Prisma.LotMembershipInclude<ExtArgs> | null;
    where?: Prisma.LotMembershipWhereInput;
    orderBy?: Prisma.LotMembershipOrderByWithRelationInput | Prisma.LotMembershipOrderByWithRelationInput[];
    cursor?: Prisma.LotMembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LotMembershipScalarFieldEnum | Prisma.LotMembershipScalarFieldEnum[];
};
export type LotMembershipFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelect<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    include?: Prisma.LotMembershipInclude<ExtArgs> | null;
    where?: Prisma.LotMembershipWhereInput;
    orderBy?: Prisma.LotMembershipOrderByWithRelationInput | Prisma.LotMembershipOrderByWithRelationInput[];
    cursor?: Prisma.LotMembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LotMembershipScalarFieldEnum | Prisma.LotMembershipScalarFieldEnum[];
};
export type LotMembershipFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelect<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    include?: Prisma.LotMembershipInclude<ExtArgs> | null;
    where?: Prisma.LotMembershipWhereInput;
    orderBy?: Prisma.LotMembershipOrderByWithRelationInput | Prisma.LotMembershipOrderByWithRelationInput[];
    cursor?: Prisma.LotMembershipWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LotMembershipScalarFieldEnum | Prisma.LotMembershipScalarFieldEnum[];
};
export type LotMembershipCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelect<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    include?: Prisma.LotMembershipInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LotMembershipCreateInput, Prisma.LotMembershipUncheckedCreateInput>;
};
export type LotMembershipCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LotMembershipCreateManyInput | Prisma.LotMembershipCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LotMembershipCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    data: Prisma.LotMembershipCreateManyInput | Prisma.LotMembershipCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LotMembershipIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LotMembershipUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelect<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    include?: Prisma.LotMembershipInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LotMembershipUpdateInput, Prisma.LotMembershipUncheckedUpdateInput>;
    where: Prisma.LotMembershipWhereUniqueInput;
};
export type LotMembershipUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LotMembershipUpdateManyMutationInput, Prisma.LotMembershipUncheckedUpdateManyInput>;
    where?: Prisma.LotMembershipWhereInput;
    limit?: number;
};
export type LotMembershipUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LotMembershipUpdateManyMutationInput, Prisma.LotMembershipUncheckedUpdateManyInput>;
    where?: Prisma.LotMembershipWhereInput;
    limit?: number;
    include?: Prisma.LotMembershipIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LotMembershipUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelect<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    include?: Prisma.LotMembershipInclude<ExtArgs> | null;
    where: Prisma.LotMembershipWhereUniqueInput;
    create: Prisma.XOR<Prisma.LotMembershipCreateInput, Prisma.LotMembershipUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LotMembershipUpdateInput, Prisma.LotMembershipUncheckedUpdateInput>;
};
export type LotMembershipDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelect<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    include?: Prisma.LotMembershipInclude<ExtArgs> | null;
    where: Prisma.LotMembershipWhereUniqueInput;
};
export type LotMembershipDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LotMembershipWhereInput;
    limit?: number;
};
export type LotMembershipDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LotMembershipSelect<ExtArgs> | null;
    omit?: Prisma.LotMembershipOmit<ExtArgs> | null;
    include?: Prisma.LotMembershipInclude<ExtArgs> | null;
};
