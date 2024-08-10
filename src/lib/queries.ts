'use server';

import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { db } from './db';
import {
  InvitationStatus,
  Plan,
  User,
  UserRole,
  Workspace,
} from '@prisma/client';
import { createWorkspaceValidation } from './validation';
import { WorkspaceWithUser } from '@/helpers/types';
import { UpdateWorkspaceUsersParams } from './queries.type';
import { redirect } from 'next/navigation';

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;

  const email = user.emailAddresses[0].emailAddress;

  // upsert user data
  await db.user.upsert({
    where: {
      email: email,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: email,
      name: user.fullName ?? `${user.firstName} ${user.lastName}`,
      plan: newUser.plan ?? Plan.FREE,
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      plan: newUser.plan ?? Plan.FREE,
    },
  });

  const pendingInvitation = await checkUserInvitation(email);

  // if pending invitation exists, update DB and redirect to workspace
  if (pendingInvitation) {
    await updateWorkspaceUsers({
      userId: user.id,
      workspaceId: pendingInvitation.workspaceId,
      role: pendingInvitation.role,
    });
    await acceptInvitation(pendingInvitation.id);

    return redirect(`/dashboard/${pendingInvitation.workspaceId}`);
  }

  // if no pending invitation, check if existing workspace exists
  const workspaces = user.publicMetadata?.workspaceIds as string[];

  if (workspaces?.length) {
    return redirect(`/dashboard/${workspaces[0]}`);
  } else {
    return redirect('/create-workspace');
  }
};

export const createWorkSpace = async (workspace: Partial<Workspace>) => {
  const user = await currentUser();
  if (!user) return;

  if (!createWorkspaceValidation(workspace)) return;

  const workspaceData = await db.workspace.create({
    data: {
      ...(workspace as Workspace),
      users: {
        create: {
          user: {
            connect: { id: user.id },
          },
          role: UserRole.ADMIN, // the creator must be an admin
        },
      },
    },
  });

  const currentWorkspaceIds =
    (user.publicMetadata?.workspaceIds as string[]) ?? [];

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      workspaceIds: [...currentWorkspaceIds, workspaceData.id],
    },
  });

  return workspaceData;
};

export const getWorkspaces = async () => {
  const user = await currentUser();
  if (!user) return [];

  const userWorkspaces = (await db.workspace.findMany({
    where: {
      users: {
        some: {
          userId: user?.id,
        },
      },
    },
    include: {
      users: true,
    },
  })) as WorkspaceWithUser[];

  const mappedWorkspaces =
    userWorkspaces.sort((a, b) => {
      const currentUserA = a.users.find(u => u.userId === user.id);
      const currentUserB = b.users.find(u => u.userId === user.id);

      if (
        currentUserA?.role === UserRole.ADMIN &&
        currentUserB?.role !== UserRole.ADMIN
      ) {
        return -1;
      }
      if (
        currentUserA?.role !== UserRole.ADMIN &&
        currentUserB?.role === UserRole.ADMIN
      ) {
        return 1;
      }
      return 0;
    }) ?? [];

  return mappedWorkspaces;
};

export const createUserWithWorkspace = async (
  workspaceId: string,
  role: UserRole,
) => {
  const user = await currentUser();
  if (!user) return;

  const createdUser = await db.user.create({
    data: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: user.fullName ?? `${user.firstName} ${user.lastName}`,
      plan: Plan.FREE,
      workspaces: {
        create: {
          workspace: {
            connect: { id: workspaceId },
          },
          role,
        },
      },
    },
  });

  const currentWorkspaceIds =
    (user.publicMetadata?.workspaceIds as string[]) ?? [];

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      workspaceIds: [...currentWorkspaceIds, workspaceId],
    },
  });

  return createdUser;
};

export const sendUserInvitation = async (
  workspaceId: string,
  role: UserRole,
) => {
  const user = await currentUser();
  if (!user) return;

  const currentWorkspaceIds =
    (user.publicMetadata?.workspaceIds as string[]) ?? [];

  await clerkClient.invitations.createInvitation({
    emailAddress: user.emailAddresses[0].emailAddress,
    redirectUrl: process.env.NEXT_PUBLIC_URL_SIGN_UP,
    ignoreExisting: true,
    publicMetadata: {
      workspaceIds: [...currentWorkspaceIds, workspaceId],
    },
  });

  const invitation = await db.invitation.create({
    data: {
      userId: user.id,
      workspaceId,
      role,
      status: InvitationStatus.PENDING,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return invitation;
};

export const checkUserInvitation = async (email: string) => {
  const pendingInvitation = await db.invitation.findFirst({
    where: {
      email,
      status: InvitationStatus.PENDING,
    },
  });

  return pendingInvitation;
};

export const updateWorkspaceUsers = async ({
  userId,
  workspaceId,
  role,
}: UpdateWorkspaceUsersParams) => {
  const workspace = await db.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      users: {
        create: {
          user: {
            connect: { id: userId },
          },
          role,
        },
      },
    },
  });

  return workspace;
};

export const acceptInvitation = async (invitationId: string) => {
  const invitation = await db.invitation.update({
    where: {
      id: invitationId,
    },
    data: {
      status: InvitationStatus.ACCEPTED,
    },
  });

  return invitation;
};
