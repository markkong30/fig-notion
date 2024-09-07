'use server';

import { Prisma } from '@prisma/client';
import { db } from './db';
import { UpdateDocumentParams } from './queries.type';

export const getDocuments = async (workspaceId: string) => {
  const documents = await db.document.findMany({
    where: {
      workspaceId,
    },
  });

  return documents;
};

export const createDocument = async (workspaceId: string) => {
  const document = await db.document.create({
    data: {
      workspaceId,
      title: 'Untitled Document',
    },
  });

  return document;
};

export const deleteDocument = async (documentId: string) => {
  const document = await db.document.delete({
    where: {
      id: documentId,
    },
  });

  return document;
};

export const getDocument = async (documentId: string) => {
  const document = await db.document.findUnique({
    where: {
      id: documentId,
    },
  });

  return document;
};

export const updateDocumentTitle = async (
  documentId: string,
  title: string,
) => {
  const document = await db.document.update({
    where: {
      id: documentId,
    },
    data: {
      title,
    },
  });

  return document;
};

export const updateDocument = async ({
  documentId,
  editorState,
  canvasState,
}: UpdateDocumentParams) => {
  const updatedDocument = await db.document.update({
    where: { id: documentId },
    data: {
      editor: editorState!,
      canvas: canvasState as unknown as Prisma.InputJsonValue,
    },
  });

  return updatedDocument;
};
