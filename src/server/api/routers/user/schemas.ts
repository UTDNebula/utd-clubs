import { z } from 'zod';
import { insertUserMetadata } from '@/server/db/models';

export const byIdSchema = z.object({ id: z.string() });

export const updateByIdSchema = z.object({
  updateUser: insertUserMetadata.partial().omit({ id: true }),
  clubs: z.string().array().optional(),
});
export const nameOrEmailSchema = z.object({
  search: z.string().default(''),
});

export const eventsSortSchema = z.object({
  currentTime: z.optional(z.date()),
  sortByDate: z.boolean().default(false),
});

export const joinedClubEventsSchema = z.object({
  currentTime: z.optional(z.date()),
  sortByDate: z.boolean().default(false),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
});

export const getByRangeSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});
