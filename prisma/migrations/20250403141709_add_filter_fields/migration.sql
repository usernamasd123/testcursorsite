/*
  Warnings:

  - Made the column `budget` on table `Card` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "budget" SET NOT NULL,
ALTER COLUMN "budgetValue" SET DEFAULT 0,
ALTER COLUMN "trafficSource" SET DEFAULT 'Facebook';
