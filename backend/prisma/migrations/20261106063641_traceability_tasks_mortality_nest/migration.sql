-- CreateEnum
CREATE TYPE "HealthRecordType" AS ENUM ('OBSERVATION', 'TREATMENT', 'VACCINATION', 'ANALYSIS', 'CONTROL');

-- CreateEnum
CREATE TYPE "InbreedingPolicy" AS ENUM ('WARN', 'BLOCK');

-- CreateEnum
CREATE TYPE "MortalityScope" AS ENUM ('RABBIT', 'LITTER', 'LOT');

-- AlterEnum
ALTER TYPE "ExpenseCategory" ADD VALUE 'ENERGY';

-- DropIndex
DROP INDEX "Pregnancy_breedingId_key";

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "observation" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod";

-- AlterTable
ALTER TABLE "Farm" ADD COLUMN     "inbreedingPolicy" "InbreedingPolicy" NOT NULL DEFAULT 'WARN';

-- AlterTable
ALTER TABLE "HealthRecord" ADD COLUMN     "type" "HealthRecordType" NOT NULL DEFAULT 'OBSERVATION';

-- AlterTable
ALTER TABLE "Rabbit" ADD COLUMN     "exitCause" TEXT,
ADD COLUMN     "exitDate" TIMESTAMP(3),
ADD COLUMN     "originalCode" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "automationKey" TEXT;

-- CreateTable
CREATE TABLE "NestInstallation" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "breedingId" TEXT NOT NULL,
    "installedAt" TIMESTAMP(3) NOT NULL,
    "nestType" TEXT,
    "material" TEXT,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NestInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MortalityRecord" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "scope" "MortalityScope" NOT NULL,
    "rabbitId" TEXT,
    "litterId" TEXT,
    "lotId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "cause" TEXT,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MortalityRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LotCageMovement" (
    "id" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "cageId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "reason" TEXT,
    "observation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LotCageMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NestInstallation_breedingId_key" ON "NestInstallation"("breedingId");

-- CreateIndex
CREATE INDEX "NestInstallation_farmId_idx" ON "NestInstallation"("farmId");

-- CreateIndex
CREATE INDEX "NestInstallation_installedAt_idx" ON "NestInstallation"("installedAt");

-- CreateIndex
CREATE INDEX "MortalityRecord_farmId_idx" ON "MortalityRecord"("farmId");

-- CreateIndex
CREATE INDEX "MortalityRecord_date_idx" ON "MortalityRecord"("date");

-- CreateIndex
CREATE INDEX "MortalityRecord_rabbitId_idx" ON "MortalityRecord"("rabbitId");

-- CreateIndex
CREATE INDEX "MortalityRecord_litterId_idx" ON "MortalityRecord"("litterId");

-- CreateIndex
CREATE INDEX "MortalityRecord_lotId_idx" ON "MortalityRecord"("lotId");

-- CreateIndex
CREATE INDEX "LotCageMovement_lotId_idx" ON "LotCageMovement"("lotId");

-- CreateIndex
CREATE INDEX "LotCageMovement_cageId_idx" ON "LotCageMovement"("cageId");

-- CreateIndex
CREATE INDEX "LotCageMovement_startedAt_idx" ON "LotCageMovement"("startedAt");

-- CreateIndex
CREATE INDEX "LotCageMovement_endedAt_idx" ON "LotCageMovement"("endedAt");

-- CreateIndex
CREATE INDEX "Task_automationKey_idx" ON "Task"("automationKey");

-- AddForeignKey
ALTER TABLE "NestInstallation" ADD CONSTRAINT "NestInstallation_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NestInstallation" ADD CONSTRAINT "NestInstallation_breedingId_fkey" FOREIGN KEY ("breedingId") REFERENCES "Breeding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortalityRecord" ADD CONSTRAINT "MortalityRecord_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortalityRecord" ADD CONSTRAINT "MortalityRecord_rabbitId_fkey" FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortalityRecord" ADD CONSTRAINT "MortalityRecord_litterId_fkey" FOREIGN KEY ("litterId") REFERENCES "Litter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortalityRecord" ADD CONSTRAINT "MortalityRecord_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "FatteningLot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotCageMovement" ADD CONSTRAINT "LotCageMovement_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "FatteningLot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LotCageMovement" ADD CONSTRAINT "LotCageMovement_cageId_fkey" FOREIGN KEY ("cageId") REFERENCES "Cage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
