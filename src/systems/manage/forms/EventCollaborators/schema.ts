import { z } from 'zod';

export const editCollaboratorsSchema = z.object({
  collaborators: z
    .object({
      clubId: z.string(),
      status: z.enum(['Approved', 'Pending', 'Rejected']),
      role: z.string(),
      inviteDate: z.date(),
      responseDate: z.date().nullable().optional(),
    })
    .array(),
});
