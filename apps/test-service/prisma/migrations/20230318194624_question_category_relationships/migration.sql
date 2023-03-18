-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "question_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
