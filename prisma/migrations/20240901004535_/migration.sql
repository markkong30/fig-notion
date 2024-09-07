/*
  Warnings:

  - You are about to drop the `ExcalidrawElement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcalidrawEmbeddableElement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcalidrawFrameElement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcalidrawFreeDrawElement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcalidrawImageElement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcalidrawLinearElement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExcalidrawTextElement` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[documentId]` on the table `Editor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_editorId_fkey";

-- DropForeignKey
ALTER TABLE "ExcalidrawElement" DROP CONSTRAINT "ExcalidrawElement_documentId_fkey";

-- DropIndex
DROP INDEX "Document_editorId_key";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "canvasId" TEXT;

-- AlterTable
ALTER TABLE "Editor" ADD COLUMN     "documentId" TEXT;

-- DropTable
DROP TABLE "ExcalidrawElement";

-- DropTable
DROP TABLE "ExcalidrawEmbeddableElement";

-- DropTable
DROP TABLE "ExcalidrawFrameElement";

-- DropTable
DROP TABLE "ExcalidrawFreeDrawElement";

-- DropTable
DROP TABLE "ExcalidrawImageElement";

-- DropTable
DROP TABLE "ExcalidrawLinearElement";

-- DropTable
DROP TABLE "ExcalidrawTextElement";

-- CreateTable
CREATE TABLE "Canvas" (
    "id" TEXT NOT NULL,
    "elements" JSONB[],
    "appState" JSONB,
    "documentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Canvas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Canvas_documentId_key" ON "Canvas"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Editor_documentId_key" ON "Editor"("documentId");

-- AddForeignKey
ALTER TABLE "Editor" ADD CONSTRAINT "Editor_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Canvas" ADD CONSTRAINT "Canvas_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
