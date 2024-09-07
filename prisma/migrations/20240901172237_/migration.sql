/*
  Warnings:

  - You are about to drop the column `canvasId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `editorId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the `Canvas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Editor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Canvas" DROP CONSTRAINT "Canvas_documentId_fkey";

-- DropForeignKey
ALTER TABLE "Editor" DROP CONSTRAINT "Editor_documentId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "canvasId",
DROP COLUMN "editorId",
ADD COLUMN     "canvas" JSONB,
ADD COLUMN     "editor" JSONB;

-- DropTable
DROP TABLE "Canvas";

-- DropTable
DROP TABLE "Editor";
