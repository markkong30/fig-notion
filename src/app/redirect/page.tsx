'use client';

import { useEffect } from 'react';
import Spinner from '@/components/global/Spinner';
import { useGetWorkspaces } from '@/helpers/redirect/query-helpers';
import { useRouter } from 'next/navigation';

const Redirect = () => {
  const router = useRouter();

  const { getWorkspaces } = useGetWorkspaces({
    onSuccess: workspaces => {
      if (!workspaces.length) {
        return router.replace('/create-workspace');
      }

      const workspaceId = workspaces[0].id;

      return router.replace(`/dashboard/${workspaceId}`);
    },
  });

  useEffect(() => {
    getWorkspaces();
  }, []);

  return <Spinner size={50} />;
};

export default Redirect;
