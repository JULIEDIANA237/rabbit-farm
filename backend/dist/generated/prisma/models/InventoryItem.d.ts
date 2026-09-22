import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type InventoryItemModel = runtime.Types.Result.DefaultSelection<Prisma.$InventoryItemPayload>;
export type AggregateInventoryItem = {
    _count: InventoryItemCountAggregateOutputType | null;
    _avg: InventoryItemAvgAggregateOutputType | null;
    _sum: InventoryItemSumAggregateOutputType | null;
    _min: InventoryItemMinAggregateOutputType | null;
    _max: InventoryItemMaxAggregateOutputType | null;
};
export type InventoryItemAvgAggregateOutputType = {
    currentStock: number | null;
    minimumStock: number | null;
};
export type InventoryItemSumAggregateOutputType = {
    currentStock: number | null;
    minimumStock: number | null;
};
export type InventoryItemMinAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    name: string | null;
    type: $Enums.InventoryItemType | null;
    unit: string | null;
    currentStock: number | null;
    minimumStock: number | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type InventoryItemMaxAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    name: string | null;
    type: $Enums.InventoryItemType | null;
    unit: string | null;
    currentStock: number | null;
    minimumStock: number | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type InventoryItemCountAggregateOutputType = {
    id: number;
    farmId: number;
    name: number;
    type: number;
    unit: number;
    currentStock: number;
    minimumStock: number;
    description: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type InventoryItemAvgAggregateInputType = {
    currentStock?: true;
    minimumStock?: true;
};
export type InventoryItemSumAggregateInputType = {
    currentStock?: true;
    minimumStock?: true;
};
export type InventoryItemMinAggregateInputType = {
    id?: true;
    farmId?: true;
    name?: true;
    type?: true;
    unit?: true;
    currentStock?: true;
    minimumStock?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type InventoryItemMaxAggregateInputType = {
    id?: true;
    farmId?: true;
    name?: true;
    type?: true;
    unit?: true;
    currentStock?: true;
    minimumStock?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type InventoryItemCountAggregateInputType = {
    id?: true;
    farmId?: true;
    name?: true;
    type?: true;
    unit?: true;
    currentStock?: true;
    minimumStock?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type InventoryItemAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryItemWhereInput;
    orderBy?: Prisma.InventoryItemOrderByWithRelationInput | Prisma.InventoryItemOrderByWithRelationInput[];
    cursor?: Prisma.InventoryItemWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | InventoryItemCountAggregateInputType;
    _avg?: InventoryItemAvgAggregateInputType;
    _sum?: InventoryItemSumAggregateInputType;
    _min?: InventoryItemMinAggregateInputType;
    _max?: InventoryItemMaxAggregateInputType;
};
export type GetInventoryItemAggregateType<T extends InventoryItemAggregateArgs> = {
    [P in keyof T & keyof AggregateInventoryItem]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateInventoryItem[P]> : Prisma.GetScalarType<T[P], AggregateInventoryItem[P]>;
};
export type InventoryItemGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryItemWhereInput;
    orderBy?: Prisma.InventoryItemOrderByWithAggregationInput | Prisma.InventoryItemOrderByWithAggregationInput[];
    by: Prisma.InventoryItemScalarFieldEnum[] | Prisma.InventoryItemScalarFieldEnum;
    having?: Prisma.InventoryItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: InventoryItemCountAggregateInputType | true;
    _avg?: InventoryItemAvgAggregateInputType;
    _sum?: InventoryItemSumAggregateInputType;
    _min?: InventoryItemMinAggregateInputType;
    _max?: InventoryItemMaxAggregateInputType;
};
export type InventoryItemGroupByOutputType = {
    id: string;
    farmId: string;
    name: string;
    type: $Enums.InventoryItemType;
    unit: string;
    currentStock: number;
    minimumStock: number | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: InventoryItemCountAggregateOutputType | null;
    _avg: InventoryItemAvgAggregateOutputType | null;
    _sum: InventoryItemSumAggregateOutputType | null;
    _min: InventoryItemMinAggregateOutputType | null;
    _max: InventoryItemMaxAggregateOutputType | null;
};
export type GetInventoryItemGroupByPayload<T extends InventoryItemGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<InventoryItemGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof InventoryItemGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], InventoryItemGroupByOutputType[P]> : Prisma.GetScalarType<T[P], InventoryItemGroupByOutputType[P]>;
}>>;
export type InventoryItemWhereInput = {
    AND?: Prisma.InventoryItemWhereInput | Prisma.InventoryItemWhereInput[];
    OR?: Prisma.InventoryItemWhereInput[];
    NOT?: Prisma.InventoryItemWhereInput | Prisma.InventoryItemWhereInput[];
    id?: Prisma.StringFilter<"InventoryItem"> | string;
    farmId?: Prisma.StringFilter<"InventoryItem"> | string;
    name?: Prisma.StringFilter<"InventoryItem"> | string;
    type?: Prisma.EnumInventoryItemTypeFilter<"InventoryItem"> | $Enums.InventoryItemType;
    unit?: Prisma.StringFilter<"InventoryItem"> | string;
    currentStock?: Prisma.FloatFilter<"InventoryItem"> | number;
    minimumStock?: Prisma.FloatNullableFilter<"InventoryItem"> | number | null;
    description?: Prisma.StringNullableFilter<"InventoryItem"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"InventoryItem"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"InventoryItem"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    movements?: Prisma.StockMovementListRelationFilter;
};
export type InventoryItemOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    farm?: Prisma.FarmOrderByWithRelationInput;
    movements?: Prisma.StockMovementOrderByRelationAggregateInput;
};
export type InventoryItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    farmId_name?: Prisma.InventoryItemFarmIdNameCompoundUniqueInput;
    AND?: Prisma.InventoryItemWhereInput | Prisma.InventoryItemWhereInput[];
    OR?: Prisma.InventoryItemWhereInput[];
    NOT?: Prisma.InventoryItemWhereInput | Prisma.InventoryItemWhereInput[];
    farmId?: Prisma.StringFilter<"InventoryItem"> | string;
    name?: Prisma.StringFilter<"InventoryItem"> | string;
    type?: Prisma.EnumInventoryItemTypeFilter<"InventoryItem"> | $Enums.InventoryItemType;
    unit?: Prisma.StringFilter<"InventoryItem"> | string;
    currentStock?: Prisma.FloatFilter<"InventoryItem"> | number;
    minimumStock?: Prisma.FloatNullableFilter<"InventoryItem"> | number | null;
    description?: Prisma.StringNullableFilter<"InventoryItem"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"InventoryItem"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"InventoryItem"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    movements?: Prisma.StockMovementListRelationFilter;
}, "id" | "farmId_name">;
export type InventoryItemOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.InventoryItemCountOrderByAggregateInput;
    _avg?: Prisma.InventoryItemAvgOrderByAggregateInput;
    _max?: Prisma.InventoryItemMaxOrderByAggregateInput;
    _min?: Prisma.InventoryItemMinOrderByAggregateInput;
    _sum?: Prisma.InventoryItemSumOrderByAggregateInput;
};
export type InventoryItemScalarWhereWithAggregatesInput = {
    AND?: Prisma.InventoryItemScalarWhereWithAggregatesInput | Prisma.InventoryItemScalarWhereWithAggregatesInput[];
    OR?: Prisma.InventoryItemScalarWhereWithAggregatesInput[];
    NOT?: Prisma.InventoryItemScalarWhereWithAggregatesInput | Prisma.InventoryItemScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"InventoryItem"> | string;
    farmId?: Prisma.StringWithAggregatesFilter<"InventoryItem"> | string;
    name?: Prisma.StringWithAggregatesFilter<"InventoryItem"> | string;
    type?: Prisma.EnumInventoryItemTypeWithAggregatesFilter<"InventoryItem"> | $Enums.InventoryItemType;
    unit?: Prisma.StringWithAggregatesFilter<"InventoryItem"> | string;
    currentStock?: Prisma.FloatWithAggregatesFilter<"InventoryItem"> | number;
    minimumStock?: Prisma.FloatNullableWithAggregatesFilter<"InventoryItem"> | number | null;
    description?: Prisma.StringNullableWithAggregatesFilter<"InventoryItem"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"InventoryItem"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"InventoryItem"> | Date | string;
};
export type InventoryItemCreateInput = {
    id?: string;
    name: string;
    type: $Enums.InventoryItemType;
    unit: string;
    currentStock?: number;
    minimumStock?: number | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutInventoryItemsInput;
    movements?: Prisma.StockMovementCreateNestedManyWithoutInventoryItemInput;
};
export type InventoryItemUncheckedCreateInput = {
    id?: string;
    farmId: string;
    name: string;
    type: $Enums.InventoryItemType;
    unit: string;
    currentStock?: number;
    minimumStock?: number | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutInventoryItemInput;
};
export type InventoryItemUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumInventoryItemTypeFieldUpdateOperationsInput | $Enums.InventoryItemType;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    currentStock?: Prisma.FloatFieldUpdateOperationsInput | number;
    minimumStock?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutInventoryItemsNestedInput;
    movements?: Prisma.StockMovementUpdateManyWithoutInventoryItemNestedInput;
};
export type InventoryItemUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumInventoryItemTypeFieldUpdateOperationsInput | $Enums.InventoryItemType;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    currentStock?: Prisma.FloatFieldUpdateOperationsInput | number;
    minimumStock?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movements?: Prisma.StockMovementUncheckedUpdateManyWithoutInventoryItemNestedInput;
};
export type InventoryItemCreateManyInput = {
    id?: string;
    farmId: string;
    name: string;
    type: $Enums.InventoryItemType;
    unit: string;
    currentStock?: number;
    minimumStock?: number | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InventoryItemUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumInventoryItemTypeFieldUpdateOperationsInput | $Enums.InventoryItemType;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    currentStock?: Prisma.FloatFieldUpdateOperationsInput | number;
    minimumStock?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryItemUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumInventoryItemTypeFieldUpdateOperationsInput | $Enums.InventoryItemType;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    currentStock?: Prisma.FloatFieldUpdateOperationsInput | number;
    minimumStock?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryItemListRelationFilter = {
    every?: Prisma.InventoryItemWhereInput;
    some?: Prisma.InventoryItemWhereInput;
    none?: Prisma.InventoryItemWhereInput;
};
export type InventoryItemOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type InventoryItemFarmIdNameCompoundUniqueInput = {
    farmId: string;
    name: string;
};
export type InventoryItemCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InventoryItemAvgOrderByAggregateInput = {
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
};
export type InventoryItemMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InventoryItemMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    unit?: Prisma.SortOrder;
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type InventoryItemSumOrderByAggregateInput = {
    currentStock?: Prisma.SortOrder;
    minimumStock?: Prisma.SortOrder;
};
export type InventoryItemScalarRelationFilter = {
    is?: Prisma.InventoryItemWhereInput;
    isNot?: Prisma.InventoryItemWhereInput;
};
export type InventoryItemCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.InventoryItemCreateWithoutFarmInput, Prisma.InventoryItemUncheckedCreateWithoutFarmInput> | Prisma.InventoryItemCreateWithoutFarmInput[] | Prisma.InventoryItemUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.InventoryItemCreateOrConnectWithoutFarmInput | Prisma.InventoryItemCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.InventoryItemCreateManyFarmInputEnvelope;
    connect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
};
export type InventoryItemUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.InventoryItemCreateWithoutFarmInput, Prisma.InventoryItemUncheckedCreateWithoutFarmInput> | Prisma.InventoryItemCreateWithoutFarmInput[] | Prisma.InventoryItemUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.InventoryItemCreateOrConnectWithoutFarmInput | Prisma.InventoryItemCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.InventoryItemCreateManyFarmInputEnvelope;
    connect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
};
export type InventoryItemUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.InventoryItemCreateWithoutFarmInput, Prisma.InventoryItemUncheckedCreateWithoutFarmInput> | Prisma.InventoryItemCreateWithoutFarmInput[] | Prisma.InventoryItemUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.InventoryItemCreateOrConnectWithoutFarmInput | Prisma.InventoryItemCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.InventoryItemUpsertWithWhereUniqueWithoutFarmInput | Prisma.InventoryItemUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.InventoryItemCreateManyFarmInputEnvelope;
    set?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    disconnect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    delete?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    connect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    update?: Prisma.InventoryItemUpdateWithWhereUniqueWithoutFarmInput | Prisma.InventoryItemUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.InventoryItemUpdateManyWithWhereWithoutFarmInput | Prisma.InventoryItemUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.InventoryItemScalarWhereInput | Prisma.InventoryItemScalarWhereInput[];
};
export type InventoryItemUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.InventoryItemCreateWithoutFarmInput, Prisma.InventoryItemUncheckedCreateWithoutFarmInput> | Prisma.InventoryItemCreateWithoutFarmInput[] | Prisma.InventoryItemUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.InventoryItemCreateOrConnectWithoutFarmInput | Prisma.InventoryItemCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.InventoryItemUpsertWithWhereUniqueWithoutFarmInput | Prisma.InventoryItemUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.InventoryItemCreateManyFarmInputEnvelope;
    set?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    disconnect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    delete?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    connect?: Prisma.InventoryItemWhereUniqueInput | Prisma.InventoryItemWhereUniqueInput[];
    update?: Prisma.InventoryItemUpdateWithWhereUniqueWithoutFarmInput | Prisma.InventoryItemUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.InventoryItemUpdateManyWithWhereWithoutFarmInput | Prisma.InventoryItemUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.InventoryItemScalarWhereInput | Prisma.InventoryItemScalarWhereInput[];
};
export type EnumInventoryItemTypeFieldUpdateOperationsInput = {
    set?: $Enums.InventoryItemType;
};
export type InventoryItemCreateNestedOneWithoutMovementsInput = {
    create?: Prisma.XOR<Prisma.InventoryItemCreateWithoutMovementsInput, Prisma.InventoryItemUncheckedCreateWithoutMovementsInput>;
    connectOrCreate?: Prisma.InventoryItemCreateOrConnectWithoutMovementsInput;
    connect?: Prisma.InventoryItemWhereUniqueInput;
};
export type InventoryItemUpdateOneRequiredWithoutMovementsNestedInput = {
    create?: Prisma.XOR<Prisma.InventoryItemCreateWithoutMovementsInput, Prisma.InventoryItemUncheckedCreateWithoutMovementsInput>;
    connectOrCreate?: Prisma.InventoryItemCreateOrConnectWithoutMovementsInput;
    upsert?: Prisma.InventoryItemUpsertWithoutMovementsInput;
    connect?: Prisma.InventoryItemWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.InventoryItemUpdateToOneWithWhereWithoutMovementsInput, Prisma.InventoryItemUpdateWithoutMovementsInput>, Prisma.InventoryItemUncheckedUpdateWithoutMovementsInput>;
};
export type InventoryItemCreateWithoutFarmInput = {
    id?: string;
    name: string;
    type: $Enums.InventoryItemType;
    unit: string;
    currentStock?: number;
    minimumStock?: number | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movements?: Prisma.StockMovementCreateNestedManyWithoutInventoryItemInput;
};
export type InventoryItemUncheckedCreateWithoutFarmInput = {
    id?: string;
    name: string;
    type: $Enums.InventoryItemType;
    unit: string;
    currentStock?: number;
    minimumStock?: number | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movements?: Prisma.StockMovementUncheckedCreateNestedManyWithoutInventoryItemInput;
};
export type InventoryItemCreateOrConnectWithoutFarmInput = {
    where: Prisma.InventoryItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.InventoryItemCreateWithoutFarmInput, Prisma.InventoryItemUncheckedCreateWithoutFarmInput>;
};
export type InventoryItemCreateManyFarmInputEnvelope = {
    data: Prisma.InventoryItemCreateManyFarmInput | Prisma.InventoryItemCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type InventoryItemUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.InventoryItemWhereUniqueInput;
    update: Prisma.XOR<Prisma.InventoryItemUpdateWithoutFarmInput, Prisma.InventoryItemUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.InventoryItemCreateWithoutFarmInput, Prisma.InventoryItemUncheckedCreateWithoutFarmInput>;
};
export type InventoryItemUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.InventoryItemWhereUniqueInput;
    data: Prisma.XOR<Prisma.InventoryItemUpdateWithoutFarmInput, Prisma.InventoryItemUncheckedUpdateWithoutFarmInput>;
};
export type InventoryItemUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.InventoryItemScalarWhereInput;
    data: Prisma.XOR<Prisma.InventoryItemUpdateManyMutationInput, Prisma.InventoryItemUncheckedUpdateManyWithoutFarmInput>;
};
export type InventoryItemScalarWhereInput = {
    AND?: Prisma.InventoryItemScalarWhereInput | Prisma.InventoryItemScalarWhereInput[];
    OR?: Prisma.InventoryItemScalarWhereInput[];
    NOT?: Prisma.InventoryItemScalarWhereInput | Prisma.InventoryItemScalarWhereInput[];
    id?: Prisma.StringFilter<"InventoryItem"> | string;
    farmId?: Prisma.StringFilter<"InventoryItem"> | string;
    name?: Prisma.StringFilter<"InventoryItem"> | string;
    type?: Prisma.EnumInventoryItemTypeFilter<"InventoryItem"> | $Enums.InventoryItemType;
    unit?: Prisma.StringFilter<"InventoryItem"> | string;
    currentStock?: Prisma.FloatFilter<"InventoryItem"> | number;
    minimumStock?: Prisma.FloatNullableFilter<"InventoryItem"> | number | null;
    description?: Prisma.StringNullableFilter<"InventoryItem"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"InventoryItem"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"InventoryItem"> | Date | string;
};
export type InventoryItemCreateWithoutMovementsInput = {
    id?: string;
    name: string;
    type: $Enums.InventoryItemType;
    unit: string;
    currentStock?: number;
    minimumStock?: number | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutInventoryItemsInput;
};
export type InventoryItemUncheckedCreateWithoutMovementsInput = {
    id?: string;
    farmId: string;
    name: string;
    type: $Enums.InventoryItemType;
    unit: string;
    currentStock?: number;
    minimumStock?: number | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InventoryItemCreateOrConnectWithoutMovementsInput = {
    where: Prisma.InventoryItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.InventoryItemCreateWithoutMovementsInput, Prisma.InventoryItemUncheckedCreateWithoutMovementsInput>;
};
export type InventoryItemUpsertWithoutMovementsInput = {
    update: Prisma.XOR<Prisma.InventoryItemUpdateWithoutMovementsInput, Prisma.InventoryItemUncheckedUpdateWithoutMovementsInput>;
    create: Prisma.XOR<Prisma.InventoryItemCreateWithoutMovementsInput, Prisma.InventoryItemUncheckedCreateWithoutMovementsInput>;
    where?: Prisma.InventoryItemWhereInput;
};
export type InventoryItemUpdateToOneWithWhereWithoutMovementsInput = {
    where?: Prisma.InventoryItemWhereInput;
    data: Prisma.XOR<Prisma.InventoryItemUpdateWithoutMovementsInput, Prisma.InventoryItemUncheckedUpdateWithoutMovementsInput>;
};
export type InventoryItemUpdateWithoutMovementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumInventoryItemTypeFieldUpdateOperationsInput | $Enums.InventoryItemType;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    currentStock?: Prisma.FloatFieldUpdateOperationsInput | number;
    minimumStock?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutInventoryItemsNestedInput;
};
export type InventoryItemUncheckedUpdateWithoutMovementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumInventoryItemTypeFieldUpdateOperationsInput | $Enums.InventoryItemType;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    currentStock?: Prisma.FloatFieldUpdateOperationsInput | number;
    minimumStock?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryItemCreateManyFarmInput = {
    id?: string;
    name: string;
    type: $Enums.InventoryItemType;
    unit: string;
    currentStock?: number;
    minimumStock?: number | null;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type InventoryItemUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumInventoryItemTypeFieldUpdateOperationsInput | $Enums.InventoryItemType;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    currentStock?: Prisma.FloatFieldUpdateOperationsInput | number;
    minimumStock?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movements?: Prisma.StockMovementUpdateManyWithoutInventoryItemNestedInput;
};
export type InventoryItemUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumInventoryItemTypeFieldUpdateOperationsInput | $Enums.InventoryItemType;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    currentStock?: Prisma.FloatFieldUpdateOperationsInput | number;
    minimumStock?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movements?: Prisma.StockMovementUncheckedUpdateManyWithoutInventoryItemNestedInput;
};
export type InventoryItemUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.EnumInventoryItemTypeFieldUpdateOperationsInput | $Enums.InventoryItemType;
    unit?: Prisma.StringFieldUpdateOperationsInput | string;
    currentStock?: Prisma.FloatFieldUpdateOperationsInput | number;
    minimumStock?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type InventoryItemCountOutputType = {
    movements: number;
};
export type InventoryItemCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    movements?: boolean | InventoryItemCountOutputTypeCountMovementsArgs;
};
export type InventoryItemCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemCountOutputTypeSelect<ExtArgs> | null;
};
export type InventoryItemCountOutputTypeCountMovementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StockMovementWhereInput;
};
export type InventoryItemSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    type?: boolean;
    unit?: boolean;
    currentStock?: boolean;
    minimumStock?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    movements?: boolean | Prisma.InventoryItem$movementsArgs<ExtArgs>;
    _count?: boolean | Prisma.InventoryItemCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryItem"]>;
export type InventoryItemSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    type?: boolean;
    unit?: boolean;
    currentStock?: boolean;
    minimumStock?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryItem"]>;
export type InventoryItemSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    type?: boolean;
    unit?: boolean;
    currentStock?: boolean;
    minimumStock?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["inventoryItem"]>;
export type InventoryItemSelectScalar = {
    id?: boolean;
    farmId?: boolean;
    name?: boolean;
    type?: boolean;
    unit?: boolean;
    currentStock?: boolean;
    minimumStock?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type InventoryItemOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farmId" | "name" | "type" | "unit" | "currentStock" | "minimumStock" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["inventoryItem"]>;
export type InventoryItemInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    movements?: boolean | Prisma.InventoryItem$movementsArgs<ExtArgs>;
    _count?: boolean | Prisma.InventoryItemCountOutputTypeDefaultArgs<ExtArgs>;
};
export type InventoryItemIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
};
export type InventoryItemIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
};
export type $InventoryItemPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "InventoryItem";
    objects: {
        farm: Prisma.$FarmPayload<ExtArgs>;
        movements: Prisma.$StockMovementPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farmId: string;
        name: string;
        type: $Enums.InventoryItemType;
        unit: string;
        currentStock: number;
        minimumStock: number | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["inventoryItem"]>;
    composites: {};
};
export type InventoryItemGetPayload<S extends boolean | null | undefined | InventoryItemDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload, S>;
export type InventoryItemCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<InventoryItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: InventoryItemCountAggregateInputType | true;
};
export interface InventoryItemDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['InventoryItem'];
        meta: {
            name: 'InventoryItem';
        };
    };
    findUnique<T extends InventoryItemFindUniqueArgs>(args: Prisma.SelectSubset<T, InventoryItemFindUniqueArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends InventoryItemFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, InventoryItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends InventoryItemFindFirstArgs>(args?: Prisma.SelectSubset<T, InventoryItemFindFirstArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends InventoryItemFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, InventoryItemFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends InventoryItemFindManyArgs>(args?: Prisma.SelectSubset<T, InventoryItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends InventoryItemCreateArgs>(args: Prisma.SelectSubset<T, InventoryItemCreateArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends InventoryItemCreateManyArgs>(args?: Prisma.SelectSubset<T, InventoryItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends InventoryItemCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, InventoryItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends InventoryItemDeleteArgs>(args: Prisma.SelectSubset<T, InventoryItemDeleteArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends InventoryItemUpdateArgs>(args: Prisma.SelectSubset<T, InventoryItemUpdateArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends InventoryItemDeleteManyArgs>(args?: Prisma.SelectSubset<T, InventoryItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends InventoryItemUpdateManyArgs>(args: Prisma.SelectSubset<T, InventoryItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends InventoryItemUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, InventoryItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends InventoryItemUpsertArgs>(args: Prisma.SelectSubset<T, InventoryItemUpsertArgs<ExtArgs>>): Prisma.Prisma__InventoryItemClient<runtime.Types.Result.GetResult<Prisma.$InventoryItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends InventoryItemCountArgs>(args?: Prisma.Subset<T, InventoryItemCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], InventoryItemCountAggregateOutputType> : number>;
    aggregate<T extends InventoryItemAggregateArgs>(args: Prisma.Subset<T, InventoryItemAggregateArgs>): Prisma.PrismaPromise<GetInventoryItemAggregateType<T>>;
    groupBy<T extends InventoryItemGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: InventoryItemGroupByArgs['orderBy'];
    } : {
        orderBy?: InventoryItemGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, InventoryItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: InventoryItemFieldRefs;
}
export interface Prisma__InventoryItemClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farm<T extends Prisma.FarmDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FarmDefaultArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    movements<T extends Prisma.InventoryItem$movementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.InventoryItem$movementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StockMovementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface InventoryItemFieldRefs {
    readonly id: Prisma.FieldRef<"InventoryItem", 'String'>;
    readonly farmId: Prisma.FieldRef<"InventoryItem", 'String'>;
    readonly name: Prisma.FieldRef<"InventoryItem", 'String'>;
    readonly type: Prisma.FieldRef<"InventoryItem", 'InventoryItemType'>;
    readonly unit: Prisma.FieldRef<"InventoryItem", 'String'>;
    readonly currentStock: Prisma.FieldRef<"InventoryItem", 'Float'>;
    readonly minimumStock: Prisma.FieldRef<"InventoryItem", 'Float'>;
    readonly description: Prisma.FieldRef<"InventoryItem", 'String'>;
    readonly createdAt: Prisma.FieldRef<"InventoryItem", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"InventoryItem", 'DateTime'>;
}
export type InventoryItemFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelect<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    include?: Prisma.InventoryItemInclude<ExtArgs> | null;
    where: Prisma.InventoryItemWhereUniqueInput;
};
export type InventoryItemFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelect<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    include?: Prisma.InventoryItemInclude<ExtArgs> | null;
    where: Prisma.InventoryItemWhereUniqueInput;
};
export type InventoryItemFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelect<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    include?: Prisma.InventoryItemInclude<ExtArgs> | null;
    where?: Prisma.InventoryItemWhereInput;
    orderBy?: Prisma.InventoryItemOrderByWithRelationInput | Prisma.InventoryItemOrderByWithRelationInput[];
    cursor?: Prisma.InventoryItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InventoryItemScalarFieldEnum | Prisma.InventoryItemScalarFieldEnum[];
};
export type InventoryItemFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelect<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    include?: Prisma.InventoryItemInclude<ExtArgs> | null;
    where?: Prisma.InventoryItemWhereInput;
    orderBy?: Prisma.InventoryItemOrderByWithRelationInput | Prisma.InventoryItemOrderByWithRelationInput[];
    cursor?: Prisma.InventoryItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InventoryItemScalarFieldEnum | Prisma.InventoryItemScalarFieldEnum[];
};
export type InventoryItemFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelect<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    include?: Prisma.InventoryItemInclude<ExtArgs> | null;
    where?: Prisma.InventoryItemWhereInput;
    orderBy?: Prisma.InventoryItemOrderByWithRelationInput | Prisma.InventoryItemOrderByWithRelationInput[];
    cursor?: Prisma.InventoryItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InventoryItemScalarFieldEnum | Prisma.InventoryItemScalarFieldEnum[];
};
export type InventoryItemCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelect<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    include?: Prisma.InventoryItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InventoryItemCreateInput, Prisma.InventoryItemUncheckedCreateInput>;
};
export type InventoryItemCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.InventoryItemCreateManyInput | Prisma.InventoryItemCreateManyInput[];
    skipDuplicates?: boolean;
};
export type InventoryItemCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    data: Prisma.InventoryItemCreateManyInput | Prisma.InventoryItemCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.InventoryItemIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type InventoryItemUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelect<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    include?: Prisma.InventoryItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InventoryItemUpdateInput, Prisma.InventoryItemUncheckedUpdateInput>;
    where: Prisma.InventoryItemWhereUniqueInput;
};
export type InventoryItemUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.InventoryItemUpdateManyMutationInput, Prisma.InventoryItemUncheckedUpdateManyInput>;
    where?: Prisma.InventoryItemWhereInput;
    limit?: number;
};
export type InventoryItemUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.InventoryItemUpdateManyMutationInput, Prisma.InventoryItemUncheckedUpdateManyInput>;
    where?: Prisma.InventoryItemWhereInput;
    limit?: number;
    include?: Prisma.InventoryItemIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type InventoryItemUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelect<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    include?: Prisma.InventoryItemInclude<ExtArgs> | null;
    where: Prisma.InventoryItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.InventoryItemCreateInput, Prisma.InventoryItemUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.InventoryItemUpdateInput, Prisma.InventoryItemUncheckedUpdateInput>;
};
export type InventoryItemDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelect<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    include?: Prisma.InventoryItemInclude<ExtArgs> | null;
    where: Prisma.InventoryItemWhereUniqueInput;
};
export type InventoryItemDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InventoryItemWhereInput;
    limit?: number;
};
export type InventoryItem$movementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StockMovementSelect<ExtArgs> | null;
    omit?: Prisma.StockMovementOmit<ExtArgs> | null;
    include?: Prisma.StockMovementInclude<ExtArgs> | null;
    where?: Prisma.StockMovementWhereInput;
    orderBy?: Prisma.StockMovementOrderByWithRelationInput | Prisma.StockMovementOrderByWithRelationInput[];
    cursor?: Prisma.StockMovementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StockMovementScalarFieldEnum | Prisma.StockMovementScalarFieldEnum[];
};
export type InventoryItemDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.InventoryItemSelect<ExtArgs> | null;
    omit?: Prisma.InventoryItemOmit<ExtArgs> | null;
    include?: Prisma.InventoryItemInclude<ExtArgs> | null;
};
