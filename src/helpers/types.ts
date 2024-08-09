import { WorkspaceUser } from '@prisma/client';

export type MutationProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export type WorkspaceWithUser = {
  users: WorkspaceUser[];
  id: string;
  name: string;
  coverUrl: string;
  logoUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
