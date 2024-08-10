import { getWorkspaces } from '@/lib/queries';
import { useQuery } from '@tanstack/react-query';

export const useGetWorkspaces = () => {
  const { data, isLoading, error, isFetched } = useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  });

  return {
    workspaces: data,
    isGettingWorkspaces: isLoading,
    isFetchedWorkspaces: isFetched,
    hasGetWorkspacesError: error,
  };
};
