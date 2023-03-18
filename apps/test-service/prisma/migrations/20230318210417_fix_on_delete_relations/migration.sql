-- DropForeignKey
ALTER TABLE "test_history_answer" DROP CONSTRAINT "test_history_answer_testHistoryId_fkey";

-- AddForeignKey
ALTER TABLE "test_history_answer" ADD CONSTRAINT "test_history_answer_testHistoryId_fkey" FOREIGN KEY ("testHistoryId") REFERENCES "test_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;
