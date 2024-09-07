'use client';

import { ReactNode, useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Spinner from '@/components/global/Spinner';
import { useUpdateWorkspaceUserMetaData } from '@/helpers/workspace/query-helpers';
import { useUser } from '@clerk/nextjs';
import { useGetWorkspaces } from '@/helpers/redirect/query-helpers';
import { useParams } from 'next/navigation';

type Props = {
  children: ReactNode;
};

const MainLayout = ({ children }: Props) => {
  const { user } = useUser();
  const params = useParams();
  const workspaceId = user?.publicMetadata.currentWorkspaceId as string;
  const userId = user?.id as string;

  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(workspaceId);

  const { workspaces, isGettingWorkspaces } = useGetWorkspaces(userId);
  const { updateWorkspaceUserMetaData, isUpdatingWorkspaceUserMetaData } =
    useUpdateWorkspaceUserMetaData();
  const workspace =
    workspaces?.find(w => w.id === currentWorkspaceId) ?? workspaces?.[0];

  useEffect(() => {
    if (workspace?.id && workspace.id !== workspaceId) {
      updateWorkspaceUserMetaData({ userId, workspaceId: workspace.id });
      setCurrentWorkspaceId(workspace.id);
    } else {
      setCurrentWorkspaceId(workspaceId);
    }
  }, [workspaceId, workspace?.id]);

  const onWorkspaceChange = async (workspaceId: string) => {
    await updateWorkspaceUserMetaData({ userId, workspaceId });

    setCurrentWorkspaceId(workspaceId);
  };

  if (isGettingWorkspaces || isUpdatingWorkspaceUserMetaData || !workspace) {
    return <Spinner size={50} fullScreen />;
  }

  if (!workspace || !userId) {
    return <div>Workspace not found</div>;
  }

  if (params?.documentId) {
    return <div className='w-screen h-screen relative'>{children}</div>;
  }

  return (
    <div className='w-screen h-screen relative'>
      <Sidebar
        userId={userId}
        workspaces={workspaces}
        workspace={workspace}
        onWorkspaceChange={onWorkspaceChange}
      >
        <div className='hidden md:block absolute bottom-0 right-[-20%] w-56 h-56 2xl:w-48 2xl:h-48 bg-indigo-600 rounded-full blur-[10rem]'></div>
        <div className='hidden md:block absolute top-0 right-[-20%] w-56 h-56 2xl:w-48 2xl:h-48 bg-primary rounded-full blur-[10rem]'></div>
        {children}
      </Sidebar>
    </div>
  );
};

export default MainLayout;
