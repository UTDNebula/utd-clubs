import { parseISO } from 'date-fns';
import { z } from 'zod';
import { dateSchema } from '@/lib/utils/commonSchemas';
import {
  preprocessParamArray,
  preprocessParamBoolean,
  preprocessParamNum,
} from '@/lib/utils/preprocessors';

///////////////////////////////////////////////////////////////////////////////
// Enums
///////////////////////////////////////////////////////////////////////////////

export const sortEnum = z.enum(['upcoming', 'updated']);

export const eventClubsFilterEnum = z.enum(['all', 'following', 'new']);

export const temporalDeixisFilterEnum = z.enum([
  'today',
  'tomorrow',
  'this weekend',
  'this week',
  'this month',
]);

/** Sentinel value to indicate a custom date */
export const temporalDeixisCustomDateSentinelValue = 'custom';

export const temporalDeixisWithCustomFilterEnum = z.enum([
  ...temporalDeixisFilterEnum.options,
  temporalDeixisCustomDateSentinelValue,
] as const);

export const temporalDeixisStrings: Record<
  (typeof temporalDeixisWithCustomFilterEnum.options)[number],
  string
> = {
  today: 'Today',
  tomorrow: 'Tomorrow',
  'this weekend': 'This weekend',
  'this week': 'This week',
  'this month': 'This month',
  custom: 'Custom date',
};

export const eventLocationFilterEnum = z.enum([
  'on-campus',
  'off-campus',
  'online',
  'hybrid',
]);

export const eventLocationStrings: Record<
  (typeof eventLocationFilterEnum.options)[number],
  string
> = {
  'on-campus': 'On-Campus',
  'off-campus': 'Off-Campus',
  online: 'Online',
  hybrid: 'Hybrid',
};

///////////////////////////////////////////////////////////////////////////////
// Schemas
///////////////////////////////////////////////////////////////////////////////

export const eventParamsSchema = z.object({
  q: z.string().optional(),
  s: sortEnum.default('upcoming').catch('upcoming'),
  page: z.preprocess(preprocessParamNum, z.int().min(1).default(1).catch(1)),
  size: z.preprocess(preprocessParamNum, z.int().min(1).default(20).catch(20)),
  clubs: eventClubsFilterEnum.default('all').catch('all'),
  hideRegistered: z.preprocess(
    preprocessParamBoolean,
    z.boolean().default(false),
  ),
  past: z.preprocess(preprocessParamBoolean, z.boolean().default(false)),
  tags: z.preprocess(
    preprocessParamArray,
    z.array(z.string()).default([]).catch([]),
  ),
  date: temporalDeixisWithCustomFilterEnum.optional().catch(undefined),
  dateStart: dateSchema.default(''),
  dateEnd: dateSchema.default(''),
  location: z.preprocess(
    preprocessParamArray,
    eventLocationFilterEnum.array().default([]).catch([]),
  ),
  'location!': z.preprocess(
    preprocessParamArray,
    eventLocationFilterEnum.array().default([]).catch([]),
  ),
});

export type EventParamsSchema = z.infer<typeof eventParamsSchema>;

export const eventFiltersSchema = z.object({
  query: z.string().optional(),
  sort: sortEnum.default('upcoming').catch('upcoming'),
  page: z.int().min(1).default(1).catch(1),
  size: z.int().min(1).default(20).catch(20),
  clubs: eventClubsFilterEnum.default('all').catch('all'),
  hideRegistered: z.boolean().default(false),
  past: z.boolean().default(false),
  tags: z.array(z.string()).default([]).catch([]),
  date: temporalDeixisWithCustomFilterEnum.optional().catch(undefined),
  dateStart: z.date().nullish(),
  dateEnd: z.date().nullish(),
  location: eventLocationFilterEnum.array().default([]).catch([]),
  locationExclude: eventLocationFilterEnum.array().default([]).catch([]),
});

export type EventFiltersSchema = z.infer<typeof eventFiltersSchema>;

export const eventParamsToFilters = eventParamsSchema
  .transform(
    ({
      q,
      s,
      date,
      dateStart,
      dateEnd,
      'location!': locationExclude,
      ...rest
    }): z.input<typeof eventFiltersSchema> => {
      return {
        query: q,
        sort: s,
        date:
          (dateStart && dateStart !== '') || (dateEnd && dateEnd !== '')
            ? temporalDeixisCustomDateSentinelValue
            : date,
        dateStart: dateStart && dateStart !== '' ? parseISO(dateStart) : null,
        dateEnd: dateEnd && dateEnd !== '' ? parseISO(dateEnd) : null,
        locationExclude,
        ...rest,
      };
    },
  )
  .pipe(eventFiltersSchema);

export const eventParamsDefaults = eventFiltersSchema.parse({});

export type EventParamsDefault = typeof eventParamsDefaults;

/** Matches only keys in an object that are an array type */
type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends unknown[] ? K : never;
}[keyof T];

/**
 * Fields (that are arrays) that should be split into individual items
 * Field must be an array type
 */
export const splitArrayFields = [
  'tags',
  'location',
  'locationExclude',
] satisfies ArrayKeys<EventFiltersSchema>[];

export type SplitArrayFields = (typeof splitArrayFields)[number];
