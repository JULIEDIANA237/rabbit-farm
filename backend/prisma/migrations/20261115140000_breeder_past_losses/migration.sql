-- Passé des reproducteurs : pertes, cannibalisme, femelles saillies.
ALTER TABLE "Rabbit" ADD COLUMN "previousKitsLost" INTEGER;
ALTER TABLE "Rabbit" ADD COLUMN "cannibalismCases" INTEGER;
ALTER TABLE "Rabbit" ADD COLUMN "previousFemales" INTEGER;
