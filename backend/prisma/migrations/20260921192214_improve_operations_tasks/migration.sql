/*
  Warnings:

  - The `sourceType` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskSourceType" AS ENUM ('MANUAL', 'BREEDING', 'PREGNANCY', 'BIRTH', 'WEANING', 'HEALTH', 'SALE', 'INVENTORY', 'OTHER');

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "supplier" TEXT;

-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN     "currentStock" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "LitterAdoption" ALTER COLUMN "reason" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "rabbitId" TEXT,
DROP COLUMN "sourceType",
ADD COLUMN     "sourceType" "TaskSourceType";

-- CreateIndex
CREATE INDEX "Task_rabbitId_idx" ON "Task"("rabbitId");

-- CreateIndex
CREATE INDEX "Task_sourceType_sourceId_idx" ON "Task"("sourceType", "sourceId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_rabbitId_fkey" FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
