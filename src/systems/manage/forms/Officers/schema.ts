import { z } from 'zod';

export const editListedOfficerSchema = z.object({
  officers: z
    .object({
      id: z.string().optional(),
      name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Character limit reached'),
      position: z
        .string()
        .min(1, 'Position is required')
        .max(100, 'Character limit reached'),
    })
    .array(),
});
