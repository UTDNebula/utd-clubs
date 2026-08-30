import { z } from 'zod';
import { dateSchema } from '@/lib/utils/commonSchemas';
import {
  createEventSchema,
  editEventSchema,
} from '@/systems/events/create/createEventSchema';
import { eventFiltersSchema } from '@/systems/events/directory/filter/eventsFilterSchema';
import { clubIdSchema } from '../baseSchemas';

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

export const findByDateRangeSchema = z.object({
  /** If omitted, includes all events from past */
  dateStart: z.date().optional(),
  /** If omitted, includes all events into future */
  dateEnd: z.date().optional(),
  /** Whether to include events from the user's clubs */
  includeUserEvents: z.boolean().default(false).optional(),
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
