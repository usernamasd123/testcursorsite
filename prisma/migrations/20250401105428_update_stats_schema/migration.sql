/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `responseTime` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "createdAt",
DROP COLUMN "responseTime",
DROP COLUMN "topic",
DROP COLUMN "updatedAt",
ADD COLUMN     "isError" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leadType" TEXT,
ADD COLUMN     "rating" TEXT,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "cardId" DROP NOT NULL,
ALTER COLUMN "hour" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "isReturning" BOOLEAN NOT NULL DEFAULT false,
    "lastMessageTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_userId_key" ON "UserSession"("userId");
