import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RabbitIdentificationModel = runtime.Types.Result.DefaultSelection<Prisma.$RabbitIdentificationPayload>;
export type AggregateRabbitIdentification = {
    _count: RabbitIdentificationCountAggregateOutputType | null;
    _min: RabbitIdentificationMinAggregateOutputType | null;
    _max: RabbitIdentificationMaxAggregateOutputType | null;
};
export type RabbitIdentificationMinAggregateOutputType = {
    id: string | null;
    rabbitId: string | null;
    type: $Enums.RabbitIdentificationType | null;
    value: string | null;
    isPrimary: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RabbitIdentificationMaxAggregateOutputType = {
    id: string | null;
    rabbitId: string | null;
    type: $Enums.RabbitIdentificationType | null;
    value: string | null;
    isPrimary: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RabbitIdentificationCountAggregateOutputType = {
    id: number;
    rabbitId: number;
    type: number;
    value: number;
    isPrimary: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type RabbitIdentificationMinAggregateInputType = {
    id?: true;
    rabbitId?: true;
    type?: true;
    value?: true;
    isPrimary?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RabbitIdentificationMaxAggregateInputType = {
    id?: true;
    rabbitId?: true;
    type?: true;
    value?: true;
    isPrimary?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RabbitIdentificationCountAggregateInputType = {
    id?: true;
    rabbitId?: true;
    type?: true;
    value?: true;
    isPrimary?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type RabbitIdentificationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RabbitIdentificationWhereInput;
    orderBy?: Prisma.RabbitIdentificationOrderByWithRelationInput | Prisma.RabbitIdentificationOrderByWithRelationInput[];
    cursor?: Prisma.RabbitIdentificationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RabbitIdentificationCountAggregateInputType;
    _min?: RabbitIdentificationMinAggregateInputType;
    _max?: RabbitIdentificationMaxAggregateInputType;
};
export type GetRabbitIdentificationAggregateType<T extends RabbitIdentificationAggregateArgs> = {
    [P in keyof T & keyof AggregateRabbitIdentification]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRabbitIdentification[P]> : Prisma.GetScalarType<T[P], AggregateRabbitIdentification[P]>;
};
export type RabbitIdentificationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RabbitIdentificationWhereInput;
    orderBy?: Prisma.RabbitIdentificationOrderByWithAggregationInput | Prisma.RabbitIdentificationOrderByWithAggregationInput[];
    by: Prisma.RabbitIdentificationScalarFieldEnum[] | Prisma.RabbitIdentificationScalarFieldEnum;
    having?: Prisma.RabbitIdentificationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RabbitIdentificationCountAggregateInputType | true;
    _min?: RabbitIdentificationMinAggregateInputType;
    _max?: RabbitIdentificationMaxAggregateInputType;
};
export type RabbitIdentificationGroupByOutputType = {
    id: string;
    rabbitId: string;
    type: $Enums.RabbitIdentificationType;
    value: string;
    isPrimary: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: RabbitIdentificationCountAggregateOutputType | null;
    _min: RabbitIdentificationMinAggregateOutputType | null;
    _max: RabbitIdentificationMaxAggregateOutputType | null;
};
export type GetRabbitIdentificationGroupByPayload<T extends RabbitIdentificationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RabbitIdentificationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RabbitIdentificationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RabbitIdentificationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RabbitIdentificationGroupByOutputType[P]>;
}>>;
export type RabbitIdentificationWhereInput = {
    AND?: Prisma.RabbitIdentificationWhereInput | Prisma.RabbitIdentificationWhereInput[];
    OR?: Prisma.RabbitIdentificationWhereInput[];
    NOT?: Prisma.RabbitIdentificationWhereInput | Prisma.RabbitIdentificationWhereInput[];
    id?: Prisma.StringFilter<"RabbitIdentification"> | string;
    rabbitId?: Prisma.StringFilter<"RabbitIdentification"> | string;
    type?: Prisma.EnumRabbitIdentificationTypeFilter<"RabbitIdentification"> | $Enums.RabbitIdentificationType;
    value?: Prisma.StringFilter<"RabbitIdentification"> | string;
    isPrimary?: Prisma.BoolFilter<"RabbitIdentification"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"RabbitIdentification"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RabbitIdentification"> | Date | string;
    rabbit?: Prisma.XOR<Prisma.RabbitScalarRelationFilter, Prisma.RabbitWhereInput>;
};
export type RabbitIdentificationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    isPrimary?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    rabbit?: Prisma.RabbitOrderByWithRelationInput;
};
export type RabbitIdentificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    rabbitId_type_value?: Prisma.RabbitIdentificationRabbitIdTypeValueCompoundUniqueInput;
    AND?: Prisma.RabbitIdentificationWhereInput | Prisma.RabbitIdentificationWhereInput[];
    OR?: Prisma.RabbitIdentificationWhereInput[];
    NOT?: Prisma.RabbitIdentificationWhereInput | Prisma.RabbitIdentificationWhereInput[];
    rabbitId?: Prisma.StringFilter<"RabbitIdentification"> | string;
    type?: Prisma.EnumRabbitIdentificationTypeFilter<"RabbitIdentification"> | $Enums.RabbitIdentificationType;
    value?: Prisma.StringFilter<"RabbitIdentification"> | string;
    isPrimary?: Prisma.BoolFilter<"RabbitIdentification"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"RabbitIdentification"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RabbitIdentification"> | Date | string;
    rabbit?: Prisma.XOR<Prisma.RabbitScalarRelationFilter, Prisma.RabbitWhereInput>;
}, "id" | "rabbitId_type_value">;
export type RabbitIdentificationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    isPrimary?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.RabbitIdentificationCountOrderByAggregateInput;
    _max?: Prisma.RabbitIdentificationMaxOrderByAggregateInput;
    _min?: Prisma.RabbitIdentificationMinOrderByAggregateInput;
};
export type RabbitIdentificationScalarWhereWithAggregatesInput = {
    AND?: Prisma.RabbitIdentificationScalarWhereWithAggregatesInput | Prisma.RabbitIdentificationScalarWhereWithAggregatesInput[];
    OR?: Prisma.RabbitIdentificationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RabbitIdentificationScalarWhereWithAggregatesInput | Prisma.RabbitIdentificationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RabbitIdentification"> | string;
    rabbitId?: Prisma.StringWithAggregatesFilter<"RabbitIdentification"> | string;
    type?: Prisma.EnumRabbitIdentificationTypeWithAggregatesFilter<"RabbitIdentification"> | $Enums.RabbitIdentificationType;
    value?: Prisma.StringWithAggregatesFilter<"RabbitIdentification"> | string;
    isPrimary?: Prisma.BoolWithAggregatesFilter<"RabbitIdentification"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RabbitIdentification"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"RabbitIdentification"> | Date | string;
};
export type RabbitIdentificationCreateInput = {
    id?: string;
    type: $Enums.RabbitIdentificationType;
    value: string;
    isPrimary?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    rabbit: Prisma.RabbitCreateNestedOneWithoutIdentificationsInput;
};
export type RabbitIdentificationUncheckedCreateInput = {
    id?: string;
    rabbitId: string;
    type: $Enums.RabbitIdentificationType;
    value: string;
    isPrimary?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RabbitIdentificationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRabbitIdentificationTypeFieldUpdateOperationsInput | $Enums.RabbitIdentificationType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    isPrimary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbit?: Prisma.RabbitUpdateOneRequiredWithoutIdentificationsNestedInput;
};
export type RabbitIdentificationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRabbitIdentificationTypeFieldUpdateOperationsInput | $Enums.RabbitIdentificationType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    isPrimary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitIdentificationCreateManyInput = {
    id?: string;
    rabbitId: string;
    type: $Enums.RabbitIdentificationType;
    value: string;
    isPrimary?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RabbitIdentificationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRabbitIdentificationTypeFieldUpdateOperationsInput | $Enums.RabbitIdentificationType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    isPrimary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitIdentificationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRabbitIdentificationTypeFieldUpdateOperationsInput | $Enums.RabbitIdentificationType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    isPrimary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitIdentificationListRelationFilter = {
    every?: Prisma.RabbitIdentificationWhereInput;
    some?: Prisma.RabbitIdentificationWhereInput;
    none?: Prisma.RabbitIdentificationWhereInput;
};
export type RabbitIdentificationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RabbitIdentificationRabbitIdTypeValueCompoundUniqueInput = {
    rabbitId: string;
    type: $Enums.RabbitIdentificationType;
    value: string;
};
export type RabbitIdentificationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    isPrimary?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RabbitIdentificationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    isPrimary?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RabbitIdentificationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    isPrimary?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RabbitIdentificationCreateNestedManyWithoutRabbitInput = {
    create?: Prisma.XOR<Prisma.RabbitIdentificationCreateWithoutRabbitInput, Prisma.RabbitIdentificationUncheckedCreateWithoutRabbitInput> | Prisma.RabbitIdentificationCreateWithoutRabbitInput[] | Prisma.RabbitIdentificationUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.RabbitIdentificationCreateOrConnectWithoutRabbitInput | Prisma.RabbitIdentificationCreateOrConnectWithoutRabbitInput[];
    createMany?: Prisma.RabbitIdentificationCreateManyRabbitInputEnvelope;
    connect?: Prisma.RabbitIdentificationWhereUniqueInput | Prisma.RabbitIdentificationWhereUniqueInput[];
};
export type RabbitIdentificationUncheckedCreateNestedManyWithoutRabbitInput = {
    create?: Prisma.XOR<Prisma.RabbitIdentificationCreateWithoutRabbitInput, Prisma.RabbitIdentificationUncheckedCreateWithoutRabbitInput> | Prisma.RabbitIdentificationCreateWithoutRabbitInput[] | Prisma.RabbitIdentificationUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.RabbitIdentificationCreateOrConnectWithoutRabbitInput | Prisma.RabbitIdentificationCreateOrConnectWithoutRabbitInput[];
    createMany?: Prisma.RabbitIdentificationCreateManyRabbitInputEnvelope;
    connect?: Prisma.RabbitIdentificationWhereUniqueInput | Prisma.RabbitIdentificationWhereUniqueInput[];
};
export type RabbitIdentificationUpdateManyWithoutRabbitNestedInput = {
    create?: Prisma.XOR<Prisma.RabbitIdentificationCreateWithoutRabbitInput, Prisma.RabbitIdentificationUncheckedCreateWithoutRabbitInput> | Prisma.RabbitIdentificationCreateWithoutRabbitInput[] | Prisma.RabbitIdentificationUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.RabbitIdentificationCreateOrConnectWithoutRabbitInput | Prisma.RabbitIdentificationCreateOrConnectWithoutRabbitInput[];
    upsert?: Prisma.RabbitIdentificationUpsertWithWhereUniqueWithoutRabbitInput | Prisma.RabbitIdentificationUpsertWithWhereUniqueWithoutRabbitInput[];
    createMany?: Prisma.RabbitIdentificationCreateManyRabbitInputEnvelope;
    set?: Prisma.RabbitIdentificationWhereUniqueInput | Prisma.RabbitIdentificationWhereUniqueInput[];
    disconnect?: Prisma.RabbitIdentificationWhereUniqueInput | Prisma.RabbitIdentificationWhereUniqueInput[];
    delete?: Prisma.RabbitIdentificationWhereUniqueInput | Prisma.RabbitIdentificationWhereUniqueInput[];
    connect?: Prisma.RabbitIdentificationWhereUniqueInput | Prisma.RabbitIdentificationWhereUniqueInput[];
    update?: Prisma.RabbitIdentificationUpdateWithWhereUniqueWithoutRabbitInput | Prisma.RabbitIdentificationUpdateWithWhereUniqueWithoutRabbitInput[];
    updateMany?: Prisma.RabbitIdentificationUpdateManyWithWhereWithoutRabbitInput | Prisma.RabbitIdentificationUpdateManyWithWhereWithoutRabbitInput[];
    deleteMany?: Prisma.RabbitIdentificationScalarWhereInput | Prisma.RabbitIdentificationScalarWhereInput[];
};
export type RabbitIdentificationUncheckedUpdateManyWithoutRabbitNestedInput = {
    create?: Prisma.XOR<Prisma.RabbitIdentificationCreateWithoutRabbitInput, Prisma.RabbitIdentificationUncheckedCreateWithoutRabbitInput> | Prisma.RabbitIdentificationCreateWithoutRabbitInput[] | Prisma.RabbitIdentificationUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.RabbitIdentificationCreateOrConnectWithoutRabbitInput | Prisma.RabbitIdentificationCreateOrConnectWithoutRabbitInput[];
    upsert?: Prisma.RabbitIdentificationUpsertWithWhereUniqueWithoutRabbitInput | Prisma.RabbitIdentificationUpsertWithWhereUniqueWithoutRabbitInput[];
    createMany?: Prisma.RabbitIdentificationCreateManyRabbitInputEnvelope;
    set?: Prisma.RabbitIdentificationWhereUniqueInput | Prisma.RabbitIdentificationWhereUniqueInput[];
    disconnect?: Prisma.RabbitIdentificationWhereUniqueInput | Prisma.RabbitIdentificationWhereUniqueInput[];
    delete?: Prisma.RabbitIdentificationWhereUniqueInput | Prisma.RabbitIdentificationWhereUniqueInput[];
    connect?: Prisma.RabbitIdentificationWhereUniqueInput | Prisma.RabbitIdentificationWhereUniqueInput[];
    update?: Prisma.RabbitIdentificationUpdateWithWhereUniqueWithoutRabbitInput | Prisma.RabbitIdentificationUpdateWithWhereUniqueWithoutRabbitInput[];
    updateMany?: Prisma.RabbitIdentificationUpdateManyWithWhereWithoutRabbitInput | Prisma.RabbitIdentificationUpdateManyWithWhereWithoutRabbitInput[];
    deleteMany?: Prisma.RabbitIdentificationScalarWhereInput | Prisma.RabbitIdentificationScalarWhereInput[];
};
export type EnumRabbitIdentificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.RabbitIdentificationType;
};
export type RabbitIdentificationCreateWithoutRabbitInput = {
    id?: string;
    type: $Enums.RabbitIdentificationType;
    value: string;
    isPrimary?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RabbitIdentificationUncheckedCreateWithoutRabbitInput = {
    id?: string;
    type: $Enums.RabbitIdentificationType;
    value: string;
    isPrimary?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RabbitIdentificationCreateOrConnectWithoutRabbitInput = {
    where: Prisma.RabbitIdentificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.RabbitIdentificationCreateWithoutRabbitInput, Prisma.RabbitIdentificationUncheckedCreateWithoutRabbitInput>;
};
export type RabbitIdentificationCreateManyRabbitInputEnvelope = {
    data: Prisma.RabbitIdentificationCreateManyRabbitInput | Prisma.RabbitIdentificationCreateManyRabbitInput[];
    skipDuplicates?: boolean;
};
export type RabbitIdentificationUpsertWithWhereUniqueWithoutRabbitInput = {
    where: Prisma.RabbitIdentificationWhereUniqueInput;
    update: Prisma.XOR<Prisma.RabbitIdentificationUpdateWithoutRabbitInput, Prisma.RabbitIdentificationUncheckedUpdateWithoutRabbitInput>;
    create: Prisma.XOR<Prisma.RabbitIdentificationCreateWithoutRabbitInput, Prisma.RabbitIdentificationUncheckedCreateWithoutRabbitInput>;
};
export type RabbitIdentificationUpdateWithWhereUniqueWithoutRabbitInput = {
    where: Prisma.RabbitIdentificationWhereUniqueInput;
    data: Prisma.XOR<Prisma.RabbitIdentificationUpdateWithoutRabbitInput, Prisma.RabbitIdentificationUncheckedUpdateWithoutRabbitInput>;
};
export type RabbitIdentificationUpdateManyWithWhereWithoutRabbitInput = {
    where: Prisma.RabbitIdentificationScalarWhereInput;
    data: Prisma.XOR<Prisma.RabbitIdentificationUpdateManyMutationInput, Prisma.RabbitIdentificationUncheckedUpdateManyWithoutRabbitInput>;
};
export type RabbitIdentificationScalarWhereInput = {
    AND?: Prisma.RabbitIdentificationScalarWhereInput | Prisma.RabbitIdentificationScalarWhereInput[];
    OR?: Prisma.RabbitIdentificationScalarWhereInput[];
    NOT?: Prisma.RabbitIdentificationScalarWhereInput | Prisma.RabbitIdentificationScalarWhereInput[];
    id?: Prisma.StringFilter<"RabbitIdentification"> | string;
    rabbitId?: Prisma.StringFilter<"RabbitIdentification"> | string;
    type?: Prisma.EnumRabbitIdentificationTypeFilter<"RabbitIdentification"> | $Enums.RabbitIdentificationType;
    value?: Prisma.StringFilter<"RabbitIdentification"> | string;
    isPrimary?: Prisma.BoolFilter<"RabbitIdentification"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"RabbitIdentification"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RabbitIdentification"> | Date | string;
};
export type RabbitIdentificationCreateManyRabbitInput = {
    id?: string;
    type: $Enums.RabbitIdentificationType;
    value: string;
    isPrimary?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RabbitIdentificationUpdateWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRabbitIdentificationTypeFieldUpdateOperationsInput | $Enums.RabbitIdentificationType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    isPrimary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitIdentificationUncheckedUpdateWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRabbitIdentificationTypeFieldUpdateOperationsInput | $Enums.RabbitIdentificationType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    isPrimary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitIdentificationUncheckedUpdateManyWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumRabbitIdentificationTypeFieldUpdateOperationsInput | $Enums.RabbitIdentificationType;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    isPrimary?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RabbitIdentificationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rabbitId?: boolean;
    type?: boolean;
    value?: boolean;
    isPrimary?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rabbitIdentification"]>;
export type RabbitIdentificationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rabbitId?: boolean;
    type?: boolean;
    value?: boolean;
    isPrimary?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rabbitIdentification"]>;
export type RabbitIdentificationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rabbitId?: boolean;
    type?: boolean;
    value?: boolean;
    isPrimary?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rabbitIdentification"]>;
export type RabbitIdentificationSelectScalar = {
    id?: boolean;
    rabbitId?: boolean;
    type?: boolean;
    value?: boolean;
    isPrimary?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type RabbitIdentificationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "rabbitId" | "type" | "value" | "isPrimary" | "createdAt" | "updatedAt", ExtArgs["result"]["rabbitIdentification"]>;
export type RabbitIdentificationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
};
export type RabbitIdentificationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
};
export type RabbitIdentificationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
};
export type $RabbitIdentificationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RabbitIdentification";
    objects: {
        rabbit: Prisma.$RabbitPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        rabbitId: string;
        type: $Enums.RabbitIdentificationType;
        value: string;
        isPrimary: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["rabbitIdentification"]>;
    composites: {};
};
export type RabbitIdentificationGetPayload<S extends boolean | null | undefined | RabbitIdentificationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload, S>;
export type RabbitIdentificationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RabbitIdentificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RabbitIdentificationCountAggregateInputType | true;
};
export interface RabbitIdentificationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RabbitIdentification'];
        meta: {
            name: 'RabbitIdentification';
        };
    };
    findUnique<T extends RabbitIdentificationFindUniqueArgs>(args: Prisma.SelectSubset<T, RabbitIdentificationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RabbitIdentificationClient<runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RabbitIdentificationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RabbitIdentificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RabbitIdentificationClient<runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RabbitIdentificationFindFirstArgs>(args?: Prisma.SelectSubset<T, RabbitIdentificationFindFirstArgs<ExtArgs>>): Prisma.Prisma__RabbitIdentificationClient<runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RabbitIdentificationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RabbitIdentificationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RabbitIdentificationClient<runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RabbitIdentificationFindManyArgs>(args?: Prisma.SelectSubset<T, RabbitIdentificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RabbitIdentificationCreateArgs>(args: Prisma.SelectSubset<T, RabbitIdentificationCreateArgs<ExtArgs>>): Prisma.Prisma__RabbitIdentificationClient<runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RabbitIdentificationCreateManyArgs>(args?: Prisma.SelectSubset<T, RabbitIdentificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RabbitIdentificationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RabbitIdentificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RabbitIdentificationDeleteArgs>(args: Prisma.SelectSubset<T, RabbitIdentificationDeleteArgs<ExtArgs>>): Prisma.Prisma__RabbitIdentificationClient<runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RabbitIdentificationUpdateArgs>(args: Prisma.SelectSubset<T, RabbitIdentificationUpdateArgs<ExtArgs>>): Prisma.Prisma__RabbitIdentificationClient<runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RabbitIdentificationDeleteManyArgs>(args?: Prisma.SelectSubset<T, RabbitIdentificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RabbitIdentificationUpdateManyArgs>(args: Prisma.SelectSubset<T, RabbitIdentificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RabbitIdentificationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RabbitIdentificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RabbitIdentificationUpsertArgs>(args: Prisma.SelectSubset<T, RabbitIdentificationUpsertArgs<ExtArgs>>): Prisma.Prisma__RabbitIdentificationClient<runtime.Types.Result.GetResult<Prisma.$RabbitIdentificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RabbitIdentificationCountArgs>(args?: Prisma.Subset<T, RabbitIdentificationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RabbitIdentificationCountAggregateOutputType> : number>;
    aggregate<T extends RabbitIdentificationAggregateArgs>(args: Prisma.Subset<T, RabbitIdentificationAggregateArgs>): Prisma.PrismaPromise<GetRabbitIdentificationAggregateType<T>>;
    groupBy<T extends RabbitIdentificationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RabbitIdentificationGroupByArgs['orderBy'];
    } : {
        orderBy?: RabbitIdentificationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RabbitIdentificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRabbitIdentificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RabbitIdentificationFieldRefs;
}
export interface Prisma__RabbitIdentificationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    rabbit<T extends Prisma.RabbitDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RabbitDefaultArgs<ExtArgs>>): Prisma.Prisma__RabbitClient<runtime.Types.Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RabbitIdentificationFieldRefs {
    readonly id: Prisma.FieldRef<"RabbitIdentification", 'String'>;
    readonly rabbitId: Prisma.FieldRef<"RabbitIdentification", 'String'>;
    readonly type: Prisma.FieldRef<"RabbitIdentification", 'RabbitIdentificationType'>;
    readonly value: Prisma.FieldRef<"RabbitIdentification", 'String'>;
    readonly isPrimary: Prisma.FieldRef<"RabbitIdentification", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"RabbitIdentification", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"RabbitIdentification", 'DateTime'>;
}
export type RabbitIdentificationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelect<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    include?: Prisma.RabbitIdentificationInclude<ExtArgs> | null;
    where: Prisma.RabbitIdentificationWhereUniqueInput;
};
export type RabbitIdentificationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelect<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    include?: Prisma.RabbitIdentificationInclude<ExtArgs> | null;
    where: Prisma.RabbitIdentificationWhereUniqueInput;
};
export type RabbitIdentificationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelect<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    include?: Prisma.RabbitIdentificationInclude<ExtArgs> | null;
    where?: Prisma.RabbitIdentificationWhereInput;
    orderBy?: Prisma.RabbitIdentificationOrderByWithRelationInput | Prisma.RabbitIdentificationOrderByWithRelationInput[];
    cursor?: Prisma.RabbitIdentificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RabbitIdentificationScalarFieldEnum | Prisma.RabbitIdentificationScalarFieldEnum[];
};
export type RabbitIdentificationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelect<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    include?: Prisma.RabbitIdentificationInclude<ExtArgs> | null;
    where?: Prisma.RabbitIdentificationWhereInput;
    orderBy?: Prisma.RabbitIdentificationOrderByWithRelationInput | Prisma.RabbitIdentificationOrderByWithRelationInput[];
    cursor?: Prisma.RabbitIdentificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RabbitIdentificationScalarFieldEnum | Prisma.RabbitIdentificationScalarFieldEnum[];
};
export type RabbitIdentificationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelect<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    include?: Prisma.RabbitIdentificationInclude<ExtArgs> | null;
    where?: Prisma.RabbitIdentificationWhereInput;
    orderBy?: Prisma.RabbitIdentificationOrderByWithRelationInput | Prisma.RabbitIdentificationOrderByWithRelationInput[];
    cursor?: Prisma.RabbitIdentificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RabbitIdentificationScalarFieldEnum | Prisma.RabbitIdentificationScalarFieldEnum[];
};
export type RabbitIdentificationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelect<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    include?: Prisma.RabbitIdentificationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RabbitIdentificationCreateInput, Prisma.RabbitIdentificationUncheckedCreateInput>;
};
export type RabbitIdentificationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RabbitIdentificationCreateManyInput | Prisma.RabbitIdentificationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RabbitIdentificationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    data: Prisma.RabbitIdentificationCreateManyInput | Prisma.RabbitIdentificationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RabbitIdentificationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RabbitIdentificationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelect<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    include?: Prisma.RabbitIdentificationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RabbitIdentificationUpdateInput, Prisma.RabbitIdentificationUncheckedUpdateInput>;
    where: Prisma.RabbitIdentificationWhereUniqueInput;
};
export type RabbitIdentificationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RabbitIdentificationUpdateManyMutationInput, Prisma.RabbitIdentificationUncheckedUpdateManyInput>;
    where?: Prisma.RabbitIdentificationWhereInput;
    limit?: number;
};
export type RabbitIdentificationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RabbitIdentificationUpdateManyMutationInput, Prisma.RabbitIdentificationUncheckedUpdateManyInput>;
    where?: Prisma.RabbitIdentificationWhereInput;
    limit?: number;
    include?: Prisma.RabbitIdentificationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RabbitIdentificationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelect<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    include?: Prisma.RabbitIdentificationInclude<ExtArgs> | null;
    where: Prisma.RabbitIdentificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.RabbitIdentificationCreateInput, Prisma.RabbitIdentificationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RabbitIdentificationUpdateInput, Prisma.RabbitIdentificationUncheckedUpdateInput>;
};
export type RabbitIdentificationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelect<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    include?: Prisma.RabbitIdentificationInclude<ExtArgs> | null;
    where: Prisma.RabbitIdentificationWhereUniqueInput;
};
export type RabbitIdentificationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RabbitIdentificationWhereInput;
    limit?: number;
};
export type RabbitIdentificationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RabbitIdentificationSelect<ExtArgs> | null;
    omit?: Prisma.RabbitIdentificationOmit<ExtArgs> | null;
    include?: Prisma.RabbitIdentificationInclude<ExtArgs> | null;
};
