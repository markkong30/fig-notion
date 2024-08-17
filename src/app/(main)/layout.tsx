'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Spinner from '@/components/global/Spinner';
import { useGetWorkspace } from '@/helpers/workspace/query-helpers';
import { useUser } from '@clerk/nextjs';

type Props = {
  children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
  const user = useUser();
  const workspaceId = user.user?.publicMetadata.currentWorkspaceId as string;

  const { workspace, isGettingWorkspace } = useGetWorkspace(workspaceId);

  if (isGettingWorkspace) {
    return <Spinner size={50} />;
  }

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <div className='w-screen h-screen'>
      <Sidebar workspace={workspace}>{children}</Sidebar>
    </div>
  );
};

export default MainLayout;
