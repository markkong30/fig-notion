'use client';

import clsx from 'clsx';
import { ColumnDef } from '@tanstack/react-table';
import { InvitationStatus, UserRole } from '@prisma/client';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Copy, MoreHorizontal, Trash } from 'lucide-react';

import { useState } from 'react';
import { DetailedWorkspace } from '@/lib/queries.type';
import { toast } from 'sonner';
import { removeUserFromWorkspace, revokeInvitation } from '@/lib/queries';
import { refetchWorkspaceDetails } from './helpers';

export type TableUserDetails = ReturnType<typeof formatWorkspaceUsers>[0];

export const getColumns = (
  user: TableUserDetails,
): ColumnDef<TableUserDetails>[] => [
  {
    accessorKey: 'id',
    header: '',
    cell: () => {
      return null;
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const avatarUrl = row.getValue('avatarUrl') as string;
      const email = row.getValue('email') as string;
      const name = row.getValue('name') as string;

      return (
        <div className='flex items-center gap-4'>
          <div className='h-11 w-11 relative flex-none'>
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                fill
                className='rounded-full object-cover'
                alt='avatar image'
              />
            ) : (
              <Avatar className='w-11 h-11'>
                <AvatarFallback>
                  {email[0].toUpperCase() ?? 'PD'}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <span>{name ?? 'Pending User'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'avatarUrl',
    header: '',
    cell: () => {
      return null;
    },
  },
  { accessorKey: 'email', header: 'Email' },

  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role: UserRole = row.getValue('role');
      const getRoleLabel = () => {
        switch (role) {
          case UserRole.OWNER:
            return 'Owner';
          case UserRole.ADMIN:
            return 'Admin';
          case UserRole.READ_WRITE:
            return 'Read & Write';
          case UserRole.READ:
            return 'Read';
          default:
            return '';
        }
      };

      return (
        <Badge
          className={clsx({
            'bg-primary': role === UserRole.OWNER,
            'bg-secondary': role === UserRole.ADMIN,
            'bg-muted': role === UserRole.READ_WRITE,
            'bg-slate-500': role === UserRole.READ,
          })}
        >
          {getRoleLabel()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      return (
        <Badge
          className={clsx({
            'bg-green-600 hover:bg-green-800':
              status === InvitationStatus.ACCEPTED,
            'bg-yellow-600 hover:bg-yellow-800':
              status === InvitationStatus.PENDING,
            'bg-muted hover:bg-muted-foreground':
              status === InvitationStatus.REVOKED,
          })}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions rowData={rowData} user={user} />;
    },
  },
];

interface CellActionsProps {
  rowData: TableUserDetails;
  user: TableUserDetails;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData, user }) => {
  const [loading, setLoading] = useState(false);
  const { status, id, workspaceId } = rowData;

  const hasRights =
    user.role === UserRole.ADMIN || user.role === UserRole.OWNER;
  const canDelete = hasRights && rowData.role !== UserRole.OWNER;

  if (!rowData) return;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className='flex gap-2'
            onClick={async () => {
              await navigator.clipboard.writeText(rowData?.email);
              toast('Success!', {
                description: 'The email has been copied to your clipboard',
              });
            }}
          >
            <Copy size={15} /> Copy Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {canDelete && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className='flex gap-2' onClick={() => {}}>
                <Trash size={15} /> Remove User
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-left'>
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className='text-left'>
            The user would be removed and would no longer have access to the
            workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex items-center'>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className='bg-destructive hover:bg-destructive'
            onClick={async () => {
              setLoading(true);
              if (status === InvitationStatus.PENDING) {
                await revokeInvitation(id); //invitationId;
              } else {
                await removeUserFromWorkspace(id, workspaceId); //userId
              }
              await refetchWorkspaceDetails(workspaceId);

              toast('User removed from workspace successfully');
              setLoading(false);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const formatWorkspaceUsers = (workspace?: DetailedWorkspace) => {
  const { users, invitations } = workspace ?? {};

  const formattedUsers =
    users?.map(user => {
      const invitation = invitations?.find(
        invitation => invitation.email === user?.user.email,
      );

      return {
        ...user.user,
        workspaceId: user.workspaceId,
        status:
          user?.role === UserRole.OWNER
            ? InvitationStatus.ACCEPTED
            : (invitation?.status ?? InvitationStatus.REVOKED),
        role: user?.role ?? UserRole.READ,
      };
    }) ?? [];

  return formattedUsers;
};
