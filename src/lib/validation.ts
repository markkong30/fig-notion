import { z } from 'zod';

export const createWorkspaceValidation = (obj: unknown) => {
  const schema = z.object({
    name: z.string(),
    coverUrl: z.string(),
    logoUrl: z.string(),
  });

  return schema.safeParse(obj).success;
};
