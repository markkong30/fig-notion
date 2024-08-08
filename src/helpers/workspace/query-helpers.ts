import { createWorkSpace } from '@/lib/queries';
import { useMutation } from '@tanstack/react-query';
import { Workspace } from '@prisma/client';

type CreateWorkspaceParams = {
  onSuccess?: () => void;
};

export const useCreateWorkspace = ({ onSuccess }: CreateWorkspaceParams) => {
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
