import { z } from 'zod';
import { eventFiltersSchema } from '@/systems/events/directory/filter/schema';
import { clubIdSchema } from '../baseSchemas';
import {
  createEventSchema,
  editEventSchema,
} from '@/systems/events/create/schema';
import { dateSchema } from '@/common/utils/schemas';

////////////////////////////////////////////////////////////////////////////////
// Public Router
////////////////////////////////////////////////////////////////////////////////

export const byClubIdSchema = clubIdSchema.extend({
  currentTime: z.optional(z.date()),
  sortByDate: z.boolean().default(false),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  includePast: z.boolean().optional().default(false),
});

export const countSchema = z.object({
  clubId: clubIdSchema.shape.clubId.optional(),
  /**
   * Whether to include past events.
   */
  includePast: z.boolean().default(false),
  /**
   * Whether to include events farther than a year out.
   */
  includeAll: z.boolean().default(false),
  currentTime: z.date().optional(),
});

export const clubUpcomingEventsSchema = clubIdSchema.extend({
  currentTime: z.date().optional(),
});

export const byDateRangeSchema = z.object({
  startTime: z.date().optional(),
  endTime: z.date().optional(),
});

export const findByFilterSchema = z.object({
  filters: eventFiltersSchema,
});

export const findByDateSchema = z.object({
  date: dateSchema,
});

export const byNameSchema = z.object({
  name: z.string().default(''),
  sortByDate: z.boolean().default(false),
});

////////////////////////////////////////////////////////////////////////////////
// Manage Router
////////////////////////////////////////////////////////////////////////////////

export const createSchema = createEventSchema;

export const editSchema = editEventSchema;

export const disableSyncSchema = clubIdSchema.extend({
  keepPastEvents: z.boolean().default(true).optional(),
});
