-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "editorId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Editor" (
    "id" TEXT NOT NULL,
    "type" TEXT,
    "attrs" JSONB,
    "content" JSONB,
    "marks" JSONB,
    "text" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Editor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcalidrawElement" (
    "id" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "strokeColor" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "fillStyle" TEXT NOT NULL,
    "strokeWidth" DOUBLE PRECISION NOT NULL,
    "strokeStyle" TEXT NOT NULL,
    "roundnessType" TEXT,
    "roundnessValue" DOUBLE PRECISION,
    "roughness" DOUBLE PRECISION NOT NULL,
    "opacity" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "angle" DOUBLE PRECISION NOT NULL,
    "seed" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "versionNonce" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL,
    "groupIds" TEXT[],
    "frameId" TEXT,
    "boundElements" JSONB,
    "updated" INTEGER NOT NULL,
    "link" TEXT,
    "locked" BOOLEAN NOT NULL,
    "customData" JSONB,
    "type" TEXT NOT NULL,
    "fontSize" DOUBLE PRECISION,
    "fontFamily" TEXT,
    "text" TEXT,
    "baseline" DOUBLE PRECISION,
    "textAlign" TEXT,
    "verticalAlign" TEXT,
    "containerId" TEXT,
    "originalText" TEXT,
    "lineHeight" DOUBLE PRECISION,
    "fileId" TEXT,
    "status" TEXT,
    "scale" DOUBLE PRECISION[],
    "name" TEXT,
    "validated" BOOLEAN,
    "points" JSONB,
    "lastCommittedPoint" JSONB,
    "startBinding" JSONB,
    "endBinding" JSONB,
    "startArrowhead" TEXT,
    "endArrowhead" TEXT,
    "pressures" JSONB,
    "simulatePressure" BOOLEAN,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "ExcalidrawElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcalidrawTextElement" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fontSize" DOUBLE PRECISION NOT NULL,
    "fontFamily" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "baseline" DOUBLE PRECISION NOT NULL,
    "textAlign" TEXT NOT NULL,
    "verticalAlign" TEXT NOT NULL,
    "containerId" TEXT,
    "originalText" TEXT NOT NULL,
    "lineHeight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ExcalidrawTextElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcalidrawImageElement" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileId" TEXT,
    "status" TEXT NOT NULL,
    "scale" DOUBLE PRECISION[],

    CONSTRAINT "ExcalidrawImageElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcalidrawFrameElement" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "ExcalidrawFrameElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcalidrawLinearElement" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "points" JSONB NOT NULL,
    "lastCommittedPoint" JSONB,
    "startBinding" JSONB,
    "endBinding" JSONB,
    "startArrowhead" TEXT,
    "endArrowhead" TEXT,

    CONSTRAINT "ExcalidrawLinearElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcalidrawFreeDrawElement" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "points" JSONB NOT NULL,
    "pressures" JSONB NOT NULL,
    "simulatePressure" BOOLEAN NOT NULL,
    "lastCommittedPoint" JSONB,

    CONSTRAINT "ExcalidrawFreeDrawElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcalidrawEmbeddableElement" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "validated" BOOLEAN,

    CONSTRAINT "ExcalidrawEmbeddableElement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_editorId_key" ON "Document"("editorId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "Editor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcalidrawElement" ADD CONSTRAINT "ExcalidrawElement_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
