/*
  Warnings:

  - Added the required column `budgetValue` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trafficSource` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Made the column `budget` on table `Card` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "budgetValue" INTEGER,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "foundedYear" INTEGER,
ADD COLUMN     "trafficSource" TEXT;

-- Устанавливаем значения по умолчанию для существующих записей
UPDATE "Card" 
SET 
  "budgetValue" = 1000,
  "trafficSource" = 'Facebook';

-- Делаем колонки NOT NULL
ALTER TABLE "Card" ALTER COLUMN "budgetValue" SET NOT NULL;
ALTER TABLE "Card" ALTER COLUMN "trafficSource" SET NOT NULL;
