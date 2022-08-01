-- CreateTable
CREATE TABLE "Following" (
    "id" SERIAL NOT NULL,
    "subredditName" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Following_subredditName_userId_key" ON "Following"("subredditName", "userId");

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_subredditName_fkey" FOREIGN KEY ("subredditName") REFERENCES "Subreddit"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
