"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.TaskScalarFieldEnum = exports.StockMovementScalarFieldEnum = exports.InventoryItemScalarFieldEnum = exports.ExpenseScalarFieldEnum = exports.PaymentScalarFieldEnum = exports.SaleItemScalarFieldEnum = exports.SaleScalarFieldEnum = exports.CustomerScalarFieldEnum = exports.HealthRecordScalarFieldEnum = exports.WeighingScalarFieldEnum = exports.LotMembershipScalarFieldEnum = exports.FatteningLotScalarFieldEnum = exports.WeaningScalarFieldEnum = exports.LitterAdoptionScalarFieldEnum = exports.LitterScalarFieldEnum = exports.BirthScalarFieldEnum = exports.PregnancyScalarFieldEnum = exports.BreedingScalarFieldEnum = exports.RabbitCageMovementScalarFieldEnum = exports.RabbitIdentificationScalarFieldEnum = exports.RabbitScalarFieldEnum = exports.CrossBreedScalarFieldEnum = exports.BreedScalarFieldEnum = exports.CageScalarFieldEnum = exports.SectionScalarFieldEnum = exports.FarmMembershipScalarFieldEnum = exports.FarmScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    Farm: 'Farm',
    FarmMembership: 'FarmMembership',
    Section: 'Section',
    Cage: 'Cage',
    Breed: 'Breed',
    CrossBreed: 'CrossBreed',
    Rabbit: 'Rabbit',
    RabbitIdentification: 'RabbitIdentification',
    RabbitCageMovement: 'RabbitCageMovement',
    Breeding: 'Breeding',
    Pregnancy: 'Pregnancy',
    Birth: 'Birth',
    Litter: 'Litter',
    LitterAdoption: 'LitterAdoption',
    Weaning: 'Weaning',
    FatteningLot: 'FatteningLot',
    LotMembership: 'LotMembership',
    Weighing: 'Weighing',
    HealthRecord: 'HealthRecord',
    Customer: 'Customer',
    Sale: 'Sale',
    SaleItem: 'SaleItem',
    Payment: 'Payment',
    Expense: 'Expense',
    InventoryItem: 'InventoryItem',
    StockMovement: 'StockMovement',
    Task: 'Task'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    firstName: 'firstName',
    lastName: 'lastName',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.FarmScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    location: 'location',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.FarmMembershipScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    farmId: 'farmId',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SectionScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    name: 'name',
    type: 'type',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CageScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    sectionId: 'sectionId',
    code: 'code',
    type: 'type',
    capacity: 'capacity',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.BreedScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CrossBreedScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    name: 'name',
    description: 'description',
    breedAId: 'breedAId',
    breedBId: 'breedBId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RabbitScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    code: 'code',
    sex: 'sex',
    status: 'status',
    geneticType: 'geneticType',
    breedId: 'breedId',
    crossBreedId: 'crossBreedId',
    fatherId: 'fatherId',
    motherId: 'motherId',
    birthDate: 'birthDate',
    color: 'color',
    size: 'size',
    earFeature: 'earFeature',
    mark: 'mark',
    observation: 'observation',
    birthLitterId: 'birthLitterId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RabbitIdentificationScalarFieldEnum = {
    id: 'id',
    rabbitId: 'rabbitId',
    type: 'type',
    value: 'value',
    isPrimary: 'isPrimary',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RabbitCageMovementScalarFieldEnum = {
    id: 'id',
    rabbitId: 'rabbitId',
    cageId: 'cageId',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    reason: 'reason',
    observation: 'observation',
    createdAt: 'createdAt'
};
exports.BreedingScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    femaleId: 'femaleId',
    maleId: 'maleId',
    breedingDate: 'breedingDate',
    palpationStartDate: 'palpationStartDate',
    palpationEndDate: 'palpationEndDate',
    nestDate: 'nestDate',
    expectedBirthStartDate: 'expectedBirthStartDate',
    expectedBirthEndDate: 'expectedBirthEndDate',
    status: 'status',
    observation: 'observation',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.PregnancyScalarFieldEnum = {
    id: 'id',
    breedingId: 'breedingId',
    checkDate: 'checkDate',
    result: 'result',
    observation: 'observation',
    createdAt: 'createdAt',
    farmId: 'farmId'
};
exports.BirthScalarFieldEnum = {
    id: 'id',
    breedingId: 'breedingId',
    motherId: 'motherId',
    birthDate: 'birthDate',
    liveBorn: 'liveBorn',
    stillBorn: 'stillBorn',
    observation: 'observation',
    createdAt: 'createdAt',
    farmId: 'farmId'
};
exports.LitterScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    code: 'code',
    breedingId: 'breedingId',
    birthId: 'birthId',
    motherId: 'motherId',
    fatherId: 'fatherId',
    birthDate: 'birthDate',
    liveBorn: 'liveBorn',
    stillBorn: 'stillBorn',
    currentCount: 'currentCount',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.LitterAdoptionScalarFieldEnum = {
    id: 'id',
    sourceLitterId: 'sourceLitterId',
    destinationLitterId: 'destinationLitterId',
    quantity: 'quantity',
    date: 'date',
    reason: 'reason',
    observation: 'observation',
    createdAt: 'createdAt'
};
exports.WeaningScalarFieldEnum = {
    id: 'id',
    litterId: 'litterId',
    plannedDate: 'plannedDate',
    actualDate: 'actualDate',
    quantity: 'quantity',
    totalWeight: 'totalWeight',
    averageWeight: 'averageWeight',
    observation: 'observation',
    createdAt: 'createdAt'
};
exports.FatteningLotScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    code: 'code',
    entryDate: 'entryDate',
    exitDate: 'exitDate',
    status: 'status',
    observation: 'observation',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.LotMembershipScalarFieldEnum = {
    id: 'id',
    lotId: 'lotId',
    rabbitId: 'rabbitId',
    joinedAt: 'joinedAt',
    leftAt: 'leftAt',
    reason: 'reason',
    createdAt: 'createdAt'
};
exports.WeighingScalarFieldEnum = {
    id: 'id',
    rabbitId: 'rabbitId',
    lotId: 'lotId',
    date: 'date',
    totalWeight: 'totalWeight',
    animalCount: 'animalCount',
    averageWeight: 'averageWeight',
    ageInDays: 'ageInDays',
    observation: 'observation',
    createdAt: 'createdAt'
};
exports.HealthRecordScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    rabbitId: 'rabbitId',
    date: 'date',
    symptoms: 'symptoms',
    observation: 'observation',
    suspicion: 'suspicion',
    diagnosis: 'diagnosis',
    treatment: 'treatment',
    medication: 'medication',
    dosage: 'dosage',
    nextDueDate: 'nextDueDate',
    createdById: 'createdById',
    createdAt: 'createdAt'
};
exports.CustomerScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    name: 'name',
    phone: 'phone',
    email: 'email',
    address: 'address',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SaleScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    customerId: 'customerId',
    saleDate: 'saleDate',
    totalAmount: 'totalAmount',
    status: 'status',
    observation: 'observation',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SaleItemScalarFieldEnum = {
    id: 'id',
    saleId: 'saleId',
    rabbitId: 'rabbitId',
    description: 'description',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    totalPrice: 'totalPrice',
    createdAt: 'createdAt'
};
exports.PaymentScalarFieldEnum = {
    id: 'id',
    saleId: 'saleId',
    amount: 'amount',
    paymentDate: 'paymentDate',
    method: 'method',
    reference: 'reference',
    observation: 'observation',
    createdAt: 'createdAt'
};
exports.ExpenseScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    category: 'category',
    amount: 'amount',
    date: 'date',
    description: 'description',
    reference: 'reference',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.InventoryItemScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    name: 'name',
    type: 'type',
    unit: 'unit',
    minimumStock: 'minimumStock',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.StockMovementScalarFieldEnum = {
    id: 'id',
    inventoryItemId: 'inventoryItemId',
    type: 'type',
    quantity: 'quantity',
    date: 'date',
    unitCost: 'unitCost',
    reference: 'reference',
    description: 'description',
    createdAt: 'createdAt'
};
exports.TaskScalarFieldEnum = {
    id: 'id',
    farmId: 'farmId',
    title: 'title',
    description: 'description',
    dueDate: 'dueDate',
    priority: 'priority',
    status: 'status',
    assignedToId: 'assignedToId',
    sourceType: 'sourceType',
    sourceId: 'sourceId',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map