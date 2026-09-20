import type * as runtime from "@prisma/client/runtime/client";
import * as $Enums from "./enums.js";
import type * as Prisma from "./internal/prismaNamespace.js";
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type EnumFarmRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.FarmRole | Prisma.EnumFarmRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.FarmRole[] | Prisma.ListEnumFarmRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FarmRole[] | Prisma.ListEnumFarmRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFarmRoleFilter<$PrismaModel> | $Enums.FarmRole;
};
export type EnumFarmRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FarmRole | Prisma.EnumFarmRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.FarmRole[] | Prisma.ListEnumFarmRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FarmRole[] | Prisma.ListEnumFarmRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFarmRoleWithAggregatesFilter<$PrismaModel> | $Enums.FarmRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFarmRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFarmRoleFilter<$PrismaModel>;
};
export type EnumSectionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SectionType | Prisma.EnumSectionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.SectionType[] | Prisma.ListEnumSectionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SectionType[] | Prisma.ListEnumSectionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSectionTypeFilter<$PrismaModel> | $Enums.SectionType;
};
export type EnumSectionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SectionType | Prisma.EnumSectionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.SectionType[] | Prisma.ListEnumSectionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SectionType[] | Prisma.ListEnumSectionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSectionTypeWithAggregatesFilter<$PrismaModel> | $Enums.SectionType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSectionTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSectionTypeFilter<$PrismaModel>;
};
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type EnumCageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CageStatus | Prisma.EnumCageStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CageStatus[] | Prisma.ListEnumCageStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CageStatus[] | Prisma.ListEnumCageStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCageStatusFilter<$PrismaModel> | $Enums.CageStatus;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type EnumCageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CageStatus | Prisma.EnumCageStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CageStatus[] | Prisma.ListEnumCageStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CageStatus[] | Prisma.ListEnumCageStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCageStatusWithAggregatesFilter<$PrismaModel> | $Enums.CageStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCageStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCageStatusFilter<$PrismaModel>;
};
export type EnumRabbitSexFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitSex | Prisma.EnumRabbitSexFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitSex[] | Prisma.ListEnumRabbitSexFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitSex[] | Prisma.ListEnumRabbitSexFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitSexFilter<$PrismaModel> | $Enums.RabbitSex;
};
export type EnumRabbitStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitStatus | Prisma.EnumRabbitStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitStatus[] | Prisma.ListEnumRabbitStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitStatus[] | Prisma.ListEnumRabbitStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitStatusFilter<$PrismaModel> | $Enums.RabbitStatus;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type EnumRabbitSexWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitSex | Prisma.EnumRabbitSexFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitSex[] | Prisma.ListEnumRabbitSexFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitSex[] | Prisma.ListEnumRabbitSexFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitSexWithAggregatesFilter<$PrismaModel> | $Enums.RabbitSex;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRabbitSexFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRabbitSexFilter<$PrismaModel>;
};
export type EnumRabbitStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitStatus | Prisma.EnumRabbitStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitStatus[] | Prisma.ListEnumRabbitStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitStatus[] | Prisma.ListEnumRabbitStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitStatusWithAggregatesFilter<$PrismaModel> | $Enums.RabbitStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRabbitStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRabbitStatusFilter<$PrismaModel>;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type EnumRabbitIdentificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitIdentificationType | Prisma.EnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitIdentificationType[] | Prisma.ListEnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitIdentificationType[] | Prisma.ListEnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitIdentificationTypeFilter<$PrismaModel> | $Enums.RabbitIdentificationType;
};
export type EnumRabbitIdentificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitIdentificationType | Prisma.EnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitIdentificationType[] | Prisma.ListEnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitIdentificationType[] | Prisma.ListEnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitIdentificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.RabbitIdentificationType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRabbitIdentificationTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRabbitIdentificationTypeFilter<$PrismaModel>;
};
export type EnumBreedingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BreedingStatus | Prisma.EnumBreedingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BreedingStatus[] | Prisma.ListEnumBreedingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BreedingStatus[] | Prisma.ListEnumBreedingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBreedingStatusFilter<$PrismaModel> | $Enums.BreedingStatus;
};
export type EnumBreedingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BreedingStatus | Prisma.EnumBreedingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BreedingStatus[] | Prisma.ListEnumBreedingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BreedingStatus[] | Prisma.ListEnumBreedingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBreedingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BreedingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBreedingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBreedingStatusFilter<$PrismaModel>;
};
export type EnumPregnancyResultFilter<$PrismaModel = never> = {
    equals?: $Enums.PregnancyResult | Prisma.EnumPregnancyResultFieldRefInput<$PrismaModel>;
    in?: $Enums.PregnancyResult[] | Prisma.ListEnumPregnancyResultFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PregnancyResult[] | Prisma.ListEnumPregnancyResultFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPregnancyResultFilter<$PrismaModel> | $Enums.PregnancyResult;
};
export type EnumPregnancyResultWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PregnancyResult | Prisma.EnumPregnancyResultFieldRefInput<$PrismaModel>;
    in?: $Enums.PregnancyResult[] | Prisma.ListEnumPregnancyResultFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PregnancyResult[] | Prisma.ListEnumPregnancyResultFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPregnancyResultWithAggregatesFilter<$PrismaModel> | $Enums.PregnancyResult;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPregnancyResultFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPregnancyResultFilter<$PrismaModel>;
};
export type EnumLitterStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LitterStatus | Prisma.EnumLitterStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LitterStatus[] | Prisma.ListEnumLitterStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LitterStatus[] | Prisma.ListEnumLitterStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLitterStatusFilter<$PrismaModel> | $Enums.LitterStatus;
};
export type EnumLitterStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LitterStatus | Prisma.EnumLitterStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LitterStatus[] | Prisma.ListEnumLitterStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LitterStatus[] | Prisma.ListEnumLitterStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLitterStatusWithAggregatesFilter<$PrismaModel> | $Enums.LitterStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLitterStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLitterStatusFilter<$PrismaModel>;
};
export type EnumFatteningLotStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FatteningLotStatus | Prisma.EnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.FatteningLotStatus[] | Prisma.ListEnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FatteningLotStatus[] | Prisma.ListEnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFatteningLotStatusFilter<$PrismaModel> | $Enums.FatteningLotStatus;
};
export type EnumFatteningLotStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FatteningLotStatus | Prisma.EnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.FatteningLotStatus[] | Prisma.ListEnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FatteningLotStatus[] | Prisma.ListEnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFatteningLotStatusWithAggregatesFilter<$PrismaModel> | $Enums.FatteningLotStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFatteningLotStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFatteningLotStatusFilter<$PrismaModel>;
};
export type FloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedFloatFilter<$PrismaModel>;
    _min?: Prisma.NestedFloatFilter<$PrismaModel>;
    _max?: Prisma.NestedFloatFilter<$PrismaModel>;
};
export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
};
export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type DecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type EnumSaleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleStatus | Prisma.EnumSaleStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel> | $Enums.SaleStatus;
};
export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type EnumSaleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleStatus | Prisma.EnumSaleStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleStatusWithAggregatesFilter<$PrismaModel> | $Enums.SaleStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel>;
};
export type EnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | Prisma.EnumPaymentMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod;
};
export type EnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | Prisma.EnumPaymentMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel>;
};
export type EnumExpenseCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseCategory | Prisma.EnumExpenseCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ExpenseCategory[] | Prisma.ListEnumExpenseCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ExpenseCategory[] | Prisma.ListEnumExpenseCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumExpenseCategoryFilter<$PrismaModel> | $Enums.ExpenseCategory;
};
export type EnumExpenseCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseCategory | Prisma.EnumExpenseCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ExpenseCategory[] | Prisma.ListEnumExpenseCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ExpenseCategory[] | Prisma.ListEnumExpenseCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumExpenseCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ExpenseCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumExpenseCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumExpenseCategoryFilter<$PrismaModel>;
};
export type EnumInventoryItemTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryItemType | Prisma.EnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.InventoryItemType[] | Prisma.ListEnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InventoryItemType[] | Prisma.ListEnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInventoryItemTypeFilter<$PrismaModel> | $Enums.InventoryItemType;
};
export type EnumInventoryItemTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryItemType | Prisma.EnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.InventoryItemType[] | Prisma.ListEnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InventoryItemType[] | Prisma.ListEnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInventoryItemTypeWithAggregatesFilter<$PrismaModel> | $Enums.InventoryItemType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumInventoryItemTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumInventoryItemTypeFilter<$PrismaModel>;
};
export type EnumStockMovementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | Prisma.EnumStockMovementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel> | $Enums.StockMovementType;
};
export type EnumStockMovementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | Prisma.EnumStockMovementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMovementTypeWithAggregatesFilter<$PrismaModel> | $Enums.StockMovementType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel>;
};
export type EnumTaskPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskPriority | Prisma.EnumTaskPriorityFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskPriority[] | Prisma.ListEnumTaskPriorityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskPriority[] | Prisma.ListEnumTaskPriorityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskPriorityFilter<$PrismaModel> | $Enums.TaskPriority;
};
export type EnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | Prisma.EnumTaskStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskStatus[] | Prisma.ListEnumTaskStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskStatus[] | Prisma.ListEnumTaskStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus;
};
export type EnumTaskPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskPriority | Prisma.EnumTaskPriorityFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskPriority[] | Prisma.ListEnumTaskPriorityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskPriority[] | Prisma.ListEnumTaskPriorityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskPriorityWithAggregatesFilter<$PrismaModel> | $Enums.TaskPriority;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTaskPriorityFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTaskPriorityFilter<$PrismaModel>;
};
export type EnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | Prisma.EnumTaskStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskStatus[] | Prisma.ListEnumTaskStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskStatus[] | Prisma.ListEnumTaskStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTaskStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTaskStatusFilter<$PrismaModel>;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumFarmRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.FarmRole | Prisma.EnumFarmRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.FarmRole[] | Prisma.ListEnumFarmRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FarmRole[] | Prisma.ListEnumFarmRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFarmRoleFilter<$PrismaModel> | $Enums.FarmRole;
};
export type NestedEnumFarmRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FarmRole | Prisma.EnumFarmRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.FarmRole[] | Prisma.ListEnumFarmRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FarmRole[] | Prisma.ListEnumFarmRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFarmRoleWithAggregatesFilter<$PrismaModel> | $Enums.FarmRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFarmRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFarmRoleFilter<$PrismaModel>;
};
export type NestedEnumSectionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SectionType | Prisma.EnumSectionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.SectionType[] | Prisma.ListEnumSectionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SectionType[] | Prisma.ListEnumSectionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSectionTypeFilter<$PrismaModel> | $Enums.SectionType;
};
export type NestedEnumSectionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SectionType | Prisma.EnumSectionTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.SectionType[] | Prisma.ListEnumSectionTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SectionType[] | Prisma.ListEnumSectionTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSectionTypeWithAggregatesFilter<$PrismaModel> | $Enums.SectionType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSectionTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSectionTypeFilter<$PrismaModel>;
};
export type NestedEnumCageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CageStatus | Prisma.EnumCageStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CageStatus[] | Prisma.ListEnumCageStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CageStatus[] | Prisma.ListEnumCageStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCageStatusFilter<$PrismaModel> | $Enums.CageStatus;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedEnumCageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CageStatus | Prisma.EnumCageStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CageStatus[] | Prisma.ListEnumCageStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CageStatus[] | Prisma.ListEnumCageStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCageStatusWithAggregatesFilter<$PrismaModel> | $Enums.CageStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCageStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCageStatusFilter<$PrismaModel>;
};
export type NestedEnumRabbitSexFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitSex | Prisma.EnumRabbitSexFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitSex[] | Prisma.ListEnumRabbitSexFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitSex[] | Prisma.ListEnumRabbitSexFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitSexFilter<$PrismaModel> | $Enums.RabbitSex;
};
export type NestedEnumRabbitStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitStatus | Prisma.EnumRabbitStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitStatus[] | Prisma.ListEnumRabbitStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitStatus[] | Prisma.ListEnumRabbitStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitStatusFilter<$PrismaModel> | $Enums.RabbitStatus;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type NestedEnumRabbitSexWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitSex | Prisma.EnumRabbitSexFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitSex[] | Prisma.ListEnumRabbitSexFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitSex[] | Prisma.ListEnumRabbitSexFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitSexWithAggregatesFilter<$PrismaModel> | $Enums.RabbitSex;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRabbitSexFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRabbitSexFilter<$PrismaModel>;
};
export type NestedEnumRabbitStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitStatus | Prisma.EnumRabbitStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitStatus[] | Prisma.ListEnumRabbitStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitStatus[] | Prisma.ListEnumRabbitStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitStatusWithAggregatesFilter<$PrismaModel> | $Enums.RabbitStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRabbitStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRabbitStatusFilter<$PrismaModel>;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type NestedEnumRabbitIdentificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitIdentificationType | Prisma.EnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitIdentificationType[] | Prisma.ListEnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitIdentificationType[] | Prisma.ListEnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitIdentificationTypeFilter<$PrismaModel> | $Enums.RabbitIdentificationType;
};
export type NestedEnumRabbitIdentificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RabbitIdentificationType | Prisma.EnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.RabbitIdentificationType[] | Prisma.ListEnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.RabbitIdentificationType[] | Prisma.ListEnumRabbitIdentificationTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumRabbitIdentificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.RabbitIdentificationType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumRabbitIdentificationTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumRabbitIdentificationTypeFilter<$PrismaModel>;
};
export type NestedEnumBreedingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BreedingStatus | Prisma.EnumBreedingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BreedingStatus[] | Prisma.ListEnumBreedingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BreedingStatus[] | Prisma.ListEnumBreedingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBreedingStatusFilter<$PrismaModel> | $Enums.BreedingStatus;
};
export type NestedEnumBreedingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BreedingStatus | Prisma.EnumBreedingStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BreedingStatus[] | Prisma.ListEnumBreedingStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BreedingStatus[] | Prisma.ListEnumBreedingStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBreedingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BreedingStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBreedingStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBreedingStatusFilter<$PrismaModel>;
};
export type NestedEnumPregnancyResultFilter<$PrismaModel = never> = {
    equals?: $Enums.PregnancyResult | Prisma.EnumPregnancyResultFieldRefInput<$PrismaModel>;
    in?: $Enums.PregnancyResult[] | Prisma.ListEnumPregnancyResultFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PregnancyResult[] | Prisma.ListEnumPregnancyResultFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPregnancyResultFilter<$PrismaModel> | $Enums.PregnancyResult;
};
export type NestedEnumPregnancyResultWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PregnancyResult | Prisma.EnumPregnancyResultFieldRefInput<$PrismaModel>;
    in?: $Enums.PregnancyResult[] | Prisma.ListEnumPregnancyResultFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PregnancyResult[] | Prisma.ListEnumPregnancyResultFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPregnancyResultWithAggregatesFilter<$PrismaModel> | $Enums.PregnancyResult;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPregnancyResultFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPregnancyResultFilter<$PrismaModel>;
};
export type NestedEnumLitterStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LitterStatus | Prisma.EnumLitterStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LitterStatus[] | Prisma.ListEnumLitterStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LitterStatus[] | Prisma.ListEnumLitterStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLitterStatusFilter<$PrismaModel> | $Enums.LitterStatus;
};
export type NestedEnumLitterStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LitterStatus | Prisma.EnumLitterStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LitterStatus[] | Prisma.ListEnumLitterStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LitterStatus[] | Prisma.ListEnumLitterStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLitterStatusWithAggregatesFilter<$PrismaModel> | $Enums.LitterStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLitterStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLitterStatusFilter<$PrismaModel>;
};
export type NestedEnumFatteningLotStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FatteningLotStatus | Prisma.EnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.FatteningLotStatus[] | Prisma.ListEnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FatteningLotStatus[] | Prisma.ListEnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFatteningLotStatusFilter<$PrismaModel> | $Enums.FatteningLotStatus;
};
export type NestedEnumFatteningLotStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FatteningLotStatus | Prisma.EnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.FatteningLotStatus[] | Prisma.ListEnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FatteningLotStatus[] | Prisma.ListEnumFatteningLotStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFatteningLotStatusWithAggregatesFilter<$PrismaModel> | $Enums.FatteningLotStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFatteningLotStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFatteningLotStatusFilter<$PrismaModel>;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedFloatFilter<$PrismaModel>;
    _min?: Prisma.NestedFloatFilter<$PrismaModel>;
    _max?: Prisma.NestedFloatFilter<$PrismaModel>;
};
export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
};
export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type NestedEnumSaleStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleStatus | Prisma.EnumSaleStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel> | $Enums.SaleStatus;
};
export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type NestedEnumSaleStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SaleStatus | Prisma.EnumSaleStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SaleStatus[] | Prisma.ListEnumSaleStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSaleStatusWithAggregatesFilter<$PrismaModel> | $Enums.SaleStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSaleStatusFilter<$PrismaModel>;
};
export type NestedEnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | Prisma.EnumPaymentMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod;
};
export type NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | Prisma.EnumPaymentMethodFieldRefInput<$PrismaModel>;
    in?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    notIn?: $Enums.PaymentMethod[] | Prisma.ListEnumPaymentMethodFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumPaymentMethodFilter<$PrismaModel>;
};
export type NestedEnumExpenseCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseCategory | Prisma.EnumExpenseCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ExpenseCategory[] | Prisma.ListEnumExpenseCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ExpenseCategory[] | Prisma.ListEnumExpenseCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumExpenseCategoryFilter<$PrismaModel> | $Enums.ExpenseCategory;
};
export type NestedEnumExpenseCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseCategory | Prisma.EnumExpenseCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.ExpenseCategory[] | Prisma.ListEnumExpenseCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ExpenseCategory[] | Prisma.ListEnumExpenseCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumExpenseCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ExpenseCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumExpenseCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumExpenseCategoryFilter<$PrismaModel>;
};
export type NestedEnumInventoryItemTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryItemType | Prisma.EnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.InventoryItemType[] | Prisma.ListEnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InventoryItemType[] | Prisma.ListEnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInventoryItemTypeFilter<$PrismaModel> | $Enums.InventoryItemType;
};
export type NestedEnumInventoryItemTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryItemType | Prisma.EnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.InventoryItemType[] | Prisma.ListEnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.InventoryItemType[] | Prisma.ListEnumInventoryItemTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumInventoryItemTypeWithAggregatesFilter<$PrismaModel> | $Enums.InventoryItemType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumInventoryItemTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumInventoryItemTypeFilter<$PrismaModel>;
};
export type NestedEnumStockMovementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | Prisma.EnumStockMovementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel> | $Enums.StockMovementType;
};
export type NestedEnumStockMovementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMovementType | Prisma.EnumStockMovementTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMovementType[] | Prisma.ListEnumStockMovementTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMovementTypeWithAggregatesFilter<$PrismaModel> | $Enums.StockMovementType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockMovementTypeFilter<$PrismaModel>;
};
export type NestedEnumTaskPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskPriority | Prisma.EnumTaskPriorityFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskPriority[] | Prisma.ListEnumTaskPriorityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskPriority[] | Prisma.ListEnumTaskPriorityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskPriorityFilter<$PrismaModel> | $Enums.TaskPriority;
};
export type NestedEnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | Prisma.EnumTaskStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskStatus[] | Prisma.ListEnumTaskStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskStatus[] | Prisma.ListEnumTaskStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus;
};
export type NestedEnumTaskPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskPriority | Prisma.EnumTaskPriorityFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskPriority[] | Prisma.ListEnumTaskPriorityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskPriority[] | Prisma.ListEnumTaskPriorityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskPriorityWithAggregatesFilter<$PrismaModel> | $Enums.TaskPriority;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTaskPriorityFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTaskPriorityFilter<$PrismaModel>;
};
export type NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | Prisma.EnumTaskStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskStatus[] | Prisma.ListEnumTaskStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskStatus[] | Prisma.ListEnumTaskStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTaskStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTaskStatusFilter<$PrismaModel>;
};
