-- Nouveaux prix décidés le 22/11/2026 : 2 500 FCFA/mois, 25 000 FCFA/an.
ALTER TABLE "PlatformSetting" ALTER COLUMN "monthlyPrice" SET DEFAULT 2500;
ALTER TABLE "PlatformSetting" ALTER COLUMN "yearlyPrice" SET DEFAULT 25000;
UPDATE "PlatformSetting" SET "monthlyPrice" = 2500, "yearlyPrice" = 25000 WHERE "id" = 'default';
