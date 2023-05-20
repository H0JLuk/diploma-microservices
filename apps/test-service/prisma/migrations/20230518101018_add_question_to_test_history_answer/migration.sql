/*
  Warnings:

  - Added the required column `questionId` to the `test_history_answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "test_history_answer" ADD COLUMN     "questionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "test_history_answer" ADD CONSTRAINT "test_history_answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
