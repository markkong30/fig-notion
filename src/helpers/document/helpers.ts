import { queryClient } from '@/components/providers/QueryClientWrapper';

export const refetchDocuments = async (workspaceId: string) => {
  await queryClient.refetchQueries({
    queryKey: ['documents', workspaceId],
  });
};
