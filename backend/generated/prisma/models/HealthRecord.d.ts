import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type HealthRecordModel = runtime.Types.Result.DefaultSelection<Prisma.$HealthRecordPayload>;
export type AggregateHealthRecord = {
    _count: HealthRecordCountAggregateOutputType | null;
    _min: HealthRecordMinAggregateOutputType | null;
    _max: HealthRecordMaxAggregateOutputType | null;
};
export type HealthRecordMinAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    rabbitId: string | null;
    date: Date | null;
    symptoms: string | null;
    observation: string | null;
    suspicion: string | null;
    diagnosis: string | null;
    treatment: string | null;
    medication: string | null;
    dosage: string | null;
    nextDueDate: Date | null;
    createdById: string | null;
    createdAt: Date | null;
};
export type HealthRecordMaxAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    rabbitId: string | null;
    date: Date | null;
    symptoms: string | null;
    observation: string | null;
    suspicion: string | null;
    diagnosis: string | null;
    treatment: string | null;
    medication: string | null;
    dosage: string | null;
    nextDueDate: Date | null;
    createdById: string | null;
    createdAt: Date | null;
};
export type HealthRecordCountAggregateOutputType = {
    id: number;
    farmId: number;
    rabbitId: number;
    date: number;
    symptoms: number;
    observation: number;
    suspicion: number;
    diagnosis: number;
    treatment: number;
    medication: number;
    dosage: number;
    nextDueDate: number;
    createdById: number;
    createdAt: number;
    _all: number;
};
export type HealthRecordMinAggregateInputType = {
    id?: true;
    farmId?: true;
    rabbitId?: true;
    date?: true;
    symptoms?: true;
    observation?: true;
    suspicion?: true;
    diagnosis?: true;
    treatment?: true;
    medication?: true;
    dosage?: true;
    nextDueDate?: true;
    createdById?: true;
    createdAt?: true;
};
export type HealthRecordMaxAggregateInputType = {
    id?: true;
    farmId?: true;
    rabbitId?: true;
    date?: true;
    symptoms?: true;
    observation?: true;
    suspicion?: true;
    diagnosis?: true;
    treatment?: true;
    medication?: true;
    dosage?: true;
    nextDueDate?: true;
    createdById?: true;
    createdAt?: true;
};
export type HealthRecordCountAggregateInputType = {
    id?: true;
    farmId?: true;
    rabbitId?: true;
    date?: true;
    symptoms?: true;
    observation?: true;
    suspicion?: true;
    diagnosis?: true;
    treatment?: true;
    medication?: true;
    dosage?: true;
    nextDueDate?: true;
    createdById?: true;
    createdAt?: true;
    _all?: true;
};
export type HealthRecordAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HealthRecordWhereInput;
    orderBy?: Prisma.HealthRecordOrderByWithRelationInput | Prisma.HealthRecordOrderByWithRelationInput[];
    cursor?: Prisma.HealthRecordWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | HealthRecordCountAggregateInputType;
    _min?: HealthRecordMinAggregateInputType;
    _max?: HealthRecordMaxAggregateInputType;
};
export type GetHealthRecordAggregateType<T extends HealthRecordAggregateArgs> = {
    [P in keyof T & keyof AggregateHealthRecord]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateHealthRecord[P]> : Prisma.GetScalarType<T[P], AggregateHealthRecord[P]>;
};
export type HealthRecordGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HealthRecordWhereInput;
    orderBy?: Prisma.HealthRecordOrderByWithAggregationInput | Prisma.HealthRecordOrderByWithAggregationInput[];
    by: Prisma.HealthRecordScalarFieldEnum[] | Prisma.HealthRecordScalarFieldEnum;
    having?: Prisma.HealthRecordScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: HealthRecordCountAggregateInputType | true;
    _min?: HealthRecordMinAggregateInputType;
    _max?: HealthRecordMaxAggregateInputType;
};
export type HealthRecordGroupByOutputType = {
    id: string;
    farmId: string;
    rabbitId: string;
    date: Date;
    symptoms: string | null;
    observation: string | null;
    suspicion: string | null;
    diagnosis: string | null;
    treatment: string | null;
    medication: string | null;
    dosage: string | null;
    nextDueDate: Date | null;
    createdById: string | null;
    createdAt: Date;
    _count: HealthRecordCountAggregateOutputType | null;
    _min: HealthRecordMinAggregateOutputType | null;
    _max: HealthRecordMaxAggregateOutputType | null;
};
export type GetHealthRecordGroupByPayload<T extends HealthRecordGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<HealthRecordGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof HealthRecordGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], HealthRecordGroupByOutputType[P]> : Prisma.GetScalarType<T[P], HealthRecordGroupByOutputType[P]>;
}>>;
export type HealthRecordWhereInput = {
    AND?: Prisma.HealthRecordWhereInput | Prisma.HealthRecordWhereInput[];
    OR?: Prisma.HealthRecordWhereInput[];
    NOT?: Prisma.HealthRecordWhereInput | Prisma.HealthRecordWhereInput[];
    id?: Prisma.StringFilter<"HealthRecord"> | string;
    farmId?: Prisma.StringFilter<"HealthRecord"> | string;
    rabbitId?: Prisma.StringFilter<"HealthRecord"> | string;
    date?: Prisma.DateTimeFilter<"HealthRecord"> | Date | string;
    symptoms?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    observation?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    suspicion?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    diagnosis?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    treatment?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    medication?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    dosage?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    nextDueDate?: Prisma.DateTimeNullableFilter<"HealthRecord"> | Date | string | null;
    createdById?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"HealthRecord"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    rabbit?: Prisma.XOR<Prisma.RabbitScalarRelationFilter, Prisma.RabbitWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type HealthRecordOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    symptoms?: Prisma.SortOrderInput | Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    suspicion?: Prisma.SortOrderInput | Prisma.SortOrder;
    diagnosis?: Prisma.SortOrderInput | Prisma.SortOrder;
    treatment?: Prisma.SortOrderInput | Prisma.SortOrder;
    medication?: Prisma.SortOrderInput | Prisma.SortOrder;
    dosage?: Prisma.SortOrderInput | Prisma.SortOrder;
    nextDueDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    farm?: Prisma.FarmOrderByWithRelationInput;
    rabbit?: Prisma.RabbitOrderByWithRelationInput;
    createdBy?: Prisma.UserOrderByWithRelationInput;
};
export type HealthRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.HealthRecordWhereInput | Prisma.HealthRecordWhereInput[];
    OR?: Prisma.HealthRecordWhereInput[];
    NOT?: Prisma.HealthRecordWhereInput | Prisma.HealthRecordWhereInput[];
    farmId?: Prisma.StringFilter<"HealthRecord"> | string;
    rabbitId?: Prisma.StringFilter<"HealthRecord"> | string;
    date?: Prisma.DateTimeFilter<"HealthRecord"> | Date | string;
    symptoms?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    observation?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    suspicion?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    diagnosis?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    treatment?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    medication?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    dosage?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    nextDueDate?: Prisma.DateTimeNullableFilter<"HealthRecord"> | Date | string | null;
    createdById?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"HealthRecord"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    rabbit?: Prisma.XOR<Prisma.RabbitScalarRelationFilter, Prisma.RabbitWhereInput>;
    createdBy?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type HealthRecordOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    symptoms?: Prisma.SortOrderInput | Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    suspicion?: Prisma.SortOrderInput | Prisma.SortOrder;
    diagnosis?: Prisma.SortOrderInput | Prisma.SortOrder;
    treatment?: Prisma.SortOrderInput | Prisma.SortOrder;
    medication?: Prisma.SortOrderInput | Prisma.SortOrder;
    dosage?: Prisma.SortOrderInput | Prisma.SortOrder;
    nextDueDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdById?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.HealthRecordCountOrderByAggregateInput;
    _max?: Prisma.HealthRecordMaxOrderByAggregateInput;
    _min?: Prisma.HealthRecordMinOrderByAggregateInput;
};
export type HealthRecordScalarWhereWithAggregatesInput = {
    AND?: Prisma.HealthRecordScalarWhereWithAggregatesInput | Prisma.HealthRecordScalarWhereWithAggregatesInput[];
    OR?: Prisma.HealthRecordScalarWhereWithAggregatesInput[];
    NOT?: Prisma.HealthRecordScalarWhereWithAggregatesInput | Prisma.HealthRecordScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"HealthRecord"> | string;
    farmId?: Prisma.StringWithAggregatesFilter<"HealthRecord"> | string;
    rabbitId?: Prisma.StringWithAggregatesFilter<"HealthRecord"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"HealthRecord"> | Date | string;
    symptoms?: Prisma.StringNullableWithAggregatesFilter<"HealthRecord"> | string | null;
    observation?: Prisma.StringNullableWithAggregatesFilter<"HealthRecord"> | string | null;
    suspicion?: Prisma.StringNullableWithAggregatesFilter<"HealthRecord"> | string | null;
    diagnosis?: Prisma.StringNullableWithAggregatesFilter<"HealthRecord"> | string | null;
    treatment?: Prisma.StringNullableWithAggregatesFilter<"HealthRecord"> | string | null;
    medication?: Prisma.StringNullableWithAggregatesFilter<"HealthRecord"> | string | null;
    dosage?: Prisma.StringNullableWithAggregatesFilter<"HealthRecord"> | string | null;
    nextDueDate?: Prisma.DateTimeNullableWithAggregatesFilter<"HealthRecord"> | Date | string | null;
    createdById?: Prisma.StringNullableWithAggregatesFilter<"HealthRecord"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"HealthRecord"> | Date | string;
};
export type HealthRecordCreateInput = {
    id?: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutHealthRecordsInput;
    rabbit: Prisma.RabbitCreateNestedOneWithoutHealthRecordsInput;
    createdBy?: Prisma.UserCreateNestedOneWithoutHealthRecordsCreatedInput;
};
export type HealthRecordUncheckedCreateInput = {
    id?: string;
    farmId: string;
    rabbitId: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdById?: string | null;
    createdAt?: Date | string;
};
export type HealthRecordUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutHealthRecordsNestedInput;
    rabbit?: Prisma.RabbitUpdateOneRequiredWithoutHealthRecordsNestedInput;
    createdBy?: Prisma.UserUpdateOneWithoutHealthRecordsCreatedNestedInput;
};
export type HealthRecordUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthRecordCreateManyInput = {
    id?: string;
    farmId: string;
    rabbitId: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdById?: string | null;
    createdAt?: Date | string;
};
export type HealthRecordUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthRecordUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthRecordListRelationFilter = {
    every?: Prisma.HealthRecordWhereInput;
    some?: Prisma.HealthRecordWhereInput;
    none?: Prisma.HealthRecordWhereInput;
};
export type HealthRecordOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type HealthRecordCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    symptoms?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    suspicion?: Prisma.SortOrder;
    diagnosis?: Prisma.SortOrder;
    treatment?: Prisma.SortOrder;
    medication?: Prisma.SortOrder;
    dosage?: Prisma.SortOrder;
    nextDueDate?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HealthRecordMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    symptoms?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    suspicion?: Prisma.SortOrder;
    diagnosis?: Prisma.SortOrder;
    treatment?: Prisma.SortOrder;
    medication?: Prisma.SortOrder;
    dosage?: Prisma.SortOrder;
    nextDueDate?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HealthRecordMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    rabbitId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    symptoms?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    suspicion?: Prisma.SortOrder;
    diagnosis?: Prisma.SortOrder;
    treatment?: Prisma.SortOrder;
    medication?: Prisma.SortOrder;
    dosage?: Prisma.SortOrder;
    nextDueDate?: Prisma.SortOrder;
    createdById?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HealthRecordCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutCreatedByInput, Prisma.HealthRecordUncheckedCreateWithoutCreatedByInput> | Prisma.HealthRecordCreateWithoutCreatedByInput[] | Prisma.HealthRecordUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutCreatedByInput | Prisma.HealthRecordCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.HealthRecordCreateManyCreatedByInputEnvelope;
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
};
export type HealthRecordUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutCreatedByInput, Prisma.HealthRecordUncheckedCreateWithoutCreatedByInput> | Prisma.HealthRecordCreateWithoutCreatedByInput[] | Prisma.HealthRecordUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutCreatedByInput | Prisma.HealthRecordCreateOrConnectWithoutCreatedByInput[];
    createMany?: Prisma.HealthRecordCreateManyCreatedByInputEnvelope;
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
};
export type HealthRecordUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutCreatedByInput, Prisma.HealthRecordUncheckedCreateWithoutCreatedByInput> | Prisma.HealthRecordCreateWithoutCreatedByInput[] | Prisma.HealthRecordUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutCreatedByInput | Prisma.HealthRecordCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.HealthRecordUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.HealthRecordUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.HealthRecordCreateManyCreatedByInputEnvelope;
    set?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    disconnect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    delete?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    update?: Prisma.HealthRecordUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.HealthRecordUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.HealthRecordUpdateManyWithWhereWithoutCreatedByInput | Prisma.HealthRecordUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.HealthRecordScalarWhereInput | Prisma.HealthRecordScalarWhereInput[];
};
export type HealthRecordUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutCreatedByInput, Prisma.HealthRecordUncheckedCreateWithoutCreatedByInput> | Prisma.HealthRecordCreateWithoutCreatedByInput[] | Prisma.HealthRecordUncheckedCreateWithoutCreatedByInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutCreatedByInput | Prisma.HealthRecordCreateOrConnectWithoutCreatedByInput[];
    upsert?: Prisma.HealthRecordUpsertWithWhereUniqueWithoutCreatedByInput | Prisma.HealthRecordUpsertWithWhereUniqueWithoutCreatedByInput[];
    createMany?: Prisma.HealthRecordCreateManyCreatedByInputEnvelope;
    set?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    disconnect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    delete?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    update?: Prisma.HealthRecordUpdateWithWhereUniqueWithoutCreatedByInput | Prisma.HealthRecordUpdateWithWhereUniqueWithoutCreatedByInput[];
    updateMany?: Prisma.HealthRecordUpdateManyWithWhereWithoutCreatedByInput | Prisma.HealthRecordUpdateManyWithWhereWithoutCreatedByInput[];
    deleteMany?: Prisma.HealthRecordScalarWhereInput | Prisma.HealthRecordScalarWhereInput[];
};
export type HealthRecordCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutFarmInput, Prisma.HealthRecordUncheckedCreateWithoutFarmInput> | Prisma.HealthRecordCreateWithoutFarmInput[] | Prisma.HealthRecordUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutFarmInput | Prisma.HealthRecordCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.HealthRecordCreateManyFarmInputEnvelope;
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
};
export type HealthRecordUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutFarmInput, Prisma.HealthRecordUncheckedCreateWithoutFarmInput> | Prisma.HealthRecordCreateWithoutFarmInput[] | Prisma.HealthRecordUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutFarmInput | Prisma.HealthRecordCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.HealthRecordCreateManyFarmInputEnvelope;
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
};
export type HealthRecordUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutFarmInput, Prisma.HealthRecordUncheckedCreateWithoutFarmInput> | Prisma.HealthRecordCreateWithoutFarmInput[] | Prisma.HealthRecordUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutFarmInput | Prisma.HealthRecordCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.HealthRecordUpsertWithWhereUniqueWithoutFarmInput | Prisma.HealthRecordUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.HealthRecordCreateManyFarmInputEnvelope;
    set?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    disconnect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    delete?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    update?: Prisma.HealthRecordUpdateWithWhereUniqueWithoutFarmInput | Prisma.HealthRecordUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.HealthRecordUpdateManyWithWhereWithoutFarmInput | Prisma.HealthRecordUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.HealthRecordScalarWhereInput | Prisma.HealthRecordScalarWhereInput[];
};
export type HealthRecordUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutFarmInput, Prisma.HealthRecordUncheckedCreateWithoutFarmInput> | Prisma.HealthRecordCreateWithoutFarmInput[] | Prisma.HealthRecordUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutFarmInput | Prisma.HealthRecordCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.HealthRecordUpsertWithWhereUniqueWithoutFarmInput | Prisma.HealthRecordUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.HealthRecordCreateManyFarmInputEnvelope;
    set?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    disconnect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    delete?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    update?: Prisma.HealthRecordUpdateWithWhereUniqueWithoutFarmInput | Prisma.HealthRecordUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.HealthRecordUpdateManyWithWhereWithoutFarmInput | Prisma.HealthRecordUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.HealthRecordScalarWhereInput | Prisma.HealthRecordScalarWhereInput[];
};
export type HealthRecordCreateNestedManyWithoutRabbitInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutRabbitInput, Prisma.HealthRecordUncheckedCreateWithoutRabbitInput> | Prisma.HealthRecordCreateWithoutRabbitInput[] | Prisma.HealthRecordUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutRabbitInput | Prisma.HealthRecordCreateOrConnectWithoutRabbitInput[];
    createMany?: Prisma.HealthRecordCreateManyRabbitInputEnvelope;
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
};
export type HealthRecordUncheckedCreateNestedManyWithoutRabbitInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutRabbitInput, Prisma.HealthRecordUncheckedCreateWithoutRabbitInput> | Prisma.HealthRecordCreateWithoutRabbitInput[] | Prisma.HealthRecordUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutRabbitInput | Prisma.HealthRecordCreateOrConnectWithoutRabbitInput[];
    createMany?: Prisma.HealthRecordCreateManyRabbitInputEnvelope;
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
};
export type HealthRecordUpdateManyWithoutRabbitNestedInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutRabbitInput, Prisma.HealthRecordUncheckedCreateWithoutRabbitInput> | Prisma.HealthRecordCreateWithoutRabbitInput[] | Prisma.HealthRecordUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutRabbitInput | Prisma.HealthRecordCreateOrConnectWithoutRabbitInput[];
    upsert?: Prisma.HealthRecordUpsertWithWhereUniqueWithoutRabbitInput | Prisma.HealthRecordUpsertWithWhereUniqueWithoutRabbitInput[];
    createMany?: Prisma.HealthRecordCreateManyRabbitInputEnvelope;
    set?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    disconnect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    delete?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    update?: Prisma.HealthRecordUpdateWithWhereUniqueWithoutRabbitInput | Prisma.HealthRecordUpdateWithWhereUniqueWithoutRabbitInput[];
    updateMany?: Prisma.HealthRecordUpdateManyWithWhereWithoutRabbitInput | Prisma.HealthRecordUpdateManyWithWhereWithoutRabbitInput[];
    deleteMany?: Prisma.HealthRecordScalarWhereInput | Prisma.HealthRecordScalarWhereInput[];
};
export type HealthRecordUncheckedUpdateManyWithoutRabbitNestedInput = {
    create?: Prisma.XOR<Prisma.HealthRecordCreateWithoutRabbitInput, Prisma.HealthRecordUncheckedCreateWithoutRabbitInput> | Prisma.HealthRecordCreateWithoutRabbitInput[] | Prisma.HealthRecordUncheckedCreateWithoutRabbitInput[];
    connectOrCreate?: Prisma.HealthRecordCreateOrConnectWithoutRabbitInput | Prisma.HealthRecordCreateOrConnectWithoutRabbitInput[];
    upsert?: Prisma.HealthRecordUpsertWithWhereUniqueWithoutRabbitInput | Prisma.HealthRecordUpsertWithWhereUniqueWithoutRabbitInput[];
    createMany?: Prisma.HealthRecordCreateManyRabbitInputEnvelope;
    set?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    disconnect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    delete?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    connect?: Prisma.HealthRecordWhereUniqueInput | Prisma.HealthRecordWhereUniqueInput[];
    update?: Prisma.HealthRecordUpdateWithWhereUniqueWithoutRabbitInput | Prisma.HealthRecordUpdateWithWhereUniqueWithoutRabbitInput[];
    updateMany?: Prisma.HealthRecordUpdateManyWithWhereWithoutRabbitInput | Prisma.HealthRecordUpdateManyWithWhereWithoutRabbitInput[];
    deleteMany?: Prisma.HealthRecordScalarWhereInput | Prisma.HealthRecordScalarWhereInput[];
};
export type HealthRecordCreateWithoutCreatedByInput = {
    id?: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutHealthRecordsInput;
    rabbit: Prisma.RabbitCreateNestedOneWithoutHealthRecordsInput;
};
export type HealthRecordUncheckedCreateWithoutCreatedByInput = {
    id?: string;
    farmId: string;
    rabbitId: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdAt?: Date | string;
};
export type HealthRecordCreateOrConnectWithoutCreatedByInput = {
    where: Prisma.HealthRecordWhereUniqueInput;
    create: Prisma.XOR<Prisma.HealthRecordCreateWithoutCreatedByInput, Prisma.HealthRecordUncheckedCreateWithoutCreatedByInput>;
};
export type HealthRecordCreateManyCreatedByInputEnvelope = {
    data: Prisma.HealthRecordCreateManyCreatedByInput | Prisma.HealthRecordCreateManyCreatedByInput[];
    skipDuplicates?: boolean;
};
export type HealthRecordUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.HealthRecordWhereUniqueInput;
    update: Prisma.XOR<Prisma.HealthRecordUpdateWithoutCreatedByInput, Prisma.HealthRecordUncheckedUpdateWithoutCreatedByInput>;
    create: Prisma.XOR<Prisma.HealthRecordCreateWithoutCreatedByInput, Prisma.HealthRecordUncheckedCreateWithoutCreatedByInput>;
};
export type HealthRecordUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: Prisma.HealthRecordWhereUniqueInput;
    data: Prisma.XOR<Prisma.HealthRecordUpdateWithoutCreatedByInput, Prisma.HealthRecordUncheckedUpdateWithoutCreatedByInput>;
};
export type HealthRecordUpdateManyWithWhereWithoutCreatedByInput = {
    where: Prisma.HealthRecordScalarWhereInput;
    data: Prisma.XOR<Prisma.HealthRecordUpdateManyMutationInput, Prisma.HealthRecordUncheckedUpdateManyWithoutCreatedByInput>;
};
export type HealthRecordScalarWhereInput = {
    AND?: Prisma.HealthRecordScalarWhereInput | Prisma.HealthRecordScalarWhereInput[];
    OR?: Prisma.HealthRecordScalarWhereInput[];
    NOT?: Prisma.HealthRecordScalarWhereInput | Prisma.HealthRecordScalarWhereInput[];
    id?: Prisma.StringFilter<"HealthRecord"> | string;
    farmId?: Prisma.StringFilter<"HealthRecord"> | string;
    rabbitId?: Prisma.StringFilter<"HealthRecord"> | string;
    date?: Prisma.DateTimeFilter<"HealthRecord"> | Date | string;
    symptoms?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    observation?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    suspicion?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    diagnosis?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    treatment?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    medication?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    dosage?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    nextDueDate?: Prisma.DateTimeNullableFilter<"HealthRecord"> | Date | string | null;
    createdById?: Prisma.StringNullableFilter<"HealthRecord"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"HealthRecord"> | Date | string;
};
export type HealthRecordCreateWithoutFarmInput = {
    id?: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdAt?: Date | string;
    rabbit: Prisma.RabbitCreateNestedOneWithoutHealthRecordsInput;
    createdBy?: Prisma.UserCreateNestedOneWithoutHealthRecordsCreatedInput;
};
export type HealthRecordUncheckedCreateWithoutFarmInput = {
    id?: string;
    rabbitId: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdById?: string | null;
    createdAt?: Date | string;
};
export type HealthRecordCreateOrConnectWithoutFarmInput = {
    where: Prisma.HealthRecordWhereUniqueInput;
    create: Prisma.XOR<Prisma.HealthRecordCreateWithoutFarmInput, Prisma.HealthRecordUncheckedCreateWithoutFarmInput>;
};
export type HealthRecordCreateManyFarmInputEnvelope = {
    data: Prisma.HealthRecordCreateManyFarmInput | Prisma.HealthRecordCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type HealthRecordUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.HealthRecordWhereUniqueInput;
    update: Prisma.XOR<Prisma.HealthRecordUpdateWithoutFarmInput, Prisma.HealthRecordUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.HealthRecordCreateWithoutFarmInput, Prisma.HealthRecordUncheckedCreateWithoutFarmInput>;
};
export type HealthRecordUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.HealthRecordWhereUniqueInput;
    data: Prisma.XOR<Prisma.HealthRecordUpdateWithoutFarmInput, Prisma.HealthRecordUncheckedUpdateWithoutFarmInput>;
};
export type HealthRecordUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.HealthRecordScalarWhereInput;
    data: Prisma.XOR<Prisma.HealthRecordUpdateManyMutationInput, Prisma.HealthRecordUncheckedUpdateManyWithoutFarmInput>;
};
export type HealthRecordCreateWithoutRabbitInput = {
    id?: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutHealthRecordsInput;
    createdBy?: Prisma.UserCreateNestedOneWithoutHealthRecordsCreatedInput;
};
export type HealthRecordUncheckedCreateWithoutRabbitInput = {
    id?: string;
    farmId: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdById?: string | null;
    createdAt?: Date | string;
};
export type HealthRecordCreateOrConnectWithoutRabbitInput = {
    where: Prisma.HealthRecordWhereUniqueInput;
    create: Prisma.XOR<Prisma.HealthRecordCreateWithoutRabbitInput, Prisma.HealthRecordUncheckedCreateWithoutRabbitInput>;
};
export type HealthRecordCreateManyRabbitInputEnvelope = {
    data: Prisma.HealthRecordCreateManyRabbitInput | Prisma.HealthRecordCreateManyRabbitInput[];
    skipDuplicates?: boolean;
};
export type HealthRecordUpsertWithWhereUniqueWithoutRabbitInput = {
    where: Prisma.HealthRecordWhereUniqueInput;
    update: Prisma.XOR<Prisma.HealthRecordUpdateWithoutRabbitInput, Prisma.HealthRecordUncheckedUpdateWithoutRabbitInput>;
    create: Prisma.XOR<Prisma.HealthRecordCreateWithoutRabbitInput, Prisma.HealthRecordUncheckedCreateWithoutRabbitInput>;
};
export type HealthRecordUpdateWithWhereUniqueWithoutRabbitInput = {
    where: Prisma.HealthRecordWhereUniqueInput;
    data: Prisma.XOR<Prisma.HealthRecordUpdateWithoutRabbitInput, Prisma.HealthRecordUncheckedUpdateWithoutRabbitInput>;
};
export type HealthRecordUpdateManyWithWhereWithoutRabbitInput = {
    where: Prisma.HealthRecordScalarWhereInput;
    data: Prisma.XOR<Prisma.HealthRecordUpdateManyMutationInput, Prisma.HealthRecordUncheckedUpdateManyWithoutRabbitInput>;
};
export type HealthRecordCreateManyCreatedByInput = {
    id?: string;
    farmId: string;
    rabbitId: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdAt?: Date | string;
};
export type HealthRecordUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutHealthRecordsNestedInput;
    rabbit?: Prisma.RabbitUpdateOneRequiredWithoutHealthRecordsNestedInput;
};
export type HealthRecordUncheckedUpdateWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthRecordUncheckedUpdateManyWithoutCreatedByInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthRecordCreateManyFarmInput = {
    id?: string;
    rabbitId: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdById?: string | null;
    createdAt?: Date | string;
};
export type HealthRecordUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rabbit?: Prisma.RabbitUpdateOneRequiredWithoutHealthRecordsNestedInput;
    createdBy?: Prisma.UserUpdateOneWithoutHealthRecordsCreatedNestedInput;
};
export type HealthRecordUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthRecordUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rabbitId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthRecordCreateManyRabbitInput = {
    id?: string;
    farmId: string;
    date: Date | string;
    symptoms?: string | null;
    observation?: string | null;
    suspicion?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    medication?: string | null;
    dosage?: string | null;
    nextDueDate?: Date | string | null;
    createdById?: string | null;
    createdAt?: Date | string;
};
export type HealthRecordUpdateWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutHealthRecordsNestedInput;
    createdBy?: Prisma.UserUpdateOneWithoutHealthRecordsCreatedNestedInput;
};
export type HealthRecordUncheckedUpdateWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthRecordUncheckedUpdateManyWithoutRabbitInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    symptoms?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    suspicion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    diagnosis?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    treatment?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    medication?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dosage?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    nextDueDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdById?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthRecordSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    rabbitId?: boolean;
    date?: boolean;
    symptoms?: boolean;
    observation?: boolean;
    suspicion?: boolean;
    diagnosis?: boolean;
    treatment?: boolean;
    medication?: boolean;
    dosage?: boolean;
    nextDueDate?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.HealthRecord$createdByArgs<ExtArgs>;
}, ExtArgs["result"]["healthRecord"]>;
export type HealthRecordSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    rabbitId?: boolean;
    date?: boolean;
    symptoms?: boolean;
    observation?: boolean;
    suspicion?: boolean;
    diagnosis?: boolean;
    treatment?: boolean;
    medication?: boolean;
    dosage?: boolean;
    nextDueDate?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.HealthRecord$createdByArgs<ExtArgs>;
}, ExtArgs["result"]["healthRecord"]>;
export type HealthRecordSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    rabbitId?: boolean;
    date?: boolean;
    symptoms?: boolean;
    observation?: boolean;
    suspicion?: boolean;
    diagnosis?: boolean;
    treatment?: boolean;
    medication?: boolean;
    dosage?: boolean;
    nextDueDate?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.HealthRecord$createdByArgs<ExtArgs>;
}, ExtArgs["result"]["healthRecord"]>;
export type HealthRecordSelectScalar = {
    id?: boolean;
    farmId?: boolean;
    rabbitId?: boolean;
    date?: boolean;
    symptoms?: boolean;
    observation?: boolean;
    suspicion?: boolean;
    diagnosis?: boolean;
    treatment?: boolean;
    medication?: boolean;
    dosage?: boolean;
    nextDueDate?: boolean;
    createdById?: boolean;
    createdAt?: boolean;
};
export type HealthRecordOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farmId" | "rabbitId" | "date" | "symptoms" | "observation" | "suspicion" | "diagnosis" | "treatment" | "medication" | "dosage" | "nextDueDate" | "createdById" | "createdAt", ExtArgs["result"]["healthRecord"]>;
export type HealthRecordInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.HealthRecord$createdByArgs<ExtArgs>;
};
export type HealthRecordIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.HealthRecord$createdByArgs<ExtArgs>;
};
export type HealthRecordIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    rabbit?: boolean | Prisma.RabbitDefaultArgs<ExtArgs>;
    createdBy?: boolean | Prisma.HealthRecord$createdByArgs<ExtArgs>;
};
export type $HealthRecordPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "HealthRecord";
    objects: {
        farm: Prisma.$FarmPayload<ExtArgs>;
        rabbit: Prisma.$RabbitPayload<ExtArgs>;
        createdBy: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farmId: string;
        rabbitId: string;
        date: Date;
        symptoms: string | null;
        observation: string | null;
        suspicion: string | null;
        diagnosis: string | null;
        treatment: string | null;
        medication: string | null;
        dosage: string | null;
        nextDueDate: Date | null;
        createdById: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["healthRecord"]>;
    composites: {};
};
export type HealthRecordGetPayload<S extends boolean | null | undefined | HealthRecordDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload, S>;
export type HealthRecordCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<HealthRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: HealthRecordCountAggregateInputType | true;
};
export interface HealthRecordDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['HealthRecord'];
        meta: {
            name: 'HealthRecord';
        };
    };
    findUnique<T extends HealthRecordFindUniqueArgs>(args: Prisma.SelectSubset<T, HealthRecordFindUniqueArgs<ExtArgs>>): Prisma.Prisma__HealthRecordClient<runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends HealthRecordFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, HealthRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__HealthRecordClient<runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends HealthRecordFindFirstArgs>(args?: Prisma.SelectSubset<T, HealthRecordFindFirstArgs<ExtArgs>>): Prisma.Prisma__HealthRecordClient<runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends HealthRecordFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, HealthRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__HealthRecordClient<runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends HealthRecordFindManyArgs>(args?: Prisma.SelectSubset<T, HealthRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends HealthRecordCreateArgs>(args: Prisma.SelectSubset<T, HealthRecordCreateArgs<ExtArgs>>): Prisma.Prisma__HealthRecordClient<runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends HealthRecordCreateManyArgs>(args?: Prisma.SelectSubset<T, HealthRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends HealthRecordCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, HealthRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends HealthRecordDeleteArgs>(args: Prisma.SelectSubset<T, HealthRecordDeleteArgs<ExtArgs>>): Prisma.Prisma__HealthRecordClient<runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends HealthRecordUpdateArgs>(args: Prisma.SelectSubset<T, HealthRecordUpdateArgs<ExtArgs>>): Prisma.Prisma__HealthRecordClient<runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends HealthRecordDeleteManyArgs>(args?: Prisma.SelectSubset<T, HealthRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends HealthRecordUpdateManyArgs>(args: Prisma.SelectSubset<T, HealthRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends HealthRecordUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, HealthRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends HealthRecordUpsertArgs>(args: Prisma.SelectSubset<T, HealthRecordUpsertArgs<ExtArgs>>): Prisma.Prisma__HealthRecordClient<runtime.Types.Result.GetResult<Prisma.$HealthRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends HealthRecordCountArgs>(args?: Prisma.Subset<T, HealthRecordCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], HealthRecordCountAggregateOutputType> : number>;
    aggregate<T extends HealthRecordAggregateArgs>(args: Prisma.Subset<T, HealthRecordAggregateArgs>): Prisma.PrismaPromise<GetHealthRecordAggregateType<T>>;
    groupBy<T extends HealthRecordGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: HealthRecordGroupByArgs['orderBy'];
    } : {
        orderBy?: HealthRecordGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, HealthRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHealthRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: HealthRecordFieldRefs;
}
export interface Prisma__HealthRecordClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farm<T extends Prisma.FarmDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FarmDefaultArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    rabbit<T extends Prisma.RabbitDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RabbitDefaultArgs<ExtArgs>>): Prisma.Prisma__RabbitClient<runtime.Types.Result.GetResult<Prisma.$RabbitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    createdBy<T extends Prisma.HealthRecord$createdByArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.HealthRecord$createdByArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface HealthRecordFieldRefs {
    readonly id: Prisma.FieldRef<"HealthRecord", 'String'>;
    readonly farmId: Prisma.FieldRef<"HealthRecord", 'String'>;
    readonly rabbitId: Prisma.FieldRef<"HealthRecord", 'String'>;
    readonly date: Prisma.FieldRef<"HealthRecord", 'DateTime'>;
    readonly symptoms: Prisma.FieldRef<"HealthRecord", 'String'>;
    readonly observation: Prisma.FieldRef<"HealthRecord", 'String'>;
    readonly suspicion: Prisma.FieldRef<"HealthRecord", 'String'>;
    readonly diagnosis: Prisma.FieldRef<"HealthRecord", 'String'>;
    readonly treatment: Prisma.FieldRef<"HealthRecord", 'String'>;
    readonly medication: Prisma.FieldRef<"HealthRecord", 'String'>;
    readonly dosage: Prisma.FieldRef<"HealthRecord", 'String'>;
    readonly nextDueDate: Prisma.FieldRef<"HealthRecord", 'DateTime'>;
    readonly createdById: Prisma.FieldRef<"HealthRecord", 'String'>;
    readonly createdAt: Prisma.FieldRef<"HealthRecord", 'DateTime'>;
}
export type HealthRecordFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelect<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    include?: Prisma.HealthRecordInclude<ExtArgs> | null;
    where: Prisma.HealthRecordWhereUniqueInput;
};
export type HealthRecordFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelect<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    include?: Prisma.HealthRecordInclude<ExtArgs> | null;
    where: Prisma.HealthRecordWhereUniqueInput;
};
export type HealthRecordFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelect<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    include?: Prisma.HealthRecordInclude<ExtArgs> | null;
    where?: Prisma.HealthRecordWhereInput;
    orderBy?: Prisma.HealthRecordOrderByWithRelationInput | Prisma.HealthRecordOrderByWithRelationInput[];
    cursor?: Prisma.HealthRecordWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HealthRecordScalarFieldEnum | Prisma.HealthRecordScalarFieldEnum[];
};
export type HealthRecordFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelect<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    include?: Prisma.HealthRecordInclude<ExtArgs> | null;
    where?: Prisma.HealthRecordWhereInput;
    orderBy?: Prisma.HealthRecordOrderByWithRelationInput | Prisma.HealthRecordOrderByWithRelationInput[];
    cursor?: Prisma.HealthRecordWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HealthRecordScalarFieldEnum | Prisma.HealthRecordScalarFieldEnum[];
};
export type HealthRecordFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelect<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    include?: Prisma.HealthRecordInclude<ExtArgs> | null;
    where?: Prisma.HealthRecordWhereInput;
    orderBy?: Prisma.HealthRecordOrderByWithRelationInput | Prisma.HealthRecordOrderByWithRelationInput[];
    cursor?: Prisma.HealthRecordWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HealthRecordScalarFieldEnum | Prisma.HealthRecordScalarFieldEnum[];
};
export type HealthRecordCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelect<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    include?: Prisma.HealthRecordInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HealthRecordCreateInput, Prisma.HealthRecordUncheckedCreateInput>;
};
export type HealthRecordCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.HealthRecordCreateManyInput | Prisma.HealthRecordCreateManyInput[];
    skipDuplicates?: boolean;
};
export type HealthRecordCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    data: Prisma.HealthRecordCreateManyInput | Prisma.HealthRecordCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.HealthRecordIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type HealthRecordUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelect<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    include?: Prisma.HealthRecordInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HealthRecordUpdateInput, Prisma.HealthRecordUncheckedUpdateInput>;
    where: Prisma.HealthRecordWhereUniqueInput;
};
export type HealthRecordUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.HealthRecordUpdateManyMutationInput, Prisma.HealthRecordUncheckedUpdateManyInput>;
    where?: Prisma.HealthRecordWhereInput;
    limit?: number;
};
export type HealthRecordUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HealthRecordUpdateManyMutationInput, Prisma.HealthRecordUncheckedUpdateManyInput>;
    where?: Prisma.HealthRecordWhereInput;
    limit?: number;
    include?: Prisma.HealthRecordIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type HealthRecordUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelect<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    include?: Prisma.HealthRecordInclude<ExtArgs> | null;
    where: Prisma.HealthRecordWhereUniqueInput;
    create: Prisma.XOR<Prisma.HealthRecordCreateInput, Prisma.HealthRecordUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.HealthRecordUpdateInput, Prisma.HealthRecordUncheckedUpdateInput>;
};
export type HealthRecordDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelect<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    include?: Prisma.HealthRecordInclude<ExtArgs> | null;
    where: Prisma.HealthRecordWhereUniqueInput;
};
export type HealthRecordDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HealthRecordWhereInput;
    limit?: number;
};
export type HealthRecord$createdByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type HealthRecordDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthRecordSelect<ExtArgs> | null;
    omit?: Prisma.HealthRecordOmit<ExtArgs> | null;
    include?: Prisma.HealthRecordInclude<ExtArgs> | null;
};
