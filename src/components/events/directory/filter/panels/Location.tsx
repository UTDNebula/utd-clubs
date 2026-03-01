import { memo, useState } from 'react';
import z from 'zod';
import Panel from '@src/components/common/Panel';
import {
  EventFiltersSchema,
  eventLocationFilterEnum,
} from '@src/utils/eventFilter';
import FilterList, { FilterListItem } from '../FilterList';
import { FilterPanelProps, navigateWithParams, panelProps } from '../utils';

export type LocationPanelFields = Pick<EventFiltersSchema, 'location'>;

export default memo(function LocationPanel(
  props: FilterPanelProps<LocationPanelFields>,
) {
  const pathname = props.pathname;

  const [location, setLocation] = useState<string[]>(props.filters.location);
  const [locationExclude, setLocationExclude] = useState<string[]>([]);

  return (
    <Panel heading="Location" {...panelProps(props.backgroundHover)}>
      <FilterList
        options={
          [
            { label: 'On-Campus', value: 'on-campus' },
            { label: 'Off-Campus', value: 'off-campus' },
            { label: 'Online', value: 'online' },
            { label: 'Hybrid', value: 'hybrid' },
          ] satisfies FilterListItem<z.infer<typeof eventLocationFilterEnum>>[]
        }
        type="checkbox"
        enableExclusion
        selectedValues={location}
        excludedValues={locationExclude}
        onChange={(newSelectedValues, newExcludedValues) => {
          setLocation(newSelectedValues);
          setLocationExclude(newExcludedValues);

          const params = new URLSearchParams(window.location.search);
          if (newSelectedValues.length) {
            params.set('location', newSelectedValues.join(','));
          } else {
            params.delete('location');
          }
          navigateWithParams(pathname, params);
        }}
      />
    </Panel>
  );
});
