import { Prisma, User, UserRole } from '@prisma/client';
import { getWorkspace } from './queries';
import { AppState } from '@excalidraw/excalidraw/types/types';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { JSONContent } from 'novel';

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

export type SendUserInvitationParams = {
  workspaceId: string;
  role: UserRole;
  email: string;
};

export type UpdateUserWorkspaceMetaDataParams = {
  workspaceId: string;
  userId: string;
};

export type RemoveUserFromWorkspaceParams = {
  workspaceId: string;
  userId: string;
};

export type UpdateWorkspaceUserRoleParams = {
  userId: string;
  workspaceId: string;
  role: UserRole;
};

export type UpdateDocumentParams = {
  documentId: string;
  editorState: JSONContent | null;
  canvasState: Canvas | null;
};

export type Canvas = {
  elements: readonly ExcalidrawElement[];
  appState: AppState;
};
