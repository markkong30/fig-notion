import { User, UserRole } from '@prisma/client';

export type InitUserParams = Partial<User> & {
  workspaceId?: string;
  workspaceRole?: UserRole;
};

export type UpdateWorkspaceUsersParams = {
  userId: string;
  workspaceId: string;
  role: UserRole;
};
