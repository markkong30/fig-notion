'use server';

import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { db } from './db';
import { Plan, User, UserRole, Workspace } from '@prisma/client';
import { createWorkspaceValidation } from './validation';

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      plan: newUser.plan ?? Plan.FREE,
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      plan: newUser.plan ?? Plan.FREE,
    },
  });

  return userData;
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

  return workspaceData;
};

export const getUserWorkspaces = async () => {
  const user = await currentUser();
  if (!user) return;

  const userWorkspaces = await db.workspace.findMany({
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
  });

  return userWorkspaces;
};
