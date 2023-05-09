/*
  Warnings:

  - You are about to drop the column `start_time` on the `test_history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "test_history" DROP COLUMN "start_time",
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
