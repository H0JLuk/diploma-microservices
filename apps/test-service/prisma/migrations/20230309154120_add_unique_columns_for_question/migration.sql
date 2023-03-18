/*
  Warnings:

  - A unique constraint covering the columns `[name,subject_id]` on the table `test` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "test_name_key";

-- AlterTable
ALTER TABLE "subject" RENAME CONSTRAINT "testSubject_pkey" TO "subject_pkey";

-- AlterTable
ALTER TABLE "test_history" ALTER COLUMN "start_time" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "test_name_subject_id_key" ON "test"("name", "subject_id");

-- RenameIndex
ALTER INDEX "testSubject_name_key" RENAME TO "subject_name_key";
