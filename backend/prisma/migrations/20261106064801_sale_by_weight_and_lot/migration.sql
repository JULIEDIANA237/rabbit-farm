-- AlterTable
ALTER TABLE "SaleItem" ADD COLUMN     "lotId" TEXT,
ADD COLUMN     "pricePerKg" DECIMAL(65,30),
ADD COLUMN     "weightKg" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "SaleItem_lotId_idx" ON "SaleItem"("lotId");

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "FatteningLot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
