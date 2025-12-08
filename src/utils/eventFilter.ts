import { format, startOfToday } from 'date-fns';
import { z } from 'zod';

export const order = z.enum([
  'soon',
  'later',
  'shortest duration',
  'longest duration',
]);
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .default(format(startOfToday(), 'yyyy-MM-dd'))
  .catch(format(startOfToday(), 'yyyy-MM-dd'));
export const eventParamsSchema = z.object({
  date: dateSchema,
});

export type eventParamsSchema = z.infer<typeof eventParamsSchema>;
