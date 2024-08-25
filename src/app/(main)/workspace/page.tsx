'use client';

import Spinner from '@/components/global/Spinner';
import Heading from '@/components/global/typography/Heading';
import DataTable from '@/components/workspace/DataTable';
import ManageUsers from '@/components/workspace/ManageUsers';
import { useWorkspaceUsers } from '@/helpers/workspace/query-helpers';
import { getColumns } from '@/helpers/workspace/table-helpers';
import { useUser } from '@clerk/nextjs';
import { UserRole } from '@prisma/client';
import { Plus } from 'lucide-react';
import { FC } from 'react';

const Workspace: FC = () => {
  const { user } = useUser();
  const workspaceId = user?.publicMetadata.currentWorkspaceId as string;

  const {
    workspace,
    userDetails,
    pendingUsers,
    isGettingUserDetails,
    isFetchedUserDetails,
  } = useWorkspaceUsers(workspaceId);

  const currentUser = userDetails.find(u => u.id === user?.id);
  const hasRights =
    currentUser?.role === UserRole.OWNER ||
    currentUser?.role === UserRole.ADMIN;
  const allUsers = [...userDetails, ...pendingUsers];

  if (isGettingUserDetails) {
    return <Spinner size={50} fullScreen />;
  }

  if (isFetchedUserDetails && (!workspace || !currentUser)) {
    return <Heading margin='lg'>Workspace not found</Heading>;
  }

  return (
    <div className='w-full m-12'>
      <div className='flex flex-col items-center'>
        <DataTable
          actionButtonText={
            <>
              <Plus size={15} />
              Manage
            </>
          }
          modalChildren={
            <ManageUsers
              users={allUsers}
              workspaceId={workspaceId}
              hasRights={hasRights}
            />
          }
          filterValue='name'
          columns={getColumns(currentUser!)}
          data={allUsers}
        />
      </div>
    </div>
  );
};

export default Workspace;
