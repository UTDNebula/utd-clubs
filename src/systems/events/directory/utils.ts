import compare from '@/common/utils/compare';
import {
  EventFiltersSchema,
  EventParamsSchema,
  splitArrayFields,
  eventParamsDefaults,
  SplitArrayFields,
} from './schema';

///////////////////////////////////////////////////////////////////////////////
// Types
///////////////////////////////////////////////////////////////////////////////

/**
 * Maps EventFiltersSchema to the result of Object.entries()
 */
type EventFiltersSchemaEntries = {
  [K in keyof EventFiltersSchema]: [K, EventFiltersSchema[K]];
}[keyof EventFiltersSchema][];

type FieldAndValue<K, V> = {
  field: K;
  value: V;
};

export const filterFieldToParam: Record<
  keyof EventFiltersSchema,
  keyof EventParamsSchema
> = {
  page: 'page',
  date: 'date',
  size: 'size',
  clubs: 'clubs',
  hideRegistered: 'hideRegistered',
  past: 'past',
  tags: 'tags',
  sort: 's',
  dateStart: 'dateStart',
  dateEnd: 'dateEnd',
  location: 'location',
  query: 'q',
  locationExclude: 'location!',
};

/**
 * Whether {@linkcode field} is an array field that is designated as being split
 */
export function splitArrayField(field: keyof EventFiltersSchema): boolean {
  return splitArrayFields.some((splitField) => splitField.includes(field));
}

export function listSelectedEventFilters(filters: EventFiltersSchema) {
  const entries = (Object.entries(filters) as EventFiltersSchemaEntries).filter(
    (e) => e !== undefined,
  );

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
    [F in keyof EventFiltersSchema]-?: F extends SplitArrayFields
      ? // then if field's value is an array...
        EventFiltersSchema[F] extends infer V
        ? V extends Array<infer U>
          ? // then return field and value object where value is the array's type
            FieldAndValue<F, U>
          : // then return field and value object
            FieldAndValue<F, EventFiltersSchema[F]>
        : never
      : // then return field and value object
        FieldAndValue<F, EventFiltersSchema[F]>;
  }[keyof EventFiltersSchema][];

  return selectedItems;
}

export type SelectedEventFiltersList = ReturnType<
  typeof listSelectedEventFilters
>;
