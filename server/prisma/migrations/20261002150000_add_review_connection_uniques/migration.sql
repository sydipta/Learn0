-- CreateIndex
CREATE UNIQUE INDEX "Connection_requesterId_postId_key" ON "Connection"("requesterId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_connectionId_reviewerId_key" ON "Review"("connectionId", "reviewerId");
