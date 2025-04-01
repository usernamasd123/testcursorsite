-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "clicks" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "reactions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "UserSession" ADD COLUMN     "messageTimes" TIMESTAMP(3)[];
