/*
  Warnings:

  - The values [COMPLETED] on the enum `BreedingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BreedingStatus_new" AS ENUM ('PLANNED', 'AWAITING_PALPATION', 'PREGNANT', 'NON_PREGNANT', 'INCONCLUSIVE', 'BIRTH_RECORDED', 'CANCELLED');
ALTER TABLE "public"."Breeding" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Breeding" ALTER COLUMN "status" TYPE "BreedingStatus_new" USING ("status"::text::"BreedingStatus_new");
ALTER TYPE "BreedingStatus" RENAME TO "BreedingStatus_old";
ALTER TYPE "BreedingStatus_new" RENAME TO "BreedingStatus";
DROP TYPE "public"."BreedingStatus_old";
ALTER TABLE "Breeding" ALTER COLUMN "status" SET DEFAULT 'PLANNED';
COMMIT;

-- AlterTable
ALTER TABLE "Breeding" ALTER COLUMN "status" SET DEFAULT 'PLANNED';
