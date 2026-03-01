import { TZDateMini } from '@date-fns/tz';
import { format, startOfDay } from 'date-fns';
import { z } from 'zod';

type searchParamValue = string | string[] | undefined;

const preprocessParamNum = (input: searchParamValue) => {
  const num = Number(input);
  return isNaN(num) ? undefined : num;
};

/**
 * Defers to default value (by returning undefined) if input is not provided.
 * Only returns false if input is explicitly "false"
 * - Therefore, will return true if input is an empty string (i.e. not including a value for the search param)
 */
const preprocessParamBoolean = (input: searchParamValue) => {
  return input === undefined ? undefined : !(input === 'false');
};

/**
 * @param input Either a string of items delimited with commas, or an array of strings delimited with commas
 * @returns An array of all the items
 */
const preprocessParamArray = (input: searchParamValue) => {
  if (typeof input === 'string') {
    return input.split(',');
  } else {
    return input?.flatMap((ele) => ele.split(','));
  }
};

export const order = z.enum([
  'soon',
  'later',
  'shortest duration',
  'longest duration',
]);

export const sortEnum = z.enum(['upcoming', 'updated']);

export const eventClubsFilterEnum = z.enum(['all', 'following', 'new']);

export const eventLocationFilterEnum = z.enum([
  'on-campus',
  'off-campus',
  'online',
  'hybrid',
]);

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .default(format(startOfDay(TZDateMini.tz('America/Chicago')), 'yyyy-MM-dd'))
  .catch(format(startOfDay(TZDateMini.tz('America/Chicago')), 'yyyy-MM-dd'));

export const eventParamsSchemaLegacy = z.object({
  date: dateSchema,
});

export const eventParamsSchema = z.object({
  q: z.string().optional(),
  date: dateSchema,
  s: sortEnum.default('upcoming').catch('upcoming'),
  page: z.preprocess(preprocessParamNum, z.int().min(1).default(1).catch(1)),
  size: z.preprocess(preprocessParamNum, z.int().min(1).default(20).catch(20)),
  clubs: eventClubsFilterEnum.default('all').catch('all'),
  hideRegistered: z.preprocess(
    preprocessParamBoolean,
    z.boolean().default(false),
  ),
  past: z.preprocess(preprocessParamBoolean, z.boolean().default(false)),
  tags: z.array(z.string()).optional(),
  location: z.preprocess(
    preprocessParamArray,
    eventLocationFilterEnum.array().optional().default([]).catch([]),
  ),
});

export type EventParamsSchema = z.infer<typeof eventParamsSchema>;

export const eventFiltersSchema = eventParamsSchema.transform(
  ({ q, s, ...rest }) => ({
    query: q,
    sort: s,
    ...rest,
  }),
);

export type EventFiltersSchema = z.infer<typeof eventFiltersSchema>;
