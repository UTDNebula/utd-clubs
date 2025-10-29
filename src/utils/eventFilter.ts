import { parseJSON, startOfToday } from 'date-fns';
import { z } from 'zod';

export const order = [
  'soon',
  'later',
  'shortest duration',
  'longest duration',
] as const;
export const eventParamsSchema = z.object({
  date: z
    .string()
    .default('')
    .transform((s) => parseJSON(decodeURIComponent(s)))
    .pipe(z.date())
    .catch(startOfToday()),
});

export type eventParamsSchema = z.infer<typeof eventParamsSchema>;
