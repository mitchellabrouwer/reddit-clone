/*
  Warnings:

  - A unique constraint covering the columns `[authorId,commentId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vote_authorId_commentId_key" ON "Vote"("authorId", "commentId");
