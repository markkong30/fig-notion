import {
  createWorkSpace,
  getWorkspace,
  removeUserFromWorkspace,
  revokeInvitation,
  sendUserInvitation,
  updateCurrentWorkspaceMetaData,
  updateWorkspaceUserRole,
} from '@/lib/queries';
import { useMutation, useQuery } from '@tanstack/react-query';
import { InvitationStatus, Workspace } from '@prisma/client';
import { formatWorkspaceUsers, TableUserDetails } from './table-helpers';
import {
  RemoveUserFromWorkspaceParams,
  SendUserInvitationParams,
  UpdateUserWorkspaceMetaDataParams,
  UpdateWorkspaceUserRoleParams,
} from '@/lib/queries.type';
import { toast } from 'sonner';
import { refetchWorkspaceDetails } from './helpers';
import { useUser } from '@clerk/nextjs';

type CreateWorkspaceProps = {
  onSuccess: (data?: Workspace) => void;
};

export const useCreateWorkspace = ({ onSuccess }: CreateWorkspaceProps) => {
  const { mutate, data, isPending } = useMutation({
    mutationFn: async (workspace: Partial<Workspace>) =>
      await createWorkSpace(workspace),
    onSuccess,
    onError: () => toast.error('Create workspace failed'),
  });

  return {
    workspace: data,
    createWorkspace: mutate,
    isCreatingWorkspace: isPending,
  };
};

export const useGetWorkspace = (workspaceId: string) => {
  const { data, isLoading, error, isFetched } = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: async () => getWorkspace(workspaceId, false),
    enabled: !!workspaceId,
  });

  return {
    workspace: data,
    isGettingWorkspace: isLoading,
    isFetchedWorkspace: isFetched,
    hasGetWorkspaceError: error,
  };
};

export const useWorkspaceUsers = (workspaceId: string) => {
  const { data, isLoading, error, isFetched } = useQuery({
    queryKey: ['workspaceDetails', workspaceId],
    queryFn: async () => getWorkspace(workspaceId, true),
    enabled: !!workspaceId,
  });

  const formattedUsers = formatWorkspaceUsers(data);
  const pendingUsers =
    (data?.invitations.filter(
      invitation => invitation.status === InvitationStatus.PENDING,
    ) as unknown as TableUserDetails[]) ?? [];

  return {
    workspace: data,
    userDetails: formattedUsers,
    pendingUsers,
    isGettingUserDetails: isLoading,
    isFetchedUserDetails: isFetched,
    hasGetUserDetailsError: error,
  };
};

export const useUpdateWorkspaceUserMetaData = () => {
  const { user } = useUser();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      workspaceId,
      userId,
    }: UpdateUserWorkspaceMetaDataParams) =>
      await updateCurrentWorkspaceMetaData(userId, workspaceId),
    onSuccess: async () => await user?.reload(),
  });

  return {
    updateWorkspaceUserMetaData: mutate,
    isUpdatingWorkspaceUserMetaData: isPending,
  };
};

export const useSendInvitation = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      workspaceId,
      role,
      email,
    }: SendUserInvitationParams) =>
      await sendUserInvitation({ workspaceId, role, email }),
    onSuccess: async data => {
      await refetchWorkspaceDetails(data.workspaceId);

      toast.success('Invitation sent successfully');
    },
    onError: () => {
      toast.error('Send inivation failed', {
        description:
          'You can only send invitation to a user once before they accept or reject it',
      });
    },
  });

  return {
    sendInvitation: mutate,
    isSendingInvitation: isPending,
  };
};

export const useRemoveUserFromWorkspace = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      userId,
      workspaceId,
    }: RemoveUserFromWorkspaceParams) =>
      await removeUserFromWorkspace(userId, workspaceId),
    onSuccess: async data => {
      await refetchWorkspaceDetails(data.id);

      toast.success('User removed from workspace successfully');
    },
    onError: () => toast.error('Something went wrong. Please try again'),
  });

  return {
    removeUserFromWorkspace: mutate,
    isRemovingUser: isPending,
  };
};

export const useUpdateWorkspaceUserRole = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      userId,
      workspaceId,
      role,
    }: UpdateWorkspaceUserRoleParams) =>
      await updateWorkspaceUserRole(userId, workspaceId, role),
    onSuccess: async data => {
      await refetchWorkspaceDetails(data.id);

      toast.success('User role updated successfully');
    },
    onError: () => toast.error('Something went wrong. Please try again'),
  });

  return {
    updateWorkspaceUserRole: mutate,
    isUpdatingWorkspaceUserRole: isPending,
  };
};

export const useRevokeUserInvitation = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (invitationId: string) =>
      await revokeInvitation(invitationId),
    onSuccess: async data => {
      await refetchWorkspaceDetails(data.workspaceId);

      toast.success('Invitation revoked successfully');
    },
    onError: () => toast.error('Something went wrong. Please try again'),
  });

  return {
    revokeInvitation: mutate,
    isRevokingInvitation: isPending,
  };
};
