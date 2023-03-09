/*
  Warnings:

  - The primary key for the `test_history_answer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `test_history_answer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[testHistoryId,questionAnswerId]` on the table `test_history_answer` will be added. If there are existing duplicate values, this will fail.
  - Made the column `questionAnswerId` on table `test_history_answer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "test_history_answer" DROP CONSTRAINT "test_history_answer_questionAnswerId_fkey";

-- AlterTable
ALTER TABLE "test_history_answer" DROP CONSTRAINT "test_history_answer_pkey",
DROP COLUMN "id",
ALTER COLUMN "questionAnswerId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "test_history_answer_testHistoryId_questionAnswerId_key" ON "test_history_answer"("testHistoryId", "questionAnswerId");

-- AddForeignKey
ALTER TABLE "test_history_answer" ADD CONSTRAINT "test_history_answer_questionAnswerId_fkey" FOREIGN KEY ("questionAnswerId") REFERENCES "answer_to_question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
