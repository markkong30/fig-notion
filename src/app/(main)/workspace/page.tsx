'use client';

import Spinner from '@/components/global/Spinner';
import DataTable from '@/components/workspace/DataTable';
import { useWorkspaceUsers } from '@/helpers/workspace/query-helpers';
import { columns } from '@/helpers/workspace/table-helpers';
import { useUser } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import { FC } from 'react';

const Workspace: FC = () => {
  const user = useUser();
  const workspaceId = user.user?.publicMetadata.currentWorkspaceId as string;

  const { userDetails, isGettingUserDetails } = useWorkspaceUsers(workspaceId);

  if (isGettingUserDetails) {
    return <Spinner size={50} />;
  }

  return (
    <div className='flex justify-center w-full m-12'>
      <DataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Manage
          </>
        }
        modalChildren={<></>}
        filterValue='name'
        columns={columns}
        data={userDetails}
      />
    </div>
  );
};

export default Workspace;
