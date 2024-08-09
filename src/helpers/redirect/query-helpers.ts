import { getWorkspaces } from '@/lib/queries';
import { useMutation } from '@tanstack/react-query';
import { WorkspaceWithUser } from '../types';

type GetWorkspaceProps = {
  onSuccess: (data: WorkspaceWithUser[]) => void;
};

export const useGetWorkspaces = ({ onSuccess }: GetWorkspaceProps) => {
  const { mutate, data, isPending } = useMutation({
    mutationFn: getWorkspaces,
    onSuccess,
  });

  return {
    workspaces: data,
    getWorkspaces: mutate,
    isGettingWorkspaces: isPending,
  };
};
