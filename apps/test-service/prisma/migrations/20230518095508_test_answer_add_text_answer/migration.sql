/*
  Warnings:

  - You are about to drop the column `questionAnswerId` on the `test_history_answer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "test_history_answer" DROP CONSTRAINT "test_history_answer_questionAnswerId_fkey";

-- AlterTable
ALTER TABLE "test_history_answer" DROP COLUMN "questionAnswerId",
ADD COLUMN     "answerId" INTEGER;

-- AddForeignKey
ALTER TABLE "test_history_answer" ADD CONSTRAINT "test_history_answer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "answer_to_question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
