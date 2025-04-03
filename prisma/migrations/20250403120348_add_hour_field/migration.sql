-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "hour" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Message_hour_idx" ON "Message"("hour");
