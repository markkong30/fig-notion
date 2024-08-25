import { queryClient } from '@/components/providers/QueryClientWrapper';

export const refetchWorkspaceDetails = async (workspaceId: string) => {
  await queryClient.refetchQueries({
    queryKey: ['workspaceDetails', workspaceId],
  });
};
