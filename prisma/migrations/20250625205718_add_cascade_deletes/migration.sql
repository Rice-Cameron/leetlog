-- DropForeignKey
ALTER TABLE "ProblemCategory" DROP CONSTRAINT "ProblemCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemCategory" DROP CONSTRAINT "ProblemCategory_problemId_fkey";

-- CreateIndex
CREATE INDEX "Problem_userId_idx" ON "Problem"("userId");

-- AddForeignKey
ALTER TABLE "ProblemCategory" ADD CONSTRAINT "ProblemCategory_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemCategory" ADD CONSTRAINT "ProblemCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
