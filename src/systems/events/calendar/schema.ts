import { z } from 'zod';

export const calendarParamsSchema = z.object({
  view: z.enum(['Day', 'Week', 'Month']).optional(),
  anchor: z
    .codec(z.iso.date(), z.date(), {
      decode: (isoString) => new Date(isoString + 'T12:00:00Z'),
      encode: (dateObj) => dateObj.toISOString(),
    })
    .optional(),
});

export type CalendarParamsSchema = z.infer<typeof calendarParamsSchema>;
