import {
  createDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
  updateDocumentTitle,
} from '@/lib/queries-documents';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UpdateDocumentTitleParams } from './types';
import { refetchDocument } from './helpers';
import { pick } from 'lodash';
import { JSONContent } from 'novel';
import { UpdateDocumentParams } from '@/lib/queries.type';
import { ExcalidrawInitialDataState } from '@excalidraw/excalidraw/types/types';

export const useDocuments = (workspaceId: string) => {
  const { data, isLoading, error, isFetched } = useQuery({
    queryKey: ['documents', workspaceId],
    queryFn: () => getDocuments(workspaceId),
    enabled: !!workspaceId,
  });

  const { mutate: createDocumentMutation, isPending: isCreatingDocument } =
    useMutation({
      mutationFn: () => createDocument(workspaceId),
      onError: () => toast.error('Create document failed'),
    });

  const { mutate, isPending: isDeletingDocument } = useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onError: () => toast.error('Delete document failed'),
  });

  return {
    documents: data ?? [],
    isGettingDocuments: isLoading,
    isFetchedDocuments: isFetched,
    hasGetDocumentsError: error,
    deleteDocument: mutate,
    isDeletingDocument,
    createDocument: createDocumentMutation,
    isCreatingDocument,
  };
};

export const useDocument = (documentId: string) => {
  const { data, isLoading, error, isFetched } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => getDocument(documentId),
    enabled: !!documentId,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ documentId, title }: UpdateDocumentTitleParams) =>
      updateDocumentTitle(documentId, title),
    onSuccess: async () => {
      await refetchDocument(documentId);
      toast.success('Document title updated successfully');
    },
    onError: () => toast.error('Update document title failed'),
  });

  const { mutateAsync: updateDocumentMutation, isPending: isUpdatingDocument } =
    useMutation({
      mutationFn: async (params: UpdateDocumentParams) =>
        await updateDocument(params),
      onSuccess: () => toast.success('Document updated successfully'),
      onError: () => toast.error('Update document failed'),
    });

  const savedEditorValue = pick(data?.editor, [
    'type',
    'content',
  ]) as JSONContent;
  const initialCanvasData = pick(data?.canvas, [
    'elements',
    'appState',
  ]) as ExcalidrawInitialDataState;

  return {
    document: data,
    isGettingDocument: isLoading,
    isFetchedDocument: isFetched,
    hasGetDocumentError: error,
    updateDocumentTitle: mutateAsync,
    isUpdatingDocumentTitle: isPending,
    savedEditorValue,
    updateDocument: updateDocumentMutation,
    isUpdatingDocument,
    initialCanvasData,
  };
};

export const useGetDocument = (documentId: string) => {
  const { data, isLoading, error, isFetched } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => getDocument(documentId),
    enabled: !!documentId,
  });

  return {
    document: data,
    isGettingDocument: isLoading,
    isFetchedDocument: isFetched,
    hasGetDocumentError: error,
  };
};
