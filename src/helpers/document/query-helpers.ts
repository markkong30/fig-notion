import {
  createDocument,
  deleteDocument,
  getDocuments,
} from '@/lib/queries-documents';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

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
