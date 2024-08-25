import { getWorkspaces } from '@/lib/queries';
import { useQuery } from '@tanstack/react-query';

export const useGetWorkspaces = (userId?: string) => {
  const { data, isLoading, error, isFetched } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => getWorkspaces(userId ?? ''),
    enabled: !!userId,
  });

  return {
    workspaces: data,
    isGettingWorkspaces: isLoading,
    isFetchedWorkspaces: isFetched,
    hasGetWorkspacesError: error,
  };
};
