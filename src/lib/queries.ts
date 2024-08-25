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
import {
  SendUserInvitationParams,
  UpdateWorkspaceUsersParams,
} from './queries.type';
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

  // await clerkClient.users.updateUserMetadata(user.id, {
  //   publicMetadata: {
  //     plan: newUser.plan ?? Plan.FREE,
  //   },
  // });

  const pendingInvitation = await checkUserInvitation(email);

  // if pending invitation exists, update DB and redirect to workspace
  if (pendingInvitation) {
    await updateWorkspaceUsers({
      userId: user.id,
      workspaceId: pendingInvitation.workspaceId,
      role: pendingInvitation.role,
    });
    await acceptInvitation(pendingInvitation.id);
    await updateCurrentWorkspaceMetaData(
      user.id,
      pendingInvitation.workspaceId,
    );

    return redirect('/dashboard');
  }

  // if no pending invitation, check if existing workspace exists
  const workspaces = user.publicMetadata?.workspaceIds as string[];
  const currentWorkspaceId = user.publicMetadata?.currentWorkspaceId as string;

  if (workspaces?.length) {
    if (!currentWorkspaceId) {
      await updateCurrentWorkspaceMetaData(user.id, workspaces[0]);
    }

    return redirect('/dashboard');
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
          role: UserRole.OWNER, // the creator must be an owner
        },
      },
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    publicMetadata: {
      currentWorkspaceId: workspaceData.id,
    },
  });

  return workspaceData;
};

export const getWorkspace = async (workspaceId: string, isDetail?: boolean) => {
  const user = await currentUser();
  if (!user) return null;

  const userWorkspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
      users: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      users: {
        include: {
          user: isDetail,
        },
      },
      invitations: isDetail,
    },
  });

  return userWorkspace;
};

export const getWorkspaces = async (userId: string) => {
  const userWorkspaces = (await db.workspace.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
    include: {
      users: true,
    },
  })) as WorkspaceWithUser[];

  const mappedWorkspaces =
    userWorkspaces.sort((a, b) => {
      const currentUserA = a.users.find(u => u.userId === userId);
      const currentUserB = b.users.find(u => u.userId === userId);

      if (
        currentUserA?.role === UserRole.OWNER &&
        currentUserB?.role !== UserRole.OWNER
      ) {
        return -1;
      }
      if (
        currentUserA?.role !== UserRole.OWNER &&
        currentUserB?.role === UserRole.OWNER
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

  return createdUser;
};

export const sendUserInvitation = async ({
  workspaceId,
  role,
  email,
}: SendUserInvitationParams) => {
  // return await new Promise(resolve => setTimeout(resolve, 5000));

  const user = await clerkClient.invitations.createInvitation({
    emailAddress: email,
    redirectUrl: process.env.NEXT_PUBLIC_URL_SIGN_UP,
    ignoreExisting: true,
    publicMetadata: {
      currentWorkspaceId: workspaceId,
    },
  });

  const invitation = await db.invitation.create({
    data: {
      userId: user.id,
      workspaceId,
      role,
      email,
      status: InvitationStatus.PENDING,
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

export const revokeInvitation = async (invitationId: string) => {
  const invitation = await db.invitation.update({
    where: {
      id: invitationId,
    },
    data: {
      status: InvitationStatus.REVOKED,
    },
  });

  return invitation;
};

export const updateCurrentWorkspaceMetaData = async (
  userId: string,
  workspaceId: string,
) => {
  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      currentWorkspaceId: workspaceId,
    },
  });
};

export const updateWorkspaceUserRole = async (
  userId: string,
  workspaceId: string,
  newRole: UserRole,
) => {
  const updatedWorkspace = await db.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      users: {
        update: {
          where: {
            userId_workspaceId: {
              userId,
              workspaceId,
            },
          },
          data: {
            role: newRole,
          },
        },
      },
    },
  });

  return updatedWorkspace;
};

export const removeUserFromWorkspace = async (
  userId: string,
  workspaceId: string,
) => {
  const user = await clerkClient.users.getUser(userId);

  const currentWorkspaceId = user.publicMetadata?.currentWorkspaceId as string;

  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      currentWorkspaceId:
        currentWorkspaceId === workspaceId ? '' : currentWorkspaceId,
    },
  });

  const updatedWorkspace = await db.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      users: {
        delete: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
      },
    },
  });

  return updatedWorkspace;
};

export const getUser = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};
