'use client';

import clsx from 'clsx';
import { ColumnDef } from '@tanstack/react-table';
import { InvitationStatus, UserRole } from '@prisma/client';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
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
import { useRouter } from 'next/navigation';
import { DetailedWorkspace } from '@/lib/queries.type';
import { toast } from 'sonner';
import { deleteUser } from '@/lib/queries';

export type TableUserDetails = ReturnType<typeof formatWorkspaceUsers>[0];

export const columns: ColumnDef<TableUserDetails>[] = [
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
      return (
        <div className='flex items-center gap-4'>
          <div className='h-11 w-11 relative flex-none'>
            <Image
              src={avatarUrl}
              fill
              className='rounded-full object-cover'
              alt='avatar image'
            />
          </div>
          <span>{row.getValue('name')}</span>
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
    header: 'Permission',
    cell: ({ row }) => {
      const role: UserRole = row.getValue('role');
      return (
        <Badge
          className={clsx({
            'bg-primary': role === UserRole.ADMIN,
            'bg-secondary': role === UserRole.READ_WRITE,
            'bg-muted': role === UserRole.READ,
          })}
        >
          {role}
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

      return <CellActions rowData={rowData} />;
    },
  },
];

interface CellActionsProps {
  rowData: TableUserDetails;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
          {rowData.role !== UserRole.ADMIN && (
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
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className='text-left'>
            This action cannot be undone. This will permanently delete the user
            and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex items-center'>
          <AlertDialogCancel className='mb-2'>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className='bg-destructive hover:bg-destructive'
            onClick={async () => {
              setLoading(true);
              await deleteUser(rowData.id, rowData.workspaceId);
              toast('Deleted User', {
                description:
                  'The user has been deleted from this agency they no longer have access to the agency',
              });
              setLoading(false);
              router.refresh();
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
        invitation => invitation.userId === user?.userId,
      );

      return {
        ...user.user,
        workspaceId: user.workspaceId,
        status:
          user?.role === UserRole.ADMIN
            ? InvitationStatus.ACCEPTED
            : (invitation?.status ?? InvitationStatus.REVOKED),
        role: user?.role ?? UserRole.READ,
      };
    }) ?? [];

  return formattedUsers;
};
