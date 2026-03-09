'use client';

import Divider from '@mui/material/Divider';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { EventFiltersSchema } from '@src/utils/eventFilter';
import { useStable } from '@src/utils/useStable';
import DatePanel from './panels/Date';
import FiltersPanel from './panels/Filters';
import LocationPanel from './panels/Location';
import TagsPanel from './panels/Tags';
import { FilterPanelBaseProps } from './utils';

type EventsFilterPanelsProps = {
  backgroundHover?: boolean;
  filters: EventFiltersSchema;
};

export default function EventsFilterPanels({
  backgroundHover = false,
  filters,
}: EventsFilterPanelsProps) {
  const pathname = usePathname();

  const filterPanelBaseProps: FilterPanelBaseProps = {
    backgroundHover,
    pathname,
  };

  const tagsStable = useStable(filters.tags);

  const locationStable = useStable(filters.location);
  const locationExcludeStable = useStable(filters.locationExclude);

  /**
   * Utility function to memoize the filters array, but only allow re-calculations when specific fields change
   * @param fields An array containing specific fields of {@linkcode filters} that should trigger re-renders
   * @param manualDeps Optional object for manually inputting dependencies, rather than using {@linkcode fields}
   *                   Fields present here should be omitted from {@linkcode fields}
   * @returns Selectively memoized filter object, typed to include only fields specified in {@linkcode fields}
   *
   * NOTE: Returned fields are not stabilized. If you need to stabilize a field, manually input them into {@linkcode manualDeps}:
   * @example <caption>Using `manualDeps` to stabilize fields</caption>
   * const fieldStable = useStable(filters.field);
   * useFilterFieldsMemo([], { field: fieldStable })
   */
  const useFilterFieldsMemo = <
    F extends (keyof EventFiltersSchema)[],
    M extends keyof EventFiltersSchema,
  >(
    fields: F,
    manualDeps?: {
      [K in M]: Record<K, EventFiltersSchema[K]>;
    }[M],
  ): Pick<EventFiltersSchema, F[number] | M> => {
    return useMemo(
      () => ({ ...filters, ...manualDeps }),
      // The point of this hook is to selectively memoize the filters object, so we need to calculate deps
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ...fields.map((field) => filters[field]),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ...Object.values(manualDeps ?? {}),
      ],
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
          filters={useFilterFieldsMemo([], { tags: tagsStable })}
        />,
        <DatePanel
          key="date"
          {...filterPanelBaseProps}
          filters={useFilterFieldsMemo(['date', 'dateStart', 'dateEnd'])}
        />,
        <LocationPanel
          key="location"
          {...filterPanelBaseProps}
          filters={useFilterFieldsMemo([], {
            location: locationStable,
            locationExclude: locationExcludeStable,
          })}
        />,
      ].flatMap((item, index) => {
        return index > 0
          ? [<Divider key={`divider-${index}`} variant="middle" />, item]
          : [item];
      })}
    </div>
  );
}
