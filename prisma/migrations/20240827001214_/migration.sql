-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_editorId_fkey";

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "editorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "Editor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
