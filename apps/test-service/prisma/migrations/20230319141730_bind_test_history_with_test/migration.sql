/*
  Warnings:

  - Added the required column `test_id` to the `test_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "test_history" ADD COLUMN     "test_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "test_history" ADD CONSTRAINT "test_history_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
