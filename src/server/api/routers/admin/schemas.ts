import { z } from 'zod';
import { club } from '@/server/db/schema/club';

export const tagReplaceSchema = z.object({
  oldTag: z.string(),
  newTag: z.string(),
});

export const bySlugSchema = z.object({
  slug: z.string().default(''),
});

export const deleteSchema = z.object({
  id: z.string(),
});

export const changeClubStatusSchema = z.object({
  clubId: z.string(),
  status: z.enum(club.approved.enumValues),
});
