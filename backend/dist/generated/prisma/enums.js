"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = exports.TaskPriority = exports.StockMovementType = exports.InventoryItemType = exports.ExpenseCategory = exports.PaymentMethod = exports.SaleStatus = exports.FatteningLotStatus = exports.AdoptionReason = exports.LitterStatus = exports.PregnancyResult = exports.BreedingStatus = exports.RabbitIdentificationType = exports.RabbitStatus = exports.RabbitSex = exports.CageStatus = exports.SectionType = exports.FarmRole = void 0;
exports.FarmRole = {
    ADMIN: 'ADMIN',
    BREEDING_MANAGER: 'BREEDING_MANAGER',
    EMPLOYEE: 'EMPLOYEE',
    VETERINARIAN: 'VETERINARIAN'
};
exports.SectionType = {
    REPRODUCTION: 'REPRODUCTION',
    MATERNITY: 'MATERNITY',
    FATTENING: 'FATTENING',
    QUARANTINE: 'QUARANTINE',
    OTHER: 'OTHER'
};
exports.CageStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    MAINTENANCE: 'MAINTENANCE'
};
exports.RabbitSex = {
    MALE: 'MALE',
    FEMALE: 'FEMALE'
};
exports.RabbitStatus = {
    ACTIVE: 'ACTIVE',
    SOLD: 'SOLD',
    DEAD: 'DEAD',
    TRANSFERRED: 'TRANSFERRED',
    CULLED: 'CULLED'
};
exports.RabbitIdentificationType = {
    TATTOO: 'TATTOO',
    RING: 'RING',
    EAR_TAG: 'EAR_TAG',
    OTHER: 'OTHER'
};
exports.BreedingStatus = {
    PLANNED: 'PLANNED',
    AWAITING_PALPATION: 'AWAITING_PALPATION',
    PREGNANT: 'PREGNANT',
    NON_PREGNANT: 'NON_PREGNANT',
    INCONCLUSIVE: 'INCONCLUSIVE',
    BIRTH_RECORDED: 'BIRTH_RECORDED',
    CANCELLED: 'CANCELLED'
};
exports.PregnancyResult = {
    PREGNANT: 'PREGNANT',
    NOT_PREGNANT: 'NOT_PREGNANT',
    INCONCLUSIVE: 'INCONCLUSIVE'
};
exports.LitterStatus = {
    ACTIVE: 'ACTIVE',
    WEANED: 'WEANED',
    CLOSED: 'CLOSED'
};
exports.AdoptionReason = {
    EQUALIZATION: 'EQUALIZATION',
    SURPLUS: 'SURPLUS',
    ORPHAN: 'ORPHAN',
    MOTHER_REJECTED: 'MOTHER_REJECTED',
    OTHER: 'OTHER'
};
exports.FatteningLotStatus = {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};
exports.SaleStatus = {
    UNPAID: 'UNPAID',
    PARTIALLY_PAID: 'PARTIALLY_PAID',
    PAID: 'PAID',
    CANCELLED: 'CANCELLED'
};
exports.PaymentMethod = {
    CASH: 'CASH',
    MOBILE_MONEY: 'MOBILE_MONEY',
    BANK_TRANSFER: 'BANK_TRANSFER',
    OTHER: 'OTHER'
};
exports.ExpenseCategory = {
    FEED: 'FEED',
    MEDICATION: 'MEDICATION',
    EQUIPMENT: 'EQUIPMENT',
    MAINTENANCE: 'MAINTENANCE',
    TRANSPORT: 'TRANSPORT',
    SALARY: 'SALARY',
    OTHER: 'OTHER'
};
exports.InventoryItemType = {
    FEED: 'FEED',
    MEDICATION: 'MEDICATION',
    EQUIPMENT: 'EQUIPMENT',
    OTHER: 'OTHER'
};
exports.StockMovementType = {
    INITIAL: 'INITIAL',
    PURCHASE: 'PURCHASE',
    CONSUMPTION: 'CONSUMPTION',
    LOSS: 'LOSS',
    ADJUSTMENT: 'ADJUSTMENT',
    RETURN: 'RETURN'
};
exports.TaskPriority = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    URGENT: 'URGENT'
};
exports.TaskStatus = {
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};
//# sourceMappingURL=enums.js.map