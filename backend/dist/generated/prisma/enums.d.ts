export declare const FarmRole: {
    readonly ADMIN: "ADMIN";
    readonly BREEDING_MANAGER: "BREEDING_MANAGER";
    readonly EMPLOYEE: "EMPLOYEE";
    readonly VETERINARIAN: "VETERINARIAN";
};
export type FarmRole = (typeof FarmRole)[keyof typeof FarmRole];
export declare const SectionType: {
    readonly REPRODUCTION: "REPRODUCTION";
    readonly MATERNITY: "MATERNITY";
    readonly FATTENING: "FATTENING";
    readonly QUARANTINE: "QUARANTINE";
    readonly OTHER: "OTHER";
};
export type SectionType = (typeof SectionType)[keyof typeof SectionType];
export declare const CageStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly MAINTENANCE: "MAINTENANCE";
};
export type CageStatus = (typeof CageStatus)[keyof typeof CageStatus];
export declare const RabbitSex: {
    readonly MALE: "MALE";
    readonly FEMALE: "FEMALE";
};
export type RabbitSex = (typeof RabbitSex)[keyof typeof RabbitSex];
export declare const RabbitStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly SOLD: "SOLD";
    readonly DEAD: "DEAD";
    readonly TRANSFERRED: "TRANSFERRED";
    readonly CULLED: "CULLED";
};
export type RabbitStatus = (typeof RabbitStatus)[keyof typeof RabbitStatus];
export declare const RabbitIdentificationType: {
    readonly TATTOO: "TATTOO";
    readonly RING: "RING";
    readonly EAR_TAG: "EAR_TAG";
    readonly OTHER: "OTHER";
};
export type RabbitIdentificationType = (typeof RabbitIdentificationType)[keyof typeof RabbitIdentificationType];
export declare const BreedingStatus: {
    readonly PLANNED: "PLANNED";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type BreedingStatus = (typeof BreedingStatus)[keyof typeof BreedingStatus];
export declare const PregnancyResult: {
    readonly PREGNANT: "PREGNANT";
    readonly NOT_PREGNANT: "NOT_PREGNANT";
    readonly INCONCLUSIVE: "INCONCLUSIVE";
};
export type PregnancyResult = (typeof PregnancyResult)[keyof typeof PregnancyResult];
export declare const LitterStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly WEANED: "WEANED";
    readonly CLOSED: "CLOSED";
};
export type LitterStatus = (typeof LitterStatus)[keyof typeof LitterStatus];
export declare const AdoptionReason: {
    readonly EQUALIZATION: "EQUALIZATION";
    readonly SURPLUS: "SURPLUS";
    readonly ORPHAN: "ORPHAN";
    readonly MOTHER_REJECTED: "MOTHER_REJECTED";
    readonly OTHER: "OTHER";
};
export type AdoptionReason = (typeof AdoptionReason)[keyof typeof AdoptionReason];
export declare const FatteningLotStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type FatteningLotStatus = (typeof FatteningLotStatus)[keyof typeof FatteningLotStatus];
export declare const SaleStatus: {
    readonly UNPAID: "UNPAID";
    readonly PARTIALLY_PAID: "PARTIALLY_PAID";
    readonly PAID: "PAID";
    readonly CANCELLED: "CANCELLED";
};
export type SaleStatus = (typeof SaleStatus)[keyof typeof SaleStatus];
export declare const PaymentMethod: {
    readonly CASH: "CASH";
    readonly MOBILE_MONEY: "MOBILE_MONEY";
    readonly BANK_TRANSFER: "BANK_TRANSFER";
    readonly OTHER: "OTHER";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const ExpenseCategory: {
    readonly FEED: "FEED";
    readonly MEDICATION: "MEDICATION";
    readonly EQUIPMENT: "EQUIPMENT";
    readonly MAINTENANCE: "MAINTENANCE";
    readonly TRANSPORT: "TRANSPORT";
    readonly SALARY: "SALARY";
    readonly OTHER: "OTHER";
};
export type ExpenseCategory = (typeof ExpenseCategory)[keyof typeof ExpenseCategory];
export declare const InventoryItemType: {
    readonly FEED: "FEED";
    readonly MEDICATION: "MEDICATION";
    readonly EQUIPMENT: "EQUIPMENT";
    readonly OTHER: "OTHER";
};
export type InventoryItemType = (typeof InventoryItemType)[keyof typeof InventoryItemType];
export declare const StockMovementType: {
    readonly INITIAL: "INITIAL";
    readonly PURCHASE: "PURCHASE";
    readonly CONSUMPTION: "CONSUMPTION";
    readonly LOSS: "LOSS";
    readonly ADJUSTMENT: "ADJUSTMENT";
    readonly RETURN: "RETURN";
};
export type StockMovementType = (typeof StockMovementType)[keyof typeof StockMovementType];
export declare const TaskPriority: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
    readonly URGENT: "URGENT";
};
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];
export declare const TaskStatus: {
    readonly TODO: "TODO";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
