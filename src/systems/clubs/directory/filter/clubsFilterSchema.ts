import { z } from 'zod';
import {
  preprocessParamArray,
  preprocessParamNum,
} from '@/lib/utils/preprocessors';

///////////////////////////////////////////////////////////////////////////////
// Enums
///////////////////////////////////////////////////////////////////////////////

export const clubSortEnum = z.enum([
  'trending',
  'relevant',
  'new',
  'alphabetical',
]);

export const clubSortStrings: Record<
  (typeof clubSortEnum.options)[number],
  string
> = {
  trending: 'Trending',
  relevant: 'Relevant',
  new: 'New',
  alphabetical: 'Alphabetical',
};

///////////////////////////////////////////////////////////////////////////////
// Schemas
///////////////////////////////////////////////////////////////////////////////

/** Parses and coerces raw URL search query parameters */
export const clubParamsSchema = z.object({
  q: z.string().optional(),
  sort: clubSortEnum.default('trending').catch('trending'),
  page: z.preprocess(preprocessParamNum, z.int().min(1).default(1).catch(1)),
  size: z.preprocess(preprocessParamNum, z.int().min(1).default(20).catch(20)),
  tags: z.preprocess(
    preprocessParamArray,
    z.array(z.string()).default([]).catch([]),
  ),
});

export type ClubParamsSchema = z.infer<typeof clubParamsSchema>;

/** Internal schema representing validated filter state */
export const clubFiltersSchema = z.object({
  query: z.string().optional(),
  sort: clubSortEnum.default('trending').catch('trending'),
  page: z.int().min(1).default(1).catch(1),
  size: z.int().min(1).default(20).catch(20),
  tags: z.array(z.string()).default([]).catch([]),
});

export type ClubFiltersSchema = z.infer<typeof clubFiltersSchema>;

/** Pipeline transforming raw URL params into the internal filter shape */
export const clubParamsToFilters = clubParamsSchema
  .transform(({ q, ...rest }): z.input<typeof clubFiltersSchema> => {
    return {
      query: q,
      ...rest,
    };
  })
  .pipe(clubFiltersSchema);

export const clubParamsDefaults = clubFiltersSchema.parse({});

export type ClubParamsDefault = typeof clubParamsDefaults;

/** Utility type to extract keys from an object that store array values */
type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends unknown[] ? K : never;
}[keyof T];

/** Array fields that require custom handling when serializing back to URL params */
export const splitArrayFields = [
  'tags',
] satisfies ArrayKeys<ClubFiltersSchema>[];

export type SplitArrayFields = (typeof splitArrayFields)[number];
