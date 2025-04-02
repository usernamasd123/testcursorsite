-- CreateTable
CREATE TABLE "Dialogue" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dialogue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Dialogue_cardId_idx" ON "Dialogue"("cardId");
