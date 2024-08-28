'use server';

import { db } from './db';

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
    include: {
      editor: true,
      diagram: true,
    },
  });

  return document;
};
