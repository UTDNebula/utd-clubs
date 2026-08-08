import { z } from 'zod';
import { insertUserMetadata } from '@/server/db/models';

export const updateByIdSchema = z.object({
  updateUser: insertUserMetadata.partial().omit({ id: true }),
  clubs: z.string().array().optional(),
});

export const nameOrEmailSchema = z.object({
  search: z.string().default(''),
});
