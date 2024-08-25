/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,userId,email]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Invitation_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_workspaceId_userId_email_key" ON "Invitation"("workspaceId", "userId", "email");
