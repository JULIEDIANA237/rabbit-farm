-- Saillies supplémentaires d'un même accouplement
CREATE TABLE "BreedingMating" (
    "id" TEXT NOT NULL,
    "breedingId" TEXT NOT NULL,
    "maleId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BreedingMating_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "BreedingMating_breedingId_idx" ON "BreedingMating"("breedingId");
CREATE INDEX "BreedingMating_maleId_date_idx" ON "BreedingMating"("maleId", "date");
ALTER TABLE "BreedingMating" ADD CONSTRAINT "BreedingMating_breedingId_fkey" FOREIGN KEY ("breedingId") REFERENCES "Breeding"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BreedingMating" ADD CONSTRAINT "BreedingMating_maleId_fkey" FOREIGN KEY ("maleId") REFERENCES "Rabbit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Note de l'application
CREATE TABLE "AppRating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "farmId" TEXT,
    "stars" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AppRating_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AppRating_userId_key" ON "AppRating"("userId");
ALTER TABLE "AppRating" ADD CONSTRAINT "AppRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Dernière activité des utilisateurs
ALTER TABLE "User" ADD COLUMN "lastSeenAt" TIMESTAMP(3);
