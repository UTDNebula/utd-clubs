'use client';

import Divider from '@mui/material/Divider';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { eventFiltersSchema } from '@src/utils/eventFilter';
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

  console.log('params', searchParams.get('location'));
  console.log('parsed', filters.location);

  const filterPanelBaseProps: FilterPanelBaseProps = {
    backgroundHover,
    pathname,
  };

  return (
    <div className="flex flex-col">
      {[
        <FiltersPanel
          key="filters"
          {...filterPanelBaseProps}
          filters={useMemo(
            () => ({
              clubs: filters.clubs,
              past: filters.past,
              hideRegistered: filters.hideRegistered,
            }),
            [filters.clubs, filters.hideRegistered, filters.past],
          )}
        />,
        <TagsPanel key="tags" {...filterPanelBaseProps} />,
        <DatePanel key="date" {...filterPanelBaseProps} />,
        <LocationPanel
          key="location"
          {...filterPanelBaseProps}
          filters={useMemo(
            () => ({
              location: filters.location,
            }),
            [filters.location],
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
