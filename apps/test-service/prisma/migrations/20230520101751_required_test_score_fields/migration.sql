/*
  Warnings:

  - Made the column `score_for_3` on table `test` required. This step will fail if there are existing NULL values in that column.
  - Made the column `score_for_4` on table `test` required. This step will fail if there are existing NULL values in that column.
  - Made the column `score_for_5` on table `test` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "test" ALTER COLUMN "score_for_3" SET NOT NULL,
ALTER COLUMN "score_for_4" SET NOT NULL,
ALTER COLUMN "score_for_5" SET NOT NULL;
