import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SaleModel = runtime.Types.Result.DefaultSelection<Prisma.$SalePayload>;
export type AggregateSale = {
    _count: SaleCountAggregateOutputType | null;
    _avg: SaleAvgAggregateOutputType | null;
    _sum: SaleSumAggregateOutputType | null;
    _min: SaleMinAggregateOutputType | null;
    _max: SaleMaxAggregateOutputType | null;
};
export type SaleAvgAggregateOutputType = {
    totalAmount: runtime.Decimal | null;
};
export type SaleSumAggregateOutputType = {
    totalAmount: runtime.Decimal | null;
};
export type SaleMinAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    customerId: string | null;
    saleDate: Date | null;
    totalAmount: runtime.Decimal | null;
    status: $Enums.SaleStatus | null;
    observation: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SaleMaxAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    customerId: string | null;
    saleDate: Date | null;
    totalAmount: runtime.Decimal | null;
    status: $Enums.SaleStatus | null;
    observation: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SaleCountAggregateOutputType = {
    id: number;
    farmId: number;
    customerId: number;
    saleDate: number;
    totalAmount: number;
    status: number;
    observation: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type SaleAvgAggregateInputType = {
    totalAmount?: true;
};
export type SaleSumAggregateInputType = {
    totalAmount?: true;
};
export type SaleMinAggregateInputType = {
    id?: true;
    farmId?: true;
    customerId?: true;
    saleDate?: true;
    totalAmount?: true;
    status?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SaleMaxAggregateInputType = {
    id?: true;
    farmId?: true;
    customerId?: true;
    saleDate?: true;
    totalAmount?: true;
    status?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SaleCountAggregateInputType = {
    id?: true;
    farmId?: true;
    customerId?: true;
    saleDate?: true;
    totalAmount?: true;
    status?: true;
    observation?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type SaleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleWhereInput;
    orderBy?: Prisma.SaleOrderByWithRelationInput | Prisma.SaleOrderByWithRelationInput[];
    cursor?: Prisma.SaleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SaleCountAggregateInputType;
    _avg?: SaleAvgAggregateInputType;
    _sum?: SaleSumAggregateInputType;
    _min?: SaleMinAggregateInputType;
    _max?: SaleMaxAggregateInputType;
};
export type GetSaleAggregateType<T extends SaleAggregateArgs> = {
    [P in keyof T & keyof AggregateSale]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSale[P]> : Prisma.GetScalarType<T[P], AggregateSale[P]>;
};
export type SaleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleWhereInput;
    orderBy?: Prisma.SaleOrderByWithAggregationInput | Prisma.SaleOrderByWithAggregationInput[];
    by: Prisma.SaleScalarFieldEnum[] | Prisma.SaleScalarFieldEnum;
    having?: Prisma.SaleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SaleCountAggregateInputType | true;
    _avg?: SaleAvgAggregateInputType;
    _sum?: SaleSumAggregateInputType;
    _min?: SaleMinAggregateInputType;
    _max?: SaleMaxAggregateInputType;
};
export type SaleGroupByOutputType = {
    id: string;
    farmId: string;
    customerId: string | null;
    saleDate: Date;
    totalAmount: runtime.Decimal;
    status: $Enums.SaleStatus;
    observation: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: SaleCountAggregateOutputType | null;
    _avg: SaleAvgAggregateOutputType | null;
    _sum: SaleSumAggregateOutputType | null;
    _min: SaleMinAggregateOutputType | null;
    _max: SaleMaxAggregateOutputType | null;
};
export type GetSaleGroupByPayload<T extends SaleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SaleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SaleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SaleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SaleGroupByOutputType[P]>;
}>>;
export type SaleWhereInput = {
    AND?: Prisma.SaleWhereInput | Prisma.SaleWhereInput[];
    OR?: Prisma.SaleWhereInput[];
    NOT?: Prisma.SaleWhereInput | Prisma.SaleWhereInput[];
    id?: Prisma.StringFilter<"Sale"> | string;
    farmId?: Prisma.StringFilter<"Sale"> | string;
    customerId?: Prisma.StringNullableFilter<"Sale"> | string | null;
    saleDate?: Prisma.DateTimeFilter<"Sale"> | Date | string;
    totalAmount?: Prisma.DecimalFilter<"Sale"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFilter<"Sale"> | $Enums.SaleStatus;
    observation?: Prisma.StringNullableFilter<"Sale"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Sale"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Sale"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    items?: Prisma.SaleItemListRelationFilter;
    payments?: Prisma.PaymentListRelationFilter;
};
export type SaleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    saleDate?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    farm?: Prisma.FarmOrderByWithRelationInput;
    customer?: Prisma.CustomerOrderByWithRelationInput;
    items?: Prisma.SaleItemOrderByRelationAggregateInput;
    payments?: Prisma.PaymentOrderByRelationAggregateInput;
};
export type SaleWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SaleWhereInput | Prisma.SaleWhereInput[];
    OR?: Prisma.SaleWhereInput[];
    NOT?: Prisma.SaleWhereInput | Prisma.SaleWhereInput[];
    farmId?: Prisma.StringFilter<"Sale"> | string;
    customerId?: Prisma.StringNullableFilter<"Sale"> | string | null;
    saleDate?: Prisma.DateTimeFilter<"Sale"> | Date | string;
    totalAmount?: Prisma.DecimalFilter<"Sale"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFilter<"Sale"> | $Enums.SaleStatus;
    observation?: Prisma.StringNullableFilter<"Sale"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Sale"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Sale"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    customer?: Prisma.XOR<Prisma.CustomerNullableScalarRelationFilter, Prisma.CustomerWhereInput> | null;
    items?: Prisma.SaleItemListRelationFilter;
    payments?: Prisma.PaymentListRelationFilter;
}, "id">;
export type SaleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrderInput | Prisma.SortOrder;
    saleDate?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    observation?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.SaleCountOrderByAggregateInput;
    _avg?: Prisma.SaleAvgOrderByAggregateInput;
    _max?: Prisma.SaleMaxOrderByAggregateInput;
    _min?: Prisma.SaleMinOrderByAggregateInput;
    _sum?: Prisma.SaleSumOrderByAggregateInput;
};
export type SaleScalarWhereWithAggregatesInput = {
    AND?: Prisma.SaleScalarWhereWithAggregatesInput | Prisma.SaleScalarWhereWithAggregatesInput[];
    OR?: Prisma.SaleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SaleScalarWhereWithAggregatesInput | Prisma.SaleScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Sale"> | string;
    farmId?: Prisma.StringWithAggregatesFilter<"Sale"> | string;
    customerId?: Prisma.StringNullableWithAggregatesFilter<"Sale"> | string | null;
    saleDate?: Prisma.DateTimeWithAggregatesFilter<"Sale"> | Date | string;
    totalAmount?: Prisma.DecimalWithAggregatesFilter<"Sale"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusWithAggregatesFilter<"Sale"> | $Enums.SaleStatus;
    observation?: Prisma.StringNullableWithAggregatesFilter<"Sale"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Sale"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Sale"> | Date | string;
};
export type SaleCreateInput = {
    id?: string;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutSalesInput;
    customer?: Prisma.CustomerCreateNestedOneWithoutSalesInput;
    items?: Prisma.SaleItemCreateNestedManyWithoutSaleInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSaleInput;
};
export type SaleUncheckedCreateInput = {
    id?: string;
    farmId: string;
    customerId?: string | null;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.SaleItemUncheckedCreateNestedManyWithoutSaleInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSaleInput;
};
export type SaleUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutSalesNestedInput;
    customer?: Prisma.CustomerUpdateOneWithoutSalesNestedInput;
    items?: Prisma.SaleItemUpdateManyWithoutSaleNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSaleNestedInput;
};
export type SaleUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.SaleItemUncheckedUpdateManyWithoutSaleNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSaleNestedInput;
};
export type SaleCreateManyInput = {
    id?: string;
    farmId: string;
    customerId?: string | null;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SaleUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SaleUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SaleListRelationFilter = {
    every?: Prisma.SaleWhereInput;
    some?: Prisma.SaleWhereInput;
    none?: Prisma.SaleWhereInput;
};
export type SaleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SaleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    saleDate?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SaleAvgOrderByAggregateInput = {
    totalAmount?: Prisma.SortOrder;
};
export type SaleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    saleDate?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SaleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    customerId?: Prisma.SortOrder;
    saleDate?: Prisma.SortOrder;
    totalAmount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    observation?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SaleSumOrderByAggregateInput = {
    totalAmount?: Prisma.SortOrder;
};
export type SaleScalarRelationFilter = {
    is?: Prisma.SaleWhereInput;
    isNot?: Prisma.SaleWhereInput;
};
export type SaleCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutFarmInput, Prisma.SaleUncheckedCreateWithoutFarmInput> | Prisma.SaleCreateWithoutFarmInput[] | Prisma.SaleUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutFarmInput | Prisma.SaleCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.SaleCreateManyFarmInputEnvelope;
    connect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
};
export type SaleUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutFarmInput, Prisma.SaleUncheckedCreateWithoutFarmInput> | Prisma.SaleCreateWithoutFarmInput[] | Prisma.SaleUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutFarmInput | Prisma.SaleCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.SaleCreateManyFarmInputEnvelope;
    connect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
};
export type SaleUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutFarmInput, Prisma.SaleUncheckedCreateWithoutFarmInput> | Prisma.SaleCreateWithoutFarmInput[] | Prisma.SaleUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutFarmInput | Prisma.SaleCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.SaleUpsertWithWhereUniqueWithoutFarmInput | Prisma.SaleUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.SaleCreateManyFarmInputEnvelope;
    set?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    disconnect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    delete?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    connect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    update?: Prisma.SaleUpdateWithWhereUniqueWithoutFarmInput | Prisma.SaleUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.SaleUpdateManyWithWhereWithoutFarmInput | Prisma.SaleUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.SaleScalarWhereInput | Prisma.SaleScalarWhereInput[];
};
export type SaleUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutFarmInput, Prisma.SaleUncheckedCreateWithoutFarmInput> | Prisma.SaleCreateWithoutFarmInput[] | Prisma.SaleUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutFarmInput | Prisma.SaleCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.SaleUpsertWithWhereUniqueWithoutFarmInput | Prisma.SaleUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.SaleCreateManyFarmInputEnvelope;
    set?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    disconnect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    delete?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    connect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    update?: Prisma.SaleUpdateWithWhereUniqueWithoutFarmInput | Prisma.SaleUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.SaleUpdateManyWithWhereWithoutFarmInput | Prisma.SaleUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.SaleScalarWhereInput | Prisma.SaleScalarWhereInput[];
};
export type SaleCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutCustomerInput, Prisma.SaleUncheckedCreateWithoutCustomerInput> | Prisma.SaleCreateWithoutCustomerInput[] | Prisma.SaleUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutCustomerInput | Prisma.SaleCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.SaleCreateManyCustomerInputEnvelope;
    connect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
};
export type SaleUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutCustomerInput, Prisma.SaleUncheckedCreateWithoutCustomerInput> | Prisma.SaleCreateWithoutCustomerInput[] | Prisma.SaleUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutCustomerInput | Prisma.SaleCreateOrConnectWithoutCustomerInput[];
    createMany?: Prisma.SaleCreateManyCustomerInputEnvelope;
    connect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
};
export type SaleUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutCustomerInput, Prisma.SaleUncheckedCreateWithoutCustomerInput> | Prisma.SaleCreateWithoutCustomerInput[] | Prisma.SaleUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutCustomerInput | Prisma.SaleCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.SaleUpsertWithWhereUniqueWithoutCustomerInput | Prisma.SaleUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.SaleCreateManyCustomerInputEnvelope;
    set?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    disconnect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    delete?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    connect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    update?: Prisma.SaleUpdateWithWhereUniqueWithoutCustomerInput | Prisma.SaleUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.SaleUpdateManyWithWhereWithoutCustomerInput | Prisma.SaleUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.SaleScalarWhereInput | Prisma.SaleScalarWhereInput[];
};
export type SaleUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutCustomerInput, Prisma.SaleUncheckedCreateWithoutCustomerInput> | Prisma.SaleCreateWithoutCustomerInput[] | Prisma.SaleUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutCustomerInput | Prisma.SaleCreateOrConnectWithoutCustomerInput[];
    upsert?: Prisma.SaleUpsertWithWhereUniqueWithoutCustomerInput | Prisma.SaleUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: Prisma.SaleCreateManyCustomerInputEnvelope;
    set?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    disconnect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    delete?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    connect?: Prisma.SaleWhereUniqueInput | Prisma.SaleWhereUniqueInput[];
    update?: Prisma.SaleUpdateWithWhereUniqueWithoutCustomerInput | Prisma.SaleUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?: Prisma.SaleUpdateManyWithWhereWithoutCustomerInput | Prisma.SaleUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: Prisma.SaleScalarWhereInput | Prisma.SaleScalarWhereInput[];
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type EnumSaleStatusFieldUpdateOperationsInput = {
    set?: $Enums.SaleStatus;
};
export type SaleCreateNestedOneWithoutItemsInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutItemsInput, Prisma.SaleUncheckedCreateWithoutItemsInput>;
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutItemsInput;
    connect?: Prisma.SaleWhereUniqueInput;
};
export type SaleUpdateOneRequiredWithoutItemsNestedInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutItemsInput, Prisma.SaleUncheckedCreateWithoutItemsInput>;
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutItemsInput;
    upsert?: Prisma.SaleUpsertWithoutItemsInput;
    connect?: Prisma.SaleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SaleUpdateToOneWithWhereWithoutItemsInput, Prisma.SaleUpdateWithoutItemsInput>, Prisma.SaleUncheckedUpdateWithoutItemsInput>;
};
export type SaleCreateNestedOneWithoutPaymentsInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutPaymentsInput, Prisma.SaleUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutPaymentsInput;
    connect?: Prisma.SaleWhereUniqueInput;
};
export type SaleUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.SaleCreateWithoutPaymentsInput, Prisma.SaleUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.SaleCreateOrConnectWithoutPaymentsInput;
    upsert?: Prisma.SaleUpsertWithoutPaymentsInput;
    connect?: Prisma.SaleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SaleUpdateToOneWithWhereWithoutPaymentsInput, Prisma.SaleUpdateWithoutPaymentsInput>, Prisma.SaleUncheckedUpdateWithoutPaymentsInput>;
};
export type SaleCreateWithoutFarmInput = {
    id?: string;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer?: Prisma.CustomerCreateNestedOneWithoutSalesInput;
    items?: Prisma.SaleItemCreateNestedManyWithoutSaleInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSaleInput;
};
export type SaleUncheckedCreateWithoutFarmInput = {
    id?: string;
    customerId?: string | null;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.SaleItemUncheckedCreateNestedManyWithoutSaleInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSaleInput;
};
export type SaleCreateOrConnectWithoutFarmInput = {
    where: Prisma.SaleWhereUniqueInput;
    create: Prisma.XOR<Prisma.SaleCreateWithoutFarmInput, Prisma.SaleUncheckedCreateWithoutFarmInput>;
};
export type SaleCreateManyFarmInputEnvelope = {
    data: Prisma.SaleCreateManyFarmInput | Prisma.SaleCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type SaleUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.SaleWhereUniqueInput;
    update: Prisma.XOR<Prisma.SaleUpdateWithoutFarmInput, Prisma.SaleUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.SaleCreateWithoutFarmInput, Prisma.SaleUncheckedCreateWithoutFarmInput>;
};
export type SaleUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.SaleWhereUniqueInput;
    data: Prisma.XOR<Prisma.SaleUpdateWithoutFarmInput, Prisma.SaleUncheckedUpdateWithoutFarmInput>;
};
export type SaleUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.SaleScalarWhereInput;
    data: Prisma.XOR<Prisma.SaleUpdateManyMutationInput, Prisma.SaleUncheckedUpdateManyWithoutFarmInput>;
};
export type SaleScalarWhereInput = {
    AND?: Prisma.SaleScalarWhereInput | Prisma.SaleScalarWhereInput[];
    OR?: Prisma.SaleScalarWhereInput[];
    NOT?: Prisma.SaleScalarWhereInput | Prisma.SaleScalarWhereInput[];
    id?: Prisma.StringFilter<"Sale"> | string;
    farmId?: Prisma.StringFilter<"Sale"> | string;
    customerId?: Prisma.StringNullableFilter<"Sale"> | string | null;
    saleDate?: Prisma.DateTimeFilter<"Sale"> | Date | string;
    totalAmount?: Prisma.DecimalFilter<"Sale"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFilter<"Sale"> | $Enums.SaleStatus;
    observation?: Prisma.StringNullableFilter<"Sale"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Sale"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Sale"> | Date | string;
};
export type SaleCreateWithoutCustomerInput = {
    id?: string;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutSalesInput;
    items?: Prisma.SaleItemCreateNestedManyWithoutSaleInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSaleInput;
};
export type SaleUncheckedCreateWithoutCustomerInput = {
    id?: string;
    farmId: string;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.SaleItemUncheckedCreateNestedManyWithoutSaleInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSaleInput;
};
export type SaleCreateOrConnectWithoutCustomerInput = {
    where: Prisma.SaleWhereUniqueInput;
    create: Prisma.XOR<Prisma.SaleCreateWithoutCustomerInput, Prisma.SaleUncheckedCreateWithoutCustomerInput>;
};
export type SaleCreateManyCustomerInputEnvelope = {
    data: Prisma.SaleCreateManyCustomerInput | Prisma.SaleCreateManyCustomerInput[];
    skipDuplicates?: boolean;
};
export type SaleUpsertWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.SaleWhereUniqueInput;
    update: Prisma.XOR<Prisma.SaleUpdateWithoutCustomerInput, Prisma.SaleUncheckedUpdateWithoutCustomerInput>;
    create: Prisma.XOR<Prisma.SaleCreateWithoutCustomerInput, Prisma.SaleUncheckedCreateWithoutCustomerInput>;
};
export type SaleUpdateWithWhereUniqueWithoutCustomerInput = {
    where: Prisma.SaleWhereUniqueInput;
    data: Prisma.XOR<Prisma.SaleUpdateWithoutCustomerInput, Prisma.SaleUncheckedUpdateWithoutCustomerInput>;
};
export type SaleUpdateManyWithWhereWithoutCustomerInput = {
    where: Prisma.SaleScalarWhereInput;
    data: Prisma.XOR<Prisma.SaleUpdateManyMutationInput, Prisma.SaleUncheckedUpdateManyWithoutCustomerInput>;
};
export type SaleCreateWithoutItemsInput = {
    id?: string;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutSalesInput;
    customer?: Prisma.CustomerCreateNestedOneWithoutSalesInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutSaleInput;
};
export type SaleUncheckedCreateWithoutItemsInput = {
    id?: string;
    farmId: string;
    customerId?: string | null;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutSaleInput;
};
export type SaleCreateOrConnectWithoutItemsInput = {
    where: Prisma.SaleWhereUniqueInput;
    create: Prisma.XOR<Prisma.SaleCreateWithoutItemsInput, Prisma.SaleUncheckedCreateWithoutItemsInput>;
};
export type SaleUpsertWithoutItemsInput = {
    update: Prisma.XOR<Prisma.SaleUpdateWithoutItemsInput, Prisma.SaleUncheckedUpdateWithoutItemsInput>;
    create: Prisma.XOR<Prisma.SaleCreateWithoutItemsInput, Prisma.SaleUncheckedCreateWithoutItemsInput>;
    where?: Prisma.SaleWhereInput;
};
export type SaleUpdateToOneWithWhereWithoutItemsInput = {
    where?: Prisma.SaleWhereInput;
    data: Prisma.XOR<Prisma.SaleUpdateWithoutItemsInput, Prisma.SaleUncheckedUpdateWithoutItemsInput>;
};
export type SaleUpdateWithoutItemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutSalesNestedInput;
    customer?: Prisma.CustomerUpdateOneWithoutSalesNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSaleNestedInput;
};
export type SaleUncheckedUpdateWithoutItemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSaleNestedInput;
};
export type SaleCreateWithoutPaymentsInput = {
    id?: string;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutSalesInput;
    customer?: Prisma.CustomerCreateNestedOneWithoutSalesInput;
    items?: Prisma.SaleItemCreateNestedManyWithoutSaleInput;
};
export type SaleUncheckedCreateWithoutPaymentsInput = {
    id?: string;
    farmId: string;
    customerId?: string | null;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    items?: Prisma.SaleItemUncheckedCreateNestedManyWithoutSaleInput;
};
export type SaleCreateOrConnectWithoutPaymentsInput = {
    where: Prisma.SaleWhereUniqueInput;
    create: Prisma.XOR<Prisma.SaleCreateWithoutPaymentsInput, Prisma.SaleUncheckedCreateWithoutPaymentsInput>;
};
export type SaleUpsertWithoutPaymentsInput = {
    update: Prisma.XOR<Prisma.SaleUpdateWithoutPaymentsInput, Prisma.SaleUncheckedUpdateWithoutPaymentsInput>;
    create: Prisma.XOR<Prisma.SaleCreateWithoutPaymentsInput, Prisma.SaleUncheckedCreateWithoutPaymentsInput>;
    where?: Prisma.SaleWhereInput;
};
export type SaleUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: Prisma.SaleWhereInput;
    data: Prisma.XOR<Prisma.SaleUpdateWithoutPaymentsInput, Prisma.SaleUncheckedUpdateWithoutPaymentsInput>;
};
export type SaleUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutSalesNestedInput;
    customer?: Prisma.CustomerUpdateOneWithoutSalesNestedInput;
    items?: Prisma.SaleItemUpdateManyWithoutSaleNestedInput;
};
export type SaleUncheckedUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.SaleItemUncheckedUpdateManyWithoutSaleNestedInput;
};
export type SaleCreateManyFarmInput = {
    id?: string;
    customerId?: string | null;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SaleUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: Prisma.CustomerUpdateOneWithoutSalesNestedInput;
    items?: Prisma.SaleItemUpdateManyWithoutSaleNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSaleNestedInput;
};
export type SaleUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.SaleItemUncheckedUpdateManyWithoutSaleNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSaleNestedInput;
};
export type SaleUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SaleCreateManyCustomerInput = {
    id?: string;
    farmId: string;
    saleDate: Date | string;
    totalAmount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: $Enums.SaleStatus;
    observation?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SaleUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutSalesNestedInput;
    items?: Prisma.SaleItemUpdateManyWithoutSaleNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutSaleNestedInput;
};
export type SaleUncheckedUpdateWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.SaleItemUncheckedUpdateManyWithoutSaleNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutSaleNestedInput;
};
export type SaleUncheckedUpdateManyWithoutCustomerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    saleDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    totalAmount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    status?: Prisma.EnumSaleStatusFieldUpdateOperationsInput | $Enums.SaleStatus;
    observation?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SaleCountOutputType = {
    items: number;
    payments: number;
};
export type SaleCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    items?: boolean | SaleCountOutputTypeCountItemsArgs;
    payments?: boolean | SaleCountOutputTypeCountPaymentsArgs;
};
export type SaleCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleCountOutputTypeSelect<ExtArgs> | null;
};
export type SaleCountOutputTypeCountItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleItemWhereInput;
};
export type SaleCountOutputTypeCountPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentWhereInput;
};
export type SaleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    customerId?: boolean;
    saleDate?: boolean;
    totalAmount?: boolean;
    status?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.Sale$customerArgs<ExtArgs>;
    items?: boolean | Prisma.Sale$itemsArgs<ExtArgs>;
    payments?: boolean | Prisma.Sale$paymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.SaleCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["sale"]>;
export type SaleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    customerId?: boolean;
    saleDate?: boolean;
    totalAmount?: boolean;
    status?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.Sale$customerArgs<ExtArgs>;
}, ExtArgs["result"]["sale"]>;
export type SaleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    customerId?: boolean;
    saleDate?: boolean;
    totalAmount?: boolean;
    status?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.Sale$customerArgs<ExtArgs>;
}, ExtArgs["result"]["sale"]>;
export type SaleSelectScalar = {
    id?: boolean;
    farmId?: boolean;
    customerId?: boolean;
    saleDate?: boolean;
    totalAmount?: boolean;
    status?: boolean;
    observation?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type SaleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farmId" | "customerId" | "saleDate" | "totalAmount" | "status" | "observation" | "createdAt" | "updatedAt", ExtArgs["result"]["sale"]>;
export type SaleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.Sale$customerArgs<ExtArgs>;
    items?: boolean | Prisma.Sale$itemsArgs<ExtArgs>;
    payments?: boolean | Prisma.Sale$paymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.SaleCountOutputTypeDefaultArgs<ExtArgs>;
};
export type SaleIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.Sale$customerArgs<ExtArgs>;
};
export type SaleIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    customer?: boolean | Prisma.Sale$customerArgs<ExtArgs>;
};
export type $SalePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Sale";
    objects: {
        farm: Prisma.$FarmPayload<ExtArgs>;
        customer: Prisma.$CustomerPayload<ExtArgs> | null;
        items: Prisma.$SaleItemPayload<ExtArgs>[];
        payments: Prisma.$PaymentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farmId: string;
        customerId: string | null;
        saleDate: Date;
        totalAmount: runtime.Decimal;
        status: $Enums.SaleStatus;
        observation: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["sale"]>;
    composites: {};
};
export type SaleGetPayload<S extends boolean | null | undefined | SaleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SalePayload, S>;
export type SaleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SaleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SaleCountAggregateInputType | true;
};
export interface SaleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Sale'];
        meta: {
            name: 'Sale';
        };
    };
    findUnique<T extends SaleFindUniqueArgs>(args: Prisma.SelectSubset<T, SaleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SaleClient<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SaleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SaleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SaleClient<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SaleFindFirstArgs>(args?: Prisma.SelectSubset<T, SaleFindFirstArgs<ExtArgs>>): Prisma.Prisma__SaleClient<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SaleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SaleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SaleClient<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SaleFindManyArgs>(args?: Prisma.SelectSubset<T, SaleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SaleCreateArgs>(args: Prisma.SelectSubset<T, SaleCreateArgs<ExtArgs>>): Prisma.Prisma__SaleClient<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SaleCreateManyArgs>(args?: Prisma.SelectSubset<T, SaleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SaleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SaleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SaleDeleteArgs>(args: Prisma.SelectSubset<T, SaleDeleteArgs<ExtArgs>>): Prisma.Prisma__SaleClient<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SaleUpdateArgs>(args: Prisma.SelectSubset<T, SaleUpdateArgs<ExtArgs>>): Prisma.Prisma__SaleClient<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SaleDeleteManyArgs>(args?: Prisma.SelectSubset<T, SaleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SaleUpdateManyArgs>(args: Prisma.SelectSubset<T, SaleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SaleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SaleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SaleUpsertArgs>(args: Prisma.SelectSubset<T, SaleUpsertArgs<ExtArgs>>): Prisma.Prisma__SaleClient<runtime.Types.Result.GetResult<Prisma.$SalePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SaleCountArgs>(args?: Prisma.Subset<T, SaleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SaleCountAggregateOutputType> : number>;
    aggregate<T extends SaleAggregateArgs>(args: Prisma.Subset<T, SaleAggregateArgs>): Prisma.PrismaPromise<GetSaleAggregateType<T>>;
    groupBy<T extends SaleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SaleGroupByArgs['orderBy'];
    } : {
        orderBy?: SaleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SaleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSaleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SaleFieldRefs;
}
export interface Prisma__SaleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farm<T extends Prisma.FarmDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FarmDefaultArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    customer<T extends Prisma.Sale$customerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Sale$customerArgs<ExtArgs>>): Prisma.Prisma__CustomerClient<runtime.Types.Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    items<T extends Prisma.Sale$itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Sale$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SaleItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    payments<T extends Prisma.Sale$paymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Sale$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SaleFieldRefs {
    readonly id: Prisma.FieldRef<"Sale", 'String'>;
    readonly farmId: Prisma.FieldRef<"Sale", 'String'>;
    readonly customerId: Prisma.FieldRef<"Sale", 'String'>;
    readonly saleDate: Prisma.FieldRef<"Sale", 'DateTime'>;
    readonly totalAmount: Prisma.FieldRef<"Sale", 'Decimal'>;
    readonly status: Prisma.FieldRef<"Sale", 'SaleStatus'>;
    readonly observation: Prisma.FieldRef<"Sale", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Sale", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Sale", 'DateTime'>;
}
export type SaleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelect<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    include?: Prisma.SaleInclude<ExtArgs> | null;
    where: Prisma.SaleWhereUniqueInput;
};
export type SaleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelect<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    include?: Prisma.SaleInclude<ExtArgs> | null;
    where: Prisma.SaleWhereUniqueInput;
};
export type SaleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelect<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    include?: Prisma.SaleInclude<ExtArgs> | null;
    where?: Prisma.SaleWhereInput;
    orderBy?: Prisma.SaleOrderByWithRelationInput | Prisma.SaleOrderByWithRelationInput[];
    cursor?: Prisma.SaleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SaleScalarFieldEnum | Prisma.SaleScalarFieldEnum[];
};
export type SaleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelect<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    include?: Prisma.SaleInclude<ExtArgs> | null;
    where?: Prisma.SaleWhereInput;
    orderBy?: Prisma.SaleOrderByWithRelationInput | Prisma.SaleOrderByWithRelationInput[];
    cursor?: Prisma.SaleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SaleScalarFieldEnum | Prisma.SaleScalarFieldEnum[];
};
export type SaleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelect<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    include?: Prisma.SaleInclude<ExtArgs> | null;
    where?: Prisma.SaleWhereInput;
    orderBy?: Prisma.SaleOrderByWithRelationInput | Prisma.SaleOrderByWithRelationInput[];
    cursor?: Prisma.SaleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SaleScalarFieldEnum | Prisma.SaleScalarFieldEnum[];
};
export type SaleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelect<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    include?: Prisma.SaleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SaleCreateInput, Prisma.SaleUncheckedCreateInput>;
};
export type SaleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SaleCreateManyInput | Prisma.SaleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SaleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    data: Prisma.SaleCreateManyInput | Prisma.SaleCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SaleIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SaleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelect<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    include?: Prisma.SaleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SaleUpdateInput, Prisma.SaleUncheckedUpdateInput>;
    where: Prisma.SaleWhereUniqueInput;
};
export type SaleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SaleUpdateManyMutationInput, Prisma.SaleUncheckedUpdateManyInput>;
    where?: Prisma.SaleWhereInput;
    limit?: number;
};
export type SaleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SaleUpdateManyMutationInput, Prisma.SaleUncheckedUpdateManyInput>;
    where?: Prisma.SaleWhereInput;
    limit?: number;
    include?: Prisma.SaleIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SaleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelect<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    include?: Prisma.SaleInclude<ExtArgs> | null;
    where: Prisma.SaleWhereUniqueInput;
    create: Prisma.XOR<Prisma.SaleCreateInput, Prisma.SaleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SaleUpdateInput, Prisma.SaleUncheckedUpdateInput>;
};
export type SaleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelect<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    include?: Prisma.SaleInclude<ExtArgs> | null;
    where: Prisma.SaleWhereUniqueInput;
};
export type SaleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SaleWhereInput;
    limit?: number;
};
export type Sale$customerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOmit<ExtArgs> | null;
    include?: Prisma.CustomerInclude<ExtArgs> | null;
    where?: Prisma.CustomerWhereInput;
};
export type Sale$itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleItemSelect<ExtArgs> | null;
    omit?: Prisma.SaleItemOmit<ExtArgs> | null;
    include?: Prisma.SaleItemInclude<ExtArgs> | null;
    where?: Prisma.SaleItemWhereInput;
    orderBy?: Prisma.SaleItemOrderByWithRelationInput | Prisma.SaleItemOrderByWithRelationInput[];
    cursor?: Prisma.SaleItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SaleItemScalarFieldEnum | Prisma.SaleItemScalarFieldEnum[];
};
export type Sale$paymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentSelect<ExtArgs> | null;
    omit?: Prisma.PaymentOmit<ExtArgs> | null;
    include?: Prisma.PaymentInclude<ExtArgs> | null;
    where?: Prisma.PaymentWhereInput;
    orderBy?: Prisma.PaymentOrderByWithRelationInput | Prisma.PaymentOrderByWithRelationInput[];
    cursor?: Prisma.PaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentScalarFieldEnum | Prisma.PaymentScalarFieldEnum[];
};
export type SaleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SaleSelect<ExtArgs> | null;
    omit?: Prisma.SaleOmit<ExtArgs> | null;
    include?: Prisma.SaleInclude<ExtArgs> | null;
};
