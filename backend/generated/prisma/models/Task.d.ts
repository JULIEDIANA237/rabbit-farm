import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TaskModel = runtime.Types.Result.DefaultSelection<Prisma.$TaskPayload>;
export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null;
    _min: TaskMinAggregateOutputType | null;
    _max: TaskMaxAggregateOutputType | null;
};
export type TaskMinAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    title: string | null;
    description: string | null;
    dueDate: Date | null;
    priority: $Enums.TaskPriority | null;
    status: $Enums.TaskStatus | null;
    assignedToId: string | null;
    sourceType: string | null;
    sourceId: string | null;
    completedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TaskMaxAggregateOutputType = {
    id: string | null;
    farmId: string | null;
    title: string | null;
    description: string | null;
    dueDate: Date | null;
    priority: $Enums.TaskPriority | null;
    status: $Enums.TaskStatus | null;
    assignedToId: string | null;
    sourceType: string | null;
    sourceId: string | null;
    completedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TaskCountAggregateOutputType = {
    id: number;
    farmId: number;
    title: number;
    description: number;
    dueDate: number;
    priority: number;
    status: number;
    assignedToId: number;
    sourceType: number;
    sourceId: number;
    completedAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type TaskMinAggregateInputType = {
    id?: true;
    farmId?: true;
    title?: true;
    description?: true;
    dueDate?: true;
    priority?: true;
    status?: true;
    assignedToId?: true;
    sourceType?: true;
    sourceId?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TaskMaxAggregateInputType = {
    id?: true;
    farmId?: true;
    title?: true;
    description?: true;
    dueDate?: true;
    priority?: true;
    status?: true;
    assignedToId?: true;
    sourceType?: true;
    sourceId?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TaskCountAggregateInputType = {
    id?: true;
    farmId?: true;
    title?: true;
    description?: true;
    dueDate?: true;
    priority?: true;
    status?: true;
    assignedToId?: true;
    sourceType?: true;
    sourceId?: true;
    completedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TaskAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput | Prisma.TaskOrderByWithRelationInput[];
    cursor?: Prisma.TaskWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TaskCountAggregateInputType;
    _min?: TaskMinAggregateInputType;
    _max?: TaskMaxAggregateInputType;
};
export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
    [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTask[P]> : Prisma.GetScalarType<T[P], AggregateTask[P]>;
};
export type TaskGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithAggregationInput | Prisma.TaskOrderByWithAggregationInput[];
    by: Prisma.TaskScalarFieldEnum[] | Prisma.TaskScalarFieldEnum;
    having?: Prisma.TaskScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TaskCountAggregateInputType | true;
    _min?: TaskMinAggregateInputType;
    _max?: TaskMaxAggregateInputType;
};
export type TaskGroupByOutputType = {
    id: string;
    farmId: string;
    title: string;
    description: string | null;
    dueDate: Date;
    priority: $Enums.TaskPriority;
    status: $Enums.TaskStatus;
    assignedToId: string | null;
    sourceType: string | null;
    sourceId: string | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: TaskCountAggregateOutputType | null;
    _min: TaskMinAggregateOutputType | null;
    _max: TaskMaxAggregateOutputType | null;
};
export type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TaskGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TaskGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TaskGroupByOutputType[P]>;
}>>;
export type TaskWhereInput = {
    AND?: Prisma.TaskWhereInput | Prisma.TaskWhereInput[];
    OR?: Prisma.TaskWhereInput[];
    NOT?: Prisma.TaskWhereInput | Prisma.TaskWhereInput[];
    id?: Prisma.StringFilter<"Task"> | string;
    farmId?: Prisma.StringFilter<"Task"> | string;
    title?: Prisma.StringFilter<"Task"> | string;
    description?: Prisma.StringNullableFilter<"Task"> | string | null;
    dueDate?: Prisma.DateTimeFilter<"Task"> | Date | string;
    priority?: Prisma.EnumTaskPriorityFilter<"Task"> | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus;
    assignedToId?: Prisma.StringNullableFilter<"Task"> | string | null;
    sourceType?: Prisma.StringNullableFilter<"Task"> | string | null;
    sourceId?: Prisma.StringNullableFilter<"Task"> | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"Task"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Task"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Task"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    assignedTo?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
};
export type TaskOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    dueDate?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedToId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceType?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceId?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    farm?: Prisma.FarmOrderByWithRelationInput;
    assignedTo?: Prisma.UserOrderByWithRelationInput;
};
export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.TaskWhereInput | Prisma.TaskWhereInput[];
    OR?: Prisma.TaskWhereInput[];
    NOT?: Prisma.TaskWhereInput | Prisma.TaskWhereInput[];
    farmId?: Prisma.StringFilter<"Task"> | string;
    title?: Prisma.StringFilter<"Task"> | string;
    description?: Prisma.StringNullableFilter<"Task"> | string | null;
    dueDate?: Prisma.DateTimeFilter<"Task"> | Date | string;
    priority?: Prisma.EnumTaskPriorityFilter<"Task"> | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus;
    assignedToId?: Prisma.StringNullableFilter<"Task"> | string | null;
    sourceType?: Prisma.StringNullableFilter<"Task"> | string | null;
    sourceId?: Prisma.StringNullableFilter<"Task"> | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"Task"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Task"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Task"> | Date | string;
    farm?: Prisma.XOR<Prisma.FarmScalarRelationFilter, Prisma.FarmWhereInput>;
    assignedTo?: Prisma.XOR<Prisma.UserNullableScalarRelationFilter, Prisma.UserWhereInput> | null;
}, "id">;
export type TaskOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    dueDate?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedToId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceType?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceId?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TaskCountOrderByAggregateInput;
    _max?: Prisma.TaskMaxOrderByAggregateInput;
    _min?: Prisma.TaskMinOrderByAggregateInput;
};
export type TaskScalarWhereWithAggregatesInput = {
    AND?: Prisma.TaskScalarWhereWithAggregatesInput | Prisma.TaskScalarWhereWithAggregatesInput[];
    OR?: Prisma.TaskScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TaskScalarWhereWithAggregatesInput | Prisma.TaskScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Task"> | string;
    farmId?: Prisma.StringWithAggregatesFilter<"Task"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Task"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Task"> | string | null;
    dueDate?: Prisma.DateTimeWithAggregatesFilter<"Task"> | Date | string;
    priority?: Prisma.EnumTaskPriorityWithAggregatesFilter<"Task"> | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusWithAggregatesFilter<"Task"> | $Enums.TaskStatus;
    assignedToId?: Prisma.StringNullableWithAggregatesFilter<"Task"> | string | null;
    sourceType?: Prisma.StringNullableWithAggregatesFilter<"Task"> | string | null;
    sourceId?: Prisma.StringNullableWithAggregatesFilter<"Task"> | string | null;
    completedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Task"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Task"> | Date | string;
};
export type TaskCreateInput = {
    id?: string;
    title: string;
    description?: string | null;
    dueDate: Date | string;
    priority?: $Enums.TaskPriority;
    status?: $Enums.TaskStatus;
    sourceType?: string | null;
    sourceId?: string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutTasksInput;
    assignedTo?: Prisma.UserCreateNestedOneWithoutAssignedTasksInput;
};
export type TaskUncheckedCreateInput = {
    id?: string;
    farmId: string;
    title: string;
    description?: string | null;
    dueDate: Date | string;
    priority?: $Enums.TaskPriority;
    status?: $Enums.TaskStatus;
    assignedToId?: string | null;
    sourceType?: string | null;
    sourceId?: string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    priority?: Prisma.EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    sourceType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutTasksNestedInput;
    assignedTo?: Prisma.UserUpdateOneWithoutAssignedTasksNestedInput;
};
export type TaskUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    priority?: Prisma.EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    assignedToId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskCreateManyInput = {
    id?: string;
    farmId: string;
    title: string;
    description?: string | null;
    dueDate: Date | string;
    priority?: $Enums.TaskPriority;
    status?: $Enums.TaskStatus;
    assignedToId?: string | null;
    sourceType?: string | null;
    sourceId?: string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    priority?: Prisma.EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    sourceType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    priority?: Prisma.EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    assignedToId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskListRelationFilter = {
    every?: Prisma.TaskWhereInput;
    some?: Prisma.TaskWhereInput;
    none?: Prisma.TaskWhereInput;
};
export type TaskOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type TaskCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedToId?: Prisma.SortOrder;
    sourceType?: Prisma.SortOrder;
    sourceId?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TaskMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedToId?: Prisma.SortOrder;
    sourceType?: Prisma.SortOrder;
    sourceId?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TaskMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    farmId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    dueDate?: Prisma.SortOrder;
    priority?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedToId?: Prisma.SortOrder;
    sourceType?: Prisma.SortOrder;
    sourceId?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TaskCreateNestedManyWithoutAssignedToInput = {
    create?: Prisma.XOR<Prisma.TaskCreateWithoutAssignedToInput, Prisma.TaskUncheckedCreateWithoutAssignedToInput> | Prisma.TaskCreateWithoutAssignedToInput[] | Prisma.TaskUncheckedCreateWithoutAssignedToInput[];
    connectOrCreate?: Prisma.TaskCreateOrConnectWithoutAssignedToInput | Prisma.TaskCreateOrConnectWithoutAssignedToInput[];
    createMany?: Prisma.TaskCreateManyAssignedToInputEnvelope;
    connect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
};
export type TaskUncheckedCreateNestedManyWithoutAssignedToInput = {
    create?: Prisma.XOR<Prisma.TaskCreateWithoutAssignedToInput, Prisma.TaskUncheckedCreateWithoutAssignedToInput> | Prisma.TaskCreateWithoutAssignedToInput[] | Prisma.TaskUncheckedCreateWithoutAssignedToInput[];
    connectOrCreate?: Prisma.TaskCreateOrConnectWithoutAssignedToInput | Prisma.TaskCreateOrConnectWithoutAssignedToInput[];
    createMany?: Prisma.TaskCreateManyAssignedToInputEnvelope;
    connect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
};
export type TaskUpdateManyWithoutAssignedToNestedInput = {
    create?: Prisma.XOR<Prisma.TaskCreateWithoutAssignedToInput, Prisma.TaskUncheckedCreateWithoutAssignedToInput> | Prisma.TaskCreateWithoutAssignedToInput[] | Prisma.TaskUncheckedCreateWithoutAssignedToInput[];
    connectOrCreate?: Prisma.TaskCreateOrConnectWithoutAssignedToInput | Prisma.TaskCreateOrConnectWithoutAssignedToInput[];
    upsert?: Prisma.TaskUpsertWithWhereUniqueWithoutAssignedToInput | Prisma.TaskUpsertWithWhereUniqueWithoutAssignedToInput[];
    createMany?: Prisma.TaskCreateManyAssignedToInputEnvelope;
    set?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    disconnect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    delete?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    connect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    update?: Prisma.TaskUpdateWithWhereUniqueWithoutAssignedToInput | Prisma.TaskUpdateWithWhereUniqueWithoutAssignedToInput[];
    updateMany?: Prisma.TaskUpdateManyWithWhereWithoutAssignedToInput | Prisma.TaskUpdateManyWithWhereWithoutAssignedToInput[];
    deleteMany?: Prisma.TaskScalarWhereInput | Prisma.TaskScalarWhereInput[];
};
export type TaskUncheckedUpdateManyWithoutAssignedToNestedInput = {
    create?: Prisma.XOR<Prisma.TaskCreateWithoutAssignedToInput, Prisma.TaskUncheckedCreateWithoutAssignedToInput> | Prisma.TaskCreateWithoutAssignedToInput[] | Prisma.TaskUncheckedCreateWithoutAssignedToInput[];
    connectOrCreate?: Prisma.TaskCreateOrConnectWithoutAssignedToInput | Prisma.TaskCreateOrConnectWithoutAssignedToInput[];
    upsert?: Prisma.TaskUpsertWithWhereUniqueWithoutAssignedToInput | Prisma.TaskUpsertWithWhereUniqueWithoutAssignedToInput[];
    createMany?: Prisma.TaskCreateManyAssignedToInputEnvelope;
    set?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    disconnect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    delete?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    connect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    update?: Prisma.TaskUpdateWithWhereUniqueWithoutAssignedToInput | Prisma.TaskUpdateWithWhereUniqueWithoutAssignedToInput[];
    updateMany?: Prisma.TaskUpdateManyWithWhereWithoutAssignedToInput | Prisma.TaskUpdateManyWithWhereWithoutAssignedToInput[];
    deleteMany?: Prisma.TaskScalarWhereInput | Prisma.TaskScalarWhereInput[];
};
export type TaskCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.TaskCreateWithoutFarmInput, Prisma.TaskUncheckedCreateWithoutFarmInput> | Prisma.TaskCreateWithoutFarmInput[] | Prisma.TaskUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.TaskCreateOrConnectWithoutFarmInput | Prisma.TaskCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.TaskCreateManyFarmInputEnvelope;
    connect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
};
export type TaskUncheckedCreateNestedManyWithoutFarmInput = {
    create?: Prisma.XOR<Prisma.TaskCreateWithoutFarmInput, Prisma.TaskUncheckedCreateWithoutFarmInput> | Prisma.TaskCreateWithoutFarmInput[] | Prisma.TaskUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.TaskCreateOrConnectWithoutFarmInput | Prisma.TaskCreateOrConnectWithoutFarmInput[];
    createMany?: Prisma.TaskCreateManyFarmInputEnvelope;
    connect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
};
export type TaskUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.TaskCreateWithoutFarmInput, Prisma.TaskUncheckedCreateWithoutFarmInput> | Prisma.TaskCreateWithoutFarmInput[] | Prisma.TaskUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.TaskCreateOrConnectWithoutFarmInput | Prisma.TaskCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.TaskUpsertWithWhereUniqueWithoutFarmInput | Prisma.TaskUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.TaskCreateManyFarmInputEnvelope;
    set?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    disconnect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    delete?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    connect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    update?: Prisma.TaskUpdateWithWhereUniqueWithoutFarmInput | Prisma.TaskUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.TaskUpdateManyWithWhereWithoutFarmInput | Prisma.TaskUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.TaskScalarWhereInput | Prisma.TaskScalarWhereInput[];
};
export type TaskUncheckedUpdateManyWithoutFarmNestedInput = {
    create?: Prisma.XOR<Prisma.TaskCreateWithoutFarmInput, Prisma.TaskUncheckedCreateWithoutFarmInput> | Prisma.TaskCreateWithoutFarmInput[] | Prisma.TaskUncheckedCreateWithoutFarmInput[];
    connectOrCreate?: Prisma.TaskCreateOrConnectWithoutFarmInput | Prisma.TaskCreateOrConnectWithoutFarmInput[];
    upsert?: Prisma.TaskUpsertWithWhereUniqueWithoutFarmInput | Prisma.TaskUpsertWithWhereUniqueWithoutFarmInput[];
    createMany?: Prisma.TaskCreateManyFarmInputEnvelope;
    set?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    disconnect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    delete?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    connect?: Prisma.TaskWhereUniqueInput | Prisma.TaskWhereUniqueInput[];
    update?: Prisma.TaskUpdateWithWhereUniqueWithoutFarmInput | Prisma.TaskUpdateWithWhereUniqueWithoutFarmInput[];
    updateMany?: Prisma.TaskUpdateManyWithWhereWithoutFarmInput | Prisma.TaskUpdateManyWithWhereWithoutFarmInput[];
    deleteMany?: Prisma.TaskScalarWhereInput | Prisma.TaskScalarWhereInput[];
};
export type EnumTaskPriorityFieldUpdateOperationsInput = {
    set?: $Enums.TaskPriority;
};
export type EnumTaskStatusFieldUpdateOperationsInput = {
    set?: $Enums.TaskStatus;
};
export type TaskCreateWithoutAssignedToInput = {
    id?: string;
    title: string;
    description?: string | null;
    dueDate: Date | string;
    priority?: $Enums.TaskPriority;
    status?: $Enums.TaskStatus;
    sourceType?: string | null;
    sourceId?: string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    farm: Prisma.FarmCreateNestedOneWithoutTasksInput;
};
export type TaskUncheckedCreateWithoutAssignedToInput = {
    id?: string;
    farmId: string;
    title: string;
    description?: string | null;
    dueDate: Date | string;
    priority?: $Enums.TaskPriority;
    status?: $Enums.TaskStatus;
    sourceType?: string | null;
    sourceId?: string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskCreateOrConnectWithoutAssignedToInput = {
    where: Prisma.TaskWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskCreateWithoutAssignedToInput, Prisma.TaskUncheckedCreateWithoutAssignedToInput>;
};
export type TaskCreateManyAssignedToInputEnvelope = {
    data: Prisma.TaskCreateManyAssignedToInput | Prisma.TaskCreateManyAssignedToInput[];
    skipDuplicates?: boolean;
};
export type TaskUpsertWithWhereUniqueWithoutAssignedToInput = {
    where: Prisma.TaskWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskUpdateWithoutAssignedToInput, Prisma.TaskUncheckedUpdateWithoutAssignedToInput>;
    create: Prisma.XOR<Prisma.TaskCreateWithoutAssignedToInput, Prisma.TaskUncheckedCreateWithoutAssignedToInput>;
};
export type TaskUpdateWithWhereUniqueWithoutAssignedToInput = {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskUpdateWithoutAssignedToInput, Prisma.TaskUncheckedUpdateWithoutAssignedToInput>;
};
export type TaskUpdateManyWithWhereWithoutAssignedToInput = {
    where: Prisma.TaskScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskUpdateManyMutationInput, Prisma.TaskUncheckedUpdateManyWithoutAssignedToInput>;
};
export type TaskScalarWhereInput = {
    AND?: Prisma.TaskScalarWhereInput | Prisma.TaskScalarWhereInput[];
    OR?: Prisma.TaskScalarWhereInput[];
    NOT?: Prisma.TaskScalarWhereInput | Prisma.TaskScalarWhereInput[];
    id?: Prisma.StringFilter<"Task"> | string;
    farmId?: Prisma.StringFilter<"Task"> | string;
    title?: Prisma.StringFilter<"Task"> | string;
    description?: Prisma.StringNullableFilter<"Task"> | string | null;
    dueDate?: Prisma.DateTimeFilter<"Task"> | Date | string;
    priority?: Prisma.EnumTaskPriorityFilter<"Task"> | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus;
    assignedToId?: Prisma.StringNullableFilter<"Task"> | string | null;
    sourceType?: Prisma.StringNullableFilter<"Task"> | string | null;
    sourceId?: Prisma.StringNullableFilter<"Task"> | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"Task"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Task"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Task"> | Date | string;
};
export type TaskCreateWithoutFarmInput = {
    id?: string;
    title: string;
    description?: string | null;
    dueDate: Date | string;
    priority?: $Enums.TaskPriority;
    status?: $Enums.TaskStatus;
    sourceType?: string | null;
    sourceId?: string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    assignedTo?: Prisma.UserCreateNestedOneWithoutAssignedTasksInput;
};
export type TaskUncheckedCreateWithoutFarmInput = {
    id?: string;
    title: string;
    description?: string | null;
    dueDate: Date | string;
    priority?: $Enums.TaskPriority;
    status?: $Enums.TaskStatus;
    assignedToId?: string | null;
    sourceType?: string | null;
    sourceId?: string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskCreateOrConnectWithoutFarmInput = {
    where: Prisma.TaskWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskCreateWithoutFarmInput, Prisma.TaskUncheckedCreateWithoutFarmInput>;
};
export type TaskCreateManyFarmInputEnvelope = {
    data: Prisma.TaskCreateManyFarmInput | Prisma.TaskCreateManyFarmInput[];
    skipDuplicates?: boolean;
};
export type TaskUpsertWithWhereUniqueWithoutFarmInput = {
    where: Prisma.TaskWhereUniqueInput;
    update: Prisma.XOR<Prisma.TaskUpdateWithoutFarmInput, Prisma.TaskUncheckedUpdateWithoutFarmInput>;
    create: Prisma.XOR<Prisma.TaskCreateWithoutFarmInput, Prisma.TaskUncheckedCreateWithoutFarmInput>;
};
export type TaskUpdateWithWhereUniqueWithoutFarmInput = {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.XOR<Prisma.TaskUpdateWithoutFarmInput, Prisma.TaskUncheckedUpdateWithoutFarmInput>;
};
export type TaskUpdateManyWithWhereWithoutFarmInput = {
    where: Prisma.TaskScalarWhereInput;
    data: Prisma.XOR<Prisma.TaskUpdateManyMutationInput, Prisma.TaskUncheckedUpdateManyWithoutFarmInput>;
};
export type TaskCreateManyAssignedToInput = {
    id?: string;
    farmId: string;
    title: string;
    description?: string | null;
    dueDate: Date | string;
    priority?: $Enums.TaskPriority;
    status?: $Enums.TaskStatus;
    sourceType?: string | null;
    sourceId?: string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskUpdateWithoutAssignedToInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    priority?: Prisma.EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    sourceType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    farm?: Prisma.FarmUpdateOneRequiredWithoutTasksNestedInput;
};
export type TaskUncheckedUpdateWithoutAssignedToInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    priority?: Prisma.EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    sourceType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskUncheckedUpdateManyWithoutAssignedToInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    farmId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    priority?: Prisma.EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    sourceType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskCreateManyFarmInput = {
    id?: string;
    title: string;
    description?: string | null;
    dueDate: Date | string;
    priority?: $Enums.TaskPriority;
    status?: $Enums.TaskStatus;
    assignedToId?: string | null;
    sourceType?: string | null;
    sourceId?: string | null;
    completedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TaskUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    priority?: Prisma.EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    sourceType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    assignedTo?: Prisma.UserUpdateOneWithoutAssignedTasksNestedInput;
};
export type TaskUncheckedUpdateWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    priority?: Prisma.EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    assignedToId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskUncheckedUpdateManyWithoutFarmInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dueDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    priority?: Prisma.EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority;
    status?: Prisma.EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus;
    assignedToId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceType?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TaskSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    title?: boolean;
    description?: boolean;
    dueDate?: boolean;
    priority?: boolean;
    status?: boolean;
    assignedToId?: boolean;
    sourceType?: boolean;
    sourceId?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    assignedTo?: boolean | Prisma.Task$assignedToArgs<ExtArgs>;
}, ExtArgs["result"]["task"]>;
export type TaskSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    title?: boolean;
    description?: boolean;
    dueDate?: boolean;
    priority?: boolean;
    status?: boolean;
    assignedToId?: boolean;
    sourceType?: boolean;
    sourceId?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    assignedTo?: boolean | Prisma.Task$assignedToArgs<ExtArgs>;
}, ExtArgs["result"]["task"]>;
export type TaskSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    farmId?: boolean;
    title?: boolean;
    description?: boolean;
    dueDate?: boolean;
    priority?: boolean;
    status?: boolean;
    assignedToId?: boolean;
    sourceType?: boolean;
    sourceId?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    assignedTo?: boolean | Prisma.Task$assignedToArgs<ExtArgs>;
}, ExtArgs["result"]["task"]>;
export type TaskSelectScalar = {
    id?: boolean;
    farmId?: boolean;
    title?: boolean;
    description?: boolean;
    dueDate?: boolean;
    priority?: boolean;
    status?: boolean;
    assignedToId?: boolean;
    sourceType?: boolean;
    sourceId?: boolean;
    completedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type TaskOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "farmId" | "title" | "description" | "dueDate" | "priority" | "status" | "assignedToId" | "sourceType" | "sourceId" | "completedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["task"]>;
export type TaskInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    assignedTo?: boolean | Prisma.Task$assignedToArgs<ExtArgs>;
};
export type TaskIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    assignedTo?: boolean | Prisma.Task$assignedToArgs<ExtArgs>;
};
export type TaskIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    farm?: boolean | Prisma.FarmDefaultArgs<ExtArgs>;
    assignedTo?: boolean | Prisma.Task$assignedToArgs<ExtArgs>;
};
export type $TaskPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Task";
    objects: {
        farm: Prisma.$FarmPayload<ExtArgs>;
        assignedTo: Prisma.$UserPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        farmId: string;
        title: string;
        description: string | null;
        dueDate: Date;
        priority: $Enums.TaskPriority;
        status: $Enums.TaskStatus;
        assignedToId: string | null;
        sourceType: string | null;
        sourceId: string | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["task"]>;
    composites: {};
};
export type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TaskPayload, S>;
export type TaskCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TaskCountAggregateInputType | true;
};
export interface TaskDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Task'];
        meta: {
            name: 'Task';
        };
    };
    findUnique<T extends TaskFindUniqueArgs>(args: Prisma.SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TaskFindFirstArgs>(args?: Prisma.SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TaskFindManyArgs>(args?: Prisma.SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TaskCreateArgs>(args: Prisma.SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TaskCreateManyArgs>(args?: Prisma.SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TaskDeleteArgs>(args: Prisma.SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TaskUpdateArgs>(args: Prisma.SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TaskDeleteManyArgs>(args?: Prisma.SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TaskUpdateManyArgs>(args: Prisma.SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TaskUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TaskUpsertArgs>(args: Prisma.SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma.Prisma__TaskClient<runtime.Types.Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TaskCountArgs>(args?: Prisma.Subset<T, TaskCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TaskCountAggregateOutputType> : number>;
    aggregate<T extends TaskAggregateArgs>(args: Prisma.Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>;
    groupBy<T extends TaskGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TaskGroupByArgs['orderBy'];
    } : {
        orderBy?: TaskGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TaskFieldRefs;
}
export interface Prisma__TaskClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    farm<T extends Prisma.FarmDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.FarmDefaultArgs<ExtArgs>>): Prisma.Prisma__FarmClient<runtime.Types.Result.GetResult<Prisma.$FarmPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    assignedTo<T extends Prisma.Task$assignedToArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Task$assignedToArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TaskFieldRefs {
    readonly id: Prisma.FieldRef<"Task", 'String'>;
    readonly farmId: Prisma.FieldRef<"Task", 'String'>;
    readonly title: Prisma.FieldRef<"Task", 'String'>;
    readonly description: Prisma.FieldRef<"Task", 'String'>;
    readonly dueDate: Prisma.FieldRef<"Task", 'DateTime'>;
    readonly priority: Prisma.FieldRef<"Task", 'TaskPriority'>;
    readonly status: Prisma.FieldRef<"Task", 'TaskStatus'>;
    readonly assignedToId: Prisma.FieldRef<"Task", 'String'>;
    readonly sourceType: Prisma.FieldRef<"Task", 'String'>;
    readonly sourceId: Prisma.FieldRef<"Task", 'String'>;
    readonly completedAt: Prisma.FieldRef<"Task", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Task", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Task", 'DateTime'>;
}
export type TaskFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    where: Prisma.TaskWhereUniqueInput;
};
export type TaskFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    where: Prisma.TaskWhereUniqueInput;
};
export type TaskFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput | Prisma.TaskOrderByWithRelationInput[];
    cursor?: Prisma.TaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskScalarFieldEnum | Prisma.TaskScalarFieldEnum[];
};
export type TaskFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput | Prisma.TaskOrderByWithRelationInput[];
    cursor?: Prisma.TaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskScalarFieldEnum | Prisma.TaskScalarFieldEnum[];
};
export type TaskFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput | Prisma.TaskOrderByWithRelationInput[];
    cursor?: Prisma.TaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaskScalarFieldEnum | Prisma.TaskScalarFieldEnum[];
};
export type TaskCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput>;
};
export type TaskCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TaskCreateManyInput | Prisma.TaskCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TaskCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    data: Prisma.TaskCreateManyInput | Prisma.TaskCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TaskIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TaskUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskUpdateInput, Prisma.TaskUncheckedUpdateInput>;
    where: Prisma.TaskWhereUniqueInput;
};
export type TaskUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TaskUpdateManyMutationInput, Prisma.TaskUncheckedUpdateManyInput>;
    where?: Prisma.TaskWhereInput;
    limit?: number;
};
export type TaskUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TaskUpdateManyMutationInput, Prisma.TaskUncheckedUpdateManyInput>;
    where?: Prisma.TaskWhereInput;
    limit?: number;
    include?: Prisma.TaskIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TaskUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    where: Prisma.TaskWhereUniqueInput;
    create: Prisma.XOR<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TaskUpdateInput, Prisma.TaskUncheckedUpdateInput>;
};
export type TaskDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
    where: Prisma.TaskWhereUniqueInput;
};
export type TaskDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TaskWhereInput;
    limit?: number;
};
export type Task$assignedToArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
};
export type TaskDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaskSelect<ExtArgs> | null;
    omit?: Prisma.TaskOmit<ExtArgs> | null;
    include?: Prisma.TaskInclude<ExtArgs> | null;
};
