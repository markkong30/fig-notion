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
    <div className='w-screen h-screen relative'>
      <Sidebar workspace={workspace}>
        <div className='hidden md:block absolute bottom-0 right-[-20%] w-72 h-72 xl:w-48 xl:h-48 bg-indigo-600 rounded-full blur-[10rem]'></div>
        <div className='hidden md:block absolute top-0 right-[-20%] w-72 h-72 xl:w-48 xl:h-48 bg-primary rounded-full blur-[10rem]'></div>
        {children}
      </Sidebar>
    </div>
  );
};

export default MainLayout;
