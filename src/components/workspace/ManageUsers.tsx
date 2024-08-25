'use client';

import React, { FC, useEffect, useState } from 'react';
import { InvitationStatus, UserRole } from '@prisma/client';
import { TableUserDetails } from '@/helpers/workspace/table-helpers';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import RoleSelector from './RoleSelector';
import { Button } from '../ui/button';
import {
  useRemoveUserFromWorkspace,
  useRevokeUserInvitation,
  useSendInvitation,
  useUpdateWorkspaceUserRole,
} from '@/helpers/workspace/query-helpers';
import WorkspaceUser from './WorkspaceUser';
import { useModal } from '../providers/ModalProvider';

type Props = {
  users: TableUserDetails[];
  workspaceId: string;
  hasRights: boolean;
};

const ManageUsers: FC<Props> = ({ users, workspaceId, hasRights }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.READ_WRITE);
  const { setIsLoading } = useModal();

  const { sendInvitation, isSendingInvitation } = useSendInvitation();
  const { removeUserFromWorkspace, isRemovingUser } =
    useRemoveUserFromWorkspace();
  const { updateWorkspaceUserRole, isUpdatingWorkspaceUserRole } =
    useUpdateWorkspaceUserRole();
  const { revokeInvitation, isRevokingInvitation } = useRevokeUserInvitation();

  useEffect(() => {
    if (isRemovingUser || isRevokingInvitation || isUpdatingWorkspaceUserRole) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isRemovingUser, isRevokingInvitation, isUpdatingWorkspaceUserRole]);

  const onSendInvitation = () => {
    sendInvitation({ workspaceId, email, role });
  };

  const onRemoveUser = (userId: string, status: InvitationStatus) => {
    if (status === InvitationStatus.PENDING) {
      revokeInvitation(userId);
    } else {
      removeUserFromWorkspace({ userId, workspaceId });
    }
  };

  const onRoleChange = (role: UserRole, userId: string) => {
    updateWorkspaceUserRole({ userId, workspaceId, role });
  };

  return (
    <div className='pt-6'>
      <Label htmlFor='email' className='text-blue-100 ml-1'>
        Email address
      </Label>
      <div className='flex items-center gap-4'>
        <div className='relative flex flex-1 rounded-md py-2'>
          <Input
            id='email'
            placeholder='Enter email address'
            autoComplete='off'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='share-input'
          />
          <RoleSelector
            role={role}
            isAbsolute
            hasRights
            onRoleChange={setRole}
          />
        </div>
        <Button
          type='submit'
          onClick={onSendInvitation}
          className='gradient-blue flex h-full gap-1 px-5'
          isLoading={isSendingInvitation}
          disabled={!email}
        >
          Invite
        </Button>
      </div>

      <ul className='flex flex-col mt-6 mb-2'>
        {users.map(user => (
          <WorkspaceUser
            key={user.id}
            user={user}
            hasRights={hasRights}
            onRoleChange={onRoleChange}
            onRemoveUser={onRemoveUser}
          />
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
