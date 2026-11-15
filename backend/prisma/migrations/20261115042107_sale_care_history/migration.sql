-- CreateEnum
CREATE TYPE "CareScope" AS ENUM ('FARM', 'SECTION', 'CAGE', 'LOT', 'RABBIT');

-- AlterTable
ALTER TABLE "Farm" ADD COLUMN     "saleMinAgeDays" INTEGER NOT NULL DEFAULT 90,
ADD COLUMN     "saleMinWeightKg" DOUBLE PRECISION NOT NULL DEFAULT 2.5;

-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "packageName" TEXT,
ADD COLUMN     "packageSize" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Rabbit" ADD COLUMN     "healthHistory" TEXT,
ADD COLUMN     "lastBirthDate" TIMESTAMP(3),
ADD COLUMN     "maternalBehavior" TEXT,
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "previousKitsBorn" INTEGER,
ADD COLUMN     "previousLitters" INTEGER,
ADD COLUMN     "previousMatings" INTEGER,
ADD COLUMN     "readyForSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readyForSaleAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CareRecord" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "careType" TEXT NOT NULL,
    "scope" "CareScope" NOT NULL DEFAULT 'FARM',
    "sectionId" TEXT,
    "cageId" TEXT,
    "lotId" TEXT,
    "rabbitId" TEXT,
    "product" TEXT,
    "dose" TEXT,
    "animalCount" INTEGER,
    "notes" TEXT,
    "nextDate" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CareRecord_farmId_idx" ON "CareRecord"("farmId");

-- CreateIndex
CREATE INDEX "CareRecord_date_idx" ON "CareRecord"("date");

-- AddForeignKey
ALTER TABLE "CareRecord" ADD CONSTRAINT "CareRecord_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareRecord" ADD CONSTRAINT "CareRecord_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareRecord" ADD CONSTRAINT "CareRecord_cageId_fkey" FOREIGN KEY ("cageId") REFERENCES "Cage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareRecord" ADD CONSTRAINT "CareRecord_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "FatteningLot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareRecord" ADD CONSTRAINT "CareRecord_rabbitId_fkey" FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
