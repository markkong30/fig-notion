import { useState } from 'react';
import Image from 'next/image';
import { InvitationStatus, UserRole } from '@prisma/client';
import { TableUserDetails } from '@/helpers/workspace/table-helpers';
import RoleSelector from './RoleSelector';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

type Props = {
  user: TableUserDetails;
  hasRights: boolean;
  onRoleChange: (role: UserRole, userId: string) => void;
  onRemoveUser: (userId: string, status: InvitationStatus) => void;
};
const WorkspaceUser = ({
  user,
  hasRights,
  onRoleChange,
  onRemoveUser,
}: Props) => {
  const isPendingUser = user.status === InvitationStatus.PENDING;

  return (
    <li className='flex items-center justify-between gap-2 py-3'>
      <div className='flex gap-2'>
        {isPendingUser ? (
          <Avatar className='w-10 h-10'>
            <AvatarFallback>
              {user.email[0].toUpperCase() ?? 'PD'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Image
            src={user.avatarUrl}
            alt=''
            width={36}
            height={36}
            className='size-9 rounded-full'
          />
        )}

        <div>
          <p className='line-clamp-1 text-sm font-semibold leading-4 text-white'>
            {user.name ?? 'Pending User'}
          </p>
          <p className='text-sm font-light text-blue-100'>{user.email}</p>
        </div>
      </div>

      {user.role === UserRole.OWNER ? (
        <p className='text-sm text-blue-100'>Owner</p>
      ) : (
        <div className='flex items-center'>
          <RoleSelector
            role={user.role}
            hasRights={hasRights && !isPendingUser}
            onRoleChange={role => onRoleChange(role, user.id)}
          />
          <Button
            type='button'
            variant='ghost'
            noPadding
            className='text-red-700 font-semibold ml-9'
            onClick={() => onRemoveUser(user.id, user.status)}
          >
            Remove
          </Button>
        </div>
      )}
    </li>
  );
};

export default WorkspaceUser;
