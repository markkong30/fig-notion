import { User, UserRole } from '@prisma/client';

export type InitUserParams = Partial<User> & {
  workspaceId?: string;
  workspaceRole?: UserRole;
};

export type UpdateWorkspaceUsersParams = {
  workspaceId: string;
  role: UserRole;
};
