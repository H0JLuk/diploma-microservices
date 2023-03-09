-- CreateEnum
CREATE TYPE "enum_question_type" AS ENUM ('single', 'multiple', 'input');

-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "is_random_answers" BOOLEAN NOT NULL DEFAULT false,
    "creator_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testSubject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "testSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT,
    "type" "enum_question_type" NOT NULL,
    "test_answer" VARCHAR,
    "categoryId" INTEGER,
    "test_id" INTEGER NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_to_question" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "is_right" BOOLEAN NOT NULL DEFAULT false,
    "question_id" INTEGER NOT NULL,

    CONSTRAINT "answer_to_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_history" (
    "id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "student_id" INTEGER NOT NULL,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "test_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_history_answer" (
    "id" SERIAL NOT NULL,
    "testHistoryId" INTEGER NOT NULL,
    "questionAnswerId" INTEGER,

    CONSTRAINT "test_history_answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_name_key" ON "test"("name");

-- CreateIndex
CREATE UNIQUE INDEX "testSubject_name_key" ON "testSubject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "question_text_image_test_id_key" ON "question"("text", "image", "test_id");

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "testSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_to_question" ADD CONSTRAINT "answer_to_question_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_history_answer" ADD CONSTRAINT "test_history_answer_testHistoryId_fkey" FOREIGN KEY ("testHistoryId") REFERENCES "test_history"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_history_answer" ADD CONSTRAINT "test_history_answer_questionAnswerId_fkey" FOREIGN KEY ("questionAnswerId") REFERENCES "answer_to_question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
