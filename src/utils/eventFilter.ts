import { TZDateMini } from '@date-fns/tz';
import { format, parseISO, startOfDay } from 'date-fns';
import { z } from 'zod';

///////////////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////////////

type searchParamValue = string | string[] | undefined;

type EventFiltersSchemaEntries = {
  [K in keyof EventFiltersSchema]: [K, EventFiltersSchema[K]];
}[keyof EventFiltersSchema][];

type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends unknown[] ? K : never;
}[keyof T];

type FieldAndValue<K, V> = {
  field: K;
  value: V;
};

///////////////////////////////////////////////////////////////////////////////
// Param Preprocessors
///////////////////////////////////////////////////////////////////////////////

/**
 * Defers to default value if input is not a valid number
 */
const preprocessParamNum = (input: searchParamValue) => {
  const num = Number(input);
  return isNaN(num) ? undefined : num;
};

/**
 * Defers to default value (by returning undefined) if input is not provided.
 * Only returns false if input is explicitly "false". Therefore,this  will
 * return true if input is an empty string (i.e. not including a value for
 * the search param)
 */
const preprocessParamBoolean = (input: searchParamValue) => {
  return input === undefined ? undefined : !(input === 'false');
};

/**
 * @param input Either a string of items delimited with commas, or an array of
 *              strings delimited with commas
 * @returns An array of all the items
 */
const preprocessParamArray = (input: searchParamValue) => {
  if (typeof input === 'string') {
    return input.split(',');
  } else {
    return input?.flatMap((ele) => ele.split(','));
  }
};

///////////////////////////////////////////////////////////////////////////////
// Enums
///////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated
 */
export const order = z.enum([
  'soon',
  'later',
  'shortest duration',
  'longest duration',
]);

export const sortEnum = z.enum(['upcoming', 'updated']);

export const eventClubsFilterEnum = z.enum(['all', 'following', 'new']);

export const temporalDeixisFilterEnum = z.enum([
  'today',
  'tomorrow',
  'this weekend',
  'this week',
  'this month',
]);

/**
 * Sentinel value to indicate a custom date
 */
export const temporalDeixisCustomDateSentinelValue = 'custom';

export const temporalDeixisWithCustomFilterEnum = z.enum([
  ...temporalDeixisFilterEnum.options,
  temporalDeixisCustomDateSentinelValue,
] as const);

/**
 * @deprecated
 */
export const dateSchemaLegacy = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .default(format(startOfDay(TZDateMini.tz('America/Chicago')), 'yyyy-MM-dd'))
  .catch(format(startOfDay(TZDateMini.tz('America/Chicago')), 'yyyy-MM-dd'));

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const eventLocationFilterEnum = z.enum([
  'on-campus',
  'off-campus',
  'online',
  'hybrid',
]);

///////////////////////////////////////////////////////////////////////////////
// Schemas
///////////////////////////////////////////////////////////////////////////////

/**
 * @deprecated
 */
export const eventParamsSchemaLegacy = z.object({
  date: dateSchemaLegacy,
});

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

export const eventFiltersSchema = eventParamsSchema.transform(
  ({
    q,
    s,
    date,
    dateStart,
    dateEnd,
    'location!': locationExclude,
    ...rest
  }) => {
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
);

export type EventFiltersSchema = z.infer<typeof eventFiltersSchema>;

export const eventParamsDefaults = eventFiltersSchema.parse({});

export type EventParamsDefault = typeof eventParamsDefaults;

/**
 * Fields (that are arrays) that should be split into individual items
 * Field must be an array type
 */
export const splitArrayFields = [
  'tags',
] satisfies ArrayKeys<EventFiltersSchema>[];

export type SplitArrayFields = (typeof splitArrayFields)[number];

///////////////////////////////////////////////////////////////////////////////
// Utility Functions
///////////////////////////////////////////////////////////////////////////////

/**
 * Whether {@linkcode field} is an array field that is designated as being split
 */
export function splitArrayField(field: keyof EventFiltersSchema): boolean {
  return splitArrayFields.some((splitField) => splitField.includes(field));
}

export function listSelectedEventFilters(filters: EventFiltersSchema) {
  const entries = Object.entries(filters) as EventFiltersSchemaEntries;

  const selectedItems = entries.flatMap(([field, value]) => {
    // If field's value is an array and the field is allowed to be split according to
    // to splitArrayFields, then return multiple items corresponding to the field's values
    if (splitArrayField(field) && Array.isArray(value)) {
      return value.map((v) => ({ field, value: v }));
    }

    // Return item if it isn't the default value
    if (!compare(value, eventParamsDefaults[field])) {
      return { field, value };
    }

    // Skip item (i.e. unselected)
    return [];
  }) as {
    // If field is an array and allowed to be split according to SplitArrayFields...
    [F in keyof EventFiltersSchema]: F extends SplitArrayFields
      ? // then if field's value is an array...
        EventFiltersSchema[F] extends Array<infer U>
        ? // then return field and value object where value is the array's type
          FieldAndValue<F, U>
        : // then return field and value object
          FieldAndValue<F, EventFiltersSchema[F]>
      : // then return field and value object
        FieldAndValue<F, EventFiltersSchema[F]>;
  }[keyof EventFiltersSchema][];

  return selectedItems;
}

export type SelectedEventFiltersList = ReturnType<
  typeof listSelectedEventFilters
>;

function compare<T>(val1: T, val2: T) {
  if (val1 === val2) return true;

  // Null or non-object types
  if (
    val1 === null ||
    typeof val1 !== 'object' ||
    val2 === null ||
    typeof val2 !== 'object'
  ) {
    return false;
  }

  // Dates
  if (val1 instanceof Date && val2 instanceof Date) {
    return val1.getTime() === val2.getTime();
  }

  // Arrays
  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length) return false;
    for (let i = 0; i < val1.length; i++) {
      if (!compare(val1, val2)) return false;
    }
    return true;
  }

  return false;
}
