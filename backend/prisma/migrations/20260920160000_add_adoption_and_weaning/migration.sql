-- Preserve existing adoption records while moving to the farm-scoped model.
ALTER TABLE "LitterAdoption"
  ADD COLUMN IF NOT EXISTS "farmId" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'LitterAdoption' AND column_name = 'date'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'LitterAdoption' AND column_name = 'adoptedAt'
  ) THEN
    ALTER TABLE "LitterAdoption" RENAME COLUMN "date" TO "adoptedAt";
  END IF;
END $$;

UPDATE "LitterAdoption" AS adoption
SET "farmId" = litter."farmId"
FROM "Litter" AS litter
WHERE litter."id" = adoption."sourceLitterId";

ALTER TABLE "LitterAdoption"
  ALTER COLUMN "farmId" SET NOT NULL,
  ALTER COLUMN "reason" TYPE TEXT USING "reason"::text,
  ALTER COLUMN "updatedAt" DROP DEFAULT;

DROP INDEX IF EXISTS "LitterAdoption_date_idx";
CREATE INDEX IF NOT EXISTS "LitterAdoption_farmId_idx" ON "LitterAdoption"("farmId");
CREATE INDEX IF NOT EXISTS "LitterAdoption_adoptedAt_idx" ON "LitterAdoption"("adoptedAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'LitterAdoption_farmId_fkey'
  ) THEN
    ALTER TABLE "LitterAdoption"
      ADD CONSTRAINT "LitterAdoption_farmId_fkey"
      FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Backfill the new required weaning fields before applying NOT NULL constraints.
ALTER TABLE "Weaning"
  ADD COLUMN IF NOT EXISTS "farmId" TEXT,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Weaning" AS weaning
SET
  "farmId" = litter."farmId",
  "plannedDate" = COALESCE(weaning."plannedDate", weaning."actualDate", weaning."createdAt"),
  "quantity" = COALESCE(weaning."quantity", 0)
FROM "Litter" AS litter
WHERE litter."id" = weaning."litterId";

ALTER TABLE "Weaning"
  ALTER COLUMN "farmId" SET NOT NULL,
  ALTER COLUMN "plannedDate" SET NOT NULL,
  ALTER COLUMN "quantity" SET NOT NULL,
  ALTER COLUMN "totalWeight" TYPE DECIMAL(65,30) USING "totalWeight"::numeric,
  ALTER COLUMN "averageWeight" TYPE DECIMAL(65,30) USING "averageWeight"::numeric,
  ALTER COLUMN "updatedAt" DROP DEFAULT;

DROP INDEX IF EXISTS "Weaning_litterId_key";
CREATE INDEX IF NOT EXISTS "Weaning_farmId_idx" ON "Weaning"("farmId");
CREATE INDEX IF NOT EXISTS "Weaning_plannedDate_idx" ON "Weaning"("plannedDate");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Weaning_farmId_fkey'
  ) THEN
    ALTER TABLE "Weaning"
      ADD CONSTRAINT "Weaning_farmId_fkey"
      FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Track individual rabbits assigned to adoptions and weanings.
CREATE TABLE "AdoptionRabbit" (
  "id" TEXT NOT NULL,
  "adoptionId" TEXT NOT NULL,
  "rabbitId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdoptionRabbit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdoptionRabbit_adoptionId_rabbitId_key"
  ON "AdoptionRabbit"("adoptionId", "rabbitId");
CREATE INDEX "AdoptionRabbit_adoptionId_idx" ON "AdoptionRabbit"("adoptionId");
CREATE INDEX "AdoptionRabbit_rabbitId_idx" ON "AdoptionRabbit"("rabbitId");

ALTER TABLE "AdoptionRabbit"
  ADD CONSTRAINT "AdoptionRabbit_adoptionId_fkey"
  FOREIGN KEY ("adoptionId") REFERENCES "LitterAdoption"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "AdoptionRabbit_rabbitId_fkey"
  FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "WeaningRabbit" (
  "id" TEXT NOT NULL,
  "weaningId" TEXT NOT NULL,
  "rabbitId" TEXT NOT NULL,
  "weight" DECIMAL(65,30),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WeaningRabbit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WeaningRabbit_weaningId_rabbitId_key"
  ON "WeaningRabbit"("weaningId", "rabbitId");
CREATE INDEX "WeaningRabbit_weaningId_idx" ON "WeaningRabbit"("weaningId");
CREATE INDEX "WeaningRabbit_rabbitId_idx" ON "WeaningRabbit"("rabbitId");

ALTER TABLE "WeaningRabbit"
  ADD CONSTRAINT "WeaningRabbit_weaningId_fkey"
  FOREIGN KEY ("weaningId") REFERENCES "Weaning"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "WeaningRabbit_rabbitId_fkey"
  FOREIGN KEY ("rabbitId") REFERENCES "Rabbit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
