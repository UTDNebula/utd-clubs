import { TZDateMini } from '@date-fns/tz';
import { format, startOfDay } from 'date-fns';
import { z } from 'zod';

export const order = [
  'soon',
  'later',
  'shortest duration',
  'longest duration',
] as const;
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .default(format(startOfDay(TZDateMini.tz('America/Chicago')), 'yyyy-MM-dd'))
  .catch(format(startOfDay(TZDateMini.tz('America/Chicago')), 'yyyy-MM-dd'));
export const eventParamsSchema = z.object({
  date: dateSchema,
});

export type eventParamsSchema = z.infer<typeof eventParamsSchema>;
