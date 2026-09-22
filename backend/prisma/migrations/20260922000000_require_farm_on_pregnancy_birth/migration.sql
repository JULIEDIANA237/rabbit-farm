-- Rattache a la ferme de l'accouplement les
-- enregistrements dont farmId est encore NULL.
UPDATE "Pregnancy" AS p
SET "farmId" = b."farmId"
FROM "Breeding" AS b
WHERE p."breedingId" = b."id"
  AND p."farmId" IS NULL;

UPDATE "Birth" AS bt
SET "farmId" = b."farmId"
FROM "Breeding" AS b
WHERE bt."breedingId" = b."id"
  AND bt."farmId" IS NULL;

-- farmId devient obligatoire.
ALTER TABLE "Pregnancy" ALTER COLUMN "farmId" SET NOT NULL;
ALTER TABLE "Birth" ALTER COLUMN "farmId" SET NOT NULL;

-- Suppression en cascade depuis la ferme
-- (aligne sur tous les autres modeles).
ALTER TABLE "Pregnancy" DROP CONSTRAINT "Pregnancy_farmId_fkey";
ALTER TABLE "Pregnancy"
  ADD CONSTRAINT "Pregnancy_farmId_fkey"
  FOREIGN KEY ("farmId") REFERENCES "Farm"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Birth" DROP CONSTRAINT "Birth_farmId_fkey";
ALTER TABLE "Birth"
  ADD CONSTRAINT "Birth_farmId_fkey"
  FOREIGN KEY ("farmId") REFERENCES "Farm"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Index manquants sur le filtre multi-ferme.
CREATE INDEX "Pregnancy_farmId_idx" ON "Pregnancy"("farmId");
CREATE INDEX "Birth_farmId_idx" ON "Birth"("farmId");
