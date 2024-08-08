'use server';

import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { db } from './db';
import { Plan, User, Workspace } from '@prisma/client';

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

export const createWorkSpace = async (workspace: Workspace) => {
  const user = await currentUser();
  if (!user) return;

  const workspaceData = await db.workspace.create({
    data: {
      ...workspace,
      users: {
        connect: { id: user.id },
      },
      admins: {
        connect: { id: user.id },
      },
    },
  });

  return workspaceData;
};
