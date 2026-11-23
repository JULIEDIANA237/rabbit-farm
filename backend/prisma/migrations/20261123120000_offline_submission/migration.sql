-- CreateTable
CREATE TABLE "OfflineSubmission" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfflineSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OfflineSubmission_farmId_createdAt_idx" ON "OfflineSubmission"("farmId", "createdAt");

-- AddForeignKey
ALTER TABLE "OfflineSubmission" ADD CONSTRAINT "OfflineSubmission_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
