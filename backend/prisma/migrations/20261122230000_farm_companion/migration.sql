-- CreateEnum
CREATE TYPE "CompanionQuestionStatus" AS ENUM ('PENDING', 'ANSWERED', 'DISMISSED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Farm" ADD COLUMN     "companionEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "companionMaxPerDay" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "geocodedLocation" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "CompanionQuestion" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT,
    "rabbitId" TEXT,
    "refId" TEXT,
    "options" JSONB NOT NULL,
    "adviceKey" TEXT,
    "href" TEXT,
    "askAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "notifiedAt" TIMESTAMP(3),
    "status" "CompanionQuestionStatus" NOT NULL DEFAULT 'PENDING',
    "answer" TEXT,
    "answerLabel" TEXT,
    "answeredById" TEXT,
    "answeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanionQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompanionQuestion_farmId_status_askAt_idx" ON "CompanionQuestion"("farmId", "status", "askAt");

-- CreateIndex
CREATE INDEX "CompanionQuestion_notifiedAt_idx" ON "CompanionQuestion"("notifiedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CompanionQuestion_farmId_key_key" ON "CompanionQuestion"("farmId", "key");

-- AddForeignKey
ALTER TABLE "CompanionQuestion" ADD CONSTRAINT "CompanionQuestion_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

