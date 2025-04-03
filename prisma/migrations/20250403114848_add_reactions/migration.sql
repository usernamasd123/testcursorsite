/*
  Warnings:

  - You are about to drop the column `cardId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `hour` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isError` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isLead` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `leadType` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isReturning` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `lastMessageTime` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `messageCount` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `messageTimes` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dialogue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessageReaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[messageId,sessionId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "MessageReaction" DROP CONSTRAINT "MessageReaction_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageReaction" DROP CONSTRAINT "MessageReaction_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_sessionId_fkey";

-- DropIndex
DROP INDEX "Message_cardId_idx";

-- DropIndex
DROP INDEX "Message_hour_idx";

-- DropIndex
DROP INDEX "Message_userId_idx";

-- DropIndex
DROP INDEX "UserSession_userId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "cardId",
DROP COLUMN "hour",
DROP COLUMN "isError",
DROP COLUMN "isLead",
DROP COLUMN "leadType",
DROP COLUMN "rating",
DROP COLUMN "sessionId",
DROP COLUMN "timestamp",
DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserSession" DROP COLUMN "isReturning",
DROP COLUMN "lastMessageTime",
DROP COLUMN "messageCount",
DROP COLUMN "messageTimes",
DROP COLUMN "updatedAt",
DROP COLUMN "userId";

-- DropTable
DROP TABLE "Card";

-- DropTable
DROP TABLE "Dialogue";

-- DropTable
DROP TABLE "MessageReaction";

-- DropTable
DROP TABLE "Session";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_messageId_sessionId_key" ON "Reaction"("messageId", "sessionId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "UserSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
