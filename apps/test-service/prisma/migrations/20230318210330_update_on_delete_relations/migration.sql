-- DropForeignKey
ALTER TABLE "question" DROP CONSTRAINT "question_test_id_fkey";

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
