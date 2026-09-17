-- CreateEnum
CREATE TYPE "FarmRole" AS ENUM ('ADMIN', 'BREEDING_MANAGER', 'EMPLOYEE', 'VETERINARIAN');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('REPRODUCTION', 'MATERNITY', 'FATTENING', 'QUARANTINE', 'OTHER');

-- CreateEnum
CREATE TYPE "CageStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "RabbitSex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "RabbitStatus" AS ENUM ('ACTIVE', 'SOLD', 'DEAD', 'TRANSFERRED', 'CULLED');

-- CreateEnum
CREATE TYPE "RabbitIdentificationType" AS ENUM ('TATTOO', 'RING', 'EAR_TAG', 'OTHER');

-- CreateEnum
CREATE TYPE "BreedingStatus" AS ENUM ('PLANNED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PregnancyResult" AS ENUM ('PREGNANT', 'NOT_PREGNANT', 'INCONCLUSIVE');

-- CreateEnum
CREATE TYPE "LitterStatus" AS ENUM ('ACTIVE', 'WEANED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AdoptionReason" AS ENUM ('EQUALIZATION', 'SURPLUS', 'ORPHAN', 'MOTHER_REJECTED', 'OTHER');

-- CreateEnum
CREATE TYPE "FatteningLotStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('FEED', 'MEDICATION', 'EQUIPMENT', 'MAINTENANCE', 'TRANSPORT', 'SALARY', 'OTHER');

-- CreateEnum
CREATE TYPE "InventoryItemType" AS ENUM ('FEED', 'MEDICATION', 'EQUIPMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('INITIAL', 'PURCHASE', 'CONSUMPTION', 'LOSS', 'ADJUSTMENT', 'RETURN');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FarmMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "role" "FarmRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FarmMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cage" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT,
    "capacity" INTEGER NOT NULL,
    "status" "CageStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Breed" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Breed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrossBreed" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "breedAId" TEXT NOT NULL,
    "breedBId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrossBreed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rabbit" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "sex" "RabbitSex" NOT NULL,
    "status" "RabbitStatus" NOT NULL DEFAULT 'ACTIVE',
    "geneticType" TEXT,
    "breedId" TEXT,
    "crossBreedId" TEXT,
    "fatherId" TEXT,
    "motherId" TEXT,
    "birthDate" TIMESTAMP(3),
    "color" TEXT,
    "size" TEXT,
    "earFeature" TEXT,
    "mark" TEXT,
    "observation" TEXT,
    "birthLitterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rabbit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RabbitIdentification" (
    "id" TEXT NOT NULL,
    "rabbitId" TEXT NOT NULL,
    "type" "RabbitIdentificationType" NOT NULL,
    "value" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RabbitIdentification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RabbitCageMovement" (
    "id" TEXT NOT NULL,
    "rabbitId" TEXT NOT NULL,
    "cageId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "reason" TEXT,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RabbitCageMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Breeding" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "femaleId" TEXT NOT NULL,
    "maleId" TEXT NOT NULL,
    "breedingDate" TIMESTAMP(3) NOT NULL,
    "palpationStartDate" TIMESTAMP(3),
    "palpationEndDate" TIMESTAMP(3),
    "nestDate" TIMESTAMP(3),
    "expectedBirthStartDate" TIMESTAMP(3),
    "expectedBirthEndDate" TIMESTAMP(3),
    "status" "BreedingStatus" NOT NULL DEFAULT 'COMPLETED',
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Breeding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pregnancy" (
    "id" TEXT NOT NULL,
    "breedingId" TEXT NOT NULL,
    "checkDate" TIMESTAMP(3) NOT NULL,
    "result" "PregnancyResult" NOT NULL,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "farmId" TEXT,

    CONSTRAINT "Pregnancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Birth" (
    "id" TEXT NOT NULL,
    "breedingId" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "liveBorn" INTEGER NOT NULL,
    "stillBorn" INTEGER NOT NULL,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "farmId" TEXT,

    CONSTRAINT "Birth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Litter" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "breedingId" TEXT,
    "birthId" TEXT,
    "motherId" TEXT NOT NULL,
    "fatherId" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "liveBorn" INTEGER NOT NULL,
    "stillBorn" INTEGER NOT NULL,
    "currentCount" INTEGER NOT NULL,
    "status" "LitterStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Litter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LitterAdoption" (
    "id" TEXT NOT NULL,
    "sourceLitterId" TEXT NOT NULL,
    "destinationLitterId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" "AdoptionReason" NOT NULL,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LitterAdoption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weaning" (
    "id" TEXT NOT NULL,
    "litterId" TEXT NOT NULL,
    "plannedDate" TIMESTAMP(3),
    "actualDate" TIMESTAMP(3),
    "quantity" INTEGER,
    "totalWeight" DOUBLE PRECISION,
    "averageWeight" DOUBLE PRECISION,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Weaning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FatteningLot" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "exitDate" TIMESTAMP(3),
    "status" "FatteningLotStatus" NOT NULL DEFAULT 'ACTIVE',
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FatteningLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LotMembership" (
    "id" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "rabbitId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL,
    "leftAt" TIMESTAMP(3),
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LotMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weighing" (
    "id" TEXT NOT NULL,
    "rabbitId" TEXT,
    "lotId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "totalWeight" DOUBLE PRECISION NOT NULL,
    "animalCount" INTEGER NOT NULL,
    "averageWeight" DOUBLE PRECISION,
    "ageInDays" INTEGER,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Weighing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthRecord" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "rabbitId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "symptoms" TEXT,
    "observation" TEXT,
    "suspicion" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "medication" TEXT,
    "dosage" TEXT,
    "nextDueDate" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "customerId" TEXT,
    "saleDate" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "status" "SaleStatus" NOT NULL DEFAULT 'UNPAID',
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleItem" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "rabbitId" TEXT,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InventoryItemType" NOT NULL,
    "unit" TEXT NOT NULL,
    "minimumStock" DOUBLE PRECISION,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "unitCost" DECIMAL(65,30),
    "reference" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "assignedToId" TEXT,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Farm_name_idx" ON "Farm"("name");

-- CreateIndex
CREATE INDEX "FarmMembership_userId_idx" ON "FarmMembership"("userId");

-- CreateIndex
CREATE INDEX "FarmMembership_farmId_idx" ON "FarmMembership"("farmId");

-- CreateIndex
CREATE UNIQUE INDEX "FarmMembership_userId_farmId_key" ON "FarmMembership"("userId", "farmId");

-- CreateIndex
CREATE INDEX "Section_farmId_idx" ON "Section"("farmId");

-- CreateIndex
CREATE INDEX "Section_type_idx" ON "Section"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Section_farmId_name_key" ON "Section"("farmId", "name");

-- CreateIndex
CREATE INDEX "Cage_farmId_idx" ON "Cage"("farmId");

-- CreateIndex
CREATE INDEX "Cage_sectionId_idx" ON "Cage"("sectionId");

-- CreateIndex
CREATE INDEX "Cage_status_idx" ON "Cage"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Cage_farmId_code_key" ON "Cage"("farmId", "code");

-- CreateIndex
CREATE INDEX "Breed_farmId_idx" ON "Breed"("farmId");

-- CreateIndex
CREATE UNIQUE INDEX "Breed_farmId_name_key" ON "Breed"("farmId", "name");

-- CreateIndex
CREATE INDEX "CrossBreed_farmId_idx" ON "CrossBreed"("farmId");

-- CreateIndex
CREATE INDEX "CrossBreed_breedAId_idx" ON "CrossBreed"("breedAId");

-- CreateIndex
CREATE INDEX "CrossBreed_breedBId_idx" ON "CrossBreed"("breedBId");

-- CreateIndex
CREATE UNIQUE INDEX "CrossBreed_farmId_name_key" ON "CrossBreed"("farmId", "name");

-- CreateIndex
CREATE INDEX "Rabbit_farmId_idx" ON "Rabbit"("farmId");

-- CreateIndex
CREATE INDEX "Rabbit_breedId_idx" ON "Rabbit"("breedId");

-- CreateIndex
CREATE INDEX "Rabbit_crossBreedId_idx" ON "Rabbit"("crossBreedId");

-- CreateIndex
CREATE INDEX "Rabbit_fatherId_idx" ON "Rabbit"("fatherId");

-- CreateIndex
CREATE INDEX "Rabbit_motherId_idx" ON "Rabbit"("motherId");

-- CreateIndex
CREATE INDEX "Rabbit_status_idx" ON "Rabbit"("status");

-- CreateIndex
CREATE INDEX "Rabbit_sex_idx" ON "Rabbit"("sex");

-- CreateIndex
CREATE UNIQUE INDEX "Rabbit_farmId_code_key" ON "Rabbit"("farmId", "code");

-- CreateIndex
CREATE INDEX "RabbitIdentification_rabbitId_idx" ON "RabbitIdentification"("rabbitId");

-- CreateIndex
CREATE INDEX "RabbitIdentification_type_value_idx" ON "RabbitIdentification"("type", "value");

-- CreateIndex
CREATE UNIQUE INDEX "RabbitIdentification_rabbitId_type_value_key" ON "RabbitIdentification"("rabbitId", "type", "value");

-- CreateIndex
CREATE INDEX "RabbitCageMovement_rabbitId_idx" ON "RabbitCageMovement"("rabbitId");

-- CreateIndex
CREATE INDEX "RabbitCageMovement_cageId_idx" ON "RabbitCageMovement"("cageId");

-- CreateIndex
CREATE INDEX "RabbitCageMovement_startedAt_idx" ON "RabbitCageMovement"("startedAt");

-- CreateIndex
CREATE INDEX "RabbitCageMovement_endedAt_idx" ON "RabbitCageMovement"("endedAt");

-- CreateIndex
CREATE INDEX "Breeding_farmId_idx" ON "Breeding"("farmId");

-- CreateIndex
CREATE INDEX "Breeding_femaleId_idx" ON "Breeding"("femaleId");

-- CreateIndex
CREATE INDEX "Breeding_maleId_idx" ON "Breeding"("maleId");

-- CreateIndex
CREATE INDEX "Breeding_breedingDate_idx" ON "Breeding"("breedingDate");

-- CreateIndex
CREATE INDEX "Breeding_status_idx" ON "Breeding"("status");

-- CreateIndex
CREATE INDEX "Pregnancy_breedingId_idx" ON "Pregnancy"("breedingId");

-- CreateIndex
CREATE INDEX "Pregnancy_checkDate_idx" ON "Pregnancy"("checkDate");

-- CreateIndex
CREATE INDEX "Pregnancy_result_idx" ON "Pregnancy"("result");

-- CreateIndex
CREATE UNIQUE INDEX "Pregnancy_breedingId_key" ON "Pregnancy"("breedingId");

-- CreateIndex
CREATE INDEX "Birth_motherId_idx" ON "Birth"("motherId");

-- CreateIndex
CREATE INDEX "Birth_birthDate_idx" ON "Birth"("birthDate");

-- CreateIndex
CREATE UNIQUE INDEX "Birth_breedingId_key" ON "Birth"("breedingId");

-- CreateIndex
CREATE UNIQUE INDEX "Litter_birthId_key" ON "Litter"("birthId");

-- CreateIndex
CREATE INDEX "Litter_farmId_idx" ON "Litter"("farmId");

-- CreateIndex
CREATE INDEX "Litter_motherId_idx" ON "Litter"("motherId");

-- CreateIndex
CREATE INDEX "Litter_fatherId_idx" ON "Litter"("fatherId");

-- CreateIndex
CREATE INDEX "Litter_breedingId_idx" ON "Litter"("breedingId");

-- CreateIndex
CREATE INDEX "Litter_birthId_idx" ON "Litter"("birthId");

-- CreateIndex
CREATE INDEX "Litter_birthDate_idx" ON "Litter"("birthDate");

-- CreateIndex
CREATE INDEX "Litter_status_idx" ON "Litter"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Litter_farmId_code_key" ON "Litter"("farmId", "code");

-- CreateIndex
CREATE INDEX "LitterAdoption_sourceLitterId_idx" ON "LitterAdoption"("sourceLitterId");

-- CreateIndex
CREATE INDEX "LitterAdoption_destinationLitterId_idx" ON "LitterAdoption"("destinationLitterId");

-- CreateIndex
CREATE INDEX "LitterAdoption_date_idx" ON "LitterAdoption"("date");

-- CreateIndex
CREATE INDEX "Weaning_litterId_idx" ON "Weaning"("litterId");

-- CreateIndex
CREATE INDEX "Weaning_actualDate_idx" ON "Weaning"("actualDate");

-- CreateIndex
CREATE UNIQUE INDEX "Weaning_litterId_key" ON "Weaning"("litterId");

-- CreateIndex
CREATE INDEX "FatteningLot_farmId_idx" ON "FatteningLot"("farmId");

-- CreateIndex
CREATE INDEX "FatteningLot_status_idx" ON "FatteningLot"("status");

-- CreateIndex
CREATE INDEX "FatteningLot_entryDate_idx" ON "FatteningLot"("entryDate");

-- CreateIndex
CREATE UNIQUE INDEX "FatteningLot_farmId_code_key" ON "FatteningLot"("farmId", "code");

-- CreateIndex
CREATE INDEX "LotMembership_lotId_idx" ON "LotMembership"("lotId");

-- CreateIndex
CREATE INDEX "LotMembership_rabbitId_idx" ON "LotMembership"("rabbitId");

-- CreateIndex
CREATE INDEX "LotMembership_joinedAt_idx" ON "LotMembership"("joinedAt");

-- CreateIndex
CREATE INDEX "LotMembership_leftAt_idx" ON "LotMembership"("leftAt");

-- CreateIndex
CREATE INDEX "Weighing_rabbitId_idx" ON "Weighing"("rabbitId");

-- CreateIndex
CREATE INDEX "Weighing_lotId_idx" ON "Weighing"("lotId");

-- CreateIndex
CREATE INDEX "Weighing_date_idx" ON "Weighing"("date");

-- CreateIndex
CREATE INDEX "HealthRecord_farmId_idx" ON "HealthRecord"("farmId");

-- CreateIndex
CREATE INDEX "HealthRecord_rabbitId_idx" ON "HealthRecord"("rabbitId");

-- CreateIndex
CREATE INDEX "HealthRecord_date_idx" ON "HealthRecord"("date");

-- CreateIndex
CREATE INDEX "HealthRecord_nextDueDate_idx" ON "HealthRecord"("nextDueDate");

-- CreateIndex
CREATE INDEX "Customer_farmId_idx" ON "Customer"("farmId");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE INDEX "Sale_farmId_idx" ON "Sale"("farmId");

-- CreateIndex
CREATE INDEX "Sale_customerId_idx" ON "Sale"("customerId");

-- CreateIndex
CREATE INDEX "Sale_saleDate_idx" ON "Sale"("saleDate");

-- CreateIndex
CREATE INDEX "Sale_status_idx" ON "Sale"("status");

-- CreateIndex
CREATE INDEX "SaleItem_saleId_idx" ON "SaleItem"("saleId");

-- CreateIndex
CREATE INDEX "SaleItem_rabbitId_idx" ON "SaleItem"("rabbitId");

-- CreateIndex
CREATE INDEX "Payment_saleId_idx" ON "Payment"("saleId");

-- CreateIndex
CREATE INDEX "Payment_paymentDate_idx" ON "Payment"("paymentDate");

-- CreateIndex
CREATE INDEX "Payment_method_idx" ON "Payment"("method");

-- CreateIndex
CREATE INDEX "Expense_farmId_idx" ON "Expense"("farmId");

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "Expense"("category");

-- CreateIndex
CREATE INDEX "Expense_date_idx" ON "Expense"("date");

-- CreateIndex
CREATE INDEX "InventoryItem_farmId_idx" ON "InventoryItem"("farmId");

-- CreateIndex
CREATE INDEX "InventoryItem_type_idx" ON "InventoryItem"("type");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_farmId_name_key" ON "InventoryItem"("farmId", "name");

-- CreateIndex
CREATE INDEX "StockMovement_inventoryItemId_idx" ON "StockMovement"("inventoryItemId");

-- CreateIndex
CREATE INDEX "StockMovement_type_idx" ON "StockMovement"("type");

-- CreateIndex
CREATE INDEX "StockMovement_date_idx" ON "StockMovement"("date");

-- CreateIndex
CREATE INDEX "Task_farmId_idx" ON "Task"("farmId");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_priority_idx" ON "Task"("priority");

-- CreateIndex
CREATE INDEX "Task_assignedToId_idx" ON "Task"("assignedToId");

-- CreateIndex
CREATE INDEX "Task_sourceType_sourceId_idx" ON "Task"("sourceType", "sourceId");

-- AddForeignKey
ALTER TABLE "FarmMembership" ADD CONSTRAINT "FarmMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FarmMembership" ADD CONSTRAINT "FarmMembership_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cage" ADD CONSTRAINT "Cage_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cage" ADD CONSTRAINT "Cage_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Breed" ADD CONSTRAINT "Breed_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrossBreed" ADD CONSTRAINT "CrossBreed_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrossBreed" ADD CONSTRAINT "CrossBreed_breedAId_fkey" FOREIGN KEY ("breedAId") REFERENCES "Breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrossBreed" ADD CONSTRAINT "CrossBreed_breedBId_fkey" FOREIGN KEY ("breedBId") REFERENCES "Breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rabbit" ADD CONSTRAINT "Rabbit_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rabbit" ADD CONSTRAINT "Rabbit_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "Breed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rabbit" ADD CONSTRAINT "Rabbit_crossBreedId_fkey" FOREIGN KEY ("crossBreedId") REFERENCES "CrossBreed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rabbit" ADD CONSTRAINT "Rabbit_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "Rabbit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rabbit" ADD CONSTRAINT "Rabbit_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Rabbit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rabbit" ADD CONSTRAINT "Rabbit_birthLitterId_fkey" FOREIGN KEY ("birthLitterId") REFERENCES "Litter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RabbitIdentification" ADD CONSTRAINT "RabbitIdentification_rabbitId_fkey" FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RabbitCageMovement" ADD CONSTRAINT "RabbitCageMovement_rabbitId_fkey" FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RabbitCageMovement" ADD CONSTRAINT "RabbitCageMovement_cageId_fkey" FOREIGN KEY ("cageId") REFERENCES "Cage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Breeding" ADD CONSTRAINT "Breeding_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Breeding" ADD CONSTRAINT "Breeding_femaleId_fkey" FOREIGN KEY ("femaleId") REFERENCES "Rabbit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Breeding" ADD CONSTRAINT "Breeding_maleId_fkey" FOREIGN KEY ("maleId") REFERENCES "Rabbit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pregnancy" ADD CONSTRAINT "Pregnancy_breedingId_fkey" FOREIGN KEY ("breedingId") REFERENCES "Breeding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pregnancy" ADD CONSTRAINT "Pregnancy_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Birth" ADD CONSTRAINT "Birth_breedingId_fkey" FOREIGN KEY ("breedingId") REFERENCES "Breeding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Birth" ADD CONSTRAINT "Birth_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Rabbit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Birth" ADD CONSTRAINT "Birth_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Litter" ADD CONSTRAINT "Litter_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "Rabbit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Litter" ADD CONSTRAINT "Litter_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "Rabbit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Litter" ADD CONSTRAINT "Litter_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Litter" ADD CONSTRAINT "Litter_breedingId_fkey" FOREIGN KEY ("breedingId") REFERENCES "Breeding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Litter" ADD CONSTRAINT "Litter_birthId_fkey" FOREIGN KEY ("birthId") REFERENCES "Birth"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LitterAdoption" ADD CONSTRAINT "LitterAdoption_sourceLitterId_fkey" FOREIGN KEY ("sourceLitterId") REFERENCES "Litter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LitterAdoption" ADD CONSTRAINT "LitterAdoption_destinationLitterId_fkey" FOREIGN KEY ("destinationLitterId") REFERENCES "Litter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weaning" ADD CONSTRAINT "Weaning_litterId_fkey" FOREIGN KEY ("litterId") REFERENCES "Litter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FatteningLot" ADD CONSTRAINT "FatteningLot_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotMembership" ADD CONSTRAINT "LotMembership_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "FatteningLot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotMembership" ADD CONSTRAINT "LotMembership_rabbitId_fkey" FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weighing" ADD CONSTRAINT "Weighing_rabbitId_fkey" FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Weighing" ADD CONSTRAINT "Weighing_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "FatteningLot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_rabbitId_fkey" FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_rabbitId_fkey" FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
