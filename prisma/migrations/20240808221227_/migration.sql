/*
  Warnings:

  - You are about to drop the `_UserWorkspaces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WorkspaceAdmins` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserWorkspaces" DROP CONSTRAINT "_UserWorkspaces_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserWorkspaces" DROP CONSTRAINT "_UserWorkspaces_B_fkey";

-- DropForeignKey
ALTER TABLE "_WorkspaceAdmins" DROP CONSTRAINT "_WorkspaceAdmins_A_fkey";

-- DropForeignKey
ALTER TABLE "_WorkspaceAdmins" DROP CONSTRAINT "_WorkspaceAdmins_B_fkey";

-- DropTable
DROP TABLE "_UserWorkspaces";

-- DropTable
DROP TABLE "_WorkspaceAdmins";

-- CreateTable
CREATE TABLE "UserWorkspace" (
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWorkspace_pkey" PRIMARY KEY ("userId","workspaceId")
);

-- CreateTable
CREATE TABLE "AdminWorkspace" (
    "adminId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminWorkspace_pkey" PRIMARY KEY ("adminId","workspaceId")
);

-- CreateIndex
CREATE INDEX "UserWorkspace_userId_idx" ON "UserWorkspace"("userId");

-- CreateIndex
CREATE INDEX "UserWorkspace_workspaceId_idx" ON "UserWorkspace"("workspaceId");

-- CreateIndex
CREATE INDEX "AdminWorkspace_adminId_idx" ON "AdminWorkspace"("adminId");

-- CreateIndex
CREATE INDEX "AdminWorkspace_workspaceId_idx" ON "AdminWorkspace"("workspaceId");

-- AddForeignKey
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkspace" ADD CONSTRAINT "UserWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminWorkspace" ADD CONSTRAINT "AdminWorkspace_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminWorkspace" ADD CONSTRAINT "AdminWorkspace_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
