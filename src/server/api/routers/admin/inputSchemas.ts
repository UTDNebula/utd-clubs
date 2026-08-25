import { z } from 'zod';
import { club } from '@/server/db/schema/club';
import { clubIdSchema } from '../baseSchemas';

export const tagReplaceSchema = z.object({
  oldTag: z.string(),
  newTag: z.string(),
});

export const changeClubStatusSchema = clubIdSchema.extend({
  status: z.enum(club.approved.enumValues),
});
