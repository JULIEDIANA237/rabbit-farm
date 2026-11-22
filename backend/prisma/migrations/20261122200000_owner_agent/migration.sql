-- Agent de la propriétaire : propositions, journal, point du matin, erreurs serveur.
CREATE TYPE "AgentSuggestionStatus" AS ENUM ('PENDING', 'DONE', 'DISMISSED', 'EXPIRED');

CREATE TABLE "AgentSuggestion" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT,
    "href" TEXT,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "recipient" TEXT,
    "subject" TEXT,
    "draft" TEXT,
    "status" "AgentSuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentSuggestion_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AgentSuggestion_key_key" ON "AgentSuggestion"("key");
CREATE INDEX "AgentSuggestion_status_createdAt_idx" ON "AgentSuggestion"("status", "createdAt");

CREATE TABLE "AgentLog" (
    "id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "actorEmail" TEXT,
    "action" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "suggestionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AgentLog_createdAt_idx" ON "AgentLog"("createdAt");

CREATE TABLE "AgentBrief" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "usedAi" BOOLEAN NOT NULL DEFAULT false,
    "pending" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentBrief_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AgentBrief_createdAt_idx" ON "AgentBrief"("createdAt");

CREATE TABLE "AppError" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppError_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AppError_createdAt_idx" ON "AppError"("createdAt");
