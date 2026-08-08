import { z } from 'zod';
import { tagsSchema } from '@/common/utils/schemas';

export const createClubSchema = z.object({
  name: z.object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Character limit reached'),
    alias: z
      .string()
      .max(100, 'Character limit reached')
      .optional()
      .refine(
        (val) => val === undefined || val.length === 0 || val.length >= 2,
        {
          message: 'Alias must be at least 2 characters',
        },
      ),
  }),
  meta: z.object({
    description: z.string().min(1, 'Description is required'),
    tags: tagsSchema,
  }),
});

export type CreateClubSchema = z.infer<typeof createClubSchema>;
