import { z } from 'zod';

export const editOfficerSchema = z.object({
  officers: z
    .object({
      userId: z.string(),
      name: z.string(),
      email: z.string(),
      canRemove: z.boolean(),
      canTogglePresident: z.boolean(),
      position: z.enum(['President', 'Officer']),
      new: z.boolean().optional(),
    })
    .array(),
});
