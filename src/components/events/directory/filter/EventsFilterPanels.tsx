'use client';

import Divider from '@mui/material/Divider';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { EventFiltersSchema, eventFiltersSchema } from '@src/utils/eventFilter';
import { useStable } from '@src/utils/useStable';
import DatePanel from './panels/Date';
import FiltersPanel from './panels/Filters';
import LocationPanel from './panels/Location';
import TagsPanel from './panels/Tags';
import { FilterPanelBaseProps } from './utils';

type EventsFilterPanelsProps = {
  backgroundHover?: boolean;
};

export default function EventsFilterPanels({
  backgroundHover = false,
}: EventsFilterPanelsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = eventFiltersSchema.parse(Object.fromEntries(searchParams));

  const filterPanelBaseProps: FilterPanelBaseProps = {
    backgroundHover,
    pathname,
  };

  const locationStable = useStable(filters.location);
  const locationExcludeStable = useStable(filters.locationExclude);

  /**
   * Utility function to memoize the filters array, but only allow re-calculations when specific fields change
   * @param fields An array containing specific fields of {@linkcode filters} that should trigger re-renders
   * @returns Selectively memoized filter object, typed to include only fields specified in {@linkcode fields}
   *
   * NOTE: Returned fields are not stabilized. If you need to stabilize a field, don't use this hook and see alternative below:
   * @example <caption>Alternative: Do this instead to stabilize fields</caption>
   * const fieldStable = useStable(filters.field);
   * const filtersProp = useMemo(() => ({ field: fieldStable }), [fieldStable]);
   */
  const useFilterFieldsMemo = <F extends (keyof EventFiltersSchema)[]>(
    fields: F,
  ): Pick<EventFiltersSchema, F[number]> => {
    return useMemo(
      () => filters,
      // The point of this hook is to selectively memoize the filters object, so we need to calculate deps
      // eslint-disable-next-line react-hooks/exhaustive-deps
      fields.map((field) => filters[field]),
    );
  };

  return (
    <div className="flex flex-col">
      {[
        <FiltersPanel
          key="filters"
          {...filterPanelBaseProps}
          filters={useFilterFieldsMemo(['clubs', 'hideRegistered', 'past'])}
        />,
        <TagsPanel
          key="tags"
          {...filterPanelBaseProps}
          filters={useFilterFieldsMemo(['tags'])}
        />,
        <DatePanel
          key="date"
          {...filterPanelBaseProps}
          filters={useFilterFieldsMemo(['date', 'dateStart', 'dateEnd'])}
        />,
        <LocationPanel
          key="location"
          {...filterPanelBaseProps}
          filters={useMemo(
            () => ({
              location: locationStable,
              locationExclude: locationExcludeStable,
            }),
            [locationStable, locationExcludeStable],
          )}
        />,
      ].flatMap((item, index) => {
        return index > 0
          ? [<Divider key={`divider-${index}`} variant="middle" />, item]
          : [item];
      })}
    </div>
  );
}
