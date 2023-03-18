/*
  Warnings:

  - You are about to drop the column `test_answer` on the `question` table. All the data in the column will be lost.
  - Made the column `categoryId` on table `question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "question" DROP COLUMN "test_answer",
ALTER COLUMN "categoryId" SET NOT NULL;

-- CreateTable
CREATE TABLE "question_category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "question_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "question_category_name_key" ON "question_category"("name");
