import { z } from 'zod';

export const editOfficerSchema = z.object({
  collaborators: z
    .object({
      userId: z.string(),
      name: z.string(),
      email: z.string(),
      canRemove: z.boolean(),
      canTogglePresident: z.boolean(),
      position: z.enum(['Admin', 'Collaborator']),
      new: z.boolean().optional(),
    })
    .array(),
});
