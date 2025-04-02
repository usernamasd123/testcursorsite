-- AlterTable
ALTER TABLE "Message" RENAME CONSTRAINT "Message_new_pkey" TO "Message_pkey",
ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false;
