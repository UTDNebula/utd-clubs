import { z } from 'zod';
import { fileSchema, schools, tagsSchema } from '@/lib/utils/schemas';

export const editClubDetailsSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Character limit reached'),
  alias: z
    .string()
    .max(100, 'Character limit reached')
    .nullable()
    .refine((val) => val === null || val.length === 0 || val.length >= 2, {
      message: 'Alias must be at least 2 characters',
    }),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(5000, 'Character limit reached'),
  tags: tagsSchema,
  profileImage: z.url().optional(),
  bannerImage: z.url().optional(),
  foundingDate: z.date().nullable(),
  clubSize: z.enum(['1-10', '10-50', '50-200', '200+']).nullable(),
  schools: schools,
});

export const editClubDetailsFormSchema = editClubDetailsSchema.extend({
  profileImage: fileSchema,
  bannerImage: fileSchema,
  clubSize: z.string(),
});
