import { createWorkSpace, getWorkspace } from '@/lib/queries';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Workspace } from '@prisma/client';

type CreateWorkspaceProps = {
  onSuccess: (data?: Workspace) => void;
};

export const useCreateWorkspace = ({ onSuccess }: CreateWorkspaceProps) => {
  const { mutate, data, isPending } = useMutation({
    mutationFn: async (workspace: Partial<Workspace>) =>
      createWorkSpace(workspace),
    onSuccess,
  });

  return {
    workspace: data,
    createWorkspace: mutate,
    isCreatingWorkspace: isPending,
  };
};

export const useGetWorkspace = (workspaceId: string) => {
  const { data, isLoading, error, isFetched } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => getWorkspace(workspaceId),
  });

  return {
    workspace: data,
    isGettingWorkspace: isLoading,
    isFetchedWorkspace: isFetched,
    hasGetWorkspaceError: error,
  };
};
