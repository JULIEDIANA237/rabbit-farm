/*
  Warnings:

  - You are about to drop the column `breedAId` on the `CrossBreed` table. All the data in the column will be lost.
  - You are about to drop the column `breedBId` on the `CrossBreed` table. All the data in the column will be lost.
  - You are about to drop the column `earFeature` on the `Rabbit` table. All the data in the column will be lost.
  - You are about to drop the column `geneticType` on the `Rabbit` table. All the data in the column will be lost.
  - You are about to drop the column `mark` on the `Rabbit` table. All the data in the column will be lost.
  - You are about to drop the column `observation` on the `Rabbit` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Rabbit` table. All the data in the column will be lost.
  - Added the required column `parentBreedAId` to the `CrossBreed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentBreedBId` to the `CrossBreed` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CrossBreed" DROP CONSTRAINT "CrossBreed_breedAId_fkey";

-- DropForeignKey
ALTER TABLE "CrossBreed" DROP CONSTRAINT "CrossBreed_breedBId_fkey";

-- DropIndex
DROP INDEX "CrossBreed_breedAId_idx";

-- DropIndex
DROP INDEX "CrossBreed_breedBId_idx";

-- DropIndex
DROP INDEX "Rabbit_sex_idx";

-- DropIndex
DROP INDEX "Rabbit_status_idx";

-- AlterTable
ALTER TABLE "CrossBreed" DROP COLUMN "breedAId",
DROP COLUMN "breedBId",
ADD COLUMN     "parentBreedAId" TEXT NOT NULL,
ADD COLUMN     "parentBreedBId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Rabbit" DROP COLUMN "earFeature",
DROP COLUMN "geneticType",
DROP COLUMN "mark",
DROP COLUMN "observation",
DROP COLUMN "size",
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "weight" DECIMAL(65,30);

-- CreateIndex
CREATE INDEX "CrossBreed_parentBreedAId_idx" ON "CrossBreed"("parentBreedAId");

-- CreateIndex
CREATE INDEX "CrossBreed_parentBreedBId_idx" ON "CrossBreed"("parentBreedBId");

-- CreateIndex
CREATE INDEX "Rabbit_birthLitterId_idx" ON "Rabbit"("birthLitterId");

-- AddForeignKey
ALTER TABLE "CrossBreed" ADD CONSTRAINT "CrossBreed_parentBreedAId_fkey" FOREIGN KEY ("parentBreedAId") REFERENCES "Breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrossBreed" ADD CONSTRAINT "CrossBreed_parentBreedBId_fkey" FOREIGN KEY ("parentBreedBId") REFERENCES "Breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
