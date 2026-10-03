-- CreateEnum
CREATE TYPE "RabbitPurpose" AS ENUM ('BREEDER', 'FATTENING', 'FUTURE_BREEDER', 'REFORM');

-- AlterTable
ALTER TABLE "Rabbit" ADD COLUMN     "purpose" "RabbitPurpose" NOT NULL DEFAULT 'FATTENING';

-- CreateTable
CREATE TABLE "RabbitPhoto" (
    "id" TEXT NOT NULL,
    "rabbitId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RabbitPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RabbitPhoto_rabbitId_idx" ON "RabbitPhoto"("rabbitId");

-- CreateIndex
CREATE INDEX "RabbitPhoto_rabbitId_isPrimary_idx" ON "RabbitPhoto"("rabbitId", "isPrimary");

-- AddForeignKey
ALTER TABLE "RabbitPhoto" ADD CONSTRAINT "RabbitPhoto_rabbitId_fkey" FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
