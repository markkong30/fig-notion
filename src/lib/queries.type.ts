import { Prisma, User, UserRole } from '@prisma/client';
import { getWorkspace } from './queries';

export type InitUserParams = Partial<User> & {
  workspaceId?: string;
  workspaceRole?: UserRole;
};

export type UpdateWorkspaceUsersParams = {
  userId: string;
  workspaceId: string;
  role: UserRole;
};

export type DetailedWorkspace = Prisma.PromiseReturnType<typeof getWorkspace>;
