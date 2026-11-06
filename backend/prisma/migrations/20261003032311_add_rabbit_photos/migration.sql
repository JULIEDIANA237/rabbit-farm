/*
  Warnings:

  - You are about to drop the column `filename` on the `RabbitPhoto` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `RabbitPhoto` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `RabbitPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "RabbitPhoto_rabbitId_isPrimary_idx";

-- AlterTable
ALTER TABLE "RabbitPhoto" DROP COLUMN "filename",
DROP COLUMN "mimeType",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
