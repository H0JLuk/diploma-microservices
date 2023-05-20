-- DropIndex
DROP INDEX "test_history_answer_testHistoryId_questionAnswerId_key";

-- AlterTable
ALTER TABLE "test_history_answer" ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "textAnswer" TEXT,
ALTER COLUMN "questionAnswerId" DROP NOT NULL,
ADD CONSTRAINT "test_history_answer_pkey" PRIMARY KEY ("id");
