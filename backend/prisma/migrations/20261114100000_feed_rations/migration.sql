-- CreateEnum
CREATE TYPE "FeedingCategory" AS ENUM ('PREGNANT', 'LACTATING', 'FATTENING', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "InventoryItem" ADD COLUMN "rationsAppliedUntil" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "FeedRation" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "category" "FeedingCategory" NOT NULL,
    "dailyQuantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedRation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeedRation_farmId_idx" ON "FeedRation"("farmId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedRation_inventoryItemId_category_key" ON "FeedRation"("inventoryItemId", "category");

-- AddForeignKey
ALTER TABLE "FeedRation" ADD CONSTRAINT "FeedRation_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedRation" ADD CONSTRAINT "FeedRation_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
